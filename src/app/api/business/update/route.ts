
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
  hourlyRate: z.number().optional(), // TJM
  yearsOfExperience: z.number().optional(),
  currency: z.string().optional(),
  skills: z.union([z.string(), z.array(z.string())]).optional(),
  languages: z.union([z.string(), z.array(z.string())]).optional(),
  available: z.boolean().optional(),
  ctaAction: z.enum(['none', 'booking', 'order', 'appointment', 'contact', 'website']).optional(),
  ctaUrl: z.string().optional().or(z.literal("")),
})

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    console.log("Update session check:", session?.user?.email);
    
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Non autorisé - veuillez vous reconnecter" }, { status: 401 })
    }

    const body = await req.json()
    console.log("Update body received:", JSON.stringify(body, null, 2));
    
    const validatedData = updateSchema.parse(body)
    console.log("Validated data:", validatedData);

    // Find User & Business in Prisma
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { businesses: true }
    });

    if (!user || user.businesses.length === 0) {
        return NextResponse.json({ message: "Entreprise introuvable pour cet utilisateur" }, { status: 404 })
    }

    const businessId = user.businesses[0].id;
    console.log("Updating business ID:", businessId);

    let skillsUpdate: string[] | undefined = undefined;
    if (validatedData.skills) {
        if (typeof validatedData.skills === 'string') {
            skillsUpdate = validatedData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
        } else if (Array.isArray(validatedData.skills)) {
            skillsUpdate = validatedData.skills;
        }
    }

    let languagesUpdate: string[] | undefined = undefined;
    if (validatedData.languages) {
        if (typeof validatedData.languages === 'string') {
            languagesUpdate = validatedData.languages.split(',').map(s => s.trim()).filter(s => s.length > 0);
        } else if (Array.isArray(validatedData.languages)) {
            languagesUpdate = validatedData.languages;
        }
    }

    // Sanitize category slug (remove spaces, special chars, lowercase)
    const categorySlug = validatedData.category
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .substring(0, 50); // Limit length
    const categoryName = validatedData.category;

    console.log("Category processing:", { original: validatedData.category, slug: categorySlug });

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
            coverUrl: validatedData.coverUrl,
            hourlyRate: validatedData.hourlyRate,
            currency: validatedData.currency,
            yearsOfExperience: validatedData.yearsOfExperience,
            skills: skillsUpdate,
            languages: languagesUpdate,
            available: validatedData.available,
            ctaAction: validatedData.ctaAction,
            ctaUrl: validatedData.ctaUrl,
            category: { 
                connectOrCreate: {
                    where: { slug: categorySlug },
                    create: { name: categoryName, slug: categorySlug }
                }
            }
        }
    });

    return NextResponse.json({ message: "Mise à jour réussie" })
  } catch (error: any) {
    console.error("Update Error:", error);
    console.error("Error name:", error?.name);
    console.error("Error message:", error?.message);
    console.error("Error code:", error?.code);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Données invalides: " + error.errors.map(e => e.message).join(', '), errors: error.errors }, { status: 400 })
    }
    
    // Prisma errors
    if (error?.code === 'P2002') {
        return NextResponse.json({ message: "Conflit de données (doublon)" }, { status: 409 })
    }
    if (error?.code === 'P2025') {
        return NextResponse.json({ message: "Enregistrement non trouvé" }, { status: 404 })
    }
    
    return NextResponse.json({ message: error?.message || "Erreur serveur lors de la mise à jour" }, { status: 500 })
  }
}
