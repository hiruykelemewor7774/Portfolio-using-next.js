"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { projects } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const projectSchema = z.object({ title: z.string().min(2), description: z.string().min(10), tech: z.string().min(2), link: z.string().url().optional().or(z.literal("")), featured: z.boolean().default(false) })
async function requireAdmin() {
	const session = await auth.api.getSession({ headers: await headers() })
	const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
	if (!session?.user || !adminEmail || session.user.email.toLowerCase() !== adminEmail) {
		throw new Error("Unauthorized")
	}
}
export async function listProjects() { return db.select().from(projects).orderBy(desc(projects.featured), projects.sortOrder) }
export async function saveProject(input: z.input<typeof projectSchema>, id?: number) { await requireAdmin(); const value = projectSchema.parse(input); if (id) await db.update(projects).set({ ...value, updatedAt: new Date() }).where(eq(projects.id, id)); else await db.insert(projects).values(value); revalidatePath("/"); revalidatePath("/admin") }
export async function deleteProject(id: number) { await requireAdmin(); await db.delete(projects).where(eq(projects.id, id)); revalidatePath("/"); revalidatePath("/admin") }
