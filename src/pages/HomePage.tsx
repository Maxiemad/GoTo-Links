import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Navbar } from '../components/Navbar'
import { colors, typography, borderRadius, themes } from '../styles/theme'

export const HomePage: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const themeSectionRef = useRef<HTMLDivElement>(null)

  const scrollToDemo = () => {
    const demo = document.getElementById('demo')
    demo?.scrollIntoView({ behavior: 'smooth' })
  }

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (themeSectionRef.current) {
      observer.observe(themeSectionRef.current)
    }

    return () => {
      if (themeSectionRef.current) {
        observer.unobserve(themeSectionRef.current)
      }
    }
  }, [])

  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleThemeSelect = (themeKey: string) => {
    setSelectedTheme(themeKey)
  }

  const handleCreateAndStyle = () => {
    setIsLoading(true)
    // Simulate loading state
    setTimeout(() => {
      setIsLoading(false)
      // Navigate to signup with selected theme
      window.location.href = '/signup'
    }, 800)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background }}>
      {/* Navigation */}
      <Navbar />

      {/* Hero Section with Gradient Background */}
      <section
        style={{
          padding: '6rem 2rem',
          textAlign: 'center',
          maxWidth: '1000px',
          margin: '0 auto',
          background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 50%, ${colors.white} 100%)`,
          borderRadius: '2rem',
          marginTop: '2rem',
          marginBottom: '4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Hero Image - Real Retreat Photo */}
        <div
          style={{
            width: '100%',
            maxWidth: '800px',
            height: '400px',
            margin: '0 auto 3rem',
            borderRadius: '1.5rem',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            backgroundImage: 'url(https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=600&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(135deg, ${colors.primary[500]}20 0%, ${colors.secondary[500]}20 100%)`,
            }}
          />
        </div>
        
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 700,
            color: colors.text.primary,
            marginBottom: '1.5rem',
            lineHeight: 1.2,
            fontFamily: typography.fontFamily.sans,
          }}
        >
          Your Wellness-Branded Link in Bio
        </h1>
        <p
          style={{
            fontSize: '1.25rem',
            color: colors.text.secondary,
            marginBottom: '2.5rem',
            lineHeight: 1.6,
          }}
        >
          Designed for retreat leaders, healers, coaches and venues. A soulful alternative to
          generic link tools.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Button size="lg" variant="primary" to="/signup">
            Create your free GoToLinks profile
          </Button>
          <Button size="lg" variant="outline" onClick={scrollToDemo}>
            See example profile
          </Button>
        </div>
      </section>

      {/* Why wellness creators love GoToLinks */}
      <section
        id="features"
        style={{
          padding: '5rem 2rem',
          background: `linear-gradient(180deg, ${colors.white} 0%, ${colors.background} 100%)`,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '3rem',
              color: colors.text.primary,
            }}
          >
            Why wellness creators love GoToLinks
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {[
              {
                title: 'Video Hero',
                description: 'Showcase your retreats with stunning video backgrounds that capture the essence of your offerings.',
                icon: '🎥',
              },
              {
                title: 'Retreat Blocks',
                description: 'Beautiful, dedicated blocks for your retreats and events with dates, locations, and easy booking.',
                icon: '🌿',
              },
              {
                title: 'Testimonials',
                description: 'Let your community speak for you with elegant testimonial cards that build trust.',
                icon: '💬',
              },
              {
                title: 'Analytics',
                description: 'Track what matters - see which links and retreats resonate most with your audience.',
                icon: '📊',
              },
            ].map((feature, idx) => (
              <Card key={idx}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                  {feature.title}
                </h3>
                <p style={{ color: colors.text.secondary, lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Made for retreats */}
      <section
        id="use-cases"
        style={{
          padding: '5rem 2rem',
          background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 100%)`,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '3rem',
              color: colors.text.primary,
            }}
          >
            Made for retreats
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            {[
              {
                title: 'Sacred Silence Retreat',
                date: 'March 15-20, 2024',
                location: 'Ubud, Bali',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
              },
              {
                title: 'Ocean Healing Journey',
                date: 'April 10-15, 2024',
                location: 'Tulum, Mexico',
                image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
              },
              {
                title: 'Mountain Meditation',
                date: 'May 5-10, 2024',
                location: 'Sedona, Arizona',
                image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop',
              },
            ].map((retreat, idx) => (
              <Card key={idx}>
                <div
                  style={{
                    height: '200px',
                    backgroundImage: `url(${retreat.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: borderRadius.xl,
                    marginBottom: '1.5rem',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(135deg, ${colors.primary[500]}40 0%, ${colors.secondary[500]}40 100%)`,
                    }}
                  />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: colors.text.primary }}>
                  {retreat.title}
                </h3>
                <p style={{ color: colors.text.secondary, marginBottom: '0.25rem' }}>
                  📅 {retreat.date}
                </p>
                <p style={{ color: colors.text.secondary }}>📍 {retreat.location}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        style={{
          padding: '5rem 2rem',
          background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.white} 100%)`,
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '3rem',
              color: colors.text.primary,
            }}
          >
            How it works
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {[
              {
                step: '1',
                title: 'Create profile',
                description: 'Sign up in seconds and set up your wellness-branded profile with your name, photo, and bio.',
              },
              {
                step: '2',
                title: 'Add links & retreats',
                description: 'Add your links, retreat listings, booking calendars, and testimonials. Drag and drop to reorder.',
              },
              {
                step: '3',
                title: 'Share your GoToLinks everywhere',
                description: 'Put your unique link in your Instagram bio, email signature, and anywhere you connect with your community.',
              },
            ].map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '2rem',
                  alignItems: 'flex-start',
                  backgroundColor: colors.white,
                  padding: '2rem',
                  borderRadius: borderRadius['2xl'],
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: borderRadius.full,
                    background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`,
                    color: colors.white,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(255, 112, 67, 0.3)',
                  }}
                >
                  {step.step}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: colors.text.primary }}>
                    {step.title}
                  </h3>
                  <p style={{ color: colors.text.secondary, lineHeight: 1.6 }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free vs Pro */}
      <section
        id="pricing"
        style={{
          padding: '5rem 2rem',
          background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.background} 100%)`,
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '1rem',
              color: colors.text.primary,
            }}
          >
            Free forever, upgrade when you're ready
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: colors.text.secondary,
              marginBottom: '3rem',
              fontSize: '1.125rem',
            }}
          >
            Start free, upgrade to unlock advanced features
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            {[
              {
                name: 'Free',
                price: '$0',
                features: [
                  'Unlimited links',
                  'Retreat blocks',
                  'Basic themes',
                  'Profile analytics',
                ],
                cta: 'Get started free',
              },
              {
                name: 'Pro',
                price: '$19',
                period: '/month',
                features: [
                  'Everything in Free',
                  'Video hero backgrounds',
                  'All premium themes',
                  'Advanced analytics',
                  'Custom domain',
                  'Priority support',
                ],
                cta: 'Upgrade to Pro',
                highlight: true,
              },
            ].map((plan, idx) => (
              <Card
                key={idx}
                style={{
                  border: plan.highlight ? `3px solid ${colors.accent[500]}` : undefined,
                  position: 'relative',
                }}
              >
                {plan.highlight && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: colors.accent[500],
                      color: colors.white,
                      padding: '0.25rem 1rem',
                      borderRadius: borderRadius.full,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    Most Popular
                  </div>
                )}
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: colors.text.primary }}>
                  {plan.name}
                </h3>
                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 700, color: colors.primary[500] }}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span style={{ color: colors.text.secondary }}>{plan.period}</span>
                  )}
                </div>
                <ul style={{ listStyle: 'none', marginBottom: '2rem' }}>
                  {plan.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      style={{
                        padding: '0.75rem 0',
                        borderBottom: `1px solid ${colors.gray[200]}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <span style={{ color: colors.primary[500] }}>✓</span>
                      <span style={{ color: colors.text.primary }}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlight ? 'primary' : 'outline'}
                  size="lg"
                  style={{ width: '100%' }}
                >
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Choose Theme Section */}
      <section
        ref={themeSectionRef}
        style={{
          padding: '5rem 2rem',
          background: `linear-gradient(180deg, ${colors.white} 0%, ${colors.background} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Elements */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {/* Floating Gradient Orbs */}
          <div
            style={{
              position: 'absolute',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.primary[100]}40 0%, transparent 70%)`,
              top: '-200px',
              left: '-200px',
              animation: prefersReducedMotion
                ? 'none'
                : 'floatOrb1 20s ease-in-out infinite',
              filter: 'blur(60px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '350px',
              height: '350px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.secondary[100]}40 0%, transparent 70%)`,
              bottom: '-150px',
              right: '-150px',
              animation: prefersReducedMotion
                ? 'none'
                : 'floatOrb2 25s ease-in-out infinite',
              filter: 'blur(60px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.accent[100]}30 0%, transparent 70%)`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animation: prefersReducedMotion
                ? 'none'
                : 'floatOrb3 30s ease-in-out infinite',
              filter: 'blur(50px)',
            }}
          />
          {/* Subtle Wave Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              background: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 100px,
                ${colors.primary[50]}20 100px,
                ${colors.primary[50]}20 200px
              )`,
              animation: prefersReducedMotion
                ? 'none'
                : 'waveShift 15s linear infinite',
              opacity: 0.3,
            }}
          />
        </div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '3rem',
              color: colors.text.primary,
              opacity: isVisible || prefersReducedMotion ? 1 : 0,
              transform: isVisible || prefersReducedMotion ? 'translateY(0)' : 'translateY(20px)',
              transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-out, transform 0.6s ease-out',
            }}
          >
            Choose Theme
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem',
            }}
          >
            {Object.entries(themes).map(([key, theme], idx) => {
              const isSelected = selectedTheme === key
              const cardDelay = prefersReducedMotion ? 0 : idx * 60
              const cardVisible = isVisible || prefersReducedMotion

              return (
                <div
                  key={key}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${theme.name} theme`}
                  onClick={() => handleThemeSelect(key)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleThemeSelect(key)
                    }
                  }}
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                    opacity: cardVisible || prefersReducedMotion ? 1 : 0,
                    transform: cardVisible || prefersReducedMotion
                      ? 'translateY(0)'
                      : 'translateY(20px)',
                    transition: prefersReducedMotion
                      ? 'none'
                      : `opacity 0.6s ease-out ${cardDelay}ms, transform 0.6s ease-out ${cardDelay}ms, transform 0.2s ease, box-shadow 0.2s ease`,
                    outline: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!prefersReducedMotion) {
                      e.currentTarget.style.transform = 'scale(1.02) translateY(0)'
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15), 0 0 0 2px ' + colors.accent[500] + '40'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!prefersReducedMotion) {
                      e.currentTarget.style.transform = isSelected
                        ? 'scale(1) translateY(0)'
                        : 'scale(1) translateY(0)'
                      e.currentTarget.style.boxShadow = isSelected
                        ? '0 10px 20px rgba(0, 0, 0, 0.1), 0 0 0 2px ' + colors.accent[500]
                        : '0 10px 20px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                  onMouseDown={(e) => {
                    if (!prefersReducedMotion) {
                      e.currentTarget.style.transform = 'scale(0.98) translateY(0)'
                    }
                  }}
                  onMouseUp={(e) => {
                    if (!prefersReducedMotion) {
                      e.currentTarget.style.transform = isSelected
                        ? 'scale(1) translateY(0)'
                        : 'scale(1.02) translateY(0)'
                    }
                  }}
                >
                  <Card
                    style={{
                      border: isSelected ? `2px solid ${colors.accent[500]}` : '2px solid transparent',
                      boxShadow: isSelected
                        ? '0 10px 20px rgba(0, 0, 0, 0.1), 0 0 0 2px ' + colors.accent[500]
                        : '0 10px 20px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      padding: 0,
                      overflow: 'hidden',
                    }}
                  >
                    {/* Theme Preview Image */}
                    <div
                      style={{
                        height: '200px',
                        background: Array.isArray(theme.background)
                          ? `linear-gradient(135deg, ${theme.background[0]} 0%, ${theme.background[1]} 100%)`
                          : theme.background,
                        position: 'relative',
                      }}
                    >
                      {/* Theme color swatches */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '1rem',
                          left: '1rem',
                          right: '1rem',
                          display: 'flex',
                          gap: '0.5rem',
                          justifyContent: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: borderRadius.full,
                            backgroundColor: theme.primary,
                            border: '2px solid rgba(255, 255, 255, 0.5)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                          }}
                        />
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: borderRadius.full,
                            backgroundColor: theme.secondary,
                            border: '2px solid rgba(255, 255, 255, 0.5)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                          }}
                        />
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: borderRadius.full,
                            backgroundColor: theme.accent,
                            border: '2px solid rgba(255, 255, 255, 0.5)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <h3
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 600,
                          marginBottom: '0.5rem',
                          color: colors.text.primary,
                        }}
                      >
                        {theme.name}
                      </h3>
                    </div>
                    {/* Selected Checkmark */}
                    {isSelected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          width: '32px',
                          height: '32px',
                          borderRadius: borderRadius.full,
                          backgroundColor: colors.accent[500],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(161, 130, 103, 0.4)',
                          animation: prefersReducedMotion
                            ? 'none'
                            : 'fadeInScale 0.3s ease-out',
                        }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </Card>
                </div>
              )
            })}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleCreateAndStyle}
              disabled={isLoading || !selectedTheme}
              style={{
                opacity: selectedTheme ? 1 : 0.6,
                cursor: selectedTheme && !isLoading ? 'pointer' : 'not-allowed',
                transition: 'opacity 0.3s ease, filter 0.2s ease',
                filter: isLoading ? 'brightness(0.95)' : 'brightness(1)',
                position: 'relative',
                pointerEvents: selectedTheme && !isLoading ? 'auto' : 'none',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                if (selectedTheme && !isLoading && !prefersReducedMotion) {
                  e.currentTarget.style.filter = 'brightness(1.05)'
                }
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                if (!prefersReducedMotion) {
                  e.currentTarget.style.filter = isLoading ? 'brightness(0.95)' : 'brightness(1)'
                }
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      display: 'inline-block',
                    }}
                  />
                  Creating...
                </span>
              ) : (
                'Create and Style'
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" style={{ padding: '5rem 2rem', background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 100%)` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              marginBottom: '2rem',
              color: colors.text.primary,
            }}
          >
            See it in action
          </h2>
          <p
            style={{
              fontSize: '1.125rem',
              color: colors.text.secondary,
              marginBottom: '3rem',
            }}
          >
            Check out a live example profile
          </p>
          <Button size="lg" variant="primary" to="/profile/demo-creator">
            View example profile
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '3rem 2rem',
          backgroundColor: colors.gray[900],
          color: colors.gray[300],
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem',
            }}
          >
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                GoToLinks
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                Your wellness-branded link in bio
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Product</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to="/" style={{ fontSize: '0.875rem' }}>
                  About
                </Link>
                <Link to="/" style={{ fontSize: '0.875rem' }}>
                  Pricing
                </Link>
                <Link to="/login" style={{ fontSize: '0.875rem' }}>
                  Login
                </Link>
              </div>
            </div>
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Get Started</h4>
              <Button size="sm" variant="secondary" to="/signup">
                Create free profile
              </Button>
            </div>
          </div>
          <div
            style={{
              paddingTop: '2rem',
              borderTop: `1px solid ${colors.gray[800]}`,
              textAlign: 'center',
              fontSize: '0.875rem',
            }}
          >
            © 2024 GoToLinks. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

