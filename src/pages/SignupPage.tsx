import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { FloatingParticles, BreathingCircle, LotusElement } from '../components/AnimationSystem'
import { colors, typography, borderRadius } from '../styles/theme'

export const SignupPage: React.FC = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    // Entrance animation
    setIsVisible(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Mock signup
    if (firstName && lastName && email && password) {
      // Simulate API call
      setTimeout(() => {
        navigate('/dashboard')
      }, 500)
    } else {
      setError('Please fill in all fields')
    }
  }

  return (
    <div
      className="signup-page"
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
        className="signup-gradient-bg"
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
      <FloatingParticles count={30} intensity="medium" sacredGeometry={true} />

      {/* Breathing Circles */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', zIndex: 0, opacity: 0.2, pointerEvents: 'none' }}>
        <BreathingCircle size={150} color={colors.primary[300]} duration={5} delay={0} />
      </div>
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', zIndex: 0, opacity: 0.2, pointerEvents: 'none' }}>
        <BreathingCircle size={120} color={colors.secondary[300]} duration={6} delay={1.5} />
      </div>
      <div style={{ position: 'absolute', top: '50%', right: '5%', zIndex: 0, opacity: 0.15, pointerEvents: 'none' }}>
        <BreathingCircle size={100} color={colors.accent[300]} duration={7} delay={3} />
      </div>

      {/* Lotus Elements */}
      <div style={{ position: 'absolute', top: '20%', right: '15%', zIndex: 0, pointerEvents: 'none' }}>
        <LotusElement size={80} petals={8} color={colors.secondary[200]} />
      </div>
      <div style={{ position: 'absolute', bottom: '20%', left: '15%', zIndex: 0, pointerEvents: 'none' }}>
        <LotusElement size={70} petals={6} color={colors.primary[200]} />
      </div>
      <div style={{ position: 'absolute', top: '60%', left: '8%', zIndex: 0, pointerEvents: 'none' }}>
        <LotusElement size={60} petals={8} color={colors.accent[200]} />
      </div>

      {/* Form Card */}
      <div
        ref={formRef}
        className="signup-form-card card-elegant"
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
            Create your profile
          </h1>
          <p style={{ color: colors.text.secondary }}>Start building your wellness-branded link in bio</p>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="signup-form"
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem',
            opacity: isVisible || prefersReducedMotion ? 1 : 0,
            transform: isVisible || prefersReducedMotion ? 'translateY(0)' : 'translateY(20px)',
            transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-out 0.4s, transform 0.6s ease-out 0.4s',
          }}
        >
          <div 
            className="stagger-item"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1rem',
              opacity: isVisible || prefersReducedMotion ? 1 : 0,
              transform: isVisible || prefersReducedMotion ? 'translateY(0)' : 'translateY(10px)',
              transition: prefersReducedMotion ? 'none' : 'opacity 0.5s ease-out 0.5s, transform 0.5s ease-out 0.5s',
            }}
          >
            <Input
              type="text"
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Sarah"
              required
              className="elegant-hover"
            />
            <Input
              type="text"
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Moon"
              required
              className="elegant-hover"
            />
          </div>
          <div
            className="stagger-item"
            style={{
              opacity: isVisible || prefersReducedMotion ? 1 : 0,
              transform: isVisible || prefersReducedMotion ? 'translateY(0)' : 'translateY(10px)',
              transition: prefersReducedMotion ? 'none' : 'opacity 0.5s ease-out 0.6s, transform 0.5s ease-out 0.6s',
            }}
          >
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
          <div
            className="stagger-item"
            style={{
              opacity: isVisible || prefersReducedMotion ? 1 : 0,
              transform: isVisible || prefersReducedMotion ? 'translateY(0)' : 'translateY(10px)',
              transition: prefersReducedMotion ? 'none' : 'opacity 0.5s ease-out 0.7s, transform 0.5s ease-out 0.7s',
            }}
          >
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className="elegant-hover"
            />
          </div>

          {error && (
            <div
              className="stagger-item"
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

          <div
            className="stagger-item"
            style={{
              opacity: isVisible || prefersReducedMotion ? 1 : 0,
              transform: isVisible || prefersReducedMotion ? 'translateY(0)' : 'translateY(10px)',
              transition: prefersReducedMotion ? 'none' : 'opacity 0.5s ease-out 0.8s, transform 0.5s ease-out 0.8s',
            }}
          >
            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="button-elegant glow-effect ripple-effect"
              style={{ width: '100%' }}
            >
              Create free profile
            </Button>
          </div>
        </form>

        <div 
          className="stagger-item"
          style={{ 
            marginTop: '1.5rem', 
            textAlign: 'center',
            opacity: isVisible || prefersReducedMotion ? 1 : 0,
            transform: isVisible || prefersReducedMotion ? 'translateY(0)' : 'translateY(10px)',
            transition: prefersReducedMotion ? 'none' : 'opacity 0.5s ease-out 0.9s, transform 0.5s ease-out 0.9s',
          }}
        >
          <p style={{ color: colors.text.secondary, fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="elegant-hover"
              style={{ 
                color: colors.primary[500], 
                fontWeight: 600, 
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => {
                if (!prefersReducedMotion) {
                  e.currentTarget.style.transform = 'translateX(2px)'
                  e.currentTarget.style.color = colors.primary[600]
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.color = colors.primary[500]
              }}
            >
              Sign in
            </Link>
          </p>
        </div>

        <div
          className="stagger-item"
          style={{
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: `1px solid ${colors.gray[200]}`,
            opacity: isVisible || prefersReducedMotion ? 1 : 0,
            transform: isVisible || prefersReducedMotion ? 'translateY(0)' : 'translateY(10px)',
            transition: prefersReducedMotion ? 'none' : 'opacity 0.5s ease-out 1s, transform 0.5s ease-out 1s',
          }}
        >
          <Button
            variant="outline"
            size="md"
            className="button-elegant"
            style={{ width: '100%' }}
            onClick={() => {
              // Mock Google signup
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

