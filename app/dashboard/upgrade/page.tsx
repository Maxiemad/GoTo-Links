'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Loader2, Sparkles } from 'lucide-react'

export default function UpgradePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpgrade = async () => {
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          originUrl: window.location.origin,
        }),
      })

      const data = await res.json()

      if (data.success && data.data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.data.url
      } else {
        setError(data.error || 'Failed to create checkout session')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-accent-500">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-accent-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Upgrade to Pro</h1>
            <p className="text-gray-600">Unlock all premium features for your wellness profile</p>
          </div>

          <div className="mb-8">
            <div className="text-center mb-6">
              <span className="text-5xl font-bold text-primary-500">$19</span>
              <span className="text-gray-500 text-xl">/month</span>
            </div>

            <ul className="space-y-4">
              {[
                'Video hero backgrounds',
                'All 12 premium themes',
                'Advanced analytics dashboard',
                'Custom domain support',
                'Priority email support',
                'Remove GoToLinks branding',
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full bg-accent-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            data-testid="upgrade-btn"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Upgrade Now
              </>
            )}
          </button>

          <p className="text-center text-gray-500 text-sm mt-4">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  )
}
