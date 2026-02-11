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
  CardFooter,
} from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  User, Briefcase, Camera, ArrowRight, ArrowLeft, 
  CheckCircle2, Shield, Zap, Users, Lock, Star 
} from "lucide-react"

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

const STEPS = [
  { id: 1, title: 'Account', icon: User, desc: 'Create your credentials' },
  { id: 2, title: 'Activity', icon: Briefcase, desc: 'Tell us about your work' },
  { id: 3, title: 'Portfolio', icon: Camera, desc: 'Show your best work' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  
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
    mode: "onChange",
  })

  const selectedCategory = form.watch("category");

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof z.infer<typeof FormSchema>)[] = [];
    switch (step) {
      case 1:
        fieldsToValidate = ['name', 'email', 'password'];
        break;
      case 2:
        fieldsToValidate = ['businessName', 'category', 'country', 'address', 'city'];
        break;
      case 3:
        fieldsToValidate = ['logoUrl', 'media'];
        break;
    }
    return form.trigger(fieldsToValidate);
  }

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setError(null);
    try {
        const payload = {
            ...values,
            category: values.category === "other" ? values.customCategory : values.category
        };

        const response = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })

        const data = await response.json().catch(() => ({ message: "Server error - invalid response" }));

        if (!response.ok) {
            throw new Error(data.message || "An error occurred")
        }

        // Redirect to Stripe Checkout for mandatory Pro subscription
        if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
        } else {
            router.push(`/pricing?registered=true&email=${encodeURIComponent(values.email)}`);
        }
    } catch (err: any) {
        console.error("Registration form error:", err);
        setError(err.message || "An unexpected error occurred")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8 animate-fade-up">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Join FiveZone</h1>
            <p className="text-slate-500 text-lg">Create your freelancer profile in 3 easy steps</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 animate-fade-up delay-100">
            <div className="flex items-center justify-center max-w-2xl mx-auto">
              {STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                const isCompleted = currentStep > step.id;
                const isActive = currentStep === step.id;
                return (
                  <div key={step.id} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2
                        ${isCompleted 
                          ? 'bg-[#34E0A1] border-[#34E0A1] text-white shadow-lg shadow-[#34E0A1]/25' 
                          : isActive 
                            ? 'bg-white border-[#34E0A1] text-[#34E0A1] shadow-lg' 
                            : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                        {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <StepIcon className="h-5 w-5" />}
                      </div>
                      <span className={`mt-2 text-xs font-bold ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</span>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-3 mt-[-18px] rounded transition-colors duration-300 ${currentStep > step.id ? 'bg-[#34E0A1]' : 'bg-slate-200'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Form */}
            <div className="lg:col-span-2 animate-fade-up delay-200">
              <Card className="border-slate-200 shadow-xl shadow-slate-200/50">
                <CardContent className="p-6 md:p-8">
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {error && (
                      <div className="p-4 text-sm text-white bg-red-500 rounded-xl flex items-center gap-2">
                        <span className="font-bold">Error:</span> {error}
                      </div>
                    )}
                    
                    {/* STEP 1: Account */}
                    {currentStep === 1 && (
                      <div className="space-y-6 animate-fade-up">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">Create your account</h3>
                          <p className="text-sm text-slate-500">Start with the basics — it only takes a minute.</p>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700" htmlFor="name">Full Name</label>
                            <Input id="name" {...form.register("name")} placeholder="John Doe" className="h-12 text-base" />
                            {form.formState.errors.name && <p className="text-xs text-red-500 font-medium">{form.formState.errors.name.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700" htmlFor="email">Email address</label>
                            <Input id="email" type="email" placeholder="you@example.com" {...form.register("email")} className="h-12 text-base" />
                            {form.formState.errors.email && <p className="text-xs text-red-500 font-medium">{form.formState.errors.email.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700" htmlFor="password">Password</label>
                            <Input id="password" type="password" {...form.register("password")} placeholder="8 characters minimum" className="h-12 text-base" />
                            {form.formState.errors.password && <p className="text-xs text-red-500 font-medium">{form.formState.errors.password.message}</p>}
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                              <Lock className="h-3 w-3" /> Your data is encrypted and secure
                            </div>
                          </div>
                        </div>
                        <Button type="button" onClick={nextStep} className="w-full h-12 text-base font-bold bg-[#34E0A1] hover:bg-[#2cbe89] text-slate-900 rounded-xl">
                          Continue <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                      </div>
                    )}

                    {/* STEP 2: Activity & Location */}
                    {currentStep === 2 && (
                      <div className="space-y-6 animate-fade-up">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">Tell us about your work</h3>
                          <p className="text-sm text-slate-500">Help clients find you with the right category and location.</p>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700" htmlFor="businessName">Profile Title</label>
                            <Input id="businessName" {...form.register("businessName")} placeholder="Ex: Freelance React Developer" className="h-12 text-base" />
                            <p className="text-xs text-slate-400">This is the title clients will see first.</p>
                            {form.formState.errors.businessName && <p className="text-xs text-red-500 font-medium">{form.formState.errors.businessName.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700" htmlFor="category">Category</label>
                            <select id="category" className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-base" {...form.register("category")}>
                              <option value="">Select your profession...</option>
                              <optgroup label="Tech & Development">
                                <option value="Web Development">Web Development</option>
                                <option value="Mobile Development">Mobile Development</option>
                                <option value="Data Science">Data Science & AI</option>
                                <option value="Cybersecurity">Cybersecurity</option>
                                <option value="IT Support">IT Support</option>
                              </optgroup>
                              <optgroup label="Design & Creation">
                                <option value="Graphic Design">Graphic Design</option>
                                <option value="UI/UX Design">UI/UX Design</option>
                                <option value="Video Editing">Video Editing</option>
                                <option value="Photography">Photography</option>
                                <option value="Animation">Animation & Motion</option>
                              </optgroup>
                              <optgroup label="Marketing & Business">
                                <option value="Digital Marketing">Digital Marketing</option>
                                <option value="SEO/SEA">SEO / SEA</option>
                                <option value="Copywriting">Copywriting & Content</option>
                                <option value="Accounting">Accounting & Finance</option>
                                <option value="Legal">Legal Services</option>
                                <option value="Business Consulting">Business Consulting</option>
                                <option value="Real Estate">Real Estate</option>
                              </optgroup>
                              <optgroup label="Education & Coaching">
                                <option value="Tutoring">Tutoring & Teaching</option>
                                <option value="Life Coaching">Life Coaching</option>
                                <option value="Language Teaching">Language Teaching</option>
                                <option value="Fitness Training">Fitness & Sports Training</option>
                              </optgroup>
                              <optgroup label="Health & Wellness">
                                <option value="Nutrition">Nutrition & Dietetics</option>
                                <option value="Wellness">Wellness & Therapy</option>
                                <option value="Beauty">Beauty & Personal Care</option>
                                <option value="Massage">Massage Therapy</option>
                              </optgroup>
                              <optgroup label="Food & Hospitality">
                                <option value="Catering">Catering & Cooking</option>
                                <option value="Pastry">Pastry & Baking</option>
                                <option value="Event Planning">Event Planning</option>
                              </optgroup>
                              <optgroup label="Arts & Entertainment">
                                <option value="Music">Music & Performance</option>
                                <option value="Fashion">Fashion & Styling</option>
                                <option value="Writing">Writing & Translation</option>
                              </optgroup>
                              <optgroup label="Local & Manual Services">
                                <option value="Handyman">Handyman & Renovation</option>
                                <option value="Cleaning">Cleaning Services</option>
                                <option value="Gardening">Gardening & Landscaping</option>
                                <option value="Transport">Transport & Delivery</option>
                                <option value="Moving">Moving Services</option>
                              </optgroup>
                              <optgroup label="Care Services">
                                <option value="Childcare">Childcare & Babysitting</option>
                                <option value="Pet Sitting">Pet Sitting & Dog Walking</option>
                                <option value="Elderly Care">Elderly Care</option>
                              </optgroup>
                              <optgroup label="Other">
                                <option value="Agriculture">Agriculture & Farming</option>
                                <option value="Customer Support">Customer Support</option>
                                <option value="Travel">Travel & Tourism</option>
                                <option value="other">Other (specify below)</option>
                              </optgroup>
                            </select>
                            {form.formState.errors.category && <p className="text-xs text-red-500 font-medium">{form.formState.errors.category.message}</p>}
                          </div>

                          {selectedCategory === "other" && (
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-700" htmlFor="customCategory">Please specify</label>
                              <Input id="customCategory" {...form.register("customCategory")} placeholder="Your profession..." className="h-12 text-base" />
                            </div>
                          )}

                          <div className="pt-2 border-t border-slate-100">
                            <label className="text-sm font-bold text-slate-700 block mb-3">Location</label>
                            <div className="space-y-3">
                              <select id="country" className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-base" {...form.register("country")}>
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
                              {form.formState.errors.country && <p className="text-xs text-red-500 font-medium">{form.formState.errors.country.message}</p>}

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-2">
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
                                    placeholder="Address / Neighborhood"
                                    defaultValue={form.getValues('address')}
                                  />
                                  <input type="hidden" {...form.register("address")} />
                                  {form.formState.errors.address && <p className="text-xs text-red-500 font-medium">{form.formState.errors.address.message}</p>}
                                </div>
                                <div className="space-y-2">
                                  <Input id="city" {...form.register("city")} placeholder="City" className="h-12 text-base" />
                                  {form.formState.errors.city && <p className="text-xs text-red-500 font-medium">{form.formState.errors.city.message}</p>}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button type="button" variant="outline" onClick={prevStep} className="h-12 px-6 rounded-xl">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back
                          </Button>
                          <Button type="button" onClick={nextStep} className="flex-1 h-12 text-base font-bold bg-[#34E0A1] hover:bg-[#2cbe89] text-slate-900 rounded-xl">
                            Continue <ArrowRight className="h-5 w-5 ml-2" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Portfolio & Visuals */}
                    {currentStep === 3 && (
                      <div className="space-y-6 animate-fade-up">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">Show your best work</h3>
                          <p className="text-sm text-slate-500">Profiles with photos get <span className="font-bold text-[#34E0A1]">5x more views</span>.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                              Profile Picture <span className="text-red-500">*</span>
                            </label>
                            <MediaUpload 
                              maxFiles={1}
                              onChange={(urls) => {
                                if (urls.length > 0) { form.setValue('logoUrl', urls[0]); form.clearErrors('logoUrl'); }
                                else { form.setValue('logoUrl', ''); }
                              }}
                            />
                            {form.formState.errors.logoUrl && <p className="text-xs text-red-500 font-medium">{form.formState.errors.logoUrl.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                              Portfolio / Gallery <span className="text-red-500">* (Min 1)</span>
                            </label>
                            <MediaUpload 
                              multiple
                              maxFiles={5}
                              onChange={(urls) => {
                                form.setValue('media', urls);
                                if (urls.length > 0) form.clearErrors('media');
                              }}
                            />
                            {form.formState.errors.media && <p className="text-xs text-red-500 font-medium">{form.formState.errors.media.message}</p>}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button type="button" variant="outline" onClick={prevStep} className="h-12 px-6 rounded-xl">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back
                          </Button>
                          <Button type="submit" className="flex-1 h-12 text-base font-bold bg-[#34E0A1] hover:bg-[#2cbe89] text-slate-900 rounded-xl shadow-lg shadow-[#34E0A1]/20" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Creating your profile..." : "Create my profile & subscribe"}
                          </Button>
                        </div>
                        <p className="text-xs text-center text-slate-400">
                          By continuing, you agree to our Terms of Service. You&apos;ll be redirected to secure payment ($99/year).
                        </p>
                      </div>
                    )}
                  </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-4 pb-6">
                  <p className="text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[#34E0A1] hover:underline font-bold">Sign in</Link>
                  </p>
                </CardFooter>
              </Card>
            </div>

            {/* Sidebar - Social Proof & Benefits */}
            <div className="hidden lg:block space-y-6 animate-fade-up delay-300">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-4">Why join FiveZone?</h4>
                <div className="space-y-4">
                  {[
                    { icon: Zap, title: '$99/year — 0% commission', desc: 'Pay once, keep 100% of your earnings', color: 'text-yellow-500 bg-yellow-50' },
                    { icon: Users, title: 'Get discovered', desc: 'Clients find you based on skills & location', color: 'text-blue-500 bg-blue-50' },
                    { icon: Shield, title: 'Secure payments', desc: 'Get paid safely via Stripe', color: 'text-green-500 bg-green-50' },
                    { icon: Briefcase, title: 'Pro workspace', desc: 'Free tools: invoicing, projects, calendar', color: 'text-violet-500 bg-violet-50' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 text-white">
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-sm text-white/90 leading-relaxed mb-4">
                  &ldquo;I signed up in 2 minutes and got my first client the same week. The platform is simple and effective.&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">KM</div>
                  <div>
                    <p className="text-sm font-bold">Koffi M.</p>
                    <p className="text-xs text-slate-400">Graphic Designer, Abidjan</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">Platform stats</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Active freelancers</span>
                    <span className="font-black text-slate-900">50+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Categories</span>
                    <span className="font-black text-slate-900">40+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Commission</span>
                    <span className="font-black text-[#34E0A1]">0%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
