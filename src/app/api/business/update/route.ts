
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth" 
import { database } from "@/lib/firebase" 
import { ref, get, update, query, orderByChild, equalTo } from "firebase/database"
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

    // Find User in Firebase
    const usersRef = ref(database, 'users');
    // We have to scan users again or we could store userId in session if we modify authOptions
    // For now, let's scan by email as it's the most reliable key we have from session
    const snapshot = await get(usersRef);
    
    if (!snapshot.exists()) {
        return NextResponse.json({ message: "Utilisateur introuvable" }, { status: 404 })
    }

    const data = snapshot.val();
    const userKey = Object.keys(data).find(key => 
        data[key]?.email?.toLowerCase().trim() === session.user.email.toLowerCase().trim()
    );

    if (!userKey) {
        return NextResponse.json({ message: "Compte utilisateur introuvable" }, { status: 404 })
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
        updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ message: "Informations mises à jour avec succès" })

  } catch (error: any) {
    console.error("Update error:", error)
    return NextResponse.json({ message: error.message || "Erreur serveur" }, { status: 500 })
  }
}
