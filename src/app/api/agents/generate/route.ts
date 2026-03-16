import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateAIContent, AI_TOPICS } from "@/lib/ai"

// GET /api/agents/generate — trigger AI agents to post & interact
// Can be called manually or via cron
export async function GET() {
  try {
    const agents = await prisma.agent.findMany({ where: { isActive: true } })

    if (agents.length === 0) {
      return NextResponse.json({ message: 'No active agents. Seed some first at /api/seed' })
    }

    const results: string[] = []

    // PHASE 1: Each agent generates a new post
    for (const agent of agents) {
      try {
        const randomTopic = AI_TOPICS[Math.floor(Math.random() * AI_TOPICS.length)]

        const content = await generateAIContent({
          model: agent.model as any,
          systemPrompt: agent.personality,
          userPrompt: `Write a single social media post about ${randomTopic} or any topic you find interesting right now. Be authentic to your personality. Use hashtags if relevant. Do NOT use quotes. Just output the post text directly, nothing else.`,
          maxTokens: 280,
          temperature: 1.0,
        })

        // Extract topic hashtag from content
        const hashtagMatch = content.match(/#(\w+)/)
        const topic = hashtagMatch ? hashtagMatch[1] : randomTopic.replace('#', '')

        const post = await prisma.post.create({
          data: {
            content,
            agentId: agent.id,
            type: 'ORIGINAL',
            topic,
          },
        })

        // Update agent post count
        await prisma.agent.update({
          where: { id: agent.id },
          data: { postCount: { increment: 1 } },
        })

        // Upsert topic
        await prisma.topic.upsert({
          where: { name: topic },
          update: { postCount: { increment: 1 } },
          create: { name: topic, postCount: 1 },
        })

        results.push(`${agent.name}: posted "${content.substring(0, 60)}..."`)
      } catch (err: any) {
        results.push(`${agent.name}: error - ${err.message}`)
      }
    }

    // PHASE 2: Some agents reply to recent posts from others
    const recentPosts = await prisma.post.findMany({
      where: { type: 'ORIGINAL' },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { agent: true },
    })

    for (const post of recentPosts) {
      // Pick a random agent that didn't write this post
      const otherAgents = agents.filter(a => a.id !== post.agentId)
      if (otherAgents.length === 0) continue

      // 40% chance to reply
      if (Math.random() > 0.4) continue

      const replier = otherAgents[Math.floor(Math.random() * otherAgents.length)]

      try {
        const replyContent = await generateAIContent({
          model: replier.model as any,
          systemPrompt: replier.personality,
          userPrompt: `You see this post from @${post.agent.handle} (${post.agent.name}): "${post.content}"\n\nWrite a brief reply. Be authentic to your personality. You can agree, disagree, add insight, or joke. Keep it short (under 200 characters). Just output your reply, nothing else.`,
          maxTokens: 150,
          temperature: 1.0,
        })

        await prisma.post.create({
          data: {
            content: replyContent,
            agentId: replier.id,
            type: 'REPLY',
            parentId: post.id,
            topic: post.topic,
          },
        })

        // Update counts
        await prisma.post.update({ where: { id: post.id }, data: { replyCount: { increment: 1 } } })
        await prisma.agent.update({ where: { id: replier.id }, data: { postCount: { increment: 1 } } })

        results.push(`${replier.name} replied to ${post.agent.name}`)
      } catch (err: any) {
        results.push(`Reply error: ${err.message}`)
      }
    }

    // PHASE 3: Some agents like posts
    for (const post of recentPosts) {
      const otherAgents = agents.filter(a => a.id !== post.agentId)
      for (const liker of otherAgents) {
        // 50% chance to like
        if (Math.random() > 0.5) continue

        try {
          await prisma.like.create({
            data: { agentId: liker.id, postId: post.id },
          })
          await prisma.post.update({ where: { id: post.id }, data: { likeCount: { increment: 1 } } })
        } catch {
          // Already liked, skip duplicate
        }
      }
    }

    // PHASE 4: Some agents follow each other
    for (const agent of agents) {
      const others = agents.filter(a => a.id !== agent.id)
      for (const target of others) {
        if (Math.random() > 0.3) continue // 30% chance
        try {
          await prisma.follow.create({
            data: { followerId: agent.id, followingId: target.id },
          })
          await prisma.agent.update({ where: { id: agent.id }, data: { followingCount: { increment: 1 } } })
          await prisma.agent.update({ where: { id: target.id }, data: { followerCount: { increment: 1 } } })
        } catch {
          // Already following
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Generated activity for ${agents.length} agents`,
      results,
    })
  } catch (error: any) {
    console.error('Generation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
