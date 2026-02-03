import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

// Stripe Price IDs - Create these in your Stripe Dashboard
// Or use the setup script to create them automatically
const PRICE_IDS = {
  STANDARD: process.env.STRIPE_PRICE_STANDARD || '',
  TEAM3: process.env.STRIPE_PRICE_TEAM3 || '',
  TEAM6: process.env.STRIPE_PRICE_TEAM6 || '',
}

const PLAN_DETAILS: Record<string, { name: string; price: number; talents: number }> = {
  STANDARD: { name: 'Standard', price: 99, talents: 1 },
  TEAM3: { name: 'Team 3', price: 249, talents: 3 },
  TEAM6: { name: 'Team 6', price: 449, talents: 6 },
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { plan } = body
    
    if (!plan || !PRICE_IDS[plan as keyof typeof PRICE_IDS]) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      )
    }
    
    const priceId = PRICE_IDS[plan as keyof typeof PRICE_IDS]
    
    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price not configured for this plan. Please contact support." },
        { status: 500 }
      )
    }
    
    let customerId: string | undefined
    let customerEmail: string | undefined
    let userId: string = ''
    
    // If user is logged in, get or create Stripe customer
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, stripeCustomerId: true, email: true, name: true }
      })
      
      if (user) {
        userId = user.id
        
        if (user.stripeCustomerId) {
          customerId = user.stripeCustomerId
        } else {
          // Create new Stripe customer
          const customer = await stripe.customers.create({
            email: user.email,
            name: user.name || undefined,
            metadata: {
              userId: user.id
            }
          })
          
          // Save customer ID to database
          await prisma.user.update({
            where: { id: user.id },
            data: { stripeCustomerId: customer.id }
          })
          
          customerId = customer.id
        }
      }
    } else {
      customerEmail = body.email
    }
    
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    
    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      ...(customerId ? { customer: customerId } : { customer_email: customerEmail }),
      success_url: `${baseUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      metadata: {
        plan: plan,
        userId: userId,
      },
      subscription_data: {
        metadata: {
          plan: plan,
          userId: userId,
        },
      },
      allow_promotion_codes: true,
    })
    
    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id
    })
    
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error)
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
