'use client';

import { useState } from 'react';
import Link from "next/link"
import Image from "next/image"
import { Heart, BadgeCheck, Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react"

interface BusinessCardProps {
    id: string
    name: string
    category: string
    imageUrl?: string
    images?: string[]
    promoted?: boolean
    rating?: number
    reviewCount?: number
    hourlyRate?: number
    currency?: string
    city?: string
}

export function BusinessCard({ id, name, category, imageUrl, images, promoted = false, rating = 0, reviewCount = 0, hourlyRate, currency = 'EUR', city }: BusinessCardProps) {
    const currencySymbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency === 'XOF' ? 'FCFA' : '€';
    // Fallback to imageUrl if images is empty, or empty array if both are missing
    const displayImages = images && images.length > 0 ? images : (imageUrl ? [imageUrl] : []);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (displayImages.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (displayImages.length > 1) {
            setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
        }
    };

    return (
        <Link href={`/business/${id}`} className="group cursor-pointer relative block transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-xl bg-white p-2 border border-transparent hover:border-slate-100">
            {/* Image Card */}
            <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 mb-3 ${promoted ? 'ring-2 ring-[#34E0A1] ring-offset-2' : ''}`}>
                    <div className="absolute inset-0 bg-slate-200 transition-transform duration-700 ease-in-out">
                         {displayImages.length > 0 ? (
                             <Image 
                                src={displayImages[currentImageIndex]} 
                                alt={name} 
                                fill
                                className="object-cover transition-opacity duration-300"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                             />
                         ) : (
                             <div className="h-full w-full flex items-center justify-center text-slate-400 font-medium bg-slate-100">Sans image</div>
                         )}
                    </div>
                    
                    {/* Carousel Controls */}
                    {displayImages.length > 1 && (
                        <>
                            <div className="absolute inset-y-0 left-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity p-1 z-10">
                                <button 
                                    onClick={prevImage}
                                    className="bg-white/90 hover:bg-white p-1 rounded-full shadow-sm text-slate-800"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity p-1 z-10">
                                <button 
                                    onClick={nextImage}
                                    className="bg-white/90 hover:bg-white p-1 rounded-full shadow-sm text-slate-800"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                            {/* Dots Indicator */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                {displayImages.slice(0, 5).map((_, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`h-1.5 rounded-full shadow-sm transition-all duration-300 ${idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'}`} 
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {promoted && (
                         <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 z-10 shadow-sm border border-white/50">
                             <BadgeCheck className="h-3 w-3 text-[#34E0A1]" /> Recommandé
                         </div>
                    )}

                    {/* Heart Button */}
                    <button 
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md hover:bg-white transition-colors z-10 shadow-sm" 
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            // Add logic
                        }}
                    >
                        <Heart className="h-4 w-4 text-slate-400 hover:text-red-500 hover:fill-red-500 transition-colors" />
                    </button>
            </div>

            <div className="px-1">
                <div className="flex justify-between items-start mb-1">
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#34E0A1] transition-colors line-clamp-1">{name}</h3>
                        <p className="text-slate-500 text-sm font-medium">{category}</p>
                    </div>
                    {rating > 0 && (
                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-slate-900 text-sm">{rating}</span>
                            <span className="text-slate-400 text-xs">({reviewCount})</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                    {hourlyRate ? (
                        <div className="text-sm font-bold text-slate-900">
                            {hourlyRate}{currencySymbol}<span className="text-slate-500 font-normal">/h</span>
                        </div>
                    ) : (
                         <div className="text-sm font-bold text-slate-400">
                            Sur devis
                        </div>
                    )}
                    {city && (
                        <div className="flex items-center text-xs text-slate-500 ml-auto">
                            <MapPin className="h-3 w-3 mr-1" />
                            {city}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}
