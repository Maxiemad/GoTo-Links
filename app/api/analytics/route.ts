import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateSession } from '@/lib/auth'

// GET /api/analytics - Get analytics for current user
export async function GET(request: NextRequest) {
  try {
    const user = await validateSession(request)
    
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
    
    // Get profile views
    const profileViews = await prisma.analytics.count({
      where: {
        userId: user.id,
        eventType: 'PROFILE_VIEW',
        createdAt: { gte: startDate },
      },
    })
    
    // Get link clicks
    const linkClicks = await prisma.analytics.count({
      where: {
        userId: user.id,
        eventType: { in: ['LINK_CLICK', 'RETREAT_CLICK', 'BOOK_CALL_CLICK', 'SOCIAL_CLICK'] },
        createdAt: { gte: startDate },
      },
    })
    
    // Get top clicked link
    const topClickedData = await prisma.analytics.groupBy({
      by: ['blockId'],
      where: {
        userId: user.id,
        blockId: { not: null },
        eventType: { in: ['LINK_CLICK', 'RETREAT_CLICK', 'BOOK_CALL_CLICK', 'SOCIAL_CLICK'] },
        createdAt: { gte: startDate },
      },
      _count: true,
      orderBy: { _count: { blockId: 'desc' } },
      take: 1,
    })
    
    let topClickedLink = null
    if (topClickedData.length > 0 && topClickedData[0].blockId) {
      const block = await prisma.block.findUnique({
        where: { id: topClickedData[0].blockId },
      })
      if (block) {
        topClickedLink = {
          title: block.title || 'Untitled',
          clicks: topClickedData[0]._count,
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
