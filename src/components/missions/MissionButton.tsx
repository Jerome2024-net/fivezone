'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MissionRequestForm } from "./MissionRequestForm"
import { Send, Lock } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

interface MissionButtonProps {
    businessId: string
    freelanceId: string
    freelanceName: string
    hourlyRate?: number | null
    currency?: string
    className?: string
    children?: React.ReactNode
}

export function MissionButton({ 
    businessId, 
    freelanceId, 
    freelanceName,
    hourlyRate,
    currency,
    className,
    children
}: MissionButtonProps) {
    const [showForm, setShowForm] = useState(false)
    const { data: session } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()

    // Auto-open if returning from login
    useEffect(() => {
        if (searchParams.get('action') === 'send_mission') {
            setShowForm(true)
        }
    }, [searchParams])

    const handleClick = () => {
        // Allow guests to open the form to draft
        setShowForm(true)
    }

    return (
        <>
            <Button 
                onClick={handleClick}
                className={`w-full h-14 bg-[#34E0A1] hover:bg-[#2bc98e] text-slate-900 font-bold text-lg rounded-full shadow-lg transition-transform active:scale-[0.98] ${className || ''}`}
            >
                {children || (
                    <>
                        <Send className="h-5 w-5 mr-2" />
                        Demander un devis
                    </>
                )}
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
