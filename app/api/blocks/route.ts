import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateSession } from '@/lib/auth'
import { z } from 'zod'

const blockSchema = z.object({
  type: z.enum(['LINK', 'RETREAT', 'TESTIMONIAL', 'BOOK_CALL', 'WHATSAPP', 'TELEGRAM', 'SOCIAL']),
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
})

// GET /api/blocks - Get all blocks for current user's profile
export async function GET(request: NextRequest) {
  try {
    const user = await validateSession(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    const blocks = await prisma.block.findMany({
      where: { profileId: profile.id },
      orderBy: { order: 'asc' },
    })
    
    return NextResponse.json({
      success: true,
      data: { blocks },
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
    const user = await validateSession(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const data = blockSchema.parse(body)
    
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    // Get max order
    const maxOrder = await prisma.block.aggregate({
      where: { profileId: profile.id },
      _max: { order: true },
    })
    
    const block = await prisma.block.create({
      data: {
        profileId: profile.id,
        order: (maxOrder._max.order ?? -1) + 1,
        ...data,
      },
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
    console.error('Create block error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create block' },
      { status: 500 }
    )
  }
}
