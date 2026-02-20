import { NextRequest, NextResponse } from 'next/server'
import { getDb, ObjectId } from '../../../lib/mongodb'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// Helper to get user from session
async function getUserFromSession() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session_token')?.value
  
  if (!sessionToken) return null
  
  const db = await getDb()
  const session = await db.collection('sessions').findOne({ 
    sessionToken,
    expiresAt: { $gt: new Date() }
  })
  
  if (!session) return null
  
  const user = await db.collection('users').findOne({ _id: new ObjectId(session.userId) })
  return user
}

// GET - Get all sections for the current user's profile
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromSession()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const db = await getDb()
    const profile = await db.collection('profiles').findOne({ userId: user._id.toString() })
    
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
    }

    const sections = profile.sections || []
    
    return NextResponse.json({
      success: true,
      data: { sections: sections.sort((a: any, b: any) => a.order - b.order) }
    })
  } catch (error) {
    console.error('Get sections error:', error)
    return NextResponse.json({ success: false, error: 'Failed to get sections' }, { status: 500 })
  }
}

// POST - Add a new section
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json({ success: false, error: 'Missing type or data' }, { status: 400 })
    }

    const db = await getDb()
    const profile = await db.collection('profiles').findOne({ userId: user._id.toString() })
    
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
    }

    const existingSections = profile.sections || []
    const newSection = {
      id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      order: existingSections.length,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection('profiles').updateOne(
      { _id: profile._id },
      { 
        $push: { sections: newSection } as any,
        $set: { updatedAt: new Date() }
      }
    )

    return NextResponse.json({
      success: true,
      data: { section: newSection }
    })
  } catch (error) {
    console.error('Add section error:', error)
    return NextResponse.json({ success: false, error: 'Failed to add section' }, { status: 500 })
  }
}

// PUT - Update a section
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromSession()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { sectionId, data, enabled, order } = body

    if (!sectionId) {
      return NextResponse.json({ success: false, error: 'Missing sectionId' }, { status: 400 })
    }

    const db = await getDb()
    const profile = await db.collection('profiles').findOne({ userId: user._id.toString() })
    
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
    }

    const sections = profile.sections || []
    const sectionIndex = sections.findIndex((s: any) => s.id === sectionId)
    
    if (sectionIndex === -1) {
      return NextResponse.json({ success: false, error: 'Section not found' }, { status: 404 })
    }

    // Update the section
    if (data !== undefined) sections[sectionIndex].data = data
    if (enabled !== undefined) sections[sectionIndex].enabled = enabled
    if (order !== undefined) sections[sectionIndex].order = order
    sections[sectionIndex].updatedAt = new Date()

    await db.collection('profiles').updateOne(
      { _id: profile._id },
      { 
        $set: { 
          sections: sections,
          updatedAt: new Date() 
        }
      }
    )

    return NextResponse.json({
      success: true,
      data: { section: sections[sectionIndex] }
    })
  } catch (error) {
    console.error('Update section error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update section' }, { status: 500 })
  }
}

// DELETE - Delete a section
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromSession()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sectionId = searchParams.get('sectionId')

    if (!sectionId) {
      return NextResponse.json({ success: false, error: 'Missing sectionId' }, { status: 400 })
    }

    const db = await getDb()
    const profile = await db.collection('profiles').findOne({ userId: user._id.toString() })
    
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
    }

    const sections = (profile.sections || []).filter((s: any) => s.id !== sectionId)
    
    // Reorder remaining sections
    sections.forEach((s: any, i: number) => { s.order = i })

    await db.collection('profiles').updateOne(
      { _id: profile._id },
      { 
        $set: { 
          sections: sections,
          updatedAt: new Date() 
        }
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete section error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete section' }, { status: 500 })
  }
}
