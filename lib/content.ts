import {
  Code2,
  Database,
  HardHat,
  Layers3,
  Smartphone,
  type LucideIcon,
} from "lucide-react"

export type PortfolioProject = {
  number: string
  type: string
  title: string
  cover: string
  coverAlt: string
  description: string
  result: string
  stack: string[]
  accent: string
  icon: LucideIcon
}

export const roles = [
  "Full-Stack Developer",
  "Software Engineering Intern",
  "Product-minded Builder",
] as const

export const projects: PortfolioProject[] = [
  {
    number: "01",
    type: "Operations platform",
    title: "Task Management System",
    cover: "/project-dashboard.jpg",
    coverAlt: "Project management dashboard displayed on a laptop in a clean workspace",
    description:
      "A calm, structured workspace for teams to plan, assign, and ship work with clarity.",
    result: "Clearer ownership across every task",
    stack: ["Next.js", "NestJS", "Swagger"],
    accent: "emerald",
    icon: Layers3,
  },
  {
    number: "02",
    type: "Business software",
    title: "Restaurant Management",
    cover: "/project-restaurant.jpg",
    coverAlt: "Point-of-sale checkout at a modern small business counter",
    description:
      "A streamlined operations platform connecting menus, orders, staff, and daily decisions.",
    result: "One view for the whole operation",
    stack: ["Next.js", "TypeScript", "PostgreSQL"],
    accent: "blue",
    icon: Database,
  },
  {
    number: "03",
    type: "Field operations",
    title: "Construction Management",
    cover: "/project-construction.jpg",
    coverAlt: "Construction workers in hard hats at an active industrial site",
    description:
      "A connected platform for managing construction projects, teams, materials, and site operations.",
    result: "Better visibility across every project",
    stack: ["Next.js", "NestJS", "Prisma", "PostgreSQL"],
    accent: "amber",
    icon: HardHat,
  },
  {
    number: "04",
    type: "Digital experience",
    title: "Qene Bet Website",
    cover: "/project-qene-bet.jpg",
    coverAlt: "Qene Bet students gathered with their study books",
    description:
      "A modern mobile-first experience designed to simplify daily workflows and improve accessibility.",
    result: "Essential tools, available anywhere",
    stack: ["React", "TypeScript", "API Integration"],
    accent: "violet",
    icon: Smartphone,
  },
  {
    number: "05",
    type: "Health technology",
    title: "Malaria Identification",
    cover: "/project-malaria-identification.svg",
    coverAlt: "Illustration of a malaria parasite among red blood cells under a microscope",
    description:
      "A malaria identification project focused on recognizing parasites in blood-smear imagery.",
    result: "Visual identification from microscope samples",
    stack: ["Computer Vision", "Image Analysis", "Healthcare"],
    accent: "emerald",
    icon: Layers3,
  },
]

export const skills = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "NestJS",
  "Swagger",
  "Better Auth",
  "Docker",
  "Prisma",
  "PostgreSQL",
  "Git",
  "Tailwind CSS",
] as const

export const experiences = [
  {
    period: "2024 — NOW",
    role: "Software Engineering Intern",
    organization: "Ethio Telecom",
    description:
      "Building internal tools and learning how reliable software supports a large, connected organization.",
  },
  {
    period: "2022 — NOW",
    role: "Computer Science Student",
    organization: "Mizan-Tepi University",
    description:
      "Studying the foundations behind the interfaces, systems, and products I build every day.",
  },
] as const

export const educationEntries = [
  {
    period: "2022 — PRESENT",
    degree: "BSc. Computer Science",
    institution: "Mizan-Tepi University · Ethiopia",
    details: "Foundations in software engineering, systems thinking, and reliable digital product design.",
    status: "In progress",
  },
  {
    period: "CONTINUOUS PRACTICE",
    degree: "Engineering through building",
    institution: "Self-directed practice",
    details:
      "Product architecture, backend systems, accessible interfaces, and deployment workflows.",
    status: "Ongoing",
  },
] as const

export const certificates = [
  {
    title: "Full-stack systems",
    issuer: "Portfolio work",
    date: "Continuous",
    url: "",
  },
  {
    title: "Product thinking",
    issuer: "Portfolio work",
    date: "Continuous",
    url: "",
  },
  {
    title: "Reliable delivery",
    issuer: "Portfolio work",
    date: "Continuous",
    url: "",
  },
] as const

export const process = [
  [
    "01",
    "Discover",
    "Understand the problem, audience, constraints, and the signal that defines success.",
  ],
  [
    "02",
    "Shape",
    "Turn complexity into a clear product direction, useful flows, and a visual language.",
  ],
  [
    "03",
    "Build",
    "Engineer the experience with maintainable code, thoughtful states, and real data.",
  ],
  [
    "04",
    "Refine",
    "Test the details, remove friction, and ship something that feels finished.",
  ],
] as const

export const services = [
  {
    title: "Build digital products",
    description:
      "Full-stack web applications with clean architecture, responsive interfaces, and dependable backend systems.",
    icon: Code2,
  },
  {
    title: "Shape product experiences",
    description:
      "Clear flows, purposeful interfaces, and design decisions that help people move with confidence.",
    icon: Layers3,
  },
  {
    title: "Make systems reliable",
    description:
      "Authentication, data modeling, APIs, and deployment foundations built to grow without drama.",
    icon: Database,
  },
] as const

export const portfolioProfile = {
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

export const defaultServices = [
  { title: "Build digital products", description: "Full-stack web applications with clean architecture, responsive interfaces, and dependable backend systems.", icon: "Code2" },
  { title: "Shape product experiences", description: "Clear flows, purposeful interfaces, and design decisions that help people move with confidence.", icon: "Layers3" },
  { title: "Make systems reliable", description: "Authentication, data modeling, APIs, and deployment foundations built to grow without drama.", icon: "Database" },
] as const

export const journalEntries = [
  { id: "1", category: "Engineering", title: "Designing a portfolio that can grow with the work", excerpt: "Why a professional site should be a living system, not a finished screenshot.", url: "" },
  { id: "2", category: "Backend", title: "What makes an internal tool feel dependable", excerpt: "Small decisions around feedback, permissions, and data shape the whole experience.", url: "" },
] as const

export const socialAccounts = [
  { id: "github", platform: "GitHub", url: "https://github.com/hiruykelemewor7774" },
  { id: "linkedin", platform: "LinkedIn", url: "https://www.linkedin.com/in/alemu-kelemework/" },
] as const

export const portfolioSettings = {
  siteTitle: "Alemu Kelemework — Developer Portfolio",
  contactEmail: "alemukelemework363@gmail.com",
  resumeUrl: "/alemu-kelemework-cv.pdf",
}
