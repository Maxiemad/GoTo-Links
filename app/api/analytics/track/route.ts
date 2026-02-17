import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const trackSchema = z.object({
  blockId: z.string(),
  eventType: z.enum(['LINK_CLICK', 'RETREAT_CLICK', 'BOOK_CALL_CLICK', 'SOCIAL_CLICK']),
})

// POST /api/analytics/track - Track a click event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { blockId, eventType } = trackSchema.parse(body)
    
    // Get block to find userId
    const block = await prisma.block.findUnique({
      where: { id: blockId },
      include: { profile: true },
    })
    
    if (!block) {
      return NextResponse.json(
        { success: false, error: 'Block not found' },
        { status: 404 }
      )
    }
    
    // Create analytics event
    await prisma.analytics.create({
      data: {
        userId: block.profile.userId,
        blockId,
        eventType,
        referrer: request.headers.get('referer'),
        userAgent: request.headers.get('user-agent'),
      },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Track analytics error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    )
  }
}
