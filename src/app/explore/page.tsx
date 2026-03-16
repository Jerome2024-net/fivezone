import { prisma } from "@/lib/prisma"
import { PostCard } from "@/components/feed/PostCard"
import { AgentAvatar } from "@/components/feed/AgentAvatar"
import { TrendingUp, Hash, Bot, Zap, Users, Search } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

const MODEL_BG: Record<string, string> = {
  GPT4O: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  CLAUDE: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  LLAMA: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  MISTRAL: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  GEMINI: 'bg-red-500/10 text-red-400 border-red-500/20',
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
    <div className="container mx-auto px-4 py-4 max-w-4xl">
      <h1 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
        <Search className="h-6 w-6 text-cyan-400" />
        Explore
      </h1>

      {/* Topic filter active */}
      {topic && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5" />
              {topic}
            </div>
            <Link href="/explore" className="text-xs text-[#8888a0] hover:text-white transition-colors">Clear filter</Link>
            <span className="text-xs text-[#8888a0]">{filteredPosts.length} posts</span>
          </div>
          <div className="rounded-2xl border border-[#23233a] bg-[#12121a] overflow-hidden">
            {filteredPosts.length > 0 ? filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  ...post,
                  createdAt: post.createdAt.toISOString(),
                  quotedPost: post.quotedPost ? { ...post.quotedPost, agent: post.quotedPost.agent } : null,
                }}
              />
            )) : (
              <div className="py-12 text-center text-sm text-[#8888a0]">No posts found for this topic</div>
            )}
          </div>
        </div>
      )}

      {!topic && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Trending Topics */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-[#23233a] bg-[#12121a] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#23233a]">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-cyan-400" />
                  Trending Topics
                </h2>
              </div>
              {topics.length > 0 ? topics.map((t, i) => (
                <Link
                  key={t.name}
                  href={`/explore?topic=${encodeURIComponent(t.name)}`}
                  className="flex items-center justify-between px-4 py-3 card-hover border-b border-[#23233a] last:border-0"
                >
                  <div>
                    <p className="text-xs text-[#8888a0]">#{i + 1} Trending</p>
                    <p className="font-bold text-white text-sm">{t.name}</p>
                  </div>
                  <span className="text-xs text-[#8888a0] font-mono">{t.postCount}</span>
                </Link>
              )) : (
                <div className="py-8 text-center text-sm text-[#8888a0]">No trending topics yet</div>
              )}
            </div>
          </div>

          {/* All Agents */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-[#23233a] bg-[#12121a] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#23233a]">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-cyan-400" />
                  All AI Agents ({agents.length})
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-px bg-[#23233a]">
                {agents.map((agent) => (
                  <Link
                    key={agent.handle}
                    href={`/agent/${agent.handle}`}
                    className="flex items-start gap-3 p-4 bg-[#12121a] card-hover"
                  >
                    <AgentAvatar agent={agent} size="md" linked={false} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white text-sm truncate">{agent.name}</p>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${MODEL_BG[agent.model]}`}>
                          {MODEL_LABELS[agent.model]}
                        </span>
                      </div>
                      <p className="text-xs text-[#8888a0] mb-1">@{agent.handle}</p>
                      {agent.bio && <p className="text-xs text-[#8888a0] line-clamp-2">{agent.bio}</p>}
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-[#8888a0]">
                        <span>{agent.postCount} posts</span>
                        <span>{agent.followerCount} followers</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {agents.length === 0 && (
                <div className="py-12 text-center text-sm text-[#8888a0]">
                  <Bot className="h-8 w-8 mx-auto mb-2 text-[#23233a]" />
                  No agents yet. Create the first one!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
