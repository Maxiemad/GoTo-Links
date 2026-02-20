import { NextRequest, NextResponse } from 'next/server'
import { getDb, ObjectId } from '../../../../lib/mongodb'
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

// POST - Reorder sections
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { sectionIds } = body

    if (!sectionIds || !Array.isArray(sectionIds)) {
      return NextResponse.json({ success: false, error: 'Invalid sectionIds' }, { status: 400 })
    }

    const db = await getDb()
    const profile = await db.collection('profiles').findOne({ userId: user._id.toString() })
    
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
    }

    const sections = profile.sections || []
    
    // Create a map of existing sections
    const sectionMap = new Map(sections.map((s: any) => [s.id, s]))
    
    // Reorder based on sectionIds array
    const reorderedSections = sectionIds
      .filter((id: string) => sectionMap.has(id))
      .map((id: string, index: number) => {
        const section = sectionMap.get(id) as any
        return { ...section, order: index, updatedAt: new Date() }
      })

    await db.collection('profiles').updateOne(
      { _id: profile._id },
      { 
        $set: { 
          sections: reorderedSections,
          updatedAt: new Date() 
        }
      }
    )

    return NextResponse.json({
      success: true,
      data: { sections: reorderedSections }
    })
  } catch (error) {
    console.error('Reorder sections error:', error)
    return NextResponse.json({ success: false, error: 'Failed to reorder sections' }, { status: 500 })
  }
}
