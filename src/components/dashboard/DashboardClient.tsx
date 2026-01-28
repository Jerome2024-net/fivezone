"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
    MapPin, Phone, Globe, Star, Share2, Heart, Check, 
    User, BadgeCheck, Tag, Pencil, Camera, X, Loader2,
    LayoutDashboard, Eye, MessageSquare, MousePointerClick
} from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { ImageUpload } from "./ImageUpload"
// import { ServiceManager } from "./ServiceManager"

// Validation Schema
const EditSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  category: z.string().min(1),
  address: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, "La ville est requise"),
  phone: z.string().optional(),
  website: z.string().optional(),
  logoUrl: z.string().min(1, "Le logo est obligatoire"),
  coverUrl: z.string().min(1, "La photo de couverture est obligatoire"),
  hourlyRate: z.number().optional().or(z.string().transform(val => val === '' ? undefined : Number(val))),
  currency: z.string().optional(),
  ctaAction: z.string().optional(),
  ctaUrl: z.string().optional(),
})

interface DashboardClientProps {
    initialBusiness: any;
    isPro: boolean;
}

export function DashboardClient({ initialBusiness, isPro }: DashboardClientProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [business, setBusiness] = useState(initialBusiness);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof EditSchema>>({
        resolver: zodResolver(EditSchema),
        defaultValues: {
            name: business.name || "",
            description: business.description || "",
            category: business.category || "",
            address: business.address || "",
            city: business.city || "",
            phone: business.phone || "",
            website: business.website || "",
            logoUrl: business.logoUrl || "",
            coverUrl: business.coverUrl || "",
            hourlyRate: business.hourlyRate || "",
            currency: business.currency || "EUR",
            ctaAction: business.ctaAction || "none",
            ctaUrl: business.ctaUrl || "",
        }
    });

    // Reset form when business updates
    useEffect(() => {
        form.reset({
            name: business.name || "",
            description: business.description || "",
            category: business.category || "",
            address: business.address || "",
            city: business.city || "",
            phone: business.phone || "",
            website: business.website || "",
            logoUrl: business.logoUrl || "",
            coverUrl: business.coverUrl || "",
            hourlyRate: business.hourlyRate || "",
            currency: business.currency || "EUR",
            ctaAction: business.ctaAction || "none",
            ctaUrl: business.ctaUrl || "",
        });
    }, [business, form]);

    const onSubmit = async (values: z.infer<typeof EditSchema>) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/business/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            });

            if (!res.ok) throw new Error("Erreur");

            setBusiness({ ...business, ...values });
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    if (isEditing) {
        return (
            <div className="min-h-screen bg-white">
                 <div className="container mx-auto max-w-3xl px-4 py-8">
                     <div className="flex items-center justify-between mb-8">
                         <h1 className="text-2xl font-bold">Modifier le profil</h1>
                         <Button variant="ghost" onClick={() => setIsEditing(false)}>Fermer</Button>
                     </div>

                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* Media Section */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold border-b pb-2 flex items-center justify-between">
                                Identité Visuelle
                                <span className="text-xs text-red-500 font-normal">* Media Obligatoires</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <ImageUpload 
                                        label="Photo de couverture (16:9) *" 
                                        value={form.watch('coverUrl')} 
                                        onChange={(url) => form.setValue('coverUrl', url)} 
                                        aspectRatio="video"
                                        className="w-full"
                                    />
                                    {form.formState.errors.coverUrl && (
                                        <p className="text-xs text-red-500 font-bold">{form.formState.errors.coverUrl.message}</p>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <ImageUpload 
                                        label="Logo / Avatar (Carré) *" 
                                        value={form.watch('logoUrl')} 
                                        onChange={(url) => form.setValue('logoUrl', url)} 
                                        className="w-32"
                                    />
                                    {form.formState.errors.logoUrl && (
                                        <p className="text-xs text-red-500 font-bold">{form.formState.errors.logoUrl.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold border-b pb-2">Informations Principales</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Titre du profil (Nom)</label>
                                    <Input {...form.register("name")} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Catégorie</label>
                                    <Input {...form.register("category")} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Bio / Description</label>
                                <Textarea {...form.register("description")} className="h-32" placeholder="Dites-nous en plus sur votre activité..." />
                            </div>
                        </div>

                        {/* Contact & Location */}
                        <div className="space-y-4">
                             <h2 className="text-lg font-semibold border-b pb-2">Localisation & Contact</h2>
                             <div className="space-y-2">
                                <label className="text-sm font-medium">Adresse complète</label>
                                <Input {...form.register("address")} />
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Ville</label>
                                    <Input {...form.register("city")} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Téléphone</label>
                                    <Input {...form.register("phone")} />
                                </div>
                             </div>
                             <div className="space-y-2">
                                <label className="text-sm font-medium">Site Web</label>
                                <Input {...form.register("website")} placeholder="https://" />
                             </div>
                        </div>

                        {/* Pricing Section - TJM */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold border-b pb-2">Tarification (Optionnel)</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Taux Journalier Moyen (TJM)</label>
                                    <Input type="number" {...form.register("hourlyRate")} placeholder="Ex: 500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Devise</label>
                                    <select 
                                        className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        {...form.register("currency")}
                                    >
                                        <option value="EUR">Euros (€)</option>
                                        <option value="XOF">Franc CFA (FCFA)</option>
                                        <option value="USD">Dollars ($)</option>
                                        <option value="GBP">Livres (£)</option>
                                    </select>
                                </div>
                             </div>
                        </div>

                        {/* CTA Configuration */}
                        <div className="space-y-4">
                             <h2 className="text-lg font-semibold border-b pb-2">Bouton d&apos;action</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Type de bouton</label>
                                    <select 
                                        {...form.register("ctaAction")}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="none">Aucun</option>
                                        <option value="booking">Réserver</option>
                                        <option value="order">Commander</option>
                                        <option value="appointment">Prendre RDV</option>
                                        <option value="contact">Nous Contacter</option>
                                        <option value="website">Voir le Site</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Lien de destination</label>
                                    <Input {...form.register("ctaUrl")} disabled={form.watch('ctaAction') === 'none'} placeholder="https://" />
                                </div>
                             </div>
                        </div>

                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-between items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
                             <span className="text-sm text-gray-500 hidden md:inline">Les modifications non enregistrées seront perdues.</span>
                             <div className="flex gap-2 w-full md:w-auto">
                                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="flex-1 md:flex-none">Annuler</Button>
                                <Button type="submit" disabled={isLoading} className="flex-1 md:flex-none bg-slate-900 text-white">
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
                                </Button>
                             </div>
                        </div>
                        <div className="h-16" /> {/* Spacer for fixed footer */}
                     </form>
                 </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* NEW SOCIAL PROFILE HEADER */}
            
            {/* 1. Cover Image Banner */}
            <div className="h-48 md:h-64 lg:h-80 w-full relative bg-slate-200 group">
                {business.coverUrl ? (
                    <img src={business.coverUrl} alt="Cover" className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400">
                        <Camera className="h-8 w-8 opacity-50" />
                    </div>
                )}
                {/* Edit Cover Button Overlay */}
                <button 
                   onClick={() => setIsEditing(true)}
                   className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2"
                >
                    <Pencil className="h-3 w-3" /> Modifier la couverture
                </button>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative">
                 {/* 2. Profile Info Section - Overlapping Cover */}
                 <div className="flex flex-col md:flex-row items-end -mt-16 md:-mt-20 relative z-20 mb-6 gap-6">
                     
                     {/* Logo/Avatar */}
                     <div className="relative group shrink-0">
                         <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden flex items-center justify-center">
                            {business.logoUrl ? (
                                <img src={business.logoUrl} alt="Logo" className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-4xl font-black text-slate-200">{business.name?.charAt(0)}</span>
                            )}
                         </div>
                         <button 
                             onClick={() => setIsEditing(true)}
                             className="absolute bottom-2 right-2 p-2 bg-slate-900 text-white rounded-full hover:bg-slate-700 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                         >
                             <Pencil className="h-4 w-4" />
                         </button>
                     </div>

                     {/* Name & Actions */}
                     <div className="flex-1 flex flex-col md:flex-row md:items-end justify-between w-full gap-4">
                         <div className="mb-2 md:mb-4">
                             <div className="flex items-center gap-2">
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900">{business.name}</h1>
                                {isPro && <BadgeCheck className="h-6 w-6 text-[#34E0A1] fill-current" />}
                             </div>
                             <p className="text-slate-600 font-medium">@{business.category} • {business.city}</p>
                         </div>
                         
                         <div className="flex gap-3 mb-4">
                             <Button onClick={() => setIsEditing(true)} variant="outline" className="rounded-full font-bold border-slate-300">
                                 <Pencil className="h-4 w-4 mr-2" /> Modifier le profil
                             </Button>
                             {isPro && (
                                <Link href={`/business/${business.id || '#'}`} target="_blank">
                                    <Button className="rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800">
                                        <Eye className="h-4 w-4 mr-2" /> Voir public
                                    </Button>
                                </Link>
                             )}
                         </div>
                     </div>
                 </div>

                 {/* 3. Main Content Grid (Social Style) */}
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     
                     {/* Left Sidebar - Intro & Details */}
                     <div className="lg:col-span-1 space-y-6">
                         
                         {/* Stats Cards (Mini) */}
                         <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-around text-center">
                             <div>
                                 <div className="text-2xl font-black text-slate-900">{business.viewCount || 0}</div>
                                 <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Vues</div>
                             </div>
                             <div className="w-px bg-slate-100" />
                             <div>
                                 <div className="text-2xl font-black text-slate-900">0</div>
                                 <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Clics</div>
                             </div>
                             <div className="w-px bg-slate-100" />
                             <div>
                                 <div className="text-2xl font-black text-slate-900">5.0</div>
                                 <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Note</div>
                             </div>
                         </div>

                         {/* About Card */}
                         <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
                             <h3 className="font-bold text-lg">Coordonnées</h3>
                             
                             <div className="space-y-3">
                                 <div className="flex items-center gap-3 text-sm text-slate-600">
                                     <MapPin className="h-4 w-4 shrink-0" />
                                     <span>{business.address}, {business.city}</span>
                                 </div>
                                 <div className="flex items-center gap-3 text-sm text-slate-600">
                                     <Phone className="h-4 w-4 shrink-0" />
                                     <span>{business.phone || "Pas de téléphone"}</span>
                                 </div>
                                 {business.website && (
                                     <div className="flex items-center gap-3 text-sm text-blue-600 overflow-hidden">
                                         <Globe className="h-4 w-4 shrink-0" />
                                         <a href={business.website} target="_blank" className="truncate hover:underline">{business.website}</a>
                                     </div>
                                 )}
                             </div>
                         </div>
                     </div>

                     {/* Center Feed / Content Area */}
                     <div className="lg:col-span-2 space-y-6">

                        {/* Activity Description (Pinned Post) */}
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-100">
                                    {business.logoUrl ? (
                                        <img src={business.logoUrl} alt="Avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full bg-slate-200" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{business.name}</h3>
                                    <p className="text-xs text-slate-500">Mise à jour de l&apos;activité</p>
                                </div>
                            </div>
                            
                            <div className="pl-0 md:pl-12">
                                <p className="text-slate-700 leading-relaxed text-base whitespace-pre-wrap">
                                    {business.description || "Présentez votre activité ici. Que proposez-vous ? Quelle est votre histoire ?"}
                                </p>
                                
                                {business.ctaAction && business.ctaAction !== 'none' && (
                                    <div className="mt-6">
                                        <a 
                                            href={business.ctaUrl || '#'} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="inline-flex items-center justify-center rounded-lg text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#34E0A1] text-slate-900 hover:bg-[#2bc98e] h-10 px-6 shadow-sm hover:shadow-md"
                                        >
                                            {(() => {
                                                switch(business.ctaAction) {
                                                    case 'booking': return "📅 Réserver maintenant";
                                                    case 'order': return "🛒 Commander";
                                                    case 'appointment': return "📅 Prendre Rendez-vous";
                                                    case 'contact': return "✉️ Nous Contacter";
                                                    case 'website': return "🌐 Voir le Site";
                                                    default: return "Voir";
                                                }
                                            })()}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                         
                         {!isPro && (
                             <div className="bg-slate-900 rounded-xl p-6 text-white flex items-center justify-between shadow-lg">
                                 <div>
                                     <h3 className="font-bold text-lg mb-1">Passer au niveau supérieur 🚀</h3>
                                     <p className="text-slate-300 text-sm">Obtenez le badge vérifié et boostez votre visibilité.</p>
                                 </div>
                                 <Link href="/pricing">
                                     <Button className="bg-[#34E0A1] hover:bg-[#2bc98e] text-slate-900 font-bold">Voir les offres</Button>
                                 </Link>
                             </div>
                         )}

                        {/* Photos Grid */}
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Camera className="h-5 w-5" /> Galerie Photos
                            </h3>
                            
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {/* Use cover and logo if available as starter photos */}
                                {business.coverUrl && (
                                    <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative group">
                                         <img src={business.coverUrl} className="h-full w-full object-cover" />
                                    </div>
                                )}
                                {business.logoUrl && (
                                    <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative group">
                                         <img src={business.logoUrl} className="h-full w-full object-cover" />
                                    </div>
                                )}
                                
                                {/* Placeholder for more (Upload button) */}
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-400 hover:bg-slate-100 transition-all"
                                >
                                    <Camera className="h-8 w-8 mb-1" />
                                    <span className="text-xs font-bold">Ajouter</span>
                                </button>
                             </div>
                        </div>

                        {/* Services / Products Section - HIDDEN FOR MVP
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                             <div className="mb-4">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <Tag className="h-5 w-5" /> Mes Prestations
                                </h3>
                                <p className="text-sm text-slate-500">Gérez ici les services ou produits que vos clients peuvent réserver.</p>
                             </div>
                             <ServiceManager />
                        </div>
                        */}

                     </div>
                 </div>
            </div>
        </div>
    )
}
