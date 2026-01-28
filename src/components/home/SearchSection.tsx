'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Code, Palette, Briefcase, Megaphone, Laptop } from "lucide-react"
import { cn } from "@/lib/utils"

export function SearchSection() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const router = useRouter()

  const tabs = [
    { id: 'all', label: 'Tout', icon: Search, placeholder: 'Rechercher une compétence, un freelance...' },
    { id: 'tech', label: 'Tech & Dev', icon: Code, placeholder: 'Développeur React, Python, Mobile...' },
    { id: 'design', label: 'Design', icon: Palette, placeholder: 'Logo, Webdesign, UI/UX...' },
    { id: 'marketing', label: 'Marketing', icon: Megaphone, placeholder: 'SEO, Rédaction, Social Media...' },
    { id: 'business', label: 'Business', icon: Briefcase, placeholder: 'Comptable, Assistant, Juriste...' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
        const searchParams = new URLSearchParams()
        searchParams.set('q', query)
        if (activeTab !== 'all') {
            searchParams.set('type', activeTab)
        }
        router.push(`/search?${searchParams.toString()}`)
    }
  }

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0]

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-3 md:gap-4 relative z-10">
        {/* Search Tabs - Scrollable on mobile, centered on desktop */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide w-full px-1 md:px-0 mask-image-scroll-fade">
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

      <form onSubmit={handleSearch} className="bg-white p-1.5 md:p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 flex items-center transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.18)]">
        <div className="hidden md:block pl-6 md:pl-8 shrink-0">
            <Search className="h-6 w-6 text-slate-800" />
        </div>
        <Input 
            className="flex-1 border-none shadow-none focus-visible:ring-0 text-base md:text-lg placeholder:text-slate-400 h-12 md:h-16 px-4 md:px-4 bg-transparent outline-none ring-0 min-w-0"
            placeholder={currentTab.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
        <Button 
            type="submit"
            size="icon"
            className="rounded-full h-11 w-11 md:w-auto md:h-14 md:px-10 bg-[#34E0A1] hover:bg-[#2cbe89] text-slate-900 shadow-none hover:opacity-90 transition-all shrink-0"
        >
            <Search className="h-5 w-5 md:hidden" />
            <span className="hidden md:inline text-lg font-bold">Rechercher</span>
        </Button>
      </form>
    </div>
  )
}
