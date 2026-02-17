import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { generateSignature } from '@/lib/cloudinary'

// GET /api/upload/signature - Get Cloudinary upload signature
export async function GET(request: NextRequest) {
  try {
    const user = await validateSession(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const resourceType = (searchParams.get('resource_type') || 'image') as 'image' | 'video'
    const folder = searchParams.get('folder') || `users/${user.id}`
    
    // Check if user can upload videos (Pro only)
    if (resourceType === 'video' && user.plan !== 'PRO') {
      return NextResponse.json(
        { success: false, error: 'Video upload is a Pro feature' },
        { status: 403 }
      )
    }
    
    const signature = generateSignature(folder, resourceType)
    
    return NextResponse.json({
      success: true,
      data: signature,
    })
  } catch (error) {
    console.error('Generate signature error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate upload signature' },
      { status: 500 }
    )
  }
}
