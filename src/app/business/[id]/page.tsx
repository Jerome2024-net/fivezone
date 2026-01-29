import { Button } from "@/components/ui/button"
import MapLoader from "@/components/ui/MapLoader"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Globe, Clock, Star, Share2, Heart, MessageSquare, Menu, Check, User, BadgeCheck, Tag, ExternalLink, Euro, Calendar, Zap, Globe2, Send } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { MissionButton } from "@/components/missions/MissionButton"
import { Suspense } from "react"

export const dynamic = 'force-dynamic'

export default async function BusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const business = await prisma.business.findUnique({
      where: { id },
      include: {
          category: true,
          owner: true,
          services: true,
          media: true
      }
  });
  
  if (!business) {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 items-center justify-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Profil non trouvé</h1>
            <Link href="/">
                <Button>Retour à l'accueil</Button>
            </Link>
        </div>
    )
  }
  
  const isPro = business.subscriptionTier === 'PRO' || business.subscriptionTier === 'ENTERPRISE';
  const recommended = isPro;
  
  const businessName = business.name;
  const categoryType = business.category.name;

  const getCTA = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes('restaurant')) return "Réserver une table";
    if (lower.includes('hotel')) return "Réserver une chambre";
    if (lower.includes('service')) return "Prendre Rendez-vous";
    if (lower.includes('shop') || lower.includes('boutique')) return "Commander en ligne";
    return "Contacter";
  }

  const primaryCTA = getCTA(categoryType);
  const currencySymbol = business.currency === 'USD' ? '$' : business.currency === 'GBP' ? '£' : business.currency === 'XOF' ? 'FCFA' : '€';

  // Collect all available images
  const allImages = [
    business.coverUrl,
    business.imageUrl,
    ...(business.media || []).map((m: any) => m.url)
  ].filter(Boolean) as string[];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Title Header Section */}
      <div className="container mx-auto px-4 md:px-6 pt-6 pb-6">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
             <div>
                 <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">{businessName}</h1>
                    {business.verificationStatus === 'VERIFIED' ? (
                        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-blue-200" title="Identité et Légalité Vérifiée">
                             <BadgeCheck className="h-4 w-4" />
                             Profil Vérifié
                        </span>
                    ) : (
                        <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1" title="En attente de validation">
                             En attente de validation
                        </span>
                    )}
                    {recommended && (
                      <span className="bg-[#34E0A1] text-slate-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <BadgeCheck className="h-4 w-4" /> Recommandé
                      </span>
                    )}
                    {business.available && (
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Zap className="h-4 w-4" /> Disponible
                      </span>
                    )}
                 </div>
                 <div className="flex items-center gap-2 mt-3 text-slate-600 font-medium">
                     <span className="flex items-center gap-1">
                        {[1,2,3,4,5].map(star => (
                           <div key={star} className={`w-3.5 h-3.5 rounded-full ${star <= (business.rating || 0) ? 'bg-[#34E0A1]' : 'border border-[#34E0A1] bg-transparent'}`} />
                        ))}
                     </span>
                     <span className="text-slate-900 underline font-bold cursor-pointer">{business.reviewCount} avis</span>
                     <span>•</span>
                     <span className="text-slate-900 underline cursor-pointer">{categoryType}, {business.city}</span>
                     <span>•</span>
                     <span className="text-slate-900 underline cursor-pointer">Disponible</span>
                 </div>
                 
                 {business.hourlyRate && (
                     <div className="mt-4 inline-block">
                        <div className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-md flex items-center gap-2">
                            <span>{business.hourlyRate} {currencySymbol}</span>
                            <span className="text-slate-400 text-sm font-medium">/ jour (TJM)</span>
                        </div>
                     </div>
                 )}

                   {business.linkedinUrl && (
                       <div className="mt-4">
                       <a href={business.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-slate-600 hover:text-[#0077b5] font-bold text-sm bg-slate-50 px-3 py-1 rounded-full border border-slate-200 transition-colors">
                           <Globe className="h-3 w-3" />
                           LinkedIn / Portfolio
                       </a>
                       </div>
                   )}
                 <div className="flex items-center gap-1 mt-4 text-slate-500 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{business.address}, {business.city}</span>
                 </div>
                 {business.siret && <p className="text-xs text-slate-400 mt-1 font-mono">SIRET: {business.siret}</p>}
             </div>
             
             <div className="flex gap-2">
                 <Button variant="outline" className="rounded-full font-bold border-slate-300 hover:bg-slate-100 hover:text-slate-900">
                     <Share2 className="h-4 w-4 mr-2" /> Partager
                 </Button>
                 <Button variant="outline" className="rounded-full font-bold border-slate-300 hover:bg-slate-100 hover:text-slate-900">
                     <Heart className="h-4 w-4 mr-2" /> Enregistrer
                 </Button>
             </div>
         </div>
      </div>

      {/* Photo Mosaic Gallery - Only show if images exist */}
      {allImages.length > 0 && (
          <div className="container mx-auto px-4 md:px-6 mb-8">
               {allImages.length === 1 ? (
                   <div className="h-[400px] rounded-2xl overflow-hidden relative group cursor-pointer bg-slate-200">
                        <img src={allImages[0]} className="w-full h-full object-cover" alt="Main view" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                   </div>
               ) : (
               <div className="grid grid-cols-4 grid-rows-2 h-[400px] gap-2 rounded-2xl overflow-hidden">
                    {/* Main Large Image */}
                    <div className="col-span-2 row-span-2 bg-slate-200 relative group cursor-pointer">
                        {allImages[0] && (
                            <img src={allImages[0]} className="w-full h-full object-cover" alt="Main view" />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>

                    {/* Secondary Images */}
                    {[1, 2, 3, 4].map((idx) => (
                        <div key={idx} className="bg-slate-200 relative group cursor-pointer overflow-hidden">
                             {allImages[idx] ? (
                                <img src={allImages[idx]} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                             ) : (
                                <div className="absolute inset-0 bg-slate-100" />
                             )}
                             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                             
                             {/* Show "+X photos" on the last cell if there are more */}
                             {idx === 4 && allImages.length > 5 && (
                                 <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold text-lg backdrop-blur-[2px]">
                                     +{allImages.length - 5} photos
                                 </div>
                             )}
                        </div>
                    ))}
               </div>
               )}
          </div>
      )}

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 md:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Details, Menu, Reviews */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Skills / Expertise */}
            {(business.skills.length > 0 || business.yearsOfExperience) && (
                <section className="space-y-4 pb-8 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-900">Compétences & Expertises</h2>
                        {business.yearsOfExperience && (
                            <span className="bg-slate-900 text-white text-sm font-bold px-3 py-1 rounded-full">
                                {business.yearsOfExperience} an{business.yearsOfExperience > 1 ? 's' : ''} d'expérience
                            </span>
                        )}
                    </div>
                    {business.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {business.skills.map((skill: string) => (
                                <div key={skill} className="bg-slate-100 text-slate-800 px-4 py-2 rounded-full font-medium text-sm border border-slate-200">
                                    {skill}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Languages */}
            {business.languages && business.languages.length > 0 && (
                <section className="space-y-4 pb-8 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Globe2 className="h-6 w-6" /> Langues parlées
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {business.languages.map((lang: string) => (
                            <div key={lang} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium text-sm border border-blue-200">
                                {lang}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* About / Description */}
            <section className="space-y-4 pb-8 border-b border-slate-200">
               <h2 className="text-2xl font-bold text-slate-900">À propos</h2>
               <p className="text-lg text-slate-700 leading-relaxed">
                   {business?.description || "Aucune description détaillée disponible pour ce profil."}
               </p>
               <div className="flex flex-wrap gap-4 pt-4">
                  {(business.features || []).map((feat: string) => (
                      <div key={feat} className="flex items-center gap-2 text-slate-700 font-medium">
                          <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                              <Check className="h-4 w-4 text-green-600" />
                          </div>
                          {feat}
                      </div>
                  ))}
               </div>
            </section>
            
            {/* Services / Menu / Rooms Section - HIDDEN FOR MVP
            {business.services.length > 0 && (
                <section className="space-y-6 pb-8 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        {business.category.slug === 'hotel' ? 'Chambres & Hébergements' : 
                         business.category.slug === 'restaurant' ? 'Menu & Table' : 'Nos Prestations'}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {business.services.map(service => (
                            <div key={service.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-slate-900">{service.name}</h3>
                                        <div className="font-black text-slate-900 bg-slate-100 px-2 py-1 rounded text-sm">
                                            {service.price}€
                                        </div>
                                    </div>
                                    {service.description && <p className="text-slate-600 text-sm mb-4 leading-relaxed">{service.description}</p>}
                                    <div className="flex gap-3 text-xs font-bold text-slate-500 mb-4">
                                        {service.duration && <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {service.duration} min</span>}
                                        <span className="uppercase bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{service.type}</span>
                                    </div>
                                </div>
                                
                                <Button className="w-full bg-[#34E0A1] hover:bg-[#2bc98e] text-slate-900 font-bold">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {service.type === 'RESERVATION' ? 'Réserver' : 
                                     service.type === 'ROOM' ? 'Voir dispo' : 
                                     service.type === 'TICKET' ? 'Acheter' : 'Choisir'}
                                </Button>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            */}

            {/* Reviews Section */}
            <section className="space-y-8">
               <div className="flex items-center justify-between">
                  {/* <h2 className="text-2xl font-bold text-slate-900">Avis ({business.reviewCount || 0})</h2> */}
                  {/* <Button className="rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800">Écrire un avis</Button> */}
               </div>
               
               {/* Reviews hidden as requested for MVP */}
               {/* 
               <div className="flex flex-col md:flex-row gap-8 bg-slate-50 p-6 rounded-xl">
                   <div className="flex-1 space-y-2">
                       <div className="text-center text-slate-500 py-4">
                            Aucun avis pour le moment
                       </div>
                   </div>
               </div>
               */}
            </section>
          </div>
          
          <div className="lg:col-span-1">
             <div className="sticky top-24 bg-white border border-slate-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 space-y-4">
                 
                 {/* Mission Request Button - Primary CTA */}
                 {business.ownerId && (
                    <Suspense fallback={<Button disabled className="w-full h-14 rounded-full">Chargement...</Button>}>
                        <MissionButton
                            businessId={business.id}
                            freelanceId={business.ownerId}
                            freelanceName={business.name}
                            hourlyRate={business.hourlyRate}
                            currency={business.currency}
                        />
                    </Suspense>
                 )}

                 {/* Contact Button */}
                 <Button className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full" asChild>
                    <a href={`tel:${business.phone}`} className="flex items-center justify-center gap-2">
                        <Phone className="h-5 w-5" />
                        Appeler directement
                    </a>
                 </Button>

                 {/* Map Integration (Mapbox) */}
                 <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm h-[250px] relative z-0">
                    <MapLoader address={business.address} city={business.city} />
                 </div>

                 {/* Directions Button */}
                 <Button className="w-full bg-white border border-slate-200 text-slate-900 font-bold hover:bg-slate-50" asChild>
                    <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.address + ", " + business.city)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <MapPin className="mr-2 h-4 w-4" />
                        Itinéraire
                    </a>
                 </Button>
                 
                 <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-start gap-4">
                        <MapPin className="h-5 w-5 text-slate-900 mt-1 shrink-0" />
                        <div>
                            <p className="font-bold text-slate-900">{business?.address}</p>
                            <p className="text-slate-600">{business?.city}, {business?.country || business?.country || "France"}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                        <Clock className="h-5 w-5 text-slate-900 mt-1 shrink-0" />
                        <div>
                            <p className="font-bold text-slate-900">Horaires</p>
                            <p className="text-slate-600 text-sm">Sur rendez-vous ou contactez le professionnel</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                         <Globe className="h-5 w-5 text-slate-900 mt-1 shrink-0" />
                          {business?.website ? (
                             <a href={business.website} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-900 hover:underline cursor-pointer">
                                {business.website.replace(/^https?:\/\//, '')}
                             </a>
                          ) : (
                             <p className="text-slate-500 italic">Site web non renseigné</p>
                          )}
                    </div>

                    <div className="flex items-start gap-4">
                         <Phone className="h-5 w-5 text-slate-900 mt-1 shrink-0" />
                         <p className="font-bold text-slate-900 hover:underline cursor-pointer">{business?.phone || '+33 1 23 45 67 89'}</p>
                    </div>
                 </div>
             </div>
          </div>

        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 pb-safe z-40 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-area-bottom">
           <div className="flex gap-3 px-1">
               <Button className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold h-12 w-14 rounded-2xl shrink-0" asChild>
                   <a href={`tel:${business.phone || ''}`}><Phone className="h-5 w-5" /></a>
               </Button>
               <div className="flex-1">
                    {business.ownerId && (
                        <Suspense fallback={<div className="h-12 w-full bg-slate-100 rounded-2xl animate-pulse" />}>
                            <MissionButton
                                businessId={business.id}
                                freelanceId={business.ownerId}
                                freelanceName={business.name}
                                hourlyRate={business.hourlyRate}
                                currency={business.currency}
                                className="h-12 rounded-2xl text-base shadow-none w-full"
                            >
                                <Send className="h-5 w-5 mr-2" />
                                Demander un devis
                            </MissionButton>
                        </Suspense>
                    )}
               </div>
           </div>
      </div>
    </div>
  )
}
