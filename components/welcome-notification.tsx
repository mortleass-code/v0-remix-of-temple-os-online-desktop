"use client"

import { RetroButton } from "@/components/retro-button"

interface WelcomeNotificationProps {
  onClose: () => void
  colorScheme: {
    name: string
    bg: string
    text: string
    accent: string
  }
}

export function WelcomeNotification({ onClose, colorScheme }: WelcomeNotificationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="border-4 p-8 max-w-md w-full mx-4"
        style={{
          backgroundColor: colorScheme.bg,
          borderColor: colorScheme.text,
          color: colorScheme.accent,
          fontFamily: "monospace",
        }}
      >
        <div className="text-2xl font-bold mb-6 text-center">WELCOME TO VIBEOS</div>

        <div className="space-y-4 mb-8 text-sm leading-relaxed">
          <p>{">"} Welcome to your personal VibeOS desktop!</p>
          <p>{">"} Double-click any icon to open applications and folders.</p>
          <p>{">"} Drag icons to organize your desktop layout.</p>
          <p>{">"} Upload, edit, and manage your files with ease.</p>
          <p>{">"} Customize your color scheme from the taskbar.</p>
          <p>{">"} Enjoy the retro computing experience!</p>
        </div>

        <div className="flex justify-center">
          <RetroButton onClick={onClose}>CLOSE</RetroButton>
        </div>
      </div>
    </div>
  )
}
