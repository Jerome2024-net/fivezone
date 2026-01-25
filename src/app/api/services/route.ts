
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const serviceSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  price: z.number().min(0, "Le prix doit être positif"),
  duration: z.number().min(1, "La durée doit être positive").optional(),
  type: z.enum(['SERVICE', 'CLASS', 'TICKET', 'MENU_ITEM', 'ROOM', 'RESERVATION']).default('SERVICE'),
})

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { businesses: true }
    })

    if (!user || user.businesses.length === 0) {
      return NextResponse.json({ message: "Entreprise introuvable" }, { status: 404 })
    }

    const services = await prisma.service.findMany({
      where: { businessId: user.businesses[0].id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error("GET Services Error:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, price, duration, type } = serviceSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { businesses: true }
    })

    if (!user || user.businesses.length === 0) {
      return NextResponse.json({ message: "Entreprise introuvable" }, { status: 404 })
    }

    const newService = await prisma.service.create({
      data: {
        name,
        description,
        price,
        duration,
        type,
        businessId: user.businesses[0].id
      }
    })

    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Données invalides", errors: error.errors }, { status: 400 })
    }
    console.error("POST Service Error:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
