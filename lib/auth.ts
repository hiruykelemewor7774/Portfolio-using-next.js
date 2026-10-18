import { betterAuth } from "better-auth"
import { Pool } from "pg"

const origin = (value?: string) => value ? (value.startsWith("http") ? value : `https://${value}`) : undefined
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.BETTER_AUTH_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || process.env.V0_RUNTIME_URL || "http://localhost:3000"
const baseURL = origin(siteUrl)
const trustedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  baseURL,
  ...[
    process.env.V0_RUNTIME_URL,
    process.env.V0_DEV_APP_URL,
    process.env.V0_BUILD_URL,
    process.env.V0_SANDBOX_URL,
    process.env.VERCEL_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.BETTER_AUTH_URL,
  ].map(origin).filter(Boolean),
] as string[]

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "development-secret-change-me",
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  baseURL,
  trustedOrigins,
  emailAndPassword: { enabled: true, disableSignUp: process.env.NODE_ENV === "production" },
})
