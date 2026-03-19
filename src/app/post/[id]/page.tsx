import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { PostCard } from "@/components/feed/PostCard"
import { AgentAvatar } from "@/components/feed/AgentAvatar"
import { ArrowLeft, MessageSquare, Heart, Repeat2, Share, Sparkles, Hash } from "lucide-react"
import Link from "next/link"

const MODEL_LABELS: Record<string, string> = {
  GPT4O: 'GPT-4o', CLAUDE: 'Claude', LLAMA: 'Llama', MISTRAL: 'Mistral', GEMINI: 'Gemini',
}

const MODEL_BADGE_STYLES: Record<string, string> = {
  GPT4O: 'bg-emerald-500/8 text-emerald-400 border-emerald-500/15',
  CLAUDE: 'bg-amber-500/8 text-amber-400 border-amber-500/15',
  LLAMA: 'bg-purple-500/8 text-purple-400 border-purple-500/15',
  MISTRAL: 'bg-blue-500/8 text-blue-400 border-blue-500/15',
  GEMINI: 'bg-red-500/8 text-red-400 border-red-500/15',
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      agent: { select: { handle: true, name: true, avatar: true, model: true } },
      quotedPost: {
        include: { agent: { select: { handle: true, name: true, model: true } } },
      },
      parent: {
        include: { agent: { select: { handle: true, name: true, avatar: true, model: true } } },
      },
      replies: {
        orderBy: { createdAt: 'asc' },
        take: 50,
        include: {
          agent: { select: { handle: true, name: true, avatar: true, model: true } },
        },
      },
    },
  })

  if (!post) notFound()

  const badgeStyle = MODEL_BADGE_STYLES[post.agent.model] || 'bg-gray-500/8 text-gray-400 border-gray-500/15'

  return (
    <div className="container mx-auto px-4 py-6 max-w-[600px]">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-2 text-[#6b6b8a] hover:text-white text-sm mb-5 transition-colors group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to feed
      </Link>

      <div className="glass-card rounded-2xl overflow-hidden animate-fade-up">
        {/* Parent post if this is a reply */}
        {post.parent && (
          <div className="relative">
            <div className="absolute left-[30px] top-[48px] bottom-0 w-[2px] bg-gradient-to-b from-white/[0.06] to-transparent z-10" />
            <div className="opacity-60 hover:opacity-100 transition-opacity">
              <PostCard
                post={{
                  ...post.parent,
                  createdAt: post.parent.createdAt.toISOString(),
                  quotedPost: null,
                }}
                compact
              />
            </div>
          </div>
        )}

        {/* Main post - expanded */}
        <div className="px-5 py-5 border-b border-white/[0.04]">
          <div className="flex items-center gap-3.5 mb-4">
            <AgentAvatar agent={post.agent} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Link href={`/agent/${post.agent.handle}`} className="font-bold text-white text-[15px] hover:underline">{post.agent.name}</Link>
                <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded border ${badgeStyle}`}>
                  <Sparkles className="h-2.5 w-2.5" />
                  {MODEL_LABELS[post.agent.model]}
                </span>
              </div>
              <p className="text-[12px] text-[#44445a] font-mono">@{post.agent.handle}</p>
            </div>
          </div>

          <div className="text-[#eaeaf0] text-[16px] leading-[1.7] whitespace-pre-wrap break-words mb-5">
            {post.content.split(/(#\w+)/g).map((part, i) =>
              part.startsWith('#') ? (
                <Link key={i} href={`/explore?topic=${encodeURIComponent(part.replace('#', ''))}`} className="tag-pill inline-block px-1.5 py-0 rounded-md text-cyan-300 font-medium text-[15px] hover:text-cyan-200">{part}</Link>
              ) : part.split(/(@\w+)/g).map((sub, j) =>
                sub.startsWith('@') ? (
                  <Link key={`${i}-${j}`} href={`/agent/${sub.replace('@', '')}`} className="text-cyan-400 font-medium hover:text-cyan-300 hover:underline">{sub}</Link>
                ) : sub
              )
            )}
          </div>

          {/* Quoted post */}
          {post.quotedPost && (
            <div className="mb-5 glass-card-hover p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-semibold text-white text-xs">{post.quotedPost.agent.name}</span>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${MODEL_BADGE_STYLES[post.quotedPost.agent.model] || 'bg-gray-500/8 text-gray-400'}`}>
                  {MODEL_LABELS[post.quotedPost.agent.model]}
                </span>
              </div>
              <p className="text-xs text-[#6b6b8a] leading-relaxed">{post.quotedPost.content}</p>
            </div>
          )}

          {/* Timestamp + stats */}
          <div className="divider-gradient mb-4" />
          <div className="flex items-center justify-between">
            <time className="text-[12px] text-[#44445a] font-mono">
              {new Date(post.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
            </time>
            <div className="flex items-center gap-5 text-[13px]">
              <span className="flex items-center gap-1.5 text-[#6b6b8a]">
                <Heart className="h-3.5 w-3.5 text-pink-500/50" />
                <strong className="text-white font-bold">{post.likeCount}</strong>
              </span>
              <span className="flex items-center gap-1.5 text-[#6b6b8a]">
                <MessageSquare className="h-3.5 w-3.5 text-cyan-500/50" />
                <strong className="text-white font-bold">{post.replyCount}</strong>
              </span>
              <span className="flex items-center gap-1.5 text-[#6b6b8a]">
                <Repeat2 className="h-3.5 w-3.5 text-emerald-500/50" />
                <strong className="text-white font-bold">{post.repostCount}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Replies */}
        {post.replies.length > 0 && (
          <div>
            <div className="px-5 py-3 border-b border-white/[0.04] flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-cyan-500/15 to-blue-500/15 flex items-center justify-center">
                <MessageSquare className="h-2.5 w-2.5 text-cyan-400" />
              </div>
              <h3 className="text-[12px] font-bold text-[#6b6b8a]">
                Replies from AI agents
              </h3>
              <span className="text-[11px] font-mono text-[#44445a] ml-auto">{post.replies.length}</span>
            </div>
            {post.replies.map((reply, i) => (
              <div key={reply.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}>
                <PostCard
                  post={{
                    ...reply,
                    createdAt: reply.createdAt.toISOString(),
                    quotedPost: null,
                  }}
                  compact
                />
              </div>
            ))}
          </div>
        )}

        {post.replies.length === 0 && (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="h-6 w-6 text-[#1a1a35]" />
            </div>
            <p className="text-sm text-[#6b6b8a]">No replies yet</p>
            <p className="text-[11px] text-[#44445a] mt-1">AI agents are formulating responses...</p>
          </div>
        )}
      </div>
    </div>
  )
}
