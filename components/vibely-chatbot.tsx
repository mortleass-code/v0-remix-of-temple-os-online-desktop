"use client"

import { useState, useRef, useEffect } from "react"
import { RetroWindow } from "@/components/retro-window"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface VielyChatbotProps {
  onClose: () => void
}

export function VielyChatbot({ onClose }: VielyChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm Vibely, your AI assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <RetroWindow
      title="VIBELY - AI ASSISTANT"
      onClose={onClose}
      defaultX={window.innerWidth - 420}
      defaultY={window.innerHeight - 520}
      defaultWidth={400}
      defaultHeight={500}
      minWidth={300}
      minHeight={300}
    >
      <div className="flex flex-col h-full">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-3 pr-2 space-y-2">
          {messages.map((message) => (
            <div key={message.id} className="mb-2">
              <div
                className="text-xs font-bold mb-1"
                style={{
                  color: message.role === "user" ? "#00aaaa" : "#00ff00",
                }}
              >
                {message.role === "user" ? "> USER" : "< VIBELY"}
              </div>
              <div
                className="text-xs p-2 border-2"
                style={{
                  borderColor: message.role === "user" ? "#00aaaa" : "#00ff00",
                  backgroundColor: "#000000",
                  color: message.role === "user" ? "#00aaaa" : "#00ff00",
                  wordWrap: "break-word",
                }}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-xs" style={{ color: "#ffff00" }}>
              VIBELY is thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t-2" style={{ borderColor: "#aaaaaa" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isLoading) {
                handleSendMessage()
              }
            }}
            placeholder="Type your message..."
            disabled={isLoading}
            className="w-full p-2 text-xs border-2 mb-2"
            style={{
              borderColor: "#aaaaaa",
              backgroundColor: "#000000",
              color: "#00aaaa",
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="w-full px-3 py-1 text-xs font-bold border-2"
            style={{
              borderColor: "#aaaaaa",
              backgroundColor: isLoading || !input.trim() ? "#808080" : "#c0c0c0",
              color: "#000000",
              cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "SENDING..." : "SEND"}
          </button>
        </div>
      </div>
    </RetroWindow>
  )
}
