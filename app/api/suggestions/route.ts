import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../lib/mongodb'
import { verifySession, getSessionFromCookies } from '../../../lib/auth'

// In-memory rate limiting (simple approach)
const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3

function isRateLimited(userId: string): boolean {
  const now = Date.now()
  const lastRequest = rateLimitMap.get(userId)
  
  if (lastRequest && (now - lastRequest) < RATE_LIMIT_WINDOW) {
    return true
  }
  
  rateLimitMap.set(userId, now)
  return false
}

// Sanitize text to prevent XSS
function sanitizeText(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

// POST - Submit a feature suggestion
export async function POST(request: NextRequest) {
  try {
    // Verify user is logged in
    const sessionToken = getSessionFromCookies()
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const session = await verifySession(sessionToken)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      )
    }

    // Rate limiting
    if (isRateLimited(session.userId)) {
      return NextResponse.json(
        { success: false, error: 'Please wait before submitting another suggestion' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { suggestion } = body

    // Validate input
    if (!suggestion || typeof suggestion !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Suggestion is required' },
        { status: 400 }
      )
    }

    // Validate length
    if (suggestion.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Suggestion must be at least 10 characters' },
        { status: 400 }
      )
    }

    if (suggestion.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Suggestion must be 500 characters or less' },
        { status: 400 }
      )
    }

    const db = await getDb()
    
    // Get user email
    const user = await db.collection('users').findOne(
      { _id: { $eq: session.userId } },
      { projection: { email: 1 } }
    )

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Sanitize and store suggestion
    const sanitizedSuggestion = sanitizeText(suggestion)

    await db.collection('featureSuggestions').insertOne({
      userId: session.userId,
      email: user.email,
      suggestion: sanitizedSuggestion,
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: 'Thank you for your suggestion!',
    })
  } catch (error) {
    console.error('Error submitting suggestion:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit suggestion' },
      { status: 500 }
    )
  }
}
