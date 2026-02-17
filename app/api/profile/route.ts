import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateSession } from '@/lib/auth'
import { z } from 'zod'

// GET /api/profile - Get current user's profile
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
      include: {
        blocks: {
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
    
    return NextResponse.json({
      success: true,
      data: { profile, user },
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get profile' },
      { status: 500 }
    )
  }
}

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  headline: z.string().optional(),
  bio: z.string().optional(),
  photoUrl: z.string().url().optional().nullable(),
  videoUrl: z.string().url().optional().nullable(),
  location: z.string().optional(),
  theme: z.string().optional(),
})

// PUT /api/profile - Update current user's profile
export async function PUT(request: NextRequest) {
  try {
    const user = await validateSession(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const data = updateProfileSchema.parse(body)
    
    // Check if user has pro plan for video
    if (data.videoUrl && user.plan !== 'PRO') {
      return NextResponse.json(
        { success: false, error: 'Video hero is a Pro feature' },
        { status: 403 }
      )
    }
    
    const profile = await prisma.profile.update({
      where: { userId: user.id },
      data,
      include: {
        blocks: {
          orderBy: { order: 'asc' },
        },
      },
    })
    
    return NextResponse.json({
      success: true,
      data: { profile },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Update profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
