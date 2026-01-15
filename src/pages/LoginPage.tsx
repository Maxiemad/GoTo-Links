import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { colors, typography, borderRadius } from '../styles/theme'

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Mock login
    if (email && password) {
      // Simulate API call
      setTimeout(() => {
        navigate('/dashboard')
      }, 500)
    } else {
      setError('Please enter both email and password')
    }
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
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

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

          <Button type="submit" variant="primary" size="lg" style={{ width: '100%' }}>
            Sign in
          </Button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: colors.text.secondary, fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: colors.primary[500], fontWeight: 600, textDecoration: 'none' }}>
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
            style={{ width: '100%' }}
            onClick={() => {
              // Mock Google login
              navigate('/dashboard')
            }}
          >
            <span style={{ marginRight: '0.5rem' }}>🔐</span>
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  )
}

