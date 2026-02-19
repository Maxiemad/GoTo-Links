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

const updateBlockSchema = z.object({
  title: z.string().optional(),
  url: z.string().optional(),
  description: z.string().optional(),
  dateRange: z.string().optional(),
  location: z.string().optional(),
  price: z.number().optional(),
  authorName: z.string().optional(),
  authorPhoto: z.string().optional(),
  quote: z.string().optional(),
  phone: z.string().optional(),
  isVisible: z.boolean().optional(),
  order: z.number().optional(),
})

// GET /api/blocks/[id] - Get a single block
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const db = await getDb()
    
    let block
    try {
      block = await db.collection('blocks').findOne({ _id: new ObjectId(id) })
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid block ID' },
        { status: 400 }
      )
    }
    
    if (!block) {
      return NextResponse.json(
        { success: false, error: 'Block not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: {
        block: {
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
        }
      },
    })
  } catch (error) {
    console.error('Get block error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get block' },
      { status: 500 }
    )
  }
}

// PUT /api/blocks/[id] - Update a block
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const { id } = await params
    const body = await request.json()
    const data = updateBlockSchema.parse(body)
    
    const db = await getDb()
    
    // Get user's profile
    const profile = await db.collection('profiles').findOne({ userId: user.id })
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    // Verify block exists and belongs to user's profile
    let existingBlock
    try {
      existingBlock = await db.collection('blocks').findOne({ _id: new ObjectId(id) })
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid block ID' },
        { status: 400 }
      )
    }
    
    if (!existingBlock || existingBlock.profileId !== profile._id.toString()) {
      return NextResponse.json(
        { success: false, error: 'Block not found' },
        { status: 404 }
      )
    }
    
    // Update block
    const updateData: Record<string, unknown> = { updatedAt: new Date() }
    if (data.title !== undefined) updateData.title = data.title
    if (data.url !== undefined) updateData.url = data.url
    if (data.description !== undefined) updateData.description = data.description
    if (data.dateRange !== undefined) updateData.dateRange = data.dateRange
    if (data.location !== undefined) updateData.location = data.location
    if (data.price !== undefined) updateData.price = data.price
    if (data.authorName !== undefined) updateData.authorName = data.authorName
    if (data.authorPhoto !== undefined) updateData.authorPhoto = data.authorPhoto
    if (data.quote !== undefined) updateData.quote = data.quote
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.isVisible !== undefined) updateData.isVisible = data.isVisible
    if (data.order !== undefined) updateData.order = data.order
    
    await db.collection('blocks').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    
    const block = await db.collection('blocks').findOne({ _id: new ObjectId(id) })
    
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
    console.error('Update block error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update block' },
      { status: 500 }
    )
  }
}

// DELETE /api/blocks/[id] - Delete a block
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const { id } = await params
    
    const db = await getDb()
    
    // Get user's profile
    const profile = await db.collection('profiles').findOne({ userId: user.id })
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    // Verify block exists and belongs to user's profile
    let existingBlock
    try {
      existingBlock = await db.collection('blocks').findOne({ _id: new ObjectId(id) })
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid block ID' },
        { status: 400 }
      )
    }
    
    if (!existingBlock || existingBlock.profileId !== profile._id.toString()) {
      return NextResponse.json(
        { success: false, error: 'Block not found' },
        { status: 404 }
      )
    }
    
    // Delete block
    await db.collection('blocks').deleteOne({ _id: new ObjectId(id) })
    
    // Also delete related analytics
    await db.collection('analytics').deleteMany({ blockId: id })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete block error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete block' },
      { status: 500 }
    )
  }
}
