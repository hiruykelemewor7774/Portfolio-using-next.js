import { notFound } from "next/navigation"
import { AuthForm } from "@/components/auth-form"

export default function SignUpPage() {
  if (process.env.NODE_ENV === "production") notFound()

  return (
    <main className="grid min-h-screen place-items-center p-6">
      <AuthForm mode="sign-up" />
    </main>
  )
}