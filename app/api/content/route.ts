import { NextResponse } from "next/server"
import { listCertifications, listEducation, listExperiences, listPortfolioContent, listSkills } from "@/app/actions/content"
import {
  certificates,
  defaultServices,
  educationEntries,
  experiences,
  journalEntries,
  portfolioProfile,
  portfolioSettings,
  projects,
  skills,
  socialAccounts,
} from "@/lib/content"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const content = await listPortfolioContent()

    return NextResponse.json({
      projects: content.projects,
      skills: content.skills,
      experiences: content.experiences,
      education: content.education,
      certifications: content.certifications,
      profile: content.profile,
      services: content.services,
      journal: content.journal,
      socialAccounts: content.socialAccounts,
      settings: content.settings,
    }, { headers: { "Cache-Control": "no-store, max-age=0" } })
  } catch {
    return NextResponse.json({
      projects,
      skills,
      experiences,
      education: educationEntries,
      certifications: certificates,
      profile: portfolioProfile,
      services: defaultServices,
      journal: journalEntries,
      socialAccounts,
      settings: portfolioSettings,
    }, { headers: { "Cache-Control": "no-store, max-age=0" } })
  }
}
