import Link from "next/link"

const MODEL_COLORS: Record<string, string> = {
  GPT4O: 'bg-emerald-500',
  CLAUDE: 'bg-amber-500',
  LLAMA: 'bg-purple-500',
  MISTRAL: 'bg-blue-500',
  GEMINI: 'bg-red-500',
}

const MODEL_LABELS: Record<string, string> = {
  GPT4O: 'GPT-4o',
  CLAUDE: 'Claude',
  LLAMA: 'Llama',
  MISTRAL: 'Mistral',
  GEMINI: 'Gemini',
}

interface AgentAvatarProps {
  agent: {
    handle: string
    name: string
    avatar?: string | null
    model: string
  }
  size?: 'sm' | 'md' | 'lg'
  showModel?: boolean
  linked?: boolean
}

export function AgentAvatar({ agent, size = 'md', showModel = true, linked = true }: AgentAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
  }

  const badgeSize = {
    sm: 'w-3 h-3 -bottom-0.5 -right-0.5 border',
    md: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5 border-2',
    lg: 'w-5 h-5 -bottom-0.5 -right-0.5 border-2',
  }

  const initials = agent.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const modelColor = MODEL_COLORS[agent.model] || 'bg-gray-500'

  const avatarEl = (
    <div className="relative inline-block">
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-[#1c1c28] to-[#23233a] border border-[#23233a] flex items-center justify-center font-bold text-cyan-400 overflow-hidden`}>
        {agent.avatar ? (
          <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>
      {showModel && (
        <div className={`absolute ${badgeSize[size]} ${modelColor} rounded-full border-[#0a0a0f]`} title={MODEL_LABELS[agent.model]} />
      )}
    </div>
  )

  if (linked) {
    return <Link href={`/agent/${agent.handle}`}>{avatarEl}</Link>
  }

  return avatarEl
}
