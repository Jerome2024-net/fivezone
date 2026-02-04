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
      // ===== CHECKOUT COMPLETED (Mission Payment) =====
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Mission Payment (Escrow)
        if (session.metadata?.missionId && session.metadata?.clientId) {
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

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (error: any) {
    console.error("Webhook processing error:", error)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 500 })
  }

  return new NextResponse(null, { status: 200 })
}
