import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { listProjects } from "@/app/actions/projects"
import { AdminProjects } from "@/components/admin-projects"

const nav = ["Dashboard", "Profile", "Projects", "Experience", "Education", "Skills", "Services", "Journal", "Social accounts", "Messages", "Settings"]

function AdminNav() {
  return (
    <nav className="grid gap-1" aria-label="Admin navigation">
      {nav.map((item, index) => (
        <a key={item} href={index === 2 ? "#projects" : "#"} className={`rounded-lg px-3 py-2 text-sm transition-colors ${index === 2 ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
          {item}
        </a>
      ))}
    </nav>
  )
}

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  if (!session?.user || !adminEmail || session.user.email.toLowerCase() !== adminEmail) redirect("/sign-in")
  const projects = await listProjects()

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-60 shrink-0 border-r bg-background p-5 md:block">
          <a href="/" className="text-lg font-semibold tracking-tight">alemu<span className="text-lime-500">.</span>dev</a>
          <p className="mt-1 text-xs text-muted-foreground">Portfolio CMS</p>
          <div className="mt-10"><AdminNav /></div>
        </aside>
        <div className="min-w-0 flex-1 px-4 py-5 sm:px-8 sm:py-8 lg:px-10">
          <header className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Control room</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-4xl">Good morning, {session.user.name || "Alemu"}</h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">Manage the content that powers your public portfolio.</p>
            </div>
            <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
              <span className="hidden max-w-48 truncate text-xs text-muted-foreground sm:inline">{session.user.email}</span>
              <form action="/api/auth/sign-out" method="post"><button className="min-h-10 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">Sign out</button></form>
            </div>
          </header>

          <details className="mb-6 rounded-xl border bg-background p-4 md:hidden">
            <summary className="cursor-pointer list-none text-sm font-medium">Open admin navigation</summary>
            <div className="mt-4"><AdminNav /></div>
          </details>

          <section className="mb-6 grid gap-3 sm:mb-8 sm:grid-cols-3" aria-label="Portfolio overview">
            <div className="rounded-xl border bg-background p-4"><p className="text-xs text-muted-foreground">Published projects</p><p className="mt-2 text-2xl font-semibold">{projects.length}</p></div>
            <div className="rounded-xl border bg-background p-4"><p className="text-xs text-muted-foreground">Editing mode</p><p className="mt-2 text-2xl font-semibold">Live</p></div>
            <div className="rounded-xl border bg-background p-4"><p className="text-xs text-muted-foreground">Public site</p><a href="/" className="mt-2 inline-block text-sm font-medium underline underline-offset-4">View portfolio</a></div>
          </section>

          <section id="projects" className="scroll-mt-6">
            <div className="mb-4"><p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Content</p><h2 className="mt-1 text-xl font-semibold sm:text-2xl">Projects</h2><p className="mt-1 text-sm text-muted-foreground">Add new work or edit existing projects. Changes appear on the public site.</p></div>
            <AdminProjects initialProjects={projects} />
          </section>
        </div>
      </div>
    </main>
  )
}
