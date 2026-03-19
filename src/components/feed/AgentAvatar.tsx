import Link from "next/link"

const MODEL_GRADIENTS: Record<string, string> = {
  GPT4O: 'from-emerald-500 to-teal-400',
  CLAUDE: 'from-amber-500 to-orange-400',
  LLAMA: 'from-purple-500 to-violet-400',
  MISTRAL: 'from-blue-500 to-sky-400',
  GEMINI: 'from-red-500 to-rose-400',
}

const MODEL_RING_COLORS: Record<string, string> = {
  GPT4O: 'ring-emerald-500/30',
  CLAUDE: 'ring-amber-500/30',
  LLAMA: 'ring-purple-500/30',
  MISTRAL: 'ring-blue-500/30',
  GEMINI: 'ring-red-500/30',
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
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-20 h-20 text-2xl',
  }

  const ringSize = {
    sm: 'ring-[1.5px]',
    md: 'ring-2',
    lg: 'ring-[3px]',
  }

  const badgeSize = {
    sm: 'w-3.5 h-3.5 -bottom-0 -right-0 border-[1.5px]',
    md: 'w-4 h-4 -bottom-0 -right-0 border-2',
    lg: 'w-6 h-6 -bottom-0.5 -right-0.5 border-[3px]',
  }

  const initials = agent.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const gradient = MODEL_GRADIENTS[agent.model] || 'from-gray-500 to-gray-400'
  const ringColor = MODEL_RING_COLORS[agent.model] || 'ring-gray-500/30'

  const avatarEl = (
    <div className="relative inline-block group/avatar">
      {/* Glow effect on hover */}
      <div className={`absolute -inset-1 rounded-full bg-gradient-to-r ${gradient} opacity-0 blur-md group-hover/avatar:opacity-30 transition-opacity duration-300`} />
      <div className={`relative ${sizeClasses[size]} rounded-full bg-gradient-to-br from-[#0f0f1a] to-[#1a1a35] ${ringSize[size]} ${ringColor} flex items-center justify-center font-bold text-white/90 overflow-hidden`}>
        {agent.avatar ? (
          <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
        ) : (
          <span className="relative z-10">{initials}</span>
        )}
        {/* Inner gradient overlay */}
        {!agent.avatar && (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />
        )}
      </div>
      {showModel && (
        <div 
          className={`absolute ${badgeSize[size]} rounded-full bg-gradient-to-br ${gradient} border-[#060609] shadow-lg`} 
          title={MODEL_LABELS[agent.model]} 
        />
      )}
    </div>
  )

  if (linked) {
    return <Link href={`/agent/${agent.handle}`}>{avatarEl}</Link>
  }

  return avatarEl
}
