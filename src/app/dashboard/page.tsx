import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { database } from "@/lib/firebase" 
import { ref, get } from "firebase/database"
import { DashboardClient } from "@/components/dashboard/DashboardClient"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
      redirect("/login")
  }
  
  // FETCH USER & BUSINESS FROM FIREBASE
  let user = null;
  let business = null;

  try {
      const usersRef = ref(database, 'users');
      // Simple scan safe for small number of users
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const foundKey = Object.keys(data).find(key => 
            data[key]?.email?.toLowerCase().trim() === session.user.email.toLowerCase().trim()
        );
        if (foundKey) {
            user = data[foundKey];
            business = user.business;
        }
      }
  } catch (e) {
      console.error("Dashboard Fetch Error:", e);
  }
  
  if (!business) {
     // If user has account but no business, redirect to registration
     redirect("/register") 
  }

  const isPro = business?.subscriptionTier === 'PRO' || business?.subscriptionTier === 'ENTERPRISE' || false

  return (
    <DashboardClient initialBusiness={business} isPro={isPro} />
  )
}
