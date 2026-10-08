"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { contactSubmissions } from "@/lib/db/schema"
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
  const recipient = process.env.CONTACT_EMAIL
  const sender = process.env.CONTACT_FROM_EMAIL

  if (!apiKey || !recipient || !sender) {
    return { success: false as const, error: "Contact email is not configured." }
  }

  await db.insert(contactSubmissions).values(result.data)
  revalidatePath("/admin")

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: sender,
      to: recipient,
      replyTo: result.data.email,
      subject: "New portfolio contact submission",
      text: `Name: ${result.data.name}\nEmail: ${result.data.email}\n\n${result.data.message}`,
    })

    if (error) {
      console.error("Contact email delivery failed:", error)
      return { success: false as const, stored: true as const, error: "Your message was saved, but the email could not be delivered." }
    }
  } catch (error) {
    console.error("Contact email delivery failed:", error)
    return { success: false as const, stored: true as const, error: "Your message was saved, but the email could not be delivered." }
  }

  return { success: true as const }
}
