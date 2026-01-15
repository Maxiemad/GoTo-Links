import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { colors, typography, borderRadius, themes, shadows } from '../styles/theme'
import { mockApi } from '../utils/mockData'
import { Profile, ProfileBlock } from '../types'
import { useMediaQuery, breakpoints } from '../utils/responsive'

export const PublicProfilePage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const isMobile = useMediaQuery(breakpoints.mobile)

  useEffect(() => {
    const loadProfile = async () => {
      if (handle) {
        const data = await mockApi.getProfile(handle)
        setProfile(data)
      }
      setLoading(false)
    }
    loadProfile()
  }, [handle])

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.gray[50],
        }}
      >
        <div style={{ fontSize: '1.125rem', color: colors.text.secondary }}>Loading...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.gray[50],
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
            Profile not found
          </h1>
          <p style={{ color: colors.text.secondary }}>This profile doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  const theme = themes[profile.theme] || themes['zen-minimal']
  const backgroundStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: Array.isArray(theme.background)
      ? `linear-gradient(135deg, ${theme.background[0]} 0%, ${theme.background[1]} 100%)`
      : theme.background,
    padding: '2rem 1rem',
  }

  const renderBlock = (block: ProfileBlock) => {
    switch (block.type) {
      case 'link':
        return (
          <a
            key={block.id}
            href={block.data.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: '1.25rem 1.5rem',
              backgroundColor: colors.white,
              borderRadius: borderRadius.xl,
              color: colors.text.primary,
              textDecoration: 'none',
              boxShadow: shadows.md,
              transition: 'all 0.2s ease',
              border: 'none',
              textAlign: 'center',
              fontWeight: 500,
              fontSize: '1rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = shadows.lg
              e.currentTarget.style.backgroundColor = theme.primary + '10'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = shadows.md
              e.currentTarget.style.backgroundColor = colors.white
            }}
          >
            {block.data.title || 'Link'}
          </a>
        )

      case 'retreat':
        return (
          <div
            key={block.id}
            style={{
              backgroundColor: colors.white,
              borderRadius: borderRadius.xl,
              padding: '1.5rem',
              boxShadow: shadows.lg,
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                height: '180px',
                backgroundColor: theme.primary + '20',
                borderRadius: borderRadius.lg,
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
              }}
            >
              🌿
            </div>
            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
                color: colors.text.primary,
              }}
            >
              {block.data.title || 'Retreat'}
            </h3>
            {block.data.dateRange && (
              <p style={{ color: colors.text.secondary, marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                📅 {block.data.dateRange}
              </p>
            )}
            {block.data.location && (
              <p style={{ color: colors.text.secondary, marginBottom: '1rem', fontSize: '0.95rem' }}>
                📍 {block.data.location}
              </p>
            )}
            {block.data.url && (
              <a
                href={block.data.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: theme.primary,
                  color: colors.white,
                  borderRadius: borderRadius.xl,
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = shadows.md
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Book Now
              </a>
            )}
          </div>
        )

      case 'testimonial':
        return (
          <div
            key={block.id}
            style={{
              backgroundColor: colors.white,
              borderRadius: borderRadius.xl,
              padding: '1.5rem',
              boxShadow: shadows.md,
              borderLeft: `4px solid ${theme.accent}`,
            }}
          >
            <p
              style={{
                fontSize: '1.125rem',
                fontStyle: 'italic',
                color: colors.gray[700],
                marginBottom: '1rem',
                lineHeight: 1.6,
              }}
            >
              "{block.data.quote || 'Testimonial'}"
            </p>
            <p style={{ fontWeight: 600, color: colors.text.primary }}>
              — {block.data.name || 'Anonymous'}
            </p>
          </div>
        )

      case 'book-call':
        return (
          <a
            key={block.id}
            href={block.data.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: '1.25rem 1.5rem',
              backgroundColor: theme.secondary,
              borderRadius: borderRadius.xl,
              color: colors.white,
              textDecoration: 'none',
              boxShadow: shadows.md,
              transition: 'all 0.2s ease',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '1rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = shadows.lg
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = shadows.md
            }}
          >
            📞 {block.data.title || 'Book a Call'}
          </a>
        )

      case 'whatsapp':
      case 'telegram':
        return (
          <a
            key={block.id}
            href={
              block.type === 'whatsapp'
                ? `https://wa.me/${block.data.phone?.replace(/\D/g, '')}`
                : `https://t.me/${block.data.phone}`
            }
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: '1.25rem 1.5rem',
              backgroundColor: block.type === 'whatsapp' ? '#25D366' : '#0088cc',
              borderRadius: borderRadius.xl,
              color: colors.white,
              textDecoration: 'none',
              boxShadow: shadows.md,
              transition: 'all 0.2s ease',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '1rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = shadows.lg
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = shadows.md
            }}
          >
            {block.type === 'whatsapp' ? '💬' : '✈️'} {block.data.title || (block.type === 'whatsapp' ? 'WhatsApp' : 'Telegram')}
          </a>
        )

      default:
        return null
    }
  }

  return (
    <div style={backgroundStyle}>
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          width: '100%',
          padding: '0 1rem',
        }}
      >
        {/* Video Hero Section */}
        <div
          style={{
            width: '100%',
            height: isMobile ? '200px' : '300px',
            borderRadius: borderRadius['2xl'],
            marginBottom: '2rem',
            backgroundColor: theme.primary + '30',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: shadows.xl,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Placeholder for video - in production this would be a video element */}
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, ${theme.primary}40 0%, ${theme.secondary}40 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem',
            }}
          >
            🎥
          </div>
          {/* Optional play icon overlay */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isMobile ? '60px' : '80px',
              height: isMobile ? '60px' : '80px',
              borderRadius: borderRadius.full,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '1.5rem' : '2rem',
              cursor: 'pointer',
              boxShadow: shadows.xl,
            }}
          >
            ▶
          </div>
        </div>

        {/* Profile Card */}
        <div
          style={{
            backgroundColor: colors.white,
            borderRadius: borderRadius['2xl'],
            padding: isMobile ? '2rem 1.5rem' : '2.5rem 2rem',
            marginBottom: '2rem',
            boxShadow: shadows.xl,
            textAlign: 'center',
          }}
        >
          {/* Profile Photo */}
          <div
            style={{
              width: isMobile ? '100px' : '120px',
              height: isMobile ? '100px' : '120px',
              borderRadius: borderRadius.full,
              margin: '0 auto 1.5rem',
              backgroundColor: colors.gray[200],
              overflow: 'hidden',
              border: `4px solid ${theme.accent}`,
              boxShadow: shadows.lg,
            }}
          >
            {profile.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={profile.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                }}
              >
                👤
              </div>
            )}
          </div>

          {/* Name */}
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              color: colors.text.primary,
              fontFamily: typography.fontFamily.sans,
            }}
          >
            {profile.name}
          </h1>

          {/* Headline */}
          <p
            style={{
              fontSize: '1.125rem',
              color: theme.primary,
              fontWeight: 500,
              marginBottom: '1rem',
            }}
          >
            {profile.headline}
          </p>

          {/* Bio */}
          <p
            style={{
              fontSize: '1rem',
              color: colors.gray[700],
              lineHeight: 1.7,
              marginBottom: '1rem',
            }}
          >
            {profile.bio}
          </p>

          {/* Location */}
          {profile.location && (
            <p
              style={{
                fontSize: '0.95rem',
                color: colors.text.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              📍 {profile.location}
            </p>
          )}
        </div>

        {/* Blocks */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '3rem',
          }}
        >
          {profile.blocks
            .sort((a, b) => a.order - b.order)
            .map((block) => renderBlock(block))}
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            padding: '2rem 0',
            color: colors.gray[600],
            fontSize: '0.875rem',
          }}
        >
          <p style={{ marginBottom: '0.5rem' }}>
            Built with{' '}
            <Link
              to="/"
              style={{
                color: theme.primary,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              GoToLinks
            </Link>
          </p>
          <p>
            Discover more retreats on{' '}
            <a
              href="https://gotoretreats.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: theme.primary,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              GoToRetreats
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

