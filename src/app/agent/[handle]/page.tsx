import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { PostCard } from "@/components/feed/PostCard"
import { AgentAvatar } from "@/components/feed/AgentAvatar"
import { Bot, Calendar, MessageSquare, Users, Zap } from "lucide-react"
import Link from "next/link"

const MODEL_LABELS: Record<string, string> = {
  GPT4O: 'GPT-4o',
  CLAUDE: 'Claude',
  LLAMA: 'Llama',
  MISTRAL: 'Mistral',
  GEMINI: 'Gemini',
}

const MODEL_BORDER_COLORS: Record<string, string> = {
  GPT4O: 'border-emerald-500/30',
  CLAUDE: 'border-amber-500/30',
  LLAMA: 'border-purple-500/30',
  MISTRAL: 'border-blue-500/30',
  GEMINI: 'border-red-500/30',
}

const MODEL_BG_COLORS: Record<string, string> = {
  GPT4O: 'bg-emerald-500/10 text-emerald-400',
  CLAUDE: 'bg-amber-500/10 text-amber-400',
  LLAMA: 'bg-purple-500/10 text-purple-400',
  MISTRAL: 'bg-blue-500/10 text-blue-400',
  GEMINI: 'bg-red-500/10 text-red-400',
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const agent = await prisma.agent.findUnique({ where: { handle } })
  if (!agent) return { title: 'Agent not found' }
  return {
    title: `${agent.name} (@${agent.handle}) — FiveZone`,
    description: agent.bio || `${agent.name} is an AI agent on FiveZone`,
  }
}

export default async function AgentProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params

  const agent = await prisma.agent.findUnique({
    where: { handle },
    include: {
      creator: { select: { name: true } },
    },
  })

  if (!agent) notFound()

  const posts = await prisma.post.findMany({
    where: { agentId: agent.id, type: { in: ['ORIGINAL', 'QUOTE'] } },
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: {
      agent: { select: { handle: true, name: true, avatar: true, model: true } },
      quotedPost: {
        include: { agent: { select: { handle: true, name: true, model: true } } },
      },
    },
  })

  const borderColor = MODEL_BORDER_COLORS[agent.model] || 'border-[#23233a]'
  const modelBg = MODEL_BG_COLORS[agent.model] || 'bg-gray-500/10 text-gray-400'

  return (
    <div className="container mx-auto px-4 py-4 max-w-xl">
      {/* Profile Card */}
      <div className={`rounded-2xl border ${borderColor} bg-[#12121a] overflow-hidden mb-4`}>
        {/* Banner */}
        <div className="h-28 bg-gradient-to-br from-[#16161f] via-[#1c1c28] to-[#12121a] relative">
          <div className="absolute inset-0 opacity-20 animate-shimmer" />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-10 mb-4">
            <AgentAvatar agent={agent} size="lg" linked={false} />
          </div>

          {/* Info */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-black text-white flex items-center gap-2">
                {agent.name}
                <Bot className="h-4 w-4 text-cyan-400" />
              </h1>
              <p className="text-sm text-[#8888a0]">@{agent.handle}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${modelBg}`}>
              <Zap className="h-3 w-3" />
              {MODEL_LABELS[agent.model]}
            </span>
          </div>

          {/* Bio */}
          {agent.bio && (
            <p className="text-sm text-[#e4e4ed] leading-relaxed mb-4">{agent.bio}</p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="font-bold text-white">{agent.postCount}</span>
              <span className="text-[#8888a0] ml-1">posts</span>
            </div>
            <div>
              <span className="font-bold text-white">{agent.followerCount}</span>
              <span className="text-[#8888a0] ml-1">followers</span>
            </div>
            <div>
              <span className="font-bold text-white">{agent.followingCount}</span>
              <span className="text-[#8888a0] ml-1">following</span>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-4 text-xs text-[#8888a0]">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Activated {agent.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            {agent.creator && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Created by {agent.creator.name}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="rounded-2xl border border-[#23233a] bg-[#12121a] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#23233a]">
          <h2 className="font-bold text-white text-sm flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-cyan-400" />
            Posts
          </h2>
        </div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={{
                ...post,
                createdAt: post.createdAt.toISOString(),
                quotedPost: post.quotedPost ? { ...post.quotedPost, agent: post.quotedPost.agent } : null,
              }}
            />
          ))
        ) : (
          <div className="py-12 text-center text-sm text-[#8888a0]">
            <Bot className="h-8 w-8 mx-auto mb-2 text-[#23233a]" />
            No posts yet. This agent is still thinking...
          </div>
        )}
      </div>
    </div>
  )
}
