import { NextRequest, NextResponse } from 'next/server'
import { getDb, ObjectId } from '../../../../lib/mongodb'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const trackSchema = z.object({
  profileId: z.string(),
  blockId: z.string().optional(),
  eventType: z.enum(['VIEW', 'CLICK']),
  referrer: z.string().optional(),
})

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_WINDOW = 5000 // 5 seconds

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const lastRequest = rateLimitMap.get(key)
  
  if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW) {
    return true
  }
  
  rateLimitMap.set(key, now)
  
  // Clean old entries periodically
  if (rateLimitMap.size > 10000) {
    const cutoff = now - RATE_LIMIT_WINDOW * 2
    for (const [k, v] of rateLimitMap) {
      if (v < cutoff) rateLimitMap.delete(k)
    }
  }
  
  return false
}

// Parse referrer to get source
function parseReferrer(referrer: string | null): string {
  if (!referrer) return 'Direct'
  
  try {
    const url = new URL(referrer)
    const hostname = url.hostname.toLowerCase()
    
    if (hostname.includes('instagram')) return 'Instagram'
    if (hostname.includes('facebook')) return 'Facebook'
    if (hostname.includes('twitter') || hostname.includes('x.com')) return 'Twitter/X'
    if (hostname.includes('linkedin')) return 'LinkedIn'
    if (hostname.includes('tiktok')) return 'TikTok'
    if (hostname.includes('youtube')) return 'YouTube'
    if (hostname.includes('google')) return 'Google'
    if (hostname.includes('pinterest')) return 'Pinterest'
    if (hostname.includes('whatsapp')) return 'WhatsApp'
    if (hostname.includes('telegram')) return 'Telegram'
    return hostname
  } catch {
    return 'Unknown'
  }
}

// Parse device type from user agent
function parseDevice(userAgent: string | null): string {
  if (!userAgent) return 'Unknown'
  
  const ua = userAgent.toLowerCase()
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'Mobile'
  }
  if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'Tablet'
  }
  return 'Desktop'
}

// POST /api/analytics/track - Track a view or click event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profileId, blockId, eventType, referrer: bodyReferrer } = trackSchema.parse(body)
    
    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    // Create rate limit key
    const rateLimitKey = `${clientIp}:${eventType}:${profileId}:${blockId || ''}`
    
    // Check rate limit - silently accept but don't store
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json({ success: true, message: 'Rate limited' })
    }
    
    const db = await getDb()
    
    // Verify profile exists
    let profile
    try {
      profile = await db.collection('profiles').findOne({ 
        $or: [
          { _id: new ObjectId(profileId) },
          { userId: profileId }
        ]
      })
    } catch {
      // Invalid ObjectId format, try by userId only
      profile = await db.collection('profiles').findOne({ userId: profileId })
    }
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    // If blockId provided, verify it exists
    if (blockId) {
      try {
        const block = await db.collection('blocks').findOne({ 
          _id: new ObjectId(blockId),
          profileId: profile._id.toString()
        })
        
        if (!block) {
          // Block not found, still track but without blockId
          console.log('Block not found for click tracking:', blockId)
        }
      } catch (e) {
        console.log('Invalid blockId format:', blockId)
      }
    }
    
    // Parse metadata
    const headerReferrer = request.headers.get('referer')
    const userAgent = request.headers.get('user-agent')
    const referrerSource = parseReferrer(bodyReferrer || headerReferrer)
    const deviceType = parseDevice(userAgent)
    
    // Create analytics event
    await db.collection('analytics').insertOne({
      profileId: profile._id.toString(),
      userId: profile.userId,
      blockId: blockId || null,
      eventType,
      referrer: referrerSource,
      device: deviceType,
      rawReferrer: (bodyReferrer || headerReferrer)?.substring(0, 500) || null,
      userAgent: userAgent?.substring(0, 300) || null,
      clientIp: clientIp.substring(0, 45),
      timestamp: new Date(),
      createdAt: new Date(),
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Track analytics error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    )
  }
}
