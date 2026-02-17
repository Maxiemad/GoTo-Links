'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, Link2, Star, Edit, ExternalLink, Sparkles, LogOut, Loader2 } from 'lucide-react'

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check auth
        const authRes = await fetch('/api/auth/me', { credentials: 'include' })
        const authData = await authRes.json()
        
        if (!authData.success) {
          router.push('/login')
          return
        }
        
        setUser(authData.data.user)

        // Get stats
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-secondary-50 to-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-white" data-testid="dashboard">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <img 
                src="/69ba50aa-93e2-42fb-a002-736618a2bd81.png" 
                alt="GoToLinks" 
                className="h-10 w-auto"
              />
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              data-testid="logout-btn"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.firstName || 'Creator'} 👋
          </h1>
          <p className="text-gray-600">Here's how your profile is performing</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg" data-testid="stat-views">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Profile Views</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.profileViews || 0}</p>
                <p className="text-xs text-gray-400">Last 7 days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg" data-testid="stat-clicks">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                <Link2 className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Link Clicks</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.linkClicks || 0}</p>
                <p className="text-xs text-gray-400">Last 7 days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg" data-testid="stat-top">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Top Link</p>
                <p className="text-lg font-bold text-gray-800 truncate max-w-[150px]">
                  {stats?.topClickedLink?.title || 'No data yet'}
                </p>
                <p className="text-xs text-gray-400">
                  {stats?.topClickedLink ? `${stats.topClickedLink.clicks} clicks` : 'Add links to track'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link 
            href="/dashboard/profile-editor" 
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
            data-testid="edit-profile-card"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Edit className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Edit your profile</h3>
            <p className="text-gray-600 text-sm">Update your bio, links, and retreats</p>
          </Link>

          <Link 
            href={`/profile/${user?.handle}`}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
            data-testid="preview-profile-card"
          >
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ExternalLink className="w-6 h-6 text-secondary-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Preview profile</h3>
            <p className="text-gray-600 text-sm">See how visitors see your profile</p>
          </Link>

          {user?.plan === 'FREE' && (
            <Link 
              href="/dashboard/upgrade"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group border-2 border-accent-500"
              data-testid="upgrade-card"
            >
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Upgrade to Pro</h3>
              <p className="text-gray-600 text-sm">Unlock video heroes, premium themes & more</p>
            </Link>
          )}

          {user?.plan === 'PRO' && (
            <div className="bg-gradient-to-br from-accent-500 to-primary-500 rounded-2xl p-6 shadow-lg text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Pro Member</h3>
              <p className="text-white/80 text-sm">You have access to all premium features</p>
            </div>
          )}
        </div>

        {/* Quick Link */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Your GoToLinks URL</h3>
          <div className="flex items-center gap-4">
            <code className="flex-1 bg-gray-100 px-4 py-3 rounded-xl text-gray-700 font-mono text-sm truncate">
              {typeof window !== 'undefined' ? `${window.location.origin}/profile/${user?.handle}` : `gotolinks.com/profile/${user?.handle}`}
            </code>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/profile/${user?.handle}`)
              }}
              className="bg-accent-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-accent-600 transition-colors"
              data-testid="copy-url-btn"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
