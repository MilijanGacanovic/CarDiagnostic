'use client'

import { useState } from 'react'

export default function StripePayment() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

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

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    // Open Stripe demo payment page in a new tab
    window.open('https://stripe-payments-demo.appspot.com/', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <div className="inline-block p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-4">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Plan</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Select the perfect diagnostic plan for your needs. All plans include access to our AI-powered chat assistant.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
              Select Plan
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600">
          All plans include a 14-day free trial. No credit card required to start.
        </p>
      </div>
    </div>
  )
}
