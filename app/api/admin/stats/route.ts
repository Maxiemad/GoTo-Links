import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../../lib/mongodb'
import { validateSession, isAdminEmail } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Validate session
    const user = await validateSession(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check admin access - server-side validation
    if (!isAdminEmail(user.email)) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    const db = await getDb()

    // Get total users
    const totalUsers = await db.collection('users').countDocuments()

    // Get total profiles
    const totalProfiles = await db.collection('profiles').countDocuments()

    // Get total profile views (platform-wide)
    const viewsResult = await db.collection('analytics').aggregate([
      { $match: { eventType: 'VIEW' } },
      { $count: 'total' }
    ]).toArray()
    const totalViews = viewsResult[0]?.total || 0

    // Get total link clicks (platform-wide)
    const clicksResult = await db.collection('analytics').aggregate([
      { $match: { eventType: 'CLICK' } },
      { $count: 'total' }
    ]).toArray()
    const totalClicks = clicksResult[0]?.total || 0

    // Get recent signups (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentSignups = await db.collection('users').countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    })

    // Get total suggestions
    const totalSuggestions = await db.collection('featureSuggestions').countDocuments()

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalProfiles,
        totalViews,
        totalClicks,
        recentSignups,
        totalSuggestions,
      },
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
