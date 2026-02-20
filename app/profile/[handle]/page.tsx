import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, ExternalLink, Calendar, MessageCircle, Phone, Send } from 'lucide-react'
import { getTheme, ThemeConfig, getBlockStyleCSS } from '../../../lib/themes'
import ProfileClient from './ProfileClient'

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

  // Pass data to client component for animations
  return (
    <ProfileClient 
      profile={profile} 
      user={user} 
      themeConfig={themeConfig} 
    />
  )
}
