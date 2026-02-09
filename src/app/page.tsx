import { Button } from "@/components/ui/button"
import { SearchSection } from "@/components/home/SearchSection"
import { BusinessCard } from "@/components/home/BusinessCard"
import { ArrowRight, Shield, Zap, Users, Star, CheckCircle2, TrendingUp, Globe, Monitor, Pen, BarChart3, Building2, Droplets, Landmark, Search, Send, Rocket, FolderSearch } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export const revalidate = 300

export default async function Home() {
  let featuredBusinesses: any[] = [];
  let totalFreelancers = 0;
  let totalCategories = 0;

  try {
    const [businesses, freelancerCount, categoryCount] = await Promise.all([
      prisma.business.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          media: { take: 3, select: { url: true } }
        }
      }),
      prisma.business.count(),
      prisma.category.count(),
    ]);

    totalFreelancers = freelancerCount;
    totalCategories = categoryCount;

    featuredBusinesses = businesses.map(b => ({
      id: b.id,
      name: b.name,
      category: { name: b.category.name },
      subscriptionTier: b.subscriptionTier,
      viewCount: b.viewCount,
      rating: b.rating,
      reviewCount: b.reviewCount,
      imageUrl: b.coverUrl || b.imageUrl || undefined,
      images: [b.coverUrl, b.imageUrl, ...b.media.map(m => m.url)].filter(Boolean) as string[],
      hourlyRate: b.hourlyRate || undefined,
      currency: b.currency || 'EUR',
      city: b.city
    }));
  } catch (error: any) {
    console.error("Prisma fetch error:", error);
  }

  const categories = [
    { label: 'Development', Icon: Monitor, desc: 'Web, Mobile, Backend', link: '/search?category=Tech', color: 'from-blue-600/10 to-indigo-600/10 border-blue-300/40', iconColor: 'text-blue-600', iconBg: 'bg-blue-100' },
    { label: 'Design', Icon: Pen, desc: 'UI/UX, Logo, Branding', link: '/search?category=Design', color: 'from-pink-600/10 to-rose-600/10 border-pink-300/40', iconColor: 'text-pink-600', iconBg: 'bg-pink-100' },
    { label: 'Marketing', Icon: BarChart3, desc: 'SEO, Ads, Content', link: '/search?category=Marketing', color: 'from-orange-600/10 to-amber-600/10 border-orange-300/40', iconColor: 'text-orange-600', iconBg: 'bg-orange-100' },
    { label: 'Business', Icon: Building2, desc: 'Finance, Strategy, Consulting', link: '/search?category=Business', color: 'from-emerald-600/10 to-teal-600/10 border-emerald-300/40', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100' },
    { label: 'Cleaning', Icon: Droplets, desc: 'Office, Residential', link: '/search?category=Nettoyage', color: 'from-cyan-600/10 to-sky-600/10 border-cyan-300/40', iconColor: 'text-cyan-600', iconBg: 'bg-cyan-100' },
    { label: 'Legal', Icon: Landmark, desc: 'Lawyers, Notaries', link: '/search?category=Juridique', color: 'from-violet-600/10 to-purple-600/10 border-violet-300/40', iconColor: 'text-violet-600', iconBg: 'bg-violet-100' },
  ]

  const howItWorks = [
    { step: '01', title: 'Search', desc: 'Tell us what you need. Browse experts by skill, location, or budget.', Icon: Search, iconColor: 'text-blue-500 bg-blue-50' },
    { step: '02', title: 'Connect', desc: 'Send a mission request directly to the freelancer of your choice.', Icon: Send, iconColor: 'text-emerald-500 bg-emerald-50' },
    { step: '03', title: 'Get it done', desc: 'Work together with secure payments and direct messaging.', Icon: Rocket, iconColor: 'text-violet-500 bg-violet-50' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans">

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#34E0A1]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200/50 rounded-full text-sm font-medium text-emerald-700 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {totalFreelancers > 0 ? `${totalFreelancers}+ freelancers available` : 'Platform live'}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.08] mb-6">
              Find the expert
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34E0A1] to-[#10b981]">
                your project needs.
              </span>
            </h1>

            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect with skilled professionals — designers, developers, marketers, lawyers — ready to help your business grow.
            </p>

            <div className="w-full max-w-3xl mx-auto mb-6">
              <SearchSection />
            </div>

            <p className="text-sm text-slate-400 mt-4">
              <span className="font-semibold text-slate-500">Popular:</span>{' '}
              <Link href="/search?q=developer" className="hover:text-[#34E0A1] transition-colors">Web Developer</Link>
              {' · '}
              <Link href="/search?q=designer" className="hover:text-[#34E0A1] transition-colors">Graphic Designer</Link>
              {' · '}
              <Link href="/search?q=marketing" className="hover:text-[#34E0A1] transition-colors">Marketing</Link>
              {' · '}
              <Link href="/search?q=lawyer" className="hover:text-[#34E0A1] transition-colors">Lawyer</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ TRUST BADGES ═══════════ */}
      <section className="w-full border-y border-slate-100 bg-slate-50/50">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Shield, label: 'Secure payments', sub: 'Stripe escrow' },
              { icon: Zap, label: 'Fast matching', sub: 'Under 24h response' },
              { icon: Users, label: `${totalFreelancers || '50'}+ experts`, sub: 'Verified profiles' },
              { icon: Globe, label: `${totalCategories || '6'} categories`, sub: 'All industries' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <item.icon className="h-5 w-5 text-[#34E0A1]" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CATEGORIES ═══════════ */}
      <section className="w-full py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 mb-3">
              Browse by category
            </h2>
            <p className="text-slate-500 text-base md:text-lg max-w-lg mx-auto">
              Whatever you need, we have the right expert for you.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {categories.map((cat, idx) => (
              <Link
                href={cat.link}
                key={idx}
                className={`group relative p-5 md:p-6 rounded-2xl border bg-gradient-to-br ${cat.color} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${cat.iconBg} flex items-center justify-center mb-3 group-hover:shadow-md group-hover:scale-110 transition-all duration-300`}>
                  <cat.Icon className={`h-6 w-6 md:h-7 md:w-7 ${cat.iconColor}`} strokeWidth={1.8} />
                </div>
                <h3 className="font-bold text-slate-900 text-sm md:text-base mb-1">{cat.label}</h3>
                <p className="text-xs text-slate-500">{cat.desc}</p>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#34E0A1] group-hover:translate-x-1 transition-all absolute top-4 right-4 opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURED EXPERTS ═══════════ */}
      <section className="w-full py-16 md:py-20 bg-slate-50/50">
        <div className="container px-4 mx-auto">
          <div className="flex items-end justify-between mb-8 md:mb-10">
            <div>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 mb-2">
                Featured Experts
              </h2>
              <p className="text-slate-500 text-base md:text-lg">Top-rated freelancers recommended by the community.</p>
            </div>
            <Link
              href="/search"
              className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#34E0A1] transition-colors group"
            >
              View all
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {featuredBusinesses.length > 0 ? (
            <div className="flex -mx-4 px-4 pb-4 md:mx-0 md:px-0 md:pb-0 overflow-x-auto md:overflow-visible md:grid md:grid-cols-4 gap-4 md:gap-6 scrollbar-hide snap-x snap-mandatory">
              {featuredBusinesses.map((business) => (
                <div key={business.id} className="min-w-[280px] md:min-w-0 snap-center">
                  <BusinessCard
                    id={business.id}
                    name={business.name}
                    category={business.category.name}
                    promoted={business.subscriptionTier === 'PRO'}
                    imageUrl={business.imageUrl}
                    images={business.images}
                    rating={business.rating}
                    reviewCount={business.reviewCount}
                    hourlyRate={business.hourlyRate}
                    currency={business.currency}
                    city={business.city}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4">
                <FolderSearch className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium text-lg mb-2">No experts yet</p>
              <p className="text-slate-400 text-sm mb-6">Be the first to join the platform!</p>
              <Button asChild className="rounded-full bg-[#34E0A1] text-slate-900 font-bold hover:bg-[#2cbe89]">
                <Link href="/register">Create your profile</Link>
              </Button>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link href="/search" className="inline-flex items-center gap-2 text-sm font-bold text-[#34E0A1]">
              View all experts <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="w-full py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 mb-3">
              How it works
            </h2>
            <p className="text-slate-500 text-base md:text-lg max-w-lg mx-auto">
              Find and hire a freelancer in 3 simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-10 max-w-4xl mx-auto">
            {howItWorks.map((item, i) => (
              <div key={i} className="relative text-center md:text-left group">
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-slate-200" />
                )}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-slate-200 mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 ${item.iconColor}`}>
                  <item.Icon className="h-7 w-7" />
                </div>
                <div className="text-xs font-bold text-[#34E0A1] uppercase tracking-widest mb-2">Step {item.step}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SOCIAL PROOF ═══════════ */}
      <section className="w-full py-16 md:py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-8 text-white/90">
              &ldquo;FiveZone helped me find a developer in under 48 hours. The process was smooth, the payment was secure, and the quality was exceptional. I&apos;ll definitely use it again.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-full bg-slate-700 flex items-center justify-center text-lg font-bold">
                AK
              </div>
              <div className="text-left">
                <p className="font-bold text-white">Amina K.</p>
                <p className="text-sm text-slate-400">CEO, TechStart Abidjan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ ADVANTAGES ═══════════ */}
      <section className="w-full py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
                Why clients choose FiveZone
              </h2>
              <div className="space-y-5">
                {[
                  { title: 'Verified professionals', desc: 'Every freelancer goes through a verification process.' },
                  { title: 'Secure escrow payments', desc: 'Your payment is held securely until the work is delivered.' },
                  { title: 'Direct messaging', desc: 'Communicate directly with freelancers — no middleman.' },
                  { title: 'Fast & reliable', desc: 'Find the right expert and get your project done in record time.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle2 className="h-6 w-6 text-[#34E0A1] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 md:p-10 border border-emerald-100">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 rounded-xl bg-[#34E0A1]/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-[#34E0A1]" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-900">98%</p>
                      <p className="text-xs text-slate-500">Satisfaction rate</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-900">&lt; 24h</p>
                      <p className="text-xs text-slate-500">Average response time</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-violet-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-900">100%</p>
                      <p className="text-xs text-slate-500">Secure transactions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
              Ready to get started?
            </h2>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
              Whether you&apos;re looking for an expert or offering your services, FiveZone is the place to be.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="h-14 px-10 text-lg font-bold rounded-full bg-[#34E0A1] hover:bg-[#2cbe89] text-slate-900 shadow-lg shadow-[#34E0A1]/20 hover:shadow-xl transition-all hover:scale-105"
                asChild
              >
                <Link href="/search">Find a freelancer</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 text-lg font-bold rounded-full border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all"
                asChild
              >
                <Link href="/register">Become a freelancer</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
