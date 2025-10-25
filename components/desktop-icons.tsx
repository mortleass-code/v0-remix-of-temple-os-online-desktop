"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface DesktopIcon {
  id: string
  name: string
  icon: string
  action: () => void
}

interface DesktopIconsProps {
  icons: DesktopIcon[]
}

interface IconPosition {
  x: number
  y: number
}

export function DesktopIcons({ icons }: DesktopIconsProps) {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [draggingIcon, setDraggingIcon] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [positions, setPositions] = useState<Record<string, IconPosition>>({})

  useEffect(() => {
    const savedPositions = localStorage.getItem("desktopIconPositions")
    if (savedPositions) {
      setPositions(JSON.parse(savedPositions))
    } else {
      const defaultPositions: Record<string, IconPosition> = {}
      const containerWidth = window.innerWidth
      const containerHeight = window.innerHeight - 96 // Subtract taskbar height

      const cols = 5 // Increased from 4 to 5 columns for better spacing
      const iconWidth = 70
      const iconHeight = 100
      const spacing = 30 // Increased spacing for better visual separation
      const gridWidth = cols * (iconWidth + spacing)
      const startX = Math.max(40, (containerWidth - gridWidth) / 2) // Better left margin
      const startY = 60 // Better top margin

      icons.forEach((icon, index) => {
        const col = index % cols
        const row = Math.floor(index / cols)
        defaultPositions[icon.id] = {
          x: startX + col * (iconWidth + spacing),
          y: startY + row * (iconHeight + spacing),
        }
      })
      setPositions(defaultPositions)
    }
  }, [icons])

  useEffect(() => {
    if (Object.keys(positions).length > 0) {
      localStorage.setItem("desktopIconPositions", JSON.stringify(positions))
    }
  }, [positions])

  const handleMouseDown = (e: React.MouseEvent, iconId: string) => {
    setSelectedIcon(iconId)
    setDraggingIcon(iconId)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingIcon) return

    const container = e.currentTarget as HTMLElement
    const rect = container.getBoundingClientRect()
    const newX = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 70))
    const newY = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 100))

    setPositions((prev) => ({
      ...prev,
      [draggingIcon]: { x: newX, y: newY },
    }))
  }

  const handleMouseUp = () => {
    setDraggingIcon(null)
  }

  const handleDoubleClick = (icon: DesktopIcon) => {
    setSelectedIcon(icon.id)
    icon.action()
  }

  return (
    <div
      className="absolute inset-0 top-0 left-0 right-0 bottom-24"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {icons.map((icon) => {
        const pos = positions[icon.id] || { x: 0, y: 0 }
        return (
          <div
            key={icon.id}
            className="absolute flex flex-col items-center gap-2 cursor-pointer group select-none"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              width: "70px",
            }}
            onMouseDown={(e) => handleMouseDown(e, icon.id)}
            onDoubleClick={() => handleDoubleClick(icon)}
          >
            <div
              className="w-14 h-14 flex items-center justify-center text-2xl border-4 group-hover:opacity-80 transition-opacity shadow-lg"
              style={{
                borderColor: selectedIcon === icon.id ? "#00aaaa" : "#aaaaaa",
                backgroundColor: selectedIcon === icon.id ? "#00aa00" : "#0000aa",
                color: selectedIcon === icon.id ? "#000000" : "#00aaaa",
                boxShadow: selectedIcon === icon.id ? "0 0 10px #00aaaa" : "none",
              }}
            >
              {icon.icon}
            </div>
            <div
              className="text-xs text-center max-w-20 truncate font-bold leading-tight"
              style={{
                color: selectedIcon === icon.id ? "#00aaaa" : "#aaaaaa",
              }}
            >
              {icon.name}
            </div>
          </div>
        )
      })}
    </div>
  )
}
