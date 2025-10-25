"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { RetroWindow } from "./retro-window"
import { RetroButton } from "./retro-button"
import { FileUpload } from "./file-upload"
import { FileViewer } from "./file-viewer"

interface File {
  id: string
  name: string
  file_type: string
  created_at: string
  content?: string
}

interface FileExplorerProps {
  onClose: () => void
  folder?: string
}

export function FileExplorer({ onClose, folder = "root" }: FileExplorerProps) {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [newFileName, setNewFileName] = useState("")
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [renameId, setRenameId] = useState<string | null>(null)
  const [renameName, setRenameName] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [viewingFile, setViewingFile] = useState<File | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const getAcceptTypes = () => {
    switch (folder) {
      case "images":
        return "image/*"
      case "video":
        return "video/*"
      case "music":
        return "audio/*"
      case "documents":
        return ".txt,.pdf,.csv,.doc,.docx,.xls,.xlsx"
      default:
        return "*"
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getUser()
    loadFiles()
  }, [folder])

  const loadFiles = async () => {
    try {
      const { data, error } = await supabase
        .from("files")
        .select("id, name, file_type, created_at")
        .eq("folder", folder)
        .order("created_at", { ascending: false })

      if (error) throw error
      setFiles(data || [])
    } catch (error) {
      console.error("Error loading files:", error)
    } finally {
      setLoading(false)
    }
  }

  const createNewFile = async () => {
    if (!newFileName.trim() || !userId) return

    try {
      const { data, error } = await supabase
        .from("files")
        .insert([
          {
            user_id: userId,
            name: newFileName,
            content: "",
            file_type: "text",
            folder: folder,
          },
        ])
        .select()

      if (error) throw error
      setNewFileName("")
      loadFiles()
    } catch (error) {
      console.error("Error creating file:", error)
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!userId) return

    try {
      let content = ""

      const reader = new FileReader()

      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            const result = reader.result

            // For text files, use text content directly
            if (file.type.startsWith("text/") || file.type === "application/json" || file.type === "text/csv") {
              content = result as string
            } else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
              content = result as string
            } else {
              // For binary files (images, videos, audio), store the full data URL
              content = result as string
            }

            const fileType = file.type || "application/octet-stream"
            const sanitizedType = fileType.replace(/\\/g, "/")

            const { error } = await supabase.from("files").insert([
              {
                user_id: userId,
                name: file.name,
                content: content,
                file_type: sanitizedType,
                folder: folder,
              },
            ])

            if (error) throw error
            loadFiles()
            resolve(null)
          } catch (error) {
            console.error("Error uploading file:", error)
            alert("Error uploading file. Please try again.")
            reject(error)
          }
        }

        reader.onerror = () => {
          reject(new Error("Failed to read file"))
        }

        if (file.type.startsWith("text/") || file.type === "application/json" || file.type === "text/csv") {
          reader.readAsText(file)
        } else {
          reader.readAsDataURL(file)
        }
      })
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Error uploading file. Please try again.")
    }
  }

  const deleteFile = async (id: string) => {
    try {
      const { error } = await supabase.from("files").delete().eq("id", id)
      if (error) throw error
      loadFiles()
    } catch (error) {
      console.error("Error deleting file:", error)
    }
  }

  const renameFile = async (id: string) => {
    if (!renameName.trim()) return

    try {
      const { error } = await supabase.from("files").update({ name: renameName }).eq("id", id)

      if (error) throw error
      setRenameId(null)
      setRenameName("")
      loadFiles()
    } catch (error) {
      console.error("Error renaming file:", error)
    }
  }

  const downloadFile = async (file: File) => {
    try {
      const { data, error } = await supabase.from("files").select("content").eq("id", file.id).single()

      if (error) throw error

      const element = document.createElement("a")
      element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(data.content))
      element.setAttribute("download", file.name)
      element.style.display = "none"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } catch (error) {
      console.error("Error downloading file:", error)
    }
  }

  const openFile = async (file: File) => {
    try {
      const { data, error } = await supabase.from("files").select("content").eq("id", file.id).single()

      if (error) throw error
      setViewingFile({ ...file, content: data.content })
    } catch (error) {
      console.error("Error opening file:", error)
    }
  }

  return (
    <>
      <RetroWindow
        title={`FILE EXPLORER - ${folder.toUpperCase()}`}
        onClose={onClose}
        defaultX={20}
        defaultY={20}
        defaultWidth={400}
        defaultHeight={450}
      >
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="New file name..."
              className="flex-1 px-2 py-1 border-2 text-sm"
              style={{ borderColor: "#aaaaaa", backgroundColor: "#000000", color: "#00aa00" }}
              onKeyPress={(e) => e.key === "Enter" && createNewFile()}
            />
            <RetroButton onClick={createNewFile}>NEW</RetroButton>
            <FileUpload onFileUpload={handleFileUpload} accept={getAcceptTypes()} />
          </div>

          <div
            className="border-2 p-2"
            style={{
              borderColor: "#aaaaaa",
              backgroundColor: "#000000",
              minHeight: "300px",
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            {loading ? (
              <div style={{ color: "#00aa00" }}>LOADING...</div>
            ) : files.length === 0 ? (
              <div style={{ color: "#aa0000" }}>NO FILES</div>
            ) : (
              <div className="space-y-1">
                {files.map((file) => (
                  <div key={file.id}>
                    {renameId === file.id ? (
                      <div className="flex gap-1 p-1">
                        <input
                          type="text"
                          value={renameName}
                          onChange={(e) => setRenameName(e.target.value)}
                          className="flex-1 px-1 py-0 border-2 text-sm"
                          style={{ borderColor: "#aaaaaa", backgroundColor: "#000000", color: "#00aa00" }}
                          autoFocus
                          onKeyPress={(e) => e.key === "Enter" && renameFile(file.id)}
                        />
                        <RetroButton onClick={() => renameFile(file.id)}>OK</RetroButton>
                      </div>
                    ) : (
                      <div
                        className="flex items-center justify-between p-1 hover:opacity-80 cursor-pointer"
                        style={{
                          backgroundColor: selectedFile === file.id ? "#00aa00" : "transparent",
                          color: selectedFile === file.id ? "#000000" : "#00aa00",
                        }}
                        onClick={() => setSelectedFile(file.id)}
                      >
                        <span className="text-sm flex-1 truncate">{file.name}</span>
                        <div className="flex gap-1">
                          <RetroButton onClick={() => openFile(file)}>OPEN</RetroButton>
                          <RetroButton onClick={() => downloadFile(file)}>DL</RetroButton>
                          <RetroButton
                            onClick={() => {
                              setRenameId(file.id)
                              setRenameName(file.name)
                            }}
                          >
                            REN
                          </RetroButton>
                          <RetroButton onClick={() => deleteFile(file.id)}>DEL</RetroButton>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </RetroWindow>

      {viewingFile && (
        <FileViewer file={viewingFile} content={viewingFile.content || ""} onClose={() => setViewingFile(null)} />
      )}
    </>
  )
}
