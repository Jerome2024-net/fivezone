import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Globe, Clock, Star, Share2, Heart, MessageSquare, Menu, Check, User, BadgeCheck, Tag, ExternalLink } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function BusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const business = await prisma.business.findUnique({
    where: { id },
    include: { category: true }
  });
  
  if (!business) {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 items-center justify-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Établissement non trouvé</h1>
            <Link href="/">
                <Button>Retour à l'accueil</Button>
            </Link>
        </div>
    )
  }
  
  const isPro = business.subscriptionTier === 'PRO' || business.subscriptionTier === 'ENTERPRISE';
  const recommended = isPro;
  
  const businessName = business.name;
  const businessCategory = business.category.name.toLowerCase(); // slug might be better if I fetch it, currently I fetch category relation which has slug.
  
  const categoryType = business.category.slug || 'restaurant'; 

  const getCTA = (type: string) => {
    switch(type) {
        case 'restaurant': return "Réserver une table";
        case 'hotel': return "Réserver une chambre";
        case 'service': return "Prendre Rendez-vous";
        case 'shop': return "Commander en ligne";
        default: return "Contacter";
    }
  }

  const primaryCTA = getCTA(categoryType);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Title Header Section */}
      <div className="container mx-auto px-4 md:px-6 pt-6 pb-6">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
             <div>
                 <div className="flex items-center gap-3">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">{businessName}</h1>
                    {recommended && (
                      <span className="bg-[#34E0A1] text-slate-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <BadgeCheck className="h-4 w-4" /> Recommandé
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
                     <span className="text-slate-900 underline cursor-pointer">$$$$, {business.category.name}, {business.city}</span>
                     <span>•</span>
                     <span className="text-slate-900 underline cursor-pointer">Ouvert</span>
                 </div>
                 <div className="flex items-center gap-1 mt-2 text-slate-500 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{business.address}, {business.city}</span>
                 </div>
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

      {/* Photo Mosaic Gallery */}
      <div className="container mx-auto px-4 md:px-6 mb-8">
           <div className="grid grid-cols-4 grid-rows-2 h-[400px] gap-2 rounded-2xl overflow-hidden">
                <div className="col-span-2 row-span-2 bg-slate-200 relative group cursor-pointer">
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium z-10">Photo Principale</div>
                </div>
                <div className="bg-slate-200 relative group cursor-pointer">
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="bg-slate-200 relative group cursor-pointer">
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="bg-slate-200 relative group cursor-pointer">
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="bg-slate-200 relative group cursor-pointer flex items-center justify-center">
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                     <span className="text-sm font-bold underline z-10 relative bg-white/80 px-3 py-1 rounded-full">+ 45 photos</span>
                </div>
           </div>
      </div>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 md:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Details, Menu, Reviews */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* About / Description */}
            <section className="space-y-4 pb-8 border-b border-slate-200">
               <h2 className="text-2xl font-bold text-slate-900">À propos</h2>
               <p className="text-lg text-slate-700 leading-relaxed">
                   {business?.description || "Découvrez la meilleure expérience locale. Nous proposons un service de qualité et des produits exceptionnels. Notre équipe dévouée s'assure que chaque visite soit mémorable."}
               </p>
               <div className="flex flex-wrap gap-4 pt-4">
                  {[ 'Accès handicapés', 'Wifi gratuit', 'Bar complet', 'Service à table' ].map(feat => (
                      <div key={feat} className="flex items-center gap-2 text-slate-700 font-medium">
                          <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                              <Check className="h-4 w-4 text-green-600" />
                          </div>
                          {feat}
                      </div>
                  ))}
               </div>
            </section>
            
            {/* Reviews Section */}
            <section className="space-y-8">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">Avis (1 245)</h2>
                  <Button className="rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800">Écrire un avis</Button>
               </div>
               
               {/* Rating Summary Breakdown */}
               <div className="flex flex-col md:flex-row gap-8 bg-slate-50 p-6 rounded-xl">
                   <div className="flex-1 space-y-2">
                       {/* Rating Bars would go here (simplified for space) */}
                      <div className="flex items-center text-sm font-bold text-slate-700">
                          <span className="w-24">Excellent</span>
                          <div className="flex-1 h-3 mx-3 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-[#34E0A1] w-[80%]" />
                          </div>
                          <span>850</span>
                      </div>
                      <div className="flex items-center text-sm font-bold text-slate-700">
                          <span className="w-24">Très bon</span>
                          <div className="flex-1 h-3 mx-3 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-[#34E0A1] w-[15%]" />
                          </div>
                          <span>210</span>
                      </div>
                      <div className="flex items-center text-sm font-bold text-slate-700">
                          <span className="w-24">Moyen</span>
                          <div className="flex-1 h-3 mx-3 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-[#34E0A1] w-[3%]" />
                          </div>
                          <span>45</span>
                      </div>
                      <div className="flex items-center text-sm font-bold text-slate-700">
                          <span className="w-24">Médiocre</span>
                          <div className="flex-1 h-3 mx-3 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-[#34E0A1] w-[1%]" />
                          </div>
                          <span>10</span>
                      </div>
                      <div className="flex items-center text-sm font-bold text-slate-700">
                          <span className="w-24">Horrible</span>
                          <div className="flex-1 h-3 mx-3 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-[#34E0A1] w-[1%]" />
                          </div>
                          <span>5</span>
                      </div>
                   </div>
               </div>

               {/* Individual Reviews */}
               <div className="space-y-6">
                   {[1, 2, 3].map((rev) => (
                       <div key={rev} className="border-b border-slate-200 pb-6">
                           <div className="flex items-center gap-3 mb-3">
                               <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center">
                                   <User className="h-6 w-6 text-slate-500" />
                               </div>
                               <div>
                                   <p className="font-bold text-sm">Jean D.</p>
                                   <p className="text-xs text-slate-500">Paris, France • 25 contributions</p>
                               </div>
                           </div>
                           <div className="flex items-center gap-2 mb-2">
                               <div className="flex gap-0.5">
                                    {[1,2,3,4,5].map(star => (
                                        <div key={star} className={`w-3 h-3 rounded-full ${star <= (rev === 2 ? 4 : 5) ? 'bg-[#34E0A1]' : 'border border-[#34E0A1] bg-transparent'}`} />
                                    ))}
                               </div>
                               <span className="text-sm text-slate-500">Avis publié hier</span>
                           </div>
                           <h3 className="font-bold text-lg mb-2">Expérience de dîner exceptionnelle !</h3>
                           <p className="text-slate-700 leading-relaxed">
                               Le service était impeccable et la nourriture divine. Nous avons commandé le menu dégustation et chaque plat était un délice. Ambiance très raffinée mais accueillante. Nous reviendrons certainement !
                           </p>
                           <div className="flex gap-4 mt-4">
                               <Button variant="ghost" size="sm" className="text-slate-500 text-xs px-0 hover:bg-transparent hover:underline">
                                   Utile
                               </Button>
                               <Button variant="ghost" size="sm" className="text-slate-500 text-xs px-0 hover:bg-transparent hover:underline">
                                   Partager
                               </Button>
                           </div>
                       </div>
                   ))}
               </div>

            </section>
          </div>
          
          {/* Right Column: Sticky Sidebar (Map, Info) */}
          <div className="lg:col-span-1">
             <div className="sticky top-24 bg-white border border-slate-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 space-y-6">
                 
                 {/* Primary CTA based on Category */}
                 <Button className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-full shadow-lg">
                    {primaryCTA}
                 </Button>

                 {/* PRO Feature: WhatsApp / Call Button */}
                 {isPro && (
                    <div className="space-y-3">
                        {business?.whatsapp && (
                             <Button className="w-full h-12 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-lg rounded-full shadow-md transition-all hover:scale-[1.02]" asChild>
                                <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer">
                                    <MessageSquare className="mr-2 h-5 w-5" />
                                    Discuter sur WhatsApp
                                </a>
                             </Button>
                        )}
                        {!business?.whatsapp && (
                             <Button className="w-full h-12 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-lg rounded-full shadow-md transition-all hover:scale-[1.02]">
                                <MessageSquare className="mr-2 h-5 w-5" />
                                Discuter sur WhatsApp
                            </Button>
                        )}

                        {business?.phone && (
                            <Button variant="outline" className="w-full h-12 border-slate-900 text-slate-900 hover:bg-slate-50 font-bold text-lg rounded-full" asChild>
                                <a href={`tel:${business.phone}`}>
                                    <Phone className="mr-2 h-5 w-5" />
                                    Appeler l'établissement
                                </a>
                            </Button>
                        )}
                        {!business?.phone && (
                             <Button variant="outline" className="w-full h-12 border-slate-900 text-slate-900 hover:bg-slate-50 font-bold text-lg rounded-full">
                                <Phone className="mr-2 h-5 w-5" />
                                Appeler l'établissement
                            </Button>
                        )}
                    </div>
                 )}

                 {/* PRO Feature: Active Promotion */}
                 {isPro && (
                     <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                             <Tag className="h-5 w-5 text-red-600" />
                             <span className="font-black text-red-600 uppercase tracking-wide text-xs">Offre Spéciale</span>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-1">Dessert offert !</h4>
                        <p className="text-sm text-slate-700">Pour tout menu complet acheté ce midi. Valable jusqu'au 31/01.</p>
                     </div>
                 )}

                 {/* Map Placeholder */}
                 <div className="h-48 w-full bg-slate-100 rounded-lg relative overflow-hidden group cursor-pointer">
                      <MapPin className="absolute top-1/2 left-1/2 -ml-3 -mt-3 h-6 w-6 text-red-500" />
                      <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">Voir la carte</div>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <MapPin className="h-5 w-5 text-slate-900 mt-1 shrink-0" />
                        <div>
                            <p className="font-bold text-slate-900">{business?.address || '23 Rue de Rivoli'}</p>
                            <p className="text-slate-600">{business?.city || '75001 Paris, France'}</p>
                            <p className="text-slate-600 text-sm mt-1">Secteur Localisation</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                        <Clock className="h-5 w-5 text-slate-900 mt-1 shrink-0" />
                        <div>
                            <p className="font-bold text-red-600">Ouvert</p>
                            <p className="text-slate-600 text-sm">12:00 - 23:00</p>
                            <p className="text-blue-600 text-sm font-bold cursor-pointer mt-1 hover:underline">Voir tous les horaires</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                         <Globe className="h-5 w-5 text-slate-900 mt-1 shrink-0" />
                         <p className="font-bold text-slate-900 hover:underline cursor-pointer">{business?.website || 'site-web-indisponible.com'}</p>
                    </div>

                    <div className="flex items-start gap-4">
                         <Phone className="h-5 w-5 text-slate-900 mt-1 shrink-0" />
                         <p className="font-bold text-slate-900 hover:underline cursor-pointer">{business?.phone || '+33 1 23 45 67 89'}</p>
                    </div>
                 </div>
                 
                 <div className="pt-4 border-t border-slate-100">
                    <Button className="w-full rounded-full bg-[#F2C94C] hover:bg-[#e0b73b] text-slate-900 font-bold text-lg h-12">
                        Réserver une table
                    </Button>
                 </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}
