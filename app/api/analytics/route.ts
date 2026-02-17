import { NextRequest, NextResponse } from 'next/server'
import { getDb, ObjectId } from '@/lib/mongodb'

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
    
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d'
    
    // Calculate date range
    const now = new Date()
    let startDate: Date
    
    switch (period) {
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'all':
        startDate = new Date(0)
        break
      default: // 7d
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }
    
    const db = await getDb()
    
    // Get profile views
    const profileViews = await db.collection('analytics').countDocuments({
      userId: user.id,
      eventType: 'PROFILE_VIEW',
      createdAt: { $gte: startDate },
    })
    
    // Get link clicks
    const linkClicks = await db.collection('analytics').countDocuments({
      userId: user.id,
      eventType: { $in: ['LINK_CLICK', 'RETREAT_CLICK', 'BOOK_CALL_CLICK', 'SOCIAL_CLICK'] },
      createdAt: { $gte: startDate },
    })
    
    // Get top clicked link
    const topClickedData = await db.collection('analytics').aggregate([
      {
        $match: {
          userId: user.id,
          blockId: { $ne: null },
          eventType: { $in: ['LINK_CLICK', 'RETREAT_CLICK', 'BOOK_CALL_CLICK', 'SOCIAL_CLICK'] },
          createdAt: { $gte: startDate },
        }
      },
      {
        $group: {
          _id: '$blockId',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]).toArray()
    
    let topClickedLink = null
    if (topClickedData.length > 0 && topClickedData[0]._id) {
      const block = await db.collection('blocks').findOne({ _id: new ObjectId(topClickedData[0]._id) })
      if (block) {
        topClickedLink = {
          title: block.title || 'Untitled',
          clicks: topClickedData[0].count,
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        stats: {
          profileViews,
          linkClicks,
          topClickedLink,
          period,
        },
      },
    })
  } catch (error) {
    console.error('Get analytics error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get analytics' },
      { status: 500 }
    )
  }
}
