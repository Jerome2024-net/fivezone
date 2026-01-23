import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_key_for_build", {
  apiVersion: "2023-10-16",
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

          // 1. Find the user by email in Prisma
          try {
              const user = await prisma.user.findUnique({
                  where: { email },
                  include: { businesses: true }
              });

              if (user && user.businesses.length > 0) {
                  // 2. Update their subscription
                  const businessId = user.businesses[0].id;
                  await prisma.business.update({
                      where: { id: businessId },
                      data: {
                          subscriptionTier: 'PRO', // Or determine based on priceId
                          subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 days example
                      }
                  });
                   console.log(`Updated subscription for user ${user.id}`);
              } else {
                  console.log("No user or business found with this email in Prisma");
              }
          } catch (e) {
              console.error("Prisma update error", e);
          }
      }
  }

  return new NextResponse(null, { status: 200 })
}
