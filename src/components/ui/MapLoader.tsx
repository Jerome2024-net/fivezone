'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const MapboxMap = dynamic(() => import('./MapboxMap'), { 
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-slate-50 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
        </div>
    )
});

interface MapLoaderProps {
    address: string;
    city: string;
}

export default function MapLoader({ address, city }: MapLoaderProps) {
    return <MapboxMap address={address} city={city} />;
}
