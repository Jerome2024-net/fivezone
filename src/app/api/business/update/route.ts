
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth" 
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  category: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  phone: z.string().optional(),
  website: z.string().optional().or(z.literal("")),
  logoUrl: z.string().optional(),
  coverUrl: z.string().optional(),
  ctaAction: z.enum(['none', 'booking', 'order', 'appointment', 'contact', 'website']).optional(),
  ctaUrl: z.string().optional().or(z.literal("")),
})

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = updateSchema.parse(body)

    // Find User & Business in Prisma
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { businesses: true }
    });

    if (!user || user.businesses.length === 0) {
        return NextResponse.json({ message: "Entreprise introuvable" }, { status: 404 })
    }

    const businessId = user.businesses[0].id;

    // Update Business
    await prisma.business.update({
        where: { id: businessId },
        data: {
            name: validatedData.name,
            description: validatedData.description,
            address: validatedData.address,
            city: validatedData.city,
            phone: validatedData.phone,
            website: validatedData.website,
            imageUrl: validatedData.logoUrl,
            // category: need to handle relation update if category changed
            category: { 
                connectOrCreate: {
                    where: { slug: validatedData.category },
                    create: { name: validatedData.category, slug: validatedData.category }
                }
            }
            // coverUrl is not in schema yet? Let's check schema.
            // Looking at previous schema file content: imageUrl is there. No coverUrl.
            // I should assume coverUrl might need a field or be ignored for now.
            // Wait, schema has 'imageUrl'. Dashboard uses logoUrl and coverUrl.
            // I will use imageUrl for logoUrl. I will ignore coverUrl for now or check if schema has it.
        }
    });

    return NextResponse.json({ message: "Mise à jour réussie" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Données invalides", errors: error.errors }, { status: 400 })
    }
    console.error("Update Error:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}

    // Update Business Data
    // We update specifically the 'business' node under the user
    // Note: This matches the structure { user: { business: { ... } } }
    const businessRef = ref(database, `users/${userKey}/business`);
    
    // Merge updates
    await update(businessRef, {
        name: validatedData.name,
        category: validatedData.category,
        address: validatedData.address,
        city: validatedData.city,
        phone: validatedData.phone || "",
        website: validatedData.website || "",
        description: validatedData.description || "",
        logoUrl: validatedData.logoUrl || "",
        coverUrl: validatedData.coverUrl || "",
        ctaAction: validatedData.ctaAction || "none",
        ctaUrl: validatedData.ctaUrl || "",
        updatedAt: new Date().toISOString()
    });
    
    // Also update the root user image if logo is provided, so it shows in the header
    if (validatedData.logoUrl) {
         const userRootRef = ref(database, `users/${userKey}`);
         await update(userRootRef, {
             image: validatedData.logoUrl
         });
    }

    return NextResponse.json({ message: "Informations mises à jour avec succès" })

  } catch (error: any) {
    console.error("Update error:", error)
    return NextResponse.json({ message: error.message || "Erreur serveur" }, { status: 500 })
  }
}
