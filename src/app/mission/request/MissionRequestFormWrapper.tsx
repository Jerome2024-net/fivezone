
"use client"

import { MissionRequestForm } from "@/components/missions/MissionRequestForm"
import { useRouter } from "next/navigation"

interface WrapperProps {
    businessId: string
    freelanceId: string
    freelanceName: string
    hourlyRate?: number | null
    currency?: string
}

export function MissionRequestFormWrapper({ 
    businessId, 
    freelanceId, 
    freelanceName,
    hourlyRate,
    currency 
}: WrapperProps) {
    const router = useRouter()

    const handleClose = () => {
        // Go back to the business page
        router.push(`/business/${businessId}`)
    }

    return (
        <MissionRequestForm
            businessId={businessId}
            freelanceId={freelanceId}
            freelanceName={freelanceName}
            hourlyRate={hourlyRate}
            currency={currency || 'EUR'}
            onClose={handleClose}
        />
    )
}
