import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { sendMissionResponseEmail } from "@/lib/email"

// Schema for responding to a mission
const respondMissionSchema = z.object({
    action: z.enum(['view', 'proposal', 'accept', 'reject', 'cancel', 'start', 'complete', 'deliver']),
    freelanceMessage: z.string().optional(),
    proposedPrice: z.number().optional(),
    proposedDeadline: z.string().optional(),
})

// GET: Get a single mission by ID
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ message: "Utilisateur introuvable" }, { status: 404 })
        }

        const mission = await prisma.missionRequest.findUnique({
            where: { id },
            include: {
                client: { select: { id: true, name: true, email: true } },
                freelance: { select: { id: true, name: true, email: true } },
                business: { select: { id: true, name: true, imageUrl: true, hourlyRate: true, currency: true } }
            }
        })

        if (!mission) {
            return NextResponse.json({ message: "Mission introuvable" }, { status: 404 })
        }

        // Check if user is authorized to view this mission
        if (mission.clientId !== user.id && mission.freelanceId !== user.id) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
        }

        // Mark as viewed if freelance is viewing for the first time
        if (mission.freelanceId === user.id && mission.status === 'PENDING') {
            await prisma.missionRequest.update({
                where: { id },
                data: { status: 'VIEWED' }
            })
            mission.status = 'VIEWED'
        }

        return NextResponse.json({ mission })

    } catch (error) {
        console.error("Get Mission Error:", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}

// PUT: Update mission status / respond to mission
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = respondMissionSchema.parse(body)

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ message: "Utilisateur introuvable" }, { status: 404 })
        }

        const mission = await prisma.missionRequest.findUnique({
            where: { id }
        })

        if (!mission) {
            return NextResponse.json({ message: "Mission introuvable" }, { status: 404 })
        }

        // Verify authorization based on action
        const isClient = mission.clientId === user.id
        const isFreelance = mission.freelanceId === user.id

        if (!isClient && !isFreelance) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
        }

        let updateData: any = {}
        let newStatus = mission.status

        switch (validatedData.action) {
            case 'view':
                // Only freelance can mark as viewed
                if (!isFreelance) {
                    return NextResponse.json({ message: "Action non autorisée" }, { status: 403 })
                }
                newStatus = 'VIEWED'
                break

            case 'proposal':
                // Only freelance can send proposal
                if (!isFreelance) {
                    return NextResponse.json({ message: "Action non autorisée" }, { status: 403 })
                }
                newStatus = 'PROPOSAL'
                updateData = {
                    freelanceMessage: validatedData.freelanceMessage,
                    proposedPrice: validatedData.proposedPrice,
                    proposedDeadline: validatedData.proposedDeadline ? new Date(validatedData.proposedDeadline) : null,
                    respondedAt: new Date()
                }
                break

            case 'accept':
                // Client accepts freelance proposal
                if (!isClient) {
                    return NextResponse.json({ message: "Action non autorisée" }, { status: 403 })
                }
                if (mission.status !== 'PROPOSAL') {
                    return NextResponse.json({ message: "Aucune proposition à accepter" }, { status: 400 })
                }
                newStatus = 'ACCEPTED'
                break

            case 'reject':
                // Freelance rejects the mission
                if (!isFreelance) {
                    return NextResponse.json({ message: "Action non autorisée" }, { status: 403 })
                }
                newStatus = 'REJECTED'
                updateData = {
                    freelanceMessage: validatedData.freelanceMessage,
                    respondedAt: new Date()
                }
                break

            case 'cancel':
                // Client cancels the request
                if (!isClient) {
                    return NextResponse.json({ message: "Action non autorisée" }, { status: 403 })
                }
                newStatus = 'CANCELLED'
                break

            case 'start':
                // Either party can mark as started after acceptance
                if (mission.status !== 'ACCEPTED') {
                    return NextResponse.json({ message: "La mission doit d'abord être acceptée" }, { status: 400 })
                }
                newStatus = 'IN_PROGRESS'
                break

            case 'deliver':
                // Only freelance can mark as delivered
                if (!isFreelance) {
                    return NextResponse.json({ message: "Action non autorisée" }, { status: 403 })
                }
                if (mission.status !== 'IN_PROGRESS') {
                    return NextResponse.json({ message: "La mission doit être en cours" }, { status: 400 })
                }
                newStatus = 'DELIVERED'
                break

            case 'complete':
                // Either party can mark as completed
                if (mission.status !== 'IN_PROGRESS') {
                    return NextResponse.json({ message: "La mission doit être en cours" }, { status: 400 })
                }
                newStatus = 'COMPLETED'
                break

            default:
                return NextResponse.json({ message: "Action invalide" }, { status: 400 })
        }

        const updatedMission = await prisma.missionRequest.update({
            where: { id },
            data: {
                status: newStatus,
                ...updateData
            },
            include: {
                client: { select: { id: true, name: true, email: true } },
                freelance: { select: { id: true, name: true, email: true } },
                business: { select: { id: true, name: true, imageUrl: true } }
            }
        })

        // Send email notification to client when freelance responds
        const shouldNotifyClient = ['PROPOSAL', 'REJECTED'].includes(newStatus) && isFreelance
        if (shouldNotifyClient && updatedMission.clientEmail) {
            sendMissionResponseEmail({
                clientEmail: updatedMission.clientEmail,
                clientName: updatedMission.clientName,
                freelanceName: updatedMission.freelance?.name || 'Freelance',
                projectTitle: updatedMission.title,
                status: newStatus as 'PROPOSAL' | 'ACCEPTED' | 'REJECTED',
                proposedPrice: updatedMission.proposedPrice,
                proposedDeadline: updatedMission.proposedDeadline,
                freelanceMessage: updatedMission.freelanceMessage,
                businessId: updatedMission.businessId
            }).catch(err => console.error('Failed to send response email:', err))
        }

        return NextResponse.json({ 
            message: "Mission mise à jour",
            mission: updatedMission
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: "Données invalides", errors: error.errors }, { status: 400 })
        }
        console.error("Update Mission Error:", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}
