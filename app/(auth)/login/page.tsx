'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/components/Button'
import { Input } from '@/app/components/Input'
import { FloatingParticles, BreathingCircle, LotusElement } from '@/app/components/AnimationSystem'
import { colors, typography, borderRadius } from '@/app/styles/theme'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    setIsVisible(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
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
    }
  }

  const handleGoogleLogin = () => {
    const redirectUrl = window.location.origin + '/callback'
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`
  }

  return (
    <div
      className="login-page"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 100%)`,
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Gradient Background */}
      <div
        className="login-gradient-bg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 50%, ${colors.white} 100%)`,
          backgroundSize: '200% 200%',
          animation: prefersReducedMotion ? 'none' : 'gradientShift 25s ease-in-out infinite',
        }}
      />

      {/* Floating Particles */}
      <FloatingParticles count={25} intensity="medium" sacredGeometry={true} />

      {/* Breathing Circles */}
      <div style={{ position: 'absolute', top: '15%', left: '8%', zIndex: 0, opacity: 0.2, pointerEvents: 'none' }}>
        <BreathingCircle size={140} color={colors.primary[300]} duration={5} delay={0} />
      </div>
      <div style={{ position: 'absolute', bottom: '20%', right: '8%', zIndex: 0, opacity: 0.2, pointerEvents: 'none' }}>
        <BreathingCircle size={110} color={colors.secondary[300]} duration={6} delay={2} />
      </div>

      {/* Lotus Elements */}
      <div style={{ position: 'absolute', top: '25%', right: '12%', zIndex: 0, pointerEvents: 'none' }}>
        <LotusElement size={75} petals={8} color={colors.secondary[200]} />
      </div>
      <div style={{ position: 'absolute', bottom: '25%', left: '12%', zIndex: 0, pointerEvents: 'none' }}>
        <LotusElement size={65} petals={6} color={colors.primary[200]} />
      </div>

      {/* Form Card */}
      <div
        ref={formRef}
        className="login-form-card card-elegant"
        style={{
          width: '100%',
          maxWidth: '450px',
          backgroundColor: colors.white,
          borderRadius: borderRadius['2xl'],
          padding: '3rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0,0,0,0.04)',
          position: 'relative',
          zIndex: 10,
          opacity: isVisible || prefersReducedMotion ? 1 : 0,
          transform: isVisible || prefersReducedMotion ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
          transition: prefersReducedMotion ? 'none' : 'opacity 0.8s ease-out, transform 0.8s ease-out',
        }}
      >
        <div 
          style={{ 
            textAlign: 'center', 
            marginBottom: '2rem',
            opacity: isVisible || prefersReducedMotion ? 1 : 0,
            transform: isVisible || prefersReducedMotion ? 'translateY(0)' : 'translateY(20px)',
            transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s',
          }}
        >
          <h1
            className="gradient-text"
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: colors.text.primary,
              marginBottom: '0.5rem',
              fontFamily: typography.fontFamily.sans,
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: colors.text.secondary }}>Sign in to your GoToLinks account</p>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="login-form"
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem',
            opacity: isVisible || prefersReducedMotion ? 1 : 0,
            transform: isVisible || prefersReducedMotion ? 'translateY(0)' : 'translateY(20px)',
            transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-out 0.4s, transform 0.6s ease-out 0.4s',
          }}
        >
          <div className="stagger-item">
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="elegant-hover"
            />
          </div>
          <div className="stagger-item">
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="elegant-hover"
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
                animation: 'fadeSlideUp 0.4s ease-out',
              }}
            >
              {error}
            </div>
          )}

          <div className="stagger-item">
            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="button-elegant glow-effect ripple-effect"
              style={{ width: '100%' }}
            >
              Sign in
            </Button>
          </div>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: colors.text.secondary, fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link 
              href="/signup" 
              className="elegant-hover"
              style={{ 
                color: colors.primary[500], 
                fontWeight: 600, 
                textDecoration: 'none',
              }}
            >
              Sign up
            </Link>
          </p>
        </div>

        <div
          style={{
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: `1px solid ${colors.gray[200]}`,
          }}
        >
          <Button
            variant="outline"
            size="md"
            className="button-elegant"
            style={{ width: '100%' }}
            onClick={handleGoogleLogin}
          >
            <span style={{ marginRight: '0.5rem' }}>🔐</span>
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  )
}
