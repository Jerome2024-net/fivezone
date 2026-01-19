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
           <div className="flex flex-wrap justify-center gap-4 mt-12">
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

       {/* Banner / CTA Section */}
       <section className="w-full py-16 bg-white border-t border-slate-100">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
             <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl">
                {/* Decoration background */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-[#34E0A1] rounded-full blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-20"></div>

                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
                   <div className="flex-1 space-y-6">
                      <div className="inline-block px-3 py-1 rounded-full bg-[#34E0A1]/20 text-[#34E0A1] text-xs font-bold uppercase tracking-wider">
                        Espace Propriétaire
                      </div>
                      <div>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                            Développez votre business.
                        </h2>
                        <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
                            Ne laissez plus vos concurrents prendre votre place. Rejoignez les meilleurs établissements et accédez à une clientèle exclusive.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 pt-2">
                        <div className="flex items-center justify-center md:justify-start gap-3 text-slate-200 font-medium">
                             <div className="bg-[#34E0A1]/10 p-1 rounded-full"><span className="text-[#34E0A1] font-bold">✓</span></div> Top Recherche & Visibilité
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-3 text-slate-200 font-medium">
                             <div className="bg-[#34E0A1]/10 p-1 rounded-full"><span className="text-[#34E0A1] font-bold">✓</span></div> Badge Vérifié "Premium"
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-3 text-slate-200 font-medium">
                             <div className="bg-[#34E0A1]/10 p-1 rounded-full"><span className="text-[#34E0A1] font-bold">✓</span></div> Lien WhatsApp Direct
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-3 text-slate-200 font-medium">
                             <div className="bg-[#34E0A1]/10 p-1 rounded-full"><span className="text-[#34E0A1] font-bold">✓</span></div> Photos Illimitées
                        </div>
                      </div>
                   </div>

                   <div className="flex flex-col items-center justify-center bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm shadow-xl min-w-[320px] md:min-w-[360px] transform md:-rotate-1 transition-transform hover:rotate-0 duration-500">
                        <Link href="/register" className="w-full">
                            <Button className="w-full h-16 bg-[#34E0A1] hover:bg-[#2cbe89] text-slate-900 font-black rounded-full text-xl shadow-[0_0_20px_rgba(52,224,161,0.3)] hover:shadow-[0_0_30px_rgba(52,224,161,0.5)] transition-all transform hover:-translate-y-1">
                                JE RÉFÉRENCE MON OFFRE
                            </Button>
                        </Link>
                   </div>
                </div>
             </div>
          </div>
       </section>
    </div>
  )
}
