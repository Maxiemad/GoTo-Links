import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../../lib/mongodb'
import { validateSession } from '../../../../lib/auth'

// Admin email(s) - add your admin emails here
const ADMIN_EMAILS = ['admin@gotolinks.com', 'localtest@test.com', 'analyticstest@test.com']

export async function GET(request: NextRequest) {
  try {
    // Verify user is logged in
    const user = await validateSession(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if admin
    if (!ADMIN_EMAILS.includes(user.email)) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    const db = await getDb()

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
      source: s.source || 'dashboard',
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
