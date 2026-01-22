import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { database } from "@/lib/firebase"
import { ref, get, update } from "firebase/database"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_key_for_build", {
  apiVersion: "2025-12-15.clover", // Matching the exact version expected by the installed SDK
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
          const usersRef = ref(database, 'users');
          const snapshot = await get(usersRef);
          
          if (snapshot.exists()) {
              const data = snapshot.val();
              const userId = Object.keys(data).find(key => 
                  data[key]?.email?.toLowerCase() === email.toLowerCase()
              );

              if (userId) {
                  const userIdx = data[userId];
                  if (userIdx.business) {
                      await update(ref(database, `users/${userId}/business`), {
                          subscriptionTier: "PRO",
                          subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                          whatsapp: session.custom_fields?.find((f: any) => f.key === 'whatsapp')?.text?.value || null
                      });
                      console.log(`Upgraded business for user ${userId} to PRO`);
                  } else {
                      console.log("User has no business to upgrade");
                  }
              } else {
                  console.log("No user found with this email in Firebase");
              }
          }
      }
  }

  return new NextResponse(null, { status: 200 })
}
