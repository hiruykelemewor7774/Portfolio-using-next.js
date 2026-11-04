"use client"

import {
  SiAngular,
  SiBetterauth,
  SiBootstrap,
  SiCplusplus,
  SiCss,
  SiDocker,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiGit,
  SiGithub,
  SiGo,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiJest,
  SiKubernetes,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiPostman,
  SiPrisma,
  SiPython,
  SiReact,
  SiRedis,
  SiRedux,
  SiRust,
  SiSass,
  SiSvelte,
  SiSwagger,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
  SiVitest,
  SiVuedotjs,
} from "react-icons/si"
import {
  Cloud,
  Code2,
  Database,
  Layers3,
  ShieldCheck,
  Wrench,
} from "lucide-react"
import type { IconType } from "react-icons"

const skillBrands: Record<string, { icon: IconType; color: string }> = {
  angular: { icon: SiAngular, color: "#dd0031" },
  betterauth: { icon: SiBetterauth, color: "#111827" },
  bootstrap: { icon: SiBootstrap, color: "#7952b3" },
  cplusplus: { icon: SiCplusplus, color: "#00599c" },
  css: { icon: SiCss, color: "#1572b6" },
  css3: { icon: SiCss, color: "#1572b6" },
  docker: { icon: SiDocker, color: "#2496ed" },
  express: { icon: SiExpress, color: "#444" },
  figma: { icon: SiFigma, color: "#f24e1e" },
  firebase: { icon: SiFirebase, color: "#ffca28" },
  git: { icon: SiGit, color: "#f05032" },
  github: { icon: SiGithub, color: "#181717" },
  go: { icon: SiGo, color: "#00add8" },
  graphql: { icon: SiGraphql, color: "#e10098" },
  html: { icon: SiHtml5, color: "#e34f26" },
  html5: { icon: SiHtml5, color: "#e34f26" },
  javascript: { icon: SiJavascript, color: "#f7df1e" },
  jest: { icon: SiJest, color: "#c21325" },
  kubernetes: { icon: SiKubernetes, color: "#326ce5" },
  linux: { icon: SiLinux, color: "#fcc624" },
  mongodb: { icon: SiMongodb, color: "#47a248" },
  mysql: { icon: SiMysql, color: "#4479a1" },
  nest: { icon: SiNestjs, color: "#e0234e" },
  nestjs: { icon: SiNestjs, color: "#e0234e" },
  next: { icon: SiNextdotjs, color: "#111" },
  nextjs: { icon: SiNextdotjs, color: "#111" },
  node: { icon: SiNodedotjs, color: "#5fa04e" },
  nodejs: { icon: SiNodedotjs, color: "#5fa04e" },
  php: { icon: SiPhp, color: "#777bb4" },
  postgres: { icon: SiPostgresql, color: "#4169e1" },
  postgresql: { icon: SiPostgresql, color: "#4169e1" },
  postman: { icon: SiPostman, color: "#ff6c37" },
  prisma: { icon: SiPrisma, color: "#5a67d8" },
  python: { icon: SiPython, color: "#3776ab" },
  react: { icon: SiReact, color: "#61dafb" },
  redis: { icon: SiRedis, color: "#dc382d" },
  redux: { icon: SiRedux, color: "#764abc" },
  rust: { icon: SiRust, color: "#ce412b" },
  sass: { icon: SiSass, color: "#cc6699" },
  svelte: { icon: SiSvelte, color: "#ff3e00" },
  swagger: { icon: SiSwagger, color: "#85ea2d" },
  tailwind: { icon: SiTailwindcss, color: "#06b6d4" },
  tailwindcss: { icon: SiTailwindcss, color: "#06b6d4" },
  typescript: { icon: SiTypescript, color: "#3178c6" },
  vercel: { icon: SiVercel, color: "#111" },
  vite: { icon: SiVite, color: "#646cff" },
  vitest: { icon: SiVitest, color: "#6e9f18" },
  vue: { icon: SiVuedotjs, color: "#42b883" },
  vuejs: { icon: SiVuedotjs, color: "#42b883" },
}

const categoryIcons = [
  { match: /database|data|sql/i, icon: Database, color: "#4479a1" },
  { match: /security|auth/i, icon: ShieldCheck, color: "#7c3aed" },
  { match: /cloud|deploy|devops/i, icon: Cloud, color: "#0ea5e9" },
  { match: /tool|framework|library/i, icon: Wrench, color: "#f97316" },
  { match: /backend|server|api/i, icon: Layers3, color: "#14b8a6" },
]

function getFallbackColor(value: string) {
  const hash = [...value].reduce((result, character) => result * 31 + character.charCodeAt(0), 0)
  return `hsl(${Math.abs(hash) % 360} 68% 48%)`
}

export function SkillIcon({ name, category }: { name: string; category?: string }) {
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, "")
  const brand = skillBrands[normalizedName]

  if (brand) {
    const Icon = brand.icon
    return <Icon className="skill-brand-icon" aria-hidden="true" style={{ color: brand.color }} />
  }

  const categoryIcon = categoryIcons.find(({ match }) => match.test(category ?? ""))
  const Icon = categoryIcon?.icon ?? Code2
  const color = categoryIcon?.color ?? getFallbackColor(normalizedName || category || name)

  return <Icon className="skill-brand-icon" aria-hidden="true" style={{ color }} />
}
