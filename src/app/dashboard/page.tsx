import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Users, Star, MessageSquare, Settings, LogOut, ArrowUpRight, MessageCircle, MousePointerClick, Phone, Tag, Check, Lock } from "lucide-react"
import Link from "next/link"
import { MediaUpload } from "@/components/dashboard/MediaUpload"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
      redirect("/login")
  }
  
  const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { businesses: { include: { promotions: true } } }
  })
  
  const business = user?.businesses[0];
  
  if (!business) {
     // If user has account but no business, redirect to registration
     redirect("/register") 
  }

  const isPro = business.subscriptionTier === 'PRO' || business.subscriptionTier === 'ENTERPRISE'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
       {/* Dashboard Header */}
       <header className="bg-slate-900 text-white py-4 px-6 shadow-md">
           <div className="container mx-auto flex justify-between items-center">
               <div className="flex items-center gap-2">
                   <div className="h-8 w-8 rounded bg-[#34E0A1] flex items-center justify-center">
                        <BarChart className="h-5 w-5 text-slate-900" />
                   </div>
                   <span className="font-bold text-xl">Espace Propriétaire</span>
                   {isPro ? (
                       <span className="bg-[#34E0A1] text-slate-900 text-xs px-2 py-0.5 rounded font-bold ml-2">PRO</span>
                   ) : (
                       <Link href="/pricing" className="ml-2">
                           <span className="bg-slate-700 hover:bg-[#34E0A1] hover:text-slate-900 transition-colors text-white text-xs px-2 py-1 rounded font-bold border border-slate-600">
                               PASSER PRO
                           </span>
                       </Link>
                   )}
               </div>
               <div className="flex items-center gap-4">
                   <span className="text-sm font-medium hidden md:inline">{business.name}</span>
                   {!isPro && (
                       <Button size="sm" className="hidden md:flex bg-[#34E0A1] hover:bg-[#2cbe89] text-slate-900 font-bold" asChild>
                           <Link href="/pricing">PASSER PRO</Link>
                       </Button>
                   )}
                   <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800" asChild>
                        <Link href="/api/auth/signout">
                            <LogOut className="h-4 w-4 md:mr-2" /> 
                            <span className="hidden md:inline">Se déconnecter</span>
                        </Link>
                   </Button>
               </div>
           </div>
       </header>

       <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
            {!isPro && (
                <div className="bg-slate-900 text-white p-6 rounded-xl mb-8 flex flex-col md:flex-row items-center justify-between shadow-lg gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-[#34E0A1] rounded-full flex items-center justify-center text-slate-900 font-bold shrink-0">
                            <Star className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-xl text-white">Boostez votre visibilité</h3>
                            <p className="text-slate-300">Débloquez les vues illimitées, WhatsApp et les promotions exclusives.</p>
                        </div>
                    </div>
                    <Button className="bg-[#34E0A1] hover:bg-[#2cbe89] text-slate-900 font-bold px-8 h-12 w-full md:w-auto" asChild>
                        <Link href="/pricing">PASSER PRO</Link>
                    </Button>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Tableau de bord</h1>
                    <p className="text-slate-500">Aperçu des performances de votre fiche</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="bg-white">
                        <Settings className="h-4 w-4 mr-2" /> Paramètres
                    </Button>
                    <Button className="bg-[#34E0A1] hover:bg-[#2cbe89] text-slate-900 font-bold">
                        Gérer la fiche
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Vues totales</p>
                                <p className="text-3xl font-black text-slate-900">{business.viewCount}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                         <div className="mt-4 flex items-center text-sm text-green-600 font-bold">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            <span>+12%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Clics Site Web</p>
                                <p className="text-3xl font-black text-slate-900">{business.clickCount}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center">
                                <MousePointerClick className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                         <div className="mt-4 flex items-center text-sm text-green-600 font-bold">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            <span>+5%</span>
                        </div>
                    </CardContent>
                </Card>

                 <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Leads (Appels/Msg)</p>
                                <p className="text-3xl font-black text-slate-900">{business.contactCount}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                                <Phone className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                         <div className="mt-4 flex items-center text-sm text-green-600 font-bold">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            <span>+18%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Note moyenne</p>
                                <p className="text-3xl font-black text-slate-900">{business.rating.toFixed(1)}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-[#34E0A1]/20 flex items-center justify-center">
                                <Star className="h-6 w-6 text-[#2cbe89]" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-slate-500">
                             {business.reviewCount} avis
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Feature Management & Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Media Gallery Management */}
                    <MediaUpload />
                    
                    {/* Promotions Management - LOCKED if not PRO */}
                    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden ${!isPro ? 'opacity-90' : ''}`}>
                        {!isPro && (
                           <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6">
                                <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                     <Lock className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-2">Fonctionnalité PRO</h3>
                                <p className="text-slate-600 mb-4 max-w-sm">Publiez des offres spéciales pour attirer plus de clients lors des périodes creuses.</p>
                                <Button className="bg-[#34E0A1] hover:bg-[#2cbe89] text-slate-900 font-bold" asChild>
                                    <Link href="/pricing">Débloquer les Promotions</Link>
                                </Button>
                           </div>
                        )}

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Tag className="h-5 w-5 text-slate-900" /> Mes Promotions
                            </h2>
                            <Button size="sm" className="bg-slate-900 text-white font-bold" disabled={!isPro}>Créer une offre</Button>
                        </div>
                        
                        <div className="space-y-4">
                            {business.promotions.length > 0 ? (
                                business.promotions.map((promo: any) => (
                                    <div key={promo.id} className="p-4 border border-green-200 bg-green-50 rounded-lg flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-slate-900">{promo.title}</h4>
                                            <p className="text-sm text-slate-600">{promo.description}</p>
                                        </div>
                                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">Arrêter</Button>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 border border-dashed border-slate-300 rounded-lg bg-slate-50 text-center">
                                    <p className="text-slate-500 text-sm mb-2">Vous n'avez aucune promotion active.</p>
                                    <p className="text-xs text-slate-400">Les promotions apparaissent en évidence sur votre profil.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900">Avis récents à répondre</h2>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="p-6 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-0.5">
                                            {[1,2,3,4,5].map(star => (
                                                <div key={star} className={`w-3 h-3 rounded-full ${star <= 4 ? 'bg-[#34E0A1]' : 'border border-[#34E0A1] bg-transparent'}`} />
                                            ))}
                                        </div>
                                        <span className="text-sm font-bold text-slate-900">Marc D.</span>
                                    </div>
                                    <span className="text-xs text-slate-500">Il y a 2 jours</span>
                                </div>
                                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                                    Vraiment apprécié l'ambiance et la sélection de vins était incroyable. Cependant, le service était un peu lent aux heures de pointe...
                                </p>
                                <Button variant="outline" size="sm" className="font-bold">Répondre</Button>
                            </div>
                        ))}
                         <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
                             <Link href="#" className="text-sm font-bold text-blue-600 hover:underline">Voir tous les avis</Link>
                         </div>
                    </div>
                </div>

                {/* Quick Tips / Sidebar */}
                <div className="space-y-6">
                    <Card className={`bg-white border text-left shadow-sm relative overflow-hidden ${!isPro ? 'opacity-90' : ''}`}>
                         {!isPro && (
                           <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6">
                                <Button size="sm" className="bg-[#34E0A1] hover:bg-[#2cbe89] text-slate-900 font-bold" asChild>
                                    <Link href="/pricing">Débloquer WhatsApp</Link>
                                </Button>
                           </div>
                        )}
                        <CardHeader className="pb-2">
                             <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <MessageCircle className="h-5 w-5 text-[#25D366]" />
                                Contact Direct
                             </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 mb-4">Configurez votre numéro WhatsApp pour permettre aux clients de vous contacter directement.</p>
                            <div className="flex gap-2">
                                <Input placeholder={business.whatsapp || "+33 6 12 34 56 78"} className="bg-slate-50" disabled={!isPro} />
                                <Button size="icon" className="shrink-0 bg-slate-900" disabled={!isPro}><Check className="h-4 w-4" /></Button>
                            </div>
                        </CardContent>
                    </Card>

                    <h2 className="text-xl font-bold text-slate-900">Conseils pour vous</h2>
                    <Card className="bg-[#E0F7FA] border-none">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-lg text-slate-900 mb-2">Ajoutez plus de photos</h3>
                            <p className="text-sm text-slate-700 mb-4">Les fiches avec 10+ photos obtiennent 2x plus d'engagement.</p>
                            <Button className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-bold">Ajouter des photos</Button>
                        </CardContent>
                    </Card>

                     <Card className="bg-[#FFF8E1] border-none">
                        <CardContent className="p-6">
                             <h3 className="font-bold text-lg text-slate-900 mb-2">Soyez vérifié</h3>
                            <p className="text-sm text-slate-700 mb-4">Vérifiez votre numéro de téléphone pour apparaître plus haut dans les résultats de recherche.</p>
                            <Button variant="outline" className="w-full border-orange-200 bg-white hover:bg-orange-50 text-slate-900 font-bold">Vérifier maintenant</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
       </main>
    </div>
  )
}
