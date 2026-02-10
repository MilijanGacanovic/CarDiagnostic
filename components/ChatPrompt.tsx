'use client'

import { useState } from 'react'
import { INITIAL_GREETING } from '@/lib/constants'

export default function ChatPrompt() {
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: INITIAL_GREETING
    }
  ])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const userMessage = message.trim()
    const newChatHistory = [...chatHistory, { role: 'user' as const, content: userMessage }]
    
    // Add user message and clear input immediately
    setChatHistory(newChatHistory)
    setMessage('')

    try {
      // Call the API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          chatHistory: newChatHistory
        }),
      })

      const data = await response.json()
      
      // Add assistant response
      if (data.response) {
        setChatHistory(prev => [...prev, {
          role: 'assistant',
          content: data.response
        }])
      } else {
        // Handle unexpected API response format
        setChatHistory(prev => [...prev, {
          role: 'assistant',
          content: 'I apologize, but I received an unexpected response. Please try again.'
        }])
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      // Add error message
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.'
      }])
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-white bg-opacity-20 rounded-full mr-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">AI Diagnostic Assistant</h3>
              <p className="text-blue-100">Ask questions about your car issues</p>
            </div>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-6 bg-gray-50">
          <div className="space-y-4">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-gray-200">
          <div className="flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your diagnostic question here..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h4 className="font-semibold text-gray-800">Quick Diagnostics</h4>
          </div>
          <p className="text-sm text-gray-600">Get instant answers to common car issues</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="font-semibold text-gray-800">Error Code Lookup</h4>
          </div>
          <p className="text-sm text-gray-600">Understand what those codes mean</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h4 className="font-semibold text-gray-800">Maintenance Tips</h4>
          </div>
          <p className="text-sm text-gray-600">Learn how to keep your car healthy</p>
        </div>
      </div>
    </div>
  )
}
