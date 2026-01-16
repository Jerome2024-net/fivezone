"use client"

import Link from "next/link"
import { Store, Search, User, LogOut, PenLine, Heart, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="container flex h-20 items-center justify-between px-4 md:px-6 mx-auto">
        <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
            <div className="bg-[#34E0A1] p-1.5 rounded-full">
                <Store className="h-6 w-6 text-slate-900" />
            </div>
            <span className="hidden md:inline-block font-black text-2xl tracking-tight text-slate-900">
                FiveZone
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

            {status === 'loading' ? (
                <div className="h-10 w-24 bg-slate-100 animate-pulse rounded-full" />
            ) : session ? (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="gap-2 rounded-full hover:bg-slate-100 h-10 px-4">
                        <User className="h-4 w-4" />
                        <span className="font-bold">{session.user?.name || "User"}</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => signOut()} className="rounded-full hover:bg-slate-100">
                        <LogOut className="h-4 w-4" />
                        <span className="sr-only">Se déconnecter</span>
                    </Button>
                </div>
            ) : (
                <Button size="lg" className="rounded-full bg-slate-900 text-white hover:bg-slate-800 font-bold h-10 px-6" asChild>
                    <Link href="/login">Se connecter</Link>
                </Button>
            )}
        </div>
      </div>
    </header>
  )
}
