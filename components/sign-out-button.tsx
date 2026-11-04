"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"

export function SignOutButton() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")

  async function signOut() {
    setPending(true)
    setError("")

    try {
      const result = await authClient.signOut()
      if (result.error) {
        setError("Unable to sign out. Please try again.")
        return
      }

      window.location.assign("/sign-in")
    } catch {
      setError("Sign-out is unavailable. Check your connection and try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={signOut}
        disabled={pending}
        className="min-h-10 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-60"
      >
        {pending ? "Signing out…" : "Sign out"}
      </button>
      {error && <p role="alert" className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  )
}
