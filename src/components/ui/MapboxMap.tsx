'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

interface MapboxMapProps {
    address: string;
    city: string;
}

export default function MapboxMap({ address, city }: MapboxMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const marker = useRef<mapboxgl.Marker | null>(null);
    
    // NOTE: This token should be in your .env.local file as NEXT_PUBLIC_MAPBOX_TOKEN
    const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    useEffect(() => {
        if (!MAPBOX_TOKEN || !mapContainer.current) return;
        if (map.current) return; // initialize map only once

        mapboxgl.accessToken = MAPBOX_TOKEN;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [2.3522, 48.8566], // Default Paris
            zoom: 13,
            attributionControl: false
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, [MAPBOX_TOKEN]);

    useEffect(() => {
        if (!map.current || !MAPBOX_TOKEN) return;

        const geocodeAddress = async () => {
             try {
                const query = encodeURIComponent(`${address}, ${city}`);
                const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_TOKEN}&limit=1`;
                
                const response = await fetch(url);
                const data = await response.json();

                if (data.features && data.features.length > 0) {
                    const [lng, lat] = data.features[0].center;

                    // Fly to location
                    map.current?.flyTo({
                        center: [lng, lat],
                        zoom: 14,
                        essential: true
                    });

                    // Update or create marker
                    if (marker.current) {
                        marker.current.setLngLat([lng, lat]);
                    } else {
                        // Create a custom DOM element for the marker to mimic the previous look
                        const el = document.createElement('div');
                        el.className = 'custom-marker';
                        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#dc2626" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin drop-shadow-md"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
                        
                        // Fix SVG sizing issues if needed, or just let it be. 
                        // Actually, using the default marker is safer for now to avoid CSS issues, 
                        // but if we want the red pin:
                        
                        marker.current = new mapboxgl.Marker({ color: '#dc2626' })
                            .setLngLat([lng, lat])
                            .addTo(map.current!);
                    }
                        
                }
            } catch (err) {
                console.error("Geocoding error:", err);
            }
        };

        if (address && city) {
             geocodeAddress();
        }

    }, [address, city, MAPBOX_TOKEN]);

    if (!MAPBOX_TOKEN) {
        return (
            <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-6 text-center border bg-[url('https://docs.mapbox.com/mapbox-gl-js/assets/radar.gif')] bg-center bg-cover">
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-sm flex flex-col items-center">
                    <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                        <MapPin className="h-5 w-5 text-slate-700" />
                    </div>
                    <p className="font-bold text-slate-900 text-sm">{city}</p>
                    <p className="text-xs text-slate-500 max-w-[180px] break-words">{address}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative">
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    );
}

