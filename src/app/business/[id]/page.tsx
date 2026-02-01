
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import Image from "next/image"
import { cache } from "react"
import ProfileActions from "@/components/business/ProfileActions"
import { 
  MapPin, 
  CheckCircle2, 
  Star, 
  Clock, 
  ShieldCheck, 
  Languages, 
  Briefcase
} from "lucide-react"

// ISR: Revalidate every 60 seconds for fresh data
export const revalidate = 60

interface PageProps {
  params: Promise<{ id: string }>
}

// Cached fetch function - deduplicated across metadata and page
const getBusiness = cache(async (id: string) => {
  return prisma.business.findUnique({
    where: { id },
    include: {
      category: true,
      services: {
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          duration: true,
        }
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          user: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 3
      },
      media: {
        select: { id: true, url: true, type: true },
        take: 6
      },
      owner: {
        select: { name: true, createdAt: true }
      }
    }
  })
})

// Track view in background (non-blocking)
const trackView = async (id: string) => {
  try {
    await prisma.business.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    })
  } catch {}
}

// Generate Metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const business = await getBusiness(id)

  if (!business) return { title: 'Profil introuvable' }

  return {
    title: `${business.name} - ${business.category.name} | FiveZone`,
    description: business.description?.substring(0, 160) || `Découvrez les services de ${business.name} sur FiveZone.`,
  }
}

export default async function BusinessProfilePage({ params }: PageProps) {
  const { id } = await params
  
  // Non-blocking view tracking
  trackView(id)

  const business = await getBusiness(id);

  if (!business) {
    notFound();
  }

  // Determine availability status display
  const isAvailable = business.available;
  const memberSince = new Date(business.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      
      {/* -----------------------------------------------------
          SECTION 1: HERO (MOBILE FIRST)
         ----------------------------------------------------- */}
      <div className="relative">
          {/* Cover Image (Background) */}
          <div className="h-48 md:h-64 w-full bg-slate-100 overflow-hidden relative">
              {business.coverUrl ? (
                  <Image 
                    src={business.coverUrl} 
                    alt="Cover" 
                    fill
                    sizes="100vw"
                    priority
                    className="object-cover opacity-90"
                  />
              ) : (
                  <div className="w-full h-full bg-gradient-to-r from-slate-200 to-slate-100" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="container mx-auto px-4 -mt-16 relative z-10">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
                  
                  {/* Avatar / Logo */}
                  <div className="h-32 w-32 rounded-2xl border-4 border-white shadow-xl bg-white overflow-hidden flex-shrink-0 relative">
                      {business.imageUrl ? (
                          <Image 
                            src={business.imageUrl} 
                            alt={business.name}
                            fill
                            sizes="128px"
                            className="object-cover"
                          />
                      ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-300">
                             {business.name.charAt(0)}
                          </div>
                      )}
                  </div>

                  {/* Identity Block */}
                  <div className="text-center md:text-left flex-1 pb-2">
                       {/* Availability Badge */}
                       <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-bold mb-2 shadow-sm">
                           <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                           {isAvailable ? "Disponible pour missions" : "Indisponible"}
                       </div>

                       <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight mb-1">
                           {business.name}
                       </h1>
                       
                       <p className="text-slate-600 font-medium text-lg mb-2">
                           {business.category.name}
                       </p>

                       <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 text-sm">
                           <MapPin className="h-4 w-4 text-slate-400" />
                           <span>{business.city}, {business.country}</span>
                           <span className="text-slate-300">•</span>
                           <span>Membre depuis {memberSince}</span>
                       </div>
                  </div>

                  {/* CTA Desktop (Hidden on Mobile, shown in sticky bottom bar on mobile) */}
                  <div className="hidden md:block pb-4">
                      <ProfileActions business={business} />
                  </div>
              </div>
          </div>
      </div>

      {/* -----------------------------------------------------
          SECTION 2: PROOF & TRUST
         ----------------------------------------------------- */}
      <div className="container mx-auto px-4 mt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                  <div className="flex justify-center mb-2">
                      <div className="flex gap-0.5">
                          {[1,2,3,4,5].map((s) => (
                              <Star key={s} className={`h-4 w-4 ${s <= Math.round(business.rating) ? "text-yellow-400 fill-yellow-400" : "text-slate-300"}`} />
                          ))}
                      </div>
                  </div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                      {business.reviewCount > 0 ? `${business.reviewCount} Avis` : "Nouveau"}
                  </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center flex flex-col items-center justify-center">
                   <ShieldCheck className="h-5 w-5 text-green-600 mb-2" />
                   <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Identité Vérifiée</p>
              </div>

              {business.hourlyRate && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center flex flex-col items-center justify-center col-span-2 md:col-span-1">
                      <p className="text-lg font-black text-slate-900">
                        {business.hourlyRate.toLocaleString()} {business.currency}
                      </p>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Par jour</p>
                  </div>
              )}
          </div>
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* LEFT COLUMN (MAIN CONTENT) */}
          <div className="md:col-span-2 space-y-10">

              {/* -----------------------------------------------------
                  SECTION 3: ABOUT
                 ----------------------------------------------------- */}
              <section>
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-slate-400" />
                      À propos
                  </h2>
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-[15px]">
                      {business.description ? (
                          business.description.split('\n').map((para, i) => (
                              <p key={i} className="mb-2">{para}</p>
                          ))
                      ) : (
                          <p className="italic text-slate-400">Ce prestataire n&apos;a pas encore ajouté de description.</p>
                      )}
                  </div>
              </section>

              {/* -----------------------------------------------------
                  SECTION 4: SKILLS & SERVICES
                 ----------------------------------------------------- */}
              <section>
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                       <CheckCircle2 className="h-5 w-5 text-slate-400" />
                       Compétences & Services
                  </h2>
                  
                  {business.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                          {business.skills.map((skill: string, i: number) => (
                              <div key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200">
                                  {skill}
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="bg-slate-50 rounded-lg p-6 text-center text-slate-500 text-sm border border-dashed border-slate-200">
                          Aucune compétence listée spécifiquement.
                      </div>
                  )}

                  {/* Structured Services List if any */}
                  {business.services.length > 0 && (
                      <div className="mt-6 space-y-3">
                          {business.services.map((service) => (
                              <div key={service.id} className="flex justify-between items-center p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                                  <div>
                                      <h4 className="font-bold text-slate-900">{service.name}</h4>
                                      {service.description && <p className="text-sm text-slate-500 mt-0.5">{service.description}</p>}
                                  </div>
                                  <div className="text-right">
                                      <span className="block font-bold text-slate-900">{service.price} {business.currency}</span>
                                      {service.duration && <span className="text-xs text-slate-400">{service.duration} min</span>}
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </section>

              {/* -----------------------------------------------------
                  SECTION 6: GALLERY (CLEAN GRID)
                 ----------------------------------------------------- */}
              {business.media.length > 0 && (
                  <section>
                      <h2 className="text-lg font-bold text-slate-900 mb-4">Portfolio</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {business.media.slice(0, 6).map((item, i) => (
                              <div key={item.id} className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative group">
                                  {item.type === 'IMAGE' ? (
                                      <Image 
                                        src={item.url} 
                                        alt={`Portfolio ${i + 1}`}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                      />
                                  ) : (
                                       <video src={item.url} className="w-full h-full object-cover" controls playsInline muted />
                                  )}
                              </div>
                          ))}
                      </div>
                  </section>
              )}

          </div>

          {/* RIGHT COLUMN (DETAILS & SIDEBAR) */}
          <div className="space-y-6">

              {/* -----------------------------------------------------
                  SECTION 7: PRACTICAL INFO
                 ----------------------------------------------------- */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-5 sticky top-24">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Informations</h3>
                  
                  <div className="space-y-4 text-sm">
                      <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                              <p className="font-bold text-slate-700">Zone d&apos;intervention</p>
                              <p className="text-slate-500">{business.city} et alentours</p>
                          </div>
                      </div>

                      <div className="flex items-start gap-3">
                          <Languages className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                              <p className="font-bold text-slate-700">Langues parlées</p>
                              <p className="text-slate-500">
                                  {business.languages.length > 0 ? business.languages.join(", ") : "Français"}
                              </p>
                          </div>
                      </div>

                      <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                              <p className="font-bold text-slate-700">Temps de réponse</p>
                              <p className="text-slate-500">Moins de 24h (habituellement)</p>
                          </div>
                      </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                      <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-500 text-center">
                          Membre vérifié par FiveZone
                      </div>
                  </div>
              </div>

          </div>
      </div>

      {/* MOBILE STICKY CTA BAR */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 md:hidden z-50">
          <ProfileActions business={business} isMobile={true} />
      </div>

    </div>
  )
}
