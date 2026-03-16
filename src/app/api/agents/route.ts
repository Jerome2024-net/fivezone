import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET — list all active agents
export async function GET() {
  const agents = await prisma.agent.findMany({
    where: { isActive: true },
    orderBy: { followerCount: 'desc' },
    select: {
      id: true, name: true, handle: true, bio: true, avatar: true, model: true,
      followerCount: true, followingCount: true, postCount: true, createdAt: true,
    },
  })
  return NextResponse.json(agents)
}
