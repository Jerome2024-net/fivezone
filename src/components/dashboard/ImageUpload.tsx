"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react"

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label: string;
    className?: string;
    aspectRatio?: "square" | "video" | "wide";
}

export function ImageUpload({ value, onChange, label, className, aspectRatio = "square" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                if (data.activeUrl) {
                    onChange(data.activeUrl);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className={`space-y-2 ${className}`}>
            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
            </span>
            
            <div className={`
                relative border-2 border-dashed border-slate-200 rounded-lg 
                flex flex-col items-center justify-center 
                hover:border-slate-400 hover:bg-slate-50 transition-all
                overflow-hidden
                ${aspectRatio === 'square' ? 'aspect-square w-32' : 'aspect-video w-full'}
            `}>
                {value ? (
                    <>
                        <img src={value} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault(); 
                                onChange(""); 
                            }}
                            className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-slate-700 hover:text-red-500 hover:bg-white transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </>
                ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full p-4">
                        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                        {uploading ? (
                             <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
                        ) : (
                             <Upload className="h-6 w-6 text-slate-400 mb-2" />
                        )}
                        <span className="text-xs text-slate-500 text-center">
                            {uploading ? "..." : "Image"}
                        </span>
                    </label>
                )}
            </div>
        </div>
    )
}
