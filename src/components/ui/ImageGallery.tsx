'use client';

import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ImageGalleryProps {
    images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    // Lock body scroll when lightbox is open
    useEffect(() => {
        if (selectedIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedIndex]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (selectedIndex === null) return;

        if (e.key === 'Escape') {
            setSelectedIndex(null);
        } else if (e.key === 'ArrowLeft') {
            setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : events(prev)));
        } else if (e.key === 'ArrowRight') {
            setSelectedIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : events(prev)));
        }
    }, [selectedIndex, images.length]);

    // Helper for circular navigation or bounds check
    const events = (prev: number | null) => prev; 

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (!images || images.length === 0) return null;

    const openLightbox = (index: number) => setSelectedIndex(index);
    const closeLightbox = () => setSelectedIndex(null);
    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedIndex !== null && selectedIndex < images.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        }
    };
    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedIndex !== null && selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        }
    };

    return (
        <>
            <div className="container mx-auto px-4 md:px-6 mb-8">
               {/* 1 Image */}
               {images.length === 1 && (
                   <div 
                        onClick={() => openLightbox(0)}
                        className="h-[400px] rounded-2xl overflow-hidden relative group cursor-pointer bg-slate-200"
                    >
                        <img src={images[0]} className="w-full h-full object-cover" alt="Main view" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                   </div>
               )}

               {/* 2 Images */}
               {images.length === 2 && (
                   <div className="grid grid-cols-2 h-[400px] gap-2 rounded-2xl overflow-hidden">
                        {images.map((img, idx) => (
                             <div 
                                key={idx} 
                                onClick={() => openLightbox(idx)}
                                className="relative group cursor-pointer bg-slate-200 h-full"
                             >
                                <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                             </div>
                        ))}
                   </div>
               )}

               {/* 3 Images */}
               {images.length === 3 && (
                   <div className="grid grid-cols-3 grid-rows-2 h-[400px] gap-2 rounded-2xl overflow-hidden">
                        <div 
                            onClick={() => openLightbox(0)}
                            className="col-span-2 row-span-2 relative group cursor-pointer bg-slate-200"
                        >
                            <img src={images[0]} className="w-full h-full object-cover" alt="Main view" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>
                        <div 
                            onClick={() => openLightbox(1)}
                            className="col-span-1 row-span-1 relative group cursor-pointer bg-slate-200"
                        >
                            <img src={images[1]} className="w-full h-full object-cover" alt="Gallery 1" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>
                        <div 
                            onClick={() => openLightbox(2)}
                            className="col-span-1 row-span-1 relative group cursor-pointer bg-slate-200"
                        >
                            <img src={images[2]} className="w-full h-full object-cover" alt="Gallery 2" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>
                   </div>
               )}

               {/* 4 Images */}
               {images.length === 4 && (
                   <div className="grid grid-cols-2 grid-rows-2 h-[400px] gap-2 rounded-2xl overflow-hidden">
                        {images.map((img, idx) => (
                             <div 
                                key={idx} 
                                onClick={() => openLightbox(idx)}
                                className="relative group cursor-pointer bg-slate-200 h-full"
                             >
                                <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                             </div>
                        ))}
                   </div>
               )}

               {/* 5+ Images */}
               {images.length >= 5 && (
                   <div className="grid grid-cols-4 grid-rows-2 h-[400px] gap-2 rounded-2xl overflow-hidden">
                        <div 
                            onClick={() => openLightbox(0)}
                            className="col-span-2 row-span-2 bg-slate-200 relative group cursor-pointer"
                        >
                            <img src={images[0]} className="w-full h-full object-cover" alt="Main view" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>
                        {images.slice(1, 5).map((img, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => openLightbox(idx + 1)}
                                className="bg-slate-200 relative group cursor-pointer overflow-hidden"
                            >
                                <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx + 1}`} />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                {idx === 3 && images.length > 5 && (
                                     <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold text-lg backdrop-blur-[2px]">
                                         +{images.length - 5}
                                     </div>
                                 )}
                            </div>
                        ))}
                   </div>
               )}
            </div>

            {/* Lightbox Overlay */}
            {selectedIndex !== null && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200"
                    onClick={closeLightbox}
                >
                    <div className="absolute top-4 right-4 z-50">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-white hover:bg-white/20 rounded-full h-12 w-12"
                            onClick={closeLightbox}
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>

                    <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
                        <img 
                            src={images[selectedIndex]} 
                            className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
                            alt={`Fullscreen ${selectedIndex + 1}`}
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                        />

                        {/* Navigation Buttons */}
                        {selectedIndex > 0 && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full h-12 w-12"
                                onClick={prevImage}
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </Button>
                        )}
                        
                        {selectedIndex < images.length - 1 && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full h-12 w-12"
                                onClick={nextImage}
                            >
                                <ChevronRight className="h-8 w-8" />
                            </Button>
                        )}
                        
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
                            {selectedIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
