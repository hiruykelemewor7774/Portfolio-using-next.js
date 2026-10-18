"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { certifications, contactSubmissions, education, experiences, projects, skills } from "@/lib/db/schema"
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
    .limit(100)
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
  const [projectItems, skillItems, experienceItems, educationItems, certificationItems] = await Promise.all([
    db.select().from(projects).orderBy(desc(projects.featured), projects.sortOrder),
    db.select().from(skills).orderBy(asc(skills.sortOrder), asc(skills.id)),
    db.select().from(experiences).orderBy(asc(experiences.sortOrder), asc(experiences.id)),
    db.select().from(education).orderBy(asc(education.sortOrder), asc(education.id)),
    db.select().from(certifications).orderBy(asc(certifications.sortOrder), asc(certifications.id)),
  ])

  return {
    projects: projectItems,
    skills: skillItems,
    experiences: experienceItems,
    education: educationItems,
    certifications: certificationItems,
  }
}
