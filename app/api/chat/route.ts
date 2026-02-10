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

    try {
      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

      // Build conversation history for context
      const chat = model.startChat({
        history: chatHistory?.slice(0, -1).map((msg: { role: string; content: string }) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        })) || [],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      })

      // Send message and get response
      const result = await chat.sendMessage(message)
      const response = await result.response
      const text = response.text()

      return NextResponse.json({
        response: text
      })
    } catch (geminiError: any) {
      // Handle specific Gemini API errors
      const errorMessage = geminiError?.message || String(geminiError)
      
      // Rate limiting
      if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('rate limit')) {
        console.error('GEMINI_RATE_LIMITED')
        return NextResponse.json(
          { 
            response: 'I\'m receiving too many requests right now. Please try again in a few moments.',
            error: 'Rate limited'
          },
          { status: 429 }
        )
      }

      // Quota exceeded
      if (errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        console.error('GEMINI_QUOTA_EXHAUSTED')
        return NextResponse.json(
          { 
            response: 'The AI service has reached its usage limit. Please try again later or contact support.',
            error: 'Quota exhausted'
          },
          { status: 503 }
        )
      }

      // Invalid API key
      if (errorMessage.includes('API key') || errorMessage.includes('401') || errorMessage.includes('403')) {
        console.error('GEMINI_AUTH_FAILED')
        return NextResponse.json(
          { 
            response: 'I apologize, but the AI service is currently unavailable. Please contact support.',
            error: 'Service unavailable'
          },
          { status: 503 }
        )
      }

      // Network or timeout errors
      if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('timeout')) {
        console.error('GEMINI_NETWORK_ERROR')
        return NextResponse.json(
          { 
            response: 'I\'m having trouble connecting right now. Please check your internet connection and try again.',
            error: 'Network error'
          },
          { status: 503 }
        )
      }

      // Generic Gemini error
      console.error('GEMINI_ERROR:', errorMessage.substring(0, 100))
      return NextResponse.json(
        { 
          response: 'I apologize, but I encountered an issue processing your request. Please try again or rephrase your question.',
          error: 'Processing error'
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
