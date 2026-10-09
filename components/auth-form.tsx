"use client"

import { FormEvent, useState } from "react"
import { authClient } from "@/lib/auth-client"

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const [accountCreated, setAccountCreated] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError("")
    const data = new FormData(event.currentTarget)

    try {
      const result = mode === "sign-in"
        ? await authClient.signIn.email({
            email: String(data.get("email")),
            password: String(data.get("password")),
          })
        : await authClient.signUp.email({
            email: String(data.get("email")),
            password: String(data.get("password")),
            name: String(data.get("name")),
          })

      if (result.error) {
        setError("Unable to authenticate with those details.")
        return
      }

      if (mode === "sign-up") {
        setAccountCreated(true)
        return
      }

      window.location.assign("/admin")
    } catch {
      setError("Sign-in is unavailable. Check your connection and try again.")
    } finally {
      setPending(false)
    }
  }

  if (accountCreated) {
    return (
      <main className="w-full max-w-md rounded-2xl border p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Portfolio admin</p>
        <h1 className="mt-3 text-3xl font-semibold">Account created</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Add this account&apos;s email as ADMIN_EMAIL in your local and production environment settings to allow dashboard access.
        </p>
        <a href="/sign-in" className="mt-6 inline-block text-sm font-medium underline underline-offset-4">
          Continue to sign in
        </a>
      </main>
    )
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border p-8 shadow-sm">
      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Portfolio admin</p>
      <h1 className="mt-3 text-3xl font-semibold">
        {mode === "sign-in" ? "Welcome back" : "Create admin account"}
      </h1>
      <div className="mt-8 grid gap-4">
        {mode === "sign-up" && (
          <input name="name" required placeholder="Name" className="rounded-lg border px-4 py-3" />
        )}
        <input name="email" type="email" required placeholder="Email" className="rounded-lg border px-4 py-3" />
        <input name="password" type="password" minLength={8} required placeholder="Password" className="rounded-lg border px-4 py-3" />
        <button disabled={pending} className="rounded-lg bg-foreground px-4 py-3 font-medium text-background disabled:opacity-60">
          {pending ? "Working…" : mode === "sign-in" ? "Sign in" : "Create account"}
        </button>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </div>
    </form>
  )
}
