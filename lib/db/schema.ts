import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull(),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(), accountId: text("accountId").notNull(), providerId: text("providerId").notNull(), userId: text("userId").notNull(),
  accessToken: text("accessToken"), refreshToken: text("refreshToken"), idToken: text("idToken"), accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { withTimezone: true }), refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", { withTimezone: true }), scope: text("scope"), password: text("password"), createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(), updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
})

export const verification = pgTable("verification", { id: text("id").primaryKey(), identifier: text("identifier").notNull(), value: text("value").notNull(), expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(), createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(), updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow() })

export const projects = pgTable("projects", { id: serial("id").primaryKey(), title: text("title").notNull(), description: text("description").notNull(), tech: text("tech").notNull(), link: text("link"), featured: boolean("featured").notNull().default(false), sortOrder: integer("sortOrder").notNull().default(0), createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(), updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow() })

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull().default("general"),
  sortOrder: integer("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
})

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  organization: text("organization").notNull(),
  period: text("period").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
})

export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  degree: text("degree").notNull(),
  institution: text("institution").notNull(),
  period: text("period").notNull(),
  details: text("details").notNull(),
  status: text("status").notNull().default("In progress"),
  sortOrder: integer("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
})

export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  issuer: text("issuer").notNull(),
  date: text("date").notNull(),
  url: text("url"),
  sortOrder: integer("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
})

export const contactSubmissions = pgTable("contactSubmissions", { id: serial("id").primaryKey(), name: text("name").notNull(), email: text("email").notNull(), message: text("message").notNull(), createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow() })

export type Project = typeof projects.$inferSelect
export type Skill = typeof skills.$inferSelect
export type Experience = typeof experiences.$inferSelect
export type EducationEntry = typeof education.$inferSelect
export type Certification = typeof certifications.$inferSelect
export type ContactSubmission = typeof contactSubmissions.$inferSelect
export type NewProject = typeof projects.$inferInsert
    
