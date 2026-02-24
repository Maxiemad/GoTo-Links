import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../../lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params
    
    const db = await getDb()
    const user = await db.collection('users').findOne({ handle })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    const profile = await db.collection('profiles').findOne({ userId: user._id.toString() })
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    // Get visible blocks
    const blocks = await db.collection('blocks')
      .find({ profileId: profile._id.toString(), isVisible: true })
      .sort({ order: 1 })
      .toArray()
    
    // Get enabled sections
    const sections = profile.sections 
      ? profile.sections.filter((s: any) => s.enabled).sort((a: any, b: any) => a.order - b.order)
      : []
    
    // Track profile view
    await db.collection('analytics').insertOne({
      userId: user._id.toString(),
      blockId: null,
      eventType: 'PROFILE_VIEW',
      referrer: request.headers.get('referer'),
      userAgent: request.headers.get('user-agent'),
      createdAt: new Date(),
    }).catch(() => {})
    
    return NextResponse.json({
      success: true,
      data: {
        profile: {
          id: profile._id.toString(),
          name: profile.name,
          headline: profile.headline,
          bio: profile.bio,
          photoUrl: profile.photoUrl,
          videoUrl: profile.videoUrl,
          location: profile.location,
          theme: profile.theme,
          backgroundImage: profile.backgroundImage,
          backgroundBlur: profile.backgroundBlur,
          backgroundBrightness: profile.backgroundBrightness,
          backgroundOverlayColor: profile.backgroundOverlayColor,
          blocks: blocks.map(b => ({
            id: b._id.toString(),
            type: b.type,
            title: b.title,
            url: b.url,
            description: b.description,
            dateRange: b.dateRange,
            location: b.location,
            price: b.price,
            authorName: b.authorName,
            authorPhoto: b.authorPhoto,
            quote: b.quote,
            phone: b.phone,
          })),
          sections: sections,
        },
        user: {
          handle: user.handle,
          picture: user.picture,
        },
      },
    })
  } catch (error) {
    console.error('Get public profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get profile' },
      { status: 500 }
    )
  }
}
