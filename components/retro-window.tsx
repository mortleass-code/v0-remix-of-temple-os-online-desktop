"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface RetroWindowProps {
  title: string
  children: React.ReactNode
  onClose?: () => void
  defaultX?: number
  defaultY?: number
  defaultWidth?: number
  defaultHeight?: number
  minWidth?: number
  minHeight?: number
}

export function RetroWindow({
  title,
  children,
  onClose,
  defaultX = 50,
  defaultY = 50,
  defaultWidth = 400,
  defaultHeight = 300,
  minWidth = 200,
  minHeight = 150,
}: RetroWindowProps) {
  const [position, setPosition] = useState({ x: defaultX, y: defaultY })
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".window-resize")) return
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    }
    if (isResizing) {
      setSize({
        width: Math.max(minWidth, e.clientX - position.x),
        height: Math.max(minHeight, e.clientY - position.y),
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, isResizing, position, dragOffset])

  return (
    <div
      ref={windowRef}
      className="absolute flex flex-col border-4"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        borderColor: "#aaaaaa",
        backgroundColor: "#0000aa",
        boxShadow: "inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080",
      }}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-2 py-1 cursor-move select-none"
        style={{
          backgroundColor: "#000080",
          borderBottom: "2px solid #aaaaaa",
          color: "#ffffff",
        }}
        onMouseDown={handleMouseDown}
      >
        <span className="text-sm font-bold">{title}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="px-2 py-0 border-2 text-xs font-bold hover:opacity-80"
            style={{
              borderColor: "#aaaaaa",
              backgroundColor: "#c0c0c0",
              color: "#000000",
            }}
          >
            X
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-2" style={{ color: "#aaaaaa" }}>
        {children}
      </div>

      {/* Resize Handle */}
      <div
        className="window-resize absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        style={{
          backgroundColor: "#aaaaaa",
          borderLeft: "1px solid #ffffff",
          borderTop: "1px solid #ffffff",
        }}
        onMouseDown={() => setIsResizing(true)}
      />
    </div>
  )
}
