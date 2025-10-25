"use client"

import type React from "react"

interface RetroButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function RetroButton({ children, onClick, disabled, className = "" }: RetroButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 border-2 font-bold text-sm hover:opacity-80 disabled:opacity-50 ${className}`}
      style={{
        borderColor: "#aaaaaa",
        backgroundColor: "#c0c0c0",
        color: "#000000",
        borderStyle: "outset",
      }}
    >
      {children}
    </button>
  )
}
