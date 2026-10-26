"use client";

import { useEffect, useState } from "react";
import {
  certificates as fallbackCertificates,
  defaultServices,
  educationEntries as fallbackEducationEntries,
  experiences as fallbackExperiences,
  journalEntries as fallbackJournalEntries,
  portfolioProfile as fallbackProfile,
  portfolioSettings as fallbackSettings,
  process as portfolioProcess,
  projects as portfolioProjects,
  roles as portfolioRoles,
  skills as portfolioSkills,
  socialAccounts as fallbackSocialAccounts,
} from "@/lib/content";
import { submitContact } from "./actions/contact";
import { subscribeToPortfolioContentChanges } from "@/lib/content-events";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Code2,
  Database,
  GraduationCap,
  Globe2,
  HardHat,
  Layers3,
  Mail,
  MapPin,
  Menu,
  Moon,
  MoveUpRight,
  Send,
  Sparkles,
  Star,
  Sun,
  Smartphone,
  Terminal,
  X,
  Zap,
} from "lucide-react";

const roles = [...portfolioRoles];
const projects = [...portfolioProjects];
const skills = [...portfolioSkills];
const process = [...portfolioProcess];
const experiences = [...fallbackExperiences];
const educationEntries = [...fallbackEducationEntries];
const certificates = [...fallbackCertificates];
const projectIconMap = {
  Layers3,
  Database,
  HardHat,
  Smartphone,
} as const;

type ProjectIconName = keyof typeof projectIconMap;
type PortfolioProject = {
  id?: number | string;
  number?: string;
  title: string;
  description: string;
  result?: string;
  stack: string[];
  type?: string;
  cover?: string;
  coverAlt?: string;
  accent?: string;
  icon?: ProjectIconName | React.ComponentType<{ className?: string }>;
  link?: string | null;
  featured?: boolean;
};
type PortfolioSkill = string | { id?: number; name: string; category?: string };
type PortfolioService = { id?: number | string; title: string; description: string; icon: string };
type JournalEntry = { id?: number | string; category: string; title: string; excerpt: string; url?: string | null };
type SocialAccount = { id?: number | string; platform: string; url: string };
const serviceIconMap = { Code2, Layers3, Database } as const;

export default function Page() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [projectItems, setProjectItems] = useState<PortfolioProject[]>(projects as PortfolioProject[]);
  const [skillItems, setSkillItems] = useState<PortfolioSkill[]>(skills);
  const [experienceItems, setExperienceItems] = useState(experiences);
  const [educationItems, setEducationItems] = useState(educationEntries);
  const [certificateItems, setCertificateItems] = useState(certificates);
  const [profile, setProfile] = useState(fallbackProfile);
  const [serviceItems, setServiceItems] = useState<PortfolioService[]>([...defaultServices]);
  const [journalItems, setJournalItems] = useState<JournalEntry[]>([...fallbackJournalEntries]);
  const [socialItems, setSocialItems] = useState<SocialAccount[]>([...fallbackSocialAccounts]);
  const [siteSettings, setSiteSettings] = useState(fallbackSettings);
  const [contactStatus, setContactStatus] = useState<
    "idle" | "sending" | "success" | "error" | "partial"
  >("idle");
  const [contactError, setContactError] = useState("");

  async function handleContactSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setContactStatus("sending");
    setContactError("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const result = await submitContact({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        message: String(form.get("message") ?? ""),
      });

      if (!result.success) {
        setContactError(result.error);
        setContactStatus("stored" in result ? "partial" : "error");
        return;
      }

      setContactStatus("success");
      formElement.reset();
    } catch {
      setContactError(
        "Could not save your message. Check the server configuration and try again.",
      );
      setContactStatus("error");
    }
  }

  useEffect(() => {
    const timer = window.setInterval(
      () => setRoleIndex((current) => (current + 1) % roles.length),
      2800,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadPortfolioContent() {
      try {
        const response = await fetch("/api/content", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();

        if (Array.isArray(data.projects)) {
          setProjectItems(
            data.projects.map((project: any, index: number) => ({
              ...project,
              number: String(project.number ?? project.id ?? index + 1).padStart(2, "0"),
              type: project.type ?? "Portfolio project",
              cover: project.cover || projects[index % projects.length]?.cover || "/project-dashboard.jpg",
              coverAlt: project.coverAlt ?? `${project.title ?? "Project"} preview`,
              result: project.result ?? project.description ?? "Project delivered",
              stack: Array.isArray(project.stack)
                ? project.stack
                : String(project.tech ?? "")
                    .split(",")
                    .map((tag: string) => tag.trim())
                    .filter(Boolean),
              accent: project.accent ?? ["emerald", "blue", "amber", "violet"][index % 4],
              icon:
                typeof project.icon === "string" &&
                Object.prototype.hasOwnProperty.call(projectIconMap, project.icon)
                  ? (project.icon as ProjectIconName)
                  : ["Layers3", "Database", "HardHat", "Smartphone"][index % 4],
            })),
          );
        }
        if (Array.isArray(data.skills)) {
          setSkillItems(data.skills.map((skill: any) => typeof skill === "string" ? skill : {
            id: skill.id,
            name: skill.name,
            category: skill.category,
          }));
        }
        if (Array.isArray(data.experiences)) {
          setExperienceItems(data.experiences);
        }
        if (Array.isArray(data.education)) {
          setEducationItems(data.education);
        }
        if (Array.isArray(data.certifications)) {
          setCertificateItems(data.certifications);
        }
        if (data.profile) setProfile(data.profile);
        if (Array.isArray(data.services)) setServiceItems(data.services);
        if (Array.isArray(data.journal)) setJournalItems(data.journal);
        if (Array.isArray(data.socialAccounts)) setSocialItems(data.socialAccounts);
        if (data.settings) setSiteSettings(data.settings);
      } catch {
        // Keep the built-in fallback content when the API is unavailable.
      }
    }

    void loadPortfolioContent();
    return subscribeToPortfolioContentChanges(() => void loadPortfolioContent());
  }, []);

  useEffect(() => {
    document.title = siteSettings.siteTitle;
  }, [siteSettings.siteTitle]);

  function openContact(
    event?: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) {
    event?.preventDefault();
    setContactOpen(true);
    setContactStatus("idle");
  }

  return (
    <main className={dark ? "site-shell dark-mode" : "site-shell light-mode"}>
      <div className="noise" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Alemu Kelemework home">
          <span className="brand-mark">AK</span>
          <span>
            alemu<span className="brand-dot">.</span>dev
          </span>
        </a>
        <nav
          className={menuOpen ? "main-nav open" : "main-nav"}
          aria-label="Main navigation"
        >
          <a href="#top" onClick={() => setMenuOpen(false)}>
            Home
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href="#skills" onClick={() => setMenuOpen(false)}>
            Skills
          </a>
          <a href="#work" onClick={() => setMenuOpen(false)}>
            Projects
          </a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>
            Experience
          </a>
          <a href="#education" onClick={() => setMenuOpen(false)}>
            Education
          </a>
          <a href="#services" onClick={() => setMenuOpen(false)}>
            Services
          </a>
          <a href="#journal" onClick={() => setMenuOpen(false)}>
            Journal
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact
          </a>
        </nav>
        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={() => setDark(!dark)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <Sun /> : <Moon />}
          </button>
          <a className="header-cta" href="#contact" onClick={openContact}>
            Let&apos;s talk <ArrowUpRight />
          </a>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <section className="hero section-wrap" id="top">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" /> {profile.role}{" "}
            <span className="eyebrow-line" />
            <span className="hero-techline">Next.js · NestJS · Prisma · PostgreSQL</span>
          </div>
          <h1>
            Hi, I&apos;m
            <br />
            <em>{profile.displayName}</em>
          </h1>
          <p className="hero-intro">
            {profile.heroIntro}
            <span>{profile.heroDetail}</span>
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">
              <Send /> View my projects <ArrowUpRight />
            </a>
            <a
              className="button button-ghost"
              href={`${siteSettings.resumeUrl}${siteSettings.resumeUrl.includes("?") ? "&" : "?"}v=20261019-2`}
              download
              aria-label="Download CV"
            >
              Download CV <ArrowDown />
            </a>
          </div>
          <div className="hero-socials" aria-label="Social links">
            {socialItems.map((account) => (
              <a key={account.id ?? account.platform} href={account.url} target="_blank" rel="noreferrer" aria-label={account.platform}>
                <Globe2 />
              </a>
            ))}
            <a href={`mailto:${siteSettings.contactEmail}`} aria-label="Email">
              <Mail />
            </a>
            <a href="#contact" onClick={openContact} aria-label="Send a message">
              <Send />
            </a>
          </div>
        </div>
        <div className="hero-aside">
          <div className="portrait-halo" />
          <div className="portrait-frame">
            <img src={profile.portraitUrl} alt={`Portrait of ${profile.displayName}`} />
          </div>
          <div className="hero-signature" aria-hidden="true">
            Alemu <span>Kelemework</span>
          </div>
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-callout clean-callout">
            <Code2 />
            <span><strong>Clean Code</strong><small>Best Practices</small></span>
          </div>
          <div className="hero-callout solve-callout">
            <Sparkles />
            <span><strong>Problem Solver</strong><small>Think &amp; Build</small></span>
          </div>
          <div className="hero-callout learn-callout">
            <Zap />
            <span><strong>Fast Learner</strong><small>Always Improving</small></span>
          </div>
          <div className="hero-terminal">
            <div className="terminal-top">
              <span />
              <span />
              <span />
              <small>alemu@portfolio ~</small>
            </div>
            <div className="terminal-body">
              <p>
                <span className="terminal-muted">const</span>{" "}
                <span className="terminal-variable">developer</span> = {"{"}
              </p>
              <p className="indent">
                <span className="terminal-key">name</span>: {" "}
                <span className="terminal-string">&quot;{profile.displayName}&quot;</span>,
              </p>
              <p className="indent">
                <span className="terminal-key">role</span>: {" "}
                <span className="terminal-string terminal-role">
                  &quot;{roles[roleIndex]}&quot;
                </span>
                ,
              </p>
              <p className="indent">
                <span className="terminal-key">focus</span>: {" "}
                <span className="terminal-string terminal-focus">
                  &quot;great products&quot;
                </span>
                ,
              </p>
              <p className="indent">
                <span className="terminal-key">status</span>: {" "}
                <span className="terminal-string terminal-status">
                  &quot;open to build&quot;
                </span>
                ,
              </p>
              <p>{"}"};</p>
              <p className="terminal-cursor">_</p>
            </div>
          </div>
          <div className="hero-stack" aria-label="Core technologies">
            {["Next.js", "NestJS", "Prisma", "PostgreSQL"].map((skill, index) => (
              <span key={skill}>
                <i data-tech={skill.toLowerCase().replace(".", "")}>{["N", "N", "◇", "▤"][index]}</i>{skill}
              </span>
            ))}
          </div>
          <div className="hero-index">
            01 <span>/</span> 04
          </div>
        </div>
      </section>

      <div className="hero-stats section-wrap" aria-label="Portfolio highlights">
        <div><GraduationCap /><strong>10+</strong><span>Projects completed</span></div>
        <div><Code2 /><strong>4+</strong><span>Years learning</span></div>
        <div><MapPin /><strong>Addis Ababa</strong><span>Based in Ethiopia</span></div>
        <div><Star /><strong>{skills.length}+</strong><span>Technologies used</span></div>
      </div>
      <a className="scroll-cue" href="#about" aria-label="Scroll down to About me">
        <span>Scroll Down</span>
        <ArrowDown />
      </a>

      <div className="ticker">
        <div className="ticker-track">
          <span>FULL-STACK DEVELOPMENT</span>
          <span className="ticker-star">✳</span>
          <span>PRODUCT THINKING</span>
          <span className="ticker-star">✳</span>
          <span>CREATIVE ENGINEERING</span>
          <span className="ticker-star">✳</span>
          <span>FULL-STACK DEVELOPMENT</span>
        </div>
      </div>

      <section className="about section-wrap section-grid" id="about">
        <div className="section-label">
          <span>01</span>
          <span>About me</span>
        </div>
        <div className="about-content">
          <div className="section-heading">
            <h2>
              Curious by nature.
              <br />
              <span>Precise by craft.</span>
            </h2>
            <p>Good software is felt before it is explained.</p>
          </div>
          <div className="about-columns">
            <p>
              {profile.aboutPrimary}
            </p>
            <p>
              {profile.aboutSecondary}
            </p>
          </div>
          <div className="about-meta">
            <div>
              <strong>{profile.yearsLearning}</strong>
              <span>
                Years learning
                <br />
                and building
              </span>
            </div>
            <div>
              <strong>{profile.projectsCompleted}</strong>
              <span>
                Projects
                <br />
                completed
              </span>
            </div>
            <div>
              <strong>∞</strong>
              <span>
                Ideas left
                <br />
                to explore
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="experience section-wrap section-grid" id="experience">
        <div className="section-label">
          <span>02</span>
          <span>Experience</span>
        </div>
        <div className="experience-content">
          <div className="section-heading">
            <h2>
              Where I&apos;ve
              <br />
              <span>learned.</span>
            </h2>
            <p>Growing through real problems, real teams, and real users.</p>
          </div>
          <div className="timeline">
            {experienceItems.map((item) => (
              <div className="timeline-item" key={`${item.period}-${item.organization}`}>
                <div className="timeline-date">{item.period}</div>
                <div>
                  <h3>
                    {item.role} <span>@ {item.organization}</span>
                  </h3>
                  <p>{item.description}</p>
                </div>
                <MoveUpRight />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="work section-wrap section-grid" id="work">
        <div className="section-label">
          <span>03</span>
          <span>Selected work</span>
        </div>
        <div className="work-content">
          <div className="section-heading">
            <h2>
              Things I&apos;ve <span>built.</span>
            </h2>
            <p>Selected work where technology meets intention.</p>
          </div>
          <div className="project-grid">
            {projectItems.map((project) => {
              const resolvedIcon =
                typeof project.icon === "string"
                  ? projectIconMap[project.icon as ProjectIconName] ?? Layers3
                  : project.icon ?? Layers3;
              const Icon = resolvedIcon;
              return (
                <article
                  className={`project-card ${project.accent}`}
                  key={project.id ?? project.number}
                >
                  <div className="project-visual">
                    <img src={project.cover} alt={project.coverAlt} loading="lazy" />
                    <span className="project-category">
                      {project.number} / {project.type}{project.featured ? " · Featured" : ""}
                    </span>
                    {project.link ? (
                      <a className="project-external" href={project.link} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}>
                        <ArrowUpRight />
                      </a>
                    ) : (
                      <span className="project-external" aria-hidden="true"><ArrowUpRight /></span>
                    )}
                  </div>
                  <div className="project-details">
                    <span className="project-icon">
                      <Icon />
                    </span>
                    <div className="project-copy">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <span className="project-result">
                      <Check /> {project.result}
                    </span>
                    <div className="tag-list">
                      {project.stack.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="services section-wrap section-grid" id="services">
        <div className="section-label">
          <span>04</span>
          <span>What I do</span>
        </div>
        <div className="services-content">
          <div className="section-heading">
            <h2>
              From first
              <br />
              <span>idea to launch.</span>
            </h2>
            <p>
              Focused support for products that need both taste and technical
              depth.
            </p>
          </div>
          <div className="service-grid">
            {serviceItems.map((service, index) => {
              const Icon = serviceIconMap[service.icon as keyof typeof serviceIconMap] ?? Code2;
              return (
                <div key={service.id ?? `${service.title}-${index}`}>
                  <span className="service-icon"><Icon /></span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="process section-wrap section-grid">
        <div className="section-label">
          <span>05</span>
          <span>My process</span>
        </div>
        <div className="process-content">
          <div className="section-heading">
            <h2>
              Simple, not
              <br />
              <span>simplistic.</span>
            </h2>
            <p>A practical rhythm for moving from ambiguity to momentum.</p>
          </div>
          <div className="process-grid">
            {process.map(([number, title, description]) => (
              <div className="process-item" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="skills section-wrap section-grid" id="skills">
        <div className="section-label">
          <span>06</span>
          <span>Toolkit</span>
        </div>
        <div className="skills-content">
          <div className="section-heading">
            <h2>
              My everyday
              <br />
              <span>stack.</span>
            </h2>
            <p>Tools I use to turn ideas into reliable products.</p>
          </div>
          <div className="skill-cloud">
            {skillItems.map((skill, index) => (
              <span
                className={
                  index === 4 || index === 7
                    ? "skill-pill featured"
                    : "skill-pill"
                }
                key={typeof skill === "string" ? skill : skill.id ?? `${skill.name}-${index}`}
              >
                <Check />
                {typeof skill === "string" ? skill : <><span>{skill.name}</span>{skill.category && skill.category !== "general" && <small className="skill-category">{skill.category}</small>}</>}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="education section-wrap section-grid" id="education">
        <div className="section-label">
          <span>07</span>
          <span>Education</span>
        </div>
        <div className="education-content">
          <div className="section-heading">
            <h2>
              Always
              <br />
              <span>learning.</span>
            </h2>
            <p>Foundations that keep my practice curious and rigorous.</p>
          </div>
          {educationItems.map((item) => (
            <div className="education-card" key={`${item.period}-${item.degree}`}>
              <div>
                <span className="card-kicker">{item.period}</span>
                <h3>{item.degree}</h3>
                <p>{item.institution}</p>
                {item.details && <p style={{ marginTop: 8 }}>{item.details}</p>}
              </div>
              <span className="education-badge">{item.status}</span>
            </div>
          ))}
        </div>
      </section>

      <section
        className="credentials section-wrap section-grid"
        id="credentials"
      >
        <div className="section-label">
          <span>08</span>
          <span>Credentials</span>
        </div>
        <div className="credentials-content">
          <div className="section-heading">
            <h2>
              Proof of
              <br />
              <span>practice.</span>
            </h2>
            <p>
              A growing record of the systems, tools, and ideas behind the work.
            </p>
          </div>
          <div className="credential-grid">
            {certificateItems.map((item, index) => (
              <article key={`${item.title}-${index}`}>
                <span className="credential-mark">{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>
                  {item.issuer}
                  {item.date ? ` · ${item.date}` : ""}
                </p>
                {item.url && <a className="credential-link" href={item.url} target="_blank" rel="noreferrer">View credential <ArrowUpRight /></a>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="journal section-wrap section-grid" id="journal">
        <div className="section-label">
          <span>09</span>
          <span>Journal</span>
        </div>
        <div className="journal-content">
          <div className="section-heading">
            <h2>
              Notes from
              <br />
              <span>the build.</span>
            </h2>
            <p>
              Short reflections on software, systems, and learning in public.
            </p>
          </div>
          <div className="journal-list">
            {journalItems.map((entry, index) => (
              <article key={entry.id ?? entry.title}>
                <span>{String(index + 1).padStart(2, "0")} · {entry.category.toUpperCase()}</span>
                <h3>
                  {entry.url ? <a href={entry.url} target="_blank" rel="noreferrer">{entry.title} <ArrowUpRight /></a> : <>{entry.title} <ArrowUpRight /></>}
                </h3>
                <p>{entry.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact section-wrap" id="contact">
        <div className="contact-inner">
          <div>
            <div className="eyebrow">
              <span className="status-dot" /> Have a project in mind?
            </div>
            <h2>
              Let&apos;s make
              <br />
              <em>something useful.</em>
            </h2>
            <p className="contact-copy">
              Have a question, an idea, or a problem worth solving? I&apos;d
              love to hear about it.
            </p>
          </div>
          <button
            className="contact-button"
            type="button"
            onClick={() => {
              setContactOpen(true);
              setContactStatus("idle");
            }}
          >
            Start a conversation <Mail />
          </button>
        </div>
      </section>

      {contactOpen && (
        <div
          className="contact-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setContactOpen(false);
          }}
        >
          <section
            className="contact-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setContactOpen(false)}
              aria-label="Close contact form"
            >
              <X />
            </button>
            <span className="card-kicker">LET&apos;S CONNECT</span>
            <h2 id="contact-title">Start a conversation.</h2>
            <p>
              Tell me a little about what you&apos;re building. I&apos;ll get
              back to you soon.
            </p>
            {contactStatus === "success" || contactStatus === "partial" ? (
              <div className="contact-success">
                <Check />
                <strong>
                  {contactStatus === "partial"
                    ? "Message saved."
                    : "Message sent."}
                </strong>
                <span>
                  {contactStatus === "partial"
                    ? "Your message is stored, but email delivery failed. You do not need to submit it again."
                    : "Thanks for reaching out. I&apos;ll be in touch soon."}
                </span>
                <button
                  className="button button-primary"
                  type="button"
                  onClick={() => setContactOpen(false)}
                >
                  Close
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleContactSubmit}>
                <label htmlFor="contact-name">
                  Name
                  <input
                    id="contact-name"
                    name="name"
                    required
                    minLength={2}
                    autoComplete="name"
                  />
                </label>
                <label htmlFor="contact-email">
                  Email
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                  />
                </label>
                <label htmlFor="contact-message">
                  Message
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    minLength={10}
                    rows={5}
                  />
                </label>
                {contactStatus === "error" && (
                  <p className="form-error" role="alert">
                    {contactError || "Please check your details and try again."}
                  </p>
                )}
                <button
                  className="button button-primary"
                  type="submit"
                  disabled={contactStatus === "sending"}
                >
                  {contactStatus === "sending" ? "Sending…" : "Send message"}{" "}
                  <Send />
                </button>
              </form>
            )}
          </section>
        </div>
      )}

      <footer className="site-footer section-wrap">
        <span>© 2026 Alemu Kelemework</span>
        <span className="footer-note">
          <Terminal /> Designed &amp; built with intention
        </span>
        <div className="socials">
          {socialItems.map((account) => (
            <a key={account.id ?? account.platform} href={account.url} target="_blank" rel="noreferrer" aria-label={account.platform}>
              <Globe2 />
            </a>
          ))}
          <a href={`mailto:${siteSettings.contactEmail}`} aria-label="Email">
            <Mail />
          </a>
          <a href="#contact" onClick={openContact} aria-label="Send message">
            <Send />
          </a>
        </div>
      </footer>
    </main>
  );
}
