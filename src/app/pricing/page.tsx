import { Button } from "@/components/ui/button"
import { Check, Zap, Shield, ArrowRight, Users, HelpCircle, Star, Briefcase, Eye, Crown, Gift, UserPlus, Banknote, Search as SearchIcon } from "lucide-react"
import Link from "next/link"

export default async function PricingPage() {

  const freeFeatures = [
    "Create your freelancer profile",
    "Get listed on Fivezone",
    "Receive mission requests",
    "Basic visibility in search",
    "Direct contact with clients",
    "0% commission — always",
  ];

  const proFeatures = [
    "Everything in Free",
    "Priority listing in search results",
    "Verified badge on your profile",
    "Featured on homepage",
    "Analytics & insights dashboard",
    "Priority support",
    "0% commission — always",
  ];

  const faqs = [
    {
      q: "How do clients find me?",
      a: "Clients search for freelancers by skill, location, and category. Your profile appears in results based on your subscription tier and ratings."
    },
    {
      q: "Does Fivezone take any commission?",
      a: "No. Fivezone takes 0% commission on all missions. You keep 100% of what you earn. We make money through Pro subscriptions, not by taking a cut from your work."
    },
    {
      q: "Can I cancel anytime?",
      a: "The Pro plan is billed annually. You can cancel before your renewal date and you'll keep access until the end of your billing period."
    },
    {
      q: "How do I get paid?",
      a: "Payments are held securely and released to you once the client approves the completed work. Direct payout to your bank account."
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 bg-[#34E0A1]/20 text-[#34E0A1] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Briefcase className="w-4 h-4" />
            For Independent Professionals
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Grow your freelance business
            <br />
            <span className="text-[#34E0A1]">with Fivezone</span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-4">
            Join thousands of independent professionals who find clients on Fivezone.
          </p>
          <div className="flex items-center justify-center gap-3 text-2xl font-bold text-white max-w-2xl mx-auto">
            <ArrowRight className="w-6 h-6 text-[#34E0A1] shrink-0" />
            <p>Get discovered. Get hired. Get paid.</p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 md:p-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-slate-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Free</h2>
              </div>
              
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-black text-slate-900">$0</span>
                <span className="text-slate-500 text-xl">/ forever</span>
              </div>
              <p className="text-slate-600 mb-6">Perfect for getting started. No credit card required.</p>
              
              <div className="mb-8">
                <h4 className="font-bold text-slate-900 mb-4">What's included</h4>
                <ul className="space-y-3">
                  {freeFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button 
                asChild
                variant="outline"
                className="w-full h-14 rounded-full font-bold text-lg border-2"
              >
                <Link href="/register">
                  Create Free Profile
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl border-2 border-emerald-200 p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-[#34E0A1] text-slate-900 text-xs font-bold px-3 py-1 rounded-full">
                RECOMMENDED
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-8 h-8 text-[#34E0A1]" />
                <h2 className="text-2xl font-black text-slate-900">Pro</h2>
              </div>
              
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-black text-slate-900">$99</span>
                <span className="text-slate-500 text-xl">/ year</span>
              </div>
              <p className="text-slate-600 mb-1">For freelancers serious about growing their business.</p>
              <p className="text-emerald-600 text-sm font-semibold mb-6">That&apos;s only $8.25/month</p>
              
              <div className="mb-8">
                <h4 className="font-bold text-slate-900 mb-4">What's included</h4>
                <ul className="space-y-3">
                  {proFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-emerald-100/50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-emerald-800 font-medium">
                  <Eye className="w-5 h-5 shrink-0" />
                  <p>Get 5x more visibility in search results</p>
                </div>
              </div>
              
              <Button 
                asChild
                className="w-full h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg"
              >
                <Link href="/register?plan=pro">
                  Upgrade to Pro
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-20 px-4 bg-slate-100">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Zap className="w-8 h-8 text-[#34E0A1]" />
            <h2 className="text-3xl font-black text-slate-900">How Fivezone Works</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                <UserPlus className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Create Your Profile</h3>
              <p className="text-slate-600">Showcase your skills, experience, and portfolio. Set your daily rate.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <SearchIcon className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Get Discovered</h3>
              <p className="text-slate-600">Clients search and find you based on skills, location, and availability.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
              <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-violet-100">
                <Banknote className="w-7 h-7 text-violet-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Get Paid</h3>
              <p className="text-slate-600">Complete missions, get paid securely. Build your reputation with reviews.</p>
            </div>
          </div>
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

      {/* Final CTA */}
      <div className="py-20 px-4 bg-[#34E0A1]">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8">
            Ready to grow your freelance career?
          </h2>
          
          <Button 
            asChild
            className="h-16 px-12 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xl"
          >
            <Link href="/register">
              Create your free profile
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
          </Button>
          
          <div className="flex items-center justify-center gap-4 mt-6 text-slate-700 text-sm">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" /> Free to start
            </span>
            <span>•</span>
            <span>0% commission</span>
            <span>•</span>
            <span>No credit card required</span>
          </div>
        </div>
      </div>
    </div>
  )
}
