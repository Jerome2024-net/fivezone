'use client';

import Link from "next/link"
import { Heart, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchResultCardProps {
    id: string
    name: string
    category: string
    rating: number
    reviewCount: number
    imageUrl?: string
    city?: string
    hourlyRate?: number
    currency?: string
}

export function SearchResultCard({ 
    id, 
    name, 
    category,
    rating = 0,
    reviewCount = 0,
    imageUrl,
    city = "Non spécifié",
    hourlyRate,
    currency = "EUR"
}: SearchResultCardProps) {
    const currencySymbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency === 'XOF' ? 'FCFA' : '€';
    
    return (
        <Link href={`/business/${id}`} className="group block bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all shadow-sm">
            <div className="flex flex-col md:flex-row h-full md:h-64">
                {/* Image */}
                <div className="w-full md:w-72 h-48 md:h-full bg-slate-100 relative shrink-0">
                    {imageUrl ? (
                        <img src={imageUrl} alt={name} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                        <div className="absolute inset-0 bg-slate-200" />
                    )}
                    <div className="absolute top-3 right-3 z-10">
                        <button 
                            className="p-2 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-sm transition-colors"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                console.log('Saved', id)
                            }}
                        >
                            <Heart className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-slate-900 group-hover:underline decoration-2 underline-offset-2">
                                {name}
                            </h3>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2 mb-3">
                            <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(star => (
                                    <div key={star} className={`w-3 h-3 rounded-full ${star <= Math.round(rating) ? 'bg-[#34E0A1]' : 'border border-[#34E0A1] bg-transparent'}`} />
                                ))}
                            </div>
                            <span className="text-sm text-slate-500 font-medium">{reviewCount} avis</span>
                        </div>
                        
                        <div className="text-sm text-slate-600 space-y-1">
                            <p>{category} • {city}</p>
                            {hourlyRate && (
                                <p className="font-bold text-slate-900 mt-1">
                                    {hourlyRate} {currencySymbol} <span className="text-slate-500 font-normal">/ jour (TJM)</span>
                                </p>
                            )}
                        </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                            <MapPin className="h-4 w-4" />
                            <span>{city}</span>
                        </div>
                        <Button className="rounded-full bg-[#F2C94C] hover:bg-[#e0b73b] text-slate-900 font-bold">
                            Voir l'offre
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    )
}
