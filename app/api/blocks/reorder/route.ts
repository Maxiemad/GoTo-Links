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
      console.log('[Block Reorder] Auth failed - no user session')
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { blockIds } = reorderSchema.parse(body)
    
    console.log(`[Block Reorder] User: ${user.id}, Block IDs:`, blockIds)
    
    const db = await getDb()
    
    const profile = await db.collection('profiles').findOne({ userId: user.id })
    
    if (!profile) {
      console.log(`[Block Reorder] Profile not found for user: ${user.id}`)
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    const profileId = profile._id.toString()
    
    // Validate all block IDs belong to this profile before updating
    const existingBlocks = await db.collection('blocks')
      .find({ profileId })
      .toArray()
    
    const existingBlockIds = new Set(existingBlocks.map(b => b._id.toString()))
    const invalidIds = blockIds.filter(id => !existingBlockIds.has(id))
    
    if (invalidIds.length > 0) {
      console.log(`[Block Reorder] Invalid block IDs detected:`, invalidIds)
      return NextResponse.json(
        { success: false, error: 'One or more block IDs are invalid' },
        { status: 400 }
      )
    }
    
    // Update order for each block using bulkWrite for efficiency
    const now = new Date()
    const bulkOps = blockIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(id), profileId },
        update: { $set: { order: index, updatedAt: now } },
      },
    }))
    
    if (bulkOps.length > 0) {
      const bulkResult = await db.collection('blocks').bulkWrite(bulkOps)
      console.log(`[Block Reorder] Bulk update result: matched=${bulkResult.matchedCount}, modified=${bulkResult.modifiedCount}`)
      
      if (bulkResult.matchedCount !== blockIds.length) {
        console.log(`[Block Reorder] Warning: Not all blocks were matched. Expected ${blockIds.length}, got ${bulkResult.matchedCount}`)
      }
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
    
    console.log(`[Block Reorder] Success - returning ${formattedBlocks.length} blocks`)
    
    return NextResponse.json({
      success: true,
      data: { blocks: formattedBlocks },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(`[Block Reorder] Validation error:`, error.errors)
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('[Block Reorder] Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reorder blocks' },
      { status: 500 }
    )
  }
}
