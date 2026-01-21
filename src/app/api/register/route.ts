import { prisma } from "@/lib/prisma"
import { database } from "@/lib/firebase"
import { ref, set, push } from "firebase/database"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"
import { z } from "zod"

const registrationSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().min(1, "L'email est requis").email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  businessName: z.string().optional(),
  category: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional().or(z.literal("")),
  logoUrl: z.string().optional(),
  media: z.array(z.string()).optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name, businessName, category, address, city, phone, website, logoUrl, media } = registrationSchema.parse(body)

    // CHECK PRISMA CONNECTION & EXISTING USER
    let existingUserByEmail = null;
    let prismaAvailable = true;

    try {
      existingUserByEmail = await prisma.user.findUnique({
        where: { email: email }
      })
    } catch (e: any) {
      console.warn("Prisma unavailable (Database URL missing or connection failed). Proceeding with Firebase backup.", e.message);
      prismaAvailable = false;
    }

    if (existingUserByEmail) {
      return NextResponse.json({ user: null, message: "Un utilisateur avec cet email existe déjà" }, { status: 409 })
    }

    const hashedPassword = await hash(password, 10)
    
    // BACKUP: Save to Firebase Realtime Database
    // We do this BEFORE Prisma transaction if Prisma is unavailable, or alongside it.
    // If Prisma is down, this is our ONLY storage.
    try {
        const usersRef = ref(database, 'users');
        // Check uniqueness in Firebase if Prisma is down (optional but good practice)
        // Skipping complex query for now to ensure write success.
        
        const newUserRef = push(usersRef);
        await set(newUserRef, {
            email,
            name,
            password: hashedPassword, // Store hashed password so we can potentially recover/migrate later
            role: businessName ? 'OWNER' : 'USER',
            createdAt: new Date().toISOString(),
            business: businessName ? {
                name: businessName,
                category,
                address,
                city,
                phone,
                website,
                logoUrl,
                media
            } : null,
            source: 'firebase-fallback'
        });
        console.log("User saved to Firebase");
        
        // If Prisma is unavailable, we stop here and return success
        if (!prismaAvailable) {
            return NextResponse.json({ 
                user: { name, email, role: businessName ? 'OWNER' : 'USER' }, 
                message: "Inscription réussie (Mode Sauvegarde)" 
            }, { status: 201 });
        }

    } catch (firebaseError: any) {
        console.error("Firebase backup failed:", firebaseError);
        // If BOTH fail, we have a problem. But if Prisma is available, we continue.
        if (!prismaAvailable) {
             const errorMessage = firebaseError?.message || firebaseError?.code || "Unknown Firebase Error";
             return NextResponse.json({ message: `Erreur interne (Mode Sauvegarde échoué): ${errorMessage}` }, { status: 500 })
        }
    }

    // If business details are provided, create user and business in Postgres
    if (businessName) {
        if (!category || !address || !city || !logoUrl) {
            return NextResponse.json({ message: "Informations sur l'entreprise manquantes" }, { status: 400 })
        }

        // Start a transaction to create user, category (if needed) and business
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create User
            const newUser = await tx.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                    role: 'OWNER',
                }
            })

            // 2. Find or Create Category
            let categoryRecord = await tx.category.findUnique({
                where: { slug: category }
            })

            if (!categoryRecord) {
                // Ensure unique name/slug if creating new
                const existingName = await tx.category.findUnique({ where: { name: category } });
                
                if (existingName) {
                    categoryRecord = existingName;
                } else {
                    categoryRecord = await tx.category.create({
                        data: {
                            name: category,
                            slug: category, // For simplicity using same string, normally slugify
                        }
                    })
                }
            }

            // 3. Create Business
            await tx.business.create({
                data: {
                    name: businessName,
                    categoryId: categoryRecord.id,
                    address,
                    city,
                    phone: phone || null,
                    website: website || null,
                    imageUrl: logoUrl, // Using logo as main image
                    ownerId: newUser.id,
                    media: media && media.length > 0 ? {
                        create: media.map(url => ({
                            url,
                            type: 'IMAGE'
                        })) 
                    } : undefined
                }
            })

            return newUser
        })
        
        return NextResponse.json({ user: result, message: "Compte entreprise créé avec succès" }, { status: 201 })
    } 
    
    // Default flow: Regular User Registration
    const newUser = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            role: 'USER',
        }
    })

    return NextResponse.json({ user: newUser, message: "Compte utilisateur créé avec succès" }, { status: 201 })

  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: error.message || "Une erreur est survenue" }, { status: 500 })
  }
}
