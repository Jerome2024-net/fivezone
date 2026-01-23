import { prisma } from "@/lib/prisma"
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

    // CHECK EXISTING USER IN PRISMA
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        return NextResponse.json(
            { user: null, message: "Un utilisateur avec cet email existe déjà" },
            { status: 409 }
        )
    }

    const hashedPassword = await hash(password, 10);
    
    // Create User and Business in Transaction
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            businesses: {
                create: {
                   name: businessName || `${name}'s Business`,
                   category: {
                       connectOrCreate: {
                           where: { slug: category || 'other' }, // Make sure category exists or defaults
                           create: { 
                               name: category || 'Autre',
                               slug: category || 'other'
                           }
                       }
                   },
                   address: address || "Non renseignée",
                   city: city || "Non renseignée",
                   phone: phone,
                   website: website,
                   imageUrl: logoUrl, // Use logo as main image
                   description: "Bienvenue sur notre profil !"
                   // Add media if schema supports it, otherwise ignored
                }
            }
        },
        include: {
            businesses: true
        }
    });

    return NextResponse.json({ 
        user: { 
            name: newUser.name, 
            email: newUser.email,
            businessId: newUser.businesses[0]?.id
        }, 
        message: "Compte créé avec succès" 
    }, { status: 201 })
    
  } catch(error) {
      console.error("Registration Error:", error);
      return NextResponse.json(
        { user: null, message: "Une erreur est survenue lors de l'inscription" },
        { status: 500 }
      )
  }
}
        const usersRef = ref(database, 'users');
        const q = query(usersRef, orderByChild('email'), equalTo(email));
        const snapshot = await get(q);
        if (snapshot.exists()) {
             return NextResponse.json({ user: null, message: "Un utilisateur avec cet email existe déjà" }, { status: 409 })
        }
    } catch (e) {
        // Continue if check fails, we will try to write anyway
        console.warn("Firebase duplication check failed", e);
    }

    const hashedPassword = await hash(password, 10)
    
    // SAVE TO FIREBASE ONLY
    try {
        const usersRef = ref(database, 'users');
        const newUserRef = push(usersRef);
        
        const userData = {
            email,
            name,
            password: hashedPassword, 
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
            source: 'firebase-primary'
        };

        await set(newUserRef, userData);
        console.log("User saved to Firebase (Primary)");
        
        return NextResponse.json({ 
            user: { name, email, role: 'OWNER' }, 
            message: "Inscription réussie (Firebase)" 
        }, { status: 201 });

    } catch (firebaseError: any) {
        console.error("Firebase registration failed:", firebaseError);
        const errorMessage = firebaseError?.message || firebaseError?.code || "Unknown Firebase Error";
        return NextResponse.json({ message: `Erreur interne: ${errorMessage}` }, { status: 500 })
    }

    // PRISMA DISABLED - END OF FUNCTION REACHED NATURALLY IF FIREBASE FAILS BUT WE RETURNED ABOVE
    return NextResponse.json({ message: "Service indisponible (Firebase Fail)" }, { status: 500 })

    /* PRISMA CODE REMOVED TEMPORARILY */
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: error.message || "Une erreur est survenue" }, { status: 500 })
  }
}
