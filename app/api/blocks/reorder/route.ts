import { NextRequest, NextResponse } from 'next/server'
import { getDb, ObjectId } from '../../../../lib/mongodb'
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

const reorderSchema = z.object({
  blockIds: z.array(z.string()),
})

// POST /api/blocks/reorder - Reorder blocks
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
    const { blockIds } = reorderSchema.parse(body)
    
    const db = await getDb()
    
    const profile = await db.collection('profiles').findOne({ userId: user.id })
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    const profileId = profile._id.toString()
    
    // Update order for each block using bulkWrite for efficiency
    const bulkOps = blockIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(id), profileId },
        update: { $set: { order: index, updatedAt: new Date() } },
      },
    }))
    
    if (bulkOps.length > 0) {
      await db.collection('blocks').bulkWrite(bulkOps)
    }
    
    // Fetch updated blocks sorted by order
    const blocks = await db.collection('blocks')
      .find({ profileId })
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Reorder blocks error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reorder blocks' },
      { status: 500 }
    )
  }
}
