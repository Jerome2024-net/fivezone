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
      title: "Développez votre chiffre d'affaires",
      description: "0% de commission. Chaque euro gagné reste dans votre poche."
    },
    {
      icon: Users,
      title: "Attirez les bons clients",
      description: "Visibilité prioritaire + badge Expert pour être choisi en premier."
    },
    {
      icon: Clock,
      title: "Gagnez 5h par semaine",
      description: "Espace de travail intégré : projets, factures, temps, clients."
    },
  ];

  const featureCategories = [
    {
      title: "🚀 Visibilité & Acquisition",
      features: [
        "Mise en avant en tête des recherches",
        "Apparition sur la page d'accueil locale",
        "Badge 'Expert Recommandé' sur votre profil",
        "Messagerie intégrée avec les clients",
        "Photos & Vidéos illimitées",
      ]
    },
    {
      title: "📊 Performance & Revenus",
      features: [
        "0% de commission sur toutes vos missions",
        "Statistiques détaillées (Vues, Clics, Conversions)",
        "Rapport de performance mensuel automatique",
        "Publication d'offres promotionnelles",
      ]
    },
    {
      title: "🛠️ Espace de Travail Pro",
      features: [
        "Gestion de projets avec suivi budgétaire",
        "CRM clients intégré",
        "Time tracking & chronomètre",
        "Facturation avec génération PDF",
        "Calendrier & gestion des deadlines",
        "To-do list par projet",
      ]
    },
    {
      title: "⭐ Support Premium",
      features: [
        "Support prioritaire par chat",
        "Gestion avancée des avis clients",
        "Accompagnement personnalisé",
      ]
    }
  ];

  const testimonials = [
    { name: "Marie L.", role: "Graphiste", text: "J'ai doublé mon CA en 6 mois grâce à la visibilité Pro." },
    { name: "Thomas R.", role: "Développeur", text: "L'espace de travail m'a fait gagner un temps fou sur la facturation." },
    { name: "Sophie D.", role: "Consultante", text: "Les 0% de commission, c'est vraiment game changer." },
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
              <h2 className="text-xl font-bold text-green-100 mb-1">Inscription réussie !</h2>
              <p className="text-green-200/80 text-sm">
                Activez le plan Pro pour rendre votre profil visible et commencer à recevoir des missions.
              </p>
            </div>
          )}

          <div className="inline-flex items-center gap-2 bg-[#34E0A1]/20 text-[#34E0A1] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Offre de lancement - Prix bloqué à vie
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Développez votre activité.
            <br />
            <span className="text-[#34E0A1]">Sans limite.</span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Fivezone Pro combine visibilité maximale, zéro commission et outils de productivité 
            pour transformer votre activité freelance.
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
            <p className="text-slate-400 text-sm mb-6">Soit moins de 8,25€/mois • Satisfait ou remboursé 30 jours</p>
            
            <Button 
              asChild
              className="w-full h-14 rounded-full bg-[#34E0A1] hover:bg-[#2bc88d] text-slate-900 font-bold text-lg"
            >
              <Link href={`https://buy.stripe.com/3cI7sM2N16wme5P8nO6kg01${email ? `?prefilled_email=${encodeURIComponent(email)}` : ''}`} target="_blank">
                Activer Fivezone Pro
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" /> Paiement sécurisé
              </span>
              <span>•</span>
              <span>Annulation à tout moment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-black text-center text-slate-900 mb-12">
            Ce que Pro change pour vous
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
            Tout ce qui est inclus
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Une plateforme complète pour gérer et développer votre activité freelance
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
            Ils ont choisi Pro
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
            Prêt à passer au niveau supérieur ?
          </h2>
          <p className="text-slate-300 mb-8 text-lg">
            Rejoignez les freelances qui ont choisi de développer leur activité avec les bons outils.
          </p>
          <Button 
            asChild
            className="h-14 px-10 rounded-full bg-[#34E0A1] hover:bg-[#2bc88d] text-slate-900 font-bold text-lg"
          >
            <Link href={`https://buy.stripe.com/3cI7sM2N16wme5P8nO6kg01${email ? `?prefilled_email=${encodeURIComponent(email)}` : ''}`} target="_blank">
              Activer Fivezone Pro - 99€/an
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <p className="text-slate-400 text-sm mt-4">
            Satisfait ou remboursé pendant 30 jours
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-black text-center text-slate-900 mb-12">
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Puis-je tester avant de m'engager ?",
                a: "Oui ! Vous avez 30 jours pour tester. Si vous n'êtes pas satisfait, nous vous remboursons intégralement, sans question."
              },
              {
                q: "Y a-t-il vraiment 0% de commission ?",
                a: "Absolument. Contrairement aux autres plateformes qui prennent 10-20% sur chaque mission, vous gardez 100% de ce que vous facturez."
              },
              {
                q: "L'espace de travail est-il vraiment inclus ?",
                a: "Oui, projets, clients, facturation, time tracking et calendrier sont inclus dans l'abonnement Pro. Pas de frais supplémentaires."
              },
              {
                q: "Puis-je annuler à tout moment ?",
                a: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. Votre accès reste actif jusqu'à la fin de la période payée."
              },
              {
                q: "Comment fonctionne la visibilité prioritaire ?",
                a: "Votre profil apparaît en premier dans les résultats de recherche de votre catégorie et de votre zone géographique, avec un badge 'Expert Recommandé'."
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
