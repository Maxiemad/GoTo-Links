import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateSession } from '@/lib/auth'
import { createProCheckoutSession, PRO_PLAN_AMOUNT } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

// POST /api/payments/checkout - Create checkout session for Pro upgrade
export async function POST(request: NextRequest) {
  try {
    const user = await validateSession(request)
    
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
    
    // Create payment record
    await prisma.payment.create({
      data: {
        userId: user.id,
        stripeSessionId: sessionId,
        amount: PRO_PLAN_AMOUNT,
        currency: 'usd',
        status: 'PENDING',
        metadata: { planType: 'PRO' },
      },
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
