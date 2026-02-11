import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_key_for_build", {
  typescript: true,
})

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        throw new Error("STRIPE_WEBHOOK_SECRET is missing")
    }
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  console.log(`Received Stripe event: ${event.type}`)

  try {
    switch (event.type) {
      // ===== CHECKOUT COMPLETED =====
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        
        // --- Pro Subscription Payment ---
        if (session.mode === 'subscription' && session.metadata?.businessId) {
          console.log(`Processing Pro subscription for business: ${session.metadata.businessId}`)
          const { userId, businessId } = session.metadata
          const subscriptionId = session.subscription as string

          // Fetch the subscription to get the current period end
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const periodEnd = new Date(subscription.current_period_end * 1000)

          await prisma.business.update({
            where: { id: businessId },
            data: {
              subscriptionTier: 'PRO',
              subscriptionEnd: periodEnd,
            },
          })

          console.log(`✅ Business ${businessId} upgraded to PRO until ${periodEnd.toISOString()}`)
        }

        // --- Mission Payment (Escrow) ---
        if (session.mode === 'payment' && session.metadata?.missionId && session.metadata?.clientId) {
          console.log(`Processing mission payment: ${session.metadata.missionId}`)
          const { missionId, clientId, businessId } = session.metadata
          const paymentIntentId = session.payment_intent as string
          
          await prisma.payment.create({
            data: {
              amount: session.amount_total || 0,
              currency: session.currency || 'eur',
              status: 'HELD',
              stripePaymentIntentId: paymentIntentId,
              missionId: missionId,
              payerId: clientId,
              recipientId: businessId || "",
              heldAt: new Date(),
            }
          })

          await prisma.missionRequest.update({
            where: { id: missionId },
            data: { status: 'IN_PROGRESS' }
          })
          
          console.log("✅ Mission payment recorded successfully")
        }
        break
      }

      // ===== SUBSCRIPTION RENEWED =====
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        if (subscriptionId && invoice.billing_reason === 'subscription_cycle') {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const businessId = subscription.metadata?.businessId

          if (businessId) {
            const periodEnd = new Date(subscription.current_period_end * 1000)
            await prisma.business.update({
              where: { id: businessId },
              data: {
                subscriptionTier: 'PRO',
                subscriptionEnd: periodEnd,
              },
            })
            console.log(`✅ Subscription renewed for business ${businessId} until ${periodEnd.toISOString()}`)
          }
        }
        break
      }

      // ===== SUBSCRIPTION CANCELLED / EXPIRED =====
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const businessId = subscription.metadata?.businessId

        if (businessId) {
          await prisma.business.update({
            where: { id: businessId },
            data: {
              subscriptionTier: 'FREE',
              subscriptionEnd: null,
            },
          })
          console.log(`✅ Business ${businessId} downgraded to FREE (subscription ended)`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (error: any) {
    console.error("Webhook processing error:", error)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 500 })
  }

  return new NextResponse(null, { status: 200 })
}
