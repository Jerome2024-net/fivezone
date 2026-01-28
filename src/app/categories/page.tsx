import Link from "next/link"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Palette, Megaphone, Briefcase, Camera, PenTool, Folder, Monitor } from "lucide-react"


export const dynamic = 'force-dynamic'

const iconMap: Record<string, any> = {
    "tech": Code,
    "design": Palette,
    "marketing": Megaphone,
    "business": Briefcase,
    "photo": Camera,
    "writing": PenTool,
    "development": Monitor
};

const categories = [
    { name: 'Tech & Développement', slug: 'tech', _count: { businesses: 120 } },
    { name: 'Design & Graphisme', slug: 'design', _count: { businesses: 45 } },
    { name: 'Marketing Digital', slug: 'marketing', _count: { businesses: 80 } },
    { name: 'Business & Conseil', slug: 'business', _count: { businesses: 60 } },
    { name: 'Rédaction & Contenu', slug: 'writing', _count: { businesses: 30 } },
    { name: 'Photo & Vidéo', slug: 'photo', _count: { businesses: 25 } },
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
       <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight mb-4">Parcourir par domaine d'expertise</h1>
            <p className="text-muted-foreground text-lg">
                Trouvez le talent qu'il vous faut parmi nos catégories de freelances.
            </p>
       </div>

       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
                const Icon = iconMap[category.slug] || Folder;
                return (
                    <Link href={`/search?category=${category.name}`} key={category.name}>
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full border-2 hover:border-primary/50">
                            <CardHeader className="flex flex-col items-center justify-center text-center p-6 bg-transparent">
                                <div className="p-4 bg-primary/5 rounded-full mb-4 text-primary">
                                    <Icon className="h-8 w-8" />
                                </div>
                                <CardTitle className="mb-2 text-xl">{category.name}</CardTitle>
                                <span className="text-sm text-muted-foreground">{category._count.businesses} fiches</span>
                            </CardHeader>
                        </Card>
                    </Link>
                )
            })}
       </div>
    </div>
  )
}
