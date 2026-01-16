'use client';

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Loader2 } from "lucide-react"

interface MediaUploadProps {
    onChange: (urls: string[]) => void;
    maxFiles?: number;
    className?: string; // Add styling support
}

export function MediaUpload({ onChange, maxFiles, className }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<string[]>([]) 

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    // Check max files
    if (maxFiles && files.length >= maxFiles) {
        alert(`Vous ne pouvez importer que ${maxFiles} image(s).`);
        return;
    }

    setUploading(true);
    const formData = new FormData();
    // Only take the first file if maxFiles is 1
    const filesToUpload = maxFiles === 1 ? [e.target.files[0]] : Array.from(e.target.files);
    
    filesToUpload.forEach((file) => {
        formData.append('file', file);
    });

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            const newUrls: string[] = [];
            if (data.activeUrl) {
                newUrls.push(data.activeUrl);
            } else if (data.urls) {
                newUrls.push(...data.urls);
            }
            
            let updatedFiles = [];
            if (maxFiles === 1) {
                updatedFiles = newUrls; // Replace if single file mode
            } else {
                updatedFiles = [...files, ...newUrls];
            }

            setFiles(updatedFiles);
            onChange(updatedFiles);

        } else {
            console.error('Upload failed');
        }
    } catch (error) {
        console.error('Error uploading:', error);
    } finally {
        setUploading(false);
    }
  };

  const removeFile = (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);
      onChange(newFiles);
  }

  return (
    <div className={`space-y-3 ${className}`}>
         <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {files.map((url, i) => (
                <div key={i} className={`relative aspect-square rounded-lg overflow-hidden bg-slate-100 group border border-slate-200 ${maxFiles === 1 ? 'col-span-1 ring-2 ring-[#34E0A1]' : ''}`}>
                    <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                    <button 
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-red-500"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </div>
            ))}
            
            {(maxFiles === undefined || files.length < maxFiles) && (
                <label className="border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-all aspect-square min-h-[100px]">
                    <input type="file" className="hidden" multiple={maxFiles !== 1} accept="image/*,video/*" onChange={handleUpload} disabled={uploading} />
                    {uploading ? (
                            <Loader2 className="h-6 w-6 text-[#34E0A1] animate-spin mb-1" />
                    ) : (
                            <Upload className="h-6 w-6 text-slate-400 mb-1" />
                    )}
                    <span className="text-[10px] font-bold text-slate-500 text-center px-1">
                        {uploading ? '...' : (maxFiles === 1 ? 'Logo' : 'Photos')}
                    </span>
                </label>
            )}
        </div>
    </div>
  )
}
