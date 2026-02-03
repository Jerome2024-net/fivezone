import { Button } from "@/components/ui/button"
import { Check, Zap, Shield, ArrowRight, Bot, Sparkles, Users, HelpCircle } from "lucide-react"
import Link from "next/link"
import { PricingClient, FinalCTA } from "./PricingClient"

interface PricingPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const params = await searchParams;
  const canceled = params.canceled === 'true';

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
      {/* Canceled Banner */}
      {canceled && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-3 text-center">
          <p className="text-amber-800 font-medium">
            Payment was canceled. Feel free to try again when you're ready!
          </p>
        </div>
      )}

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

      {/* Pricing Cards - Client Component for interactivity */}
      <PricingClient 
        standardFeatures={standardFeatures}
        team3Features={team3Features}
        team6Features={team6Features}
      />

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

      {/* Final CTA - Uses client component */}
      <FinalCTA />
    </div>
  )
}