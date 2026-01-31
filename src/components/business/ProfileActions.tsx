
"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, Calendar, ExternalLink, Phone } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface ProfileActionsProps {
    business: any;
    isMobile?: boolean;
}

export default function ProfileActions({ business, isMobile = false }: ProfileActionsProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = (type: string) => {
        setIsLoading(true);
        // Track click if needed
        // Then route
        if (type === 'booking') {
            // Check specific CTA logic
            if (business.ctaAction === 'booking' && business.ctaUrl) {
                window.open(business.ctaUrl, '_blank');
            } else if (business.ctaAction === 'website' && business.ctaUrl) {
                window.open(business.ctaUrl, '_blank');
            } else {
               // Default internal flow
               router.push(`/mission/request?businessId=${business.id}`);
            }
        } else if (type === 'contact') {
             router.push(`/mission/request?businessId=${business.id}&type=contact`);
        }
        setTimeout(() => setIsLoading(false), 1000);
    }

    if (isMobile) {
        return (
            <div className="flex gap-2 items-center w-full">
                <Button 
                    onClick={() => handleAction('contact')}
                    variant="outline" 
                    className="flex-1 h-12 font-bold border-slate-300 text-slate-700"
                >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                </Button>
                <Button 
                    onClick={() => handleAction('booking')}
                    className="flex-[2] h-12 bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg shadow-green-200"
                >
                    {business.ctaAction === 'website' ? (
                        <>
                             <ExternalLink className="h-4 w-4 mr-2" />
                             Voir le site
                        </>
                    ) : (
                        <>
                            Demander un devis
                        </>
                    )}
                </Button>
            </div>
        )
    }

    // DESKTOP LAYOUT
    return (
        <div className="flex flex-col gap-3 min-w-[280px]">
             <Button 
                onClick={() => handleAction('booking')}
                className="w-full h-12 text-base bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg shadow-green-100 transform hover:scale-[1.02] transition-all"
            >
                {business.ctaAction === 'website' ? (
                    <>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Accéder au site web
                    </>
                ) : (
                    <>
                        Demander un devis gratuit
                    </>
                )}
            </Button>
            
            <div className="text-center">
                 <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-2">ou contacter directement</p>
                 <div className="flex gap-2 justify-center">
                    <Button 
                        onClick={() => handleAction('contact')}
                        variant="ghost" 
                        size="sm"
                        className="text-slate-600 hover:bg-slate-50 font-semibold"
                    >
                        <MessageSquare className="h-4 w-4 mr-1.5" />
                        Message
                    </Button>
                    {business.phone && (
                        <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-slate-600 hover:bg-slate-50 font-semibold"
                            onClick={() => window.open(`tel:${business.phone}`)}
                        >
                            <Phone className="h-4 w-4 mr-1.5" />
                            Appeler
                        </Button>
                    )}
                 </div>
            </div>
        </div>
    )
}
