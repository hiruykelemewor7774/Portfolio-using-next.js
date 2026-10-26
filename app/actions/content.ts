"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { certifications, contactSubmissions, education, experiences, journalEntries, portfolioProfile, projects, services, siteSettings, skills, socialAccounts } from "@/lib/db/schema"
import { asc, desc, eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const skillSchema = z.object({
  name: z.string().trim().min(2),
  category: z.string().trim().min(1).default("general"),
})

const experienceSchema = z.object({
  role: z.string().trim().min(2),
  organization: z.string().trim().min(2),
  period: z.string().trim().min(2),
  description: z.string().trim().min(10),
})

const educationSchema = z.object({
  degree: z.string().trim().min(2),
  institution: z.string().trim().min(2),
  period: z.string().trim().min(2),
  details: z.string().trim().min(10),
  status: z.string().trim().min(1).default("In progress"),
})

const certificateSchema = z.object({
  title: z.string().trim().min(2),
  issuer: z.string().trim().min(2),
  date: z.string().trim().min(2),
  url: z.string().trim().optional().or(z.literal("")),
})

const profileSchema = z.object({
  displayName: z.string().trim().min(2),
  role: z.string().trim().min(2),
  portraitUrl: z.string().trim().min(1).max(1_000_000).refine((value) => value.startsWith("/") || /^https?:\/\//i.test(value) || value.startsWith("data:image/webp;base64,")),
  heroIntro: z.string().trim().min(10),
  heroDetail: z.string().trim().min(10),
  aboutPrimary: z.string().trim().min(10),
  aboutSecondary: z.string().trim().min(10),
  yearsLearning: z.string().trim().min(1),
  projectsCompleted: z.string().trim().min(1),
})

const serviceSchema = z.object({
  title: z.string().trim().min(2),
  description: z.string().trim().min(10),
  icon: z.enum(["Code2", "Layers3", "Database"]).default("Code2"),
})

const journalSchema = z.object({
  category: z.string().trim().min(2),
  title: z.string().trim().min(4),
  excerpt: z.string().trim().min(10),
  url: z.string().url().optional().or(z.literal("")),
})

const socialSchema = z.object({
  platform: z.string().trim().min(2),
  url: z.string().url(),
})

const settingsSchema = z.object({
  siteTitle: z.string().trim().min(2),
  contactEmail: z.string().trim().email(),
  resumeUrl: z.string().trim().min(1),
})

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()

  if (!session?.user || !adminEmail || session.user.email.toLowerCase() !== adminEmail) {
    throw new Error("Unauthorized")
  }
}

export async function listContactSubmissions() {
  await requireAdmin()
  return db
    .select()
    .from(contactSubmissions)
    .orderBy(desc(contactSubmissions.createdAt))
}

export async function deleteContactSubmission(id: number) {
  await requireAdmin()
  await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id))
  revalidatePath("/admin")
}

export async function listPortfolioProfile() {
  const [profile] = await db.select().from(portfolioProfile).where(eq(portfolioProfile.id, 1)).limit(1)
  return profile ?? null
}

export async function savePortfolioProfile(input: z.input<typeof profileSchema>) {
  await requireAdmin()
  const value = profileSchema.parse(input)
  await db.insert(portfolioProfile).values({ id: 1, ...value }).onConflictDoUpdate({
    target: portfolioProfile.id,
    set: { ...value, updatedAt: new Date() },
  })
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function saveSiteSettings(input: z.input<typeof settingsSchema>) {
  await requireAdmin()
  const value = settingsSchema.parse(input)
  await db.insert(siteSettings).values({ id: 1, ...value }).onConflictDoUpdate({
    target: siteSettings.id,
    set: { ...value, updatedAt: new Date() },
  })
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function listServices() {
  return db.select().from(services).orderBy(asc(services.sortOrder), asc(services.id))
}

export async function saveService(input: z.input<typeof serviceSchema>, id?: number) {
  await requireAdmin()
  const value = serviceSchema.parse(input)
  if (id) {
    await db.update(services).set({ ...value, updatedAt: new Date() }).where(eq(services.id, id))
  } else {
    await db.insert(services).values(value)
  }
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function deleteService(id: number) {
  await requireAdmin()
  await db.delete(services).where(eq(services.id, id))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function reorderServices(ids: number[]) {
  await requireAdmin()
  const orderedIds = z.array(z.number().int().positive()).max(500).parse(ids)
  const existing = await db.select({ id: services.id }).from(services)
  const existingIds = new Set(existing.map((item) => item.id))
  if (orderedIds.length !== existingIds.size || orderedIds.some((id) => !existingIds.has(id)) || new Set(orderedIds).size !== orderedIds.length) throw new Error("Service order is out of date")
  await Promise.all(orderedIds.map((id, sortOrder) => db.update(services).set({ sortOrder, updatedAt: new Date() }).where(eq(services.id, id))))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function listJournalEntries() {
  return db.select().from(journalEntries).orderBy(asc(journalEntries.sortOrder), asc(journalEntries.id))
}

export async function saveJournalEntry(input: z.input<typeof journalSchema>, id?: number) {
  await requireAdmin()
  const value = journalSchema.parse(input)
  if (id) {
    await db.update(journalEntries).set({ ...value, updatedAt: new Date() }).where(eq(journalEntries.id, id))
  } else {
    await db.insert(journalEntries).values(value)
  }
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function deleteJournalEntry(id: number) {
  await requireAdmin()
  await db.delete(journalEntries).where(eq(journalEntries.id, id))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function reorderJournalEntries(ids: number[]) {
  await requireAdmin()
  const orderedIds = z.array(z.number().int().positive()).max(500).parse(ids)
  const existing = await db.select({ id: journalEntries.id }).from(journalEntries)
  const existingIds = new Set(existing.map((item) => item.id))
  if (orderedIds.length !== existingIds.size || orderedIds.some((id) => !existingIds.has(id)) || new Set(orderedIds).size !== orderedIds.length) throw new Error("Journal order is out of date")
  await Promise.all(orderedIds.map((id, sortOrder) => db.update(journalEntries).set({ sortOrder, updatedAt: new Date() }).where(eq(journalEntries.id, id))))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function listSocialAccounts() {
  return db.select().from(socialAccounts).orderBy(asc(socialAccounts.sortOrder), asc(socialAccounts.id))
}

export async function saveSocialAccount(input: z.input<typeof socialSchema>, id?: number) {
  await requireAdmin()
  const value = socialSchema.parse(input)
  if (id) {
    await db.update(socialAccounts).set({ ...value, updatedAt: new Date() }).where(eq(socialAccounts.id, id))
  } else {
    await db.insert(socialAccounts).values(value)
  }
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function deleteSocialAccount(id: number) {
  await requireAdmin()
  await db.delete(socialAccounts).where(eq(socialAccounts.id, id))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function reorderSocialAccounts(ids: number[]) {
  await requireAdmin()
  const orderedIds = z.array(z.number().int().positive()).max(500).parse(ids)
  const existing = await db.select({ id: socialAccounts.id }).from(socialAccounts)
  const existingIds = new Set(existing.map((item) => item.id))
  if (orderedIds.length !== existingIds.size || orderedIds.some((id) => !existingIds.has(id)) || new Set(orderedIds).size !== orderedIds.length) throw new Error("Social account order is out of date")
  await Promise.all(orderedIds.map((id, sortOrder) => db.update(socialAccounts).set({ sortOrder, updatedAt: new Date() }).where(eq(socialAccounts.id, id))))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function listSiteSettings() {
  const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1)
  return settings ?? null
}

export async function listSkills() {
  return db.select().from(skills).orderBy(asc(skills.sortOrder), asc(skills.id))
}

export async function saveSkill(input: z.input<typeof skillSchema>, id?: number) {
  await requireAdmin()
  const value = skillSchema.parse(input)

  if (id) {
    await db.update(skills).set({ ...value, updatedAt: new Date() }).where(eq(skills.id, id))
  } else {
    await db.insert(skills).values(value)
  }

  revalidatePath("/")
  revalidatePath("/admin")
}

export async function deleteSkill(id: number) {
  await requireAdmin()
  await db.delete(skills).where(eq(skills.id, id))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function reorderSkills(ids: number[]) {
  await requireAdmin()
  const orderedIds = z.array(z.number().int().positive()).max(500).parse(ids)
  const existing = await db.select({ id: skills.id }).from(skills)
  const existingIds = new Set(existing.map((item) => item.id))

  if (orderedIds.length !== existingIds.size || orderedIds.some((id) => !existingIds.has(id)) || new Set(orderedIds).size !== orderedIds.length) {
    throw new Error("Skill order is out of date")
  }

  await Promise.all(orderedIds.map((id, sortOrder) =>
    db.update(skills).set({ sortOrder, updatedAt: new Date() }).where(eq(skills.id, id)),
  ))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function listExperiences() {
  return db.select().from(experiences).orderBy(asc(experiences.sortOrder), asc(experiences.id))
}

export async function saveExperience(input: z.input<typeof experienceSchema>, id?: number) {
  await requireAdmin()
  const value = experienceSchema.parse(input)

  if (id) {
    await db.update(experiences).set({ ...value, updatedAt: new Date() }).where(eq(experiences.id, id))
  } else {
    await db.insert(experiences).values(value)
  }

  revalidatePath("/")
  revalidatePath("/admin")
}

export async function deleteExperience(id: number) {
  await requireAdmin()
  await db.delete(experiences).where(eq(experiences.id, id))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function reorderExperiences(ids: number[]) {
  await requireAdmin()
  const orderedIds = z.array(z.number().int().positive()).max(500).parse(ids)
  const existing = await db.select({ id: experiences.id }).from(experiences)
  const existingIds = new Set(existing.map((item) => item.id))

  if (orderedIds.length !== existingIds.size || orderedIds.some((id) => !existingIds.has(id)) || new Set(orderedIds).size !== orderedIds.length) {
    throw new Error("Experience order is out of date")
  }

  await Promise.all(orderedIds.map((id, sortOrder) =>
    db.update(experiences).set({ sortOrder, updatedAt: new Date() }).where(eq(experiences.id, id)),
  ))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function listEducation() {
  return db.select().from(education).orderBy(asc(education.sortOrder), asc(education.id))
}

export async function saveEducation(input: z.input<typeof educationSchema>, id?: number) {
  await requireAdmin()
  const value = educationSchema.parse(input)

  if (id) {
    await db.update(education).set({ ...value, updatedAt: new Date() }).where(eq(education.id, id))
  } else {
    await db.insert(education).values(value)
  }

  revalidatePath("/")
  revalidatePath("/admin")
}

export async function deleteEducation(id: number) {
  await requireAdmin()
  await db.delete(education).where(eq(education.id, id))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function reorderEducation(ids: number[]) {
  await requireAdmin()
  const orderedIds = z.array(z.number().int().positive()).max(500).parse(ids)
  const existing = await db.select({ id: education.id }).from(education)
  const existingIds = new Set(existing.map((item) => item.id))

  if (orderedIds.length !== existingIds.size || orderedIds.some((id) => !existingIds.has(id)) || new Set(orderedIds).size !== orderedIds.length) {
    throw new Error("Education order is out of date")
  }

  await Promise.all(orderedIds.map((id, sortOrder) =>
    db.update(education).set({ sortOrder, updatedAt: new Date() }).where(eq(education.id, id)),
  ))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function listCertifications() {
  return db.select().from(certifications).orderBy(asc(certifications.sortOrder), asc(certifications.id))
}

export async function saveCertification(input: z.input<typeof certificateSchema>, id?: number) {
  await requireAdmin()
  const value = certificateSchema.parse(input)

  if (id) {
    await db.update(certifications).set({ ...value, updatedAt: new Date() }).where(eq(certifications.id, id))
  } else {
    await db.insert(certifications).values(value)
  }

  revalidatePath("/")
  revalidatePath("/admin")
}

export async function deleteCertification(id: number) {
  await requireAdmin()
  await db.delete(certifications).where(eq(certifications.id, id))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function reorderCertifications(ids: number[]) {
  await requireAdmin()
  const orderedIds = z.array(z.number().int().positive()).max(500).parse(ids)
  const existing = await db.select({ id: certifications.id }).from(certifications)
  const existingIds = new Set(existing.map((item) => item.id))

  if (orderedIds.length !== existingIds.size || orderedIds.some((id) => !existingIds.has(id)) || new Set(orderedIds).size !== orderedIds.length) {
    throw new Error("Certificate order is out of date")
  }

  await Promise.all(orderedIds.map((id, sortOrder) =>
    db.update(certifications).set({ sortOrder, updatedAt: new Date() }).where(eq(certifications.id, id)),
  ))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function listPortfolioContent() {
  const [projectItems, skillItems, experienceItems, educationItems, certificationItems, profile, serviceItems, journalItems, socialItems, settings] = await Promise.all([
    db.select().from(projects).orderBy(desc(projects.featured), projects.sortOrder),
    db.select().from(skills).orderBy(asc(skills.sortOrder), asc(skills.id)),
    db.select().from(experiences).orderBy(asc(experiences.sortOrder), asc(experiences.id)),
    db.select().from(education).orderBy(asc(education.sortOrder), asc(education.id)),
    db.select().from(certifications).orderBy(asc(certifications.sortOrder), asc(certifications.id)),
    listPortfolioProfile(),
    db.select().from(services).orderBy(asc(services.sortOrder), asc(services.id)),
    db.select().from(journalEntries).orderBy(asc(journalEntries.sortOrder), asc(journalEntries.id)),
    db.select().from(socialAccounts).orderBy(asc(socialAccounts.sortOrder), asc(socialAccounts.id)),
    listSiteSettings(),
  ])

  return {
    projects: projectItems,
    skills: skillItems,
    experiences: experienceItems,
    education: educationItems,
    certifications: certificationItems,
    profile,
    services: serviceItems,
    journal: journalItems,
    socialAccounts: socialItems,
    settings,
  }
}
