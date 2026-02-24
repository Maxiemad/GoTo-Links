'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, MousePointer, Trophy, Edit3, ExternalLink, Zap, Copy, Check, TrendingUp, Sparkles, Leaf, Heart } from 'lucide-react'
import { colors, typography, borderRadius, shadows } from '../styles/theme'
import { Tilt3DCard } from '../components/Effects3D'

interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  handle: string
  plan: string
  picture: string | null
}

interface Stats {
  profileViews: number
  linkClicks: number
  totalViews: number
  totalClicks: number
  viewsChange: number
  clicksChange: number
  period: string
}

interface TopLink {
  id: string
  title: string
  type: string
  clicks: number
  percentage: number
}

interface AnalyticsData {
  stats: Stats
  topLinks: TopLink[]
  sparkline: {
    views: number[]
    clicks: number[]
  }
}

// Sparkline component
const Sparkline = ({ data, color, height = 30 }: { data: number[]; color: string; height?: number }) => {
  if (!data.length || data.every(v => v === 0)) return null
  
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1 || 1)) * 100
    const y = ((max - value) / range) * height
    return `${x},${y}`
  }).join(' ')
  
  return (
    <svg 
      viewBox={`0 0 100 ${height}`} 
      className="w-full"
      style={{ height: `${height}px` }}
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.8}
      />
    </svg>
  )
}

// 3D Waving Hand Icon
const WavingHandIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className="inline-block animate-bounce" style={{ animationDuration: '2s' }}>
    <defs>
      <linearGradient id="hand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <filter id="hand-shadow">
        <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#F59E0B" floodOpacity="0.3"/>
      </filter>
    </defs>
    <g filter="url(#hand-shadow)">
      <path d="M25 14c-1-3-4-4-6-2l-1 2c-1-3-4-4-6-2-2 2-2 5-1 7l1 3c-2-2-5-2-6 0-2 2-1 5 1 7l12 12c4 4 10 4 14 0 4-4 4-10 0-14l-6-11c-1-2-4-3-6-1l2 4" fill="url(#hand-grad)" />
    </g>
  </svg>
)

// Lotus/Wellness Icon for branding
const LotusIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
    <defs>
      <linearGradient id="lotus-brand" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF7043" />
        <stop offset="100%" stopColor="#FF5722" />
      </linearGradient>
    </defs>
    <path d="M24 8c-4 8-12 14-12 22 8-4 12-10 12-22z" fill="url(#lotus-brand)" opacity="0.7"/>
    <path d="M24 8c4 8 12 14 12 22-8-4-12-10-12-22z" fill="url(#lotus-brand)" opacity="0.7"/>
    <path d="M24 12c-2 6-6 10-6 16 4-2 6-8 6-16z" fill="url(#lotus-brand)"/>
    <path d="M24 12c2 6 6 10 6 16-4-2-6-8-6-16z" fill="url(#lotus-brand)"/>
    <ellipse cx="24" cy="38" rx="14" ry="4" fill="url(#lotus-brand)" opacity="0.3"/>
  </svg>
)

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authRes = await fetch('/api/auth/me', { credentials: 'include' })
        const authData = await authRes.json()
        
        if (!authData.success) {
          router.push('/login')
          return
        }
        
        setUser(authData.data.user)

        const statsRes = await fetch('/api/analytics', { credentials: 'include' })
        const statsData = await statsRes.json()
        
        if (statsData.success) {
          setAnalyticsData(statsData.data)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    router.push('/')
  }

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/profile/${user?.handle}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 50%, #FFF5F0 100%)` }}
      >
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div 
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ backgroundColor: colors.primary[400] }}
            ></div>
            <div 
              className="absolute inset-0 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.primary[100] }}
            >
              <LotusIcon size={40} />
            </div>
          </div>
          <p style={{ color: colors.text.secondary }}>Loading your sanctuary...</p>
        </div>
      </div>
    )
  }

  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/profile/${user?.handle}`

  return (
    <div 
      className="min-h-screen relative"
      style={{ background: `linear-gradient(180deg, ${colors.primary[50]} 0%, #FFFAF8 50%, ${colors.secondary[50]} 100%)` }}
      data-testid="dashboard"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft gradient orbs */}
        <div 
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{ background: `radial-gradient(circle, ${colors.primary[200]} 0%, transparent 70%)` }}
        ></div>
        <div 
          className="absolute top-1/3 -left-20 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: `radial-gradient(circle, ${colors.secondary[200]} 0%, transparent 70%)` }}
        ></div>
        <div 
          className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-20"
          style={{ background: `radial-gradient(circle, ${colors.accent[200]} 0%, transparent 70%)` }}
        ></div>
        
        {/* Floating leaves decoration */}
        <div className="absolute top-20 left-10 opacity-10">
          <Leaf size={60} style={{ color: colors.secondary[400] }} className="animate-pulse" />
        </div>
        <div className="absolute top-40 right-20 opacity-10" style={{ animationDelay: '1s' }}>
          <Leaf size={40} style={{ color: colors.primary[400] }} className="animate-pulse" />
        </div>
        <div className="absolute bottom-40 left-1/4 opacity-10" style={{ animationDelay: '2s' }}>
          <Heart size={30} style={{ color: colors.accent[400] }} className="animate-pulse" />
        </div>
      </div>

      {/* Navigation */}
      <nav 
        className="relative z-50 border-b"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderColor: colors.gray[200],
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/69ba50aa-93e2-42fb-a002-736618a2bd81.png" 
              alt="GoToLinks" 
              className="h-10 w-auto"
            />
          </Link>
          
          <div className="flex items-center gap-4">
            <div 
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ backgroundColor: colors.primary[50], border: `1px solid ${colors.primary[100]}` }}
            >
              <Sparkles size={14} style={{ color: colors.primary[500] }} />
              <span style={{ color: colors.primary[600] }} className="text-sm font-medium">
                {user?.plan === 'PRO' ? 'Pro Plan' : 'Free Plan'}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-gray-100"
              style={{ color: colors.text.secondary }}
              data-testid="logout-btn"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Welcome Header */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p 
                className="text-sm font-medium mb-2 flex items-center gap-2"
                style={{ color: colors.secondary[600] }}
              >
                <span 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: colors.secondary[500] }}
                ></span>
                {getGreeting()}
              </p>
              <h1 
                className="text-4xl lg:text-5xl font-bold mb-3"
                style={{ 
                  color: colors.text.primary,
                  fontFamily: typography.fontFamily.sans,
                }}
              >
                {user?.firstName || 'Creator'} <WavingHandIcon size={40} />
              </h1>
              <p style={{ color: colors.text.secondary }} className="text-lg">
                Here&apos;s how your wellness journey is growing
              </p>
            </div>
            
            {/* Quick URL Copy Card */}
            <Tilt3DCard maxTilt={4} scale={1.01} glare={true}>
              <div 
                className="group relative rounded-2xl p-5 cursor-pointer transition-all"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: `1px solid ${colors.gray[200]}`,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                }}
                onClick={handleCopyUrl}
              >
                <p 
                  className="text-xs font-semibold mb-2 uppercase tracking-wide"
                  style={{ color: colors.text.secondary }}
                >
                  Your Profile URL
                </p>
                <div className="flex items-center gap-3">
                  <code 
                    className="text-sm truncate max-w-[220px] font-mono"
                    style={{ color: colors.text.primary }}
                  >
                    {profileUrl}
                  </code>
                  <div 
                    className="p-2 rounded-lg transition-all"
                    style={{ 
                      backgroundColor: copied ? colors.secondary[100] : colors.gray[100],
                      color: copied ? colors.secondary[600] : colors.text.secondary,
                    }}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </div>
                </div>
                {copied && (
                  <div 
                    className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-xs text-white font-medium"
                    style={{ backgroundColor: colors.secondary[500] }}
                  >
                    Copied!
                  </div>
                )}
              </div>
            </Tilt3DCard>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Profile Views */}
          <Tilt3DCard maxTilt={6} scale={1.02} glare={true}>
            <div 
              className="relative overflow-hidden rounded-3xl p-6 h-full"
              style={{
                background: `linear-gradient(135deg, ${colors.primary[50]} 0%, white 100%)`,
                border: `1px solid ${colors.primary[100]}`,
                boxShadow: `0 10px 40px ${colors.primary[100]}`,
              }}
              data-testid="stat-views"
            >
              {/* Decorative circle */}
              <div 
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
                style={{ backgroundColor: colors.primary[300] }}
              ></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
                      boxShadow: `0 8px 20px ${colors.primary[200]}`,
                    }}
                  >
                    <Eye size={26} color="white" />
                  </div>
                  <div 
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: colors.secondary[100], color: colors.secondary[600] }}
                  >
                    <TrendingUp size={12} />
                    <span>+12%</span>
                  </div>
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
                  Profile Views
                </p>
                <p className="text-4xl font-bold mb-1" style={{ color: colors.text.primary }}>
                  {stats?.profileViews || 0}
                </p>
                <p className="text-xs" style={{ color: colors.gray[400] }}>Last 7 days</p>
              </div>
            </div>
          </Tilt3DCard>

          {/* Link Clicks */}
          <Tilt3DCard maxTilt={6} scale={1.02} glare={true}>
            <div 
              className="relative overflow-hidden rounded-3xl p-6 h-full"
              style={{
                background: `linear-gradient(135deg, ${colors.secondary[50]} 0%, white 100%)`,
                border: `1px solid ${colors.secondary[100]}`,
                boxShadow: `0 10px 40px ${colors.secondary[100]}`,
              }}
              data-testid="stat-clicks"
            >
              <div 
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
                style={{ backgroundColor: colors.secondary[300] }}
              ></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.secondary[400]} 0%, ${colors.secondary[500]} 100%)`,
                      boxShadow: `0 8px 20px ${colors.secondary[200]}`,
                    }}
                  >
                    <MousePointer size={26} color="white" />
                  </div>
                  <div 
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: colors.secondary[100], color: colors.secondary[600] }}
                  >
                    <TrendingUp size={12} />
                    <span>+8%</span>
                  </div>
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
                  Link Clicks
                </p>
                <p className="text-4xl font-bold mb-1" style={{ color: colors.text.primary }}>
                  {stats?.linkClicks || 0}
                </p>
                <p className="text-xs" style={{ color: colors.gray[400] }}>Last 7 days</p>
              </div>
            </div>
          </Tilt3DCard>

          {/* Top Link */}
          <Tilt3DCard maxTilt={6} scale={1.02} glare={true}>
            <div 
              className="relative overflow-hidden rounded-3xl p-6 h-full"
              style={{
                background: `linear-gradient(135deg, ${colors.accent[50]} 0%, white 100%)`,
                border: `1px solid ${colors.accent[100]}`,
                boxShadow: `0 10px 40px ${colors.accent[100]}`,
              }}
              data-testid="stat-top"
            >
              <div 
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
                style={{ backgroundColor: colors.accent[300] }}
              ></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.accent[400]} 0%, ${colors.accent[500]} 100%)`,
                      boxShadow: `0 8px 20px ${colors.accent[200]}`,
                    }}
                  >
                    <Trophy size={26} color="white" />
                  </div>
                  {stats?.topClickedLink && (
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: colors.accent[100], color: colors.accent[600] }}
                    >
                      {stats.topClickedLink.clicks} clicks
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
                  Top Performer
                </p>
                <p className="text-xl font-bold mb-1 truncate" style={{ color: colors.text.primary }}>
                  {stats?.topClickedLink?.title || 'No data yet'}
                </p>
                <p className="text-xs" style={{ color: colors.gray[400] }}>
                  {stats?.topClickedLink ? 'Your best link' : 'Add links to track'}
                </p>
              </div>
            </div>
          </Tilt3DCard>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Edit Profile */}
          <Tilt3DCard maxTilt={5} scale={1.02} glare={true}>
            <Link 
              href="/dashboard/profile-editor"
              className="block relative overflow-hidden rounded-3xl p-8 h-full group transition-all"
              style={{
                backgroundColor: 'white',
                border: `1px solid ${colors.gray[200]}`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              }}
              data-testid="edit-profile-btn"
            >
              {/* Hover gradient overlay */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(135deg, ${colors.primary[50]} 0%, transparent 100%)` }}
              ></div>
              
              <div className="relative">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-shadow group-hover:shadow-xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
                    boxShadow: `0 8px 24px ${colors.primary[200]}`,
                  }}
                >
                  <Edit3 size={28} color="white" />
                </div>
                <h3 
                  className="text-xl font-bold mb-2 transition-colors"
                  style={{ color: colors.text.primary }}
                >
                  Edit Profile
                </h3>
                <p 
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: colors.text.secondary }}
                >
                  Customize your bio, add links, blocks, and showcase your retreats.
                </p>
                <div 
                  className="flex items-center text-sm font-semibold transition-all group-hover:gap-3"
                  style={{ color: colors.primary[500] }}
                >
                  <span>Open Editor</span>
                  <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </Tilt3DCard>

          {/* Preview Profile */}
          <Tilt3DCard maxTilt={5} scale={1.02} glare={true}>
            <Link 
              href={`/profile/${user?.handle}`}
              target="_blank"
              className="block relative overflow-hidden rounded-3xl p-8 h-full group transition-all"
              style={{
                backgroundColor: 'white',
                border: `1px solid ${colors.gray[200]}`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              }}
              data-testid="preview-profile-btn"
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(135deg, ${colors.secondary[50]} 0%, transparent 100%)` }}
              ></div>
              
              <div className="relative">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-shadow group-hover:shadow-xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.secondary[400]} 0%, ${colors.secondary[500]} 100%)`,
                    boxShadow: `0 8px 24px ${colors.secondary[200]}`,
                  }}
                >
                  <ExternalLink size={28} color="white" />
                </div>
                <h3 
                  className="text-xl font-bold mb-2 transition-colors"
                  style={{ color: colors.text.primary }}
                >
                  Preview Profile
                </h3>
                <p 
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: colors.text.secondary }}
                >
                  See how visitors experience your wellness profile. View it live.
                </p>
                <div 
                  className="flex items-center text-sm font-semibold transition-all group-hover:gap-3"
                  style={{ color: colors.secondary[500] }}
                >
                  <span>View Live</span>
                  <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </Tilt3DCard>

          {/* Upgrade to Pro */}
          {user?.plan !== 'PRO' && (
            <Tilt3DCard maxTilt={5} scale={1.02} glare={true}>
              <Link 
                href="/pricing"
                className="block relative overflow-hidden rounded-3xl p-8 h-full group transition-all"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent[50]} 0%, ${colors.primary[50]} 100%)`,
                  border: `2px solid ${colors.accent[200]}`,
                  boxShadow: `0 10px 40px ${colors.accent[100]}`,
                }}
                data-testid="upgrade-btn"
              >
                {/* Decorative elements */}
                <div 
                  className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30"
                  style={{ backgroundColor: colors.accent[200] }}
                ></div>
                <div 
                  className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-20"
                  style={{ backgroundColor: colors.primary[200] }}
                ></div>
                
                <div className="relative">
                  <div 
                    className="absolute top-0 right-0 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                    style={{ backgroundColor: colors.accent[500], color: 'white' }}
                  >
                    Recommended
                  </div>
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.accent[400]} 0%, ${colors.accent[500]} 100%)`,
                      boxShadow: `0 8px 24px ${colors.accent[200]}`,
                    }}
                  >
                    <Zap size={28} color="white" />
                  </div>
                  <h3 
                    className="text-xl font-bold mb-2"
                    style={{ color: colors.text.primary }}
                  >
                    Upgrade to Pro
                  </h3>
                  <p 
                    className="text-sm leading-relaxed mb-6"
                    style={{ color: colors.text.secondary }}
                  >
                    Unlock video heroes, premium themes, advanced analytics & more.
                  </p>
                  <div 
                    className="flex items-center text-sm font-semibold"
                    style={{ color: colors.accent[600] }}
                  >
                    <span>See Plans</span>
                    <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </Tilt3DCard>
          )}
        </div>

        {/* Wellness Quote */}
        <div 
          className="rounded-3xl p-8 text-center"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)`,
            border: `1px solid ${colors.gray[200]}`,
            backdropFilter: 'blur(10px)',
          }}
        >
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: colors.secondary[100] }}
          >
            <Heart size={24} style={{ color: colors.secondary[500] }} />
          </div>
          <p 
            className="text-lg italic max-w-2xl mx-auto"
            style={{ color: colors.text.secondary }}
          >
            &quot;The journey of a thousand miles begins with a single step.&quot;
          </p>
          <p 
            className="text-sm mt-2 font-medium"
            style={{ color: colors.secondary[500] }}
          >
            — Lao Tzu
          </p>
        </div>
      </div>
    </div>
  )
}
