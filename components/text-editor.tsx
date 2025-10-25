"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { RetroWindow } from "./retro-window"
import { RetroButton } from "./retro-button"

interface File {
  id: string
  name: string
  content: string
}

interface TextEditorProps {
  file: File | null
  onClose: () => void
}

export function TextEditor({ file, onClose }: TextEditorProps) {
  const [content, setContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    if (file) {
      setContent(file.content || "")
    }
  }, [file])

  const saveFile = async () => {
    if (!file) return

    setIsSaving(true)
    try {
      const { error } = await supabase.from("files").update({ content }).eq("id", file.id)

      if (error) throw error
    } catch (error) {
      console.error("Error saving file:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!file) {
    return (
      <RetroWindow
        title="TEXT EDITOR"
        onClose={onClose}
        defaultX={400}
        defaultY={50}
        defaultWidth={500}
        defaultHeight={400}
      >
        <div style={{ color: "#aa0000" }}>NO FILE OPEN</div>
      </RetroWindow>
    )
  }

  return (
    <RetroWindow
      title={`TEXT EDITOR - ${file.name}`}
      onClose={onClose}
      defaultX={400}
      defaultY={50}
      defaultWidth={500}
      defaultHeight={400}
    >
      <div className="flex flex-col h-full gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 p-2 border-2 font-mono text-sm resize-none"
          style={{
            borderColor: "#aaaaaa",
            backgroundColor: "#000000",
            color: "#00aa00",
          }}
        />
        <div className="flex gap-2">
          <RetroButton onClick={saveFile} disabled={isSaving}>
            {isSaving ? "SAVING..." : "SAVE"}
          </RetroButton>
        </div>
      </div>
    </RetroWindow>
  )
}
