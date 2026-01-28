import Link from "next/link"
import { Store, Facebook, Twitter, Instagram, Linkedin, Globe } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full bg-[#faf1ed] text-slate-900 border-t border-slate-200">
      <div className="container px-4 md:px-6 mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            
          {/* Logo Column */}
          <div className="md:col-span-1">
             <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-[#34E0A1] p-1.5 rounded-full">
                <Store className="h-6 w-6 text-slate-900" />
              </div>
              <span className="font-black text-xl tracking-tight">FiveZone</span>
            </Link>
             <div className="flex space-x-4 mt-6">
                <Facebook className="h-5 w-5 hover:text-[#34E0A1] cursor-pointer transition-colors" />
                <Twitter className="h-5 w-5 hover:text-[#34E0A1] cursor-pointer transition-colors" />
                <Instagram className="h-5 w-5 hover:text-[#34E0A1] cursor-pointer transition-colors" />
             </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">À propos</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/about" className="hover:underline">À propos de FiveZone</Link></li>
              <li><Link href="#" className="hover:underline">Presse</Link></li>
              <li><Link href="#" className="hover:underline">Ressources et Politiques</Link></li>
              <li><Link href="#" className="hover:underline">Carrières</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">Explorer</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="#" className="hover:underline">Recommander un freelance</Link></li>
              <li><Link href="/register" className="hover:underline">S'inscrire comme Freelance</Link></li>
              <li><Link href="#" className="hover:underline">Rejoindre la communauté</Link></li>
              <li><Link href="#" className="hover:underline">Choix des voyageurs</Link></li>
            </ul>
          </div>

           <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">Espace Pro</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/register" className="hover:underline font-bold text-slate-900">Vous êtes Freelance ?</Link></li>
              <li><Link href="/pricing" className="hover:underline">Nos Tarifs</Link></li>
              <li><Link href="#" className="hover:underline">Placements sponsorisés</Link></li>
            </ul>
          </div>
           
           <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">Paramètres</h3>
            <div className="flex items-center space-x-2 text-sm text-slate-900 cursor-pointer hover:bg-slate-200/50 p-2 rounded -ml-2 w-fit transition-colors">
                 <Globe className="h-4 w-4" />
                 <span className="font-bold">Français (FR)</span>
            </div>
             <div className="flex items-center space-x-2 text-sm text-slate-900 cursor-pointer hover:bg-slate-200/50 p-2 rounded -ml-2 w-fit transition-colors">
                 <span className="font-bold text-lg leading-none">€</span>
                 <span className="font-bold">EUR</span>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-300 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} FiveZone LLC. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-4 md:gap-6">
            <Link href="#" className="hover:underline">Politique de confidentialité</Link>
            <Link href="#" className="hover:underline">Conditions d'utilisation</Link>
            <Link href="#" className="hover:underline">Plan du site</Link>
            <Link href="#" className="hover:underline">Fonctionnement du site</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
