import { NextRequest, NextResponse } from 'next/server'
import { getDb, ObjectId } from '../../../lib/mongodb'
import { z } from 'zod'

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
    handle: user.handle,
  }
}

const blockSchema = z.object({
  type: z.enum(['LINK', 'RETREAT', 'TESTIMONIAL', 'BOOK_CALL', 'WHATSAPP', 'TELEGRAM', 'SOCIAL']),
  title: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  dateRange: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  price: z.number().nullable().optional(),
  authorName: z.string().nullable().optional(),
  authorPhoto: z.string().nullable().optional(),
  quote: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  isVisible: z.boolean().optional().default(true),
})

// GET /api/blocks - Get all blocks for current user's profile
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
    
    const profile = await db.collection('profiles').findOne({ userId: user.id })
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    const blocks = await db.collection('blocks')
      .find({ profileId: profile._id.toString() })
      .sort({ order: 1 })
      .toArray()
    
    const formattedBlocks = blocks.map(block => ({
      id: block._id.toString(),
      profileId: block.profileId,
      type: block.type,
      title: block.title,
      url: block.url,
      description: block.description,
      dateRange: block.dateRange,
      location: block.location,
      price: block.price,
      authorName: block.authorName,
      authorPhoto: block.authorPhoto,
      quote: block.quote,
      phone: block.phone,
      isVisible: block.isVisible,
      order: block.order,
      createdAt: block.createdAt,
      updatedAt: block.updatedAt,
    }))
    
    return NextResponse.json({
      success: true,
      data: { blocks: formattedBlocks },
    })
  } catch (error) {
    console.error('Get blocks error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get blocks' },
      { status: 500 }
    )
  }
}

// POST /api/blocks - Create a new block
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const data = blockSchema.parse(body)
    
    const db = await getDb()
    
    const profile = await db.collection('profiles').findOne({ userId: user.id })
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    const profileId = profile._id.toString()
    
    // Get max order
    const maxOrderBlock = await db.collection('blocks')
      .find({ profileId })
      .sort({ order: -1 })
      .limit(1)
      .toArray()
    
    const maxOrder = maxOrderBlock.length > 0 ? maxOrderBlock[0].order : -1
    
    const now = new Date()
    const result = await db.collection('blocks').insertOne({
      profileId,
      type: data.type,
      title: data.title || null,
      url: data.url || null,
      description: data.description || null,
      dateRange: data.dateRange || null,
      location: data.location || null,
      price: data.price || null,
      authorName: data.authorName || null,
      authorPhoto: data.authorPhoto || null,
      quote: data.quote || null,
      phone: data.phone || null,
      isVisible: data.isVisible ?? true,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    })
    
    const block = await db.collection('blocks').findOne({ _id: result.insertedId })
    
    return NextResponse.json({
      success: true,
      data: {
        block: {
          id: block!._id.toString(),
          profileId: block!.profileId,
          type: block!.type,
          title: block!.title,
          url: block!.url,
          description: block!.description,
          dateRange: block!.dateRange,
          location: block!.location,
          price: block!.price,
          authorName: block!.authorName,
          authorPhoto: block!.authorPhoto,
          quote: block!.quote,
          phone: block!.phone,
          isVisible: block!.isVisible,
          order: block!.order,
          createdAt: block!.createdAt,
          updatedAt: block!.updatedAt,
        }
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Create block error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create block' },
      { status: 500 }
    )
  }
}
