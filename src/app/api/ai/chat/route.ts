import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateAIResponse } from "@/lib/openai"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId, message, conversationId } = body
    
    if (!agentId || !message) {
      return NextResponse.json(
        { error: "agentId et message sont requis" },
        { status: 400 }
      )
    }
    
    // Get the AI agent
    const agent = await prisma.business.findUnique({
      where: { id: agentId },
      select: {
        id: true,
        name: true,
        isAIAgent: true,
        aiAgentType: true,
        aiSystemPrompt: true,
        aiPricePerTask: true,
      }
    })
    
    if (!agent || !agent.isAIAgent) {
      return NextResponse.json(
        { error: "Agent IA non trouvé" },
        { status: 404 }
      )
    }
    
    // Get conversation history if exists
    let conversationHistory: { role: 'user' | 'assistant', content: string }[] = []
    let conversation = null
    
    if (conversationId) {
      conversation = await prisma.aIConversation.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 20 // Limit history for context window
          }
        }
      })
      
      if (conversation) {
        conversationHistory = conversation.messages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }))
      }
    }
    
    // Generate AI response
    const startTime = Date.now()
    const result = await generateAIResponse(
      agent.aiAgentType || 'ASSISTANT',
      agent.aiSystemPrompt,
      message,
      conversationHistory
    )
    const responseTime = Date.now() - startTime
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Erreur lors de la génération" },
        { status: 500 }
      )
    }
    
    // Get current user session (optional for guest mode)
    const session = await getServerSession(authOptions)
    
    // Create or update conversation
    if (!conversation) {
      conversation = await prisma.aIConversation.create({
        data: {
          agentId: agent.id,
          userId: session?.user?.id || null,
          title: message.substring(0, 100),
          messages: {
            create: [
              { role: 'user', content: message },
              { role: 'assistant', content: result.response! }
            ]
          }
        },
        include: { messages: true }
      })
    } else {
      // Add new messages to existing conversation
      await prisma.aIMessage.createMany({
        data: [
          { conversationId: conversation.id, role: 'user', content: message },
          { conversationId: conversation.id, role: 'assistant', content: result.response! }
        ]
      })
    }
    
    return NextResponse.json({
      success: true,
      response: result.response,
      conversationId: conversation.id,
      agentName: agent.name,
      responseTimeMs: responseTime
    })
    
  } catch (error: any) {
    console.error('AI Chat Error:', error)
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    )
  }
}

// Get conversation history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    
    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId requis" },
        { status: 400 }
      )
    }
    
    const conversation = await prisma.aIConversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        },
        agent: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            aiAgentType: true
          }
        }
      }
    })
    
    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation non trouvée" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ conversation })
    
  } catch (error: any) {
    console.error('Get Conversation Error:', error)
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    )
  }
}
