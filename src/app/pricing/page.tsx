import { Button } from "@/components/ui/button"
import { Check, Zap, Shield, ArrowRight, Bot, Sparkles, Users, HelpCircle } from "lucide-react"
import Link from "next/link"

interface PricingPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const params = await searchParams;
  const email = typeof params.email === 'string' ? params.email : undefined;

  const standardFeatures = [
    "Access to all Fivezone AI talents",
    "1 active AI talent at a time",
    "Clear, specialized role",
    "Monthly work capacity included",
    "Concrete deliverables",
    "Context continuity (the talent remembers your business)",
    "Switch talents anytime",
    "No long-term commitment",
  ];

  const team3Features = [
    "3 AI talents active simultaneously",
    "Multi-skill collaboration (e.g. writing + design + development)",
    "Dedicated work capacity per talent",
    "Priority support",
  ];

  const team6Features = [
    "6 AI talents active in parallel",
    "Full operational coverage",
    "Priority processing",
    "Dedicated support",
  ];

  const aiTalents = [
    { name: "Lea", role: "AI Writer", emoji: "✍️" },
    { name: "Marco", role: "AI Translator", emoji: "🌍" },
    { name: "Alex", role: "AI Web Developer", emoji: "💻" },
    { name: "Luna", role: "AI Designer", emoji: "🎨" },
    { name: "Hugo", role: "AI Social Media", emoji: "📱" },
    { name: "Emma", role: "AI Email Expert", emoji: "📧" },
  ];

  const faqs = [
    {
      q: "Can I switch talents?",
      a: "Yes. You can change your active AI talent at any time, at no extra cost."
    },
    {
      q: "Is usage unlimited?",
      a: "No. Each AI talent has a clearly defined scope and monthly capacity to ensure consistent quality."
    },
    {
      q: "Is this a tool or a service?",
      a: "Neither. 👉 It's an operational AI talent that actually works for you."
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes. All plans are cancel anytime, no commitment."
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 bg-[#34E0A1]/20 text-[#34E0A1] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Simple pricing. Real work.
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Simple pricing.
            <br />
            <span className="text-[#34E0A1]">Real work. AI talents.</span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-4">
            At Fivezone, you don't pay for software.
          </p>
          <p className="text-2xl font-bold text-white max-w-2xl mx-auto">
            👉 You activate AI talents that actually work for you.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          
          {/* Standard Plan */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">🟢</span>
              <h2 className="text-3xl font-black text-slate-900">Standard</h2>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl border-2 border-emerald-200 p-8 md:p-10 max-w-2xl">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl md:text-6xl font-black text-slate-900">$99</span>
                <span className="text-slate-500 text-xl">/ month</span>
              </div>
              <p className="text-slate-600 mb-6">Best for founders, solo operators, and small teams.</p>
              
              <div className="mb-8">
                <h4 className="font-bold text-slate-900 mb-4">What's included</h4>
                <ul className="space-y-3">
                  {standardFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-emerald-100/50 rounded-xl p-4 mb-6">
                <p className="text-emerald-800 font-medium text-center">
                  👉 One AI talent = one dedicated work capacity
                </p>
              </div>
              
              <Button 
                asChild
                className="w-full h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg"
              >
                <Link href={`https://buy.stripe.com/3cI7sM2N16wme5P8nO6kg01${email ? `?prefilled_email=${encodeURIComponent(email)}` : ''}`} target="_blank">
                  Activate 1 AI talent
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Team Plans */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🔵</span>
              <h2 className="text-3xl font-black text-slate-900">Team</h2>
            </div>
            <p className="text-slate-600 text-lg mb-8 max-w-2xl">
              For teams that need multiple talents working in parallel. Built for growing teams, SMEs, and agencies that require multiple skills at the same time.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Team 3 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-200 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🔹</span>
                  <h3 className="text-xl font-bold text-slate-900">Team 3</h3>
                </div>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-black text-slate-900">$249</span>
                  <span className="text-slate-500">/ month</span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {team3Features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="bg-blue-100/50 rounded-xl p-3 mb-6">
                  <p className="text-blue-800 font-medium text-center text-sm">
                    👉 Save compared to 3 separate Standard plans
                  </p>
                </div>
                
                <Button 
                  asChild
                  className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  <Link href={`https://buy.stripe.com/team3${email ? `?prefilled_email=${encodeURIComponent(email)}` : ''}`} target="_blank">
                    Activate 3 AI talents
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>

              {/* Team 6 */}
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl border-2 border-violet-200 p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  BEST VALUE
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🔹</span>
                  <h3 className="text-xl font-bold text-slate-900">Team 6</h3>
                </div>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-black text-slate-900">$449</span>
                  <span className="text-slate-500">/ month</span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {team6Features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="bg-violet-100/50 rounded-xl p-3 mb-6">
                  <p className="text-violet-800 font-medium text-center text-sm">
                    👉 Ideal for startups, agencies, and SMEs
                  </p>
                </div>
                
                <Button 
                  asChild
                  className="w-full h-12 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-bold"
                >
                  <Link href={`https://buy.stripe.com/team6${email ? `?prefilled_email=${encodeURIComponent(email)}` : ''}`} target="_blank">
                    Activate 6 AI talents
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available AI Talents */}
      <div className="py-20 px-4 bg-slate-100">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Bot className="w-8 h-8 text-violet-600" />
            <h2 className="text-3xl font-black text-slate-900">Available AI Talents</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {aiTalents.map((talent, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 text-center hover:shadow-lg transition-shadow">
                <span className="text-4xl mb-3 block">{talent.emoji}</span>
                <h3 className="font-bold text-slate-900">{talent.name}</h3>
                <p className="text-slate-500 text-sm">{talent.role}</p>
              </div>
            ))}
          </div>
          
          <p className="text-center text-slate-500 mt-8 italic">
            (New talents are added regularly)
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center justify-center gap-3 mb-12">
            <HelpCircle className="w-8 h-8 text-slate-600" />
            <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">{faq.q}</h4>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Message */}
      <div className="py-16 px-4 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-[#34E0A1]" />
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">
            You don't pay for AI.
            <br />
            <span className="text-[#34E0A1]">You pay for work done.</span>
          </h2>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-4 bg-[#34E0A1]">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8">
            Activate your AI talent today
          </h2>
          
          <Button 
            asChild
            className="h-16 px-12 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xl"
          >
            <Link href={`https://buy.stripe.com/3cI7sM2N16wme5P8nO6kg01${email ? `?prefilled_email=${encodeURIComponent(email)}` : ''}`} target="_blank">
              Get started for $99/month
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
          </Button>
          
          <div className="flex items-center justify-center gap-4 mt-6 text-slate-700 text-sm">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" /> Cancel anytime
            </span>
            <span>•</span>
            <span>No commitment</span>
          </div>
        </div>
      </div>
    </div>
  )
}
