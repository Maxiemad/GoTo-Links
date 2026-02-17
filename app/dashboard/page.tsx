'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { colors, typography, borderRadius, shadows } from '@/app/styles/theme'

interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  handle: string
  plan: string
  picture: string | null
}

interface Stats {
  profileViews: number
  linkClicks: number
  topClickedLink: { title: string; clicks: number } | null
  period: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authRes = await fetch('/api/auth/me', { credentials: 'include' })
        const authData = await authRes.json()
        
        if (!authData.success) {
          router.push('/login')
          return
        }
        
        setUser(authData.data.user)

        const statsRes = await fetch('/api/analytics', { credentials: 'include' })
        const statsData = await statsRes.json()
        
        if (statsData.success) {
          setStats(statsData.data.stats)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    router.push('/')
  }

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 100%)`,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: `3px solid ${colors.primary[200]}`,
            borderTopColor: colors.primary[500],
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem',
          }} />
          <p style={{ color: colors.text.secondary }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 100%)`,
    }} data-testid="dashboard">
      {/* Navigation */}
      <nav style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${colors.gray[200]}`,
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img 
              src="/69ba50aa-93e2-42fb-a002-736618a2bd81.png" 
              alt="GoToLinks" 
              style={{ height: '40px', width: 'auto' }}
            />
          </Link>
          <button 
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: colors.text.secondary,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
            data-testid="logout-btn"
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 700,
            color: colors.text.primary,
            marginBottom: '0.5rem',
            fontFamily: typography.fontFamily.sans,
          }}>
            Welcome back, {user?.firstName || 'Creator'} 👋
          </h1>
          <p style={{ color: colors.text.secondary }}>Here&apos;s how your profile is performing</p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}>
          <div style={{
            backgroundColor: colors.white,
            borderRadius: borderRadius['2xl'],
            padding: '1.5rem',
            boxShadow: shadows.lg,
          }} data-testid="stat-views">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: colors.primary[100],
                borderRadius: borderRadius.xl,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}>
                👁️
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: colors.text.secondary }}>Profile Views</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.text.primary }}>{stats?.profileViews || 0}</p>
                <p style={{ fontSize: '0.75rem', color: colors.gray[400] }}>Last 7 days</p>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: colors.white,
            borderRadius: borderRadius['2xl'],
            padding: '1.5rem',
            boxShadow: shadows.lg,
          }} data-testid="stat-clicks">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: colors.secondary[100],
                borderRadius: borderRadius.xl,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}>
                🔗
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: colors.text.secondary }}>Link Clicks</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.text.primary }}>{stats?.linkClicks || 0}</p>
                <p style={{ fontSize: '0.75rem', color: colors.gray[400] }}>Last 7 days</p>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: colors.white,
            borderRadius: borderRadius['2xl'],
            padding: '1.5rem',
            boxShadow: shadows.lg,
          }} data-testid="stat-top">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: colors.accent[100],
                borderRadius: borderRadius.xl,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}>
                ⭐
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: colors.text.secondary }}>Top Link</p>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: colors.text.primary, maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {stats?.topClickedLink?.title || 'No data yet'}
                </p>
                <p style={{ fontSize: '0.75rem', color: colors.gray[400] }}>
                  {stats?.topClickedLink ? `${stats.topClickedLink.clicks} clicks` : 'Add links to track'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          <Link 
            href="/dashboard/profile-editor" 
            style={{
              backgroundColor: colors.white,
              borderRadius: borderRadius['2xl'],
              padding: '1.5rem',
              boxShadow: shadows.lg,
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            data-testid="edit-profile-card"
          >
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: colors.primary[100],
              borderRadius: borderRadius.xl,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              fontSize: '1.5rem',
            }}>
              ✏️
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: colors.text.primary, marginBottom: '0.5rem' }}>
              Edit your profile
            </h3>
            <p style={{ color: colors.text.secondary, fontSize: '0.875rem' }}>
              Update your bio, links, and retreats
            </p>
          </Link>

          <Link 
            href={`/profile/${user?.handle}`}
            style={{
              backgroundColor: colors.white,
              borderRadius: borderRadius['2xl'],
              padding: '1.5rem',
              boxShadow: shadows.lg,
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            data-testid="preview-profile-card"
          >
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: colors.secondary[100],
              borderRadius: borderRadius.xl,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              fontSize: '1.5rem',
            }}>
              👁️
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: colors.text.primary, marginBottom: '0.5rem' }}>
              Preview profile
            </h3>
            <p style={{ color: colors.text.secondary, fontSize: '0.875rem' }}>
              See how visitors see your profile
            </p>
          </Link>

          {user?.plan === 'FREE' && (
            <Link 
              href="/dashboard/upgrade"
              style={{
                backgroundColor: colors.white,
                borderRadius: borderRadius['2xl'],
                padding: '1.5rem',
                boxShadow: shadows.lg,
                textDecoration: 'none',
                border: `2px solid ${colors.accent[500]}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              data-testid="upgrade-card"
            >
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: colors.accent[100],
                borderRadius: borderRadius.xl,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                fontSize: '1.5rem',
              }}>
                ✨
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: colors.text.primary, marginBottom: '0.5rem' }}>
                Upgrade to Pro
              </h3>
              <p style={{ color: colors.text.secondary, fontSize: '0.875rem' }}>
                Unlock video heroes, premium themes & more
              </p>
            </Link>
          )}
        </div>

        {/* Quick Link */}
        <div style={{
          marginTop: '2rem',
          backgroundColor: colors.white,
          borderRadius: borderRadius['2xl'],
          padding: '1.5rem',
          boxShadow: shadows.lg,
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: colors.text.primary, marginBottom: '1rem' }}>
            Your GoToLinks URL
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <code style={{
              flex: 1,
              minWidth: '200px',
              backgroundColor: colors.gray[100],
              padding: '0.75rem 1rem',
              borderRadius: borderRadius.xl,
              color: colors.text.secondary,
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {typeof window !== 'undefined' ? `${window.location.origin}/profile/${user?.handle}` : `gotolinks.com/profile/${user?.handle}`}
            </code>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/profile/${user?.handle}`)
              }}
              style={{
                backgroundColor: colors.accent[500],
                color: colors.white,
                padding: '0.75rem 1.5rem',
                borderRadius: borderRadius.xl,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
              data-testid="copy-url-btn"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
