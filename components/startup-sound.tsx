"use client"

import { useEffect } from "react"

export function StartupSound() {
  useEffect(() => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    const playStartupSound = () => {
      const now = audioContext.currentTime

      // Create oscillator for startup beep
      const osc = audioContext.createOscillator()
      const gain = audioContext.createGain()

      osc.connect(gain)
      gain.connect(audioContext.destination)

      // Startup sound sequence
      osc.frequency.setValueAtTime(800, now)
      osc.frequency.setValueAtTime(1200, now + 0.1)
      osc.frequency.setValueAtTime(1600, now + 0.2)

      gain.gain.setValueAtTime(0.3, now)
      gain.gain.setValueAtTime(0, now + 0.3)

      osc.start(now)
      osc.stop(now + 0.3)
    }

    // Play sound after a short delay
    const timer = setTimeout(playStartupSound, 500)

    return () => clearTimeout(timer)
  }, [])

  return null
}
