import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../../lib/mongodb'
import { verifySession, getSessionFromCookies } from '../../../../lib/auth'

// Admin email(s) - add your admin emails here
const ADMIN_EMAILS = ['admin@gotolinks.com', 'localtest@test.com', 'analyticstest@test.com']

export async function GET(request: NextRequest) {
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

    const db = await getDb()
    
    // Get user and check if admin
    const user = await db.collection('users').findOne(
      { _id: { $eq: session.userId } },
      { projection: { email: 1 } }
    )

    if (!user || !ADMIN_EMAILS.includes(user.email)) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Fetch all suggestions
    const suggestions = await db.collection('featureSuggestions')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    // Remove MongoDB _id from response
    const sanitizedSuggestions = suggestions.map(s => ({
      id: s._id.toString(),
      email: s.email,
      suggestion: s.suggestion,
      createdAt: s.createdAt,
    }))

    return NextResponse.json({
      success: true,
      data: {
        suggestions: sanitizedSuggestions,
        total: sanitizedSuggestions.length,
      },
    })
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}
