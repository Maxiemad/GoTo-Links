import { NextRequest, NextResponse } from 'next/server'
import { getDb, ObjectId } from '../../../lib/mongodb'

export const dynamic = 'force-dynamic'

async function getSessionUser(request: NextRequest) {
  const sessionToken = request.cookies.get('session_token')?.value
  if (!sessionToken) return null
  
  const db = await getDb()
  const session = await db.collection('sessions').findOne({ sessionToken })
  
  if (!session || new Date(session.expiresAt) < new Date()) return null
  
  const user = await db.collection('users').findOne({ _id: new ObjectId(session.userId) })
  if (!user) return null
  
  return {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    handle: user.handle,
    plan: user.plan,
    picture: user.picture,
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const db = await getDb()
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d'
    
    // Get profile
    const profile = await db.collection('profiles').findOne({ userId: user.id })
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    const profileId = profile._id.toString()
    
    // Calculate date ranges based on period
    const now = new Date()
    let daysBack = 7
    if (period === '30d') daysBack = 30
    else if (period === '90d') daysBack = 90
    
    const periodStart = new Date(now)
    periodStart.setDate(periodStart.getDate() - daysBack)
    
    const previousPeriodStart = new Date(periodStart)
    previousPeriodStart.setDate(previousPeriodStart.getDate() - daysBack)
    
    // Get current period stats
    const [profileViews, linkClicks] = await Promise.all([
      db.collection('analytics').countDocuments({
        profileId,
        eventType: 'VIEW',
        timestamp: { $gte: periodStart }
      }),
      db.collection('analytics').countDocuments({
        profileId,
        eventType: 'CLICK',
        timestamp: { $gte: periodStart }
      })
    ])
    
    // Get previous period stats for comparison
    const [prevProfileViews, prevLinkClicks] = await Promise.all([
      db.collection('analytics').countDocuments({
        profileId,
        eventType: 'VIEW',
        timestamp: { $gte: previousPeriodStart, $lt: periodStart }
      }),
      db.collection('analytics').countDocuments({
        profileId,
        eventType: 'CLICK',
        timestamp: { $gte: previousPeriodStart, $lt: periodStart }
      })
    ])
    
    // Get all-time totals
    const [totalViews, totalClicks] = await Promise.all([
      db.collection('analytics').countDocuments({ profileId, eventType: 'VIEW' }),
      db.collection('analytics').countDocuments({ profileId, eventType: 'CLICK' })
    ])
    
    // Calculate percentage changes
    const viewsChange = prevProfileViews > 0 
      ? Math.round(((profileViews - prevProfileViews) / prevProfileViews) * 100) 
      : profileViews > 0 ? 100 : 0
    
    const clicksChange = prevLinkClicks > 0 
      ? Math.round(((linkClicks - prevLinkClicks) / prevLinkClicks) * 100) 
      : linkClicks > 0 ? 100 : 0
    
    // Get top clicked blocks
    const topClickedAgg = await db.collection('analytics').aggregate([
      {
        $match: {
          profileId,
          eventType: 'CLICK',
          blockId: { $ne: null },
          timestamp: { $gte: periodStart }
        }
      },
      {
        $group: {
          _id: '$blockId',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).toArray()
    
    // Get block details for top clicked
    const topLinks = []
    for (const item of topClickedAgg) {
      try {
        const block = await db.collection('blocks').findOne({ 
          _id: new ObjectId(item._id) 
        })
        if (block) {
          topLinks.push({
            id: block._id.toString(),
            title: block.title || 'Untitled',
            type: block.type,
            clicks: item.count,
            percentage: linkClicks > 0 ? Math.round((item.count / linkClicks) * 100) : 0
          })
        }
      } catch (e) {
        // Skip invalid block IDs
      }
    }
    
    // Get daily breakdown for charts
    const dailyData = await db.collection('analytics').aggregate([
      {
        $match: {
          profileId,
          timestamp: { $gte: periodStart }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            eventType: '$eventType'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]).toArray()
    
    // Process daily data into structured format
    const dailyMap: Record<string, { views: number; clicks: number }> = {}
    
    // Initialize all days in range
    for (let i = 0; i < daysBack; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      dailyMap[dateStr] = { views: 0, clicks: 0 }
    }
    
    // Fill in actual data
    for (const item of dailyData) {
      const dateStr = item._id.date
      if (dailyMap[dateStr]) {
        if (item._id.eventType === 'VIEW') {
          dailyMap[dateStr].views = item.count
        } else if (item._id.eventType === 'CLICK') {
          dailyMap[dateStr].clicks = item.count
        }
      }
    }
    
    // Convert to array sorted by date
    const dailyBreakdown = Object.entries(dailyMap)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date))
    
    // Get sparkline data (last 7 days regardless of period)
    const sparklineStart = new Date(now)
    sparklineStart.setDate(sparklineStart.getDate() - 7)
    
    const sparklineData = await db.collection('analytics').aggregate([
      {
        $match: {
          profileId,
          timestamp: { $gte: sparklineStart }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            eventType: '$eventType'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]).toArray()
    
    // Process sparkline data
    const viewsSparkline: number[] = []
    const clicksSparkline: number[] = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const viewItem = sparklineData.find(d => d._id.date === dateStr && d._id.eventType === 'VIEW')
      const clickItem = sparklineData.find(d => d._id.date === dateStr && d._id.eventType === 'CLICK')
      
      viewsSparkline.push(viewItem?.count || 0)
      clicksSparkline.push(clickItem?.count || 0)
    }
    
    // Get referrer breakdown
    const referrerBreakdown = await db.collection('analytics').aggregate([
      {
        $match: {
          profileId,
          eventType: 'VIEW',
          timestamp: { $gte: periodStart }
        }
      },
      {
        $group: {
          _id: '$referrer',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).toArray()
    
    const referrers = referrerBreakdown.map(r => ({
      source: r._id || 'Direct',
      count: r.count,
      percentage: profileViews > 0 ? Math.round((r.count / profileViews) * 100) : 0
    }))
    
    return NextResponse.json({
      success: true,
      data: {
        stats: {
          profileViews,
          linkClicks,
          totalViews,
          totalClicks,
          viewsChange,
          clicksChange,
          period
        },
        topLinks,
        dailyBreakdown,
        sparkline: {
          views: viewsSparkline,
          clicks: clicksSparkline
        },
        referrers
      }
    })
  } catch (error) {
    console.error('Get analytics error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get analytics' },
      { status: 500 }
    )
  }
}
