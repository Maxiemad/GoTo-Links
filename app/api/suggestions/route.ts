import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../lib/mongodb'
import { validateSession } from '../../../lib/auth'

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
    const user = await validateSession(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Rate limiting
    if (isRateLimited(user.id)) {
      return NextResponse.json(
        { success: false, error: 'Please wait before submitting another suggestion' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { suggestion, source } = body

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

    // Sanitize and store suggestion
    const sanitizedSuggestion = sanitizeText(suggestion)
    const suggestionSource = source === 'pricing_page' ? 'pricing_page' : 'dashboard'

    await db.collection('featureSuggestions').insertOne({
      userId: user.id,
      email: user.email,
      suggestion: sanitizedSuggestion,
      source: suggestionSource,
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
