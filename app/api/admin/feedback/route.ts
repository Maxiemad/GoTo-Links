import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../../lib/mongodb'
import { validateSession, isAdminEmail } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Validate session
    const user = await validateSession(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check admin access - server-side validation using domain
    if (!isAdminEmail(user.email)) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    const db = await getDb()
    const { searchParams } = new URL(request.url)
    const sourceFilter = searchParams.get('source') // 'dashboard', 'pricing_page', or null for all

    // Build filter query
    const filterQuery = sourceFilter ? { source: sourceFilter } : {}

    // Fetch suggestions
    const suggestions = await db.collection('featureSuggestions')
      .find(filterQuery)
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
