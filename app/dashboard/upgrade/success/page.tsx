'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, Loader2, Sparkles } from 'lucide-react'

function UpgradeSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    if (!sessionId) {
      router.push('/dashboard')
      return
    }

    const checkPaymentStatus = async () => {
      try {
        const res = await fetch(`/api/payments/status/${sessionId}`, {
          credentials: 'include',
        })
        const data = await res.json()

        if (data.success) {
          if (data.data.status === 'COMPLETED' || data.data.paymentStatus === 'paid') {
            setStatus('success')
          } else if (data.data.status === 'EXPIRED' || data.data.status === 'FAILED') {
            setStatus('error')
          } else if (attempts < 5) {
            // Keep polling
            setTimeout(() => setAttempts(a => a + 1), 2000)
          } else {
            setStatus('error')
          }
        } else {
          setStatus('error')
        }
      } catch (err) {
        if (attempts < 5) {
          setTimeout(() => setAttempts(a => a + 1), 2000)
        } else {
          setStatus('error')
        }
      }
    }

    checkPaymentStatus()
  }, [sessionId, attempts, router])

  if (status === 'loading') {
    return (
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Confirming your payment...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">❌</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Issue</h1>
        <p className="text-gray-600 mb-6">
          There was a problem processing your payment. Please try again.
        </p>
        <Link
          href="/dashboard/upgrade"
          className="inline-block bg-accent-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-accent-600 transition-colors"
        >
          Try Again
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Pro! 🎉</h1>
      <p className="text-gray-600 mb-6">
        Your account has been upgraded. You now have access to all premium features.
      </p>
      <div className="space-y-3">
        <Link
          href="/dashboard/profile-editor"
          className="block w-full bg-accent-500 text-white py-3 rounded-xl font-semibold hover:bg-accent-600 transition-colors"
        >
          <Sparkles className="w-5 h-5 inline mr-2" />
          Customize Your Profile
        </Link>
        <Link
          href="/dashboard"
          className="block w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default function UpgradeSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-secondary-50 to-white px-4">
      <Suspense fallback={
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      }>
        <UpgradeSuccessContent />
      </Suspense>
    </div>
  )
}
