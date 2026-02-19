'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { colors } from '../../styles/theme'

export default function CallbackPage() {
  const router = useRouter()
  const hasProcessed = useRef(false)

  useEffect(() => {
    if (hasProcessed.current) return
    hasProcessed.current = true

    const processAuth = async () => {
      const hash = window.location.hash
      const sessionId = hash.split('session_id=')[1]?.split('&')[0]

      if (!sessionId) {
        console.error('No session ID found')
        router.push('/login')
        return
      }

      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })

        const data = await res.json()

        if (data.success) {
          router.push('/dashboard')
        } else {
          console.error('Auth failed:', data.error)
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth error:', error)
        router.push('/login')
      }
    }

    processAuth()
  }, [router])

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 100%)`,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div 
          style={{
            width: '48px',
            height: '48px',
            border: `3px solid ${colors.primary[200]}`,
            borderTopColor: colors.primary[500],
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem',
          }}
        />
        <p style={{ color: colors.text.secondary }}>Completing sign in...</p>
      </div>
    </div>
  )
}
