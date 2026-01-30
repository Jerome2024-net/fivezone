"use client"

import Link from "next/link"
import { Store, Search, User, LogOut, PenLine, Heart, Bell, Menu, X, LayoutDashboard, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import { useState, useRef, useEffect } from "react"

export function Header() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen)

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm transition-all duration-300">
      <div className="container flex h-20 items-center justify-between px-4 md:px-6 mx-auto">
        <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="bg-slate-900 p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-200">
                  <Store className="h-5 w-5 text-[#34E0A1]" />
              </div>
              <span className="font-[family-name:var(--font-playfair)] font-bold text-2xl tracking-normal text-slate-900">
                  Five<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34E0A1] to-[#10b981]">zone</span>
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
                <Button asChild variant="ghost" className="rounded-full font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 h-10 px-4">
                    <Link href="/search">Découvrir</Link>
                </Button>
                <Button asChild variant="ghost" className="rounded-full font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 h-10 px-4">
                     <Link href="/pricing">Tarifs</Link>
                </Button>
                <Button asChild variant="ghost" className="rounded-full font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 h-10 px-4">
                     <Link href="/about">À propos</Link>
                </Button>
            </nav>
        </div>

        <div className="flex items-center gap-2"> 
             <div className="hidden md:flex items-center gap-2 mr-2">
                <Button variant="ghost" size="icon" className="rounded-full text-slate-700 hover:bg-slate-100">
                    <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full text-slate-700 hover:bg-slate-100">
                    <Bell className="h-5 w-5" />
                </Button>
             </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden text-slate-900" onClick={toggleMenu}>
                <Menu className="h-6 w-6" />
            </Button>

            <div className="hidden md:block">
            {status === 'loading' ? (
                <div className="h-10 w-24 bg-slate-100 animate-pulse rounded-full" />
            ) : session ? (
                <div className="relative" ref={userMenuRef}>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-2 rounded-full hover:bg-slate-100 h-10 pl-2 pr-4 border border-slate-200"
                        onClick={toggleUserMenu}
                    >
                        <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                             {session.user?.image ? (
                                <img src={session.user.image} alt="Profile" className="h-full w-full object-cover" />
                             ) : (
                                <span className="text-white font-bold text-xs">
                                    {session.user?.name?.substring(0,2).toUpperCase() || "US"}
                                </span>
                             )}
                        </div>
                        <span className="font-bold text-slate-700">{session.user?.name || "User"}</span>
                    </Button>

                    {/* User Dropdown Menu */}
                    {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 animate-in fade-in slide-in-from-top-2">
                            <div className="px-4 py-3 border-b border-slate-100 mb-2">
                                <p className="text-sm font-bold text-slate-900">{session.user?.name}</p>
                                <p className="text-xs text-slate-500 truncate">{session.user?.email}</p>
                            </div>
                            
                            <Link href="/dashboard" onClick={() => setIsUserMenuOpen(false)}>
                                <div className="px-4 py-2 hover:bg-slate-50 flex items-center gap-3 cursor-pointer text-slate-700 hover:text-slate-900">
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span className="font-medium">Mon Espace Admin</span>
                                </div>
                            </Link>

                             <Link href="/dashboard" onClick={() => setIsUserMenuOpen(false)}>
                                <div className="px-4 py-2 hover:bg-slate-50 flex items-center gap-3 cursor-pointer text-slate-700 hover:text-slate-900">
                                    <Settings className="h-4 w-4" />
                                    <span className="font-medium">Paramètres</span>
                                </div>
                            </Link>
                            
                            <div className="h-px bg-slate-100 my-2" />
                            
                            <button 
                                onClick={() => signOut()}
                                className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-3 cursor-pointer text-red-600"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="font-medium">Se déconnecter</span>
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <Button size="lg" className="rounded-full bg-slate-900 text-white hover:bg-slate-800 font-bold h-10 px-6" asChild>
                    <Link href="/login">Se connecter</Link>
                </Button>
            )}
            </div>
        </div>
      </div>


      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-[100dvh] bg-white z-[9999] flex flex-col md:hidden animate-in fade-in duration-200">
            {/* Header du Menu */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 h-16 bg-white shrink-0">
                 <span className="font-bold text-lg text-slate-900">Menu</span>
                 <Button variant="ghost" size="icon" onClick={toggleMenu} className="rounded-full hover:bg-slate-100">
                    <X className="h-6 w-6 text-slate-900" />
                 </Button>
            </div>
            
            {/* Contenu du Menu */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col">
                <nav className="flex flex-col gap-6">
                    <Link href="/search" onClick={() => setIsMenuOpen(false)} className="text-[17px] font-medium text-slate-700 hover:text-slate-900 py-1">
                        Découvrir
                    </Link>
                    <Link href="/pricing" onClick={() => setIsMenuOpen(false)} className="text-[17px] font-medium text-slate-700 hover:text-slate-900 py-1">
                        Tarifs
                    </Link>
                    <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-[17px] font-medium text-slate-700 hover:text-slate-900 py-1">
                        À propos
                    </Link>
                </nav>

                <div className="mt-auto pt-8 pb-8 border-t border-slate-100 flex flex-col gap-4">
                    {session ? (
                        <>
                             <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                    {session.user?.image ? (
                                        <img src={session.user.image} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-slate-500 font-bold text-sm">
                                            {session.user?.name?.substring(0,2).toUpperCase() || "US"}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-[15px] text-slate-900">{session.user?.name}</p>
                                    <p className="text-sm text-slate-500">{session.user?.email}</p>
                                </div>
                            </div>
                            
                            <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                <Button className="w-full h-12 text-[16px] font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 justify-start px-4">
                                    <LayoutDashboard className="h-4 w-4 mr-3" />
                                    Mon Espace Admin
                                </Button>
                            </Link>

                            <Button variant="outline" className="w-full h-12 text-[16px] font-medium text-red-600 border-slate-200 hover:bg-red-50 rounded-lg justify-start px-4" onClick={() => signOut()}>
                                <LogOut className="h-4 w-4 mr-3" />
                                Se déconnecter
                            </Button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Button size="lg" className="w-full h-12 rounded-lg bg-[#34E0A1] hover:bg-[#2bc98e] text-slate-900 font-bold text-[16px]" asChild>
                                <Link href="/login" onClick={() => setIsMenuOpen(false)}>Se connecter / S'inscrire</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </header>
  )
}
