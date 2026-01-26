import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Lottie from 'lottie-react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Navbar } from '../components/Navbar'
import { FloatingParticles, BreathingCircle, LotusElement, ParallaxImage } from '../components/AnimationSystem'
import { colors, typography, borderRadius, themes } from '../styles/theme'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [lottieData, setLottieData] = useState<any>(null)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHoveringCTA, setIsHoveringCTA] = useState(false)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const themeSectionRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)

  const scrollToDemo = () => {
    const demo = document.getElementById('demo')
    demo?.scrollIntoView({ behavior: 'smooth' })
  }

  // Load Lottie animation from local file
  useEffect(() => {
    fetch('/a/Main%20Scene.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load animation')
        return res.json()
      })
      .then((data) => setLottieData(data))
      .catch((err) => console.error('Error loading Lottie animation:', err))
  }, [])

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

  // Custom cursor tracking for CTA buttons and mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })

      // Parallax effect for floating icons
      if (howItWorksRef.current) {
        const rect = howItWorksRef.current.getBoundingClientRect()
        const isInSection = e.clientX >= rect.left && e.clientX <= rect.right && 
                           e.clientY >= rect.top && e.clientY <= rect.bottom
        if (isInSection) {
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2
          const deltaX = (e.clientX - centerX) / 20
          const deltaY = (e.clientY - centerY) / 20
          
          document.querySelectorAll('.floating-icon').forEach((icon) => {
            const element = icon as HTMLElement
            element.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`
          })
        }
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Intersection Observer for scroll-based animations
  useEffect(() => {
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
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    )

    document.querySelectorAll('[data-section-id]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleThemeSelect = (themeKey: string) => {
    setSelectedTheme(themeKey)
  }

  const handleCreateAndStyle = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate('/signup')
    }, 800)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
      {/* Navigation */}
      <Navbar />

      {/* Hero Section with Gradient Background */}
      <section
        ref={heroRef}
        className="hero-section"
        style={{
          padding: '6rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          borderRadius: '2rem',
          marginTop: '2rem',
          marginBottom: '4rem',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'default',
        }}
      >
        {/* Animated Gradient Background */}
        <div
          className="hero-gradient-bg"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '2rem',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Floating Particles */}
        <FloatingParticles count={40} intensity="medium" sacredGeometry={true} />

        {/* Breathing Circles */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', zIndex: 0, opacity: 0.3, pointerEvents: 'none' }}>
          <BreathingCircle size={120} color={colors.primary[300]} duration={4} delay={0} />
        </div>
        <div style={{ position: 'absolute', bottom: '15%', right: '8%', zIndex: 0, opacity: 0.3, pointerEvents: 'none' }}>
          <BreathingCircle size={80} color={colors.secondary[300]} duration={5} delay={1} />
        </div>

        {/* Lotus Elements */}
        <div style={{ position: 'absolute', top: '20%', right: '10%', zIndex: 0, pointerEvents: 'none' }}>
          <LotusElement size={80} petals={8} color={colors.secondary[200]} />
        </div>
        <div style={{ position: 'absolute', bottom: '20%', left: '10%', zIndex: 0, pointerEvents: 'none' }}>
          <LotusElement size={60} petals={6} color={colors.primary[200]} />
        </div>
        
        {/* Custom Cursor Glow - Only visual enhancement, doesn't hide cursor */}
        {isHoveringCTA && (
          <div
            className="cursor-glow"
            style={{
              position: 'fixed',
              left: cursorPosition.x - 20,
              top: cursorPosition.y - 20,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.accent[500]}30 0%, transparent 70%)`,
              pointerEvents: 'none',
              zIndex: 9999,
              transition: 'transform 0.1s ease-out',
              transform: 'scale(1.2)',
            }}
          />
        )}
        <div
          className="hero-content-wrapper"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4rem',
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 100,
            pointerEvents: 'auto',
            cursor: 'default',
          }}
        >
          {/* Text Content - Left Side */}
          <div
            className="hero-content"
            style={{
              flex: '1 1 400px',
              textAlign: 'left',
              position: 'relative',
              zIndex: 10,
              pointerEvents: 'auto',
            }}
          >
            <h1
              style={{
                fontWeight: 700,
                color: colors.text.primary,
                marginBottom: '1.5rem',
                lineHeight: 1.3,
                fontFamily: typography.fontFamily.sans,
                position: 'relative',
                zIndex: 1,
                pointerEvents: 'auto',
                cursor: 'text',
              }}
            >
              <span 
                className="headline-line-1"
                style={{ 
                  fontSize: 'clamp(2rem, 3vw, 3.5rem)', 
                  display: 'block',
                  animation: prefersReducedMotion ? 'none' : 'fadeSlideUp 0.8s ease-out',
                }}
              >
                Your Wellness-Branded
              </span>
              <span 
                className="headline-line-2 gradient-text"
                style={{ 
                  fontSize: 'clamp(2.5rem, 4vw, 4rem)', 
                  display: 'block',
                  animation: prefersReducedMotion ? 'none' : 'fadeSlideUpPop 0.8s ease-out 0.15s both',
                }}
              >
                Link in Bio
              </span>
            </h1>
            <p
              style={{
                fontSize: '1.25rem',
                color: colors.text.secondary,
                marginBottom: '2.5rem',
                lineHeight: 1.6,
                pointerEvents: 'auto',
                cursor: 'text',
              }}
            >
              Designed for retreat leaders, healers, coaches and venues. A soulful alternative to
              generic link tools.
            </p>
            <div
              className="hero-buttons"
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
                position: 'relative',
                zIndex: 1,
                pointerEvents: 'auto',
              }}
            >
              <div
                className="cta-primary-wrapper elegant-hover ripple-effect"
                onMouseEnter={() => setIsHoveringCTA(true)}
                onMouseLeave={() => setIsHoveringCTA(false)}
                style={{ position: 'relative', cursor: 'pointer', pointerEvents: 'auto' }}
              >
                <Button 
                  size="lg" 
                  variant="primary" 
                  to="/signup"
                  className="cta-primary button-elegant glow-effect"
                  style={{
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    if (!prefersReducedMotion) {
                      e.currentTarget.style.transform = 'scale(1.03)'
                      e.currentTarget.style.filter = 'brightness(0.95)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = ''
                    e.currentTarget.style.filter = ''
                  }}
                  onMouseDown={(e: React.MouseEvent<HTMLElement>) => {
                    if (!prefersReducedMotion) {
                      e.currentTarget.style.transform = 'scale(0.98) translateY(2px)'
                    }
                  }}
                  onMouseUp={(e: React.MouseEvent<HTMLElement>) => {
                    if (!prefersReducedMotion) {
                      e.currentTarget.style.transform = 'scale(1.03)'
                    }
                  }}
                >
                  Create your free GoToLinks profile
                </Button>
              </div>
              <div
                className="cta-secondary-wrapper elegant-hover"
                style={{ position: 'relative', cursor: 'pointer', pointerEvents: 'auto' }}
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={scrollToDemo}
                  className="cta-secondary button-elegant"
                  style={{
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!prefersReducedMotion) {
                      const underline = e.currentTarget.querySelector('.underline-animation') as HTMLElement
                      if (underline) underline.style.width = '100%'
                    }
                  }}
                  onMouseLeave={(e) => {
                    const underline = e.currentTarget.querySelector('.underline-animation') as HTMLElement
                    if (underline) underline.style.width = '0%'
                  }}
                >
                  <span style={{ position: 'relative', zIndex: 1 }}>
                    See example profile
                    <span style={{ marginLeft: '0.5rem', transition: 'transform 0.3s ease' }}>→</span>
                  </span>
                  <span 
                    className="underline-animation"
                    style={{
                      position: 'absolute',
                      bottom: '0.5rem',
                      left: 0,
                      height: '2px',
                      width: '0%',
                      background: colors.accent[500],
                      transition: 'width 0.3s ease',
                    }}
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* Hero Animation - Right Side */}
          <div
            className="parallax-container elegant-hover"
            style={{
              flex: '1 1 400px',
              width: '100%',
              maxWidth: '600px',
              height: '400px',
              borderRadius: '1.5rem',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)',
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {lottieData ? (
              <Lottie
                animationData={lottieData}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                loop={true}
                autoplay={true}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.text.secondary,
                }}
              >
                Loading animation...
              </div>
            )}
          </div>
        </div>

      </section>

      {/* Why wellness creators love GoToLinks */}
      <section
        id="features"
        data-section-id="features"
        style={{
          padding: '5rem 2rem',
          background: `linear-gradient(180deg, ${colors.white} 0%, ${colors.background} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Floating Particles */}
        <FloatingParticles count={20} intensity="low" sacredGeometry={true} />

        {/* Breathing Circles */}
        <div style={{ position: 'absolute', top: '5%', right: '5%', zIndex: 0, opacity: 0.15 }}>
          <BreathingCircle size={100} color={colors.primary[200]} duration={5} delay={0} />
        </div>
        <div style={{ position: 'absolute', bottom: '5%', left: '5%', zIndex: 0, opacity: 0.15 }}>
          <BreathingCircle size={80} color={colors.secondary[200]} duration={6} delay={1.5} />
        </div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2
            className="gradient-text"
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '3rem',
              color: colors.text.primary,
              opacity: visibleSections.has('features') || prefersReducedMotion ? 1 : 0,
              transform: visibleSections.has('features') || prefersReducedMotion ? 'translateY(0)' : 'translateY(30px)',
              transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-out, transform 0.6s ease-out',
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
                color: colors.primary[500],
                animation: 'video',
              },
              {
                title: 'Retreat Blocks',
                description: 'Beautiful, dedicated blocks for your retreats and events with dates, locations, and easy booking.',
                color: colors.secondary[500],
                animation: 'retreat',
              },
              {
                title: 'Testimonials',
                description: 'Let your community speak for you with elegant testimonial cards that build trust.',
                color: colors.accent[500],
                animation: 'testimonial',
              },
              {
                title: 'Analytics',
                description: 'Track what matters - see which links and retreats resonate most with your audience.',
                color: colors.primary[600],
                animation: 'analytics',
              },
              {
                title: 'Social Links',
                description: 'Connect all your social platforms in one beautiful, branded link that reflects your wellness brand.',
                color: colors.secondary[600],
                animation: 'social',
              },
              {
                title: 'Booking Calendar',
                description: 'Seamlessly integrate booking calendars and accept reservations directly from your profile.',
                color: colors.accent[600],
                animation: 'booking',
              },
            ].map((feature, idx) => (
              <Card 
                key={idx}
                className={`feature-card card-elegant stagger-item ${visibleSections.has('features') || prefersReducedMotion ? 'visible' : ''}`}
                style={{
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  animation: visibleSections.has('features') || prefersReducedMotion 
                    ? `fadeInUp 0.6s ease ${idx * 0.1}s both` 
                    : 'none',
                  opacity: visibleSections.has('features') || prefersReducedMotion ? 1 : 0,
                  transform: visibleSections.has('features') || prefersReducedMotion 
                    ? 'translateY(0)' 
                    : 'translateY(30px)',
                  cursor: 'default',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)',
                }}
              >
                <div 
                  style={{ 
                    width: '80px',
                    height: '80px',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: borderRadius.full,
                    background: `linear-gradient(135deg, ${feature.color}20 0%, ${feature.color}40 100%)`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {feature.animation === 'video' && (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ animation: 'pulse 2s ease-in-out infinite' }}>
                      <rect x="2" y="6" width="14" height="12" rx="2" stroke={feature.color} strokeWidth="2" fill="none"/>
                      <path d="M18 8l4-2v12l-4-2V8z" stroke={feature.color} strokeWidth="2" fill={feature.color} opacity="0.3"/>
                      <circle cx="9" cy="12" r="2" fill={feature.color} style={{ animation: 'scale 2s ease-in-out infinite' }}/>
                    </svg>
                  )}
                  {feature.animation === 'retreat' && (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ animation: 'float 3s ease-in-out infinite' }}>
                      <path d="M12 2L4 8v8l8 6 8-6V8l-8-6z" stroke={feature.color} strokeWidth="2" fill="none"/>
                      <path d="M12 2v6l6 4" stroke={feature.color} strokeWidth="2" fill="none" opacity="0.6"/>
                      <circle cx="12" cy="12" r="3" fill={feature.color} opacity="0.2" style={{ animation: 'pulse 2s ease-in-out infinite' }}/>
                      <path d="M8 14l4-2 4 2" stroke={feature.color} strokeWidth="1.5" fill={feature.color} opacity="0.4"/>
                    </svg>
                  )}
                  {feature.animation === 'testimonial' && (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ animation: 'bounce 2s ease-in-out infinite' }}>
                      <path d="M3 21c3-3 7-5 9-5s6 2 9 5" stroke={feature.color} strokeWidth="2" fill="none"/>
                      <path d="M8 8c0-2.5 2-4.5 4.5-4.5S17 5.5 17 8c0 2.5-2 4.5-4.5 4.5S8 10.5 8 8z" stroke={feature.color} strokeWidth="2" fill={feature.color} opacity="0.2"/>
                      <circle cx="12.5" cy="8" r="1.5" fill={feature.color} style={{ animation: 'pulse 1.5s ease-in-out infinite' }}/>
                      <path d="M6 14l2-2 2 2M14 14l2-2 2 2" stroke={feature.color} strokeWidth="1.5" fill="none" opacity="0.6"/>
                    </svg>
                  )}
                  {feature.animation === 'analytics' && (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ animation: 'slideUp 2s ease-in-out infinite' }}>
                      <rect x="3" y="18" width="4" height="4" rx="1" fill={feature.color} opacity="0.6" style={{ animation: 'grow 2s ease-in-out infinite 0s' }}/>
                      <rect x="9" y="14" width="4" height="8" rx="1" fill={feature.color} opacity="0.7" style={{ animation: 'grow 2s ease-in-out infinite 0.2s' }}/>
                      <rect x="15" y="10" width="4" height="12" rx="1" fill={feature.color} opacity="0.8" style={{ animation: 'grow 2s ease-in-out infinite 0.4s' }}/>
                      <path d="M5 18l4-4 4 4 6-6" stroke={feature.color} strokeWidth="2" fill="none" opacity="0.5"/>
                    </svg>
                  )}
                  {feature.animation === 'social' && (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ animation: 'pulse 2s ease-in-out infinite' }}>
                      <circle cx="12" cy="12" r="3" stroke={feature.color} strokeWidth="2" fill={feature.color} opacity="0.2"/>
                      <circle cx="6" cy="8" r="2" fill={feature.color} opacity="0.6" style={{ animation: 'scale 2s ease-in-out infinite 0s' }}/>
                      <circle cx="18" cy="8" r="2" fill={feature.color} opacity="0.6" style={{ animation: 'scale 2s ease-in-out infinite 0.2s' }}/>
                      <circle cx="6" cy="16" r="2" fill={feature.color} opacity="0.6" style={{ animation: 'scale 2s ease-in-out infinite 0.4s' }}/>
                      <circle cx="18" cy="16" r="2" fill={feature.color} opacity="0.6" style={{ animation: 'scale 2s ease-in-out infinite 0.6s' }}/>
                      <path d="M8 8l4 4M16 8l-4 4M8 16l4-4M16 16l-4-4" stroke={feature.color} strokeWidth="1.5" opacity="0.4"/>
                    </svg>
                  )}
                  {feature.animation === 'booking' && (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ animation: 'float 3s ease-in-out infinite' }}>
                      <rect x="4" y="5" width="16" height="16" rx="2" stroke={feature.color} strokeWidth="2" fill="none"/>
                      <path d="M4 9h16" stroke={feature.color} strokeWidth="2"/>
                      <circle cx="8" cy="13" r="1.5" fill={feature.color} opacity="0.6" style={{ animation: 'pulse 2s ease-in-out infinite 0s' }}/>
                      <circle cx="12" cy="13" r="1.5" fill={feature.color} opacity="0.6" style={{ animation: 'pulse 2s ease-in-out infinite 0.2s' }}/>
                      <circle cx="16" cy="13" r="1.5" fill={feature.color} opacity="0.6" style={{ animation: 'pulse 2s ease-in-out infinite 0.4s' }}/>
                      <path d="M8 17h8" stroke={feature.color} strokeWidth="1.5" opacity="0.5"/>
                      <path d="M6 3v4M18 3v4" stroke={feature.color} strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem', color: colors.text.primary }}>
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
        data-section-id="use-cases"
        style={{
          padding: '5rem 2rem',
          background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Floating Particles */}
        <FloatingParticles count={30} intensity="medium" sacredGeometry={true} />

        {/* Lotus Elements */}
        <div style={{ position: 'absolute', top: '10%', left: '8%', zIndex: 0 }}>
          <LotusElement size={70} petals={8} color={colors.primary[200]} />
        </div>
        <div style={{ position: 'absolute', bottom: '10%', right: '8%', zIndex: 0 }}>
          <LotusElement size={50} petals={6} color={colors.secondary[200]} />
        </div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2
            className="gradient-text"
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
              <Card 
                key={idx}
                className={`card-elegant stagger-item ${visibleSections.has('use-cases') || prefersReducedMotion ? 'visible' : ''}`}
                style={{
                  opacity: visibleSections.has('use-cases') || prefersReducedMotion ? 1 : 0,
                  transform: visibleSections.has('use-cases') || prefersReducedMotion 
                    ? 'translateY(0)' 
                    : 'translateY(30px)',
                  transition: prefersReducedMotion 
                    ? 'none' 
                    : `opacity 0.6s ease-out ${idx * 0.15}s, transform 0.6s ease-out ${idx * 0.15}s`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)',
                }}
              >
                <div
                  className="image-morph"
                  style={{
                    height: '200px',
                    borderRadius: borderRadius.xl,
                    marginBottom: '1.5rem',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <ParallaxImage
                    src={retreat.image}
                    alt={retreat.title}
                    speed={0.3}
                    style={{
                      height: '100%',
                      width: '100%',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(135deg, ${colors.primary[500]}40 0%, ${colors.secondary[500]}40 100%)`,
                      pointerEvents: 'none',
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
        ref={howItWorksRef}
        id="how-it-works"
        data-section-id="how-it-works"
        style={{
          position: 'relative',
          minHeight: '100vh',
          padding: '6rem 2rem',
          background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.white} 100%)`,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Floating Particles Background */}
        <FloatingParticles count={25} intensity="low" sacredGeometry={true} />

        {/* Floating Wellness Icons */}
        {!prefersReducedMotion && (
          <>
            {['🧘', '🌿', '✨', '🌸', '🕯️', '🌊'].map((icon, idx) => {
              const angle = (idx * 60) * (Math.PI / 180)
              const radius = 200
              return (
                <div
                  key={idx}
                  className="floating-icon float-element"
                  style={{
                    position: 'absolute',
                    left: `calc(50% + ${Math.cos(angle) * radius}px)`,
                    top: `calc(50% + ${Math.sin(angle) * radius}px)`,
                    fontSize: '3rem',
                    opacity: 0.15,
                    animation: `floatIcon ${8 + idx * 2}s ease-in-out infinite`,
                    animationDelay: `${idx * 0.5}s`,
                    pointerEvents: 'none',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {icon}
                </div>
              )
            })}
          </>
        )}

        {/* Breathing Circles */}
        <div style={{ position: 'absolute', top: '10%', left: '10%', zIndex: 0, opacity: 0.2, pointerEvents: 'none' }}>
          <BreathingCircle size={150} color={colors.primary[300]} duration={6} delay={0} />
        </div>
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', zIndex: 0, opacity: 0.2, pointerEvents: 'none' }}>
          <BreathingCircle size={100} color={colors.secondary[300]} duration={7} delay={2} />
        </div>

        {/* Lotus Elements */}
        <div style={{ position: 'absolute', top: '15%', right: '15%', zIndex: 0, pointerEvents: 'none' }}>
          <LotusElement size={70} petals={8} color={colors.secondary[200]} />
        </div>
        <div style={{ position: 'absolute', bottom: '15%', left: '15%', zIndex: 0, pointerEvents: 'none' }}>
          <LotusElement size={60} petals={6} color={colors.primary[200]} />
        </div>

        {/* Main Content - Centered */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '800px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <h2
            className="gradient-text"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 600,
              textAlign: 'center',
              marginBottom: '4rem',
              color: colors.text.primary,
              fontFamily: typography.fontFamily.sans,
              opacity: visibleSections.has('how-it-works') || prefersReducedMotion ? 1 : 0,
              transform: visibleSections.has('how-it-works') || prefersReducedMotion ? 'translateY(0)' : 'translateY(30px)',
              transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-out, transform 0.6s ease-out',
            }}
          >
            How it works
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '3rem',
              marginBottom: '4rem',
            }}
          >
            {[
              {
                number: '1',
                title: 'Create profile',
                description: 'Sign up in seconds and set up your wellness-branded profile.',
              },
              {
                number: '2',
                title: 'Add links & retreats',
                description: 'Add booking calendars, retreats, testimonials.',
              },
              {
                number: '3',
                title: 'Share your GoToLinks everywhere',
                description: 'Instagram bio, email signature, everywhere.',
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`card-elegant stagger-item ${visibleSections.has('how-it-works') || prefersReducedMotion ? 'visible' : ''}`}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  padding: '2rem',
                  borderRadius: borderRadius.xl,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0,0,0,0.02)',
                  border: `1px solid rgba(255, 255, 255, 0.5)`,
                  opacity: visibleSections.has('how-it-works') || prefersReducedMotion ? 1 : 0,
                  transform: visibleSections.has('how-it-works') || prefersReducedMotion 
                    ? 'translateY(0)' 
                    : 'translateY(30px)',
                  transition: prefersReducedMotion 
                    ? 'none' 
                    : `opacity 0.6s ease-out ${idx * 0.15}s, transform 0.6s ease-out ${idx * 0.15}s`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    className="step-number"
                    style={{
                      width: '50px',
                      height: '50px',
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
                    {step.number}
                  </div>
                  <div style={{ flex: 1, minWidth: '200px', textAlign: 'left' }}>
                    <h3
                      style={{
                        fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                        color: colors.text.primary,
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        color: colors.text.secondary,
                        lineHeight: 1.6,
                        fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Stats */}
          <div
            className="stagger-item"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              marginTop: '4rem',
              textAlign: 'center',
              opacity: visibleSections.has('how-it-works') || prefersReducedMotion ? 1 : 0,
              transform: visibleSections.has('how-it-works') || prefersReducedMotion ? 'translateY(0)' : 'translateY(30px)',
              transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-out 0.5s, transform 0.6s ease-out 0.5s',
            }}
          >
            {['3 easy steps', '1 powerful wellness link', 'Unlimited sharing'].map((stat, idx) => (
              <div
                key={idx}
                className="card-elegant"
                style={{
                  padding: '1.5rem',
                  borderRadius: borderRadius.xl,
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)',
                }}
              >
                <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 600, color: colors.text.primary, marginBottom: '0.5rem' }}>
                  {stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free vs Pro */}
      <section
        id="pricing"
        data-section-id="pricing"
        style={{
          padding: '5rem 2rem',
          background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.background} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Floating Particles */}
        <FloatingParticles count={20} intensity="low" sacredGeometry={true} />

        {/* Breathing Circles */}
        <div style={{ position: 'absolute', top: '5%', left: '5%', zIndex: 0, opacity: 0.15, pointerEvents: 'none' }}>
          <BreathingCircle size={100} color={colors.primary[300]} duration={5} delay={0} />
        </div>
        <div style={{ position: 'absolute', bottom: '5%', right: '5%', zIndex: 0, opacity: 0.15, pointerEvents: 'none' }}>
          <BreathingCircle size={80} color={colors.secondary[300]} duration={6} delay={1.5} />
        </div>

        {/* Lotus Elements */}
        <div style={{ position: 'absolute', top: '10%', right: '8%', zIndex: 0, pointerEvents: 'none' }}>
          <LotusElement size={60} petals={6} color={colors.primary[200]} />
        </div>
        <div style={{ position: 'absolute', bottom: '10%', left: '8%', zIndex: 0, pointerEvents: 'none' }}>
          <LotusElement size={50} petals={8} color={colors.secondary[200]} />
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2
            className="gradient-text"
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '1rem',
              color: colors.text.primary,
              opacity: visibleSections.has('pricing') || prefersReducedMotion ? 1 : 0,
              transform: visibleSections.has('pricing') || prefersReducedMotion ? 'translateY(0)' : 'translateY(30px)',
              transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-out, transform 0.6s ease-out',
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
              opacity: visibleSections.has('pricing') || prefersReducedMotion ? 1 : 0,
              transform: visibleSections.has('pricing') || prefersReducedMotion ? 'translateY(0)' : 'translateY(20px)',
              transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s',
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
                className={`card-elegant stagger-item ${visibleSections.has('pricing') || prefersReducedMotion ? 'visible' : ''}`}
                style={{
                  border: plan.highlight ? `3px solid ${colors.accent[500]}` : undefined,
                  position: 'relative',
                  opacity: visibleSections.has('pricing') || prefersReducedMotion ? 1 : 0,
                  transform: visibleSections.has('pricing') || prefersReducedMotion ? 'translateY(0)' : 'translateY(30px)',
                  transition: prefersReducedMotion ? 'none' : `opacity 0.6s ease-out ${0.3 + idx * 0.15}s, transform 0.6s ease-out ${0.3 + idx * 0.15}s`,
                }}
              >
                {plan.highlight && (
                  <div
                    className="float-element"
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
                      animation: 'float 3s ease-in-out infinite',
                      boxShadow: '0 4px 12px rgba(161, 130, 103, 0.4)',
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
                  className="button-elegant"
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
        {/* Floating Particles */}
        <FloatingParticles count={25} intensity="low" sacredGeometry={true} />

        {/* Morphing Blob Background */}
        <div
          className="morph-blob"
          style={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: '300px',
            height: '300px',
            background: `linear-gradient(135deg, ${colors.primary[100]} 0%, ${colors.secondary[100]} 100%)`,
            opacity: 0.2,
            filter: 'blur(60px)',
            zIndex: 0,
          }}
        />
        <div
          className="morph-blob"
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '10%',
            width: '250px',
            height: '250px',
            background: `linear-gradient(135deg, ${colors.secondary[100]} 0%, ${colors.accent[100]} 100%)`,
            opacity: 0.2,
            filter: 'blur(60px)',
            zIndex: 0,
            animationDelay: '2s',
          }}
        />
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
            className="gradient-text"
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
                    className="card-elegant"
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
              disabled={isLoading}
              className="button-elegant glow-effect"
              style={{
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.3s ease, filter 0.2s ease',
                filter: isLoading ? 'brightness(0.95)' : 'brightness(1)',
                position: 'relative',
                pointerEvents: isLoading ? 'none' : 'auto',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                if (!isLoading && !prefersReducedMotion) {
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
      <section 
        id="demo" 
        data-section-id="demo"
        style={{ 
          padding: '5rem 2rem', 
          background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Floating Particles */}
        <FloatingParticles count={15} intensity="low" sacredGeometry={true} />

        {/* Breathing Circles */}
        <div style={{ position: 'absolute', top: '10%', left: '10%', zIndex: 0, opacity: 0.2, pointerEvents: 'none' }}>
          <BreathingCircle size={120} color={colors.primary[300]} duration={4} delay={0} />
        </div>
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', zIndex: 0, opacity: 0.2, pointerEvents: 'none' }}>
          <BreathingCircle size={90} color={colors.secondary[300]} duration={5} delay={1} />
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2
            className="gradient-text"
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              marginBottom: '2rem',
              color: colors.text.primary,
              opacity: visibleSections.has('demo') || prefersReducedMotion ? 1 : 0,
              transform: visibleSections.has('demo') || prefersReducedMotion ? 'translateY(0)' : 'translateY(30px)',
              transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-out, transform 0.6s ease-out',
            }}
          >
            See it in action
          </h2>
          <p
            style={{
              fontSize: '1.125rem',
              color: colors.text.secondary,
              marginBottom: '3rem',
              opacity: visibleSections.has('demo') || prefersReducedMotion ? 1 : 0,
              transform: visibleSections.has('demo') || prefersReducedMotion ? 'translateY(0)' : 'translateY(20px)',
              transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s',
            }}
          >
            Check out a live example profile
          </p>
          <div
            style={{
              opacity: visibleSections.has('demo') || prefersReducedMotion ? 1 : 0,
              transform: visibleSections.has('demo') || prefersReducedMotion ? 'translateY(0)' : 'translateY(20px)',
              transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-out 0.4s, transform 0.6s ease-out 0.4s',
            }}
          >
            <Button 
              size="lg" 
              variant="primary" 
              to="/profile/demo-creator"
              className="button-elegant glow-effect"
            >
              View example profile
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        data-section-id="footer"
        style={{
          padding: '3rem 2rem',
          backgroundColor: colors.gray[900],
          color: colors.gray[300],
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Floating Particles */}
        <FloatingParticles count={10} intensity="low" sacredGeometry={true} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div
            className="stagger-item"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem',
              opacity: visibleSections.has('footer') || prefersReducedMotion ? 1 : 0,
              transform: visibleSections.has('footer') || prefersReducedMotion ? 'translateY(0)' : 'translateY(20px)',
              transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-out, transform 0.6s ease-out',
            }}
          >
            <div>
              <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: colors.gray[300] }}>
                GoToLinks
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                Your wellness-branded link in bio
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Product</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to="/" className="elegant-hover" style={{ fontSize: '0.875rem', transition: 'color 0.3s ease' }}>
                  About
                </Link>
                <Link to="/" className="elegant-hover" style={{ fontSize: '0.875rem', transition: 'color 0.3s ease' }}>
                  Pricing
                </Link>
                <Link to="/login" className="elegant-hover" style={{ fontSize: '0.875rem', transition: 'color 0.3s ease' }}>
                  Login
                </Link>
              </div>
            </div>
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Get Started</h4>
              <Button 
                size="sm" 
                variant="secondary" 
                to="/signup"
                className="button-elegant"
              >
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
              opacity: visibleSections.has('footer') || prefersReducedMotion ? 1 : 0,
              transform: visibleSections.has('footer') || prefersReducedMotion ? 'translateY(0)' : 'translateY(10px)',
              transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s',
            }}
          >
            © 2024 GoToLinks. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

