import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, ExternalLink, Calendar, MessageCircle, Phone, Send } from 'lucide-react'
import { getTheme, ThemeConfig } from '../../../lib/themes'

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
}

interface User {
  handle: string
  picture: string | null
}

async function getProfile(handle: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/profile/${handle}`, {
      cache: 'no-store',
    })
    
    if (!res.ok) return null
    
    const data = await res.json()
    return data.success ? data.data : null
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    return null
  }
}

export default async function PublicProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const data = await getProfile(handle)
  
  if (!data) {
    notFound()
  }

  const { profile, user }: { profile: Profile; user: User } = data
  const themeConfig: ThemeConfig = getTheme(profile.theme)

  const renderBlock = (block: Block) => {
    switch (block.type) {
      case 'RETREAT':
        return (
          <a
            key={block.id}
            href={block.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: themeConfig.cardBackground,
              border: `1px solid ${themeConfig.cardBorder}`,
              boxShadow: themeConfig.cardShadow,
            }}
            className="block rounded-2xl p-5 backdrop-blur-sm hover:scale-[1.02] transition-transform"
            data-testid={`block-${block.id}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="text-2xl">🏕️</div>
              <ExternalLink className="w-4 h-4" style={{ color: themeConfig.textSecondary }} />
            </div>
            <h3 className="font-bold text-lg mb-1" style={{ color: themeConfig.textPrimary }}>{block.title}</h3>
            {block.dateRange && (
              <div className="flex items-center gap-2 text-sm mb-1" style={{ color: themeConfig.textSecondary }}>
                <Calendar className="w-4 h-4" />
                {block.dateRange}
              </div>
            )}
            {block.location && (
              <div className="flex items-center gap-2 text-sm" style={{ color: themeConfig.textSecondary }}>
                <MapPin className="w-4 h-4" />
                {block.location}
              </div>
            )}
          </a>
        )

      case 'TESTIMONIAL':
        return (
          <div
            key={block.id}
            style={{
              backgroundColor: themeConfig.cardBackground,
              border: `1px solid ${themeConfig.cardBorder}`,
              boxShadow: themeConfig.cardShadow,
            }}
            className="rounded-2xl p-5 backdrop-blur-sm"
            data-testid={`block-${block.id}`}
          >
            <div className="text-2xl mb-3">💬</div>
            <p className="italic mb-3" style={{ color: themeConfig.textPrimary }}>"{block.quote}"</p>
            <p className="text-sm font-medium" style={{ color: themeConfig.textSecondary }}>— {block.authorName}</p>
          </div>
        )

      case 'WHATSAPP':
        return (
          <a
            key={block.id}
            href={`https://wa.me/${block.phone?.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: themeConfig.cardBackground,
              border: `1px solid ${themeConfig.cardBorder}`,
              boxShadow: themeConfig.cardShadow,
            }}
            className="flex items-center gap-4 rounded-2xl p-5 backdrop-blur-sm hover:scale-[1.02] transition-transform"
            data-testid={`block-${block.id}`}
          >
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold" style={{ color: themeConfig.textPrimary }}>{block.title || 'WhatsApp'}</h3>
              <p className="text-sm" style={{ color: themeConfig.textSecondary }}>Message me on WhatsApp</p>
            </div>
            <ExternalLink className="w-5 h-5" style={{ color: themeConfig.textSecondary }} />
          </a>
        )

      case 'TELEGRAM':
        return (
          <a
            key={block.id}
            href={`https://t.me/${block.phone?.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: themeConfig.cardBackground,
              border: `1px solid ${themeConfig.cardBorder}`,
              boxShadow: themeConfig.cardShadow,
            }}
            className="flex items-center gap-4 rounded-2xl p-5 backdrop-blur-sm hover:scale-[1.02] transition-transform"
            data-testid={`block-${block.id}`}
          >
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold" style={{ color: themeConfig.textPrimary }}>{block.title || 'Telegram'}</h3>
              <p className="text-sm" style={{ color: themeConfig.textSecondary }}>Message me on Telegram</p>
            </div>
            <ExternalLink className="w-5 h-5" style={{ color: themeConfig.textSecondary }} />
          </a>
        )

      case 'BOOK_CALL':
        return (
          <a
            key={block.id}
            href={block.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: themeConfig.cardBackground,
              border: `1px solid ${themeConfig.cardBorder}`,
              boxShadow: themeConfig.cardShadow,
            }}
            className="flex items-center gap-4 rounded-2xl p-5 backdrop-blur-sm hover:scale-[1.02] transition-transform"
            data-testid={`block-${block.id}`}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: themeConfig.buttonPrimary }}>
              <Phone className="w-6 h-6" style={{ color: themeConfig.buttonPrimaryText }} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold" style={{ color: themeConfig.textPrimary }}>{block.title || 'Book a Call'}</h3>
              <p className="text-sm" style={{ color: themeConfig.textSecondary }}>Schedule a discovery call</p>
            </div>
            <ExternalLink className="w-5 h-5" style={{ color: themeConfig.textSecondary }} />
          </a>
        )

      default: // LINK
        return (
          <a
            key={block.id}
            href={block.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: themeConfig.cardBackground,
              border: `1px solid ${themeConfig.cardBorder}`,
              boxShadow: themeConfig.cardShadow,
            }}
            className="flex items-center gap-4 rounded-2xl p-5 backdrop-blur-sm hover:scale-[1.02] transition-transform"
            data-testid={`block-${block.id}`}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: themeConfig.buttonPrimary }}>
              <ExternalLink className="w-6 h-6" style={{ color: themeConfig.buttonPrimaryText }} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold" style={{ color: themeConfig.textPrimary }}>{block.title || 'Link'}</h3>
            </div>
            <ExternalLink className="w-5 h-5" style={{ color: themeConfig.textSecondary }} />
          </a>
        )
    }
  }

  return (
    <div 
      className="min-h-screen" 
      style={{ 
        background: themeConfig.backgroundGradient || themeConfig.background 
      }}
      data-testid="public-profile"
    >
      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div 
            className="w-28 h-28 mx-auto mb-4 rounded-full p-1"
            style={{ 
              background: themeConfig.headerGradient || `linear-gradient(135deg, ${themeConfig.buttonPrimary} 0%, ${themeConfig.accent} 100%)` 
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
                <span className="text-4xl" style={{ color: themeConfig.textPrimary }}>{profile.name.charAt(0)}</span>
              )}
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-2" style={{ color: themeConfig.textPrimary }}>{profile.name}</h1>
          
          {profile.headline && (
            <p className="mb-2" style={{ color: themeConfig.textSecondary }}>{profile.headline}</p>
          )}
          
          {profile.location && (
            <div className="flex items-center justify-center gap-1 text-sm" style={{ color: themeConfig.textSecondary }}>
              <MapPin className="w-4 h-4" />
              {profile.location}
            </div>
          )}
          
          {profile.bio && (
            <p className="mt-4" style={{ color: themeConfig.textPrimary, opacity: 0.8 }}>{profile.bio}</p>
          )}
        </div>

        {/* Blocks */}
        <div className="space-y-4">
          {profile.blocks.map(renderBlock)}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link 
            href="/" 
            className="text-sm transition-colors hover:opacity-80"
            style={{ color: themeConfig.textSecondary }}
          >
            Powered by GoToLinks
          </Link>
        </div>
      </div>
    </div>
  )
}
