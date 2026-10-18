"use client"

import { useState } from "react"
import { deleteProject, reorderProjects, saveProject } from "@/app/actions/projects"
import {
  deleteCertification,
  deleteEducation,
  deleteExperience,
  deleteSkill,
  reorderCertifications,
  reorderEducation,
  reorderExperiences,
  reorderSkills,
  saveCertification,
  saveEducation,
  saveExperience,
  saveSkill,
} from "@/app/actions/content"
import type {
  Certification,
  ContactSubmission,
  EducationEntry,
  Experience,
  Project,
  Skill,
} from "@/lib/db/schema"

const emptyProject = { title: "", description: "", tech: "", link: "", featured: false }
const emptySkill = { name: "", category: "general" }
const emptyExperience = { role: "", organization: "", period: "", description: "" }
const emptyEducation = { degree: "", institution: "", period: "", details: "", status: "In progress" }
const emptyCertificate = { title: "", issuer: "", date: "", url: "" }

function OrderControls({
  label,
  index,
  count,
  canMoveUp = index > 0,
  canMoveDown = index < count - 1,
  onMove,
}: {
  label: string
  index: number
  count: number
  canMoveUp?: boolean
  canMoveDown?: boolean
  onMove: (direction: -1 | 1) => void
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <button type="button" aria-label={`Move ${label} up`} title="Move up" disabled={!canMoveUp} onClick={() => onMove(-1)} className="rounded border px-2 py-1 disabled:opacity-40">↑</button>
      <button type="button" aria-label={`Move ${label} down`} title="Move down" disabled={!canMoveDown} onClick={() => onMove(1)} className="rounded border px-2 py-1 disabled:opacity-40">↓</button>
    </span>
  )
}

async function moveItem<T extends { id: number }>(
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
  } catch {
    window.location.reload()
  }
}

export function AdminProjects({
  initialProjects,
  initialSkills,
  initialExperiences,
  initialEducation,
  initialCertifications,
  initialMessages,
}: {
  initialProjects: Project[]
  initialSkills: Skill[]
  initialExperiences: Experience[]
  initialEducation: EducationEntry[]
  initialCertifications: Certification[]
  initialMessages: ContactSubmission[]
}) {
  const [projects, setProjects] = useState(initialProjects)
  const [projectForm, setProjectForm] = useState(emptyProject)
  const [projectEditing, setProjectEditing] = useState<number | null>(null)
  const [projectPending, setProjectPending] = useState(false)

  const [skills, setSkills] = useState(initialSkills)
  const [skillForm, setSkillForm] = useState(emptySkill)
  const [skillEditing, setSkillEditing] = useState<number | null>(null)
  const [skillPending, setSkillPending] = useState(false)

  const [experiences, setExperiences] = useState(initialExperiences)
  const [experienceForm, setExperienceForm] = useState(emptyExperience)
  const [experienceEditing, setExperienceEditing] = useState<number | null>(null)
  const [experiencePending, setExperiencePending] = useState(false)

  const [educationEntries, setEducationEntries] = useState(initialEducation)
  const [educationForm, setEducationForm] = useState(emptyEducation)
  const [educationEditing, setEducationEditing] = useState<number | null>(null)
  const [educationPending, setEducationPending] = useState(false)

  const [certifications, setCertifications] = useState(initialCertifications)
  const [certificateForm, setCertificateForm] = useState(emptyCertificate)
  const [certificateEditing, setCertificateEditing] = useState<number | null>(null)
  const [certificatePending, setCertificatePending] = useState(false)

  async function submitProject(event: React.FormEvent) {
    event.preventDefault()
    setProjectPending(true)
    await saveProject(projectForm, projectEditing ?? undefined)
    setProjectPending(false)
    window.location.reload()
  }

  async function removeProject(id: number) {
    await deleteProject(id)
    setProjects((current) => current.filter((item) => item.id !== id))
  }

  async function submitSkill(event: React.FormEvent) {
    event.preventDefault()
    setSkillPending(true)
    await saveSkill(skillForm, skillEditing ?? undefined)
    setSkillPending(false)
    window.location.reload()
  }

  async function removeSkill(id: number) {
    await deleteSkill(id)
    setSkills((current) => current.filter((item) => item.id !== id))
  }

  async function submitExperience(event: React.FormEvent) {
    event.preventDefault()
    setExperiencePending(true)
    await saveExperience(experienceForm, experienceEditing ?? undefined)
    setExperiencePending(false)
    window.location.reload()
  }

  async function removeExperience(id: number) {
    await deleteExperience(id)
    setExperiences((current) => current.filter((item) => item.id !== id))
  }

  async function submitEducation(event: React.FormEvent) {
    event.preventDefault()
    setEducationPending(true)
    await saveEducation(educationForm, educationEditing ?? undefined)
    setEducationPending(false)
    window.location.reload()
  }

  async function removeEducation(id: number) {
    await deleteEducation(id)
    setEducationEntries((current) => current.filter((item) => item.id !== id))
  }

  async function submitCertificate(event: React.FormEvent) {
    event.preventDefault()
    setCertificatePending(true)
    await saveCertification(certificateForm, certificateEditing ?? undefined)
    setCertificatePending(false)
    window.location.reload()
  }

  async function removeCertificate(id: number) {
    await deleteCertification(id)
    setCertifications((current) => current.filter((item) => item.id !== id))
  }

  const sectionClass = "rounded-2xl border bg-background p-5"

  return (
    <div className="space-y-8">
      <section className={`${sectionClass} scroll-mt-6`}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">Projects</h3>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-3">
            {projects.length === 0 ? (
              <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No projects yet.</p>
            ) : (
              projects.map((item, index) => (
                <article key={item.id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold">{item.title}</h4>
                        {item.featured && <span className="rounded border border-lime-600/30 bg-lime-500/10 px-2 py-0.5 text-xs font-medium text-lime-700 dark:text-lime-300">Featured</span>}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{item.tech}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-2 text-sm">
                      <OrderControls
                        label="project"
                        index={index}
                        count={projects.length}
                        canMoveUp={index > 0 && projects[index - 1].featured === item.featured}
                        canMoveDown={index < projects.length - 1 && projects[index + 1].featured === item.featured}
                        onMove={(direction) => void moveItem(projects, item.id, direction, setProjects, reorderProjects)}
                      />
                      <button
                        type="button"
                        className="underline"
                        onClick={() => {
                          setProjectEditing(item.id)
                          setProjectForm({
                            title: item.title,
                            description: item.description,
                            tech: item.tech,
                            link: item.link ?? "",
                            featured: item.featured,
                          })
                        }}
                      >
                        Edit
                      </button>
                      <button type="button" className="text-destructive underline" onClick={() => removeProject(item.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
                </article>
              ))
            )}
          </div>

          <form onSubmit={submitProject} className="rounded-xl border p-4">
            <h4 className="text-lg font-semibold">{projectEditing ? "Update project" : "New project"}</h4>
            <div className="mt-4 grid gap-3">
              <input
                value={projectForm.title}
                onChange={(event) => setProjectForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Title"
                className="rounded-lg border px-3 py-2"
                required
              />
              <input
                value={projectForm.tech}
                onChange={(event) => setProjectForm((current) => ({ ...current, tech: event.target.value }))}
                placeholder="Tech stack"
                className="rounded-lg border px-3 py-2"
                required
              />
              <input
                value={projectForm.link}
                onChange={(event) => setProjectForm((current) => ({ ...current, link: event.target.value }))}
                placeholder="Project URL"
                className="rounded-lg border px-3 py-2"
              />
              <textarea
                value={projectForm.description}
                onChange={(event) => setProjectForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Description"
                className="rounded-lg border px-3 py-2"
                rows={5}
                required
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={projectForm.featured}
                  onChange={(event) => setProjectForm((current) => ({ ...current, featured: event.target.checked }))}
                />
                Feature this project
              </label>
              <div className="flex gap-2">
                <button type="submit" disabled={projectPending} className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60">
                  {projectPending ? "Saving…" : projectEditing ? "Update" : "Add"}
                </button>
                {projectEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setProjectEditing(null)
                      setProjectForm(emptyProject)
                    }}
                    className="rounded-lg border px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>

      <section id="skills" className={`${sectionClass} scroll-mt-6`}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">Skills</h3>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-wrap gap-2">
            {skills.length === 0 ? (
              <p className="text-sm text-muted-foreground">No skills yet.</p>
            ) : (
              skills.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm">
                  <span>{item.name}</span>
                  <OrderControls label="skill" index={index} count={skills.length} onMove={(direction) => void moveItem(skills, item.id, direction, setSkills, reorderSkills)} />
                  <button
                    type="button"
                    aria-label={`Edit ${item.name}`}
                    onClick={() => {
                      setSkillEditing(item.id)
                      setSkillForm({ name: item.name, category: item.category })
                    }}
                    className="underline"
                  >
                    Edit
                  </button>
                  <button type="button" aria-label={`Delete ${item.name}`} onClick={() => removeSkill(item.id)} className="text-destructive">
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
          <form onSubmit={submitSkill} className="rounded-xl border p-4">
            <h4 className="text-lg font-semibold">{skillEditing ? "Update skill" : "New skill"}</h4>
            <div className="mt-4 grid gap-3">
              <input
                value={skillForm.name}
                onChange={(event) => setSkillForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Skill name"
                className="rounded-lg border px-3 py-2"
                required
              />
              <input
                value={skillForm.category}
                onChange={(event) => setSkillForm((current) => ({ ...current, category: event.target.value }))}
                placeholder="Category (frontend, backend, tools)"
                className="rounded-lg border px-3 py-2"
                required
              />
              <div className="flex gap-2">
                <button type="submit" disabled={skillPending} className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60">
                  {skillPending ? "Saving…" : skillEditing ? "Update" : "Add"}
                </button>
                {skillEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setSkillEditing(null)
                      setSkillForm(emptySkill)
                    }}
                    className="rounded-lg border px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>

      <section id="experience" className={`${sectionClass} scroll-mt-6`}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">Experience</h3>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-3">
            {experiences.length === 0 ? (
              <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No experience yet.</p>
            ) : (
              experiences.map((item, index) => (
                <article key={item.id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.period}</p>
                      <h4 className="mt-2 font-semibold">{item.role}</h4>
                      <p className="text-sm text-muted-foreground">@ {item.organization}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <OrderControls label="experience" index={index} count={experiences.length} onMove={(direction) => void moveItem(experiences, item.id, direction, setExperiences, reorderExperiences)} />
                      <button
                        type="button"
                        className="underline"
                        onClick={() => {
                          setExperienceEditing(item.id)
                          setExperienceForm({
                            role: item.role,
                            organization: item.organization,
                            period: item.period,
                            description: item.description,
                          })
                        }}
                      >
                        Edit
                      </button>
                      <button type="button" className="text-destructive underline" onClick={() => removeExperience(item.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
                </article>
              ))
            )}
          </div>
          <form onSubmit={submitExperience} className="rounded-xl border p-4">
            <h4 className="text-lg font-semibold">{experienceEditing ? "Update experience" : "New experience"}</h4>
            <div className="mt-4 grid gap-3">
              <input
                value={experienceForm.role}
                onChange={(event) => setExperienceForm((current) => ({ ...current, role: event.target.value }))}
                placeholder="Role"
                className="rounded-lg border px-3 py-2"
                required
              />
              <input
                value={experienceForm.organization}
                onChange={(event) => setExperienceForm((current) => ({ ...current, organization: event.target.value }))}
                placeholder="Organization"
                className="rounded-lg border px-3 py-2"
                required
              />
              <input
                value={experienceForm.period}
                onChange={(event) => setExperienceForm((current) => ({ ...current, period: event.target.value }))}
                placeholder="Period e.g. 2024 — NOW"
                className="rounded-lg border px-3 py-2"
                required
              />
              <textarea
                value={experienceForm.description}
                onChange={(event) => setExperienceForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Description"
                rows={4}
                className="rounded-lg border px-3 py-2"
                required
              />
              <div className="flex gap-2">
                <button type="submit" disabled={experiencePending} className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60">
                  {experiencePending ? "Saving…" : experienceEditing ? "Update" : "Add"}
                </button>
                {experienceEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setExperienceEditing(null)
                      setExperienceForm(emptyExperience)
                    }}
                    className="rounded-lg border px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>

      <section id="education" className={`${sectionClass} scroll-mt-6`}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">Education</h3>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-3">
            {educationEntries.length === 0 ? (
              <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No education entries yet.</p>
            ) : (
              educationEntries.map((item, index) => (
                <article key={item.id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.period}</p>
                      <h4 className="mt-2 font-semibold">{item.degree}</h4>
                      <p className="text-sm text-muted-foreground">{item.institution}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <OrderControls label="education" index={index} count={educationEntries.length} onMove={(direction) => void moveItem(educationEntries, item.id, direction, setEducationEntries, reorderEducation)} />
                      <button
                        type="button"
                        className="underline"
                        onClick={() => {
                          setEducationEditing(item.id)
                          setEducationForm({
                            degree: item.degree,
                            institution: item.institution,
                            period: item.period,
                            details: item.details,
                            status: item.status,
                          })
                        }}
                      >
                        Edit
                      </button>
                      <button type="button" className="text-destructive underline" onClick={() => removeEducation(item.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{item.details}</p>
                </article>
              ))
            )}
          </div>
          <form onSubmit={submitEducation} className="rounded-xl border p-4">
            <h4 className="text-lg font-semibold">{educationEditing ? "Update education" : "New education"}</h4>
            <div className="mt-4 grid gap-3">
              <input
                value={educationForm.degree}
                onChange={(event) => setEducationForm((current) => ({ ...current, degree: event.target.value }))}
                placeholder="Degree"
                className="rounded-lg border px-3 py-2"
                required
              />
              <input
                value={educationForm.institution}
                onChange={(event) => setEducationForm((current) => ({ ...current, institution: event.target.value }))}
                placeholder="Institution"
                className="rounded-lg border px-3 py-2"
                required
              />
              <input
                value={educationForm.period}
                onChange={(event) => setEducationForm((current) => ({ ...current, period: event.target.value }))}
                placeholder="Period"
                className="rounded-lg border px-3 py-2"
                required
              />
              <input
                value={educationForm.status}
                onChange={(event) => setEducationForm((current) => ({ ...current, status: event.target.value }))}
                placeholder="Status e.g. In progress"
                className="rounded-lg border px-3 py-2"
                required
              />
              <textarea
                value={educationForm.details}
                onChange={(event) => setEducationForm((current) => ({ ...current, details: event.target.value }))}
                placeholder="Details"
                rows={4}
                className="rounded-lg border px-3 py-2"
                required
              />
              <div className="flex gap-2">
                <button type="submit" disabled={educationPending} className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60">
                  {educationPending ? "Saving…" : educationEditing ? "Update" : "Add"}
                </button>
                {educationEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setEducationEditing(null)
                      setEducationForm(emptyEducation)
                    }}
                    className="rounded-lg border px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>

      <section id="certificates" className={`${sectionClass} scroll-mt-6`}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">Certificates</h3>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-3">
            {certifications.length === 0 ? (
              <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No certificates yet.</p>
            ) : (
              certifications.map((item, index) => (
                <article key={item.id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.issuer} · {item.date}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <OrderControls label="certificate" index={index} count={certifications.length} onMove={(direction) => void moveItem(certifications, item.id, direction, setCertifications, reorderCertifications)} />
                      <button
                        type="button"
                        className="underline"
                        onClick={() => {
                          setCertificateEditing(item.id)
                          setCertificateForm({
                            title: item.title,
                            issuer: item.issuer,
                            date: item.date,
                            url: item.url ?? "",
                          })
                        }}
                      >
                        Edit
                      </button>
                      <button type="button" className="text-destructive underline" onClick={() => removeCertificate(item.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm underline">
                      Open credential
                    </a>
                  )}
                </article>
              ))
            )}
          </div>
          <form onSubmit={submitCertificate} className="rounded-xl border p-4">
            <h4 className="text-lg font-semibold">{certificateEditing ? "Update certificate" : "New certificate"}</h4>
            <div className="mt-4 grid gap-3">
              <input
                value={certificateForm.title}
                onChange={(event) => setCertificateForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Title"
                className="rounded-lg border px-3 py-2"
                required
              />
              <input
                value={certificateForm.issuer}
                onChange={(event) => setCertificateForm((current) => ({ ...current, issuer: event.target.value }))}
                placeholder="Issuer"
                className="rounded-lg border px-3 py-2"
                required
              />
              <input
                value={certificateForm.date}
                onChange={(event) => setCertificateForm((current) => ({ ...current, date: event.target.value }))}
                placeholder="Date"
                className="rounded-lg border px-3 py-2"
                required
              />
              <input
                value={certificateForm.url}
                onChange={(event) => setCertificateForm((current) => ({ ...current, url: event.target.value }))}
                placeholder="Credential URL (optional)"
                className="rounded-lg border px-3 py-2"
              />
              <div className="flex gap-2">
                <button type="submit" disabled={certificatePending} className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60">
                  {certificatePending ? "Saving…" : certificateEditing ? "Update" : "Add"}
                </button>
                {certificateEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setCertificateEditing(null)
                      setCertificateForm(emptyCertificate)
                    }}
                    className="rounded-lg border px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>

      <section id="messages" className={`${sectionClass} scroll-mt-6`}>
        <div className="mb-5">
          <h3 className="text-xl font-semibold">Messages</h3>
          <p className="mt-1 text-sm text-muted-foreground">Contact form submissions, newest first.</p>
        </div>
        {initialMessages.length === 0 ? (
          <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No contact messages yet.</p>
        ) : (
          <div className="grid gap-3">
            {initialMessages.map((message) => (
              <article key={message.id} className="rounded-xl border bg-background p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold">{message.name}</h4>
                    <a href={`mailto:${message.email}`} className="mt-1 inline-block text-sm font-medium underline underline-offset-4">
                      {message.email}
                    </a>
                  </div>
                  <time dateTime={message.createdAt.toISOString()} className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(message.createdAt)}
                  </time>
                </div>
                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6">{message.message}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
