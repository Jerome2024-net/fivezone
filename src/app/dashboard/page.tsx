import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { DashboardClient } from "@/components/dashboard/DashboardClient"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
      redirect("/login")
  }
  
  // FETCH USER & BUSINESS FROM PRISMA
  const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
          businesses: true
      }
  });
  
  if (!user || user.businesses.length === 0) {
     // If user has account but no business, redirect to registration
     redirect("/register") 
  }

  const business = user.businesses[0]; // Assuming one business per user for now

  const isPro = business?.subscriptionTier === 'PRO' || business?.subscriptionTier === 'ENTERPRISE' || false

  return (
    <DashboardClient initialBusiness={business} isPro={isPro} />
  )
}
