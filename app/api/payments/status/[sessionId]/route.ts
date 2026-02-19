import { NextRequest, NextResponse } from 'next/server'
import { getDb, ObjectId } from '@/lib/mongodb'
import { getCheckoutSession } from '@/lib/stripe'

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

// GET /api/payments/status/[sessionId] - Get payment status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const user = await getSessionUser(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const { sessionId } = await params
    
    const db = await getDb()
    
    // Verify ownership
    const payment = await db.collection('payments').findOne({ stripeSessionId: sessionId })
    
    if (!payment || payment.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      )
    }
    
    // Get status from Stripe
    const stripeStatus = await getCheckoutSession(sessionId)
    
    // Update payment status
    let newStatus = payment.status
    if (stripeStatus.paymentStatus === 'paid' && payment.status !== 'COMPLETED') {
      newStatus = 'COMPLETED'
      
      // Upgrade user to Pro
      await db.collection('users').updateOne(
        { _id: new ObjectId(user.id) },
        { $set: { plan: 'PRO', updatedAt: new Date() } }
      )
      
      await db.collection('payments').updateOne(
        { _id: payment._id },
        { $set: { status: 'COMPLETED', updatedAt: new Date() } }
      )
    } else if (stripeStatus.status === 'expired' && payment.status === 'PENDING') {
      newStatus = 'EXPIRED'
      await db.collection('payments').updateOne(
        { _id: payment._id },
        { $set: { status: 'EXPIRED', updatedAt: new Date() } }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: {
        status: newStatus,
        paymentStatus: stripeStatus.paymentStatus,
        amount: stripeStatus.amountTotal,
        currency: stripeStatus.currency,
      },
    })
  } catch (error) {
    console.error('Get payment status error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get payment status' },
      { status: 500 }
    )
  }
}
