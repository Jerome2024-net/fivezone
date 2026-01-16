'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchSection() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
      <form onSubmit={handleSearch} className="bg-white p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 flex items-center max-w-3xl mx-auto transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.18)]">
        <div className="pl-6 md:pl-8">
            <Search className="h-6 w-6 text-slate-800" />
        </div>
        <Input 
            className="flex-1 border-none shadow-none focus-visible:ring-0 text-lg placeholder:text-slate-400 h-14 md:h-16 px-4 bg-transparent outline-none ring-0"
            placeholder="Lieux à visiter, activités, hôtels..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
        <Button 
            type="submit"
            className="rounded-full h-12 md:h-14 px-8 md:px-10 text-lg font-bold bg-[#34E0A1] hover:bg-[#2cbe89] text-slate-900 shadow-none hover:opacity-90 transition-all"
        >
            Rechercher
        </Button>
    </form>
  )
}
