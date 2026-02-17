import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateSession } from '@/lib/auth'
import { getCheckoutSession } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

// GET /api/payments/status/[sessionId] - Get payment status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const user = await validateSession(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const { sessionId } = await params
    
    // Verify ownership
    const payment = await prisma.payment.findUnique({
      where: { stripeSessionId: sessionId },
    })
    
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
      await prisma.user.update({
        where: { id: user.id },
        data: { plan: 'PRO' },
      })
      
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'COMPLETED' },
      })
    } else if (stripeStatus.status === 'expired' && payment.status === 'PENDING') {
      newStatus = 'EXPIRED'
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'EXPIRED' },
      })
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
