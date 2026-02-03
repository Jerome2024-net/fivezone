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
  name: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  businessName: z.string().min(1, "Business name is required"),
  category: z.string().min(1, "Category is required"),
  customCategory: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  logoUrl: z.string().min(1, "Profile picture is required"),
  media: z.array(z.string()).min(1, "Add at least one image of your work"),
}).superRefine((data, ctx) => {
    if (data.category === "other" && !data.customCategory) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please specify your category",
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
    setError(null);
    
    try {
        const payload = {
            ...values,
            category: values.category === "other" ? values.customCategory : values.category
        };

        console.log("Submitting registration payload:", payload);

        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })

        const data = await response.json().catch(() => ({ message: "Server error - invalid response" }));
        
        console.log("Registration response:", response.status, data);

        if (!response.ok) {
            throw new Error(data.message || "An error occurred")
        }

        // Redirect to the payment page with the email for pre-filling
        router.push(`/pricing?registered=true&email=${encodeURIComponent(values.email)}`);
        
    } catch (err: any) {
        console.error("Registration form error:", err);
        setError(err.message || "An unexpected error occurred")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-muted/50 py-10 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create a Freelancer Profile</CardTitle>
          <CardDescription>
            Join the FiveZone community in just a few clicks.
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
                <h3 className="text-lg font-medium">1. Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="name">Full Name</label>
                      <Input id="name" {...form.register("name")} placeholder="John Doe" />
                      {form.formState.errors.name && (
                        <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="email">Email</label>
                      <Input id="email" type="email" placeholder="email@example.com" {...form.register("email")} />
                       {form.formState.errors.email && (
                        <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="password">Password</label>
                  <Input id="password" type="password" {...form.register("password")} placeholder="8 characters minimum" />
                   {form.formState.errors.password && (
                    <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
                  )}
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-lg font-medium">2. Your Activity</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="businessName">Profile Title</label>
                      <Input id="businessName" {...form.register("businessName")} placeholder="Ex: Freelance React Developer" />
                       {form.formState.errors.businessName && (
                        <p className="text-xs text-destructive">{form.formState.errors.businessName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="category">Category</label>
                      <select 
                        id="category" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        {...form.register("category")}
                      >
                        <option value="">Select...</option>
                        <optgroup label="Tech & Development">
                            <option value="Web Development">Web Development</option>
                            <option value="Mobile Development">Mobile Development</option>
                            <option value="Data Science">Data Science & AI</option>
                            <option value="Cybersecurity">Cybersecurity</option>
                        </optgroup>
                        <optgroup label="Design & Creation">
                            <option value="Graphic Design">Graphic Design</option>
                            <option value="UI/UX Design">UI/UX Design</option>
                            <option value="Video Editing">Video Editing</option>
                            <option value="Photography">Photography</option>
                        </optgroup>
                        <optgroup label="Marketing & Business">
                            <option value="Digital Marketing">Digital Marketing</option>
                            <option value="SEO/SEA">SEO / SEA</option>
                            <option value="Copywriting">Copywriting</option>
                            <option value="Accounting">Accounting & Finance</option>
                            <option value="Legal">Legal</option>
                        </optgroup>
                        <optgroup label="Local Services">
                            <option value="Handyman">Handyman</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Pet Sitting">Pet Sitting</option>
                        </optgroup>
                        <option value="other">Other</option>
                     </select>
                      {form.formState.errors.category && (
                        <p className="text-xs text-destructive">{form.formState.errors.category.message}</p>
                      )}
                    </div>
                </div>

                {selectedCategory === "other" && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="customCategory">Please specify</label>
                        <Input id="customCategory" {...form.register("customCategory")} placeholder="Your profession..." />
                    </div>
                )}
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-lg font-medium">3. Location</h3>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="country">Country of residence</label>
                    <select 
                        id="country" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        {...form.register("country")}
                    >
                        <option value="">Select a country</option>
                        <optgroup label="Africa">
                            <option value="Ivory Coast">Ivory Coast</option>
                            <option value="Senegal">Senegal</option>
                            <option value="Cameroon">Cameroon</option>
                            <option value="Togo">Togo</option>
                            <option value="Benin">Benin</option>
                            <option value="Morocco">Morocco</option>
                            <option value="Gabon">Gabon</option>
                            <option value="Other Africa">Other Africa</option>
                        </optgroup>
                        <optgroup label="Europe / World">
                            <option value="France">France</option>
                            <option value="Belgium">Belgium</option>
                            <option value="Canada">Canada</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Other">Other</option>
                        </optgroup>
                    </select>
                    {form.formState.errors.country && (
                        <p className="text-xs text-destructive">{form.formState.errors.country.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="address">Address / Neighborhood</label>
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
                        placeholder="Search..."
                        defaultValue={form.getValues('address')}
                      />
                       <input type="hidden" {...form.register("address")} />
                       {form.formState.errors.address && (
                        <p className="text-xs text-destructive">{form.formState.errors.address.message}</p>
                      )}
                    </div>
                     <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="city">City</label>
                      <Input id="city" {...form.register("city")} placeholder="New York, London..." />
                       {form.formState.errors.city && (
                        <p className="text-xs text-destructive">{form.formState.errors.city.message}</p>
                      )}
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-lg font-medium">4. Visuals</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-medium flex justify-between">
                            Profile Picture <span className="text-red-500">*</span>
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
                             Gallery / Portfolio <span className="text-red-500">* (Min 1)</span>
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
               {form.formState.isSubmitting ? "Creating..." : "Create my Freelancer Profile"}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
                By signing up, you agree to our Terms of Service. You can complete your information (Tax ID, Website, etc.) later.
            </p>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4 mt-2">
            <p className="text-sm text-muted-foreground mr-1">
                Already have an account? 
            </p>
            <Link href="/login" className="text-primary hover:underline text-sm font-semibold">
                Sign in
            </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
