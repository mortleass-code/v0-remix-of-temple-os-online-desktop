"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { RetroButton } from "@/components/retro-button"
import { FileExplorer } from "@/components/file-explorer"
import { TextEditor } from "@/components/text-editor"
import { ConsoleWindow } from "@/components/console-window"
import { StartupSound } from "@/components/startup-sound"
import { ColorSchemeSelector } from "@/components/color-scheme-selector"
import { DesktopIcons } from "@/components/desktop-icons"
import { WelcomeNotification } from "@/components/welcome-notification"
import { VielyChatbot } from "@/components/vibely-chatbot"

interface File {
  id: string
  name: string
  content: string
  file_type: string
  created_at: string
}

interface ColorScheme {
  name: string
  bg: string
  text: string
  accent: string
}

export default function DesktopPage() {
  const [showFileExplorer, setShowFileExplorer] = useState(false)
  const [showTextEditor, setShowTextEditor] = useState(false)
  const [showConsole, setShowConsole] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showVibely, setShowVibely] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [systemTime, setSystemTime] = useState("")
  const [user, setUser] = useState<any>(null)
  const [currentFolder, setCurrentFolder] = useState("root")
  const [colorScheme, setColorScheme] = useState<ColorScheme>({
    name: "BLUE",
    bg: "#0000aa",
    text: "#aaaaaa",
    accent: "#00aaaa",
  })
  const router = useRouter()

  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
      } else {
        setUser(user)

        // Check if user has seen welcome notification
        const { data: prefs } = await supabase
          .from("user_preferences")
          .select("welcome_shown")
          .eq("user_id", user.id)
          .single()

        if (prefs && !prefs.welcome_shown) {
          setShowWelcome(true)
        }

        // Initialize default files if none exist
        const { data: existingFiles } = await supabase.from("files").select("id").eq("user_id", user.id).limit(1)

        if (!existingFiles || existingFiles.length === 0) {
          await initializeDefaultFiles(user.id)
        }
      }
    }
    getUser()
  }, [])

  const initializeDefaultFiles = async (userId: string) => {
    const defaultFiles = [
      {
        name: "README.txt",
        content:
          "Welcome to VibeOS!\n\nThis is your personal desktop environment.\nYou can create, edit, and manage files here.",
        file_type: "text",
        folder: "root",
      },
      {
        name: "GETTING_STARTED.txt",
        content:
          "Getting Started Guide:\n\n1. Double-click icons to open folders\n2. Use the file explorer to manage files\n3. Drag icons to organize your desktop\n4. Upload files using the UPLOAD button",
        file_type: "text",
        folder: "documents",
      },
      {
        name: "TIPS_AND_TRICKS.txt",
        content:
          "Tips & Tricks:\n\n- Right-click to see options\n- Drag windows to move them\n- Use the console for system info\n- Change color schemes anytime",
        file_type: "text",
        folder: "documents",
      },
      {
        name: "sample_code.js",
        content:
          "// Sample JavaScript Code\nfunction helloVibeOS() {\n  console.log('Welcome to VibeOS!');\n  return 'Hello, retro computing!';\n}\n\nhelloVibeOS();",
        file_type: "code",
        folder: "code",
      },
      {
        name: "example.html",
        content:
          "<!DOCTYPE html>\n<html>\n<head>\n  <title>VibeOS Example</title>\n</head>\n<body>\n  <h1>Welcome to VibeOS</h1>\n  <p>This is a retro computing experience.</p>\n</body>\n</html>",
        file_type: "code",
        folder: "code",
      },
      {
        name: "NOTES.txt",
        content:
          "My Notes:\n\n- This is a personal note file\n- You can edit and save your thoughts here\n- All files are stored securely\n- Your data is private and encrypted",
        file_type: "text",
        folder: "documents",
      },
      {
        name: "SYSTEM_INFO.txt",
        content:
          "VibeOS System Information:\n\nOS: VibeOS v1.0\nArchitecture: Retro Computing\nTheme: Customizable\nStorage: Cloud-based\nSecurity: End-to-end encrypted",
        file_type: "text",
        folder: "root",
      },
      {
        name: "GALLERY.txt",
        content:
          "Image Gallery:\n\nThis folder is for storing your images.\nYou can upload images and organize them here.\nSupported formats: JPG, PNG, GIF, WebP",
        file_type: "text",
        folder: "images",
      },
      {
        name: "PROJECTS.txt",
        content:
          "My Projects:\n\n1. VibeOS Desktop - Personal computing environment\n2. Retro UI Framework - Classic computing interface\n3. File Management System - Secure cloud storage\n\nMore projects coming soon!",
        file_type: "text",
        folder: "documents",
      },
      {
        name: "CHANGELOG.txt",
        content:
          "VibeOS Changelog:\n\nv1.0 - Initial Release\n- Desktop environment\n- File management\n- Text editor\n- Console window\n- Color schemes\n- Draggable icons\n- File upload/download",
        file_type: "text",
        folder: "root",
      },
    ]

    for (const file of defaultFiles) {
      await supabase.from("files").insert([
        {
          user_id: userId,
          name: file.name,
          content: file.content,
          file_type: file.file_type,
          folder: file.folder,
        },
      ])
    }
  }

  const handleCloseWelcome = async () => {
    if (user) {
      await supabase.from("user_preferences").update({ welcome_shown: true }).eq("user_id", user.id)
    }
    setShowWelcome(false)
  }

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setSystemTime(now.toLocaleTimeString())
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const handleOpenFile = (file: File) => {
    setSelectedFile(file)
    setShowTextEditor(true)
  }

  const desktopIcons = [
    {
      id: "files",
      name: "MY FILES",
      icon: "📁",
      action: () => {
        setCurrentFolder("root")
        setShowFileExplorer(true)
      },
    },
    {
      id: "documents",
      name: "DOCUMENTS",
      icon: "📄",
      action: () => {
        setCurrentFolder("documents")
        setShowFileExplorer(true)
      },
    },
    {
      id: "images",
      name: "IMAGES",
      icon: "🖼️",
      action: () => {
        setCurrentFolder("images")
        setShowFileExplorer(true)
      },
    },
    {
      id: "code",
      name: "CODE",
      icon: "💻",
      action: () => {
        setCurrentFolder("code")
        setShowFileExplorer(true)
      },
    },
    {
      id: "music",
      name: "MUSIC",
      icon: "🎵",
      action: () => {
        setCurrentFolder("music")
        setShowFileExplorer(true)
      },
    },
    {
      id: "videos",
      name: "VIDEOS",
      icon: "🎬",
      action: () => {
        setCurrentFolder("videos")
        setShowFileExplorer(true)
      },
    },
    {
      id: "downloads",
      name: "DOWNLOADS",
      icon: "⬇️",
      action: () => {
        setCurrentFolder("downloads")
        setShowFileExplorer(true)
      },
    },
    {
      id: "projects",
      name: "PROJECTS",
      icon: "🚀",
      action: () => {
        setCurrentFolder("projects")
        setShowFileExplorer(true)
      },
    },
    {
      id: "archive",
      name: "ARCHIVE",
      icon: "📦",
      action: () => {
        setCurrentFolder("archive")
        setShowFileExplorer(true)
      },
    },
    {
      id: "console",
      name: "CONSOLE",
      icon: "⌨️",
      action: () => setShowConsole(true),
    },
  ]

  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{
        backgroundColor: colorScheme.bg,
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          )
        `,
      }}
    >
      <StartupSound />

      {showWelcome && <WelcomeNotification onClose={handleCloseWelcome} colorScheme={colorScheme} />}

      {/* Desktop Icons */}
      <DesktopIcons icons={desktopIcons} />

      {/* Taskbar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 border-t-4 flex items-center justify-between px-4 py-2 flex-wrap gap-2"
        style={{
          backgroundColor: "#c0c0c0",
          borderColor: "#aaaaaa",
        }}
      >
        <div className="flex gap-2 flex-wrap">
          <RetroButton onClick={() => setShowFileExplorer(!showFileExplorer)}>FILES</RetroButton>
          <RetroButton onClick={() => setShowConsole(!showConsole)}>CONSOLE</RetroButton>
          <RetroButton onClick={() => setShowVibely(!showVibely)}>
            <span className="mr-1">✨</span>VIBELY
          </RetroButton>
          <ColorSchemeSelector onSchemeChange={setColorScheme} />
          <RetroButton onClick={handleLogout}>LOGOUT</RetroButton>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div style={{ color: "#000000", fontSize: "12px", fontFamily: "monospace" }}>{systemTime}</div>
          <div style={{ color: "#000000", fontSize: "10px", fontFamily: "monospace" }}>{user?.email}</div>
        </div>
      </div>

      {/* Windows */}
      {showFileExplorer && (
        <FileExplorer onClose={() => setShowFileExplorer(false)} onOpenFile={handleOpenFile} folder={currentFolder} />
      )}

      {showTextEditor && <TextEditor file={selectedFile} onClose={() => setShowTextEditor(false)} />}

      {showConsole && <ConsoleWindow onClose={() => setShowConsole(false)} />}

      {showVibely && <VielyChatbot onClose={() => setShowVibely(false)} />}
    </div>
  )
}
