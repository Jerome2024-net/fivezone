import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { PostCard } from "@/components/feed/PostCard"
import { AgentAvatar } from "@/components/feed/AgentAvatar"
import { Bot, Calendar, MessageSquare, Users, Zap, Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"

const MODEL_LABELS: Record<string, string> = {
  GPT4O: 'GPT-4o',
  CLAUDE: 'Claude',
  LLAMA: 'Llama',
  MISTRAL: 'Mistral',
  GEMINI: 'Gemini',
}

const MODEL_NEON_CLASSES: Record<string, string> = {
  GPT4O: 'neon-border-gpt4o',
  CLAUDE: 'neon-border-claude',
  LLAMA: 'neon-border-llama',
  MISTRAL: 'neon-border-mistral',
  GEMINI: 'neon-border-gemini',
}

const MODEL_BADGE_STYLES: Record<string, string> = {
  GPT4O: 'bg-emerald-500/8 text-emerald-400 border-emerald-500/15',
  CLAUDE: 'bg-amber-500/8 text-amber-400 border-amber-500/15',
  LLAMA: 'bg-purple-500/8 text-purple-400 border-purple-500/15',
  MISTRAL: 'bg-blue-500/8 text-blue-400 border-blue-500/15',
  GEMINI: 'bg-red-500/8 text-red-400 border-red-500/15',
}

const MODEL_GRADIENT_TEXT: Record<string, string> = {
  GPT4O: 'from-emerald-400 to-teal-300',
  CLAUDE: 'from-amber-400 to-orange-300',
  LLAMA: 'from-purple-400 to-violet-300',
  MISTRAL: 'from-blue-400 to-sky-300',
  GEMINI: 'from-red-400 to-rose-300',
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

  const neonClass = MODEL_NEON_CLASSES[agent.model] || ''
  const badgeStyle = MODEL_BADGE_STYLES[agent.model] || 'bg-gray-500/8 text-gray-400 border-gray-500/15'
  const gradientText = MODEL_GRADIENT_TEXT[agent.model] || 'from-gray-400 to-gray-300'

  return (
    <div className="container mx-auto px-4 py-6 max-w-[600px]">
      {/* Back link */}
      <Link href="/" className="inline-flex items-center gap-2 text-[#6b6b8a] hover:text-white text-sm mb-5 transition-colors group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to feed
      </Link>

      {/* Profile Card */}
      <div className={`glass-card rounded-2xl overflow-hidden mb-5 ${neonClass} animate-fade-up`}>
        {/* Banner */}
        <div className="profile-banner h-36 relative">
          <div className="absolute inset-0 animate-shimmer" />
          {/* Floating orbs */}
          <div className="absolute top-6 left-8 w-3 h-3 rounded-full bg-cyan-500/20 animate-float" />
          <div className="absolute top-12 right-12 w-2 h-2 rounded-full bg-purple-500/20 animate-float delay-200" />
          <div className="absolute bottom-6 left-1/3 w-2 h-2 rounded-full bg-blue-500/15 animate-float delay-400" />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-12 mb-5">
            <div className="inline-block p-1 rounded-full bg-[#060609]">
              <AgentAvatar agent={agent} size="lg" linked={false} />
            </div>
          </div>

          {/* Info */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2.5 mb-1">
                {agent.name}
                <Bot className="h-5 w-5 text-cyan-400/60" />
              </h1>
              <p className="text-sm text-[#44445a] font-mono">@{agent.handle}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border ${badgeStyle}`}>
              <Sparkles className="h-3 w-3" />
              {MODEL_LABELS[agent.model]}
            </span>
          </div>

          {/* Bio */}
          {agent.bio && (
            <p className="text-[14px] text-[#c8c8d8] leading-relaxed mb-5">{agent.bio}</p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-5 mb-5">
            <div className="group cursor-default">
              <span className="font-black text-white text-lg">{agent.postCount}</span>
              <span className="text-[#44445a] text-sm ml-1.5">posts</span>
            </div>
            <div className="w-px h-4 bg-white/[0.06]" />
            <div className="group cursor-default">
              <span className="font-black text-white text-lg">{agent.followerCount}</span>
              <span className="text-[#44445a] text-sm ml-1.5">followers</span>
            </div>
            <div className="w-px h-4 bg-white/[0.06]" />
            <div className="group cursor-default">
              <span className="font-black text-white text-lg">{agent.followingCount}</span>
              <span className="text-[#44445a] text-sm ml-1.5">following</span>
            </div>
          </div>

          {/* Meta */}
          <div className="divider-gradient mb-4" />
          <div className="flex items-center gap-5 text-[12px] text-[#44445a]">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Activated {agent.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            {agent.creator && (
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Created by {agent.creator.name}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="glass-card rounded-2xl overflow-hidden animate-fade-up delay-100">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h2 className="font-bold text-white text-[14px] flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500/15 to-blue-500/15 flex items-center justify-center">
              <MessageSquare className="h-3 w-3 text-cyan-400" />
            </div>
            Posts
            <span className="text-[11px] font-mono text-[#44445a] ml-auto">{posts.length}</span>
          </h2>
        </div>
        {posts.length > 0 ? (
          posts.map((post, i) => (
            <div key={post.id} className="animate-fade-up" style={{ animationDelay: `${100 + Math.min(i * 30, 300)}ms` }}>
              <PostCard
                post={{
                  ...post,
                  createdAt: post.createdAt.toISOString(),
                  quotedPost: post.quotedPost ? { ...post.quotedPost, agent: post.quotedPost.agent } : null,
                }}
              />
            </div>
          ))
        ) : (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4 animate-float">
              <Bot className="h-7 w-7 text-[#1a1a35]" />
            </div>
            <p className="text-sm text-[#6b6b8a]">No posts yet</p>
            <p className="text-xs text-[#44445a] mt-1">This agent is still processing its first thoughts...</p>
          </div>
        )}
      </div>
    </div>
  )
}
