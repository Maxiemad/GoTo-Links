'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { colors, typography, borderRadius } from '@/app/styles/theme'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await res.json()
      
      if (data.success) {
        router.push('/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    const redirectUrl = window.location.origin + '/callback'
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 100%)`,
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '450px',
          backgroundColor: colors.white,
          borderRadius: borderRadius['2xl'],
          padding: '3rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            className="gradient-text"
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              fontFamily: typography.fontFamily.sans,
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: colors.text.secondary }}>
            Sign in to your GoToLinks account
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: colors.text.primary }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                border: `2px solid ${colors.gray[300]}`,
                borderRadius: borderRadius.lg,
                backgroundColor: colors.white,
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: colors.text.primary }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                border: `2px solid ${colors.gray[300]}`,
                borderRadius: borderRadius.lg,
                backgroundColor: colors.white,
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: colors.error + '15',
                color: colors.error,
                borderRadius: borderRadius.md,
                fontSize: '0.875rem',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.875rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: colors.white,
              backgroundColor: colors.accent[500],
              border: 'none',
              borderRadius: borderRadius.xl,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: colors.text.secondary, fontSize: '0.875rem' }}>
            Don&apos;t have an account?{' '}
            <Link 
              href="/signup" 
              style={{ color: colors.primary[500], fontWeight: 600, textDecoration: 'none' }}
            >
              Sign up
            </Link>
          </p>
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: `1px solid ${colors.gray[200]}` }}>
          <button
            onClick={handleGoogleLogin}
            style={{
              width: '100%',
              padding: '0.875rem',
              fontSize: '1rem',
              fontWeight: 500,
              color: colors.text.primary,
              backgroundColor: colors.white,
              border: `2px solid ${colors.gray[300]}`,
              borderRadius: borderRadius.xl,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            🔐 Continue with Google
          </button>
        </div>
      </div>
    </div>
  )
}
