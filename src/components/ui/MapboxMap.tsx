'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

const Map = dynamic(() => import('react-map-gl'), { ssr: false });
import { Marker, NavigationControl } from 'react-map-gl';

interface MapboxMapProps {
    address: string;
    city: string;
}

export default function MapboxMap({ address, city }: MapboxMapProps) {
    const [viewState, setViewState] = useState({
        longitude: 2.3522, // Default Paris
        latitude: 48.8566,
        zoom: 13
    });
    const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
    
    // NOTE: This token should be in your .env.local file as NEXT_PUBLIC_MAPBOX_TOKEN
    // Example: NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoiamVy...
    const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    useEffect(() => {
        if (!MAPBOX_TOKEN) return;

        // Simple geocoding fetch to Mapbox API to convert address string to coordinates
        const query = encodeURIComponent(`${address}, ${city}`);
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_TOKEN}&limit=1`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.features && data.features.length > 0) {
                    const [lng, lat] = data.features[0].center;
                    setCoords({ lat, lng });
                    setViewState(prev => ({ ...prev, latitude: lat, longitude: lng }));
                }
            })
            .catch(err => console.error("Geocoding error:", err));
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
            <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                style={{width: '100%', height: '100%'}}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={MAPBOX_TOKEN}
            >
                <NavigationControl position="bottom-right" />
                
                {coords && (
                    <Marker longitude={coords.lng} latitude={coords.lat} anchor="bottom">
                        <MapPin className="h-8 w-8 text-red-600 fill-red-600 drop-shadow-md" />
                    </Marker>
                )}
            </Map>
        </div>
    );
}
