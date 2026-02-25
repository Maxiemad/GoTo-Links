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

    // Check admin access - server-side validation
    if (!isAdminEmail(user.email)) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    const db = await getDb()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    // Build search query
    const searchQuery = search
      ? {
          $or: [
            { email: { $regex: search, $options: 'i' } },
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { handle: { $regex: search, $options: 'i' } },
          ],
        }
      : {}

    // Get users with pagination
    const users = await db.collection('users')
      .find(searchQuery, {
        projection: {
          _id: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          handle: 1,
          createdAt: 1,
          plan: 1,
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get total count for pagination
    const totalCount = await db.collection('users').countDocuments(searchQuery)

    // Format users for response (exclude MongoDB _id)
    const formattedUsers = users.map(u => ({
      id: u._id.toString(),
      email: u.email,
      name: [u.firstName, u.lastName].filter(Boolean).join(' ') || 'N/A',
      handle: u.handle,
      profileUrl: u.handle ? `/profile/${u.handle}` : null,
      dateJoined: u.createdAt,
      plan: u.plan || 'FREE',
    }))

    return NextResponse.json({
      success: true,
      data: {
        users: formattedUsers,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
