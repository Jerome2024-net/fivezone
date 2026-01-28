'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Code, Palette, Briefcase, Megaphone, Laptop } from "lucide-react"
import { cn } from "@/lib/utils"

export function SearchSection() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const router = useRouter()

  const tabs = [
    { id: 'all', label: 'Tout', icon: Search, placeholder: 'Quel service recherchez-vous ?' },
    { id: 'tech', label: 'Tech', icon: Code, placeholder: 'Développeur React, Python...' },
    { id: 'design', label: 'Design', icon: Palette, placeholder: 'Logo, Webdesign...' },
    { id: 'marketing', label: 'Marketing', icon: Megaphone, placeholder: 'SEO, Rédaction...' },
    { id: 'business', label: 'Business', icon: Briefcase, placeholder: 'Comptable, Juriste...' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() || location.trim()) {
        const searchParams = new URLSearchParams()
        if (query.trim()) searchParams.set('q', query)
        if (location.trim()) searchParams.set('loc', location)
        
        if (activeTab !== 'all') {
            searchParams.set('category', activeTab) // Changed from type to category to match search page
        }
        router.push(`/search?${searchParams.toString()}`)
    }
  }

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0]

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-3 md:gap-4 relative z-10">
        {/* Search Tabs */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide w-full px-1 md:px-0">
            {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium shrink-0",
                            isActive 
                                ? "bg-slate-900 text-white shadow-md scale-105" 
                                : "bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-200"
                        )}
                    >
                        <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        <span>{tab.label}</span>
                    </button>
                )
            })}
        </div>

      <form onSubmit={handleSearch} className="bg-white p-2 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.18)] gap-2 md:gap-0">
        
        {/* WHAT Input */}
        <div className="flex-1 flex items-center relative md:border-r border-slate-200 px-2">
            <Search className="h-5 w-5 text-slate-400 ml-3 shrink-0" />
            <Input 
                className="flex-1 border-none shadow-none focus-visible:ring-0 text-base md:text-lg placeholder:text-slate-400 h-12 md:h-14 px-3 bg-transparent outline-none ring-0 w-full truncate"
                placeholder={currentTab.placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>

        {/* WHERE Input */}
        <div className="md:w-1/3 flex items-center relative px-2">
             <MapPin className="h-5 w-5 text-slate-400 ml-3 shrink-0" />
             <Input 
                className="flex-1 border-none shadow-none focus-visible:ring-0 text-base md:text-lg placeholder:text-slate-400 h-12 md:h-14 px-3 bg-transparent outline-none ring-0 w-full truncate"
                placeholder="Ville ou code postal"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
             />
        </div>

        <Button 
            type="submit"
            size="lg"
            className="rounded-[1.5rem] h-12 md:h-14 md:px-8 bg-[#34E0A1] hover:bg-[#2cbe89] text-slate-900 shadow-sm hover:opacity-90 transition-all shrink-0 m-1 md:m-0 font-bold text-base"
        >
            <span className="md:hidden">Rechercher</span>
            <span className="hidden md:inline">Rechercher</span>
        </Button>
      </form>
    </div>
  )
}
