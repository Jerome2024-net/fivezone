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
      {/* 1. HERO SECTION UPDATED - Style plus TripAdvisor/Airbnb (Fond Blanc + Typo Forte) */}
      <section className="relative w-full pt-12 pb-16 md:pt-20 md:pb-24 flex flex-col items-center justify-center bg-white px-4">
        <div className="container mx-auto w-full max-w-4xl flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-black text-center mb-6 tracking-tight text-slate-900 leading-[1.1]">
            Tout trouver,<br/> 
            <span className="text-[#34E0A1]">près de chez vous.</span>
          </h1>
          
          {/* Search Container - Shadow plus marquée pour flotter */}
          <div className="w-full mb-10 shadow-xl shadow-slate-200/50 rounded-full">
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
                 <div className="p-3 bg-slate-50 rounded-full group-hover:bg-[#34E0A1]/20 transition-colors">
                    <cat.icon className="h-6 w-6 text-slate-700 group-hover:text-[#34E0A1]" strokeWidth={2} />
                 </div>
                 <span className="text-sm font-semibold text-slate-700 border-b-2 border-transparent group-hover:border-[#34E0A1] pb-0.5">{cat.label}</span>
              </Link>
            ))}
           </div>
        </div>
      </section>

      {/* 3. FEATURED SECTION - Plus aérée */}
      <section className="w-full py-16 bg-slate-50/50">
        <div className="container px-4 md:px-6 mx-auto">
            <div className="flex items-end justify-between mb-8">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                     {featuredBusinesses.map((business) => (
                        <BusinessCard 
                            key={business.id}
                            id={business.id}
                            name={business.name}
                            category={business.category.name}
                            promoted={business.subscriptionTier === 'PRO'}
                        />
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
