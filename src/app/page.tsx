import { Button } from "@/components/ui/button"
import { SearchSection } from "@/components/home/SearchSection"
import { BusinessCard } from "@/components/home/BusinessCard"
import { MapPin, Utensils, ShoppingBag, Bed } from "lucide-react"
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
      {/* Hero Section - TripAdvisor Style: Clean, Centered, Search-Focused */}
      <section className="relative w-full py-16 md:py-24 lg:py-32 flex flex-col items-center justify-center bg-[#34E0A1]/10"> {/* Matching brand color background */}
        <div className="container px-4 md:px-6 mx-auto w-full max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-black text-center mb-12 tracking-tight text-slate-900">
            Où aller ?
          </h1>
          
          {/* Search Container */}
          <SearchSection />


          {/* Quick Categories - Pills directly under search */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-12">
            {[
              { name: 'Restaurants', icon: Utensils, label: 'Restaurants' },
              { name: 'Hotels', icon: Bed, label: 'Hôtels' },
              { name: 'Things to Do', icon: MapPin, label: 'Quoi faire' },
              { name: 'Shopping', icon: ShoppingBag, label: 'Shopping' },
            ].map((cat) => (
              <Link key={cat.name} href={`/search?category=${cat.name}`} className="group">
                 <div className="flex flex-col items-center gap-2 cursor-pointer">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-slate-200 flex items-center justify-center bg-white group-hover:border-slate-900 transition-colors">
                        <cat.icon className="h-6 w-6 md:h-8 md:w-8 text-slate-700 group-hover:text-slate-900" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 underline-offset-4 group-hover:underline">{cat.label}</span>
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
       <section className="w-full py-12 bg-white border-t border-slate-100/50">
          <div className="container px-4 mx-auto flex justify-center">
             <Link 
                href="/pricing"
                className="text-sm md:text-base font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 group px-4 py-2 rounded-full hover:bg-slate-50"
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
