'use client';

import Link from "next/link"
import { Heart, BadgeCheck } from "lucide-react"

interface BusinessCardProps {
    id: string
    name: string
    category: string
    promoted?: boolean
}

export function BusinessCard({ id, name, category, promoted = false }: BusinessCardProps) {
    return (
        <Link href={`/business/${id}`} className="group cursor-pointer relative block">
            {/* Image Card */}
            <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 mb-3 ${promoted ? 'ring-2 ring-[#34E0A1] ring-offset-2' : ''}`}>
                    <div className="absolute inset-0 bg-slate-200 animate-pulse group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                    
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
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">Image {id}</div>
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
                            <div key={star} className={`w-3 h-3 rounded-full ${star <= 4 ? 'bg-[#34E0A1]' : 'border border-[#34E0A1] bg-transparent'}`} />
                        ))}
                    </div>
                    <span className="text-sm text-slate-500 ml-1">1 240 avis</span>
                    </div>
                    
                    <div className="text-sm text-slate-500 truncate">
                    {category}
                    </div>
            </div>
        </Link>
    )
}
