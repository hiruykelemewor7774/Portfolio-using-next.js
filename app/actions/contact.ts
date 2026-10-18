"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { contactSubmissions } from "@/lib/db/schema"
import nodemailer from "nodemailer"
import { Resend } from "resend"
import { z } from "zod"

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Please enter a valid email address."),
  message: z.string().trim().min(10, "Please write at least 10 characters.").max(5000),
})

export async function submitContact(input: unknown) {
  const result = contactSchema.safeParse(input)

  if (!result.success) {
    return { success: false as const, error: "Please check your details and try again." }
  }

  const apiKey = process.env.RESEND_API_KEY
  const recipient = process.env.CONTACT_EMAIL?.trim() || "alemukelemework363@gmail.com"
  const sender = process.env.CONTACT_FROM_EMAIL?.trim()
  const gmailUser = process.env.GMAIL_SMTP_USER?.trim()
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "")
  const hasPartialGmailConfig = Boolean(gmailUser) !== Boolean(gmailAppPassword)
  const canUseGmail = Boolean(gmailUser && gmailAppPassword)

  if (!recipient) {
    return { success: false as const, error: "Contact email is not configured." }
  }

  await db.insert(contactSubmissions).values(result.data)
  revalidatePath("/admin")

  try {
    if (hasPartialGmailConfig) {
      return {
        success: false as const,
        stored: true as const,
        error: "Your message was saved, but Gmail SMTP setup is incomplete.",
      }
    }

    if (canUseGmail) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: gmailUser, pass: gmailAppPassword },
      })

      await transporter.sendMail({
        from: gmailUser,
        to: recipient,
        replyTo: result.data.email,
        subject: "New portfolio contact submission",
        text: `Name: ${result.data.name}\nEmail: ${result.data.email}\n\n${result.data.message}`,
      })
    } else if (apiKey && sender && sender.toLowerCase() !== "onboarding@resend.dev") {
      const resend = new Resend(apiKey)
      const { error } = await resend.emails.send({
        from: sender,
        to: recipient,
        replyTo: result.data.email,
        subject: "New portfolio contact submission",
        text: `Name: ${result.data.name}\nEmail: ${result.data.email}\n\n${result.data.message}`,
      })

      if (error) throw error
    } else {
      return {
        success: false as const,
        stored: true as const,
        error: "Your message was saved, but email delivery is not configured. Add Gmail SMTP credentials or a verified Resend sender.",
      }
    }
  } catch (error) {
    console.error("Contact email delivery failed:", error)
    return { success: false as const, stored: true as const, error: "Your message was saved, but the email could not be delivered." }
  }

  return { success: true as const }
}
