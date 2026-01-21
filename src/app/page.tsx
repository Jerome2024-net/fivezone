import { Button } from "@/components/ui/button"
import { SearchSection } from "@/components/home/SearchSection"
import { BusinessCard } from "@/components/home/BusinessCard"
import { MapPin, Utensils, ShoppingBag, Bed, Briefcase, Car, Sparkles, Hammer } from "lucide-react"
import Link from "next/link"
import { database } from "@/lib/firebase" 
import { ref, get, query, limitToLast } from "firebase/database"

export const dynamic = 'force-dynamic'

export default async function Home() {
  let featuredBusinesses = [];
  try {
     const usersRef = ref(database, 'users');
     // Fetch last 10 users to show latest businesses
     // Note: In real app, we would have a separate 'businesses' collection
     const q = query(usersRef, limitToLast(8));
     const snapshot = await get(q);
     
     if (snapshot.exists()) {
         const data = snapshot.val();
         featuredBusinesses = Object.values(data)
            .filter((u: any) => u.business) // Only keep users with business
            .map((u: any) => ({
                id: u.id || Math.random().toString(), // Fallback ID if missing
                name: u.business.name,
                category: { name: u.business.category },
                subscriptionTier: u.role === 'OWNER' ? 'FREE' : 'FREE', // Default
                viewCount: 0,
                rating: 5
            }))
            .reverse(); // Show newest first
     }
  } catch (error) {
    console.error("Firebase fetch error:", error);
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
        </div>
      </section>

      {/* VISUAL CATEGORIES - "Envie de quoi ?" (Inspiration Style) */}
      <section className="container mx-auto px-4 -mt-8 relative z-20 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[
                { label: 'Restaurants & Bars', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop', link: '/search?category=Restoration' },
                { label: 'Shopping', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop', link: '/search?category=Shopping' },
                { label: 'Bien-être', img: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=600&auto=format&fit=crop', link: '/search?category=Beaute' },
                { label: 'Événements', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop', link: '/search?category=Events' },
            ].map((item, idx) => (
                <Link href={item.link} key={idx} className="group relative h-32 md:h-48 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all block">
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors z-10" />
                    <img 
                        src={item.img} 
                        alt={item.label} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 z-20 bg-gradient-to-t from-black/80 to-transparent">
                        <span className="text-white font-bold text-sm md:text-lg">{item.label}</span>
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
