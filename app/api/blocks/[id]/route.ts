import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateSession } from '@/lib/auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const updateBlockSchema = z.object({
  title: z.string().optional(),
  url: z.string().url().optional(),
  description: z.string().optional(),
  dateRange: z.string().optional(),
  location: z.string().optional(),
  price: z.number().optional(),
  authorName: z.string().optional(),
  authorPhoto: z.string().url().optional(),
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
    
    const block = await prisma.block.findUnique({
      where: { id },
    })
    
    if (!block) {
      return NextResponse.json(
        { success: false, error: 'Block not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: { block },
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
    const user = await validateSession(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const { id } = await params
    const body = await request.json()
    const data = updateBlockSchema.parse(body)
    
    // Verify ownership
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })
    
    const existingBlock = await prisma.block.findUnique({
      where: { id },
    })
    
    if (!existingBlock || existingBlock.profileId !== profile?.id) {
      return NextResponse.json(
        { success: false, error: 'Block not found' },
        { status: 404 }
      )
    }
    
    const block = await prisma.block.update({
      where: { id },
      data,
    })
    
    return NextResponse.json({
      success: true,
      data: { block },
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
    const user = await validateSession(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const { id } = await params
    
    // Verify ownership
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })
    
    const existingBlock = await prisma.block.findUnique({
      where: { id },
    })
    
    if (!existingBlock || existingBlock.profileId !== profile?.id) {
      return NextResponse.json(
        { success: false, error: 'Block not found' },
        { status: 404 }
      )
    }
    
    await prisma.block.delete({
      where: { id },
    })
    
    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Delete block error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete block' },
      { status: 500 }
    )
  }
}
