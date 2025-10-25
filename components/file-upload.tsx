"use client"

import type React from "react"

import { useRef } from "react"
import { RetroButton } from "./retro-button"

interface FileUploadProps {
  onFileUpload: (file: File) => void
  disabled?: boolean
  accept?: string
}

export function FileUpload({ onFileUpload, disabled, accept }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileUpload(file)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
        accept={accept}
      />
      <RetroButton onClick={() => fileInputRef.current?.click()} disabled={disabled}>
        UPLOAD
      </RetroButton>
    </>
  )
}
