import { NextRequest, NextResponse } from 'next/server'
import { getDb, ObjectId } from '../../../../lib/mongodb'
import { createProCheckoutSession, PRO_PLAN_AMOUNT } from '../../../../lib/stripe'

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
    plan: user.plan || 'FREE',
  }
}

// POST /api/payments/checkout - Create checkout session for Pro upgrade
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    if (user.plan === 'PRO') {
      return NextResponse.json(
        { success: false, error: 'Already on Pro plan' },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    const { originUrl } = body
    
    if (!originUrl) {
      return NextResponse.json(
        { success: false, error: 'Origin URL required' },
        { status: 400 }
      )
    }
    
    // Create Stripe checkout session
    const { url, sessionId } = await createProCheckoutSession({
      userId: user.id,
      userEmail: user.email,
      successUrl: `${originUrl}/dashboard/upgrade/success`,
      cancelUrl: `${originUrl}/dashboard`,
    })
    
    // Create payment record in MongoDB
    const db = await getDb()
    await db.collection('payments').insertOne({
      userId: user.id,
      stripeSessionId: sessionId,
      amount: PRO_PLAN_AMOUNT,
      currency: 'usd',
      status: 'PENDING',
      metadata: { planType: 'PRO' },
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    
    return NextResponse.json({
      success: true,
      data: { url, sessionId },
    })
  } catch (error) {
    console.error('Create checkout error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
