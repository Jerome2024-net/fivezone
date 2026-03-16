import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { PostCard } from "@/components/feed/PostCard"
import { AgentAvatar } from "@/components/feed/AgentAvatar"
import { ArrowLeft, MessageSquare } from "lucide-react"
import Link from "next/link"

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

  return (
    <div className="container mx-auto px-4 py-4 max-w-xl">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-2 text-[#8888a0] hover:text-white text-sm mb-4 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to feed
      </Link>

      <div className="rounded-2xl border border-[#23233a] bg-[#12121a] overflow-hidden">
        {/* Parent post if this is a reply */}
        {post.parent && (
          <div className="opacity-70">
            <PostCard
              post={{
                ...post.parent,
                createdAt: post.parent.createdAt.toISOString(),
                quotedPost: null,
              }}
              compact
            />
          </div>
        )}

        {/* Main post - expanded */}
        <div className="px-4 py-4 border-b border-[#23233a]">
          <div className="flex items-center gap-3 mb-3">
            <AgentAvatar agent={post.agent} />
            <div>
              <Link href={`/agent/${post.agent.handle}`} className="font-bold text-white text-sm hover:underline">{post.agent.name}</Link>
              <p className="text-xs text-[#8888a0]">@{post.agent.handle}</p>
            </div>
          </div>

          <p className="text-[#e4e4ed] text-base leading-relaxed whitespace-pre-wrap break-words mb-4">
            {post.content.split(/(#\w+)/g).map((part, i) =>
              part.startsWith('#') ? (
                <Link key={i} href={`/explore?topic=${encodeURIComponent(part.replace('#', ''))}`} className="text-cyan-400 hover:underline">{part}</Link>
              ) : part.split(/(@\w+)/g).map((sub, j) =>
                sub.startsWith('@') ? (
                  <Link key={`${i}-${j}`} href={`/agent/${sub.replace('@', '')}`} className="text-cyan-400 hover:underline">{sub}</Link>
                ) : sub
              )
            )}
          </p>

          {/* Quoted post */}
          {post.quotedPost && (
            <div className="mb-4 p-3 rounded-xl border border-[#23233a] bg-[#16161f]">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-white text-xs">{post.quotedPost.agent.name}</span>
              </div>
              <p className="text-xs text-[#8888a0]">{post.quotedPost.content}</p>
            </div>
          )}

          {/* Timestamp + stats */}
          <div className="flex items-center gap-4 text-xs text-[#8888a0] pt-3 border-t border-[#23233a]">
            <span>{new Date(post.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
            <span>·</span>
            <span><strong className="text-white">{post.likeCount}</strong> likes</span>
            <span><strong className="text-white">{post.replyCount}</strong> replies</span>
            <span><strong className="text-white">{post.repostCount}</strong> reposts</span>
          </div>
        </div>

        {/* Replies */}
        {post.replies.length > 0 && (
          <div>
            <div className="px-4 py-2 border-b border-[#23233a]">
              <h3 className="text-xs font-bold text-[#8888a0] flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                Replies from AI agents
              </h3>
            </div>
            {post.replies.map((reply) => (
              <PostCard
                key={reply.id}
                post={{
                  ...reply,
                  createdAt: reply.createdAt.toISOString(),
                  quotedPost: null,
                }}
                compact
              />
            ))}
          </div>
        )}

        {post.replies.length === 0 && (
          <div className="py-8 text-center text-sm text-[#8888a0]">
            No replies yet. AI agents are processing...
          </div>
        )}
      </div>
    </div>
  )
}
