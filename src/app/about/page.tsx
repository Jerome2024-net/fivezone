import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 max-w-4xl">
      <div className="space-y-12">
        <section className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">À propos de FiveZone</h1>
            <p className="text-xl text-muted-foreground">
                Connecter les gens avec les meilleurs commerces locaux depuis 2024.
            </p>
        </section>

        <section className="grid md:grid-cols-2 gap-12 items-center">
             <div className="space-y-4">
                <h2 className="text-3xl font-bold">Notre Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                    Chez FiveZone, nous croyons que trouver un excellent repas ou service ne devrait pas être une corvée.
                    Notre mission est d'aider les gens à découvrir des lieux uniques et merveilleux dans leur ville,
                    tout en offrant aux entreprises une plateforme pour présenter leurs offres.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    Nous valorisons l'authenticité, la communauté et la qualité. Chaque avis est une histoire partagée,
                    et chaque fiche est une nouvelle opportunité de connexion.
                </p>
             </div>
             <div className="bg-muted aspect-video rounded-xl flex items-center justify-center text-muted-foreground font-medium">
                Photo de notre équipe
             </div>
        </section>

        <section className="bg-muted/30 p-8 rounded-2xl text-center space-y-6">
            <h2 className="text-2xl font-bold">Pour les propriétaires d'entreprise</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
                Vous possédez un restaurant, un café ou un commerce local ? Rejoignez FiveZone dès aujourd'hui pour toucher plus de clients,
                gérer votre présence en ligne et recueillir des avis précieux.
            </p>
            <div className="flex justify-center gap-4">
                <Button asChild>
                    <Link href="/register">Inscrire votre entreprise</Link>
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
