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
      <form onSubmit={handleSearch} className="bg-white p-1.5 md:p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 flex items-center max-w-3xl mx-auto transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.18)]">
        <div className="pl-3 md:pl-8 shrink-0">
            <Search className="h-5 w-5 md:h-6 md:w-6 text-slate-800" />
        </div>
        <Input 
            className="flex-1 border-none shadow-none focus-visible:ring-0 text-base md:text-lg placeholder:text-slate-400 h-12 md:h-16 px-3 md:px-4 bg-transparent outline-none ring-0 min-w-0"
            placeholder="Lieux, Hôtels, Activités..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
        <Button 
            type="submit"
            className="rounded-full h-12 md:h-14 px-5 md:px-10 text-sm md:text-lg font-bold bg-[#34E0A1] hover:bg-[#2cbe89] text-slate-900 shadow-none hover:opacity-90 transition-all shrink-0"
        >
            Rechercher
        </Button>
    </form>
  )
}
