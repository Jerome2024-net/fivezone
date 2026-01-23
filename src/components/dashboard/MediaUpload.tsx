'use client';

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function MediaUpload() {
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<string[]>([]) // Store URLs of uploaded files

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setUploading(true);
    
    const filesToUpload = Array.from(e.target.files);
    const newUrls: string[] = [];

    try {
        for (const file of filesToUpload) {
             const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
             
             const { error: uploadError } = await supabase.storage
                .from('uploads')
                .upload(filename, file);

             if (uploadError) throw uploadError;

             const { data: { publicUrl } } = supabase.storage
                .from('uploads')
                .getPublicUrl(filename);
                
             newUrls.push(publicUrl);
        }

        setFiles(prev => [...prev, ...newUrls]);

    } catch (error) {
        console.error('Error uploading:', error);
        alert("Une erreur est survenue lors de l'upload.");
    } finally {
        setUploading(false);
    }
  };

  const removeFile = (index: number) => {
      setFiles(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <Card className="border-none shadow-sm h-full">
        <CardContent className="p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Galerie Média</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {files.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 group">
                        <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                        <button 
                            onClick={() => removeFile(i)}
                            className="absolute top-1 right-1 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-red-500"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
                
                <label className="border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-all aspect-square">
                    <input type="file" className="hidden" multiple accept="image/*,video/*" onChange={handleUpload} disabled={uploading} />
                    {uploading ? (
                         <Loader2 className="h-8 w-8 text-[#34E0A1] animate-spin mb-2" />
                    ) : (
                         <Upload className="h-8 w-8 text-slate-400 mb-2" />
                    )}
                    <span className="text-xs font-bold text-slate-500">
                        {uploading ? 'Envoi...' : 'Ajouter Photos/Vidéos'}
                    </span>
                </label>
            </div>
            
            <p className="text-xs text-slate-500">
                Formats supportés : JPG, PNG, MP4. Taille max : 5MB.
            </p>
        </CardContent>
    </Card>
  )
}
