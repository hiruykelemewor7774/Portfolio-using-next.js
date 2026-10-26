"use client"

import { useRef, useState } from "react"
import { ImagePlus } from "lucide-react"
import {
  deleteJournalEntry,
  deleteService,
  deleteSocialAccount,
  reorderJournalEntries,
  reorderServices,
  reorderSocialAccounts,
  saveJournalEntry,
  savePortfolioProfile,
  saveService,
  saveSiteSettings,
  saveSocialAccount,
} from "@/app/actions/content"
import type { JournalEntry, PortfolioProfile, Service, SiteSettings, SocialAccount } from "@/lib/db/schema"
import { notifyPortfolioContentChanged } from "@/lib/content-events"

const emptyService = { title: "", description: "", icon: "Code2" as "Code2" | "Layers3" | "Database" }
const emptyJournal = { category: "", title: "", excerpt: "", url: "" }
const emptySocial = { platform: "", url: "" }
const defaultProfile = {
  displayName: "Alemu Kelemework",
  role: "Full-Stack Developer",
  portraitUrl: "/alemu-portrait.png",
  heroIntro: "I build modern web applications and solve real-world problems.",
  heroDetail: "I'm a fourth-year Computer Science student at Mizan-Tepi University and a Software Engineering Intern at Ethio Telecom.",
  aboutPrimary: "I'm a fourth-year Computer Science student at Mizan-Tepi University and a Software Engineering Intern at Ethio Telecom in Dembel, Addis Ababa.",
  aboutSecondary: "My work sits at the intersection of clean engineering and human-centered design. I turn complex requirements into simple, scalable experiences that teams can actually use.",
  yearsLearning: "04+",
  projectsCompleted: "10+",
}
const defaultSettings = {
  siteTitle: "Alemu Kelemework — Developer Portfolio",
  contactEmail: "alemukelemework363@gmail.com",
  resumeUrl: "/alemu-kelemework-cv.pdf",
}

async function moveRecord<T extends { id: number }>(
  items: T[],
  id: number,
  direction: -1 | 1,
  setItems: (items: T[]) => void,
  persist: (ids: number[]) => Promise<void>,
) {
  const currentIndex = items.findIndex((item) => item.id === id)
  const nextIndex = currentIndex + direction
  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= items.length) return
  const reordered = [...items]
  ;[reordered[currentIndex], reordered[nextIndex]] = [reordered[nextIndex], reordered[currentIndex]]
  setItems(reordered)
  try {
    await persist(reordered.map((item) => item.id))
    notifyPortfolioContentChanged()
  } catch {
    window.location.reload()
  }
}

function SectionHeading({ title, count }: { title: string; count?: number }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Portfolio content</p>
        <h2 className="mt-1 text-xl font-semibold sm:text-2xl">{title}</h2>
      </div>
      {count !== undefined && <span className="text-sm text-muted-foreground">{count} {count === 1 ? "item" : "items"}</span>}
    </div>
  )
}

function TextField({ label, value, onChange, required = true, type = "text" }: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  type?: string
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} className="min-h-10 rounded-lg border bg-background px-3 py-2 font-normal" />
    </label>
  )
}

function TextAreaField({ label, value, onChange, rows = 4 }: {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={rows} required className="rounded-lg border bg-background px-3 py-2 font-normal" />
    </label>
  )
}

export function AdminContentPages({
  activeSection,
  initialProfile,
  initialSettings,
  initialServices,
  initialJournal,
  initialSocialAccounts,
}: {
  activeSection: string
  initialProfile: PortfolioProfile | null
  initialSettings: SiteSettings | null
  initialServices: Service[]
  initialJournal: JournalEntry[]
  initialSocialAccounts: SocialAccount[]
}) {
  const [profile, setProfile] = useState(initialProfile ?? defaultProfile)
  const portraitInput = useRef<HTMLInputElement>(null)
  const [portraitError, setPortraitError] = useState("")
  const [settings, setSettings] = useState(initialSettings ?? defaultSettings)
  const [services, setServices] = useState(initialServices)
  const [serviceForm, setServiceForm] = useState(emptyService)
  const [serviceEditing, setServiceEditing] = useState<number | null>(null)
  const [journal, setJournal] = useState(initialJournal)
  const [journalForm, setJournalForm] = useState(emptyJournal)
  const [journalEditing, setJournalEditing] = useState<number | null>(null)
  const [socialAccounts, setSocialAccounts] = useState(initialSocialAccounts)
  const [socialForm, setSocialForm] = useState(emptySocial)
  const [socialEditing, setSocialEditing] = useState<number | null>(null)
  const [pending, setPending] = useState(false)

  async function submitProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    await savePortfolioProfile(profile)
    notifyPortfolioContentChanged()
    setPending(false)
  }

  async function uploadPortrait(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const file = input.files?.[0]
    if (!file) return
    setPortraitError("")
    if (!file.type.startsWith("image/") || file.size > 12 * 1024 * 1024) {
      setPortraitError("Choose an image smaller than 12 MB.")
      input.value = ""
      return
    }

    try {
      const bitmap = await createImageBitmap(file)
      const scale = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height))
      const canvas = document.createElement("canvas")
      canvas.width = Math.round(bitmap.width * scale)
      canvas.height = Math.round(bitmap.height * scale)
      const context = canvas.getContext("2d")
      if (!context) throw new Error("Image processing is unavailable.")
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
      bitmap.close()
      const portraitUrl = canvas.toDataURL("image/webp", 0.78)
      if (portraitUrl.length > 900_000) throw new Error("This image is still too large. Choose a smaller image.")
      setProfile((current) => ({ ...current, portraitUrl }))
    } catch (error) {
      setPortraitError(error instanceof Error ? error.message : "Could not read this image.")
    } finally {
      input.value = ""
    }
  }

  async function submitSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    await saveSiteSettings(settings)
    notifyPortfolioContentChanged()
    setPending(false)
  }

  async function submitService(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    await saveService(serviceForm, serviceEditing ?? undefined)
    notifyPortfolioContentChanged()
    setPending(false)
    window.location.reload()
  }

  async function submitJournal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    await saveJournalEntry(journalForm, journalEditing ?? undefined)
    notifyPortfolioContentChanged()
    setPending(false)
    window.location.reload()
  }

  async function submitSocial(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    await saveSocialAccount(socialForm, socialEditing ?? undefined)
    notifyPortfolioContentChanged()
    setPending(false)
    window.location.reload()
  }

  const sectionClass = "admin-editor-shell rounded-xl border bg-background p-5 shadow-sm"
  const itemCardClass = "admin-item-card rounded-xl border p-4"
  const formPanelClass = "admin-form-panel grid content-start gap-3 rounded-xl border p-4"

  if (activeSection === "profile") {
    return (
      <section className={sectionClass}>
        <SectionHeading title="Profile" />
        <form onSubmit={submitProfile} className="grid gap-5 lg:grid-cols-2">
          <TextField label="Display name" value={profile.displayName} onChange={(displayName) => setProfile((current) => ({ ...current, displayName }))} />
          <TextField label="Professional role" value={profile.role} onChange={(role) => setProfile((current) => ({ ...current, role }))} />
          <div className="flex flex-wrap items-center gap-4 lg:col-span-2">
            <img src={profile.portraitUrl} alt="Profile portrait preview" className="size-28 rounded-full border object-cover" />
            <div className="grid justify-items-start gap-2">
              <input ref={portraitInput} type="file" accept="image/*" onChange={uploadPortrait} className="sr-only" />
              <button type="button" onClick={() => portraitInput.current?.click()} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium">
                <ImagePlus className="size-4" /> Add image
              </button>
              <p className="text-xs text-muted-foreground">The image appears in the public profile.</p>
              {portraitError && <p role="alert" className="text-sm text-destructive">{portraitError}</p>}
            </div>
          </div>
          <TextAreaField label="Hero introduction" value={profile.heroIntro} onChange={(heroIntro) => setProfile((current) => ({ ...current, heroIntro }))} />
          <TextAreaField label="Hero supporting text" value={profile.heroDetail} onChange={(heroDetail) => setProfile((current) => ({ ...current, heroDetail }))} />
          <TextAreaField label="About paragraph one" value={profile.aboutPrimary} onChange={(aboutPrimary) => setProfile((current) => ({ ...current, aboutPrimary }))} />
          <TextAreaField label="About paragraph two" value={profile.aboutSecondary} onChange={(aboutSecondary) => setProfile((current) => ({ ...current, aboutSecondary }))} />
          <TextField label="Years learning metric" value={profile.yearsLearning} onChange={(yearsLearning) => setProfile((current) => ({ ...current, yearsLearning }))} />
          <TextField label="Projects completed metric" value={profile.projectsCompleted} onChange={(projectsCompleted) => setProfile((current) => ({ ...current, projectsCompleted }))} />
          <div className="lg:col-span-2">
            <button type="submit" disabled={pending} className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60">{pending ? "Saving…" : "Save profile"}</button>
          </div>
        </form>
      </section>
    )
  }

  if (activeSection === "settings") {
    return (
      <section className={sectionClass}>
        <SectionHeading title="Settings" />
        <form onSubmit={submitSettings} className="grid gap-4 sm:max-w-2xl">
          <TextField label="Site title" value={settings.siteTitle} onChange={(siteTitle) => setSettings((current) => ({ ...current, siteTitle }))} />
          <TextField label="Contact email" type="email" value={settings.contactEmail} onChange={(contactEmail) => setSettings((current) => ({ ...current, contactEmail }))} />
          <TextField label="Resume URL" value={settings.resumeUrl} onChange={(resumeUrl) => setSettings((current) => ({ ...current, resumeUrl }))} />
          <div><button type="submit" disabled={pending} className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60">{pending ? "Saving…" : "Save settings"}</button></div>
        </form>
      </section>
    )
  }

  if (activeSection === "services") {
    return (
      <section className={sectionClass}>
        <SectionHeading title="Services" count={services.length} />
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid content-start gap-3">
            {services.length === 0 ? <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No services yet.</p> : services.map((item, index) => (
              <article key={item.id} className={itemCardClass}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><h3 className="font-semibold">{item.title}</h3><p className="mt-1 text-sm text-muted-foreground">{item.description}</p></div>
                  <div className="flex items-center gap-2 text-sm">
                    <button type="button" title="Move up" aria-label={`Move ${item.title} up`} disabled={index === 0} onClick={() => void moveRecord(services, item.id, -1, setServices, reorderServices)} className="rounded border px-2 py-1 disabled:opacity-40">↑</button>
                    <button type="button" title="Move down" aria-label={`Move ${item.title} down`} disabled={index === services.length - 1} onClick={() => void moveRecord(services, item.id, 1, setServices, reorderServices)} className="rounded border px-2 py-1 disabled:opacity-40">↓</button>
                    <button type="button" className="underline" onClick={() => { setServiceEditing(item.id); setServiceForm({ title: item.title, description: item.description, icon: item.icon as typeof emptyService.icon }) }}>Edit</button>
                    <button type="button" className="text-destructive underline" onClick={async () => { await deleteService(item.id); notifyPortfolioContentChanged(); setServices((current) => current.filter((entry) => entry.id !== item.id)) }}>Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <form onSubmit={submitService} className={formPanelClass}>
            <h3 className="font-semibold">{serviceEditing ? "Edit service" : "Add service"}</h3>
            <TextField label="Title" value={serviceForm.title} onChange={(title) => setServiceForm((current) => ({ ...current, title }))} />
            <TextAreaField label="Description" value={serviceForm.description} onChange={(description) => setServiceForm((current) => ({ ...current, description }))} />
            <label className="grid gap-1.5 text-sm font-medium">Icon<select value={serviceForm.icon} onChange={(event) => setServiceForm((current) => ({ ...current, icon: event.target.value as typeof emptyService.icon }))} className="min-h-10 rounded-lg border bg-background px-3 py-2"><option value="Code2">Code</option><option value="Layers3">Layers</option><option value="Database">Database</option></select></label>
            <div className="flex gap-2"><button type="submit" disabled={pending} className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60">{pending ? "Saving…" : serviceEditing ? "Update service" : "Add service"}</button>{serviceEditing && <button type="button" className="rounded-lg border px-4 py-2 text-sm" onClick={() => { setServiceEditing(null); setServiceForm(emptyService) }}>Cancel</button>}</div>
          </form>
        </div>
      </section>
    )
  }

  if (activeSection === "journal") {
    return (
      <section className={sectionClass}>
        <SectionHeading title="Journal" count={journal.length} />
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid content-start gap-3">
            {journal.length === 0 ? <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No journal entries yet.</p> : journal.map((item, index) => (
              <article key={item.id} className={itemCardClass}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{item.category}</p><h3 className="mt-1 font-semibold">{item.title}</h3><p className="mt-1 text-sm text-muted-foreground">{item.excerpt}</p></div>
                  <div className="flex items-center gap-2 text-sm">
                    <button type="button" title="Move up" aria-label={`Move ${item.title} up`} disabled={index === 0} onClick={() => void moveRecord(journal, item.id, -1, setJournal, reorderJournalEntries)} className="rounded border px-2 py-1 disabled:opacity-40">↑</button>
                    <button type="button" title="Move down" aria-label={`Move ${item.title} down`} disabled={index === journal.length - 1} onClick={() => void moveRecord(journal, item.id, 1, setJournal, reorderJournalEntries)} className="rounded border px-2 py-1 disabled:opacity-40">↓</button>
                    <button type="button" className="underline" onClick={() => { setJournalEditing(item.id); setJournalForm({ category: item.category, title: item.title, excerpt: item.excerpt, url: item.url ?? "" }) }}>Edit</button>
                    <button type="button" className="text-destructive underline" onClick={async () => { await deleteJournalEntry(item.id); notifyPortfolioContentChanged(); setJournal((current) => current.filter((entry) => entry.id !== item.id)) }}>Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <form onSubmit={submitJournal} className={formPanelClass}>
            <h3 className="font-semibold">{journalEditing ? "Edit entry" : "Add entry"}</h3>
            <TextField label="Category" value={journalForm.category} onChange={(category) => setJournalForm((current) => ({ ...current, category }))} />
            <TextField label="Title" value={journalForm.title} onChange={(title) => setJournalForm((current) => ({ ...current, title }))} />
            <TextAreaField label="Excerpt" value={journalForm.excerpt} onChange={(excerpt) => setJournalForm((current) => ({ ...current, excerpt }))} />
            <TextField label="Article URL" required={false} value={journalForm.url} onChange={(url) => setJournalForm((current) => ({ ...current, url }))} />
            <div className="flex gap-2"><button type="submit" disabled={pending} className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60">{pending ? "Saving…" : journalEditing ? "Update entry" : "Add entry"}</button>{journalEditing && <button type="button" className="rounded-lg border px-4 py-2 text-sm" onClick={() => { setJournalEditing(null); setJournalForm(emptyJournal) }}>Cancel</button>}</div>
          </form>
        </div>
      </section>
    )
  }

  if (activeSection === "social-accounts") {
    return (
      <section className={sectionClass}>
        <SectionHeading title="Social accounts" count={socialAccounts.length} />
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid content-start gap-3">
            {socialAccounts.length === 0 ? <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No social accounts yet.</p> : socialAccounts.map((item, index) => (
              <article key={item.id} className={`${itemCardClass} flex flex-wrap items-center justify-between gap-3`}>
                <div><h3 className="font-semibold">{item.platform}</h3><a href={item.url} target="_blank" rel="noreferrer" className="break-all text-sm text-muted-foreground underline">{item.url}</a></div>
                <div className="flex items-center gap-2 text-sm">
                  <button type="button" title="Move up" aria-label={`Move ${item.platform} up`} disabled={index === 0} onClick={() => void moveRecord(socialAccounts, item.id, -1, setSocialAccounts, reorderSocialAccounts)} className="rounded border px-2 py-1 disabled:opacity-40">↑</button>
                  <button type="button" title="Move down" aria-label={`Move ${item.platform} down`} disabled={index === socialAccounts.length - 1} onClick={() => void moveRecord(socialAccounts, item.id, 1, setSocialAccounts, reorderSocialAccounts)} className="rounded border px-2 py-1 disabled:opacity-40">↓</button>
                  <button type="button" className="underline" onClick={() => { setSocialEditing(item.id); setSocialForm({ platform: item.platform, url: item.url }) }}>Edit</button>
                  <button type="button" className="text-destructive underline" onClick={async () => { await deleteSocialAccount(item.id); notifyPortfolioContentChanged(); setSocialAccounts((current) => current.filter((entry) => entry.id !== item.id)) }}>Delete</button>
                </div>
              </article>
            ))}
          </div>
          <form onSubmit={submitSocial} className={formPanelClass}>
            <h3 className="font-semibold">{socialEditing ? "Edit account" : "Add account"}</h3>
            <TextField label="Platform" value={socialForm.platform} onChange={(platform) => setSocialForm((current) => ({ ...current, platform }))} />
            <TextField label="Profile URL" type="url" value={socialForm.url} onChange={(url) => setSocialForm((current) => ({ ...current, url }))} />
            <div className="flex gap-2"><button type="submit" disabled={pending} className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60">{pending ? "Saving…" : socialEditing ? "Update account" : "Add account"}</button>{socialEditing && <button type="button" className="rounded-lg border px-4 py-2 text-sm" onClick={() => { setSocialEditing(null); setSocialForm(emptySocial) }}>Cancel</button>}</div>
          </form>
        </div>
      </section>
    )
  }

  return null
}
