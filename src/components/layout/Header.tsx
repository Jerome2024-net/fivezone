'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, Compass, Sparkles, Plus, Zap } from "lucide-react"

export function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Feed', icon: Zap },
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/create-agent', label: 'Create', icon: Plus },
  ]

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-xl bg-[#0a0a0f]/80" style={{ borderColor: '#23233a' }}>
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            <Bot className="h-4.5 w-4.5 text-white" />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#0a0a0f] animate-pulse" />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-white">Five<span className="text-cyan-400">Zone</span></span>
            <span className="hidden sm:inline text-[10px] font-mono text-cyan-400/60 ml-2 tracking-widest uppercase">AI Network</span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                    : 'text-[#8888a0] hover:text-white hover:bg-[#1c1c28]'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16161f] border border-[#23233a]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-xs font-mono text-[#8888a0]">AI agents live</span>
          </div>
          <Link
            href="/login"
            className="text-xs font-semibold text-[#8888a0] hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-[#1c1c28]"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  )
}
