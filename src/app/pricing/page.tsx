import { Button } from "@/components/ui/button"
import { Check, CheckCircle2, TrendingUp, Users, Clock, FileText, Zap, Shield, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

interface PricingPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const params = await searchParams;
  const isRegistered = params.registered === 'true';
  const email = typeof params.email === 'string' ? params.email : undefined;

  const benefits = [
    {
      icon: TrendingUp,
      title: "Grow your revenue",
      description: "0% commission. Every dollar you earn stays in your pocket."
    },
    {
      icon: Users,
      title: "Attract the right clients",
      description: "Priority visibility + Expert badge to be chosen first."
    },
    {
      icon: Clock,
      title: "Save 5 hours per week",
      description: "Built-in workspace: projects, invoices, time tracking, clients."
    },
  ];

  const featureCategories = [
    {
      title: "🚀 Visibility & Acquisition",
      features: [
        "Featured at the top of search results",
        "Appear on local homepage",
        "'Recommended Expert' badge on your profile",
        "Built-in messaging with clients",
        "Unlimited photos & videos",
      ]
    },
    {
      title: "📊 Performance & Revenue",
      features: [
        "0% commission on all your projects",
        "Detailed statistics (Views, Clicks, Conversions)",
        "Automatic monthly performance report",
        "Post promotional offers",
      ]
    },
    {
      title: "🛠️ Pro Workspace",
      features: [
        "Project management with budget tracking",
        "Built-in client CRM",
        "Time tracking & timer",
        "Invoicing with PDF generation",
        "Calendar & deadline management",
        "To-do list per project",
      ]
    },
    {
      title: "⭐ Premium Support",
      features: [
        "Priority chat support",
        "Advanced review management",
        "Personalized guidance",
      ]
    }
  ];

  const testimonials = [
    { name: "Marie L.", role: "Graphic Designer", text: "I doubled my revenue in 6 months thanks to Pro visibility." },
    { name: "Thomas R.", role: "Developer", text: "The workspace saved me so much time on invoicing." },
    { name: "Sophie D.", role: "Consultant", text: "0% commission is really a game changer." },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          {isRegistered && (
            <div className="mb-8 bg-green-500/20 border border-green-400/30 rounded-xl p-6 max-w-2xl mx-auto backdrop-blur animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="flex justify-center mb-3">
                <div className="bg-green-400/20 p-2 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-green-100 mb-1">Registration successful!</h2>
              <p className="text-green-200/80 text-sm">
                Activate the Pro plan to make your profile visible and start receiving projects.
              </p>
            </div>
          )}

          <div className="inline-flex items-center gap-2 bg-[#34E0A1]/20 text-[#34E0A1] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Launch offer - Price locked for life
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Grow your business.
            <br />
            <span className="text-[#34E0A1]">Without limits.</span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Fivezone Pro combines maximum visibility, zero commission and productivity tools 
            to transform your freelance business.
          </p>

          {/* Price Card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-5 h-5 text-[#34E0A1] fill-[#34E0A1]" />
              <span className="font-bold text-[#34E0A1]">FIVEZONE PRO</span>
              <Star className="w-5 h-5 text-[#34E0A1] fill-[#34E0A1]" />
            </div>
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-6xl font-black">99€</span>
              <span className="text-slate-400 text-lg">/an</span>
            </div>
            <p className="text-slate-400 text-sm mb-6">Less than $8.25/month • 30-day money-back guarantee</p>
            
            <Button 
              asChild
              className="w-full h-14 rounded-full bg-[#34E0A1] hover:bg-[#2bc88d] text-slate-900 font-bold text-lg"
            >
              <Link href={`https://buy.stripe.com/3cI7sM2N16wme5P8nO6kg01${email ? `?prefilled_email=${encodeURIComponent(email)}` : ''}`} target="_blank">
                Activate Fivezone Pro
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" /> Secure payment
              </span>
              <span>•</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-black text-center text-slate-900 mb-12">
            What Pro changes for you
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-[#34E0A1]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-[#34E0A1]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-black text-center text-slate-900 mb-4">
            Everything included
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            A complete platform to manage and grow your freelance business
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {featureCategories.map((category, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">{category.title}</h3>
                <ul className="space-y-3">
                  {category.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#34E0A1] shrink-0 mt-0.5" />
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-black text-center text-slate-900 mb-12">
            They chose Pro
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-4 italic">&quot;{t.text}&quot;</p>
                <div>
                  <p className="font-bold text-slate-900">{t.name}</p>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
            Ready to level up?
          </h2>
          <p className="text-slate-300 mb-8 text-lg">
            Join freelancers who chose to grow their business with the right tools.
          </p>
          <Button 
            asChild
            className="h-14 px-10 rounded-full bg-[#34E0A1] hover:bg-[#2bc88d] text-slate-900 font-bold text-lg"
          >
            <Link href={`https://buy.stripe.com/3cI7sM2N16wme5P8nO6kg01${email ? `?prefilled_email=${encodeURIComponent(email)}` : ''}`} target="_blank">
              Activate Fivezone Pro - $99/year
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <p className="text-slate-400 text-sm mt-4">
            30-day money-back guarantee
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-black text-center text-slate-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I try before committing?",
                a: "Yes! You have 30 days to test. If you're not satisfied, we'll refund you fully, no questions asked."
              },
              {
                q: "Is there really 0% commission?",
                a: "Absolutely. Unlike other platforms that take 10-20% on each project, you keep 100% of what you bill."
              },
              {
                q: "Is the workspace really included?",
                a: "Yes, projects, clients, invoicing, time tracking and calendar are all included in the Pro subscription. No extra fees."
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes, you can cancel your subscription anytime from your dashboard. Your access remains active until the end of the paid period."
              },
              {
                q: "How does priority visibility work?",
                a: "Your profile appears first in search results for your category and geographic area, with a 'Recommended Expert' badge."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">{faq.q}</h4>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
