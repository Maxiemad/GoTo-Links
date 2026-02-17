import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { v4 as uuidv4 } from 'uuid'

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

interface EmergentAuthResponse {
  id: string
  email: string
  name: string
  picture: string
  session_token: string
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID required' },
        { status: 400 }
      )
    }
    
    // Exchange session_id with Emergent Auth
    const authResponse = await fetch(
      'https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data',
      {
        headers: {
          'X-Session-ID': sessionId,
        },
      }
    )
    
    if (!authResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      )
    }
    
    const authData: EmergentAuthResponse = await authResponse.json()
    
    const db = await getDb()
    
    // Find or create user
    let user = await db.collection('users').findOne({ email: authData.email })
    
    if (!user) {
      // Parse name
      const nameParts = authData.name.split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ') || null
      
      // Generate unique handle
      const handle = await generateUniqueHandle(firstName, lastName || undefined)
      
      // Create new user
      const userResult = await db.collection('users').insertOne({
        email: authData.email,
        passwordHash: null,
        firstName,
        lastName,
        handle,
        picture: authData.picture,
        googleId: authData.id,
        authProvider: 'GOOGLE',
        plan: 'FREE',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      
      const userId = userResult.insertedId.toString()
      
      // Create default profile
      await db.collection('profiles').insertOne({
        userId,
        name: authData.name,
        headline: null,
        bio: null,
        photoUrl: authData.picture,
        videoUrl: null,
        location: null,
        theme: 'zen-minimal',
        customDomain: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      
      user = await db.collection('users').findOne({ _id: userResult.insertedId })
    } else {
      // Update existing user's Google info
      await db.collection('users').updateOne(
        { _id: user._id },
        { 
          $set: { 
            googleId: authData.id,
            picture: authData.picture || user.picture,
            updatedAt: new Date(),
          } 
        }
      )
    }
    
    // Create session
    const sessionToken = `sess_${uuidv4().replace(/-/g, '')}`
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS)
    
    await db.collection('sessions').insertOne({
      userId: user!._id.toString(),
      sessionToken,
      expiresAt,
      createdAt: new Date(),
    })
    
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user!._id.toString(),
          email: user!.email,
          firstName: user!.firstName,
          lastName: user!.lastName,
          handle: user!.handle,
          plan: user!.plan,
          picture: user!.picture,
        },
      },
    })
    
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * SESSION_EXPIRY_DAYS,
    })
    
    return response
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
