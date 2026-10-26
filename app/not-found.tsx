import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <main className="site-shell dark-mode">
      <div className="noise" aria-hidden="true" />
      <section className="section-wrap" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <div className="contact-modal" style={{ maxWidth: 560, width: "100%" }}>
          <span className="card-kicker">404</span>
          <h2 style={{ marginTop: 12, marginBottom: 12 }}>This page is not here.</h2>
          <p>
            The route you requested could not be found. Head back to the portfolio home and keep exploring.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            <Link href="/" className="button button-primary" style={{ textDecoration: "none" }}>
              <Home size={16} /> Home
            </Link>
            <Link href="#contact" className="button button-ghost" style={{ textDecoration: "none" }}>
              <ArrowLeft size={16} /> Back
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
