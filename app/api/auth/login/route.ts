import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

export const dynamic = 'force-dynamic'

const SESSION_EXPIRY_DAYS = 7

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    const db = await getDb()
    
    // Find user
    const user = await db.collection('users').findOne({ email })
    
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash)
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Create session
    const sessionToken = `sess_${uuidv4().replace(/-/g, '')}`
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS)
    
    await db.collection('sessions').insertOne({
      userId: user._id.toString(),
      sessionToken,
      expiresAt,
      createdAt: new Date(),
    })
    
    // Set cookie
    const response = NextResponse.json({
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
    
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * SESSION_EXPIRY_DAYS,
    })
    
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to login' },
      { status: 500 }
    )
  }
}
