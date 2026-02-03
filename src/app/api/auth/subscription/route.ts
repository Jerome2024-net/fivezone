import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        hasActiveSubscription: false,
        message: "Not authenticated"
      })
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        subscriptionPlan: true,
        subscriptionStatus: true,
        subscriptionEnd: true
      }
    })
    
    if (!user) {
      return NextResponse.json({ 
        hasActiveSubscription: false,
        message: "User not found"
      })
    }
    
    // Check if subscription is active and not expired
    const hasActiveSubscription = 
      user.subscriptionStatus === 'ACTIVE' && 
      user.subscriptionPlan && 
      (!user.subscriptionEnd || new Date(user.subscriptionEnd) > new Date())
    
    return NextResponse.json({
      hasActiveSubscription,
      plan: user.subscriptionPlan,
      status: user.subscriptionStatus,
      expiresAt: user.subscriptionEnd
    })
    
  } catch (error) {
    console.error("Error checking subscription:", error)
    return NextResponse.json({ 
      hasActiveSubscription: false,
      error: "Internal server error"
    }, { status: 500 })
  }
}
