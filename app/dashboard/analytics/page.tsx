'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, TrendingDown, Eye, MousePointer, ExternalLink, RefreshCw } from 'lucide-react'

interface AnalyticsData {
  stats: {
    profileViews: number
    linkClicks: number
    totalViews: number
    totalClicks: number
    viewsChange: number
    clicksChange: number
    period: string
  }
  topLinks: Array<{
    id: string
    title: string
    type: string
    clicks: number
    percentage: number
  }>
  dailyBreakdown: Array<{
    date: string
    views: number
    clicks: number
  }>
  sparkline: {
    views: number[]
    clicks: number[]
  }
  referrers: Array<{
    source: string
    count: number
    percentage: number
  }>
}

// Simple Sparkline component
const Sparkline = ({ data, color, height = 30 }: { data: number[]; color: string; height?: number }) => {
  if (!data.length) return null
  
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
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
      />
    </svg>
  )
}

// Line chart component
const LineChart = ({ data, period }: { data: AnalyticsData['dailyBreakdown']; period: string }) => {
  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No data available for this period
      </div>
    )
  }
  
  const maxViews = Math.max(...data.map(d => d.views), 1)
  const maxClicks = Math.max(...data.map(d => d.clicks), 1)
  const maxValue = Math.max(maxViews, maxClicks)
  
  const chartHeight = 200
  const chartWidth = 100
  
  const getPoints = (values: number[], max: number) => {
    return values.map((value, index) => {
      const x = (index / (values.length - 1)) * chartWidth
      const y = chartHeight - (value / max) * chartHeight
      return `${x},${y}`
    }).join(' ')
  }
  
  const viewsPoints = getPoints(data.map(d => d.views), maxValue)
  const clicksPoints = getPoints(data.map(d => d.clicks), maxValue)
  
  // Format date labels
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    if (period === '7d') {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  
  return (
    <div className="relative">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-52 flex flex-col justify-between text-xs text-gray-400 pr-2">
        <span>{maxValue}</span>
        <span>{Math.round(maxValue / 2)}</span>
        <span>0</span>
      </div>
      
      {/* Chart */}
      <div className="ml-10">
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-52"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          <line x1="0" y1="0" x2={chartWidth} y2="0" stroke="#e5e7eb" strokeWidth="0.5" />
          <line x1="0" y1={chartHeight/2} x2={chartWidth} y2={chartHeight/2} stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4" />
          <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#e5e7eb" strokeWidth="0.5" />
          
          {/* Views line */}
          <polyline
            points={viewsPoints}
            fill="none"
            stroke="#FF7043"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Clicks line */}
          <polyline
            points={clicksPoints}
            fill="none"
            stroke="#A18267"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points for views */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * chartWidth
            const y = chartHeight - (d.views / maxValue) * chartHeight
            return (
              <circle
                key={`view-${i}`}
                cx={x}
                cy={y}
                r="3"
                fill="#FF7043"
              />
            )
          })}
          
          {/* Data points for clicks */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * chartWidth
            const y = chartHeight - (d.clicks / maxValue) * chartHeight
            return (
              <circle
                key={`click-${i}`}
                cx={x}
                cy={y}
                r="3"
                fill="#A18267"
              />
            )
          })}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          {data.filter((_, i) => {
            // Show fewer labels for longer periods
            if (period === '7d') return true
            if (period === '30d') return i % 5 === 0 || i === data.length - 1
            return i % 10 === 0 || i === data.length - 1
          }).map((d, i) => (
            <span key={i}>{formatDate(d.date)}</span>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF7043]" />
          <span className="text-sm text-gray-600">Views</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#A18267]" />
          <span className="text-sm text-gray-600">Clicks</span>
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState('7d')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  const fetchAnalytics = async (selectedPeriod: string, isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true)
    else setIsLoading(true)
    
    try {
      const res = await fetch(`/api/analytics?period=${selectedPeriod}`, {
        credentials: 'include',
      })
      const data = await res.json()
      
      if (data.success) {
        setAnalytics(data.data)
      } else if (res.status === 401) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(period)
  }, [period])

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
              <p className="text-sm text-gray-500">Track your profile performance</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Period selector */}
            <div className="flex bg-white rounded-xl shadow-sm p-1">
              {['7d', '30d', '90d'].map((p) => (
                <button
                  key={p}
                  onClick={() => handlePeriodChange(p)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    period === p
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
            
            {/* Refresh button */}
            <button
              onClick={() => fetchAnalytics(period, true)}
              disabled={isRefreshing}
              className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Profile Views Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Profile Views</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {analytics?.stats.profileViews.toLocaleString() || 0}
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                (analytics?.stats.viewsChange || 0) >= 0
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}>
                {(analytics?.stats.viewsChange || 0) >= 0 
                  ? <TrendingUp className="w-4 h-4" />
                  : <TrendingDown className="w-4 h-4" />
                }
                {Math.abs(analytics?.stats.viewsChange || 0)}%
              </div>
            </div>
            
            {/* Sparkline */}
            <div className="h-12 mb-2">
              <Sparkline data={analytics?.sparkline.views || []} color="#FF7043" height={40} />
            </div>
            
            <p className="text-xs text-gray-400">
              Total all time: {analytics?.stats.totalViews.toLocaleString() || 0}
            </p>
          </div>

          {/* Link Clicks Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center">
                  <MousePointer className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Link Clicks</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {analytics?.stats.linkClicks.toLocaleString() || 0}
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                (analytics?.stats.clicksChange || 0) >= 0
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}>
                {(analytics?.stats.clicksChange || 0) >= 0 
                  ? <TrendingUp className="w-4 h-4" />
                  : <TrendingDown className="w-4 h-4" />
                }
                {Math.abs(analytics?.stats.clicksChange || 0)}%
              </div>
            </div>
            
            {/* Sparkline */}
            <div className="h-12 mb-2">
              <Sparkline data={analytics?.sparkline.clicks || []} color="#A18267" height={40} />
            </div>
            
            <p className="text-xs text-gray-400">
              Total all time: {analytics?.stats.totalClicks.toLocaleString() || 0}
            </p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Performance Over Time
          </h2>
          <LineChart data={analytics?.dailyBreakdown || []} period={period} />
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Links */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Top Performing Links
            </h2>
            {analytics?.topLinks && analytics.topLinks.length > 0 ? (
              <div className="space-y-3">
                {analytics.topLinks.map((link, index) => (
                  <div 
                    key={link.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                  >
                    <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{link.title}</p>
                      <p className="text-xs text-gray-500">{link.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{link.clicks}</p>
                      <p className="text-xs text-gray-500">{link.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No click data yet. Share your profile to start tracking!
              </p>
            )}
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Traffic Sources
            </h2>
            {analytics?.referrers && analytics.referrers.length > 0 ? (
              <div className="space-y-3">
                {analytics.referrers.map((ref, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{ref.source}</span>
                        <span className="text-sm text-gray-500">{ref.count} ({ref.percentage}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-400 to-accent-400 rounded-full transition-all duration-500"
                          style={{ width: `${ref.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No referrer data yet. Share your profile to start tracking!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
