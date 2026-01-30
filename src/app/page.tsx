import { Button } from "@/components/ui/button"
import { SearchSection } from "@/components/home/SearchSection"
import { BusinessCard } from "@/components/home/BusinessCard"
import { MapPin, Utensils, ShoppingBag, Bed, Briefcase, Car, Sparkles, Hammer, Ticket } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export const revalidate = 300 // Revalidate every 5 minutes

export default async function Home() {
  let featuredBusinesses = [];
  let errorLog = null;
  
  try {
     const businesses = await prisma.business.findMany({
         take: 8,
         orderBy: { createdAt: 'desc' },
         include: { 
            category: true,
            media: {
                take: 3,
                select: { url: true }
            }
        }
     });

     featuredBusinesses = businesses.map(b => ({
         id: b.id,
         name: b.name,
         category: { name: b.category.name },
         subscriptionTier: b.subscriptionTier,
         viewCount: b.viewCount,
         rating: b.rating,
         reviewCount: b.reviewCount,
         imageUrl: b.coverUrl || b.imageUrl || undefined,
         images: [b.coverUrl, b.imageUrl, ...b.media.map(m => m.url)].filter(Boolean) as string[],
         hourlyRate: b.hourlyRate || undefined,
         currency: b.currency || 'EUR',
         city: b.city
     }));

  } catch (error: any) {
    console.error("Prisma fetch error:", error);
    errorLog = error.message || JSON.stringify(error);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans">
      
      {/* ERROR DEBUGGING - Only visible if there is an issue */}
      {errorLog && (
        <div className="bg-red-900 text-white p-6 text-center">
            <h2 className="text-xl font-bold mb-2">⚠️ Diagnostic Système</h2>
            <p className="font-mono text-sm max-w-2xl mx-auto break-all bg-black p-4 rounded mb-4">
                {errorLog}
            </p>
            <p className="text-sm">
                Si vous voyez ce message, c'est que la connexion à la base de données a échoué.
                Vérifiez que la variable <strong>DATABASE_URL</strong> est bien définie dans Railway.
            </p>
        </div>
      )}

      {/* 1. HERO SECTION UPDATED - Malt/Fiverr Style */}
      {/* 1. HERO SECTION UPDATED - Malt/Fiverr Style */}
      <section className="relative w-full pt-12 pb-16 md:pt-20 md:pb-24 flex flex-col items-center justify-center bg-[#34E0A1]/10 px-4">
        <div className="container mx-auto w-full max-w-4xl flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-center mb-6 tracking-tight text-slate-900 leading-[1.1]">
            Trouvez le freelance idéal.
          </h1>
          <p className="text-slate-600 text-center mb-8 text-lg md:text-2xl font-medium max-w-2xl">
             Experts vérifiés • Local ou à distance
          </p>
          
          {/* Search Container */}
          <div className="w-full mb-8">
             <SearchSection />
             <div className="mt-4 text-center text-sm text-slate-500 hidden md:block">
                <span className="font-bold text-slate-700">Populaire :</span> Développeur WordPress, Graphiste, Community Manager, Consultant marketing
             </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-2">
             <Button className="h-12 px-8 text-lg font-bold rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20" asChild>
                <Link href="/search">Trouvez un freelance</Link>
             </Button>
             <Button variant="outline" className="h-12 px-8 text-lg font-bold rounded-full border-2 border-slate-900 text-slate-900 hover:bg-slate-50" asChild>
                <Link href="/register">Je veux proposer mes services</Link>
             </Button>
          </div>
        </div>
      </section>

      {/* VISUAL CATEGORIES - "Envie de quoi ?" (Inspiration Style) */}
      <section className="container mx-auto px-4 -mt-8 relative z-20 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[
                { label: 'Développement', img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop', link: '/search?category=Tech' },
                { label: 'Design & Création', img: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=600&auto=format&fit=crop', link: '/search?category=Design' },
                { label: 'Marketing', img: 'https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=600&auto=format&fit=crop', link: '/search?category=Marketing' },
                { label: 'Business', img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=600&auto=format&fit=crop', link: '/search?category=Business' },
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
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Experts à la une</h2>
                    <p className="text-slate-500 mt-2 text-base md:text-lg">Les freelances recommandés par la communauté.</p>
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
                                imageUrl={business.imageUrl}
                                images={business.images}
                                rating={business.rating}
                                reviewCount={business.reviewCount}
                                hourlyRate={business.hourlyRate}
                                currency={business.currency}
                                city={business.city}
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
                <Link href="/search" className="text-sm font-bold text-[#34E0A1]">Voir tous les experts →</Link>
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
                <span>Vous êtes Freelance ?</span>
                <span className="text-[#34E0A1] font-bold group-hover:underline decoration-[#34E0A1] underline-offset-4">
                    Créez votre profil gratuitement
                </span>
             </Link>
          </div>
       </section>
    </div>
  )
}
