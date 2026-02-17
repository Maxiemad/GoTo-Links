import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/profile/[handle] - Get public profile by handle
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params
    
    const user = await prisma.user.findUnique({
      where: { handle },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        handle: true,
        picture: true,
      },
    })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      include: {
        blocks: {
          where: { isVisible: true },
          orderBy: { order: 'asc' },
        },
      },
    })
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    // Track profile view
    await prisma.analytics.create({
      data: {
        userId: user.id,
        eventType: 'PROFILE_VIEW',
        referrer: request.headers.get('referer'),
        userAgent: request.headers.get('user-agent'),
      },
    }).catch(() => {}) // Don't fail if analytics fails
    
    return NextResponse.json({
      success: true,
      data: { profile, user },
    })
  } catch (error) {
    console.error('Get public profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get profile' },
      { status: 500 }
    )
  }
}
