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
  
  if (!user) {
     redirect("/login")
  }

  // Determine user type
  const business = user.businesses[0]; // Assuming one business per user for now
  const userType = business ? 'freelancer' : 'client';
  const isPro = business?.subscriptionTier === 'PRO' || business?.subscriptionTier === 'ENTERPRISE' || false

  // Get mission counts
  let pendingMissions = 0;

  if (userType === 'freelancer') {
      const missionCounts = await prisma.missionRequest.groupBy({
        by: ['status'],
        where: { freelanceId: user.id },
        _count: true
      })
      pendingMissions = missionCounts
        .filter(m => m.status === 'PENDING' || m.status === 'VIEWED')
        .reduce((acc, m) => acc + m._count, 0)
  } else {
      // For clients, maybe count active proposals?
      const missionCounts = await prisma.missionRequest.groupBy({
        by: ['status'],
        where: { clientId: user.id },
        _count: true
      })
      pendingMissions = missionCounts
        .filter(m => m.status === 'PROPOSAL')
        .reduce((acc, m) => acc + m._count, 0)
  }

  return (
    <DashboardClient 
      initialBusiness={business} 
      userType={userType}
      isPro={isPro} 
      pendingMissions={pendingMissions}
      userName={user.name || "Client"}
    />
  )
}
