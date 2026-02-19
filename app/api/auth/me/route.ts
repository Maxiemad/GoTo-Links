import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../../lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get session token from cookie
    const sessionToken = request.cookies.get('session_token')?.value
    
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const db = await getDb()
    
    // Find session
    const session = await db.collection('sessions').findOne({ sessionToken })
    
    if (!session || new Date(session.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Session expired' },
        { status: 401 }
      )
    }
    
    // Find user
    const { ObjectId } = await import('mongodb')
    const user = await db.collection('users').findOne({ _id: new ObjectId(session.userId) })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          handle: user.handle,
          plan: user.plan,
          picture: user.picture,
        },
      },
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 401 }
    )
  }
}
