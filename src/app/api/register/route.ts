import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"
import { z } from "zod"
import { sendMetaEvent } from "@/lib/meta"
import { headers } from "next/headers"

const registrationSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().min(1, "L'email est requis").email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  businessName: z.string().optional(),
  category: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional().or(z.literal("")),
  // New verification fields
  siret: z.string().optional().or(z.literal("")),
  linkedinUrl: z.string().optional().or(z.literal("")),
  
  logoUrl: z.string().optional(),
  media: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional()
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name, businessName, category, country, address, city, phone, website, siret, linkedinUrl, logoUrl, media, latitude, longitude } = registrationSchema.parse(body)

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
                   country: country || "France",
                   phone: phone,
                   website: website,
                   // Verification data
                   siret: siret,
                   linkedinUrl: linkedinUrl,
                   verificationStatus: "PENDING", // Explicitly set to PENDING

                   imageUrl: logoUrl, // Use logo as main image
                   latitude: latitude,
                   longitude: longitude,
                   description: "Bienvenue sur notre profil !",
                   media: media && media.length > 0 ? {
                       create: media.map(url => ({
                           url,
                           type: "IMAGE"
                       }))
                   } : undefined
                }
            }
        },
        include: {
            businesses: true
        }
    });

    // Send Meta CAPI Event
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    // IP is tougher in Next.js edge/serverless, often x-forwarded-for
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1';

    await sendMetaEvent({
        eventName: 'CompleteRegistration',
        eventSourceUrl: req.url,
        userData: {
            em: newUser.email,
            client_user_agent: userAgent,
            client_ip_address: ip.split(',')[0] // Take first IP if list
        },
        customData: {
            currency: 'EUR',
            value: 0, // Free registration
            content_name: 'Business Registration',
            status: 'completed'
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
