'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Share2, Heart, Copy, Facebook, Linkedin, Twitter, Check } from "lucide-react";

interface ProfileActionsProps {
    businessId: string;
    businessName: string;
}

export function ProfileActions({ businessId, businessName }: ProfileActionsProps) {
    const [isSaved, setIsSaved] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Check local storage or fetch simplified saved status
        const saved = localStorage.getItem(`saved_${businessId}`);
        if (saved) setIsSaved(true);
    }, [businessId]);

    const handleSave = () => {
        const newState = !isSaved;
        setIsSaved(newState);
        if (newState) {
            localStorage.setItem(`saved_${businessId}`, 'true');
        } else {
            localStorage.removeItem(`saved_${businessId}`);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        const title = `${businessName} - Découvrez ce profil`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Regardez ce profil : ${businessName}`,
                    url: url,
                });
                return;
            } catch (err) {
                console.log('Error sharing:', err);
            }
        }
        
        // Fallback to showing menu if native share is waiting or failed or not supported
        setShowShareMenu(!showShareMenu);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareUrl = (platform: string) => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`Découvrez ${businessName}`);
        let shareLink = '';

        switch(platform) {
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareLink = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                break;
            case 'linkedin':
                shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
            case 'whatsapp':
                shareLink = `https://api.whatsapp.com/send?text=${text} ${url}`;
                break;
        }

        if (shareLink) {
            window.open(shareLink, '_blank', 'width=600,height=400');
        }
    };

    return (
        <div className="flex gap-2 relative">
            <div className="relative">
                <Button 
                    onClick={handleShare}
                    variant="outline" 
                    className="rounded-full font-bold border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                >
                    <Share2 className="h-4 w-4 mr-2" /> Partager
                </Button>

                {/* Custom Share Menu Fallback */}
                {showShareMenu && (
                    <div className="absolute top-full right-0 mt-2 p-3 bg-white rounded-xl shadow-xl border border-slate-100 w-64 z-50 animate-in fade-in zoom-in-95 duration-200">
                         <div className="text-sm font-bold text-slate-900 mb-2">Partager sur</div>
                         <div className="grid grid-cols-4 gap-2 mb-3">
                             <button onClick={() => shareUrl('facebook')} className="flex items-center justify-center p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                                 <Facebook className="h-4 w-4" />
                             </button>
                             <button onClick={() => shareUrl('twitter')} className="flex items-center justify-center p-2 rounded-lg bg-sky-50 text-sky-500 hover:bg-sky-100 transition-colors">
                                 <Twitter className="h-4 w-4" />
                             </button>
                             <button onClick={() => shareUrl('linkedin')} className="flex items-center justify-center p-2 rounded-lg bg-blue-50 text-[#0077b5] hover:bg-blue-100 transition-colors">
                                 <Linkedin className="h-4 w-4" />
                             </button>
                             <button onClick={() => shareUrl('whatsapp')} className="flex items-center justify-center p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                             </button>
                         </div>
                         <div className="relative">
                             <div className="bg-slate-100 rounded-lg p-2 pl-3 flex items-center justify-between">
                                 <span className="text-xs text-slate-500 truncate max-w-[150px] font-mono">
                                    {typeof window !== 'undefined' ? window.location.href : ''}
                                 </span>
                                 <button onClick={copyToClipboard} className="p-1.5 bg-white rounded-md shadow-sm hover:text-blue-600 transition-colors">
                                     {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                                 </button>
                             </div>
                         </div>
                         {/* Close backdrop */}
                         <div 
                            className="fixed inset-0 z-[-1]" 
                            onClick={() => setShowShareMenu(false)}
                         />
                    </div>
                )}
            </div>

            <Button 
                onClick={handleSave}
                variant="outline" 
                className={`rounded-full font-bold border-slate-300 transition-colors ${isSaved ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' : 'hover:bg-slate-100 hover:text-slate-900'}`}
            >
                <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} /> 
                {isSaved ? 'Enregistré' : 'Enregistrer'}
            </Button>
        </div>
    )
}
