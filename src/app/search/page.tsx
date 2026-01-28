import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import Link from "next/link"
import { SearchResultCard } from "@/components/search/SearchResultCard"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export const dynamic = 'force-dynamic'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { q, category, loc } = await searchParams;
  const searchTerm = (typeof q === 'string' ? q : '').toLowerCase();
  const categoryTerm = (typeof category === 'string' ? category : '').toLowerCase();
  const locationTerm = (typeof loc === 'string' ? loc : '').toLowerCase();
  
  // Fetch From Prisma
  const results = await prisma.business.findMany({
    where: {
      AND: [
        searchTerm ? {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { skills: { hasSome: [searchTerm] } }, // Also search in skills
          ]
        } : {},
        locationTerm ? {
            OR: [
                { city: { contains: locationTerm, mode: 'insensitive' } },
                { address: { contains: locationTerm, mode: 'insensitive' } },
                { country: { contains: locationTerm, mode: 'insensitive' } }
            ]
        } : {},
        categoryTerm ? {
          category: {
            OR: [
                { name: { contains: categoryTerm, mode: 'insensitive' } },
                { slug: { contains: categoryTerm, mode: 'insensitive' } }
            ]
          }
        } : {}
      ]
    },
    include: {
      category: true
    }
  });

  let title = 'Tous les freelances';
  if (searchTerm && locationTerm) title = `Résultats pour "${searchTerm}" à "${locationTerm}"`;
  else if (searchTerm) title = `Résultats pour "${searchTerm}"`;
  else if (categoryTerm) title = `Experts en ${categoryTerm}`;
  else if (locationTerm) title = `Experts à ${locationTerm}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-black text-slate-900">{title}</h1>
              <p className="text-slate-500 mt-2">Affichage de {results.length} résultats correspondant à vos critères</p>
          </div>
      </div>

      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 space-y-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center text-slate-900">
                <Filter className="mr-2 h-4 w-4" /> Filtres
              </h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900">Catégorie</label>
                  <div className="space-y-2">
                    {['Tech', 'Design', 'Marketing', 'Business', 'Redaction', 'Photo'].map((cat) => (
                      <Link key={cat} href={`/search?category=${cat}`} className="flex items-center space-x-2 group cursor-pointer">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${categoryTerm.includes(cat.toLowerCase()) ? 'bg-[#34E0A1] border-[#34E0A1]' : 'border-slate-300'}`}>
                           {categoryTerm.includes(cat.toLowerCase()) && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className={`text-sm ${categoryTerm.includes(cat.toLowerCase()) ? 'font-bold text-[#34E0A1]' : 'text-slate-700 group-hover:text-slate-900'}`}>{cat}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900">TJM (Taux Journalier)</label>
                  <div className="flex flex-wrap gap-2">
                    {['< 300€', '300-600€', '> 600€'].map((price) => (
                      <button key={price} className="flex-1 py-1 px-2 text-xs border border-slate-300 rounded hover:bg-slate-50 font-medium whitespace-nowrap">
                        {price}
                      </button>
                    ))}
                  </div>
                </div>

                 <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900">Note</label>
                   <div className="flex flex-col gap-2">
                       {[5, 4, 3].map(rating => (
                           <div key={rating} className="flex items-center gap-2 text-sm text-slate-600">
                               <input type="radio" name="rating" className="text-[#34E0A1] focus:ring-[#34E0A1]" />
                               <span>{rating} étoiles & plus</span>
                           </div>
                       ))}
                   </div>
                 </div>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <main className="flex-1">
             {results.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                 {results.map((business) => (
                   <SearchResultCard 
                      key={business.id} 
                      id={business.id}
                      name={business.name}
                      category={business.category.name}
                      rating={business.rating}
                      reviewCount={business.reviewCount}
                      imageUrl={business.coverUrl || business.imageUrl || undefined}
                      city={business.city}
                      hourlyRate={business.hourlyRate || undefined}
                      currency={business.currency || 'EUR'}
                   />
                 ))}
               </div>
             ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <p className="text-slate-500 text-lg">Aucun expert trouvé pour cette recherche.</p>
                  <Button variant="link" className="text-[#34E0A1] mt-2" asChild>
                      <Link href="/search">Voir tous les freelances</Link>
                  </Button>
                </div>
             )}
          </main>
        </div>
      </div>
    </div>
  )
}

