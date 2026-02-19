import { NextRequest, NextResponse } from 'next/server'
import { getDb, ObjectId } from '@/lib/mongodb'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const trackSchema = z.object({
  profileId: z.string(),
  blockId: z.string().optional(),
  eventType: z.enum(['VIEW', 'CLICK']),
})

// POST /api/analytics/track - Track a view or click event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profileId, blockId, eventType } = trackSchema.parse(body)
    
    const db = await getDb()
    
    // Verify profile exists
    const profile = await db.collection('profiles').findOne({ 
      $or: [
        { _id: new ObjectId(profileId) },
        { userId: profileId }
      ]
    })
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    // If blockId provided, verify it exists
    if (blockId) {
      const block = await db.collection('blocks').findOne({ 
        _id: new ObjectId(blockId),
        profileId: profile._id.toString()
      })
      
      if (!block) {
        return NextResponse.json(
          { success: false, error: 'Block not found' },
          { status: 404 }
        )
      }
    }
    
    // Create analytics event
    await db.collection('analytics').insertOne({
      profileId: profile._id.toString(),
      userId: profile.userId,
      blockId: blockId || null,
      eventType,
      referrer: request.headers.get('referer') || null,
      userAgent: request.headers.get('user-agent') || null,
      timestamp: new Date(),
      createdAt: new Date(),
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
