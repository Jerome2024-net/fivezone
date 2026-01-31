
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { MissionRequestFormWrapper } from "./MissionRequestFormWrapper"

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function MissionRequestPage({ searchParams }: PageProps) {
  const params = await searchParams
  const businessId = params.businessId as string

  if (!businessId) {
     redirect('/search')
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  if (!business) {
    notFound();
  }

  return (
    <MissionRequestFormWrapper 
        businessId={business.id}
        freelanceId={business.owner?.id || ""} 
        freelanceName={business.name}
        hourlyRate={business.hourlyRate}
        currency={business.currency}
    />
  )
}
