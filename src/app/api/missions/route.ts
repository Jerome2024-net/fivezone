import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { sendMissionNotificationEmail } from "@/lib/email"

// Schema for creating a mission request (NO LOGIN REQUIRED)
const createMissionSchema = z.object({
    title: z.string().min(2, "Le titre est trop court"),
    description: z.string().min(5, "La description est trop courte"),
    budget: z.number().optional(),
    currency: z.string().default('EUR'), 
    budgetType: z.enum(['FIXED', 'HOURLY', 'DAILY', 'TO_DISCUSS']).optional(),
    deadline: z.string().optional(), // ISO date string
    duration: z.string().optional(),
    businessId: z.string().min(1, "ID du freelance requis"),
    freelanceId: z.string().min(1, "ID du freelance requis"),
    // Client info (for guest users)
    clientName: z.string().min(2, "Votre nom est requis"),
    clientEmail: z.string().email("Email invalide"),
    clientPhone: z.string().optional(),
    clientCompany: z.string().optional(),
})

// POST: Create a new mission request (NO LOGIN REQUIRED)
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const validatedData = createMissionSchema.parse(body)

        // Check if user is logged in (optional)
        const session = await getServerSession(authOptions)
        let clientId: string | null = null

        if (session?.user?.email) {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email }
            })
            clientId = user?.id || null
        }

        // Create mission request
        const mission = await prisma.missionRequest.create({
            data: {
                title: validatedData.title,
                description: validatedData.description,
                budget: validatedData.budget,
                currency: validatedData.currency,
                budgetType: validatedData.budgetType || 'TO_DISCUSS',
                deadline: validatedData.deadline ? new Date(validatedData.deadline) : null,
                duration: validatedData.duration,
                // Client info (always required for contact)
                clientName: validatedData.clientName,
                clientEmail: validatedData.clientEmail,
                clientPhone: validatedData.clientPhone,
                clientCompany: validatedData.clientCompany,
                // Optional user link
                clientId: clientId,
                freelanceId: validatedData.freelanceId,
                businessId: validatedData.businessId,
                status: 'PENDING'
            },
            include: {
                business: true,
                freelance: { select: { name: true, email: true } }
            }
        })

        // Send email notification to freelance (async, don't block response)
        if (mission.freelance?.email) {
            sendMissionNotificationEmail({
                freelanceEmail: mission.freelance.email,
                freelanceName: mission.freelance.name || 'Freelance',
                clientName: validatedData.clientName,
                clientEmail: validatedData.clientEmail,
                clientPhone: validatedData.clientPhone,
                clientCompany: validatedData.clientCompany,
                projectTitle: validatedData.title,
                projectDescription: validatedData.description,
                budget: validatedData.budget,
                budgetType: validatedData.budgetType,
                deadline: validatedData.deadline ? new Date(validatedData.deadline) : null,
                duration: validatedData.duration,
                businessId: validatedData.businessId
            }).catch(err => console.error('Failed to send notification email:', err))
        }

        return NextResponse.json({ 
            message: "Demande envoyée avec succès ! Le freelance vous contactera bientôt.", 
            mission 
        }, { status: 201 })

    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMsg = error.errors.map(e => e.message).join(', ');
            return NextResponse.json({ message: `Données invalides : ${errorMsg}`, errors: error.errors }, { status: 400 })
        }
        console.error("Create Mission Error:", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}

// GET: Get missions (sent or received based on query param)
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const type = searchParams.get('type') || 'received' // 'received' for freelancer, 'sent' for client
        const status = searchParams.get('status') // Optional filter by status

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ message: "Utilisateur introuvable" }, { status: 404 })
        }

        const whereClause: any = type === 'sent' 
            ? { clientId: user.id }
            : { freelanceId: user.id }

        if (status) {
            whereClause.status = status
        }

        const missions = await prisma.missionRequest.findMany({
            where: whereClause,
            include: {
                client: { select: { id: true, name: true, email: true } },
                freelance: { select: { id: true, name: true, email: true } },
                business: { select: { id: true, name: true, imageUrl: true } }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ missions })

    } catch (error) {
        console.error("Get Missions Error:", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}
