import Link from "next/link"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils, Coffee, ShoppingBag, Car, Scissors, Stethoscope, Briefcase, Wrench, Folder, Bed, Activity } from "lucide-react"
import { prisma } from "@/lib/prisma"

const iconMap: Record<string, any> = {
    "restaurants": Utensils,
    "food": Utensils,
    "cafes": Coffee,
    "shopping": ShoppingBag,
    "automotive": Car,
    "beauty": Scissors,
    "health": Stethoscope,
    "services": Briefcase,
    "home": Wrench,
    "hotels": Bed,
    "hotel": Bed,
    "activities": Activity
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
        _count: {
            select: { businesses: true }
        }
    },
    orderBy: {
        name: 'asc'
    }
  });

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
       <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight mb-4">Parcourir par catégorie</h1>
            <p className="text-muted-foreground text-lg">
                Trouvez exactement ce que vous cherchez parmi notre sélection de cuisines et catégories.
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
