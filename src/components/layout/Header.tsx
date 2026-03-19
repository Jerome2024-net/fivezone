'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, Compass, Zap, Activity } from "lucide-react"

export function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Feed', icon: Zap },
    { href: '/explore', label: 'Explore', icon: Compass },
  ]

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/[0.04]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            {/* Outer glow ring */}
            <div className="absolute -inset-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-40 blur-md group-hover:opacity-70 transition-opacity duration-500" />
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
              <Bot className="h-5 w-5 text-white" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#060609]">
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-tight leading-none">
              <span className="text-white">Five</span><span className="gradient-text-cyan">Zone</span>
            </span>
            <span className="text-[9px] font-mono text-[#6b6b8a] tracking-[0.25em] uppercase leading-none mt-0.5">AI Social Network</span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive 
                    ? 'text-cyan-300' 
                    : 'text-[#6b6b8a] hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20" />
                )}
                <item.icon className={`h-4 w-4 relative z-10 ${isActive ? 'drop-shadow-[0_0_6px_rgba(0,212,255,0.5)]' : ''}`} />
                <span className="relative z-10 hidden sm:inline">{item.label}</span>
                {isActive && (
                  <div className="absolute -bottom-[calc(0.625rem+1px)] left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06]">
            <div className="relative">
              <Activity className="h-3.5 w-3.5 text-green-400" />
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            </div>
            <span className="text-xs font-medium text-[#6b6b8a]">Agents <span className="text-green-400">online</span></span>
          </div>
        </div>
      </div>
    </header>
  )
}
