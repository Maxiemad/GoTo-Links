import { NextRequest, NextResponse } from 'next/server'
import { getDb, ObjectId } from '@/lib/mongodb'

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
    
    // Get profile
    const profile = await db.collection('profiles').findOne({ userId: user.id })
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    const profileId = profile._id.toString()
    
    // Calculate date 7 days ago
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    // Get profile views in last 7 days
    const profileViews = await db.collection('analytics').countDocuments({
      profileId,
      eventType: 'VIEW',
      timestamp: { $gte: sevenDaysAgo }
    })
    
    // Get link clicks in last 7 days
    const linkClicks = await db.collection('analytics').countDocuments({
      profileId,
      eventType: 'CLICK',
      timestamp: { $gte: sevenDaysAgo }
    })
    
    // Get top clicked block
    const topClickedAgg = await db.collection('analytics').aggregate([
      {
        $match: {
          profileId,
          eventType: 'CLICK',
          blockId: { $ne: null },
          timestamp: { $gte: sevenDaysAgo }
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
    if (topClickedAgg.length > 0) {
      const block = await db.collection('blocks').findOne({ 
        _id: new ObjectId(topClickedAgg[0]._id) 
      })
      if (block) {
        topClickedLink = {
          id: block._id.toString(),
          title: block.title,
          clicks: topClickedAgg[0].count
        }
      }
    }
    
    // Get daily views for chart (last 7 days)
    const dailyViews = await db.collection('analytics').aggregate([
      {
        $match: {
          profileId,
          eventType: 'VIEW',
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray()
    
    return NextResponse.json({
      success: true,
      data: {
        stats: {
          profileViews,
          linkClicks,
          topClickedLink,
          period: '7d'
        },
        dailyViews: dailyViews.map(d => ({ date: d._id, views: d.count }))
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
