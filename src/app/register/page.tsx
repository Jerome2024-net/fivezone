"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MediaUpload } from "@/components/register/MediaUpload"
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete"
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Link from "next/link"

const FormSchema = z.object({
  role: z.literal("OWNER"),
  name: z.string().min(1, "Le nom complet est requis"),
  email: z.string().min(1, "L'email est requis").email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  businessName: z.string().min(1, "Le nom de l'entreprise est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  customCategory: z.string().optional(),
  country: z.string().min(1, "Le pays est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, "La ville est requise"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  logoUrl: z.string().min(1, "La photo de profil est requise"),
  media: z.array(z.string()).min(1, "Ajoutez au moins une image de vos travaux"),
}).superRefine((data, ctx) => {
    if (data.category === "other" && !data.customCategory) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Veuillez préciser votre catégorie",
            path: ["customCategory"],
        })
    }
})

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role: "OWNER", 
      name: "",
      email: "",
      password: "",
      businessName: "",
      category: "",
      customCategory: "",
      country: "",
      address: "",
      city: "",
      logoUrl: "",
      media: [],
    },
  })

  const selectedCategory = form.watch("category");

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
        const payload = {
            ...values,
            category: values.category === "other" ? values.customCategory : values.category
        };

        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            const data = await response.json().catch(() => ({ message: "Erreur serveur" }));
            throw new Error(data.message || "Une erreur est survenue")
        }

        // Rediriger vers la page de paiement avec l'email pour le pré-remplissage
        router.push(`/pricing?registered=true&email=${encodeURIComponent(values.email)}`);
        
    } catch (err: any) {
        setError(err.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-muted/50 py-10 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Créer un profil Freelance</CardTitle>
          <CardDescription>
            Rejoignez la communauté FiveZone en quelques clics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="p-3 text-sm text-white bg-destructive rounded-md">
                    {error}
                </div>
            )}
            
            <div className="space-y-4">
                <h3 className="text-lg font-medium">1. Identifiants</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="name">Nom complet</label>
                      <Input id="name" {...form.register("name")} placeholder="Jean Dupont" />
                      {form.formState.errors.name && (
                        <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="email">Email</label>
                      <Input id="email" type="email" placeholder="email@exemple.com" {...form.register("email")} />
                       {form.formState.errors.email && (
                        <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="password">Mot de passe</label>
                  <Input id="password" type="password" {...form.register("password")} placeholder="8 caractères minimum" />
                   {form.formState.errors.password && (
                    <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
                  )}
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-lg font-medium">2. Votre Activité</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="businessName">Titre du profil</label>
                      <Input id="businessName" {...form.register("businessName")} placeholder="Ex: Développeur React Freelance" />
                       {form.formState.errors.businessName && (
                        <p className="text-xs text-destructive">{form.formState.errors.businessName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="category">Catégorie</label>
                      <select 
                        id="category" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        {...form.register("category")}
                      >
                        <option value="">Sélectionner...</option>
                        <optgroup label="Tech & Développement">
                            <option value="Développement Web">Développement Web</option>
                            <option value="Développement Mobile">Développement Mobile</option>
                            <option value="Data Science">Data Science & IA</option>
                            <option value="Cybersécurité">Cybersécurité</option>
                        </optgroup>
                        <optgroup label="Design & Création">
                            <option value="Design Graphique">Design Graphique</option>
                            <option value="UI/UX Design">UI/UX Design</option>
                            <option value="Montage Vidéo">Montage Vidéo</option>
                            <option value="Photographie">Photographie</option>
                        </optgroup>
                        <optgroup label="Marketing & Biz">
                            <option value="Marketing Digital">Marketing Digital</option>
                            <option value="SEO/SEA">SEO / SEA</option>
                            <option value="Rédaction Web">Rédaction</option>
                            <option value="Comptabilité">Comptabilité & Finance</option>
                            <option value="Juridique">Juridique</option>
                        </optgroup>
                        <optgroup label="Services Locaux">
                            <option value="Bricolage">Bricolage</option>
                            <option value="Ménage">Ménage</option>
                            <option value="Garde d'animaux">Garde d'animaux</option>
                        </optgroup>
                        <option value="other">Autre</option>
                     </select>
                      {form.formState.errors.category && (
                        <p className="text-xs text-destructive">{form.formState.errors.category.message}</p>
                      )}
                    </div>
                </div>

                {selectedCategory === "other" && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="customCategory">Précisez</label>
                        <Input id="customCategory" {...form.register("customCategory")} placeholder="Votre métier..." />
                    </div>
                )}
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-lg font-medium">3. Localisation</h3>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="country">Pays de résidence</label>
                    <select 
                        id="country" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        {...form.register("country")}
                    >
                        <option value="">Sélectionner un pays</option>
                        <optgroup label="Afrique">
                            <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                            <option value="Sénégal">Sénégal</option>
                            <option value="Cameroun">Cameroun</option>
                            <option value="Togo">Togo</option>
                            <option value="Bénin">Bénin</option>
                            <option value="Maroc">Maroc</option>
                            <option value="Gabon">Gabon</option>
                            <option value="Autre Afrique">Autre Afrique</option>
                        </optgroup>
                        <optgroup label="Europe / Monde">
                            <option value="France">France</option>
                            <option value="Belgique">Belgique</option>
                            <option value="Canada">Canada</option>
                            <option value="Autre">Autre</option>
                        </optgroup>
                    </select>
                    {form.formState.errors.country && (
                        <p className="text-xs text-destructive">{form.formState.errors.country.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="address">Adresse / Quartier</label>
                      <AddressAutocomplete 
                        onAddressSelect={(address, city, coords) => {
                            form.setValue('address', address);
                            form.setValue('city', city);
                            form.setValue('latitude', coords.lat);
                            form.setValue('longitude', coords.lng);
                            form.clearErrors('address');
                            form.clearErrors('city');
                        }}
                        onChange={(value) => {
                            form.setValue('address', value);
                            if (value.length > 0) form.clearErrors('address');
                        }}
                        placeholder="Rechercher..."
                        defaultValue={form.getValues('address')}
                      />
                       <input type="hidden" {...form.register("address")} />
                       {form.formState.errors.address && (
                        <p className="text-xs text-destructive">{form.formState.errors.address.message}</p>
                      )}
                    </div>
                     <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="city">Ville</label>
                      <Input id="city" {...form.register("city")} placeholder="Abidjan, Paris..." />
                       {form.formState.errors.city && (
                        <p className="text-xs text-destructive">{form.formState.errors.city.message}</p>
                      )}
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-lg font-medium">4. Visuels</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-medium flex justify-between">
                            Photo de profil <span className="text-red-500">*</span>
                        </label>
                        <MediaUpload 
                            maxFiles={1}
                            onChange={(urls) => {
                                if (urls.length > 0) {
                                    form.setValue('logoUrl', urls[0]);
                                    form.clearErrors('logoUrl');
                                } else {
                                    form.setValue('logoUrl', '');
                                }
                            }}
                        />
                         {form.formState.errors.logoUrl && (
                            <p className="text-xs text-destructive">{form.formState.errors.logoUrl.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex justify-between">
                             Galerie / Portfolio <span className="text-red-500">* (Min 1)</span>
                        </label>
                        <MediaUpload 
                            multiple
                            maxFiles={5}
                            onChange={(urls) => {
                                 form.setValue('media', urls);
                                 if (urls.length > 0) form.clearErrors('media');
                            }}
                        />
                         {form.formState.errors.media && (
                            <p className="text-xs text-destructive">{form.formState.errors.media.message}</p>
                        )}
                    </div>
                 </div>
            </div>

            <Button type="submit" className="w-full font-bold bg-[#34E0A1] hover:bg-[#2cbe89] text-slate-900 h-12 text-lg" disabled={form.formState.isSubmitting}>
               {form.formState.isSubmitting ? "Création en cours..." : "Créer mon profil Freelance"}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
                En vous inscrivant, vous acceptez nos CGU. Vous pourrez compléter vos infos (SIRET, Site web, etc.) plus tard.
            </p>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4 mt-2">
            <p className="text-sm text-muted-foreground mr-1">
                Déjà un compte ? 
            </p>
            <Link href="/login" className="text-primary hover:underline text-sm font-semibold">
                Se connecter
            </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
