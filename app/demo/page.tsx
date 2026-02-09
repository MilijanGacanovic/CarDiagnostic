'use client'

import ChatPrompt from '@/components/ChatPrompt'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function DemoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header isLoggedIn={true} userEmail="demo@example.com" onLogout={() => {}} />

      <main className="flex-grow">
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
      </main>

      <Footer />
    </div>
  )
}
