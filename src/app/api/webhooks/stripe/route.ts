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
        
        // SUBSCRIPTION CHECKOUT
        if (session.mode === 'subscription' && session.subscription) {
          console.log(`Processing subscription checkout: ${session.subscription}`)
          
          const subscriptionId = session.subscription as string
          const customerId = session.customer as string
          const plan = session.metadata?.plan || 'STANDARD'
          const email = session.customer_details?.email
          
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          
          // Find or create user
          let user = await prisma.user.findFirst({
            where: {
              OR: [
                { stripeCustomerId: customerId },
                { email: email || '' }
              ]
            }
          })
          
          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                subscriptionPlan: plan,
                subscriptionStatus: 'ACTIVE',
                subscriptionStart: new Date((subscription as any).current_period_start * 1000),
                subscriptionEnd: new Date((subscription as any).current_period_end * 1000),
              }
            })
            console.log(`✅ Subscription activated for user ${user.id} - Plan: ${plan}`)
          } else {
            console.log(`⚠️ No user found for customer ${customerId} / email ${email}`)
          }
        }
        
        // MISSION PAYMENT (Escrow)
        else if (session.metadata?.missionId && session.metadata?.clientId) {
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

      // ===== SUBSCRIPTION UPDATED =====
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId }
        })
        
        if (user) {
          const status = subscription.status === 'active' ? 'ACTIVE' : 
                        subscription.status === 'canceled' ? 'CANCELLED' : 'INACTIVE'
          
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: status,
              subscriptionEnd: new Date((subscription as any).current_period_end * 1000),
            }
          })
          console.log(`✅ Subscription updated for user ${user.id} - Status: ${status}`)
        }
        break
      }

      // ===== SUBSCRIPTION DELETED/CANCELED =====
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId }
        })
        
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: 'CANCELLED',
              subscriptionEnd: new Date(),
            }
          })
          console.log(`✅ Subscription cancelled for user ${user.id}`)
        }
        break
      }

      // ===== INVOICE PAID (Subscription Renewal) =====
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice
        const invoiceSubscription = (invoice as any).subscription
        
        if (invoiceSubscription && invoice.billing_reason === 'subscription_cycle') {
          const customerId = invoice.customer as string
          const subscription = await stripe.subscriptions.retrieve(invoiceSubscription as string)
          
          const user = await prisma.user.findUnique({
            where: { stripeCustomerId: customerId }
          })
          
          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                subscriptionStatus: 'ACTIVE',
                subscriptionEnd: new Date((subscription as any).current_period_end * 1000),
              }
            })
            console.log(`✅ Subscription renewed for user ${user.id}`)
          }
        }
        break
      }

      // ===== INVOICE PAYMENT FAILED =====
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const invoiceSubscription = (invoice as any).subscription
        
        if (invoiceSubscription) {
          const customerId = invoice.customer as string
          
          const user = await prisma.user.findUnique({
            where: { stripeCustomerId: customerId }
          })
          
          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                subscriptionStatus: 'INACTIVE',
              }
            })
            console.log(`⚠️ Payment failed for user ${user.id}`)
          }
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
