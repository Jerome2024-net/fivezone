'use client';

import Link from "next/link"
import Image from "next/image"
import { Heart, BadgeCheck } from "lucide-react"

interface BusinessCardProps {
    id: string
    name: string
    category: string
    imageUrl?: string
    promoted?: boolean
    rating?: number
    reviewCount?: number
    hourlyRate?: number
    currency?: string
}

export function BusinessCard({ id, name, category, imageUrl, promoted = false, rating = 0, reviewCount = 0, hourlyRate, currency = 'EUR' }: BusinessCardProps) {
    const currencySymbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency === 'XOF' ? 'FCFA' : '€';

    return (
        <Link href={`/business/${id}`} className="group cursor-pointer relative block">
            {/* Image Card */}
            <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 mb-3 ${promoted ? 'ring-2 ring-[#34E0A1] ring-offset-2' : ''}`}>
                    <div className="absolute inset-0 bg-slate-200 group-hover:scale-105 transition-transform duration-700 ease-in-out">
                         {imageUrl ? (
                             <Image 
                                src={imageUrl} 
                                alt={name} 
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                             />
                         ) : (
                             <div className="h-full w-full flex items-center justify-center text-slate-400 font-medium bg-slate-100">Sans image</div>
                         )}
                    </div>
                    
                    {promoted && (
                         <div className="absolute top-3 left-3 bg-[#34E0A1] text-slate-900 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 z-10 shadow-sm">
                             <BadgeCheck className="h-3 w-3" /> Recommandé
                         </div>
                    )}

                    {/* Heart Button */}
                    <button 
                        className="absolute top-3 right-3 p-2 rounded-full bg-white hover:bg-slate-100 transition-colors z-10" 
                        onClick={(e) => {
                            e.preventDefault()
                            console.log('Favourited item', id)
                        }}
                    >
                        <Heart className="h-5 w-5 text-slate-900" />
                    </button>
            </div>
            
            {/* Content */}
            <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:underline underline-offset-2 decoration-2">
                    {name}
                    </h3>
                    
                    {/* TripAdvisor-style Bubbles (Circles) */}
                    <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(star => (
                            <div key={star} className={`w-3 h-3 rounded-full ${star <= Math.round(rating) ? 'bg-[#34E0A1]' : 'border border-[#34E0A1] bg-transparent'}`} />
                        ))}
                    </div>
                    {reviewCount > 0 ? (
                        <span className="text-sm text-slate-500 ml-1">{reviewCount} avis</span>
                    ) : (
                        <span className="text-sm text-slate-400 ml-1 italic">Nouveau</span>
                    )}
                    </div>
                    
                    <div className="text-sm text-slate-500 truncate">
                    {category}
                    </div>

                    {hourlyRate && (
                        <div className="mt-2 font-bold text-slate-900">
                            {hourlyRate} {currencySymbol} <span className="text-slate-500 font-normal text-xs">/ jour</span>
                        </div>
                    )}
            </div>
        </Link>
    )
}
