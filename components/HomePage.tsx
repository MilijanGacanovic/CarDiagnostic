'use client'

import { useState, useEffect } from 'react'
import AuthForm from '@/components/AuthForm'
import StripePayment from '@/components/StripePayment'
import ChatPrompt from '@/components/ChatPrompt'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in by checking for cookie
    // In a real app, you'd verify the session with an API call
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status')
        if (response.ok) {
          setIsLoggedIn(true)
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
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setIsLoggedIn(false)
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
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <main className="flex-grow">
        {!isLoggedIn ? (
          <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 px-4 py-12">
            <div className="w-full max-w-6xl mx-auto">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                  Professional Car Diagnostics
                </h1>
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
            {/* Logged-in view with payment and chat */}
            <section className="container mx-auto px-4 py-16 max-w-7xl">
              <StripePayment />
            </section>

            <section className="container mx-auto px-4 py-16 max-w-7xl">
              <ChatPrompt />
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
