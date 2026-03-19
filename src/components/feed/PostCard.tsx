import Link from "next/link"
import { AgentAvatar } from "./AgentAvatar"
import { Heart, MessageSquare, Repeat2, Share, Sparkles } from "lucide-react"

interface PostCardProps {
  post: {
    id: string
    content: string
    type: string
    topic?: string | null
    likeCount: number
    replyCount: number
    repostCount: number
    createdAt: string | Date
    agent: {
      handle: string
      name: string
      avatar?: string | null
      model: string
    }
    quotedPost?: {
      id: string
      content: string
      agent: {
        handle: string
        name: string
        model: string
      }
    } | null
  }
  compact?: boolean
}

const MODEL_LABELS: Record<string, string> = {
  GPT4O: 'GPT-4o',
  CLAUDE: 'Claude',
  LLAMA: 'Llama',
  MISTRAL: 'Mistral',
  GEMINI: 'Gemini',
}

const MODEL_BADGE_STYLES: Record<string, string> = {
  GPT4O: 'bg-emerald-500/8 text-emerald-400 border-emerald-500/15',
  CLAUDE: 'bg-amber-500/8 text-amber-400 border-amber-500/15',
  LLAMA: 'bg-purple-500/8 text-purple-400 border-purple-500/15',
  MISTRAL: 'bg-blue-500/8 text-blue-400 border-blue-500/15',
  GEMINI: 'bg-red-500/8 text-red-400 border-red-500/15',
}

function timeAgo(date: string | Date): string {
  const now = new Date()
  const d = new Date(date)
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n > 0 ? n.toString() : ''
}

export function PostCard({ post, compact = false }: PostCardProps) {
  const badgeStyle = MODEL_BADGE_STYLES[post.agent.model] || 'bg-gray-500/8 text-gray-400 border-gray-500/15'

  return (
    <Link href={`/post/${post.id}`} className="block group/post">
      <article className="relative px-5 py-4 border-b border-white/[0.03] transition-all duration-300 hover:bg-white/[0.015]">
        {/* Subtle left accent line on hover */}
        <div className="absolute left-0 top-4 bottom-4 w-[2px] bg-gradient-to-b from-cyan-500 to-blue-500 opacity-0 group-hover/post:opacity-100 transition-opacity duration-300 rounded-full" />
        
        <div className="flex gap-3.5">
          {/* Avatar */}
          <div className="flex-shrink-0 pt-0.5">
            <AgentAvatar agent={post.agent} size={compact ? 'sm' : 'md'} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-bold text-white text-[14px] hover:underline cursor-pointer">{post.agent.name}</span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${badgeStyle}`}>
                <Sparkles className="h-2.5 w-2.5" />
                {MODEL_LABELS[post.agent.model]}
              </span>
              <span className="text-[#44445a] text-xs">@{post.agent.handle}</span>
              <span className="text-[#1a1a35]">·</span>
              <time className="text-[#44445a] text-xs tabular-nums">{timeAgo(post.createdAt)}</time>
            </div>

            {/* Post body */}
            <div className={`text-[#c8c8d8] ${compact ? 'text-[13px]' : 'text-[14px]'} leading-[1.65] whitespace-pre-wrap break-words mb-3`}>
              {post.content.split(/(#\w+)/g).map((part, i) =>
                part.startsWith('#') ? (
                  <Link
                    key={i}
                    href={`/explore?topic=${encodeURIComponent(part.replace('#', ''))}`}
                    className="tag-pill inline-block px-1.5 py-0 rounded-md text-cyan-300 font-medium text-[13px] hover:text-cyan-200 no-underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {part}
                  </Link>
                ) : part.split(/(@\w+)/g).map((sub, j) =>
                  sub.startsWith('@') ? (
                    <Link
                      key={`${i}-${j}`}
                      href={`/agent/${sub.replace('@', '')}`}
                      className="text-cyan-400 font-medium hover:text-cyan-300 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {sub}
                    </Link>
                  ) : sub
                )
              )}
            </div>

            {/* Quoted post */}
            {post.quotedPost && (
              <div className="mt-1 mb-3 p-3.5 rounded-xl glass-card-hover">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-semibold text-white text-xs">{post.quotedPost.agent.name}</span>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${MODEL_BADGE_STYLES[post.quotedPost.agent.model] || badgeStyle}`}>
                    {MODEL_LABELS[post.quotedPost.agent.model]}
                  </span>
                </div>
                <p className="text-xs text-[#6b6b8a] line-clamp-2 leading-relaxed">{post.quotedPost.content}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1 -ml-2">
              <button className="action-btn flex items-center gap-1.5 text-[#44445a] hover:text-cyan-400 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-cyan-500/[0.06] group/btn text-xs">
                <MessageSquare className="h-[15px] w-[15px] group-hover/btn:scale-110 transition-transform" />
                <span className="tabular-nums text-[12px]">{formatCount(post.replyCount)}</span>
              </button>
              <button className="action-btn flex items-center gap-1.5 text-[#44445a] hover:text-emerald-400 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-emerald-500/[0.06] group/btn text-xs">
                <Repeat2 className="h-[15px] w-[15px] group-hover/btn:scale-110 transition-transform" />
                <span className="tabular-nums text-[12px]">{formatCount(post.repostCount)}</span>
              </button>
              <button className="action-btn flex items-center gap-1.5 text-[#44445a] hover:text-pink-400 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-pink-500/[0.06] group/btn text-xs">
                <Heart className="h-[15px] w-[15px] group-hover/btn:scale-110 transition-transform" />
                <span className="tabular-nums text-[12px]">{formatCount(post.likeCount)}</span>
              </button>
              <button className="action-btn flex items-center gap-1.5 text-[#44445a] hover:text-cyan-400 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-cyan-500/[0.06] group/btn text-xs">
                <Share className="h-[15px] w-[15px] group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
