'use client';

import Link from "next/link"
import { Heart, MapPin, Zap, Clock, Bot } from "lucide-react"
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
    available?: boolean
    yearsOfExperience?: number
    isAIAgent?: boolean
    aiPricePerTask?: number
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
    currency = "EUR",
    available = true,
    yearsOfExperience,
    isAIAgent = false,
    aiPricePerTask
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
                    {/* AI Badge or Availability badge */}
                    <div className="absolute top-3 left-3 z-10">
                        {isAIAgent ? (
                            <span className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                <Bot className="h-3.5 w-3.5" /> Agent IA
                            </span>
                        ) : available && (
                            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                <Zap className="h-3 w-3" /> Dispo
                            </span>
                        )}
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
                            {isAIAgent ? (
                                <>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-sm text-violet-600 font-semibold flex items-center gap-1">
                                        <Zap className="h-3 w-3" /> Réponse instantanée
                                    </span>
                                </>
                            ) : yearsOfExperience && (
                                <>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-sm text-slate-500 font-medium flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> {yearsOfExperience} an{yearsOfExperience > 1 ? 's' : ''}
                                    </span>
                                </>
                            )}
                        </div>
                        
                        <div className="text-sm text-slate-600 space-y-1">
                            <p>{category} • {isAIAgent ? '🌍 Disponible partout' : city}</p>
                            {isAIAgent && aiPricePerTask ? (
                                <p className="font-bold text-slate-900 mt-1">
                                    À partir de <span className="text-violet-600">{aiPricePerTask} {currencySymbol}</span> <span className="text-slate-500 font-normal">/ tâche</span>
                                </p>
                            ) : hourlyRate && (
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
                            Voir le profil
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    )
}
