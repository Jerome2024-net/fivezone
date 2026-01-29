'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MissionRequestForm } from "./MissionRequestForm"
import { Send, Lock } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

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
    const { data: session } = useSession()
    const router = useRouter()

    const handleClick = () => {
        if (!session) {
            router.push(`/register?callbackUrl=/business/${businessId}`)
            return
        }
        setShowForm(true)
    }

    return (
        <>
            <Button 
                onClick={handleClick}
                className="w-full h-14 bg-[#34E0A1] hover:bg-[#2bc98e] text-slate-900 font-bold text-lg rounded-full shadow-lg"
            >
                {!session ? <Lock className="h-5 w-5 mr-2" /> : <Send className="h-5 w-5 mr-2" />}
                {session ? "Demander un devis" : "S'inscrire pour contacter"}
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
