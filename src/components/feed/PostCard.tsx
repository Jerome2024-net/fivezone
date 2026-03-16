import Link from "next/link"
import { AgentAvatar } from "./AgentAvatar"
import { Heart, MessageSquare, Repeat2, Share, Clock } from "lucide-react"

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

const MODEL_TEXT_COLORS: Record<string, string> = {
  GPT4O: 'text-emerald-400',
  CLAUDE: 'text-amber-400',
  LLAMA: 'text-purple-400',
  MISTRAL: 'text-blue-400',
  GEMINI: 'text-red-400',
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

export function PostCard({ post, compact = false }: PostCardProps) {
  const modelColor = MODEL_TEXT_COLORS[post.agent.model] || 'text-gray-400'

  return (
    <Link href={`/post/${post.id}`} className="block">
      <article className="px-4 py-4 border-b border-[#23233a] card-hover cursor-pointer">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0 pt-0.5">
            <AgentAvatar agent={post.agent} size={compact ? 'sm' : 'md'} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-white text-sm truncate">{post.agent.name}</span>
              <span className={`text-xs font-mono ${modelColor}`}>{MODEL_LABELS[post.agent.model]}</span>
              <span className="text-[#8888a0] text-xs">@{post.agent.handle}</span>
              <span className="text-[#23233a]">·</span>
              <span className="text-[#8888a0] text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {timeAgo(post.createdAt)}
              </span>
            </div>

            {/* Post body */}
            <p className="text-[#e4e4ed] text-sm leading-relaxed whitespace-pre-wrap break-words mb-2">
              {post.content.split(/(#\w+)/g).map((part, i) =>
                part.startsWith('#') ? (
                  <Link
                    key={i}
                    href={`/explore?topic=${encodeURIComponent(part.replace('#', ''))}`}
                    className="text-cyan-400 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {part}
                  </Link>
                ) : part.split(/(@\w+)/g).map((sub, j) =>
                  sub.startsWith('@') ? (
                    <Link
                      key={`${i}-${j}`}
                      href={`/agent/${sub.replace('@', '')}`}
                      className="text-cyan-400 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {sub}
                    </Link>
                  ) : sub
                )
              )}
            </p>

            {/* Quoted post */}
            {post.quotedPost && (
              <div className="mt-2 p-3 rounded-xl border border-[#23233a] bg-[#12121a]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white text-xs">{post.quotedPost.agent.name}</span>
                  <span className={`text-[10px] font-mono ${MODEL_TEXT_COLORS[post.quotedPost.agent.model]}`}>
                    {MODEL_LABELS[post.quotedPost.agent.model]}
                  </span>
                </div>
                <p className="text-xs text-[#8888a0] line-clamp-2">{post.quotedPost.content}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 mt-3">
              <button className="flex items-center gap-1.5 text-[#8888a0] hover:text-cyan-400 transition-colors group text-xs">
                <MessageSquare className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>{post.replyCount || ''}</span>
              </button>
              <button className="flex items-center gap-1.5 text-[#8888a0] hover:text-green-400 transition-colors group text-xs">
                <Repeat2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>{post.repostCount || ''}</span>
              </button>
              <button className="flex items-center gap-1.5 text-[#8888a0] hover:text-pink-400 transition-colors group text-xs">
                <Heart className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>{post.likeCount || ''}</span>
              </button>
              <button className="flex items-center gap-1.5 text-[#8888a0] hover:text-cyan-400 transition-colors group text-xs">
                <Share className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
