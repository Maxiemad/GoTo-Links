import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_emergent'

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const PRO_PLAN_AMOUNT = parseFloat(process.env.STRIPE_PRO_PRICE_AMOUNT || '19.00')

export interface CheckoutSessionParams {
  userId: string
  userEmail: string
  successUrl: string
  cancelUrl: string
}

export async function createProCheckoutSession({
  userId,
  userEmail,
  successUrl,
  cancelUrl,
}: CheckoutSessionParams) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'GoToLinks Pro Plan',
            description: 'Unlock video heroes, premium themes, custom domains, and advanced analytics',
          },
          unit_amount: Math.round(PRO_PLAN_AMOUNT * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    customer_email: userEmail,
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      planType: 'PRO',
    },
  })

  return {
    url: session.url,
    sessionId: session.id,
  }
}

export async function getCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return {
    status: session.status,
    paymentStatus: session.payment_status,
    amountTotal: session.amount_total,
    currency: session.currency,
    metadata: session.metadata,
  }
}

export default stripe
