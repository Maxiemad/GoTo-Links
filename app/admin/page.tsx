'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Users, 
  Eye, 
  MousePointer, 
  MessageSquare, 
  Search, 
  ExternalLink,
  Calendar,
  Mail,
  RefreshCw,
  LayoutDashboard,
  Filter,
  UserPlus,
  TrendingUp
} from 'lucide-react'

interface Stats {
  totalUsers: number
  totalProfiles: number
  totalViews: number
  totalClicks: number
  recentSignups: number
  totalSuggestions: number
}

interface User {
  id: string
  email: string
  name: string
  handle: string
  profileUrl: string | null
  dateJoined: string
  plan: string
}

interface Suggestion {
  id: string
  email: string
  suggestion: string
  source: string
  createdAt: string
}

// Wellness color palette
const colors = {
  primary: { 50: '#fdf8f6', 100: '#f2e8e5', 200: '#eaddd7', 300: '#e0cec7', 400: '#d2bab0', 500: '#bfa094' },
  secondary: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e' },
  accent: { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#eab308', 600: '#ca8a04' },
  gray: { 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937' },
  text: { primary: '#1f2937', secondary: '#6b7280' },
  background: '#fffbf7',
  white: '#ffffff',
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'suggestions'>('overview')

  // Fetch all admin data
  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch stats
      const statsRes = await fetch('/api/admin/stats', { credentials: 'include' })
      if (statsRes.status === 401) {
        router.push('/login')
        return
      }
      if (statsRes.status === 403) {
        router.push('/')
        return
      }
      const statsData = await statsRes.json()
      if (statsData.success) {
        setStats(statsData.data)
      }

      // Fetch users
      const usersRes = await fetch('/api/admin/users', { credentials: 'include' })
      const usersData = await usersRes.json()
      if (usersData.success) {
        setUsers(usersData.data.users)
      }

      // Fetch suggestions
      const suggestionsRes = await fetch('/api/admin/feedback', { credentials: 'include' })
      const suggestionsData = await suggestionsRes.json()
      if (suggestionsData.success) {
        setSuggestions(suggestionsData.data.suggestions)
      }
    } catch (err) {
      console.error('Error fetching admin data:', err)
      setError('Failed to load admin data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Search users
  const searchUsers = async () => {
    try {
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(searchQuery)}`, {
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setUsers(data.data.users)
      }
    } catch (err) {
      console.error('Error searching users:', err)
    }
  }

  // Filter suggestions
  const filterSuggestions = async (source: string) => {
    setSourceFilter(source)
    try {
      const url = source === 'all' 
        ? '/api/admin/feedback' 
        : `/api/admin/feedback?source=${source}`
      const res = await fetch(url, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setSuggestions(data.data.suggestions)
      }
    } catch (err) {
      console.error('Error filtering suggestions:', err)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-500 mx-auto mb-4"></div>
          <p style={{ color: colors.text.secondary }}>Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 rounded-lg text-white transition-colors"
            style={{ backgroundColor: colors.primary[500] }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <header 
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ 
          backgroundColor: 'rgba(255, 251, 247, 0.95)',
          borderBottom: `1px solid ${colors.gray[200]}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <LayoutDashboard size={24} style={{ color: colors.primary[500] }} />
              <span className="text-xl font-bold" style={{ color: colors.text.primary }}>
                Admin Dashboard
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100"
              style={{ color: colors.text.secondary }}
            >
              <RefreshCw size={18} />
              <span>Refresh</span>
            </button>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg text-white transition-colors"
              style={{ backgroundColor: colors.primary[500] }}
            >
              Back to App
            </Link>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex gap-2 border-b" style={{ borderColor: colors.gray[200] }}>
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'suggestions', label: 'Suggestions', icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id ? 'border-current' : 'border-transparent'
              }`}
              style={{ 
                color: activeTab === tab.id ? colors.primary[500] : colors.text.secondary,
                fontWeight: activeTab === tab.id ? 600 : 400,
              }}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pb-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Users */}
              <div 
                className="rounded-2xl p-6"
                style={{ 
                  backgroundColor: colors.white,
                  border: `1px solid ${colors.gray[200]}`,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colors.primary[100] }}
                  >
                    <Users size={24} style={{ color: colors.primary[500] }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: colors.text.secondary }}>Total Users</p>
                    <p className="text-3xl font-bold" style={{ color: colors.text.primary }}>
                      {stats?.totalUsers.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Profiles */}
              <div 
                className="rounded-2xl p-6"
                style={{ 
                  backgroundColor: colors.white,
                  border: `1px solid ${colors.gray[200]}`,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colors.secondary[100] }}
                  >
                    <LayoutDashboard size={24} style={{ color: colors.secondary[500] }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: colors.text.secondary }}>Total Profiles</p>
                    <p className="text-3xl font-bold" style={{ color: colors.text.primary }}>
                      {stats?.totalProfiles.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Signups */}
              <div 
                className="rounded-2xl p-6"
                style={{ 
                  backgroundColor: colors.white,
                  border: `1px solid ${colors.gray[200]}`,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colors.accent[100] }}
                  >
                    <UserPlus size={24} style={{ color: colors.accent[500] }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: colors.text.secondary }}>New Users (7d)</p>
                    <p className="text-3xl font-bold" style={{ color: colors.text.primary }}>
                      {stats?.recentSignups.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Views */}
              <div 
                className="rounded-2xl p-6"
                style={{ 
                  backgroundColor: colors.white,
                  border: `1px solid ${colors.gray[200]}`,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colors.primary[100] }}
                  >
                    <Eye size={24} style={{ color: colors.primary[500] }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: colors.text.secondary }}>Total Profile Views</p>
                    <p className="text-3xl font-bold" style={{ color: colors.text.primary }}>
                      {stats?.totalViews.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Clicks */}
              <div 
                className="rounded-2xl p-6"
                style={{ 
                  backgroundColor: colors.white,
                  border: `1px solid ${colors.gray[200]}`,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colors.secondary[100] }}
                  >
                    <MousePointer size={24} style={{ color: colors.secondary[500] }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: colors.text.secondary }}>Total Link Clicks</p>
                    <p className="text-3xl font-bold" style={{ color: colors.text.primary }}>
                      {stats?.totalClicks.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Suggestions */}
              <div 
                className="rounded-2xl p-6"
                style={{ 
                  backgroundColor: colors.white,
                  border: `1px solid ${colors.gray[200]}`,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colors.accent[100] }}
                  >
                    <MessageSquare size={24} style={{ color: colors.accent[500] }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: colors.text.secondary }}>Feature Suggestions</p>
                    <p className="text-3xl font-bold" style={{ color: colors.text.primary }}>
                      {stats?.totalSuggestions.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search 
                  size={20} 
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: colors.gray[400] }}
                />
                <input
                  type="text"
                  placeholder="Search by name, email, or handle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    backgroundColor: colors.white,
                    borderColor: colors.gray[200],
                    color: colors.text.primary,
                  }}
                />
              </div>
              <button
                onClick={searchUsers}
                className="px-6 py-3 rounded-xl text-white font-medium transition-colors"
                style={{ backgroundColor: colors.primary[500] }}
              >
                Search
              </button>
            </div>

            {/* Users Table */}
            <div 
              className="rounded-2xl overflow-hidden"
              style={{ 
                backgroundColor: colors.white,
                border: `1px solid ${colors.gray[200]}`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              }}
            >
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: colors.gray[100] }}>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.text.secondary }}>
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.text.secondary }}>
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.text.secondary }}>
                      Handle
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.text.secondary }}>
                      Profile URL
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.text.secondary }}>
                      Date Joined
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center" style={{ color: colors.text.secondary }}>
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user, idx) => (
                      <tr 
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors"
                        style={{ 
                          borderBottom: idx < users.length - 1 ? `1px solid ${colors.gray[200]}` : undefined 
                        }}
                      >
                        <td className="px-6 py-4">
                          <span className="font-medium" style={{ color: colors.text.primary }}>
                            {user.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm" style={{ color: colors.text.primary }}>
                            {user.email}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm" style={{ color: colors.text.secondary }}>
                            @{user.handle}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {user.profileUrl ? (
                            <a
                              href={user.profileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm hover:underline"
                              style={{ color: colors.primary[500] }}
                            >
                              <span>View Profile</span>
                              <ExternalLink size={14} />
                            </a>
                          ) : (
                            <span className="text-sm" style={{ color: colors.gray[400] }}>—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm" style={{ color: colors.text.secondary }}>
                            {user.dateJoined ? formatDate(user.dateJoined) : '—'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <p className="text-sm" style={{ color: colors.text.secondary }}>
              Showing {users.length} users
            </p>
          </div>
        )}

        {/* Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <div className="space-y-6">
            {/* Filter */}
            <div className="flex items-center gap-4">
              <Filter size={20} style={{ color: colors.gray[400] }} />
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'dashboard', label: 'Dashboard' },
                  { value: 'pricing_page', label: 'Pricing Page' },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => filterSuggestions(filter.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      sourceFilter === filter.value ? 'text-white' : ''
                    }`}
                    style={{ 
                      backgroundColor: sourceFilter === filter.value ? colors.primary[500] : colors.gray[100],
                      color: sourceFilter === filter.value ? colors.white : colors.text.secondary,
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Suggestions Table */}
            <div 
              className="rounded-2xl overflow-hidden"
              style={{ 
                backgroundColor: colors.white,
                border: `1px solid ${colors.gray[200]}`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              }}
            >
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: colors.gray[100] }}>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.text.secondary }}>
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        User Email
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.text.secondary }}>
                      <div className="flex items-center gap-2">
                        <MessageSquare size={16} />
                        Suggestion
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.text.secondary }}>
                      Source
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.text.secondary }}>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        Date
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {suggestions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center" style={{ color: colors.text.secondary }}>
                        No suggestions found
                      </td>
                    </tr>
                  ) : (
                    suggestions.map((suggestion, idx) => (
                      <tr 
                        key={suggestion.id}
                        className="hover:bg-gray-50 transition-colors"
                        style={{ 
                          borderBottom: idx < suggestions.length - 1 ? `1px solid ${colors.gray[200]}` : undefined 
                        }}
                      >
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium" style={{ color: colors.text.primary }}>
                            {suggestion.email}
                          </span>
                        </td>
                        <td className="px-6 py-4 max-w-md">
                          <p className="text-sm whitespace-pre-wrap" style={{ color: colors.text.primary }}>
                            {suggestion.suggestion}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span 
                            className="text-xs px-2 py-1 rounded-full font-medium"
                            style={{ 
                              backgroundColor: suggestion.source === 'pricing_page' ? colors.accent[100] : colors.primary[100],
                              color: suggestion.source === 'pricing_page' ? colors.accent[600] : colors.primary[500],
                            }}
                          >
                            {suggestion.source === 'pricing_page' ? 'Pricing' : 'Dashboard'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm" style={{ color: colors.text.secondary }}>
                            {formatDate(suggestion.createdAt)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <p className="text-sm" style={{ color: colors.text.secondary }}>
              Showing {suggestions.length} suggestions
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
