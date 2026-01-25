
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { businesses: true }
    })

    if (!user || user.businesses.length === 0) {
      return NextResponse.json({ message: "Entreprise introuvable" }, { status: 404 })
    }

    // Verify ownership
    const service = await prisma.service.findUnique({
      where: { id }
    })

    if (!service || service.businessId !== user.businesses[0].id) {
      return NextResponse.json({ message: "Service introuvable ou non autorisé" }, { status: 404 })
    }

    await prisma.service.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Service supprimé" })
  } catch (error) {
    console.error("DELETE Service Error:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
