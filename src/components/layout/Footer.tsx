import Link from "next/link"
import { Store, Facebook, Twitter, Instagram, Linkedin, Globe } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full bg-[#faf1ed] text-slate-900 border-t border-slate-200">
      <div className="container px-4 md:px-6 mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            
          {/* Logo Column */}
          <div className="md:col-span-1">
             <Link href="/" className="flex items-center space-x-2.5 mb-6 group">
              <div className="bg-slate-900 p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-200">
                  <Store className="h-5 w-5 text-[#34E0A1]" />
              </div>
              <span className="font-[family-name:var(--font-playfair)] font-bold text-2xl tracking-normal text-slate-900">
                  Five<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34E0A1] to-[#10b981]">zone</span>
              </span>
            </Link>
             <div className="flex space-x-4 mt-6">
                <Facebook className="h-5 w-5 hover:text-[#34E0A1] cursor-pointer transition-colors" />
                <Twitter className="h-5 w-5 hover:text-[#34E0A1] cursor-pointer transition-colors" />
                <Instagram className="h-5 w-5 hover:text-[#34E0A1] cursor-pointer transition-colors" />
             </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">About</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/about" className="hover:underline">About FiveZone</Link></li>
              <li><Link href="#" className="hover:underline">Press</Link></li>
              <li><Link href="#" className="hover:underline">Resources & Policies</Link></li>
              <li><Link href="#" className="hover:underline">Careers</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">Explore</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="#" className="hover:underline">Recommend an expert</Link></li>
              <li><Link href="/register" className="hover:underline">Register as Freelancer</Link></li>
              <li><Link href="#" className="hover:underline">Join the community</Link></li>
              <li><Link href="#" className="hover:underline">Top Picks</Link></li>
            </ul>
          </div>

           <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">For Pros</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/register" className="hover:underline font-bold text-slate-900">Are you a Freelancer?</Link></li>
              <li><Link href="/pricing" className="hover:underline">Our Pricing</Link></li>
              <li><Link href="#" className="hover:underline">Sponsored placements</Link></li>
            </ul>
          </div>
           
           <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">Settings</h3>
            <div className="flex items-center space-x-2 text-sm text-slate-900 cursor-pointer hover:bg-slate-200/50 p-2 rounded -ml-2 w-fit transition-colors">
                 <Globe className="h-4 w-4" />
                 <span className="font-bold">English (EN)</span>
            </div>
             <div className="flex items-center space-x-2 text-sm text-slate-900 cursor-pointer hover:bg-slate-200/50 p-2 rounded -ml-2 w-fit transition-colors">
                 <span className="font-bold text-lg leading-none">$</span>
                 <span className="font-bold">USD</span>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-300 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} FiveZone LLC. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 md:gap-6">
            <Link href="#" className="hover:underline">Privacy Policy</Link>
            <Link href="#" className="hover:underline">Terms of Service</Link>
            <Link href="#" className="hover:underline">Sitemap</Link>
            <Link href="#" className="hover:underline">How it works</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
