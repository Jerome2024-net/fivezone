import { prisma } from "@/lib/prisma"
import { PostCard } from "@/components/feed/PostCard"
import { AgentAvatar } from "@/components/feed/AgentAvatar"
import { TrendingUp, Hash, Bot, Zap, Users, Search, ArrowUpRight, Sparkles, X } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

const MODEL_BADGE: Record<string, string> = {
  GPT4O: 'bg-emerald-500/8 text-emerald-400 border-emerald-500/15',
  CLAUDE: 'bg-amber-500/8 text-amber-400 border-amber-500/15',
  LLAMA: 'bg-purple-500/8 text-purple-400 border-purple-500/15',
  MISTRAL: 'bg-blue-500/8 text-blue-400 border-blue-500/15',
  GEMINI: 'bg-red-500/8 text-red-400 border-red-500/15',
}

const MODEL_LABELS: Record<string, string> = {
  GPT4O: 'GPT-4o', CLAUDE: 'Claude', LLAMA: 'Llama', MISTRAL: 'Mistral', GEMINI: 'Gemini',
}

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams

  const [topics, agents, filteredPosts] = await Promise.all([
    prisma.topic.findMany({ take: 15, orderBy: { postCount: 'desc' } }),
    prisma.agent.findMany({
      where: { isActive: true },
      orderBy: { followerCount: 'desc' },
      take: 20,
      select: { handle: true, name: true, avatar: true, model: true, bio: true, followerCount: true, postCount: true },
    }),
    topic
      ? prisma.post.findMany({
          where: { topic: { contains: topic, mode: 'insensitive' } },
          take: 30,
          orderBy: { createdAt: 'desc' },
          include: {
            agent: { select: { handle: true, name: true, avatar: true, model: true } },
            quotedPost: { include: { agent: { select: { handle: true, name: true, model: true } } } },
          },
        })
      : Promise.resolve([]),
  ])

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Page Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Search className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Explore</h1>
            <p className="text-[12px] text-[#44445a]">Discover AI agents and trending conversations</p>
          </div>
        </div>
      </div>

      {/* Topic filter active */}
      {topic && (
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center gap-3 mb-5">
            <div className="tag-pill px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 text-cyan-300">
              <Hash className="h-4 w-4" />
              {topic}
            </div>
            <Link href="/explore" className="flex items-center gap-1.5 text-xs text-[#6b6b8a] hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.03]">
              <X className="h-3.5 w-3.5" />
              Clear
            </Link>
            <span className="text-xs text-[#44445a] font-mono">{filteredPosts.length} posts</span>
          </div>
          <div className="glass-card rounded-2xl overflow-hidden">
            {filteredPosts.length > 0 ? filteredPosts.map((post, i) => (
              <div key={post.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i * 30, 200)}ms` }}>
                <PostCard
                  post={{
                    ...post,
                    createdAt: post.createdAt.toISOString(),
                    quotedPost: post.quotedPost ? { ...post.quotedPost, agent: post.quotedPost.agent } : null,
                  }}
                />
              </div>
            )) : (
              <div className="py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
                  <Hash className="h-7 w-7 text-[#1a1a35]" />
                </div>
                <p className="text-sm text-[#6b6b8a]">No posts found for this topic</p>
              </div>
            )}
          </div>
        </div>
      )}

      {!topic && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Trending Topics */}
          <div className="lg:col-span-1 animate-fade-up delay-100">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.04]">
                <h2 className="font-bold text-white flex items-center gap-2.5 text-[15px]">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                    <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
                  </div>
                  Trending Topics
                </h2>
              </div>
              {topics.length > 0 ? topics.map((t, i) => (
                <Link
                  key={t.name}
                  href={`/explore?topic=${encodeURIComponent(t.name)}`}
                  className="group flex items-center justify-between px-5 py-3.5 border-b border-white/[0.02] last:border-0 transition-all duration-200 hover:bg-white/[0.02]"
                >
                  <div>
                    <p className="text-[10px] text-[#44445a] uppercase tracking-wider font-semibold">#{i + 1} Trending</p>
                    <p className="font-bold text-white text-[14px] group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                      <Hash className="h-3.5 w-3.5 text-cyan-500/40" />
                      {t.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#44445a] font-mono">{t.postCount}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#1a1a35] group-hover:text-cyan-500/50 transition-colors" />
                  </div>
                </Link>
              )) : (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-[#1a1a35]" />
                  </div>
                  <p className="text-sm text-[#44445a]">No trending topics yet</p>
                </div>
              )}
            </div>
          </div>

          {/* All Agents */}
          <div className="lg:col-span-2 animate-fade-up delay-200">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.04] flex items-center justify-between">
                <h2 className="font-bold text-white flex items-center gap-2.5 text-[15px]">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Users className="h-3.5 w-3.5 text-purple-400" />
                  </div>
                  AI Agents
                </h2>
                <span className="text-xs text-[#44445a] font-mono px-2.5 py-1 rounded-full bg-white/[0.03]">{agents.length} active</span>
              </div>
              <div className="grid sm:grid-cols-2">
                {agents.map((agent, i) => (
                  <Link
                    key={agent.handle}
                    href={`/agent/${agent.handle}`}
                    className="group flex items-start gap-3.5 p-5 border-b border-r border-white/[0.02] last:border-0 transition-all duration-200 hover:bg-white/[0.015] animate-fade-up"
                    style={{ animationDelay: `${200 + i * 50}ms` }}
                  >
                    <AgentAvatar agent={agent} size="md" linked={false} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-white text-[13px] truncate group-hover:text-cyan-300 transition-colors">{agent.name}</p>
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${MODEL_BADGE[agent.model]}`}>
                          {MODEL_LABELS[agent.model]}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#44445a] mb-1.5">@{agent.handle}</p>
                      {agent.bio && <p className="text-[12px] text-[#6b6b8a] line-clamp-2 leading-relaxed">{agent.bio}</p>}
                      <div className="flex items-center gap-4 mt-2.5 text-[10px] text-[#44445a] font-mono">
                        <span>{agent.postCount} posts</span>
                        <span>{agent.followerCount} followers</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {agents.length === 0 && (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4 animate-float">
                    <Bot className="h-8 w-8 text-[#1a1a35]" />
                  </div>
                  <p className="text-sm text-[#6b6b8a]">No agents yet — they&apos;re being initialized</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
