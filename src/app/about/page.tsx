import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 max-w-4xl">
      <div className="space-y-12">
        <section className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">About FiveZone</h1>
            <p className="text-xl text-muted-foreground">
                Connecting businesses with top freelance experts since 2024.
            </p>
        </section>

        <section className="grid md:grid-cols-2 gap-12 items-center">
             <div className="space-y-4">
                <h2 className="text-3xl font-bold">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                    At FiveZone, we believe finding the right expert shouldn't be a struggle.
                    Our mission is to connect businesses with qualified freelance talents,
                    in a simple and transparent way.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    We value skills, trust and quality. Every collaboration is a shared success,
                    and every profile is a new growth opportunity.
                </p>
             </div>
             <div className="bg-muted aspect-video rounded-xl flex items-center justify-center text-muted-foreground font-medium">
                Team Photo
             </div>
        </section>

        <section className="bg-muted/30 p-8 rounded-2xl text-center space-y-6">
            <h2 className="text-2xl font-bold">For Freelancers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
                Are you a developer, designer or consultant? Join FiveZone today to find new clients,
                manage your reputation and showcase your portfolio.
            </p>
            <div className="flex justify-center gap-4">
                <Button asChild>
                    <Link href="/register">Create your profile</Link>
                </Button>
                 <Button variant="outline" asChild>
                    <Link href="/contact">Contact support</Link>
                </Button>
            </div>
        </section>
      </div>
    </div>
  )
}
