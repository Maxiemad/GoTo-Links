import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateSession } from '@/lib/auth'
import { z } from 'zod'

const reorderSchema = z.object({
  blockIds: z.array(z.string()),
})

// POST /api/blocks/reorder - Reorder blocks
export async function POST(request: NextRequest) {
  try {
    const user = await validateSession(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { blockIds } = reorderSchema.parse(body)
    
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    // Update order for each block
    await Promise.all(
      blockIds.map((id, index) =>
        prisma.block.update({
          where: { id, profileId: profile.id },
          data: { order: index },
        })
      )
    )
    
    const blocks = await prisma.block.findMany({
      where: { profileId: profile.id },
      orderBy: { order: 'asc' },
    })
    
    return NextResponse.json({
      success: true,
      data: { blocks },
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
