
"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, Calendar, ExternalLink, Phone, Share2, Link2, Copy, Check } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

interface ProfileActionsProps {
    business: any;
    isMobile?: boolean;
}

export default function ProfileActions({ business, isMobile = false }: ProfileActionsProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const shareRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
                setShowShareMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const profileUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/business/${business.id}` 
        : `/business/${business.id}`;

    const shareText = `Check out ${business.name} on FiveZone`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(profileUrl);
            setCopied(true);
            setTimeout(() => { setCopied(false); setShowShareMenu(false); }, 1500);
        } catch { /* fallback */ }
    };

    const handleShareWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}: ${profileUrl}`)}`, '_blank');
        setShowShareMenu(false);
    };

    const handleShareEmail = () => {
        window.open(`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}\n\n${profileUrl}`)}`, '_blank');
        setShowShareMenu(false);
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: shareText, url: profileUrl });
            } catch { /* user cancelled */ }
            setShowShareMenu(false);
        } else {
            setShowShareMenu(true);
        }
    };

    const handleAction = (type: string) => {
        setIsLoading(true);
        // Track click if needed
        // Then route
        if (type === 'booking') {
            // Only external redirect if action is explicitly 'website'
            if (business.ctaAction === 'website' && business.ctaUrl) {
                window.open(business.ctaUrl, '_blank');
            } else {
               // Force internal flow for 'Demander un devis' (even if ctaAction is 'booking')
               // This ensures users stay on platform for quotes
               router.push(`/mission/request?businessId=${business.id}`);
            }
        } else if (type === 'contact') {
             router.push(`/mission/request?businessId=${business.id}&type=contact`);
        }
        setTimeout(() => setIsLoading(false), 1000);
    }

    if (isMobile) {
        return (
            <div className="space-y-2 w-full">
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
                <div className="relative" ref={shareRef}>
                    <Button
                        onClick={handleNativeShare}
                        variant="ghost"
                        className="w-full h-10 text-slate-500 hover:text-[#34E0A1] hover:bg-emerald-50 font-semibold text-sm"
                    >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share this profile
                    </Button>
                    {showShareMenu && (
                        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-up">
                            <button onClick={handleCopyLink} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-700">
                                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-slate-400" />}
                                {copied ? 'Copied!' : 'Copy link'}
                            </button>
                            <button onClick={handleShareWhatsApp} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-700">
                                <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.344 0-4.527-.694-6.354-1.891l-.444-.281-3.088 1.035 1.035-3.088-.281-.444A9.958 9.958 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
                                WhatsApp
                            </button>
                            <button onClick={handleShareEmail} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-700">
                                <svg className="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                Email
                            </button>
                        </div>
                    )}
                </div>
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

            {/* Share profile */}
            <div className="relative mt-3 pt-3 border-t border-slate-100" ref={shareRef}>
                <Button
                    onClick={handleNativeShare}
                    variant="ghost"
                    size="sm"
                    className="w-full text-slate-500 hover:text-[#34E0A1] hover:bg-emerald-50 font-semibold"
                >
                    <Share2 className="h-4 w-4 mr-1.5" />
                    Share this profile
                </Button>
                {showShareMenu && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-up">
                        <button onClick={handleCopyLink} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-700">
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-slate-400" />}
                            {copied ? 'Copied!' : 'Copy link'}
                        </button>
                        <button onClick={handleShareWhatsApp} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-700">
                            <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.344 0-4.527-.694-6.354-1.891l-.444-.281-3.088 1.035 1.035-3.088-.281-.444A9.958 9.958 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
                            WhatsApp
                        </button>
                        <button onClick={handleShareEmail} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-700">
                            <svg className="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            Email
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
