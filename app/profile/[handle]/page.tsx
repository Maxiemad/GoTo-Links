import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, ExternalLink, Calendar, MessageCircle, Phone, Send } from 'lucide-react'

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

const THEME_STYLES: Record<string, { bg: string; card: string; text: string; accent: string }> = {
  'zen-minimal': { bg: 'bg-white', card: 'bg-gray-50', text: 'text-gray-800', accent: 'bg-primary-500' },
  'sacred-earth': { bg: 'bg-amber-50', card: 'bg-amber-100/50', text: 'text-amber-900', accent: 'bg-amber-600' },
  'ocean-temple': { bg: 'bg-gradient-to-b from-blue-50 to-cyan-50', card: 'bg-white/80', text: 'text-blue-900', accent: 'bg-blue-500' },
  'forest-calm': { bg: 'bg-gradient-to-b from-green-50 to-emerald-50', card: 'bg-white/80', text: 'text-green-900', accent: 'bg-green-600' },
  'sunset-glow': { bg: 'bg-gradient-to-b from-orange-50 to-rose-50', card: 'bg-white/80', text: 'text-orange-900', accent: 'bg-orange-500' },
  'lavender-dreams': { bg: 'bg-gradient-to-b from-purple-50 to-pink-50', card: 'bg-white/80', text: 'text-purple-900', accent: 'bg-purple-500' },
}

export default async function PublicProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const data = await getProfile(handle)
  
  if (!data) {
    notFound()
  }

  const { profile, user }: { profile: Profile; user: User } = data
  const theme = THEME_STYLES[profile.theme] || THEME_STYLES['zen-minimal']

  const renderBlock = (block: Block) => {
    switch (block.type) {
      case 'RETREAT':
        return (
          <a
            key={block.id}
            href={block.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`block ${theme.card} rounded-2xl p-5 backdrop-blur-sm hover:scale-[1.02] transition-transform`}
            data-testid={`block-${block.id}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="text-2xl">🏕️</div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </div>
            <h3 className={`font-bold text-lg mb-1 ${theme.text}`}>{block.title}</h3>
            {block.dateRange && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Calendar className="w-4 h-4" />
                {block.dateRange}
              </div>
            )}
            {block.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
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
            className={`${theme.card} rounded-2xl p-5 backdrop-blur-sm`}
            data-testid={`block-${block.id}`}
          >
            <div className="text-2xl mb-3">💬</div>
            <p className={`italic mb-3 ${theme.text}`}>"{block.quote}"</p>
            <p className="text-sm font-medium text-gray-600">— {block.authorName}</p>
          </div>
        )

      case 'WHATSAPP':
        return (
          <a
            key={block.id}
            href={`https://wa.me/${block.phone?.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-4 ${theme.card} rounded-2xl p-5 backdrop-blur-sm hover:scale-[1.02] transition-transform`}
            data-testid={`block-${block.id}`}
          >
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`font-bold ${theme.text}`}>{block.title || 'WhatsApp'}</h3>
              <p className="text-sm text-gray-600">Message me on WhatsApp</p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400" />
          </a>
        )

      case 'TELEGRAM':
        return (
          <a
            key={block.id}
            href={`https://t.me/${block.phone?.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-4 ${theme.card} rounded-2xl p-5 backdrop-blur-sm hover:scale-[1.02] transition-transform`}
            data-testid={`block-${block.id}`}
          >
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`font-bold ${theme.text}`}>{block.title || 'Telegram'}</h3>
              <p className="text-sm text-gray-600">Message me on Telegram</p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400" />
          </a>
        )

      case 'BOOK_CALL':
        return (
          <a
            key={block.id}
            href={block.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-4 ${theme.card} rounded-2xl p-5 backdrop-blur-sm hover:scale-[1.02] transition-transform`}
            data-testid={`block-${block.id}`}
          >
            <div className={`w-12 h-12 ${theme.accent} rounded-xl flex items-center justify-center`}>
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`font-bold ${theme.text}`}>{block.title || 'Book a Call'}</h3>
              <p className="text-sm text-gray-600">Schedule a discovery call</p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400" />
          </a>
        )

      default: // LINK
        return (
          <a
            key={block.id}
            href={block.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-4 ${theme.card} rounded-2xl p-5 backdrop-blur-sm hover:scale-[1.02] transition-transform`}
            data-testid={`block-${block.id}`}
          >
            <div className={`w-12 h-12 ${theme.accent} rounded-xl flex items-center justify-center`}>
              <ExternalLink className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`font-bold ${theme.text}`}>{block.title || 'Link'}</h3>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400" />
          </a>
        )
    }
  }

  return (
    <div className={`min-h-screen ${theme.bg}`} data-testid="public-profile">
      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-28 h-28 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 p-1">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              {profile.photoUrl || user.picture ? (
                <img 
                  src={profile.photoUrl || user.picture || ''} 
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">{profile.name.charAt(0)}</span>
              )}
            </div>
          </div>
          
          <h1 className={`text-2xl font-bold mb-2 ${theme.text}`}>{profile.name}</h1>
          
          {profile.headline && (
            <p className="text-gray-600 mb-2">{profile.headline}</p>
          )}
          
          {profile.location && (
            <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              {profile.location}
            </div>
          )}
          
          {profile.bio && (
            <p className={`mt-4 ${theme.text} opacity-80`}>{profile.bio}</p>
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
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Powered by GoToLinks
          </Link>
        </div>
      </div>
    </div>
  )
}
