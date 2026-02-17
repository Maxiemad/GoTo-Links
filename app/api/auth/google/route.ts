import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createSession, generateUniqueHandle } from '@/lib/auth'

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH

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
    
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: authData.email },
    })
    
    if (!user) {
      // Parse name
      const nameParts = authData.name.split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ') || null
      
      // Generate unique handle
      const handle = await generateUniqueHandle(firstName, lastName || undefined)
      
      // Create new user
      user = await prisma.user.create({
        data: {
          email: authData.email,
          firstName,
          lastName,
          handle,
          picture: authData.picture,
          googleId: authData.id,
          authProvider: 'GOOGLE',
        },
      })
      
      // Create default profile
      await prisma.profile.create({
        data: {
          userId: user.id,
          name: authData.name,
          theme: 'zen-minimal',
          photoUrl: authData.picture,
        },
      })
    } else {
      // Update existing user's Google info
      await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: authData.id,
          picture: authData.picture || user.picture,
        },
      })
    }
    
    // Create our own session
    const sessionToken = await createSession(user.id)
    
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
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
