import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Filter, MapPin, Clock, Star, Globe2, Zap, ChevronDown } from "lucide-react"
import Link from "next/link"
import { SearchResultCard } from "@/components/search/SearchResultCard"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export const dynamic = 'force-dynamic'

// Helper to build URL with current params
function buildFilterUrl(currentParams: Record<string, string>, key: string, value: string) {
  const params = new URLSearchParams(currentParams);
  if (params.get(key) === value) {
    params.delete(key); // Toggle off
  } else {
    params.set(key, value);
  }
  return `/search?${params.toString()}`;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  let businesses = [];
  let dbError = null;

  const resolvedParams = await searchParams;
  const { q, category, loc, minRate, maxRate, exp, rating, lang, available } = resolvedParams;
  
  const searchTerm = (typeof q === 'string' ? q : '').toLowerCase();
  const categoryTerm = (typeof category === 'string' ? category : '').toLowerCase();
  const locationTerm = (typeof loc === 'string' ? loc : '').toLowerCase();
  const minRateNum = typeof minRate === 'string' ? parseInt(minRate) : undefined;
  const maxRateNum = typeof maxRate === 'string' ? parseInt(maxRate) : undefined;
  const expNum = typeof exp === 'string' ? parseInt(exp) : undefined;
  const ratingNum = typeof rating === 'string' ? parseInt(rating) : undefined;
  const langTerm = (typeof lang === 'string' ? lang : '').toLowerCase();
  const availableOnly = available === 'true';
  
  // Current params for building filter URLs
  const currentParams: Record<string, string> = {};
  if (q) currentParams.q = String(q);
  if (category) currentParams.category = String(category);
  if (loc) currentParams.loc = String(loc);
  if (minRate) currentParams.minRate = String(minRate);
  if (maxRate) currentParams.maxRate = String(maxRate);
  if (exp) currentParams.exp = String(exp);
  if (rating) currentParams.rating = String(rating);
  if (lang) currentParams.lang = String(lang);
  if (available) currentParams.available = String(available);
  
  try {
  // Build filters array
  const filters: Prisma.BusinessWhereInput[] = [];
  
  // Text search
  if (searchTerm) {
    filters.push({
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { skills: { hasSome: [searchTerm] } },
      ]
    });
  }
  
  // Location filter
  if (locationTerm) {
    filters.push({
      OR: [
        { city: { contains: locationTerm, mode: 'insensitive' } },
        { address: { contains: locationTerm, mode: 'insensitive' } },
        { country: { contains: locationTerm, mode: 'insensitive' } }
      ]
    });
  }
  
  // Category filter
  if (categoryTerm) {
    filters.push({
      category: {
        OR: [
          { name: { contains: categoryTerm, mode: 'insensitive' } },
          { slug: { contains: categoryTerm, mode: 'insensitive' } }
        ]
      }
    });
  }
  
  // TJM (rate) filter
  if (minRateNum !== undefined || maxRateNum !== undefined) {
    const rateFilter: Prisma.BusinessWhereInput = { hourlyRate: {} };
    if (minRateNum !== undefined) {
      (rateFilter.hourlyRate as any).gte = minRateNum;
    }
    if (maxRateNum !== undefined) {
      (rateFilter.hourlyRate as any).lte = maxRateNum;
    }
    filters.push(rateFilter);
  }
  
  // Experience filter
  if (expNum !== undefined) {
    filters.push({ yearsOfExperience: { gte: expNum } });
  }
  
  // Rating filter
  if (ratingNum !== undefined) {
    filters.push({ rating: { gte: ratingNum } });
  }
  
  // Language filter
  if (langTerm) {
    filters.push({ languages: { hasSome: [langTerm] } });
  }
  
  // Availability filter
  if (availableOnly) {
    filters.push({ available: true });
  }
  
  // Fetch From Prisma
  businesses = await prisma.business.findMany({
    where: filters.length > 0 ? { AND: filters } : {},
    include: {
      category: true
    },
    orderBy: [
      { subscriptionTier: 'desc' }, // PRO first
      { rating: 'desc' }
    ]
  });

  } catch (error) {
    console.error("Search DB Error:", error);
    dbError = error instanceof Error ? error.message : "Database Connection Error";
  }

  let title = 'All Freelancers';
  if (searchTerm && locationTerm) title = `Results for "${searchTerm}" in "${locationTerm}"`;
  else if (searchTerm) title = `Results for "${searchTerm}"`;
  else if (categoryTerm) title = `${categoryTerm} Experts`;
  else if (locationTerm) title = `Experts in ${locationTerm}`;

  // Count active filters
  const activeFilterCount = [categoryTerm, minRateNum !== undefined || maxRateNum !== undefined, expNum, ratingNum, langTerm, availableOnly].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {dbError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
             <p className="font-bold text-red-700">System Error (Database)</p>
             <p className="text-sm text-red-600 font-mono mt-1">{dbError}</p>
        </div>
      )}
      <div className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-black text-slate-900">{title}</h1>
              <p className="text-slate-500 mt-2">Showing {businesses.length} results matching your criteria</p>
              
              {/* Active filters pills */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {categoryTerm && (
                    <Link href={buildFilterUrl(currentParams, 'category', categoryTerm)} className="bg-[#34E0A1]/20 text-[#34E0A1] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 hover:bg-[#34E0A1]/30">
                      {categoryTerm} ✕
                    </Link>
                  )}
                  {(minRateNum !== undefined || maxRateNum !== undefined) && (
                    <Link href={`/search?${new URLSearchParams(Object.fromEntries(Object.entries(currentParams).filter(([k]) => k !== 'minRate' && k !== 'maxRate'))).toString()}`} className="bg-[#34E0A1]/20 text-[#34E0A1] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 hover:bg-[#34E0A1]/30">
                      Rate: ${minRateNum || '0'} - ${maxRateNum || '∞'} ✕
                    </Link>
                  )}
                  {expNum !== undefined && (
                    <Link href={buildFilterUrl(currentParams, 'exp', String(expNum))} className="bg-[#34E0A1]/20 text-[#34E0A1] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 hover:bg-[#34E0A1]/30">
                      {expNum}+ years exp ✕
                    </Link>
                  )}
                  {ratingNum !== undefined && (
                    <Link href={buildFilterUrl(currentParams, 'rating', String(ratingNum))} className="bg-[#34E0A1]/20 text-[#34E0A1] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 hover:bg-[#34E0A1]/30">
                      {ratingNum}+ stars ✕
                    </Link>
                  )}
                  {langTerm && (
                    <Link href={buildFilterUrl(currentParams, 'lang', langTerm)} className="bg-[#34E0A1]/20 text-[#34E0A1] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 hover:bg-[#34E0A1]/30">
                      {langTerm} ✕
                    </Link>
                  )}
                  {availableOnly && (
                    <Link href={buildFilterUrl(currentParams, 'available', 'true')} className="bg-[#34E0A1]/20 text-[#34E0A1] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 hover:bg-[#34E0A1]/30">
                      Available ✕
                    </Link>
                  )}
                  <Link href="/search" className="text-slate-500 text-sm underline hover:text-slate-700">
                    Clear all
                  </Link>
                </div>
              )}
          </div>
      </div>

      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-72 space-y-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center justify-between text-slate-900">
                <span className="flex items-center"><Filter className="mr-2 h-4 w-4" /> Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-[#34E0A1] text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">{activeFilterCount}</span>
                )}
              </h3>
              <div className="space-y-6">
                
                {/* Availability Toggle */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" /> Availability
                  </label>
                  <Link 
                    href={buildFilterUrl(currentParams, 'available', 'true')}
                    className={`block w-full py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${availableOnly ? 'bg-[#34E0A1] text-slate-900 border-[#34E0A1]' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                  >
                    ✓ Available immediately
                  </Link>
                </div>

                {/* Category Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900">Category</label>
                  <div className="space-y-2">
                    {['Tech', 'Design', 'Marketing', 'Business', 'Legal', 'Photo', 'Education', 'Health', 'Beauty', 'Music', 'Food', 'Cleaning', 'Handyman', 'Transport', 'Fitness', 'Writing', 'Childcare', 'Pet Sitting', 'Agriculture', 'Fashion'].map((cat) => (
                      <Link key={cat} href={buildFilterUrl(currentParams, 'category', cat.toLowerCase())} className="flex items-center space-x-2 group cursor-pointer">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${categoryTerm === cat.toLowerCase() ? 'bg-[#34E0A1] border-[#34E0A1]' : 'border-slate-300'}`}>
                           {categoryTerm === cat.toLowerCase() && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className={`text-sm ${categoryTerm === cat.toLowerCase() ? 'font-bold text-[#34E0A1]' : 'text-slate-700 group-hover:text-slate-900'}`}>{cat}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* TJM Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900">Daily Rate</label>
                  <div className="space-y-2">
                    <Link 
                      href={`/search?${new URLSearchParams({ ...currentParams, maxRate: '300' }).toString()}`}
                      className={`block py-2 px-3 text-sm rounded-lg border transition-colors ${maxRateNum === 300 && !minRateNum ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                      Less than $300/day
                    </Link>
                    <Link 
                      href={`/search?${new URLSearchParams({ ...currentParams, minRate: '300', maxRate: '600' }).toString()}`}
                      className={`block py-2 px-3 text-sm rounded-lg border transition-colors ${minRateNum === 300 && maxRateNum === 600 ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                      $300 - $600/day
                    </Link>
                    <Link 
                      href={`/search?${new URLSearchParams({ ...currentParams, minRate: '600' }).toString()}`}
                      className={`block py-2 px-3 text-sm rounded-lg border transition-colors ${minRateNum === 600 && !maxRateNum ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                      More than $600/day
                    </Link>
                  </div>
                </div>

                {/* Experience Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Experience
                  </label>
                  <div className="space-y-2">
                    {[
                      { label: 'Junior (0-2 years)', value: '0' },
                      { label: 'Intermediate (3-5 years)', value: '3' },
                      { label: 'Senior (6-10 years)', value: '6' },
                      { label: 'Expert (10+ years)', value: '10' },
                    ].map((level) => (
                      <Link 
                        key={level.value} 
                        href={buildFilterUrl(currentParams, 'exp', level.value)}
                        className={`block py-2 px-3 text-sm rounded-lg border transition-colors ${expNum === parseInt(level.value) ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 hover:bg-slate-50'}`}
                      >
                        {level.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" /> Reviews & Stars
                  </label>
                  <div className="space-y-2">
                    {[5, 4, 3].map((r) => (
                      <Link 
                        key={r} 
                        href={buildFilterUrl(currentParams, 'rating', String(r))}
                        className={`flex items-center gap-2 py-2 px-3 text-sm rounded-lg border transition-colors ${ratingNum === r ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 hover:bg-slate-50'}`}
                      >
                        <span className="flex">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className={`h-3 w-3 ${star <= r ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                          ))}
                        </span>
                        <span>& up</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Language Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Globe2 className="h-4 w-4" /> Languages
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['French', 'English', 'Spanish', 'Arabic', 'German', 'Chinese'].map((language) => (
                      <Link 
                        key={language} 
                        href={buildFilterUrl(currentParams, 'lang', language.toLowerCase())}
                        className={`py-1 px-3 text-xs font-medium rounded-full border transition-colors ${langTerm === language.toLowerCase() ? 'bg-[#34E0A1] text-slate-900 border-[#34E0A1]' : 'border-slate-200 hover:bg-slate-50'}`}
                      >
                        {language}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Location
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['New York', 'London', 'Paris', 'Berlin', 'Remote'].map((city) => (
                      <Link 
                        key={city} 
                        href={buildFilterUrl(currentParams, 'loc', city.toLowerCase())}
                        className={`py-1 px-3 text-xs font-medium rounded-full border transition-colors ${locationTerm === city.toLowerCase() ? 'bg-[#34E0A1] text-slate-900 border-[#34E0A1]' : 'border-slate-200 hover:bg-slate-50'}`}
                      >
                        {city}
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <main className="flex-1">
             {businesses.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                 {businesses.map((business) => (
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
                      available={business.available}
                      yearsOfExperience={business.yearsOfExperience || undefined}
                   />
                 ))}
               </div>
             ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <p className="text-slate-500 text-lg">No experts found for this search.</p>
                  <p className="text-slate-400 text-sm mt-1">Try modifying your filters or broadening your search.</p>
                  <Button variant="link" className="text-[#34E0A1] mt-2" asChild>
                      <Link href="/search">Clear all filters</Link>
                  </Button>
                </div>
             )}
          </main>
        </div>
      </div>
    </div>
  )
}

