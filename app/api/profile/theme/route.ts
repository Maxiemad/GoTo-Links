import { NextRequest, NextResponse } from 'next/server'
import { getDb, ObjectId } from '@/lib/mongodb'
import { themes } from '@/lib/themes'

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
    firstName: user.firstName,
    lastName: user.lastName,
    handle: user.handle,
    plan: user.plan,
    picture: user.picture,
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getSessionUser(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { theme } = body
    
    // Validate theme exists
    if (!theme || !themes[theme]) {
      return NextResponse.json(
        { success: false, error: 'Invalid theme' },
        { status: 400 }
      )
    }
    
    const db = await getDb()
    
    // Update profile theme
    const result = await db.collection('profiles').updateOne(
      { userId: user.id },
      { $set: { theme, updatedAt: new Date() } }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: {
        theme,
        themeConfig: themes[theme],
      },
    })
  } catch (error) {
    console.error('Update theme error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update theme' },
      { status: 500 }
    )
  }
}
