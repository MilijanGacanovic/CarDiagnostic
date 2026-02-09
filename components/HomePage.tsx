'use client'

import { useState, useEffect } from 'react'
import AuthForm from '@/components/AuthForm'
import ChatPrompt from '@/components/ChatPrompt'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in by checking for cookie
    // In a real app, you'd verify the session with an API call
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status')
        if (response.ok) {
          const data = await response.json()
          setIsLoggedIn(true)
          setUserEmail(data.email || null)
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogin = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Login failed')
    }

    setIsLoggedIn(true)
    setUserEmail(email)
  }

  const handleRegister = async (email: string, password: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Registration failed')
    }

    setIsLoggedIn(true)
    setUserEmail(email)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setIsLoggedIn(false)
    setUserEmail(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={isLoggedIn} userEmail={userEmail} onLogout={handleLogout} />

      <main className="flex-grow">
        {!isLoggedIn ? (
          <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 px-4 py-12">
            <div className="w-full max-w-6xl mx-auto">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                  Professional Car Diagnostics
                </h2>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                  Advanced AI-powered diagnostics to help you understand and fix your vehicle issues quickly and efficiently
                </p>
              </div>

              {/* Auth Form */}
              <AuthForm onLogin={handleLogin} onRegister={handleRegister} />
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Logged-in view with chatbot and upgrade link */}
            <section className="container mx-auto px-4 py-16 max-w-7xl">
              <ChatPrompt />
              
              {/* Upgrade Link */}
              <div className="mt-8 text-center">
                <Link
                  href="/billing"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  Upgrade to Premium
                </Link>
                <p className="mt-2 text-sm text-gray-600">
                  Unlock advanced features and unlimited diagnostics
                </p>
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
