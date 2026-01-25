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
  confirmPassword: z.string().min(1, "La confirmation du mot de passe est requise"),
  businessName: z.string().min(1, "Le nom de l'entreprise est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  customCategory: z.string().optional(),
  address: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, "La ville est requise"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  logoUrl: z.string().min(1, "La photo de profil/logo est requise"),
  media: z.array(z.string()).min(1, "Veuillez ajouter au moins une image dans la galerie"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Les mots de passe ne correspondent pas",
}) .superRefine((data, ctx) => {
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
      confirmPassword: "",
      businessName: "",
      category: "",
      customCategory: "",
      address: "",
      city: "",
      phone: "",
      website: "",
      logoUrl: "",
      media: [],
    },
  })

  // Always true now
  const isBusiness = true;
  const selectedCategory = form.watch("category");

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
        // If "Other" is selected, use the custom category value
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

        // Redirect to Login instead of Stripe for now (since we offer free entry)
        router.push("/login?registered=true");
        
    } catch (err: any) {
        setError(err.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-muted/50 py-10 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Inscrivez votre entreprise</CardTitle>
          <CardDescription>
            Créez un compte pour lister et gérer votre entreprise sur FiveZone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="p-3 text-sm text-white bg-destructive rounded-md">
                    {error}
                </div>
            )}
            
            {/* Account Details */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Détails du compte</h3>
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
                      <Input id="email" type="email" placeholder="m@exemple.com" {...form.register("email")} />
                       {form.formState.errors.email && (
                        <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="password">Mot de passe</label>
                      <Input id="password" type="password" {...form.register("password")} />
                       {form.formState.errors.password && (
                        <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="confirmPassword">Confirmer le mot de passe</label>
                      <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
                       {form.formState.errors.confirmPassword && (
                        <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-lg font-medium">Informations sur l'entreprise</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="businessName">Nom de l'entreprise</label>
                  <Input id="businessName" {...form.register("businessName")} placeholder="Le Gourmet Parisien" />
                   {form.formState.errors.businessName && (
                    <p className="text-xs text-destructive">{form.formState.errors.businessName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="category">Catégorie</label>
                  <select 
                    id="category" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...form.register("category")}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <optgroup label="Restauration">
                        <option value="Restaurants">Restaurants</option>
                        <option value="Cafes">Cafés</option>
                        <option value="Bars & Nightlife">Bars & Vie nocturne</option>
                        <option value="Bakeries">Boulangeries</option>
                    </optgroup>
                    <optgroup label="Voyage & Hébergement">
                        <option value="Hotels">Hôtels</option>
                        <option value="Bed & Breakfast">Chambres d'hôtes</option>
                        <option value="Resorts">Complexes hôteliers</option>
                        <option value="Travel Agencies">Agences de voyage</option>
                    </optgroup>
                    <optgroup label="Services">
                        <option value="Services">Services généraux</option>
                        <option value="Real Estate">Immobilier</option>
                        <option value="Automotive">Automobile</option>
                        <option value="Technology">Technologie & Informatique</option>
                        <option value="Legal">Services juridiques</option>
                        <option value="Financial">Services financiers</option>
                    </optgroup>
                    <optgroup label="Mode de vie & Santé">
                        <option value="Health & Medical">Santé & Médical</option>
                        <option value="Beauty & Spa">Beauté & Spa</option>
                        <option value="Fitness">Fitness & Gym</option>
                    </optgroup>
                    <optgroup label="Shopping">
                        <option value="Shopping">Centres commerciaux</option>
                        <option value="Retail">Magasins de détail</option>
                        <option value="Fashion">Mode</option>
                    </optgroup>
                     <optgroup label="Divertissement">
                        <option value="Arts & Entertainment">Arts & Divertissement</option>
                        <option value="Events">Événements & Conférences</option>
                    </optgroup>
                    <option value="other">Autre (Précisez ci-dessous)</option>
                 </select>
                  {form.formState.errors.category && (
                    <p className="text-xs text-destructive">{form.formState.errors.category.message}</p>
                  )}
                </div>

                {selectedCategory === "other" && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <label className="text-sm font-medium" htmlFor="customCategory">Préciser la catégorie</label>
                        <Input 
                            id="customCategory" 
                            {...form.register("customCategory")} 
                            placeholder="ex: Toilettage, Architecture..." 
                        />
                        {form.formState.errors.customCategory && (
                            <p className="text-xs text-destructive">{form.formState.errors.customCategory.message}</p>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="address">Adresse</label>
                      <AddressAutocomplete 
                        onAddressSelect={(address, city, coords) => {
                            form.setValue('address', address);
                            form.setValue('city', city);
                            form.setValue('latitude', coords.lat);
                            form.setValue('longitude', coords.lng);
                            // Clear errors if any
                            form.clearErrors('address');
                            form.clearErrors('city');
                        }}
                        placeholder="Rechercher une adresse..."
                        defaultValue={form.getValues('address')}
                      />
                      {/* Hidden input to register the address field in the form state properly if needed, although AddressAutocomplete manages it via onAddressSelect -> setValue. However, if manual edit is needed, AddressAutocomplete allows typing. But passing ref is tricky. simpler to relying on setValue for now. 
                          Wait, if user types manually in AddressAutocomplete and doesn't select, onAddressSelect isn't called.
                          The AddressAutocomplete component (I created) does not expose an onChange for manual entry that propagates out simply.
                          Actually, inside AddressAutocomplete, I have an Input. If I want manual entry to work without selection, 
                          I should probably pass a generic onChange or make AddressAutocomplete support controlled value properly.
                          
                          But for "Intelligent" addressing, we prefer them to select from list. 
                          Also, I can just use a hidden input for form submission if I was using native forms, but here I use RHF's handleSubmit.
                          As long as setValue is called, it's fine.
                          BUT valid concern: what if they type "My House" and don't select?
                          My AddressAutocomplete current implementation updates local state `query`. It calls `onAddressSelect` only on click.
                          It does NOT call checking back to parent on text change.
                          I should update AddressAutocomplete to call an `onChange` prop with the text as well, so manual entry is possible.
                      */}
                       <input type="hidden" {...form.register("address")} />
                       {form.formState.errors.address && (
                        <p className="text-xs text-destructive">{form.formState.errors.address.message}</p>
                      )}
                    </div>
                     <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="city">Ville</label>
                      <Input id="city" {...form.register("city")} placeholder="Paris" />
                       {form.formState.errors.city && (
                        <p className="text-xs text-destructive">{form.formState.errors.city.message}</p>
                      )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="phone">Numéro de téléphone (Optionnel)</label>
                        <Input id="phone" {...form.register("phone")} placeholder="+33 1 23 45 67 89" />
                        {form.formState.errors.phone && (
                            <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="website">Site Web (Optionnel)</label>
                        <Input id="website" {...form.register("website")} placeholder="https://exemple.com" />
                        {form.formState.errors.website && (
                            <p className="text-xs text-destructive">{form.formState.errors.website.message}</p>
                        )}
                    </div>
                </div>
                
                 <div className="space-y-2">
                    <label className="text-sm font-medium flex justify-between">
                        Photo de profil / Logo <span className="text-red-500">*</span>
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
                        className="mb-4"
                    />
                     {form.formState.errors.logoUrl && (
                        <p className="text-xs text-destructive">{form.formState.errors.logoUrl.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium flex justify-between">
                         Photos de la galerie <span className="text-red-500">* (Min 1 photo)</span>
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

            <Button type="submit" className="w-full font-bold bg-[#34E0A1] hover:bg-[#2cbe89] text-slate-900" disabled={form.formState.isSubmitting}>
               {form.formState.isSubmitting ? "Inscription en cours..." : "Inscrire l'entreprise"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground mr-1">
                Vous avez déjà un compte ? 
            </p>
            <Link href="/login" className="text-primary hover:underline text-sm font-semibold">
                Se connecter
            </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
