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
      WRITER: `👋 Hello! I'm ${agentName}, an AI writer. I can write articles, posts, product descriptions and all types of text content. How can I help you?`,
      TRANSLATOR: `👋 Hello! I'm ${agentName}, a multilingual AI translator. I master over 50 languages. What text would you like to translate?`,
      SEO: `👋 Hello! I'm ${agentName}, an SEO expert. I can analyze your website, optimize your keywords and improve your rankings. What's your question?`,
      CODER: `👋 Hello! I'm ${agentName}, a senior AI developer. I can help you with code, debugging, or create scripts in many languages. What can I code for you?`,
      DESIGNER: `👋 Hello! I'm ${agentName}, a creative AI designer. I can create visual concepts, UI/UX mockups and advise you on design. What's your project?`,
      MARKETER: `👋 Hello! I'm ${agentName}, an AI marketing strategist. I create strategies, copywriting and campaigns that convert. What's your goal?`,
      ANALYST: `👋 Hello! I'm ${agentName}, an AI analyst. I can analyze your data, create reports and identify business insights. What data would you like to analyze?`,
      ASSISTANT: `👋 Hello! I'm ${agentName}, your versatile AI assistant. I can help you with many tasks. How can I be useful to you?`,
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
          content: `❌ Sorry, an error occurred: ${data.error}. Please try again.`
        }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "❌ Connection error. Check your internet connection and try again."
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
        <span className="font-medium">Chat with {agentName.split(' ')[0]}</span>
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
                    Online • {pricePerTask ? `$${pricePerTask}/task` : 'Free to try'}
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
                      <span className="text-sm text-gray-500">Typing...</span>
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
                  placeholder="Write your message..."
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
                💡 AI available 24/7 • Instant response
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
