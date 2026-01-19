import { Button } from "@/components/ui/button"
import { Check, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface PricingPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const params = await searchParams;
  const isRegistered = params.registered === 'true';

  const plans = [
    {
      name: "Gratuit",
      price: "0€",
      period: "/mois",
      description: "L'essentiel pour être présent sur FiveZone.",
      features: [
        "Fiche établissement de base",
        "Jusqu'à 3 photos",
        "Répondre aux avis",
        "Support par email"
      ],
      cta: isRegistered ? "Continuer avec le plan Gratuit" : "Commencer gratuitement",
      popular: false,
      href: isRegistered ? "/login" : "/register"
    },
    {
      name: "Pro",
      price: "29€",
      period: "/mois",
      description: "Boostez votre visibilité et multipliez vos clients.",
      features: [
        "Mise en avant prioritaire (Top recherches)",
        "Apparition sur la page d’accueil locale",
        "Badge 'Établissement Recommandé'",
        "Bouton WhatsApp / Appel en un clic",
        "Photos & Vidéos illimitées",
        "Publication d'offres & Promotions",
        "Statistiques détaillées (Vues, Clics, Leads)",
        "Rapport de performance mensuel",
        "Gestion avancée des avis",
        "Support client prioritaire"
      ],
      cta: "Activer le plan Pro",
      popular: true,
      href: "/register",
      external: false
    },
    {
      name: "Entreprise",
      price: "Sur devis",
      period: "",
      description: "Solutions personnalisées pour les chaînes.",
      features: [
        "Gestion multi-établissements",
        "API dédiée",
        "Account Manager dédié",
        "Facturation centralisée"
      ],
      cta: "Contacter les ventes",
      popular: false,
      href: "/contact"
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          
          {isRegistered && (
              <div className="mb-12 bg-green-50 border border-green-200 rounded-xl p-6 text-center max-w-2xl mx-auto shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
                  <div className="flex justify-center mb-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                      </div>
                  </div>
                  <h2 className="text-2xl font-bold text-green-800 mb-2">Inscription réussie !</h2>
                  <p className="text-green-700">
                      Votre compte a été créé. Pour profiter pleinement de la plateforme et attirer vos premiers clients, 
                      choisissez la formule qui vous correspond.
                  </p>
              </div>
          )}

          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Des tarifs simples et transparents
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choisissez le plan qui correspond le mieux à votre établissement et commencez à attirer plus de clients dès aujourd'hui.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.name} 
                className={`relative bg-white rounded-2xl shadow-sm border ${
                  plan.popular ? 'border-[#34E0A1] ring-2 ring-[#34E0A1]/20' : 'border-slate-200'
                } p-8 flex flex-col`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#34E0A1] text-slate-900 px-4 py-1 rounded-full text-sm font-bold shadow-sm">
                    Recommandé
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-500 text-sm mb-6">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                    <span className="text-slate-500 font-medium">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-[#34E0A1] shrink-0" />
                      <span className="text-slate-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  asChild
                  className={`w-full rounded-full font-bold h-12 text-base ${
                    plan.popular 
                      ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                >
                  <Link href={plan.href} target={plan.href.startsWith('http') ? "_blank" : undefined}>
                    {plan.cta}
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Questions fréquentes</h3>
            <div className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto mt-8">
               <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-lg mb-2">Puis-je changer de plan plus tard ?</h4>
                    <p className="text-slate-600">Oui, vous pouvez passer au plan Pro ou revenir au plan Gratuit à tout moment depuis votre tableau de bord.</p>
               </div>
               <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-lg mb-2">Y a-t-il des frais cachés ?</h4>
                    <p className="text-slate-600">Non, nos tarifs sont transparents. Le prix affiché est le prix que vous payez.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
