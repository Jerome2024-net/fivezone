import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET: Fetch messages for a specific mission
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }
        
        const { id } = await params;

        // Verify user is part of the mission
        const mission = await prisma.missionRequest.findUnique({
            where: { id },
             include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                    include: { sender: { select: { id: true, name: true } } }
                }
            }
        })

        if (!mission) {
             return NextResponse.json({ message: "Mission not found" }, { status: 404 })
        }

        // Check permission (must be client or freelancer)
        const user = await prisma.user.findUnique({ where: { email: session.user.email } })
        
        if (mission.clientId !== user?.id && mission.freelanceId !== user?.id) {
             return NextResponse.json({ message: "Forbidden" }, { status: 403 })
        }

        return NextResponse.json({ messages: mission.messages })

    } catch (error) {
        console.error("Get Messages Error:", error)
        return NextResponse.json({ message: "Server error" }, { status: 500 })
    }
}

// POST: Send a new message
export async function POST(
    req: Request,
     { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params;
        const body = await req.json()
        const { content } = body

        if (!content || typeof content !== 'string') {
            return NextResponse.json({ message: "Content is required" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } })
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 })

        // Verify mission and membership
        const mission = await prisma.missionRequest.findUnique({ where: { id } })
        if (!mission) return NextResponse.json({ message: "Mission not found" }, { status: 404 })

        if (mission.clientId !== user.id && mission.freelanceId !== user.id) {
             return NextResponse.json({ message: "Forbidden" }, { status: 403 })
        }

        // Create message
        const message = await prisma.message.create({
            data: {
                content,
                missionId: id,
                senderId: user.id
            },
            include: {
                sender: { select: { id: true, name: true } }
            }
        })

        return NextResponse.json({ message })

    } catch (error) {
        console.error("Post Message Error:", error)
        return NextResponse.json({ message: "Server error" }, { status: 500 })
    }
}
