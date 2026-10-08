"use client";

import { useEffect, useState } from "react";
import { submitContact } from "./actions/contact";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Code2,
  Database,
  Globe2,
  Layers3,
  Mail,
  Menu,
  Moon,
  MoveUpRight,
  Send,
  Sparkles,
  Sun,
  Terminal,
  X,
} from "lucide-react";

const roles = [
  "Full-Stack Developer",
  "Software Engineering Intern",
  "Product-minded Builder",
];

const projects = [
  {
    number: "01",
    type: "Operations platform",
    title: "Task Management System",
    description:
      "A calm, structured workspace for teams to plan, assign, and ship work with clarity.",
    result: "Clearer ownership across every task",
    stack: ["Next.js", "NestJS", "Swagger"],
    accent: "lime",
    icon: Layers3,
  },
  {
    number: "02",
    type: "Business software",
    title: "Restaurant Management",
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
    description:
      "Connected project tools for managing sites, resources, reports, and progress from one place.",
    result: "Less friction between site and office",
    stack: ["Next.js", "NestJS", "Better Auth", "Docker"],
    accent: "orange",
    icon: Code2,
  },
  {
    number: "04",
    type: "Digital experience",
    title: "Qine Bet Website",
    description:
      "A responsive, high-energy web experience built for fast, intuitive interaction across devices.",
    result: "A sharper, faster brand presence",
    stack: ["Next.js", "Tailwind CSS"],
    accent: "purple",
    icon: Globe2,
  },
];

const skills = [
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
];

const process = [
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
];

export default function Page() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
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
            <span className="status-dot" /> Available for opportunities{" "}
            <span className="eyebrow-line" />
          </div>
          <h1>
            Software with
            <br />
            <em>clarity</em> and
            <br />
            character<span className="accent">.</span>
          </h1>
          <p className="hero-intro">
            I&apos;m Alemu, a full-stack developer and Computer Science student
            crafting useful, thoughtful products from Addis Ababa, Ethiopia.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">
              Explore my work <ArrowDown />
            </a>
            <a
              className="button button-ghost"
              href="#contact"
              onClick={openContact}
            >
              Get in touch <ArrowUpRight />
            </a>
          </div>
          <div className="hero-proof">
            <span>Currently</span>
            <strong>Building at Ethio Telecom</strong>
            <span className="proof-line" />
            <span>Based in Addis Ababa</span>
          </div>
        </div>
        <div className="hero-aside">
          <div className="portrait-frame">
            <img src="/alemu-portrait.png" alt="Portrait of Alemu Kelemework" />
          </div>
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-terminal">
            <div className="terminal-top">
              <span />
              <span />
              <span />
              <small>alemu@portfolio ~</small>
            </div>
            <div className="terminal-body">
              <p>
                <span className="terminal-muted">const</span> developer = {"{"}
              </p>
              <p className="indent">
                name:{" "}
                <span className="terminal-string">&quot;Alemu K.&quot;</span>,
              </p>
              <p className="indent">
                role:{" "}
                <span className="terminal-string">
                  &quot;{roles[roleIndex]}&quot;
                </span>
                ,
              </p>
              <p className="indent">
                focus:{" "}
                <span className="terminal-string">
                  &quot;great products&quot;
                </span>
                ,
              </p>
              <p className="indent">
                status:{" "}
                <span className="terminal-string">
                  &quot;open to build&quot;
                </span>
                ,
              </p>
              <p>{"}"};</p>
              <p className="terminal-cursor">_</p>
            </div>
          </div>
          <div className="hero-index">
            01 <span>/</span> 04
          </div>
        </div>
      </section>

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
              I&apos;m a fourth-year Computer Science student at Mizan-Tepi
              University and a Software Engineering Intern at Ethio Telecom in
              Dembel, Addis Ababa.
            </p>
            <p>
              My work sits at the intersection of clean engineering and
              human-centered design. I turn complex requirements into simple,
              scalable experiences that teams can actually use.
            </p>
          </div>
          <div className="about-meta">
            <div>
              <strong>04+</strong>
              <span>
                Years learning
                <br />
                and building
              </span>
            </div>
            <div>
              <strong>10+</strong>
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
            <div className="timeline-item">
              <div className="timeline-date">2024 — NOW</div>
              <div>
                <h3>
                  Software Engineering Intern <span>@ Ethio Telecom</span>
                </h3>
                <p>
                  Building internal tools and learning how reliable software
                  supports a large, connected organization.
                </p>
              </div>
              <MoveUpRight />
            </div>
            <div className="timeline-item">
              <div className="timeline-date">2022 — NOW</div>
              <div>
                <h3>
                  Computer Science Student <span>@ Mizan-Tepi University</span>
                </h3>
                <p>
                  Studying the foundations behind the interfaces, systems, and
                  products I build every day.
                </p>
              </div>
              <MoveUpRight />
            </div>
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
            {projects.map((project) => {
              const Icon = project.icon;
              return (
                <article
                  className={`project-card ${project.accent}`}
                  key={project.number}
                >
                  <div className="project-top">
                    <span className="project-number">
                      {project.number} / {project.type}
                    </span>
                    <ArrowUpRight className="project-arrow" />
                  </div>
                  <div className="project-visual">
                    <div className="visual-lines" />
                    <Icon />
                  </div>
                  <div className="project-copy">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <span className="project-result">
                      <Sparkles /> {project.result}
                    </span>
                  </div>
                  <div className="tag-list">
                    {project.stack.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
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
            <div>
              <span className="service-icon">
                <Code2 />
              </span>
              <h3>Build digital products</h3>
              <p>
                Full-stack web applications with clean architecture, responsive
                interfaces, and dependable backend systems.
              </p>
            </div>
            <div>
              <span className="service-icon">
                <Layers3 />
              </span>
              <h3>Shape product experiences</h3>
              <p>
                Clear flows, purposeful interfaces, and design decisions that
                help people move with confidence.
              </p>
            </div>
            <div>
              <span className="service-icon">
                <Database />
              </span>
              <h3>Make systems reliable</h3>
              <p>
                Authentication, data modeling, APIs, and deployment foundations
                built to grow without drama.
              </p>
            </div>
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
            {skills.map((skill, index) => (
              <span
                className={
                  index === 4 || index === 7
                    ? "skill-pill featured"
                    : "skill-pill"
                }
                key={skill}
              >
                <Check />
                {skill}
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
          <div className="education-card">
            <div>
              <span className="card-kicker">2022 — PRESENT</span>
              <h3>BSc. Computer Science</h3>
              <p>Mizan-Tepi University · Ethiopia</p>
            </div>
            <span className="education-badge">In progress</span>
          </div>
          <div className="education-card">
            <div>
              <span className="card-kicker">CONTINUOUS PRACTICE</span>
              <h3>Engineering through building</h3>
              <p>
                Product architecture, backend systems, accessible interfaces,
                and deployment workflows.
              </p>
            </div>
            <span className="education-badge">Ongoing</span>
          </div>
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
            <article>
              <span className="credential-mark">01</span>
              <h3>Full-stack systems</h3>
              <p>From data models and APIs to production-ready interfaces.</p>
            </article>
            <article>
              <span className="credential-mark">02</span>
              <h3>Product thinking</h3>
              <p>
                Making technical decisions serve real people and clear outcomes.
              </p>
            </article>
            <article>
              <span className="credential-mark">03</span>
              <h3>Reliable delivery</h3>
              <p>
                Auth, testing, documentation, and deployment are part of the
                craft.
              </p>
            </article>
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
            <article>
              <span>01 · ENGINEERING</span>
              <h3>
                Designing a portfolio that can grow with the work{" "}
                <ArrowUpRight />
              </h3>
              <p>
                Why a professional site should be a living system, not a
                finished screenshot.
              </p>
            </article>
            <article>
              <span>02 · BACKEND</span>
              <h3>
                What makes an internal tool feel dependable <ArrowUpRight />
              </h3>
              <p>
                Small decisions around feedback, permissions, and data shape the
                whole experience.
              </p>
            </article>
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
          <a
            href="https://github.com/hiruykelemewor7774"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <Globe2 />
          </a>
          <a
            href="https://www.linkedin.com/in/alemu-kelemework/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <Globe2 />
          </a>
          <a href="mailto:alemukelemework363@gmail.com" aria-label="Email">
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
