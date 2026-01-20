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
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <section className="relative w-full py-16 md:py-24 lg:py-32 flex flex-col items-center justify-center bg-[#34E0A1]/10"> {/* Matching brand color background */}
        <div className="container px-4 md:px-6 mx-auto w-full max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-black text-center mb-4 tracking-tight text-slate-900">
            Les meilleures adresses locales
          </h1>
          <p className="text-slate-600 text-center mb-10 text-lg md:text-xl font-medium">
             Artisans • Commerces • Services • Restaurants
          </p>
          
          {/* Search Container */}
          <SearchSection />


          {/* Quick Categories - Pills directly under search */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-12">
            {[
              { name: 'Restoration', icon: Utensils, label: 'Resto' },
              { name: 'Services', icon: Briefcase, label: 'Pros & Services' },
              { name: 'Shopping', icon: ShoppingBag, label: 'Shopping' },
              { name: 'Travaux', icon: Hammer, label: 'Travaux' },
              { name: 'Auto', icon: Car, label: 'Auto' },
              { name: 'Beaute', icon: Sparkles, label: 'Beauté' },
            ].map((cat) => (
              <Link key={cat.name} href={`/search?category=${cat.name}`} className="group">
                 <div className="flex flex-col items-center gap-2 cursor-pointer">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl border border-slate-200 flex items-center justify-center bg-white group-hover:border-[#34E0A1] group-hover:bg-[#34E0A1]/10 transition-all shadow-sm group-hover:shadow-md">
                        <cat.icon className="h-5 w-5 md:h-7 md:w-7 text-slate-600 group-hover:text-[#34E0A1]" />
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-slate-600 group-hover:text-[#34E0A1]">{cat.label}</span>
                 </div>
              </Link>
            ))}
           </div>
        </div>
      </section>

      {/* Featured Section - "Treat yourself" */}
      <section className="w-full py-16 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Faites-vous plaisir</h2>
                <p className="text-slate-500 mt-2 text-lg">Lieux les mieux notés recommandés par les habitants.</p>
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
                <div className="text-center py-10 bg-slate-50 rounded-xl">
                    <p className="text-slate-500">Aucun établissement pour le moment. Soyez le premier !</p>
                </div>
            )}
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
