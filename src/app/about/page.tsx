import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 max-w-4xl">
      <div className="space-y-12">
        <section className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">À propos de FiveZone</h1>
            <p className="text-xl text-muted-foreground">
                Connecter les entreprises aux meilleurs experts freelances depuis 2024.
            </p>
        </section>

        <section className="grid md:grid-cols-2 gap-12 items-center">
             <div className="space-y-4">
                <h2 className="text-3xl font-bold">Notre Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                    Chez FiveZone, nous croyons que trouver le bon expert ne devrait pas être un parcours du combattant.
                    Notre mission est de connecter les entreprises avec des talents freelances qualifiés,
                    de manière simple et transparente.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    Nous valorisons la compétence, la confiance et la qualité. Chaque collaboration est une réussite partagée,
                    et chaque profil est une nouvelle opportunité de croissance.
                </p>
             </div>
             <div className="bg-muted aspect-video rounded-xl flex items-center justify-center text-muted-foreground font-medium">
                Photo de notre équipe
             </div>
        </section>

        <section className="bg-muted/30 p-8 rounded-2xl text-center space-y-6">
            <h2 className="text-2xl font-bold">Pour les Freelances</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
                Vous êtes développeur, designer ou consultant ? Rejoignez FiveZone dès aujourd'hui pour trouver de nouveaux clients,
                gérer votre réputation et présenter votre portfolio.
            </p>
            <div className="flex justify-center gap-4">
                <Button asChild>
                    <Link href="/register">Créer votre profil</Link>
                </Button>
                 <Button variant="outline" asChild>
                    <Link href="/contact">Contacter le support</Link>
                </Button>
            </div>
        </section>
      </div>
    </div>
  )
}
