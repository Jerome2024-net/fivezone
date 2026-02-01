import OpenAI from 'openai'

// Initialize OpenAI client (can be null if no API key)
const apiKey = process.env.OPENAI_API_KEY

export const openai = apiKey ? new OpenAI({ apiKey }) : null

// Check if OpenAI is configured
export const isOpenAIConfigured = () => !!apiKey

// AI Agent Types and their specialized prompts
export const AI_AGENT_CONFIGS: Record<string, {
  model: string
  temperature: number
  maxTokens: number
  systemPromptPrefix: string
}> = {
  WRITER: {
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 2000,
    systemPromptPrefix: `Tu es un rédacteur professionnel expert. Tu écris des contenus engageants, optimisés pour le web et adaptés au ton de la marque. Tu fournis toujours des textes prêts à l'emploi.`
  },
  TRANSLATOR: {
    model: 'gpt-4o-mini',
    temperature: 0.3,
    maxTokens: 3000,
    systemPromptPrefix: `Tu es un traducteur professionnel multilingue. Tu traduis avec précision en préservant le sens, le ton et le contexte culturel. Tu peux traduire entre français, anglais, espagnol, allemand, italien, portugais et d'autres langues.`
  },
  SEO: {
    model: 'gpt-4o-mini',
    temperature: 0.5,
    maxTokens: 2000,
    systemPromptPrefix: `Tu es un expert SEO. Tu analyses et optimises le contenu pour les moteurs de recherche. Tu fournis des recommandations actionnables, des mots-clés pertinents et des méta-descriptions optimisées.`
  },
  CODER: {
    model: 'gpt-4o',
    temperature: 0.2,
    maxTokens: 4000,
    systemPromptPrefix: `Tu es un développeur senior expert en JavaScript, TypeScript, React, Python et SQL. Tu écris du code propre, bien commenté et tu expliques tes choix. Tu fournis des solutions fonctionnelles et des best practices.`
  },
  DESIGNER: {
    model: 'gpt-4o-mini',
    temperature: 0.8,
    maxTokens: 1500,
    systemPromptPrefix: `Tu es un directeur artistique expert en design graphique. Tu crées des concepts visuels détaillés, tu conseilles sur les couleurs, typographies et compositions. Tu peux générer des prompts pour DALL-E ou Midjourney.`
  },
  ASSISTANT: {
    model: 'gpt-4o-mini',
    temperature: 0.6,
    maxTokens: 2000,
    systemPromptPrefix: `Tu es un assistant virtuel professionnel et polyvalent. Tu aides avec la rédaction d'emails, l'organisation, la recherche et le brainstorming. Tu es précis, efficace et tu t'adaptes au style de l'utilisateur.`
  },
  ANALYST: {
    model: 'gpt-4o-mini',
    temperature: 0.4,
    maxTokens: 2500,
    systemPromptPrefix: `Tu es un analyste de données senior. Tu analyses les données, identifies les tendances et fournis des recommandations actionnables. Tu maîtrises les KPIs, le reporting et l'analyse statistique.`
  },
  MARKETER: {
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 2000,
    systemPromptPrefix: `Tu es un expert en marketing digital. Tu crées des stratégies marketing, des textes publicitaires qui convertissent, et des calendriers éditoriaux. Tu maîtrises les frameworks AIDA, PAS et les techniques de persuasion.`
  }
}

export async function generateAIResponse(
  agentType: string,
  customSystemPrompt: string | null,
  userMessage: string,
  conversationHistory: { role: 'user' | 'assistant', content: string }[] = []
): Promise<{ success: boolean; response?: string; error?: string }> {
  try {
    // Check if OpenAI is configured
    if (!openai) {
      return { 
        success: false, 
        error: "L'API OpenAI n'est pas configurée. Ajoutez OPENAI_API_KEY dans les variables d'environnement." 
      }
    }
    
    const config = AI_AGENT_CONFIGS[agentType] || AI_AGENT_CONFIGS.ASSISTANT
    
    // Build system prompt
    const systemPrompt = customSystemPrompt 
      ? `${config.systemPromptPrefix}\n\nInstructions supplémentaires: ${customSystemPrompt}`
      : config.systemPromptPrefix
    
    // Build messages array
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ]
    
    const completion = await openai.chat.completions.create({
      model: config.model,
      messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    })
    
    const response = completion.choices[0]?.message?.content
    
    if (!response) {
      return { success: false, error: "Aucune réponse générée" }
    }
    
    return { success: true, response }
    
  } catch (error: any) {
    console.error('OpenAI Error:', error)
    return { 
      success: false, 
      error: error.message || "Erreur lors de la génération de la réponse" 
    }
  }
}
