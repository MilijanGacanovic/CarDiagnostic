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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <main className="flex-grow">
        {!isLoggedIn ? (
          <>
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16">
              <div className="text-center mb-12">
                <h2 className="text-5xl font-extrabold text-gray-800 mb-4">
                  Professional Car Diagnostics
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Advanced AI-powered diagnostics to help you understand and fix your vehicle issues quickly and efficiently
                </p>
              </div>

              <AuthForm onLogin={handleLogin} onRegister={handleRegister} />
            </section>

            {/* Features Section */}
            <section className="bg-white py-16">
              <div className="container mx-auto px-4">
                <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
                  Why Choose CarDiagnostic?
                </h3>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center p-6">
                    <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                      <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">AI-Powered Analysis</h4>
                    <p className="text-gray-600">
                      Our advanced AI analyzes error codes and provides detailed explanations and solutions
                    </p>
                  </div>

                  <div className="text-center p-6">
                    <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                      <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">Instant Results</h4>
                    <p className="text-gray-600">
                      Get diagnostic results in seconds, not hours. Save time and money on repairs
                    </p>
                  </div>

                  <div className="text-center p-6">
                    <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
                      <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">Secure & Private</h4>
                    <p className="text-gray-600">
                      Your vehicle data is encrypted and never shared. Complete privacy guaranteed
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section className="container mx-auto px-4 py-16">
              <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
                How It Works
              </h3>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { step: 1, title: 'Sign Up', desc: 'Create your account in seconds' },
                  { step: 2, title: 'Choose Plan', desc: 'Select the plan that fits your needs' },
                  { step: 3, title: 'Connect Device', desc: 'Link your diagnostic tool' },
                  { step: 4, title: 'Get Insights', desc: 'Receive AI-powered diagnostics' }
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold rounded-full mb-4">
                      {item.step}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h4>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Logged-in view with payment and chat */}
            <section className="container mx-auto px-4 py-16">
              <StripePayment />
            </section>

            <section className="container mx-auto px-4 py-16">
              <ChatPrompt />
            </section>

            {/* Additional Info Section for logged-in users */}
            <section className="bg-white py-16">
              <div className="container mx-auto px-4">
                <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
                  What You Can Do
                </h3>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">Live Data Monitoring</h4>
                      <p className="text-gray-600">
                        Monitor your vehicle's performance in real-time with detailed sensor data and metrics
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 p-3 bg-green-100 rounded-lg">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">Diagnostic Reports</h4>
                      <p className="text-gray-600">
                        Generate comprehensive reports for your mechanic or personal records
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 p-3 bg-purple-100 rounded-lg">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">Alert Notifications</h4>
                      <p className="text-gray-600">
                        Receive instant alerts when critical issues are detected in your vehicle
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 p-3 bg-yellow-100 rounded-lg">
                      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">Maintenance Schedule</h4>
                      <p className="text-gray-600">
                        Keep track of maintenance tasks and get reminders for upcoming services
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
