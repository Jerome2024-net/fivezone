import { Button } from "@/components/ui/button"
import { SearchSection } from "@/components/home/SearchSection"
import { BusinessCard } from "@/components/home/BusinessCard"
import { MapPin, Utensils, ShoppingBag, Bed, Briefcase, Car, Sparkles, Hammer } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export default async function Home() {
  let featuredBusinesses = [];
  try {
    featuredBusinesses = await prisma.business.findMany({
      take: 4,
      orderBy: [
        { subscriptionTier: 'desc' },
        { viewCount: 'desc' },
        { rating: 'desc' }
      ],
      include: {
        category: true
      }
    });
  } catch (error) {
    console.error("Database error:", error);
    // On ignore l'erreur pour afficher quand même la page
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans">
      {/* 1. HERO SECTION UPDATED - Style plus TripAdvisor/Airbnb (Fond Vert Pale + Titre Intact) */}
      <section className="relative w-full pt-12 pb-16 md:pt-20 md:pb-24 flex flex-col items-center justify-center bg-[#34E0A1]/10 px-4">
        <div className="container mx-auto w-full max-w-4xl flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-black text-center mb-4 tracking-tight text-slate-900">
            Les meilleures adresses locales
          </h1>
          <p className="text-slate-600 text-center mb-10 text-lg md:text-xl font-medium">
             Artisans • Commerces • Services • Restaurants
          </p>
          
          {/* Search Container */}
          <div className="w-full mb-10">
             <SearchSection />
          </div>

          {/* 2. CATEGORIES REFINED - Style minimaliste (Icône simple + Texte) */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-4">
            {[
              { name: 'Restoration', icon: Utensils, label: 'Resto' },
              { name: 'Services', icon: Briefcase, label: 'Services' },
              { name: 'Shopping', icon: ShoppingBag, label: 'Mode' },
              { name: 'Travaux', icon: Hammer, label: 'Travaux' },
              { name: 'Auto', icon: Car, label: 'Auto' },
              { name: 'Beaute', icon: Sparkles, label: 'Beauté' },
            ].map((cat) => (
              <Link key={cat.name} href={`/search?category=${cat.name}`} className="group flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                 {/* Suppression des bordures lourdes, focus sur l'icône */}
                 <div className="p-3 bg-[#34E0A1]/10 rounded-full group-hover:bg-[#34E0A1]/20 transition-colors">
                    <cat.icon className="h-6 w-6 text-slate-700 group-hover:text-[#34E0A1]" strokeWidth={2} />
                 </div>
                 <span className="text-sm font-semibold text-slate-700 border-b-2 border-transparent group-hover:border-[#34E0A1] pb-0.5">{cat.label}</span>
              </Link>
            ))}
           </div>
        </div>
      </section>

      {/* VISUAL CATEGORIES - "Explorer par Centres d'Intérêt" */}
      <section className="container mx-auto px-4 mt-8 md:mt-12 mb-12">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">Explorez selon vos envies</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {[
                { label: 'Aventure', icon: '🏃', img: 'https://images.unsplash.com/photo-1533692328991-08159ff19fca?q=80&w=600&auto=format&fit=crop', link: '/search?q=aventure' },
                { label: 'Culture & Art', icon: '🎭', img: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=600&auto=format&fit=crop', link: '/search?q=culture' },
                { label: 'Sport', icon: '⚽', img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop', link: '/search?q=sport' },
                { label: 'Famille', icon: '👨‍👩‍👧‍👦', img: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=600&auto=format&fit=crop', link: '/search?q=famille' },
                { label: 'Détente', icon: '🧘‍♀️', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop', link: '/search?q=detente' },
            ].map((item, idx) => (
                <Link href={item.link} key={idx} className="group relative h-40 md:h-56 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all block">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                    <img 
                        src={item.img} 
                        alt={item.label} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4 z-20 flex flex-col items-center text-center">
                        <span className="text-2xl mb-1 transform group-hover:-translate-y-1 transition-transform">{item.icon}</span>
                        <span className="text-white font-bold text-base md:text-lg">{item.label}</span>
                        <span className="text-white/80 text-xs mt-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">Découvrir</span>
                    </div>
                </Link>
            ))}
        </div>
      </section>

      {/* 3. FEATURED SECTION - Plus aérée + Horizontal Scroll Mobile */}
      <section className="w-full py-12 md:py-16 bg-slate-50/50">
        <div className="container px-4 md:px-6 mx-auto">
            <div className="flex items-end justify-between mb-6 md:mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Le top du moment 🔥</h2>
                    <p className="text-slate-500 mt-2 text-base md:text-lg">Les adresses plébiscitées par la communauté.</p>
                </div>
                {/* Lien "Voir tout" style TripAdvisor */}
                <Link href="/search" className="hidden md:block text-sm font-bold underline decoration-2 decoration-slate-200 hover:decoration-[#34E0A1] transition-all">
                    Voir tout
                </Link>
            </div>
            
            {featuredBusinesses.length > 0 ? (
                <div className="flex -mx-4 px-4 pb-4 md:mx-0 md:px-0 md:pb-0 overflow-x-auto md:overflow-visible md:grid md:grid-cols-4 gap-4 md:gap-6 scrollbar-hide snap-x snap-mandatory">
                     {featuredBusinesses.map((business) => (
                        <div key={business.id} className="min-w-[280px] md:min-w-0 snap-center">
                            <BusinessCard 
                                id={business.id}
                                name={business.name}
                                category={business.category.name}
                                promoted={business.subscriptionTier === 'PRO'}
                            />
                        </div>
                     ))}
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-white">
                    <p className="text-slate-400 font-medium">Bientôt des pépites ici...</p>
                </div>
            )}
             <div className="mt-8 text-center md:hidden">
                <Link href="/search" className="text-sm font-bold text-[#34E0A1]">Voir tous les lieux →</Link>
             </div>
        </div>
      </section>

       {/* Banner / CTA Section - Google Style Link */}
       <section className="w-full py-8 md:py-12 bg-white border-t border-slate-100/50">
          <div className="container px-4 mx-auto flex justify-center">
             <Link 
                href="/pricing"
                className="text-sm md:text-base font-medium text-slate-500 hover:text-slate-900 transition-colors flex flex-col sm:flex-row items-center gap-1 md:gap-2 group px-6 py-3 rounded-xl hover:bg-slate-50 text-center"
             >
                <span>Propriétaire d'un établissement ?</span>
                <span className="text-[#34E0A1] font-bold group-hover:underline decoration-[#34E0A1] underline-offset-4">
                    Référencez-vous ici
                </span>
             </Link>
          </div>
       </section>
    </div>
  )
}
