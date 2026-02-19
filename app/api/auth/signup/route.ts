import { NextRequest, NextResponse } from 'next/server'
import { getDb, toJSON } from '../../../../lib/mongodb'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

export const dynamic = 'force-dynamic'

const SESSION_EXPIRY_DAYS = 7

async function generateUniqueHandle(firstName: string, lastName?: string): Promise<string> {
  const db = await getDb()
  const base = `${firstName}${lastName || ''}`.toLowerCase().replace(/[^a-z0-9]/g, '')
  let handle = base
  let counter = 1
  
  while (await db.collection('users').findOne({ handle })) {
    handle = `${base}${counter}`
    counter++
  }
  
  return handle
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, theme } = body
    
    if (!email || !password || !firstName) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and first name are required' },
        { status: 400 }
      )
    }
    
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }
    
    const db = await getDb()
    
    // Check if user exists
    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      )
    }
    
    // Generate unique handle
    const handle = await generateUniqueHandle(firstName, lastName)
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)
    
    // Create user
    const userResult = await db.collection('users').insertOne({
      email,
      passwordHash,
      firstName,
      lastName: lastName || null,
      handle,
      plan: 'FREE',
      picture: null,
      authProvider: 'EMAIL',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    
    const userId = userResult.insertedId.toString()
    
    // Create default profile
    await db.collection('profiles').insertOne({
      userId,
      name: `${firstName}${lastName ? ' ' + lastName : ''}`,
      headline: null,
      bio: null,
      photoUrl: null,
      videoUrl: null,
      location: null,
      theme: theme || 'zen-minimal',
      customDomain: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    
    // Create session
    const sessionToken = `sess_${uuidv4().replace(/-/g, '')}`
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS)
    
    await db.collection('sessions').insertOne({
      userId,
      sessionToken,
      expiresAt,
      createdAt: new Date(),
    })
    
    // Set cookie
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: userId,
          email,
          firstName,
          lastName: lastName || null,
          handle,
          plan: 'FREE',
          picture: null,
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
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
