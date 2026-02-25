'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MessageSquare, Calendar, Mail, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface Suggestion {
  id: string
  email: string
  suggestion: string
  createdAt: string
}

// Wellness color palette
const colors = {
  primary: { 50: '#fdf8f6', 100: '#f2e8e5', 200: '#eaddd7', 300: '#e0cec7', 400: '#d2bab0', 500: '#bfa094' },
  secondary: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e' },
  accent: { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#eab308', 600: '#ca8a04' },
  gray: { 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937' },
  text: { primary: '#1f2937', secondary: '#6b7280' },
  background: '#fffbf7',
  white: '#ffffff',
}

export default function AdminFeedbackPage() {
  const router = useRouter()
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFeedback = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/admin/feedback', {
        credentials: 'include',
      })
      const data = await res.json()

      if (res.status === 403) {
        router.push('/dashboard')
        return
      }

      if (res.status === 401) {
        router.push('/login')
        return
      }

      if (data.success) {
        setSuggestions(data.data.suggestions)
      } else {
        setError(data.error || 'Failed to load feedback')
      }
    } catch (err) {
      setError('Failed to load feedback')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedback()
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchFeedback}
            className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <header 
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ 
          backgroundColor: 'rgba(255, 251, 247, 0.9)',
          borderBottom: `1px solid ${colors.gray[200]}`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <button
            onClick={fetchFeedback}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: colors.text.primary }}
          >
            Feature Suggestions
          </h1>
          <p style={{ color: colors.text.secondary }}>
            {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''} received
          </p>
        </div>

        {/* Suggestions Table */}
        {suggestions.length === 0 ? (
          <div 
            className="rounded-2xl p-12 text-center"
            style={{ 
              backgroundColor: colors.white,
              border: `1px solid ${colors.gray[200]}`,
            }}
          >
            <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2" style={{ color: colors.text.primary }}>
              No suggestions yet
            </p>
            <p style={{ color: colors.text.secondary }}>
              When users submit feature suggestions, they'll appear here.
            </p>
          </div>
        ) : (
          <div 
            className="rounded-2xl overflow-hidden"
            style={{ 
              backgroundColor: colors.white,
              border: `1px solid ${colors.gray[200]}`,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            }}
          >
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: colors.gray[100] }}>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold"
                    style={{ color: colors.text.secondary }}
                  >
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      User Email
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold"
                    style={{ color: colors.text.secondary }}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare size={16} />
                      Suggestion
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold"
                    style={{ color: colors.text.secondary }}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      Date
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map((suggestion, idx) => (
                  <tr 
                    key={suggestion.id}
                    className="hover:bg-gray-50 transition-colors"
                    style={{ 
                      borderBottom: idx < suggestions.length - 1 ? `1px solid ${colors.gray[200]}` : undefined 
                    }}
                  >
                    <td className="px-6 py-4">
                      <span 
                        className="text-sm font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        {suggestion.email}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <p 
                        className="text-sm whitespace-pre-wrap"
                        style={{ color: colors.text.primary }}
                      >
                        {suggestion.suggestion}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {formatDate(suggestion.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
