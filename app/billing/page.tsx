'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function BillingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status')
        if (response.ok) {
          const data = await response.json()
          setIsLoggedIn(true)
          setUserEmail(data.email || null)
        } else {
          // Redirect to home if not logged in
          router.push('/')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setIsLoggedIn(false)
    setUserEmail(null)
    router.push('/')
  }

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    // Stripe integration will be added here
    alert(`Plan ${planId} selected. Stripe payment integration will be added.`)
  }

  const handleContinueFreeTrial = () => {
    router.push('/')
  }

  const plans = [
    {
      id: 'basic',
      name: 'Basic Diagnostic',
      price: '$9.99',
      period: 'month',
      features: [
        'Basic error code reading',
        'Simple diagnostics',
        'Email support',
        '5 scans per month'
      ]
    },
    {
      id: 'pro',
      name: 'Pro Diagnostic',
      price: '$29.99',
      period: 'month',
      features: [
        'Advanced error code reading',
        'Detailed diagnostics',
        'Priority support',
        'Unlimited scans',
        'Live data monitoring'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$99.99',
      period: 'month',
      features: [
        'All Pro features',
        'Fleet management',
        'API access',
        '24/7 phone support',
        'Custom integrations'
      ]
    }
  ]

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

      <main className="flex-grow bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          {/* Explanation Section */}
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-4">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Plan</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-2">
              Select the perfect diagnostic plan for your needs. All plans include access to our AI-powered chat assistant.
            </p>
            <p className="text-gray-500">
              Upgrade now to unlock advanced features, or continue with our free trial to explore the basics.
            </p>
          </div>

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-xl p-8 border-2 transition transform hover:scale-105 ${
                  plan.popular ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Subscribe with Stripe
                </button>
              </div>
            ))}
          </div>

          {/* Continue with Free Trial Button */}
          <div className="text-center">
            <button
              onClick={handleContinueFreeTrial}
              className="px-8 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              Continue with Free Trial
            </button>
            <p className="mt-4 text-gray-600 text-sm">
              All plans include a 14-day free trial. No credit card required to start.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
