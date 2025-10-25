"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push("/desktop")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0000aa" }}>
      <div className="w-full max-w-md p-8" style={{ backgroundColor: "#0000aa", border: "2px solid #aaaaaa" }}>
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: "#00aaaa", fontFamily: "monospace" }}>
          VIBEOS SIGNUP
        </h1>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: "#aaaaaa" }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border-2"
              style={{ borderColor: "#aaaaaa", backgroundColor: "#000000", color: "#00aa00" }}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: "#aaaaaa" }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border-2"
              style={{ borderColor: "#aaaaaa", backgroundColor: "#000000", color: "#00aa00" }}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: "#aaaaaa" }}>
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border-2"
              style={{ borderColor: "#aaaaaa", backgroundColor: "#000000", color: "#00aa00" }}
              required
            />
          </div>

          {error && (
            <div
              className="p-3 border-2"
              style={{ borderColor: "#aa0000", backgroundColor: "#000000", color: "#aa0000" }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 border-2 font-bold hover:opacity-80"
            style={{ borderColor: "#aaaaaa", backgroundColor: "#00aa00", color: "#000000" }}
          >
            {loading ? "SIGNING UP..." : "SIGN UP"}
          </button>
        </form>

        <div className="mt-6 text-center" style={{ color: "#aaaaaa" }}>
          <p className="text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline hover:opacity-80" style={{ color: "#00aaaa" }}>
              LOGIN
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
