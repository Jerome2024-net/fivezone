import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { 
  Monitor, Pen, BarChart3, Building2, Droplets, Landmark, Camera, GraduationCap,
  Heart, Truck, Scissors, Music, Utensils, Hammer, Leaf, Smartphone, Shield, Globe,
  Headphones, Wrench, Baby, Dog, Dumbbell, Cpu, Palette, Megaphone, BookOpen,
  Plane, Home, Shirt, ArrowRight
} from "lucide-react"

export const dynamic = 'force-dynamic'

const categoryConfig: Record<string, { icon: any; color: string; iconColor: string; iconBg: string }> = {
  'tech': { icon: Monitor, color: 'from-blue-600/10 to-indigo-600/10 border-blue-300/40', iconColor: 'text-blue-600', iconBg: 'bg-blue-100' },
  'development': { icon: Monitor, color: 'from-blue-600/10 to-indigo-600/10 border-blue-300/40', iconColor: 'text-blue-600', iconBg: 'bg-blue-100' },
  'web development': { icon: Monitor, color: 'from-blue-600/10 to-indigo-600/10 border-blue-300/40', iconColor: 'text-blue-600', iconBg: 'bg-blue-100' },
  'mobile development': { icon: Smartphone, color: 'from-sky-600/10 to-blue-600/10 border-sky-300/40', iconColor: 'text-sky-600', iconBg: 'bg-sky-100' },
  'data science': { icon: Cpu, color: 'from-violet-600/10 to-blue-600/10 border-violet-300/40', iconColor: 'text-violet-600', iconBg: 'bg-violet-100' },
  'cybersecurity': { icon: Shield, color: 'from-red-600/10 to-orange-600/10 border-red-300/40', iconColor: 'text-red-600', iconBg: 'bg-red-100' },
  'design': { icon: Pen, color: 'from-pink-600/10 to-rose-600/10 border-pink-300/40', iconColor: 'text-pink-600', iconBg: 'bg-pink-100' },
  'graphic design': { icon: Palette, color: 'from-pink-600/10 to-rose-600/10 border-pink-300/40', iconColor: 'text-pink-600', iconBg: 'bg-pink-100' },
  'ui/ux design': { icon: Pen, color: 'from-purple-600/10 to-pink-600/10 border-purple-300/40', iconColor: 'text-purple-600', iconBg: 'bg-purple-100' },
  'marketing': { icon: BarChart3, color: 'from-orange-600/10 to-amber-600/10 border-orange-300/40', iconColor: 'text-orange-600', iconBg: 'bg-orange-100' },
  'digital marketing': { icon: Megaphone, color: 'from-orange-600/10 to-amber-600/10 border-orange-300/40', iconColor: 'text-orange-600', iconBg: 'bg-orange-100' },
  'seo/sea': { icon: Globe, color: 'from-green-600/10 to-emerald-600/10 border-green-300/40', iconColor: 'text-green-600', iconBg: 'bg-green-100' },
  'business': { icon: Building2, color: 'from-emerald-600/10 to-teal-600/10 border-emerald-300/40', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100' },
  'accounting': { icon: Building2, color: 'from-emerald-600/10 to-teal-600/10 border-emerald-300/40', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100' },
  'legal': { icon: Landmark, color: 'from-violet-600/10 to-purple-600/10 border-violet-300/40', iconColor: 'text-violet-600', iconBg: 'bg-violet-100' },
  'juridique': { icon: Landmark, color: 'from-violet-600/10 to-purple-600/10 border-violet-300/40', iconColor: 'text-violet-600', iconBg: 'bg-violet-100' },
  'nettoyage': { icon: Droplets, color: 'from-cyan-600/10 to-sky-600/10 border-cyan-300/40', iconColor: 'text-cyan-600', iconBg: 'bg-cyan-100' },
  'cleaning': { icon: Droplets, color: 'from-cyan-600/10 to-sky-600/10 border-cyan-300/40', iconColor: 'text-cyan-600', iconBg: 'bg-cyan-100' },
  'photo': { icon: Camera, color: 'from-rose-600/10 to-red-600/10 border-rose-300/40', iconColor: 'text-rose-600', iconBg: 'bg-rose-100' },
  'photography': { icon: Camera, color: 'from-rose-600/10 to-red-600/10 border-rose-300/40', iconColor: 'text-rose-600', iconBg: 'bg-rose-100' },
  'video editing': { icon: Camera, color: 'from-rose-600/10 to-red-600/10 border-rose-300/40', iconColor: 'text-rose-600', iconBg: 'bg-rose-100' },
  'education': { icon: GraduationCap, color: 'from-amber-600/10 to-yellow-600/10 border-amber-300/40', iconColor: 'text-amber-600', iconBg: 'bg-amber-100' },
  'health': { icon: Heart, color: 'from-red-600/10 to-pink-600/10 border-red-300/40', iconColor: 'text-red-600', iconBg: 'bg-red-100' },
  'transport': { icon: Truck, color: 'from-slate-600/10 to-gray-600/10 border-slate-300/40', iconColor: 'text-slate-600', iconBg: 'bg-slate-200' },
  'beauty': { icon: Scissors, color: 'from-fuchsia-600/10 to-pink-600/10 border-fuchsia-300/40', iconColor: 'text-fuchsia-600', iconBg: 'bg-fuchsia-100' },
  'music': { icon: Music, color: 'from-purple-600/10 to-indigo-600/10 border-purple-300/40', iconColor: 'text-purple-600', iconBg: 'bg-purple-100' },
  'food': { icon: Utensils, color: 'from-orange-600/10 to-red-600/10 border-orange-300/40', iconColor: 'text-orange-500', iconBg: 'bg-orange-100' },
  'handyman': { icon: Hammer, color: 'from-yellow-600/10 to-amber-600/10 border-yellow-300/40', iconColor: 'text-yellow-600', iconBg: 'bg-yellow-100' },
  'agriculture': { icon: Leaf, color: 'from-green-600/10 to-lime-600/10 border-green-300/40', iconColor: 'text-green-600', iconBg: 'bg-green-100' },
  'writing': { icon: BookOpen, color: 'from-teal-600/10 to-cyan-600/10 border-teal-300/40', iconColor: 'text-teal-600', iconBg: 'bg-teal-100' },
  'copywriting': { icon: BookOpen, color: 'from-teal-600/10 to-cyan-600/10 border-teal-300/40', iconColor: 'text-teal-600', iconBg: 'bg-teal-100' },
  'pet sitting': { icon: Dog, color: 'from-amber-600/10 to-orange-600/10 border-amber-300/40', iconColor: 'text-amber-600', iconBg: 'bg-amber-100' },
  'childcare': { icon: Baby, color: 'from-pink-600/10 to-rose-600/10 border-pink-300/40', iconColor: 'text-pink-600', iconBg: 'bg-pink-100' },
  'fitness': { icon: Dumbbell, color: 'from-green-600/10 to-emerald-600/10 border-green-300/40', iconColor: 'text-green-600', iconBg: 'bg-green-100' },
  'travel': { icon: Plane, color: 'from-sky-600/10 to-blue-600/10 border-sky-300/40', iconColor: 'text-sky-600', iconBg: 'bg-sky-100' },
  'real estate': { icon: Home, color: 'from-teal-600/10 to-emerald-600/10 border-teal-300/40', iconColor: 'text-teal-600', iconBg: 'bg-teal-100' },
  'fashion': { icon: Shirt, color: 'from-pink-600/10 to-fuchsia-600/10 border-pink-300/40', iconColor: 'text-pink-600', iconBg: 'bg-pink-100' },
  'customer support': { icon: Headphones, color: 'from-blue-600/10 to-sky-600/10 border-blue-300/40', iconColor: 'text-blue-600', iconBg: 'bg-blue-100' },
}

const defaultConfig = { icon: Wrench, color: 'from-gray-600/10 to-slate-600/10 border-gray-300/40', iconColor: 'text-gray-600', iconBg: 'bg-gray-100' }

export default async function CategoriesPage() {
  let dbCategories: { name: string; slug: string; _count: { businesses: number } }[] = []

  try {
    dbCategories = await prisma.category.findMany({
      include: { _count: { select: { businesses: true } } },
      orderBy: { name: 'asc' },
    })
  } catch (e) {
    console.error('Failed to fetch categories:', e)
  }

  // If no DB categories, show a comprehensive default list
  const categories = dbCategories.length > 0 ? dbCategories : [
    { name: 'Tech & Development', slug: 'tech', _count: { businesses: 0 } },
    { name: 'Design & Graphics', slug: 'design', _count: { businesses: 0 } },
    { name: 'Digital Marketing', slug: 'marketing', _count: { businesses: 0 } },
    { name: 'Business & Consulting', slug: 'business', _count: { businesses: 0 } },
    { name: 'Legal Services', slug: 'legal', _count: { businesses: 0 } },
    { name: 'Photo & Video', slug: 'photo', _count: { businesses: 0 } },
    { name: 'Education & Tutoring', slug: 'education', _count: { businesses: 0 } },
    { name: 'Health & Wellness', slug: 'health', _count: { businesses: 0 } },
    { name: 'Transport & Logistics', slug: 'transport', _count: { businesses: 0 } },
    { name: 'Beauty & Personal Care', slug: 'beauty', _count: { businesses: 0 } },
    { name: 'Music & Performing Arts', slug: 'music', _count: { businesses: 0 } },
    { name: 'Food & Catering', slug: 'food', _count: { businesses: 0 } },
    { name: 'Cleaning Services', slug: 'cleaning', _count: { businesses: 0 } },
    { name: 'Handyman & Renovation', slug: 'handyman', _count: { businesses: 0 } },
    { name: 'Agriculture & Gardening', slug: 'agriculture', _count: { businesses: 0 } },
    { name: 'Writing & Translation', slug: 'writing', _count: { businesses: 0 } },
    { name: 'Fitness & Sports', slug: 'fitness', _count: { businesses: 0 } },
    { name: 'Childcare', slug: 'childcare', _count: { businesses: 0 } },
    { name: 'Pet Services', slug: 'pet sitting', _count: { businesses: 0 } },
    { name: 'Real Estate', slug: 'real estate', _count: { businesses: 0 } },
    { name: 'Fashion & Styling', slug: 'fashion', _count: { businesses: 0 } },
    { name: 'Travel & Tourism', slug: 'travel', _count: { businesses: 0 } },
    { name: 'Customer Support', slug: 'customer support', _count: { businesses: 0 } },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-4">Browse all categories</h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Whatever your profession — if it&apos;s legal and ethical, you have a place on FiveZone.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const config = categoryConfig[category.slug.toLowerCase()] || categoryConfig[category.name.toLowerCase()] || defaultConfig
            const Icon = config.icon
            return (
              <Link href={`/search?category=${encodeURIComponent(category.name)}`} key={category.name}>
                <div className={`group relative p-5 md:p-6 rounded-2xl border bg-gradient-to-br ${config.color} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full`}>
                  <div className={`w-12 h-12 rounded-2xl ${config.iconBg} flex items-center justify-center mb-3 group-hover:shadow-md group-hover:scale-110 transition-all duration-300`}>
                    <Icon className={`h-6 w-6 ${config.iconColor}`} strokeWidth={1.8} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm md:text-base mb-1">{category.name}</h3>
                  <p className="text-xs text-slate-500">{category._count.businesses} freelancer{category._count.businesses !== 1 ? 's' : ''}</p>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#34E0A1] group-hover:translate-x-1 transition-all absolute top-4 right-4 opacity-0 group-hover:opacity-100" />
                </div>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-12 p-8 bg-slate-50 rounded-2xl border">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Don&apos;t see your profession?</h3>
          <p className="text-slate-500 text-sm mb-4">FiveZone is open to all legal and ethical professions. Register and choose &quot;Other&quot; to create your own category.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-[#34E0A1] text-slate-900 font-bold rounded-full hover:bg-[#2cbe89] transition-colors">
            Create your profile <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
