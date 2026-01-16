import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-01-27.acacia", // Updated to latest available/compatible
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

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
      const email = session.customer_details?.email
      
      if (email) {
          console.log(`Processing subscription for email: ${email}`)

          // 1. Find the user by email
          const user = await prisma.user.findUnique({
              where: { email },
              include: { businesses: true }
          })

          if (user) {
              if (user.businesses.length > 0) {
                // 2. Update all businesses owned by this user to PRO (or specific logic)
                // For this MVP, we upgrade the user's primary business
                const businessId = user.businesses[0].id
                
                await prisma.business.update({
                    where: { id: businessId },
                    data: {
                        subscriptionTier: "PRO",
                        // Set subscription end date to 30 days from now (or rely on stripe events for recurrence)
                        subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
                        // Unlock Pro features
                        whatsapp: session.custom_fields?.find(f => f.key === 'whatsapp')?.text?.value || null
                    }
                })
                console.log(`Upgraded business ${businessId} to PRO`)
              } else {
                  console.log("User has no businesses to upgrade")
              }
          } else {
              console.log("No user found with this email")
          }
      }
  }

  return new NextResponse(null, { status: 200 })
}
