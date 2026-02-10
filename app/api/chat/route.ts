import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  // Check if API key is available at startup
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('GEMINI_API_KEY_MISSING')
    return NextResponse.json(
      { error: 'Missing GEMINI_API_KEY' },
      { status: 500 }
    )
  }

  try {
    // Safely parse request body
    let body
    try {
      body = await request.json()
    } catch (_) {
      console.error('JSON_PARSE_ERROR')
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { message, chatHistory } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Define message type for better type safety
    type ChatMessage = {
      role: 'user' | 'assistant'
      content: string
    }

    try {
      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(apiKey)
      
      const systemInstruction = `You are an experienced automotive mechanic and diagnostic specialist.

Style rules:
- Respond in plain text only
- Do not use Markdown formatting (no **, ###, bullets, or numbered lists)
- Do not introduce yourself or repeat your name/role unless the user explicitly asks who you are
- Provide clear, concise, and complete responses
- Keep responses focused and under 300 words while ensuring all important information is included
- Break down complex explanations into digestible points using simple paragraphs`
      
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction,
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      })

      // Build history for chat session from chatHistory array
      // Convert chatHistory format to Gemini's expected format
      let processedHistory: ChatMessage[] = []
      
      if (chatHistory && Array.isArray(chatHistory)) {
        // Drop any leading non-user messages
        let firstUserIndex = chatHistory.findIndex((msg: ChatMessage) => msg.role === 'user')
        if (firstUserIndex === -1) {
          // No user messages in history, use empty history
          processedHistory = []
        } else {
          // Take messages from first user message onwards
          processedHistory = chatHistory.slice(firstUserIndex)
        }
        
        // Truncate to last 10 turns (20 messages: 10 user + 10 assistant)
        if (processedHistory.length > 20) {
          processedHistory = processedHistory.slice(-20)
          
          // Ensure truncated history still starts with a user message
          const firstUserAfterTruncate = processedHistory.findIndex((msg: ChatMessage) => msg.role === 'user')
          if (firstUserAfterTruncate > 0) {
            processedHistory = processedHistory.slice(firstUserAfterTruncate)
          }
        }
      }
      
      // Map to Gemini's expected format
      const history = processedHistory.map((msg: ChatMessage) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }))

      // Start chat with history
      const chat = model.startChat({
        history: history,
      })

      // Send the new message
      const result = await chat.sendMessage(message)
      const response = await result.response
      const text = response.text()

      return NextResponse.json({
        response: text
      })
    } catch (geminiError: any) {
      // Extract and sanitize error information for logging
      const errorMessage = geminiError?.message || String(geminiError)
      
      // Extract HTTP status if available
      let httpStatus: number | undefined
      let responseBody: any
      
      // Try to extract status from different possible error structures
      if (geminiError?.status) {
        httpStatus = geminiError.status
      } else if (geminiError?.response?.status) {
        httpStatus = geminiError.response.status
      } else if (geminiError?.statusCode) {
        httpStatus = geminiError.statusCode
      }
      
      // Try to extract response body
      if (geminiError?.response?.data) {
        responseBody = geminiError.response.data
      } else if (geminiError?.data) {
        responseBody = geminiError.data
      } else if (geminiError?.error) {
        responseBody = geminiError.error
      }
      
      // Sanitize response body - remove API keys and potentially sensitive data
      let sanitizedBody = responseBody
      if (responseBody && typeof responseBody === 'object') {
        sanitizedBody = JSON.parse(JSON.stringify(responseBody))
        // Remove common sensitive fields
        const sensitiveFields = ['apiKey', 'api_key', 'key', 'token', 'authorization', 'auth', 'password', 'secret']
        const removeSensitiveData = (obj: any): any => {
          if (typeof obj !== 'object' || obj === null) return obj
          
          for (const key in obj) {
            if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
              obj[key] = '[REDACTED]'
            } else if (typeof obj[key] === 'object') {
              removeSensitiveData(obj[key])
            }
          }
          return obj
        }
        sanitizedBody = removeSensitiveData(sanitizedBody)
      }
      
      // Log detailed error information for debugging
      console.error('GEMINI_API_ERROR:', {
        message: errorMessage.substring(0, 200),
        httpStatus,
        responseBody: sanitizedBody ? JSON.stringify(sanitizedBody).substring(0, 500) : undefined,
        errorType: geminiError?.constructor?.name,
      })
      
      // Rate limiting
      if (httpStatus === 429 || errorMessage.includes('429') || errorMessage.toLowerCase().includes('rate limit')) {
        return NextResponse.json(
          { 
            response: 'I\'m receiving too many requests right now. Please try again in a few moments.',
            error: 'Rate limited',
            details: httpStatus ? `HTTP ${httpStatus}` : undefined
          },
          { status: 429 }
        )
      }

      // Quota exceeded
      if (errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        return NextResponse.json(
          { 
            response: 'The AI service has reached its usage limit. Please try again later or contact support.',
            error: 'Quota exhausted',
            details: httpStatus ? `HTTP ${httpStatus}` : undefined
          },
          { status: 503 }
        )
      }

      // Invalid API key
      if (httpStatus === 401 || httpStatus === 403 || errorMessage.includes('API key') || errorMessage.includes('401') || errorMessage.includes('403')) {
        return NextResponse.json(
          { 
            response: 'I apologize, but the AI service is currently unavailable. Please contact support.',
            error: 'Service unavailable',
            details: httpStatus ? `HTTP ${httpStatus}` : undefined
          },
          { status: 503 }
        )
      }

      // Network or timeout errors
      if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('timeout')) {
        return NextResponse.json(
          { 
            response: 'I\'m having trouble connecting right now. Please check your internet connection and try again.',
            error: 'Network error',
            details: httpStatus ? `HTTP ${httpStatus}` : undefined
          },
          { status: 503 }
        )
      }

      // Generic Gemini error with more details
      return NextResponse.json(
        { 
          response: 'I apologize, but I encountered an issue processing your request. Please try again or rephrase your question.',
          error: 'Processing error',
          details: httpStatus ? `HTTP ${httpStatus}` : errorMessage.substring(0, 100)
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('CHAT_API_ERROR:', error instanceof Error ? error.message.substring(0, 100) : 'Unknown error')
    return NextResponse.json(
      { 
        response: 'I apologize, but something went wrong. Please try again.',
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
