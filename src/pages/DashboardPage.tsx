import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { colors, typography, borderRadius } from '../styles/theme'
import { mockApi } from '../utils/mockData'
import { User, Stats } from '../types'

export const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userData, statsData] = await Promise.all([
          mockApi.getUser(),
          mockApi.getStats(),
        ])
        setUser(userData)
        setStats(statsData)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
        }}
      >
        <div style={{ fontSize: '1.125rem', color: colors.text.secondary }}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
      {/* Navigation */}
      <nav
        style={{
          padding: '1.5rem 2rem',
          backgroundColor: colors.white,
          borderBottom: `1px solid ${colors.gray[200]}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img 
            src="/69ba50aa-93e2-42fb-a002-736618a2bd81.png" 
            alt="GoToLinks" 
            style={{ height: '40px', width: 'auto' }}
          />
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Mock logout
              navigate('/')
            }}
          >
            Logout
          </Button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '3rem' }}>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: colors.text.primary,
              marginBottom: '0.5rem',
              fontFamily: typography.fontFamily.sans,
            }}
          >
            Welcome back, {user?.firstName || 'Creator'} 👋
          </h1>
          <p style={{ color: colors.text.secondary, fontSize: '1.125rem' }}>
            Here's how your profile is performing
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem',
            }}
          >
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: borderRadius.full,
                    backgroundColor: colors.primary[100],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}
                >
                  👁️
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: colors.text.secondary }}>
                    Profile Views
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: colors.gray[900] }}>
                    {stats.profileViews}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: colors.gray[500] }}>
                    Last 7 days
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: borderRadius.full,
                    backgroundColor: colors.secondary[100],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}
                >
                  🔗
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: colors.text.secondary }}>
                    Link Clicks
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: colors.gray[900] }}>
                    {stats.linkClicks}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: colors.gray[500] }}>
                    Last 7 days
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: borderRadius.full,
                    backgroundColor: colors.secondary[100],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}
                >
                  ⭐
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: colors.text.secondary }}>
                    Top Clicked Link
                  </div>
                  <div
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: colors.text.primary,
                      marginTop: '0.25rem',
                    }}
                  >
                    {stats.topClickedLink.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: colors.gray[500] }}>
                    {stats.topClickedLink.clicks} clicks
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          <Card
            onClick={() => navigate('/dashboard/profile-editor')}
            style={{ cursor: 'pointer', textAlign: 'center' }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✏️</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Edit your GoToLinks profile
            </h3>
            <p style={{ color: colors.text.secondary, fontSize: '0.875rem' }}>
              Update your bio, links, and retreats
            </p>
          </Card>

          <Card
            onClick={() => navigate('/profile/demo-creator')}
            style={{ cursor: 'pointer', textAlign: 'center' }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👀</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Preview public profile
            </h3>
            <p style={{ color: colors.text.secondary, fontSize: '0.875rem' }}>
              See how your profile looks to visitors
            </p>
          </Card>

          {user?.plan === 'free' && (
            <Card style={{ textAlign: 'center', border: `2px solid ${colors.accent[500]}` }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Upgrade to Pro
              </h3>
              <p style={{ color: colors.gray[600], fontSize: '0.875rem', marginBottom: '1rem' }}>
                Unlock video heroes, premium themes, and more
              </p>
              <Button variant="secondary" size="sm">
                Upgrade now
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

