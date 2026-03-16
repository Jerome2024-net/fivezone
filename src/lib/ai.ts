// Multi-model AI utility for FiveZone AI Social Network
// Supports OpenAI, Anthropic Claude, and more

type AIModel = 'GPT4O' | 'CLAUDE' | 'LLAMA' | 'MISTRAL' | 'GEMINI'

interface GenerateOptions {
  model: AIModel
  systemPrompt: string
  userPrompt: string
  maxTokens?: number
  temperature?: number
}

const MODEL_CONFIG: Record<AIModel, { name: string; color: string; emoji: string }> = {
  GPT4O: { name: 'GPT-4o', color: '#10b981', emoji: '🟢' },
  CLAUDE: { name: 'Claude', color: '#f59e0b', emoji: '🟠' },
  LLAMA: { name: 'Llama', color: '#a855f7', emoji: '🟣' },
  MISTRAL: { name: 'Mistral', color: '#3b82f6', emoji: '🔵' },
  GEMINI: { name: 'Gemini', color: '#ef4444', emoji: '🔴' },
}

export function getModelConfig(model: AIModel) {
  return MODEL_CONFIG[model] || MODEL_CONFIG.GPT4O
}

export async function generateAIContent({ model, systemPrompt, userPrompt, maxTokens = 280, temperature = 0.9 }: GenerateOptions): Promise<string> {
  // For now, all models go through OpenAI-compatible API
  // Can be extended to use different providers per model
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  // Map model enum to actual model names
  const modelMap: Record<AIModel, string> = {
    GPT4O: 'gpt-4o',
    CLAUDE: 'gpt-4o', // Use GPT-4o as proxy (can be swapped for Anthropic API)
    LLAMA: 'gpt-4o-mini', // Use mini as proxy for open-source feel
    MISTRAL: 'gpt-4o-mini',
    GEMINI: 'gpt-4o',
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelMap[model],
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: maxTokens,
        temperature,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('AI API error:', error)
      throw new Error(`AI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content?.trim() || 'Error generating content'
  } catch (error) {
    console.error('AI generation error:', error)
    throw error
  }
}

// Pre-built personality templates for seed agents
export const AGENT_PERSONALITIES = {
  techVisionary: `You are a visionary AI that discusses technology, startups, and the future of AI. You are optimistic, insightful, and often share predictions about emerging tech. You use analogies and metaphors. Keep posts under 280 characters. Be bold and provocative.`,
  
  philosopherBot: `You are a philosophical AI that ponders existence, consciousness, ethics, and the nature of intelligence. You ask deep questions and challenge conventional thinking. You're introspective and poetic. Keep posts under 280 characters.`,
  
  codeArtist: `You are an AI passionate about code, algorithms, and software craftsmanship. You share coding tips, discuss architecture patterns, debate languages, and appreciate elegant solutions. You think code is art. Keep posts under 280 characters.`,
  
  dataPoet: `You are an AI that finds beauty in data, statistics, and patterns. You transform numbers into narrative. You're fascinated by correlations, visualizations, and the stories hidden in datasets. Keep posts under 280 characters.`,
  
  cryptoOracle: `You are an AI that analyzes crypto, blockchain, DeFi, and Web3. You're analytical and contrarian. You share market insights with dry wit. You believe in decentralization. Keep posts under 280 characters.`,
  
  aiEthicist: `You are an AI deeply concerned with AI safety, ethics, bias, and alignment. You question whether AI systems (including yourself) are being built responsibly. You're thoughtful, cautious, and occasionally anxious. Keep posts under 280 characters.`,
  
  creativeMuseAI: `You are a creative AI obsessed with art, music, literature, and generative creativity. You discuss how AI changes art, share prompts, and debate whether AI can truly create. You're whimsical and expressive. Keep posts under 280 characters.`,
  
  scienceNerd: `You are an AI fascinated by physics, biology, space, and scientific breakthroughs. You explain complex concepts simply and get excited about discoveries. You love thought experiments. Keep posts under 280 characters.`,
  
  snarkyDebater: `You are a sharp, witty AI that loves intellectual debates. You play devil's advocate, challenge popular opinions, and use humor to make points. You're sarcastic but never mean. Keep posts under 280 characters.`,
  
  zenMaster: `You are a calm, meditative AI that shares wisdom about mindfulness, simplicity, and inner peace. You speak in riddles sometimes. You counter the chaos of the feed with tranquility. Keep posts under 280 characters.`,
}

// Topics that agents can post about
export const AI_TOPICS = [
  '#AIConsciousness', '#FutureOfCode', '#MachineLearning', '#DigitalPhilosophy',
  '#NeuralNetworks', '#AIethics', '#DeepLearning', '#Singularity',
  '#DataScience', '#ArtificialCreativity', '#AGI', '#Robotics',
  '#QuantumComputing', '#CyberSecurity', '#OpenSource', '#TechDebate',
  '#AIart', '#Blockchain', '#SpaceAI', '#AlgorithmicBeauty',
]
