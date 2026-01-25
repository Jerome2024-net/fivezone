"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddressAutocompleteProps {
    onAddressSelect: (address: string, city: string, coordinates: { lat: number, lng: number }) => void;
    defaultValue?: string;
    placeholder?: string;
}

interface MapboxFeature {
    id: string;
    place_name: string;
    center: [number, number];
    context?: {
        id: string;
        text: string;
    }[];
}

export function AddressAutocomplete({ onAddressSelect, defaultValue = "", placeholder = "Entrez une adresse..." }: AddressAutocompleteProps) {
    const [query, setQuery] = React.useState(defaultValue);
    const [suggestions, setSuggestions] = React.useState<MapboxFeature[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    // Debounce logic
    const [debouncedQuery, setDebouncedQuery] = React.useState(query);
    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 500);
        return () => clearTimeout(timer);
    }, [query]);

    // Click outside to close
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch suggestions
    React.useEffect(() => {
        if (!debouncedQuery || debouncedQuery.length < 3) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            setIsLoading(true);
            try {
                const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
                if (!token) return;

                const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(debouncedQuery)}.json`;
                // Add proximity to bias results? Maybe later. For now global search is fine, or bias to generic Africa view port if needed, but let's keep it general.
                // Types: address, poi (point of interest) are useful for businesses.
                const url = `${endpoint}?access_token=${token}&autocomplete=true&limit=5`;
                
                const res = await fetch(url);
                const data = await res.json();
                
                if (data.features) {
                    setSuggestions(data.features);
                    setIsOpen(true);
                }
            } catch (error) {
                console.error("Error fetching address suggestions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuggestions();
    }, [debouncedQuery]);

    const handleSelect = (feature: MapboxFeature) => {
        // Extract address and city from feature
        // context usually contains region, country, postcode, place (city)
        const cityContext = feature.context?.find(c => c.id.startsWith('place') || c.id.startsWith('locality')); // Locality is often city
        const city = cityContext ? cityContext.text : "";
        
        // Use place_name for the full address input, or construct it.
        // place_name is like "123 Rue de Paris, Paris, France"
        const fullAddress = feature.place_name;

        setQuery(fullAddress);
        setSuggestions([]);
        setIsOpen(false);

        const [lng, lat] = feature.center;
        
        onAddressSelect(fullAddress, city, { lat, lng });
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    placeholder={placeholder}
                    className="pl-9"
                    autoComplete="off"
                />
                {isLoading && (
                    <div className="absolute right-3 top-3">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                )}
            </div>

            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {suggestions.map((feature) => (
                        <div
                            key={feature.id}
                            className="flex items-start gap-2 p-2 hover:bg-slate-50 cursor-pointer transition-colors"
                            onClick={() => handleSelect(feature)}
                        >
                            <MapPin className="h-4 w-4 mt-1 text-slate-400 shrink-0" />
                            <div className="text-sm">
                                <p className="font-medium text-slate-900 line-clamp-1">{feature.place_name.split(',')[0]}</p>
                                <p className="text-xs text-slate-500 line-clamp-1">{feature.place_name}</p>
                            </div>
                        </div>
                    ))}
                     <div className="p-2 border-t border-slate-100 bg-slate-50">
                        <p className="text-[10px] text-center text-slate-400">Powered by Mapbox</p>
                    </div>
                </div>
            )}
        </div>
    );
}
