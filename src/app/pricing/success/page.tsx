import { Button } from "@/components/ui/button"
import { Check, Sparkles, ArrowRight, Bot } from "lucide-react"
import Link from "next/link"
import { stripe } from "@/lib/stripe"
import { redirect } from "next/navigation"

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams
  const sessionId = params.session_id

  if (!sessionId) {
    redirect('/pricing')
  }

  let session = null
  let subscription = null
  let planName = 'Standard'
  let talentCount = 1

  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription']
    })
    
    if (session.subscription) {
      subscription = session.subscription as any
    }
    
    const plan = session.metadata?.plan || 'STANDARD'
    
    if (plan === 'TEAM3') {
      planName = 'Team 3'
      talentCount = 3
    } else if (plan === 'TEAM6') {
      planName = 'Team 6'
      talentCount = 6
    }
  } catch (error) {
    console.error('Error retrieving session:', error)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <Check className="w-12 h-12 text-emerald-600" />
            </div>
            <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium">
              <Sparkles className="w-5 h-5" />
              Subscription Activated
            </div>
          </div>

          {/* Main Content */}
          <h1 className="text-4xl font-black text-slate-900 mb-4">
            Welcome to Fivezone!
          </h1>
          
          <p className="text-xl text-slate-600 mb-8">
            Your <span className="font-bold text-emerald-600">{planName}</span> plan is now active.
            <br />
            You have access to <span className="font-bold">{talentCount} AI talent{talentCount > 1 ? 's' : ''}</span>.
          </p>

          {/* Plan Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bot className="w-8 h-8 text-violet-600" />
              <h2 className="text-xl font-bold text-slate-900">Your AI Talents</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              {['Lea ✍️', 'Marco 🌍', 'Alex 💻', 'Luna 🎨', 'Hugo 📱', 'Emma 📧']
                .slice(0, talentCount === 1 ? 6 : talentCount)
                .map((talent, i) => (
                  <div key={i} className={`py-2 px-3 rounded-lg text-sm font-medium ${
                    i < talentCount 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {talent}
                  </div>
                ))
              }
            </div>
            
            <p className="text-sm text-slate-500">
              {talentCount === 1 
                ? 'You can activate any AI talent and switch anytime.' 
                : `You can use ${talentCount} AI talents simultaneously.`}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4">
            <Button 
              asChild
              className="w-full h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg"
            >
              <Link href="/search?isAIAgent=true">
                Meet Your AI Talents
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline"
              className="w-full h-12 rounded-full font-medium"
            >
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-sm text-slate-500 mt-8">
            Questions? Contact us at{' '}
            <a href="mailto:support@fivezone.io" className="text-emerald-600 hover:underline">
              support@fivezone.io
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
