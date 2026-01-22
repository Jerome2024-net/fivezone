"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react"
import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label: string;
    className?: string;
    aspectRatio?: "square" | "video" | "wide";
}

export function ImageUpload({ value, onChange, label, className, aspectRatio = "square" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setUploading(true);
        setError(null);
        const file = e.target.files[0];

        try {
            // Client-side Upload to Firebase Storage
            const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const storageRef = ref(storage, `uploads/${filename}`);
            
            const metadata = {
                contentType: file.type,
            };

            const snapshot = await uploadBytes(storageRef, file, metadata);
            const downloadURL = await getDownloadURL(snapshot.ref);

            onChange(downloadURL);
        } catch (error: any) {
            console.error("Upload failed:", error);
            setError("Erreur lors de l'upload. Vérifiez votre connexion.");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className={`space-y-2 ${className}`}>
            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between">
                {label}
                {uploading && <span className="text-xs text-muted-foreground animate-pulse">Envoi en cours...</span>}
            </span>
            
            <div className={`
                relative border-2 border-dashed rounded-lg 
                flex flex-col items-center justify-center 
                transition-all overflow-hidden
                ${error ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'}
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
                            {uploading ? "..." : (error ? "Réessayer" : "Image")}
                        </span>
                    </label>
                )}
            </div>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>
    )
}
