'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MissionRequestForm } from "./MissionRequestForm"
import { Send } from "lucide-react"

interface MissionButtonProps {
    businessId: string
    freelanceId: string
    freelanceName: string
    hourlyRate?: number | null
    currency?: string
}

export function MissionButton({ 
    businessId, 
    freelanceId, 
    freelanceName,
    hourlyRate,
    currency
}: MissionButtonProps) {
    const [showForm, setShowForm] = useState(false)

    return (
        <>
            <Button 
                onClick={() => setShowForm(true)}
                className="w-full h-14 bg-[#34E0A1] hover:bg-[#2bc98e] text-slate-900 font-bold text-lg rounded-full shadow-lg"
            >
                <Send className="h-5 w-5 mr-2" />
                Demander un devis
            </Button>

            {showForm && (
                <MissionRequestForm
                    businessId={businessId}
                    freelanceId={freelanceId}
                    freelanceName={freelanceName}
                    hourlyRate={hourlyRate}
                    currency={currency}
                    onClose={() => setShowForm(false)}
                />
            )}
        </>
    )
}
