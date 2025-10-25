"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { RetroWindow } from "./retro-window"

interface ConsoleWindowProps {
  onClose: () => void
}

const SYSTEM_MESSAGES = [
  "VIBEOS BOOT SEQUENCE INITIATED",
  "CHECKING SYSTEM MEMORY... OK",
  "LOADING FILESYSTEM... OK",
  "INITIALIZING GRAPHICS... OK",
  "MOUNTING VIRTUAL DRIVES... OK",
  "LOADING DEVICE DRIVERS... OK",
  "WELCOME TO VIBEOS DESKTOP",
  "TYPE 'HELP' FOR COMMANDS",
  "READY FOR INPUT",
]

export function ConsoleWindow({ onClose }: ConsoleWindowProps) {
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState("")

  useEffect(() => {
    // Simulate boot sequence
    SYSTEM_MESSAGES.forEach((msg, index) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, msg])
      }, index * 300)
    })
  }, [])

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input.trim()) {
      const command = input.toUpperCase()
      setMessages((prev) => [...prev, `> ${command}`])

      if (command === "HELP") {
        setMessages((prev) => [...prev, "AVAILABLE COMMANDS: HELP, CLEAR, TIME, ECHO, SYSINFO, UPTIME"])
      } else if (command === "CLEAR") {
        setMessages([])
      } else if (command === "TIME") {
        setMessages((prev) => [...prev, new Date().toLocaleString()])
      } else if (command === "SYSINFO") {
        setMessages((prev) => [...prev, "VIBEOS v1.0 - FANTASY OS", "MEMORY: 64MB", "STORAGE: UNLIMITED"])
      } else if (command === "UPTIME") {
        setMessages((prev) => [...prev, "SYSTEM UPTIME: " + Math.floor(Math.random() * 1000) + " HOURS"])
      } else if (command.startsWith("ECHO ")) {
        setMessages((prev) => [...prev, command.substring(5)])
      } else {
        setMessages((prev) => [...prev, "UNKNOWN COMMAND"])
      }

      setInput("")
    }
  }

  return (
    <RetroWindow title="CONSOLE" onClose={onClose} defaultX={50} defaultY={450} defaultWidth={600} defaultHeight={200}>
      <div className="flex flex-col h-full gap-2">
        <div
          className="flex-1 overflow-auto border-2 p-2"
          style={{ borderColor: "#aaaaaa", backgroundColor: "#000000" }}
        >
          {messages.map((msg, i) => (
            <div key={i} style={{ color: "#00aa00" }} className="text-sm font-mono">
              {msg}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span style={{ color: "#00aa00" }}>{">"}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleCommand}
            className="flex-1 px-2 py-1 border-2 font-mono text-sm"
            style={{ borderColor: "#aaaaaa", backgroundColor: "#000000", color: "#00aa00" }}
            autoFocus
          />
        </div>
      </div>
    </RetroWindow>
  )
}
