import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { FloatingParticles, BreathingCircle, LotusElement } from '../components/AnimationSystem'
import { EyeIcon, LinkIcon, StarIcon, EditIcon, PreviewIcon, SparkleIcon, WelcomeIcon } from '../components/WellnessIcons'
import { colors, typography, borderRadius } from '../styles/theme'
import { mockApi } from '../utils/mockData'
import { User, Stats } from '../types'

export const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const dashboardRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

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

  // Intersection Observer for scroll animations
  useEffect(() => {
    // Make all sections visible immediately on mount
    setVisibleSections(new Set(['welcome', 'stats', 'actions']))

    if (prefersReducedMotion) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section-id')
            if (id) {
              setVisibleSections((prev) => new Set([...prev, id]))
            }
          }
        })
      },
      { threshold: 0.01, rootMargin: '0px' }
    )

    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      document.querySelectorAll('[data-section-id]').forEach((el) => observer.observe(el))
    }, 100)

    return () => observer.disconnect()
  }, [prefersReducedMotion])

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <FloatingParticles count={20} intensity="low" sacredGeometry={true} />
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              border: `4px solid ${colors.primary[200]}`,
              borderTopColor: colors.primary[500],
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              marginBottom: '1rem',
            }}
          />
          <div style={{ fontSize: '1.125rem', color: colors.text.secondary }}>Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={dashboardRef}
      className="dashboard-page"
      style={{ 
        minHeight: '100vh', 
        backgroundColor: 'transparent',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Gradient Background */}
      <div
        className="dashboard-gradient-bg"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 50%, ${colors.white} 100%)`,
          backgroundSize: '200% 200%',
          animation: prefersReducedMotion ? 'none' : 'gradientShift 25s ease-in-out infinite',
          zIndex: 0,
        }}
      />

      {/* Floating Particles */}
      <FloatingParticles count={35} intensity="medium" sacredGeometry={true} />

      {/* Breathing Circles */}
      <div style={{ position: 'fixed', top: '8%', left: '8%', zIndex: 0, opacity: 0.15, pointerEvents: 'none' }}>
        <BreathingCircle size={160} color={colors.primary[300]} duration={5} delay={0} />
      </div>
      <div style={{ position: 'fixed', bottom: '10%', right: '8%', zIndex: 0, opacity: 0.15, pointerEvents: 'none' }}>
        <BreathingCircle size={130} color={colors.secondary[300]} duration={6} delay={1.5} />
      </div>
      <div style={{ position: 'fixed', top: '50%', right: '5%', zIndex: 0, opacity: 0.12, pointerEvents: 'none' }}>
        <BreathingCircle size={110} color={colors.accent[300]} duration={7} delay={3} />
      </div>

      {/* Lotus Elements */}
      <div style={{ position: 'fixed', top: '15%', right: '12%', zIndex: 0, pointerEvents: 'none' }}>
        <LotusElement size={85} petals={8} color={colors.secondary[200]} />
      </div>
      <div style={{ position: 'fixed', bottom: '15%', left: '12%', zIndex: 0, pointerEvents: 'none' }}>
        <LotusElement size={75} petals={6} color={colors.primary[200]} />
      </div>
      <div style={{ position: 'fixed', top: '55%', left: '6%', zIndex: 0, pointerEvents: 'none' }}>
        <LotusElement size={65} petals={8} color={colors.accent[200]} />
      </div>

      {/* Morphing Blob Backgrounds */}
      <div
        className="morph-blob"
        style={{
          position: 'fixed',
          top: '20%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: `linear-gradient(135deg, ${colors.primary[100]} 0%, ${colors.secondary[100]} 100%)`,
          opacity: 0.15,
          filter: 'blur(80px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div
        className="morph-blob"
        style={{
          position: 'fixed',
          bottom: '20%',
          left: '5%',
          width: '350px',
          height: '350px',
          background: `linear-gradient(135deg, ${colors.secondary[100]} 0%, ${colors.accent[100]} 100%)`,
          opacity: 0.15,
          filter: 'blur(80px)',
          zIndex: 0,
          pointerEvents: 'none',
          animationDelay: '2s',
        }}
      />

      {/* Navigation */}
      <nav
        style={{
          padding: '1.5rem 2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${colors.gray[200]}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 100,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <Link 
          to="/" 
          className="elegant-hover"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            textDecoration: 'none',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => {
            if (!prefersReducedMotion) {
              e.currentTarget.style.transform = 'scale(1.05)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <img 
            src="/69ba50aa-93e2-42fb-a002-736618a2bd81.png" 
            alt="GoToLinks" 
            style={{ 
              height: '40px', 
              width: 'auto',
              display: 'block',
              objectFit: 'contain',
            }}
            onError={(e) => {
              // Fallback if image doesn't load
              const target = e.currentTarget
              if (target.parentElement && !target.parentElement.querySelector('.logo-fallback')) {
                target.style.display = 'none'
                const fallback = document.createElement('div')
                fallback.className = 'logo-fallback'
                fallback.textContent = 'GoToLinks'
                fallback.style.cssText = 'font-size: 1.5rem; font-weight: 700; color: #FF7043; font-family: Inter, sans-serif;'
                target.parentElement.appendChild(fallback)
              }
            }}
          />
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button
            variant="ghost"
            size="sm"
            className="elegant-hover"
            onClick={() => {
              // Mock logout
              navigate('/')
            }}
          >
            Logout
          </Button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', position: 'relative', zIndex: 10, minHeight: 'calc(100vh - 100px)' }}>
        {/* Welcome Section */}
        <div 
          data-section-id="welcome"
          style={{ 
            marginBottom: '3rem',
            opacity: visibleSections.has('welcome') || prefersReducedMotion ? 1 : 1,
            transform: visibleSections.has('welcome') || prefersReducedMotion ? 'translateY(0)' : 'translateY(0)',
            transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-out, transform 0.6s ease-out',
          }}
        >
          <h1
            className="gradient-text"
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: colors.text.primary,
              marginBottom: '0.5rem',
              fontFamily: typography.fontFamily.sans,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            Welcome back, {user?.firstName || 'Creator'}
            <WelcomeIcon size={32} color={colors.primary[500]} />
          </h1>
          <p style={{ color: colors.text.secondary, fontSize: '1.125rem' }}>
            Here's how your profile is performing
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div
            data-section-id="stats"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem',
            }}
          >
            <Card
              className={`card-elegant stagger-item ${visibleSections.has('stats') || prefersReducedMotion ? 'visible' : ''}`}
              style={{
                opacity: visibleSections.has('stats') || prefersReducedMotion ? 1 : 1,
                transform: visibleSections.has('stats') || prefersReducedMotion ? 'translateY(0)' : 'translateY(0)',
                transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-out 0.1s, transform 0.6s ease-out 0.1s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  className="icon-container"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: borderRadius.full,
                    backgroundColor: colors.primary[100],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!prefersReducedMotion) {
                      e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'
                      e.currentTarget.style.backgroundColor = colors.primary[200]
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
                    e.currentTarget.style.backgroundColor = colors.primary[100]
                  }}
                >
                  <EyeIcon size={24} color={colors.primary[500]} />
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

            <Card
              className={`card-elegant stagger-item ${visibleSections.has('stats') || prefersReducedMotion ? 'visible' : ''}`}
              style={{
                opacity: visibleSections.has('stats') || prefersReducedMotion ? 1 : 0,
                transform: visibleSections.has('stats') || prefersReducedMotion ? 'translateY(0)' : 'translateY(30px)',
                transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  className="icon-container"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: borderRadius.full,
                    backgroundColor: colors.secondary[100],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!prefersReducedMotion) {
                      e.currentTarget.style.transform = 'scale(1.1) rotate(-5deg)'
                      e.currentTarget.style.backgroundColor = colors.secondary[200]
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
                    e.currentTarget.style.backgroundColor = colors.secondary[100]
                  }}
                >
                  <LinkIcon size={24} color={colors.secondary[500]} />
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

            <Card
              className={`card-elegant stagger-item ${visibleSections.has('stats') || prefersReducedMotion ? 'visible' : ''}`}
              style={{
                opacity: visibleSections.has('stats') || prefersReducedMotion ? 1 : 0,
                transform: visibleSections.has('stats') || prefersReducedMotion ? 'translateY(0)' : 'translateY(30px)',
                transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  className="icon-container"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: borderRadius.full,
                    backgroundColor: colors.accent[100],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!prefersReducedMotion) {
                      e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'
                      e.currentTarget.style.backgroundColor = colors.accent[200]
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
                    e.currentTarget.style.backgroundColor = colors.accent[100]
                  }}
                >
                  <StarIcon size={24} color={colors.accent[500]} />
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
          data-section-id="actions"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          <Card
            className={`card-elegant stagger-item ${visibleSections.has('actions') || prefersReducedMotion ? 'visible' : ''}`}
            onClick={() => navigate('/dashboard/profile-editor')}
            style={{ 
              cursor: 'pointer', 
              textAlign: 'center',
              opacity: visibleSections.has('actions') || prefersReducedMotion ? 1 : 1,
              transform: visibleSections.has('actions') || prefersReducedMotion ? 'translateY(0)' : 'translateY(0)',
              transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-out 0.1s, transform 0.6s ease-out 0.1s',
            }}
          >
            <div 
              className="icon-container"
              style={{ 
                marginBottom: '1rem',
                display: 'inline-flex',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!prefersReducedMotion) {
                  e.currentTarget.style.transform = 'scale(1.15) rotate(5deg)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
              }}
            >
              <EditIcon size={48} color={colors.primary[500]} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Edit your GoToLinks profile
            </h3>
            <p style={{ color: colors.text.secondary, fontSize: '0.875rem' }}>
              Update your bio, links, and retreats
            </p>
          </Card>

          <Card
            className={`card-elegant stagger-item ${visibleSections.has('actions') || prefersReducedMotion ? 'visible' : ''}`}
            onClick={() => navigate('/profile/demo-creator')}
            style={{ 
              cursor: 'pointer', 
              textAlign: 'center',
              opacity: visibleSections.has('actions') || prefersReducedMotion ? 1 : 0,
              transform: visibleSections.has('actions') || prefersReducedMotion ? 'translateY(0)' : 'translateY(30px)',
              transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s',
            }}
          >
            <div 
              className="icon-container"
              style={{ 
                marginBottom: '1rem',
                display: 'inline-flex',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!prefersReducedMotion) {
                  e.currentTarget.style.transform = 'scale(1.15) rotate(-5deg)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
              }}
            >
              <PreviewIcon size={48} color={colors.secondary[500]} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Preview public profile
            </h3>
            <p style={{ color: colors.text.secondary, fontSize: '0.875rem' }}>
              See how your profile looks to visitors
            </p>
          </Card>

          {user?.plan === 'free' && (
            <Card 
              className={`card-elegant stagger-item ${visibleSections.has('actions') || prefersReducedMotion ? 'visible' : ''}`}
              style={{ 
                textAlign: 'center', 
                border: `2px solid ${colors.accent[500]}`,
                opacity: visibleSections.has('actions') || prefersReducedMotion ? 1 : 0,
                transform: visibleSections.has('actions') || prefersReducedMotion ? 'translateY(0)' : 'translateY(30px)',
                transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div 
                className="icon-container float-element"
                style={{ 
                  marginBottom: '1rem',
                  display: 'inline-flex',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (!prefersReducedMotion) {
                    e.currentTarget.style.transform = 'scale(1.2) rotate(10deg)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
                }}
              >
                <SparkleIcon size={48} color={colors.accent[500]} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Upgrade to Pro
              </h3>
              <p style={{ color: colors.gray[600], fontSize: '0.875rem', marginBottom: '1rem' }}>
                Unlock video heroes, premium themes, and more
              </p>
              <Button 
                variant="secondary" 
                size="sm"
                className="button-elegant glow-effect"
              >
                Upgrade now
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

