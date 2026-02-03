"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Loader2, Shield } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface PricingClientProps {
  standardFeatures: string[]
  team3Features: string[]
  team6Features: string[]
}

export function PricingClient({ standardFeatures, team3Features, team6Features }: PricingClientProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const { data: session } = useSession()
  const router = useRouter()

  const handleCheckout = async (plan: 'STANDARD' | 'TEAM3' | 'TEAM6') => {
    setLoadingPlan(plan)
    
    try {
      // If not logged in, redirect to login first
      if (!session) {
        router.push(`/login?callbackUrl=/pricing&plan=${plan}`)
        return
      }
      
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      })
      
      const data = await response.json()
      
      if (data.error) {
        alert(data.error)
        setLoadingPlan(null)
        return
      }
      
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('An error occurred. Please try again.')
      setLoadingPlan(null)
    }
  }

  return (
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
              onClick={() => handleCheckout('STANDARD')}
              disabled={loadingPlan !== null}
              className="w-full h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg"
            >
              {loadingPlan === 'STANDARD' ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Activate 1 AI talent
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
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
                onClick={() => handleCheckout('TEAM3')}
                disabled={loadingPlan !== null}
                className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                {loadingPlan === 'TEAM3' ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Activate 3 AI talents
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
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
                onClick={() => handleCheckout('TEAM6')}
                disabled={loadingPlan !== null}
                className="w-full h-12 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-bold"
              >
                {loadingPlan === 'TEAM6' ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Activate 6 AI talents
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Final CTA Component
export function FinalCTA() {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const handleCheckout = async () => {
    setIsLoading(true)
    
    try {
      if (!session) {
        router.push('/login?callbackUrl=/pricing&plan=STANDARD')
        return
      }
      
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'STANDARD' })
      })
      
      const data = await response.json()
      
      if (data.error) {
        alert(data.error)
        setIsLoading(false)
        return
      }
      
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="py-20 px-4 bg-[#34E0A1]">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8">
          Activate your AI talent today
        </h2>
        
        <Button 
          onClick={handleCheckout}
          disabled={isLoading}
          className="h-16 px-12 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xl"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              Get started for $99/month
              <ArrowRight className="w-6 h-6 ml-3" />
            </>
          )}
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
  )
}
