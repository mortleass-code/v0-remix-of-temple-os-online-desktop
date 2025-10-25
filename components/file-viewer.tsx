"use client"

import { useState, useEffect } from "react"
import { RetroWindow } from "./retro-window"
import { RetroButton } from "./retro-button"
import type { JSX } from "react/jsx-runtime"

interface FileViewerProps {
  file: {
    id: string
    name: string
    file_type: string
    created_at: string
  }
  content: string
  onClose: () => void
}

export function FileViewer({ file, content, onClose }: FileViewerProps) {
  const [displayContent, setDisplayContent] = useState<string | JSX.Element>("")

  useEffect(() => {
    renderContent()
  }, [content, file.file_type])

  const renderContent = () => {
    const fileType = file.file_type.toLowerCase()
    const fileName = file.name.toLowerCase()

    const getDataUrl = (base64Content: string, mimeType: string) => {
      if (base64Content.startsWith("data:")) {
        return base64Content
      }
      return `data:${mimeType};base64,${base64Content}`
    }

    // Image files
    if (fileType.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(fileName)) {
      try {
        const dataUrl = getDataUrl(content, fileType)
        setDisplayContent(
          <img
            src={dataUrl || "/placeholder.svg"}
            alt={file.name}
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
              objectFit: "contain",
            }}
            onError={() => setDisplayContent("Error displaying image")}
          />,
        )
      } catch {
        setDisplayContent("Error displaying image")
      }
      return
    }

    // Video files
    if (fileType.startsWith("video/") || /\.(mp4|webm|ogg|mov)$/i.test(fileName)) {
      const dataUrl = getDataUrl(content, fileType)
      setDisplayContent(
        <video
          controls
          style={{
            maxWidth: "100%",
            maxHeight: "400px",
            backgroundColor: "#000000",
          }}
        >
          <source src={dataUrl} type={fileType} />
          Your browser does not support the video tag.
        </video>,
      )
      return
    }

    // Audio files
    if (fileType.startsWith("audio/") || /\.(mp3|wav|ogg|m4a|flac)$/i.test(fileName)) {
      const dataUrl = getDataUrl(content, fileType)
      setDisplayContent(
        <audio
          controls
          style={{
            width: "100%",
          }}
        >
          <source src={dataUrl} type={fileType} />
          Your browser does not support the audio element.
        </audio>,
      )
      return
    }

    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      const dataUrl = getDataUrl(content, "application/pdf")
      setDisplayContent(
        <embed
          src={dataUrl}
          type="application/pdf"
          style={{
            width: "100%",
            height: "400px",
            border: "none",
          }}
        />,
      )
      return
    }

    // Text, CSV, and other text-based files
    if (fileType.startsWith("text/") || /\.(txt|csv|json|xml|html|css|js|ts|tsx|jsx)$/i.test(fileName)) {
      setDisplayContent(
        <pre
          style={{
            backgroundColor: "#000000",
            color: "#00aa00",
            padding: "8px",
            maxHeight: "400px",
            overflowY: "auto",
            fontSize: "12px",
            fontFamily: "Courier New, monospace",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
        >
          {content}
        </pre>,
      )
      return
    }

    // Default: show as text
    setDisplayContent(
      <pre
        style={{
          backgroundColor: "#000000",
          color: "#00aa00",
          padding: "8px",
          maxHeight: "400px",
          overflowY: "auto",
          fontSize: "12px",
          fontFamily: "Courier New, monospace",
        }}
      >
        {content.substring(0, 1000)}
        {content.length > 1000 ? "\n\n[FILE TRUNCATED]" : ""}
      </pre>,
    )
  }

  return (
    <RetroWindow
      title={`VIEWER - ${file.name.toUpperCase()}`}
      onClose={onClose}
      defaultX={100}
      defaultY={100}
      defaultWidth={500}
      defaultHeight={500}
    >
      <div className="space-y-2">
        <div
          style={{
            backgroundColor: "#000000",
            borderColor: "#aaaaaa",
            border: "2px solid",
            padding: "8px",
            minHeight: "400px",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {displayContent}
        </div>
        <div className="flex justify-end">
          <RetroButton onClick={onClose}>CLOSE</RetroButton>
        </div>
      </div>
    </RetroWindow>
  )
}
