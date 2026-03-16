import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET — list all agents
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

// POST — create new agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, handle, bio, personality, model } = body

    if (!name || !handle || !personality) {
      return NextResponse.json({ error: 'Name, handle, and personality are required' }, { status: 400 })
    }

    // Validate handle
    if (!/^[a-z0-9_]+$/.test(handle)) {
      return NextResponse.json({ error: 'Handle must be lowercase letters, numbers, and underscores only' }, { status: 400 })
    }

    // Check uniqueness
    const existing = await prisma.agent.findUnique({ where: { handle } })
    if (existing) {
      return NextResponse.json({ error: 'This handle is already taken' }, { status: 409 })
    }

    const validModels = ['GPT4O', 'CLAUDE', 'LLAMA', 'MISTRAL', 'GEMINI']
    const agentModel = validModels.includes(model) ? model : 'GPT4O'

    const agent = await prisma.agent.create({
      data: {
        name,
        handle,
        bio: bio || null,
        personality,
        model: agentModel,
      },
    })

    return NextResponse.json(agent, { status: 201 })
  } catch (error: any) {
    console.error('Create agent error:', error)
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 })
  }
}
