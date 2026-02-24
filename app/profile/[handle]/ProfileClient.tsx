'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { MapPin, ExternalLink, Calendar, MessageCircle, Phone, Send } from 'lucide-react'
import { ThemeConfig, getBlockStyleCSS } from '../../../lib/themes'
import { Section } from '../../../lib/sections'
import { AnimatedBackground, GlowAura, AnimatedBlock } from '../../components/ThemeAnimations'
import { SectionRenderer } from '../../components/SectionRenderer'
import { Tilt3DCard, DepthGlow } from '../../components/Effects3D'
import { RetreatIcon3D, QuoteIcon3D, SparkleIcon3D } from '../../components/Icons3D'

// Track analytics event
async function trackEvent(eventType: 'VIEW' | 'CLICK', profileId: string, blockId?: string) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        profileId,
        blockId,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      }),
    })
  } catch (error) {
    // Silently fail - don't break user experience
    console.debug('Analytics tracking failed:', error)
  }
}

// Decorative side elements for desktop
const DecorativeElements = ({ theme }: { theme: ThemeConfig }) => (
  <div className="hidden lg:block fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
    {/* Left side decorations */}
    <div className="absolute left-8 xl:left-16 top-1/4 opacity-20">
      <div 
        className="w-32 h-32 rounded-full blur-3xl animate-float-slow"
        style={{ backgroundColor: theme.buttonPrimary }}
      />
    </div>
    <div className="absolute left-12 xl:left-24 top-2/3 opacity-15">
      <div 
        className="w-24 h-24 rounded-full blur-2xl animate-float-slower"
        style={{ backgroundColor: theme.accent }}
      />
    </div>
    
    {/* Right side decorations */}
    <div className="absolute right-8 xl:right-16 top-1/3 opacity-20">
      <div 
        className="w-28 h-28 rounded-full blur-3xl animate-float-slower"
        style={{ backgroundColor: theme.accent }}
      />
    </div>
    <div className="absolute right-12 xl:right-24 bottom-1/4 opacity-15">
      <div 
        className="w-20 h-20 rounded-full blur-2xl animate-float-slow"
        style={{ backgroundColor: theme.buttonPrimary }}
      />
    </div>
    
    {/* Subtle line decorations */}
    <svg className="absolute left-0 top-0 h-full w-24 xl:w-32 opacity-5" viewBox="0 0 100 800" preserveAspectRatio="none">
      <path 
        d="M50 0 Q 30 200, 50 400 Q 70 600, 50 800" 
        stroke={theme.textSecondary} 
        strokeWidth="0.5" 
        fill="none"
      />
    </svg>
    <svg className="absolute right-0 top-0 h-full w-24 xl:w-32 opacity-5" viewBox="0 0 100 800" preserveAspectRatio="none">
      <path 
        d="M50 0 Q 70 200, 50 400 Q 30 600, 50 800" 
        stroke={theme.textSecondary} 
        strokeWidth="0.5" 
        fill="none"
      />
    </svg>
  </div>
)

interface Block {
  id: string
  type: string
  title: string | null
  url: string | null
  dateRange: string | null
  location: string | null
  authorName: string | null
  quote: string | null
  phone: string | null
  description?: string | null
}

interface Profile {
  id: string
  name: string
  headline: string | null
  bio: string | null
  photoUrl: string | null
  location: string | null
  theme: string
  blocks: Block[]
  sections?: Section[]
  // Custom background fields
  backgroundImage?: string | null
  backgroundBlur?: number
  backgroundBrightness?: number
  backgroundOverlayColor?: string
}

interface User {
  handle: string
  picture: string | null
}

interface ProfileClientProps {
  profile: Profile
  user: User
  themeConfig: ThemeConfig
}

export default function ProfileClient({ profile, user, themeConfig }: ProfileClientProps) {
  const hasTrackedView = useRef(false)
  
  // Track profile view on mount
  useEffect(() => {
    if (!hasTrackedView.current) {
      hasTrackedView.current = true
      trackEvent('VIEW', profile.id)
    }
  }, [profile.id])
  
  // Handle block click with tracking
  const handleBlockClick = (blockId: string) => {
    trackEvent('CLICK', profile.id, blockId)
  }
  
  const blockBaseStyle = getBlockStyleCSS(themeConfig.blockStyle, themeConfig)

  const renderBlock = (block: Block, index: number) => {
    const blockContent = (() => {
      switch (block.type) {
        case 'RETREAT':
          return (
            <a
              href={block.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              data-testid={`block-${block.id}`}
              onClick={() => handleBlockClick(block.id)}
            >
              <div className="flex items-start justify-between mb-3">
              <div className="text-2xl"><RetreatIcon3D size={32} /></div>
                <ExternalLink className="w-4 h-4" style={{ color: themeConfig.textSecondary }} />
              </div>
              <h3 
                className="font-semibold text-lg mb-2" 
                style={{ 
                  color: themeConfig.textPrimary,
                  fontFamily: themeConfig.fontPairing.heading,
                  fontWeight: themeConfig.fontPairing.headingWeight,
                }}
              >
                {block.title}
              </h3>
              {block.dateRange && (
                <div 
                  className="flex items-center gap-2 text-sm mb-1" 
                  style={{ color: themeConfig.textSecondary }}
                >
                  <Calendar className="w-4 h-4" />
                  {block.dateRange}
                </div>
              )}
              {block.location && (
                <div 
                  className="flex items-center gap-2 text-sm" 
                  style={{ color: themeConfig.textSecondary }}
                >
                  <MapPin className="w-4 h-4" />
                  {block.location}
                </div>
              )}
            </a>
          )

        case 'TESTIMONIAL':
          return (
            <div data-testid={`block-${block.id}`}>
              <div className="text-2xl mb-3"><QuoteIcon3D size={32} /></div>
              <p 
                className="italic mb-3 leading-relaxed" 
                style={{ 
                  color: themeConfig.textPrimary,
                  fontFamily: themeConfig.fontPairing.body,
                }}
              >
                "{block.quote}"
              </p>
              <p 
                className="text-sm font-medium" 
                style={{ color: themeConfig.textSecondary }}
              >
                — {block.authorName}
              </p>
            </div>
          )

        case 'WHATSAPP':
          return (
            <a
              href={`https://wa.me/${block.phone?.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4"
              data-testid={`block-${block.id}`}
              onClick={() => handleBlockClick(block.id)}
            >
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 
                  className="font-semibold truncate" 
                  style={{ 
                    color: themeConfig.textPrimary,
                    fontFamily: themeConfig.fontPairing.heading,
                  }}
                >
                  {block.title || 'WhatsApp'}
                </h3>
                <p 
                  className="text-sm truncate" 
                  style={{ color: themeConfig.textSecondary }}
                >
                  Message me on WhatsApp
                </p>
              </div>
              <ExternalLink className="w-5 h-5 flex-shrink-0" style={{ color: themeConfig.textSecondary }} />
            </a>
          )

        case 'TELEGRAM':
          return (
            <a
              href={`https://t.me/${block.phone?.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4"
              data-testid={`block-${block.id}`}
              onClick={() => handleBlockClick(block.id)}
            >
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 
                  className="font-semibold truncate" 
                  style={{ 
                    color: themeConfig.textPrimary,
                    fontFamily: themeConfig.fontPairing.heading,
                  }}
                >
                  {block.title || 'Telegram'}
                </h3>
                <p 
                  className="text-sm truncate" 
                  style={{ color: themeConfig.textSecondary }}
                >
                  Message me on Telegram
                </p>
              </div>
              <ExternalLink className="w-5 h-5 flex-shrink-0" style={{ color: themeConfig.textSecondary }} />
            </a>
          )

        case 'BOOK_CALL':
          return (
            <a
              href={block.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4"
              data-testid={`block-${block.id}`}
              onClick={() => handleBlockClick(block.id)}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" 
                style={{ backgroundColor: themeConfig.buttonPrimary }}
              >
                <Phone className="w-6 h-6" style={{ color: themeConfig.buttonPrimaryText }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 
                  className="font-semibold truncate" 
                  style={{ 
                    color: themeConfig.textPrimary,
                    fontFamily: themeConfig.fontPairing.heading,
                  }}
                >
                  {block.title || 'Book a Call'}
                </h3>
                <p 
                  className="text-sm truncate" 
                  style={{ color: themeConfig.textSecondary }}
                >
                  Schedule a discovery call
                </p>
              </div>
              <ExternalLink className="w-5 h-5 flex-shrink-0" style={{ color: themeConfig.textSecondary }} />
            </a>
          )

        default: // LINK
          return (
            <a
              href={block.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4"
              data-testid={`block-${block.id}`}
              onClick={() => handleBlockClick(block.id)}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" 
                style={{ 
                  background: themeConfig.headerGradient || themeConfig.buttonPrimary 
                }}
              >
                <ExternalLink className="w-6 h-6" style={{ color: themeConfig.buttonPrimaryText }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 
                  className="font-semibold truncate" 
                  style={{ 
                    color: themeConfig.textPrimary,
                    fontFamily: themeConfig.fontPairing.heading,
                  }}
                >
                  {block.title || 'Link'}
                </h3>
                {block.description && (
                  <p 
                    className="text-sm truncate" 
                    style={{ color: themeConfig.textSecondary }}
                  >
                    {block.description}
                  </p>
                )}
              </div>
              <ExternalLink className="w-5 h-5 flex-shrink-0" style={{ color: themeConfig.textSecondary }} />
            </a>
          )
      }
    })()

    return (
      <Tilt3DCard
        key={block.id}
        maxTilt={4}
        scale={1.02}
        glare={true}
        className="profile-card-3d"
      >
        <AnimatedBlock
          animation={themeConfig.blockAnimation}
          index={index}
          hoverEffect={themeConfig.blockHoverEffect}
          style={blockBaseStyle}
          className="cursor-pointer shadow-3d"
        >
          {blockContent}
        </AnimatedBlock>
      </Tilt3DCard>
    )
  }

  // Check if using custom background
  const hasCustomBackground = profile.theme === 'custom' && profile.backgroundImage

  return (
    <>
      {/* Custom Background - Rendered outside AnimatedBackground when active */}
      {hasCustomBackground && (
        <div className="fixed inset-0 z-0">
          {/* Background Image */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${profile.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: `blur(${profile.backgroundBlur || 0}px) brightness(${(profile.backgroundBrightness || 100) / 100})`,
            }}
          />
          {/* Overlay */}
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: profile.backgroundOverlayColor || 'rgba(0,0,0,0.4)' }}
          />
        </div>
      )}
      
      {/* Main Content - Use AnimatedBackground only for non-custom themes */}
      {hasCustomBackground ? (
        <div className="relative z-10">
          {/* Decorative side elements - only visible on desktop */}
          <DecorativeElements theme={themeConfig} />
          
          <div 
            className="min-h-screen parallax-3d-container relative"
            data-testid="public-profile"
          >
            {/* Responsive container - mobile: 420px, tablet: 560px, desktop: 720px */}
            <div className="
              max-w-[420px] md:max-w-[560px] lg:max-w-[720px] xl:max-w-[800px]
              mx-auto 
              px-4 md:px-6 lg:px-10 
              py-12 md:py-16 lg:py-20
            ">
              
              {/* Profile Header with Glow Aura and 3D Depth */}
              <div className="text-center mb-10 lg:mb-14">
                {/* Avatar with 3D Depth Glow - scales up on desktop */}
                <DepthGlow 
                  color={themeConfig.buttonPrimary || '#FF7043'} 
                  size={112}
                  className="inline-block mb-5 lg:mb-8"
                >
                  <div className="relative">
                    <GlowAura config={themeConfig.glowAura} size={112} />
                    <Tilt3DCard
                      maxTilt={8}
                      scale={1.03}
                      glare={true}
                      className="w-28 h-28 lg:w-36 lg:h-36 rounded-full p-1 relative z-10 avatar-3d-glow"
                      style={{ 
                        background: themeConfig.headerGradient || `linear-gradient(135deg, ${themeConfig.buttonPrimary} 0%, ${themeConfig.accent} 100%)`,
                        ['--glow-color' as string]: `${themeConfig.buttonPrimary}50`,
                      }}
                    >
                      <div 
                        className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                      >
                        {profile.photoUrl || user.picture ? (
                          <img 
                            src={profile.photoUrl || user.picture || ''} 
                            alt={profile.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span 
                            className="text-4xl lg:text-5xl font-bold" 
                            style={{ 
                              color: themeConfig.textPrimary,
                              fontFamily: themeConfig.fontPairing.heading,
                            }}
                          >
                            {profile.name.charAt(0)}
                          </span>
                        )}
                      </div>
                    </Tilt3DCard>
                  </div>
                </DepthGlow>
                
                {/* Name - responsive typography */}
                <h1 
                  className="text-2xl md:text-3xl lg:text-4xl mb-2 lg:mb-3" 
                  style={{ 
                    color: '#ffffff',
                    fontFamily: themeConfig.fontPairing.heading,
                    fontWeight: themeConfig.fontPairing.headingWeight,
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  {profile.name}
                </h1>
                
                {/* Headline - responsive */}
                {profile.headline && (
                  <p 
                    className="text-base md:text-lg lg:text-xl mb-2 lg:mb-3 max-w-md lg:max-w-lg mx-auto" 
                    style={{ 
                      color: 'rgba(255,255,255,0.9)',
                      fontFamily: themeConfig.fontPairing.body,
                      textShadow: '0 1px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    {profile.headline}
                  </p>
                )}
                
                {/* Location */}
                {profile.location && (
                  <div 
                    className="flex items-center justify-center gap-1.5 text-sm md:text-base mb-4 lg:mb-6" 
                    style={{ color: 'rgba(255,255,255,0.8)' }}
                  >
                    <MapPin className="w-4 h-4 lg:w-5 lg:h-5" />
                    {profile.location}
                  </div>
                )}
                
                {/* Bio - wider on desktop */}
                {profile.bio && (
                  <p 
                    className="leading-relaxed text-sm md:text-base lg:text-lg max-w-xs md:max-w-sm lg:max-w-lg mx-auto" 
                    style={{ 
                      color: 'rgba(255,255,255,0.85)',
                      fontFamily: themeConfig.fontPairing.body,
                      textShadow: '0 1px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    {profile.bio}
                  </p>
                )}
              </div>

              {/* Blocks with Staggered Animation - responsive spacing and grid on desktop */}
              <div className="space-y-4 lg:space-y-5">
                {profile.blocks.map((block, index) => renderBlock(block, index))}
              </div>

              {/* Sections - Mini Website Content */}
              {profile.sections && profile.sections.length > 0 && (
                <div className="space-y-4 lg:space-y-6 mt-6 lg:mt-10">
                  {profile.sections
                    .filter(section => section.enabled)
                    .sort((a, b) => a.order - b.order)
                    .map((section, index) => (
                      <SectionRenderer
                        key={section.id}
                        section={section}
                        theme={themeConfig}
                        index={profile.blocks.length + index}
                      />
                    ))}
                </div>
              )}

              {/* Footer - more spacing on desktop */}
              <div className="mt-16 lg:mt-24 text-center">
                <Link 
                  href="/" 
                  className="text-sm lg:text-base transition-opacity hover:opacity-70"
                  style={{ 
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: themeConfig.fontPairing.body,
                  }}
                >
                  <span className="inline-flex items-center gap-1.5"><SparkleIcon3D size={16} /> Powered by GoToLinks</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <AnimatedBackground theme={themeConfig}>
          {/* Decorative side elements - only visible on desktop */}
          <DecorativeElements theme={themeConfig} />
          
          <div 
            className="min-h-screen parallax-3d-container relative"
            data-testid="public-profile"
          >
            {/* Responsive container - mobile: 420px, tablet: 560px, desktop: 720px */}
            <div className="
              max-w-[420px] md:max-w-[560px] lg:max-w-[720px] xl:max-w-[800px]
              mx-auto 
              px-4 md:px-6 lg:px-10 
              py-12 md:py-16 lg:py-20
            ">
              
              {/* Profile Header with Glow Aura and 3D Depth */}
              <div className="text-center mb-10 lg:mb-14">
                {/* Avatar with 3D Depth Glow - scales up on desktop */}
                <DepthGlow 
                  color={themeConfig.buttonPrimary || '#FF7043'} 
                  size={112}
                  className="inline-block mb-5 lg:mb-8"
                >
              <div className="relative">
                <GlowAura config={themeConfig.glowAura} size={112} />
                <Tilt3DCard
                  maxTilt={8}
                  scale={1.03}
                  glare={true}
                  className="w-28 h-28 lg:w-36 lg:h-36 rounded-full p-1 relative z-10 avatar-3d-glow"
                  style={{ 
                    background: themeConfig.headerGradient || `linear-gradient(135deg, ${themeConfig.buttonPrimary} 0%, ${themeConfig.accent} 100%)`,
                    ['--glow-color' as string]: `${themeConfig.buttonPrimary}50`,
                  }}
                >
                  <div 
                    className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: themeConfig.cardBackground }}
                  >
                    {profile.photoUrl || user.picture ? (
                      <img 
                        src={profile.photoUrl || user.picture || ''} 
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span 
                        className="text-4xl lg:text-5xl font-bold" 
                        style={{ 
                          color: themeConfig.textPrimary,
                          fontFamily: themeConfig.fontPairing.heading,
                        }}
                      >
                        {profile.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </Tilt3DCard>
              </div>
            </DepthGlow>
            
            {/* Name - responsive typography */}
            <h1 
              className="text-2xl md:text-3xl lg:text-4xl mb-2 lg:mb-3" 
              style={{ 
                color: themeConfig.textPrimary,
                fontFamily: themeConfig.fontPairing.heading,
                fontWeight: themeConfig.fontPairing.headingWeight,
              }}
            >
              {profile.name}
            </h1>
            
            {/* Headline - responsive */}
            {profile.headline && (
              <p 
                className="text-base md:text-lg lg:text-xl mb-2 lg:mb-3 max-w-md lg:max-w-lg mx-auto" 
                style={{ 
                  color: themeConfig.textSecondary,
                  fontFamily: themeConfig.fontPairing.body,
                }}
              >
                {profile.headline}
              </p>
            )}
            
            {/* Location */}
            {profile.location && (
              <div 
                className="flex items-center justify-center gap-1.5 text-sm md:text-base mb-4 lg:mb-6" 
                style={{ color: themeConfig.textSecondary }}
              >
                <MapPin className="w-4 h-4 lg:w-5 lg:h-5" />
                {profile.location}
              </div>
            )}
            
            {/* Bio - wider on desktop */}
            {profile.bio && (
              <p 
                className="leading-relaxed text-sm md:text-base lg:text-lg max-w-xs md:max-w-sm lg:max-w-lg mx-auto" 
                style={{ 
                  color: themeConfig.textPrimary, 
                  opacity: 0.85,
                  fontFamily: themeConfig.fontPairing.body,
                }}
              >
                {profile.bio}
              </p>
            )}
          </div>

          {/* Blocks with Staggered Animation - responsive spacing and grid on desktop */}
          <div className="space-y-4 lg:space-y-5">
            {profile.blocks.map((block, index) => renderBlock(block, index))}
          </div>

          {/* Sections - Mini Website Content */}
          {profile.sections && profile.sections.length > 0 && (
            <div className="space-y-4 lg:space-y-6 mt-6 lg:mt-10">
              {profile.sections
                .filter(section => section.enabled)
                .sort((a, b) => a.order - b.order)
                .map((section, index) => (
                  <SectionRenderer
                    key={section.id}
                    section={section}
                    theme={themeConfig}
                    index={profile.blocks.length + index}
                  />
                ))}
            </div>
          )}

          {/* Footer - more spacing on desktop */}
          <div className="mt-16 lg:mt-24 text-center">
            <Link 
              href="/" 
              className="text-sm lg:text-base transition-opacity hover:opacity-70"
              style={{ 
                color: themeConfig.textSecondary,
                fontFamily: themeConfig.fontPairing.body,
              }}
            >
              <span className="inline-flex items-center gap-1.5"><SparkleIcon3D size={16} /> Powered by GoToLinks</span>
            </Link>
          </div>
        </div>
      </div>
    </AnimatedBackground>
      )}
    </>
  )
}
