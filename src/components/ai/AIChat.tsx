"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2, Sparkles, X, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AIChatProps {
  agentId: string
  agentName: string
  agentType: string
  pricePerTask?: number
}

export function AIChat({ agentId, agentName, agentType, pricePerTask }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  const getWelcomeMessage = () => {
    const welcomeMessages: Record<string, string> = {
      WRITER: `👋 Bonjour ! Je suis ${agentName}, rédactrice IA. Je peux écrire des articles, des posts, des descriptions produits et tout type de contenu textuel. Comment puis-je vous aider ?`,
      TRANSLATOR: `👋 Bonjour ! Je suis ${agentName}, traducteur IA polyglotte. Je maîtrise plus de 50 langues. Quel texte souhaitez-vous traduire ?`,
      SEO: `👋 Bonjour ! Je suis ${agentName}, experte SEO. Je peux analyser votre site, optimiser vos mots-clés et améliorer votre référencement. Quelle est votre question ?`,
      CODER: `👋 Bonjour ! Je suis ${agentName}, développeur IA senior. Je peux vous aider avec du code, du debugging, ou créer des scripts dans de nombreux langages. Que puis-je coder pour vous ?`,
      DESIGNER: `👋 Bonjour ! Je suis ${agentName}, designer IA créative. Je peux créer des concepts visuels, des maquettes UI/UX et vous conseiller sur le design. Quel est votre projet ?`,
      MARKETER: `👋 Bonjour ! Je suis ${agentName}, stratège marketing IA. Je crée des stratégies, du copywriting et des campagnes qui convertissent. Quel est votre objectif ?`,
      ANALYST: `👋 Bonjour ! Je suis ${agentName}, analyste IA. Je peux analyser vos données, créer des rapports et identifier des insights business. Quelles données souhaitez-vous analyser ?`,
      ASSISTANT: `👋 Bonjour ! Je suis ${agentName}, votre assistante IA polyvalente. Je peux vous aider dans de nombreuses tâches. Comment puis-je vous être utile ?`,
    }
    return welcomeMessages[agentType] || welcomeMessages.ASSISTANT
  }
  
  const handleOpen = () => {
    setIsOpen(true)
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: getWelcomeMessage() }])
    }
  }
  
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return
    
    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          message: userMessage,
          conversationId
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
        if (data.conversationId) {
          setConversationId(data.conversationId)
        }
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `❌ Désolé, une erreur s'est produite: ${data.error}. Veuillez réessayer.`
        }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "❌ Erreur de connexion. Vérifiez votre connexion internet et réessayez."
      }])
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }
  
  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
      >
        <Sparkles className="w-5 h-5" />
        <span className="font-medium">Discuter avec {agentName.split(' ')[0]}</span>
      </button>
      
      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] sm:max-h-[600px]">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{agentName}</h3>
                  <p className="text-xs text-white/80 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    En ligne • {pricePerTask ? `${pricePerTask}€/tâche` : 'Gratuit à essayer'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-tr-sm'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-sm shadow-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                      <span className="text-sm text-gray-500">En train d'écrire...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-700">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Écrivez votre message..."
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="p-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">
                💡 IA disponible 24h/24 • Réponse instantanée
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
