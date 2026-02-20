'use client'

import Link from 'next/link'
import { MapPin, ExternalLink, Calendar, MessageCircle, Phone, Send } from 'lucide-react'
import { ThemeConfig, getBlockStyleCSS } from '../../../lib/themes'
import { Section } from '../../../lib/sections'
import { AnimatedBackground, GlowAura, AnimatedBlock } from '../../components/ThemeAnimations'
import { SectionRenderer } from '../../components/SectionRenderer'
import { Tilt3DCard, DepthGlow } from '../../components/Effects3D'
import { RetreatIcon3D, QuoteIcon3D, SparkleIcon3D } from '../../components/Icons3D'

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

  return (
    <AnimatedBackground theme={themeConfig}>
      <div 
        className="min-h-screen parallax-3d-container"
        data-testid="public-profile"
      >
        {/* Mobile-first container - max 420px */}
        <div className="max-w-[420px] mx-auto px-4 py-12">
          
          {/* Profile Header with Glow Aura and 3D Depth */}
          <div className="text-center mb-10">
            {/* Avatar with 3D Depth Glow */}
            <DepthGlow 
              color={themeConfig.buttonPrimary || '#FF7043'} 
              size={112}
              className="inline-block mb-5"
            >
              <div className="relative">
                <GlowAura config={themeConfig.glowAura} size={112} />
                <Tilt3DCard
                  maxTilt={8}
                  scale={1.03}
                  glare={true}
                  className="w-28 h-28 rounded-full p-1 relative z-10 avatar-3d-glow"
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
                        className="text-4xl font-bold" 
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
            
            {/* Name */}
            <h1 
              className="text-2xl mb-2" 
              style={{ 
                color: themeConfig.textPrimary,
                fontFamily: themeConfig.fontPairing.heading,
                fontWeight: themeConfig.fontPairing.headingWeight,
              }}
            >
              {profile.name}
            </h1>
            
            {/* Headline */}
            {profile.headline && (
              <p 
                className="mb-2" 
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
                className="flex items-center justify-center gap-1 text-sm mb-4" 
                style={{ color: themeConfig.textSecondary }}
              >
                <MapPin className="w-4 h-4" />
                {profile.location}
              </div>
            )}
            
            {/* Bio */}
            {profile.bio && (
              <p 
                className="leading-relaxed max-w-xs mx-auto" 
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

          {/* Blocks with Staggered Animation */}
          <div className="space-y-4">
            {profile.blocks.map((block, index) => renderBlock(block, index))}
          </div>

          {/* Sections - Mini Website Content */}
          {profile.sections && profile.sections.length > 0 && (
            <div className="space-y-4 mt-6">
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

          {/* Footer */}
          <div className="mt-16 text-center">
            <Link 
              href="/" 
              className="text-sm transition-opacity hover:opacity-70"
              style={{ 
                color: themeConfig.textSecondary,
                fontFamily: themeConfig.fontPairing.body,
              }}
            >
              ✨ Powered by GoToLinks
            </Link>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  )
}
