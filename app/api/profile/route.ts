import { NextRequest, NextResponse } from 'next/server'
import { getDb, ObjectId } from '../../../lib/mongodb'

export const dynamic = 'force-dynamic'

async function getSessionUser(request: NextRequest) {
  const sessionToken = request.cookies.get('session_token')?.value
  if (!sessionToken) return null
  
  const db = await getDb()
  const session = await db.collection('sessions').findOne({ sessionToken })
  
  if (!session || new Date(session.expiresAt) < new Date()) return null
  
  const user = await db.collection('users').findOne({ _id: new ObjectId(session.userId) })
  if (!user) return null
  
  return {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    handle: user.handle,
    plan: user.plan,
    picture: user.picture,
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const db = await getDb()
    const profile = await db.collection('profiles').findOne({ userId: user.id })
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    // Get blocks
    const blocks = await db.collection('blocks')
      .find({ profileId: profile._id.toString() })
      .sort({ order: 1 })
      .toArray()
    
    return NextResponse.json({
      success: true,
      data: {
        profile: {
          id: profile._id.toString(),
          userId: profile.userId,
          name: profile.name,
          headline: profile.headline,
          bio: profile.bio,
          photoUrl: profile.photoUrl,
          videoUrl: profile.videoUrl,
          location: profile.location,
          theme: profile.theme,
          customDomain: profile.customDomain,
          blocks: blocks.map(b => ({
            id: b._id.toString(),
            profileId: b.profileId,
            type: b.type,
            order: b.order,
            isVisible: b.isVisible,
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
        },
        user,
      },
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { 
      name, headline, bio, photoUrl, videoUrl, location, theme,
      backgroundImage, backgroundBlur, backgroundBrightness, backgroundOverlayColor
    } = body
    
    // Check if user has pro plan for video
    if (videoUrl && user.plan !== 'PRO') {
      return NextResponse.json(
        { success: false, error: 'Video hero is a Pro feature' },
        { status: 403 }
      )
    }
    
    const db = await getDb()
    
    const updateData: any = { updatedAt: new Date() }
    if (name !== undefined) updateData.name = name
    if (headline !== undefined) updateData.headline = headline
    if (bio !== undefined) updateData.bio = bio
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl
    if (location !== undefined) updateData.location = location
    if (theme !== undefined) updateData.theme = theme
    // Custom background fields
    if (backgroundImage !== undefined) updateData.backgroundImage = backgroundImage
    if (backgroundBlur !== undefined) updateData.backgroundBlur = backgroundBlur
    if (backgroundBrightness !== undefined) updateData.backgroundBrightness = backgroundBrightness
    if (backgroundOverlayColor !== undefined) updateData.backgroundOverlayColor = backgroundOverlayColor
    
    await db.collection('profiles').updateOne(
      { userId: user.id },
      { $set: updateData }
    )
    
    const profile = await db.collection('profiles').findOne({ userId: user.id })
    const blocks = await db.collection('blocks')
      .find({ profileId: profile!._id.toString() })
      .sort({ order: 1 })
      .toArray()
    
    return NextResponse.json({
      success: true,
      data: {
        profile: {
          id: profile!._id.toString(),
          userId: profile!.userId,
          name: profile!.name,
          headline: profile!.headline,
          bio: profile!.bio,
          photoUrl: profile!.photoUrl,
          videoUrl: profile!.videoUrl,
          location: profile!.location,
          theme: profile!.theme,
          customDomain: profile!.customDomain,
          blocks: blocks.map(b => ({
            id: b._id.toString(),
            profileId: b.profileId,
            type: b.type,
            order: b.order,
            isVisible: b.isVisible,
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
        },
      },
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
