"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2, Sparkles, X, Lock, Crown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import Link from "next/link"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AIChatProps {
  agentId: string
  agentName: string
  agentType: string
}

export function AIChat({ agentId, agentName, agentType }: AIChatProps) {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [hasSubscription, setHasSubscription] = useState(false)
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Check user subscription status
  useEffect(() => {
    const checkSubscription = async () => {
      if (status === 'loading') return
      
      if (!session?.user) {
        setHasSubscription(false)
        setIsCheckingSubscription(false)
        return
      }
      
      try {
        const response = await fetch('/api/auth/subscription')
        const data = await response.json()
        setHasSubscription(data.hasActiveSubscription)
      } catch (error) {
        setHasSubscription(false)
      } finally {
        setIsCheckingSubscription(false)
      }
    }
    
    checkSubscription()
  }, [session, status])
  
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
    if (messages.length === 0 && hasSubscription) {
      setMessages([{ role: 'assistant', content: getWelcomeMessage() }])
    }
  }
  
  const sendMessage = async () => {
    if (!input.trim() || isLoading || !hasSubscription) return
    
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

  // Paywall Component
  const PaywallContent = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[400px]">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mb-6">
        <Lock className="w-10 h-10 text-violet-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-slate-900 mb-2">
        Activate {agentName}
      </h3>
      
      <p className="text-slate-600 mb-6 max-w-sm">
        Subscribe to unlock unlimited access to all AI talents and boost your productivity.
      </p>
      
      {/* Benefits */}
      <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 mb-6 w-full max-w-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-left">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-sm text-slate-700">Unlimited AI conversations</span>
          </div>
          <div className="flex items-center gap-3 text-left">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-sm text-slate-700">Access to all 6 AI talents</span>
          </div>
          <div className="flex items-center gap-3 text-left">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-sm text-slate-700">24/7 instant responses</span>
          </div>
          <div className="flex items-center gap-3 text-left">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-sm text-slate-700">Priority support</span>
          </div>
        </div>
      </div>
      
      {/* Pricing */}
      <div className="mb-6">
        <p className="text-sm text-slate-500 mb-1">Starting at</p>
        <p className="text-3xl font-black text-slate-900">
          $99<span className="text-lg font-normal text-slate-500">/month</span>
        </p>
      </div>
      
      {/* CTA Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Link href="/pricing" className="w-full">
          <Button className="w-full h-12 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg">
            <Crown className="w-5 h-5 mr-2" />
            View Plans & Subscribe
          </Button>
        </Link>
        
        {!session && (
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full h-12 font-bold rounded-full border-2">
              Already subscribed? Log in
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
  
  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
      >
        {hasSubscription ? (
          <Sparkles className="w-5 h-5" />
        ) : (
          <Lock className="w-5 h-5" />
        )}
        <span className="font-medium">
          {hasSubscription ? `Chat with ${agentName.split(' ')[0]}` : `Activate ${agentName.split(' ')[0]}`}
        </span>
      </button>
      
      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] sm:max-h-[600px]">
            {/* Header */}
            <div className={`${hasSubscription ? 'bg-gradient-to-r from-violet-500 to-purple-600' : 'bg-gradient-to-r from-slate-700 to-slate-800'} text-white px-5 py-4 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  {hasSubscription ? <Bot className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-semibold">{agentName}</h3>
                  <p className="text-xs text-white/80 flex items-center gap-1">
                    {hasSubscription ? (
                      <>
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Online • Ready to help
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        Subscription required
                      </>
                    )}
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
            
            {/* Content - Either Paywall or Chat */}
            {isCheckingSubscription ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
              </div>
            ) : !hasSubscription ? (
              <PaywallContent />
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
