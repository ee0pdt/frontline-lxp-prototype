import { useState, useRef, useEffect } from 'react'
import { useStore } from '../store'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

const MOCK_RESPONSES: Record<string, string> = {
  croissant: 'Croissants should be displayed with the curved side facing up, arranged in neat rows with the points alternating left and right. Place them on the middle shelf at eye level for maximum visibility. Check freshness every 2 hours during peak times.',
  bread: 'Fresh bread should be placed in wicker baskets or on wooden display boards. Arrange loaves at a slight angle to show the crust. Sliced bread goes on the shelf behind whole loaves. Rotate stock every 4 hours.',
  coffee: 'For coffee machine cleaning: 1) Run a rinse cycle every 2 hours, 2) Deep clean the steam wand after each milk-based drink, 3) Empty and clean drip trays when half full, 4) Full descale weekly on Sunday evenings.',
  spill: 'For spills: 1) Place wet floor signs immediately, 2) Use the spill kit from aisle 3 back room, 3) Clean from outside edge inward, 4) Ensure floor is completely dry before removing signs, 5) Log the incident in the safety book.',
  default: "I can help you find information about store procedures, product placement, health & safety, and more. Try asking about specific products like 'croissants' or 'bread', or topics like 'coffee machine cleaning' or 'spill procedures'.",
}

function getResponse(question: string): string {
  const lowerQuestion = question.toLowerCase()

  for (const [keyword, response] of Object.entries(MOCK_RESPONSES)) {
    if (keyword !== 'default' && lowerQuestion.includes(keyword)) {
      return response
    }
  }

  return MOCK_RESPONSES.default
}

export function AskOverlay() {
  const { closeAskOverlay } = useStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400))

    const assistantMessage: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      content: getResponse(userMessage.content),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const hasMessages = messages.length > 0

  return (
    <div className="fixed inset-0 z-[60] bg-[var(--surface-primary)] flex flex-col animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-primary)] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-[var(--text-primary)]">Ask</h1>
            <p className="text-xs text-[var(--text-muted)]">Get instant answers</p>
          </div>
        </div>
        <button
          onClick={closeAskOverlay}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-secondary)] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Empty State - Centered */}
        {!hasMessages && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
            <div className="w-full max-w-md mx-auto text-center">
              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 flex items-center justify-center mx-auto mb-6 shadow-sm">
                <svg className="w-10 h-10 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                </svg>
              </div>

              {/* Heading */}
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">How can I help?</h2>
              <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-xs mx-auto leading-relaxed">
                Ask me anything about store procedures, products, or policies.
              </p>

              {/* Suggestions */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {['How should croissants be displayed?', 'Coffee machine cleaning', 'Spill procedures'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="text-sm px-4 py-2 rounded-full bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-tertiary)] hover:text-[var(--text-primary)] transition-all duration-200 border border-[var(--border-primary)] hover:border-[var(--color-primary)]/30 hover:shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Centered Input for Empty State */}
              <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="w-full px-5 py-4 pr-14 rounded-2xl bg-[var(--surface-secondary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-[var(--surface-primary)] border border-[var(--border-primary)] transition-all duration-200 shadow-sm"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:bg-[var(--color-primary-dark)] hover:scale-105 active:scale-95 shadow-md"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Messages View */}
        {hasMessages && (
          <>
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-[var(--color-primary)] text-white rounded-br-md shadow-md'
                          : 'bg-[var(--surface-secondary)] text-[var(--text-primary)] rounded-bl-md border border-[var(--border-primary)]'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[var(--surface-secondary)] rounded-2xl rounded-bl-md px-4 py-3 border border-[var(--border-primary)]">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Bottom Input - Constrained */}
            <div className="flex-shrink-0 border-t border-[var(--border-primary)] bg-[var(--surface-primary)]">
              <div className="max-w-2xl mx-auto px-4 py-4 safe-bottom">
                <form onSubmit={handleSubmit}>
                  <div className="relative">
                    <input
                      ref={hasMessages ? undefined : inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask a follow-up..."
                      className="w-full px-5 py-3.5 pr-14 rounded-2xl bg-[var(--surface-secondary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-[var(--surface-primary)] border border-[var(--border-primary)] transition-all duration-200"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:bg-[var(--color-primary-dark)] hover:scale-105 active:scale-95 shadow-md"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
