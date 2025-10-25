"use client"

import { useState } from "react"
import { RetroButton } from "./retro-button"

interface ColorScheme {
  name: string
  bg: string
  text: string
  accent: string
}

const COLOR_SCHEMES: ColorScheme[] = [
  { name: "BLUE", bg: "#0000aa", text: "#aaaaaa", accent: "#00aaaa" },
  { name: "GREEN", bg: "#000000", text: "#00aa00", accent: "#00ff00" },
  { name: "AMBER", bg: "#000000", text: "#ffaa00", accent: "#ffff00" },
  { name: "RED", bg: "#000000", text: "#aa0000", accent: "#ff0000" },
]

interface ColorSchemeSelectorProps {
  onSchemeChange: (scheme: ColorScheme) => void
}

export function ColorSchemeSelector({ onSchemeChange }: ColorSchemeSelectorProps) {
  const [currentScheme, setCurrentScheme] = useState(0)

  const handleSchemeChange = () => {
    const nextScheme = (currentScheme + 1) % COLOR_SCHEMES.length
    setCurrentScheme(nextScheme)
    onSchemeChange(COLOR_SCHEMES[nextScheme])
  }

  return <RetroButton onClick={handleSchemeChange}>COLOR: {COLOR_SCHEMES[currentScheme].name}</RetroButton>
}
