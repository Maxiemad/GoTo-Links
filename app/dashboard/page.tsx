'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, MousePointer, Trophy, Edit3, ExternalLink, Zap, Copy, Check, TrendingUp, Users, BarChart3, Sparkles } from 'lucide-react'
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
  topClickedLink: { title: string; clicks: number } | null
  period: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
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
          setStats(statsData.data.stats)
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
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}>
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-pink-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
          </div>
          <p className="text-white/60 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/profile/${user?.handle}`

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
      data-testid="dashboard"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/10" style={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-semibold text-lg hidden sm:block">GoToLinks</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-white/60 text-sm">{user?.plan === 'PRO' ? 'Pro Plan' : 'Free Plan'}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
              data-testid="logout-btn"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-purple-400 text-sm font-medium mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                {getGreeting()}
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
                {user?.firstName || 'Creator'}
                <span className="inline-block ml-3 animate-bounce" style={{ animationDuration: '2s' }}>
                  <svg width="40" height="40" viewBox="0 0 48 48" className="inline">
                    <defs>
                      <linearGradient id="wave-hand" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FBBF24" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                    </defs>
                    <path d="M25 14c-1-3-4-4-6-2l-1 2c-1-3-4-4-6-2-2 2-2 5-1 7l1 3c-2-2-5-2-6 0-2 2-1 5 1 7l12 12c4 4 10 4 14 0 4-4 4-10 0-14l-6-11c-1-2-4-3-6-1l2 4" fill="url(#wave-hand)" />
                  </svg>
                </span>
              </h1>
              <p className="text-white/50 text-lg">Here&apos;s how your profile is performing</p>
            </div>
            
            {/* Quick URL Copy */}
            <div className="flex-shrink-0">
              <div 
                className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all cursor-pointer"
                onClick={handleCopyUrl}
              >
                <p className="text-white/40 text-xs font-medium mb-2">YOUR PROFILE URL</p>
                <div className="flex items-center gap-3">
                  <code className="text-white/80 text-sm truncate max-w-[250px]">{profileUrl}</code>
                  <div className={`p-2 rounded-lg transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/60 group-hover:text-white'}`}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </div>
                </div>
                {copied && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-white text-xs rounded-lg">
                    Copied!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - 3D Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Profile Views */}
          <Tilt3DCard maxTilt={8} scale={1.02} glare={true}>
            <div 
              className="relative overflow-hidden rounded-3xl p-6 h-full"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                backdropFilter: 'blur(20px)',
              }}
              data-testid="stat-views"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Eye className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>+12%</span>
                  </div>
                </div>
                <p className="text-white/50 text-sm font-medium mb-1">Profile Views</p>
                <p className="text-4xl font-bold text-white mb-1">{stats?.profileViews || 0}</p>
                <p className="text-white/30 text-xs">Last 7 days</p>
              </div>
            </div>
          </Tilt3DCard>

          {/* Link Clicks */}
          <Tilt3DCard maxTilt={8} scale={1.02} glare={true}>
            <div 
              className="relative overflow-hidden rounded-3xl p-6 h-full"
              style={{
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)',
                border: '1px solid rgba(236, 72, 153, 0.2)',
                backdropFilter: 'blur(20px)',
              }}
              data-testid="stat-clicks"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
                    <MousePointer className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>+8%</span>
                  </div>
                </div>
                <p className="text-white/50 text-sm font-medium mb-1">Link Clicks</p>
                <p className="text-4xl font-bold text-white mb-1">{stats?.linkClicks || 0}</p>
                <p className="text-white/30 text-xs">Last 7 days</p>
              </div>
            </div>
          </Tilt3DCard>

          {/* Top Link */}
          <Tilt3DCard maxTilt={8} scale={1.02} glare={true}>
            <div 
              className="relative overflow-hidden rounded-3xl p-6 h-full"
              style={{
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.05) 100%)',
                border: '1px solid rgba(251, 191, 36, 0.2)',
                backdropFilter: 'blur(20px)',
              }}
              data-testid="stat-top"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                  {stats?.topClickedLink && (
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
                      {stats.topClickedLink.clicks} clicks
                    </span>
                  )}
                </div>
                <p className="text-white/50 text-sm font-medium mb-1">Top Performer</p>
                <p className="text-xl font-bold text-white mb-1 truncate">
                  {stats?.topClickedLink?.title || 'No data yet'}
                </p>
                <p className="text-white/30 text-xs">
                  {stats?.topClickedLink ? 'Your best link' : 'Add links to track'}
                </p>
              </div>
            </div>
          </Tilt3DCard>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Edit Profile */}
          <Tilt3DCard maxTilt={6} scale={1.02} glare={true}>
            <Link 
              href="/dashboard/profile-editor"
              className="block relative overflow-hidden rounded-3xl p-8 h-full group transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
              }}
              data-testid="edit-profile-btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
                  <Edit3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  Edit Profile
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  Customize your bio, add links, blocks, and retreats to make your profile stand out.
                </p>
                <div className="mt-6 flex items-center text-purple-400 text-sm font-medium group-hover:text-purple-300">
                  <span>Open Editor</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </Tilt3DCard>

          {/* Preview Profile */}
          <Tilt3DCard maxTilt={6} scale={1.02} glare={true}>
            <Link 
              href={`/profile/${user?.handle}`}
              target="_blank"
              className="block relative overflow-hidden rounded-3xl p-8 h-full group transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
              }}
              data-testid="preview-profile-btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                  <ExternalLink className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  Preview Profile
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  See how visitors experience your profile. Check your live page in a new tab.
                </p>
                <div className="mt-6 flex items-center text-cyan-400 text-sm font-medium group-hover:text-cyan-300">
                  <span>View Live</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </Tilt3DCard>

          {/* Upgrade to Pro */}
          {user?.plan !== 'PRO' && (
            <Tilt3DCard maxTilt={6} scale={1.02} glare={true}>
              <Link 
                href="/pricing"
                className="block relative overflow-hidden rounded-3xl p-8 h-full group transition-all"
                style={{
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%)',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  backdropFilter: 'blur(20px)',
                }}
                data-testid="upgrade-btn"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"></div>
                <div className="relative">
                  <div className="absolute top-0 right-0 px-3 py-1 rounded-full bg-amber-500/30 text-amber-300 text-xs font-bold">
                    RECOMMENDED
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                    Upgrade to Pro
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Unlock video heroes, premium themes, advanced analytics & more.
                  </p>
                  <div className="mt-6 flex items-center text-amber-400 text-sm font-medium group-hover:text-amber-300">
                    <span>See Plans</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </Tilt3DCard>
          )}
        </div>

        {/* Quick Insights */}
        <div 
          className="rounded-3xl p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Quick Insights</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs">Engagement Rate</p>
                <p className="text-white text-lg font-semibold">
                  {stats?.profileViews && stats?.linkClicks 
                    ? `${((stats.linkClicks / stats.profileViews) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs">Weekly Growth</p>
                <p className="text-white text-lg font-semibold">+15%</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs">Profile Score</p>
                <p className="text-white text-lg font-semibold">85/100</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}
