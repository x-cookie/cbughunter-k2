import Link from "next/link";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/ScrollReveal";

const FEATURED = [
  { domain: "Web",        domainSlug: "web-hunting",  cmd: "/hunt-sqli",         slug: "web-hunting/hunt-sqli",         name: "SQLi Hunter",        desc: "Time-based blind, NoSQL, ORM raw-fragment — 12 disclosed reports." },
  { domain: "Web",        domainSlug: "web-hunting",  cmd: "/hunt-xss",          slug: "web-hunting/hunt-xss",          name: "XSS Hunter",         desc: "DOM, reflected, stored, mutation-XSS — built from 174 H1 reports." },
  { domain: "Auth",       domainSlug: "auth",         cmd: "/hunt-oauth",        slug: "auth/hunt-oauth",               name: "OAuth Hunter",       desc: "CSRF on redirect_uri, code injection, token leakage — 19 reports." },
  { domain: "Recon",      domainSlug: "recon",        cmd: "/osint-methodology", slug: "recon/osint-methodology",       name: "OSINT Methodology",  desc: "5-stage pipeline, 29 asset types, identity-fabric mapping." },
  { domain: "Enterprise", domainSlug: "enterprise",   cmd: "/cloud-iam-deep",    slug: "enterprise/cloud-iam-deep",     name: "Cloud IAM Deep",     desc: "AWS/Azure/GCP — 24+ privesc patterns, SSRF to IMDS chain." },
  { domain: "Reporting",  domainSlug: "reporting",    cmd: "/triage-validation", slug: "reporting/triage-validation",   name: "Triage Validation",  desc: "7-Question Gate runner — kills speculative reports before submission." },
];

export function FeaturedSkills() {
  return (
    <div style={{ padding: "64px 48px", background: "var(--bg)", borderBottom: "1px solid var(--b0)" }}>
      <ScrollReveal>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
          Featured skills
        </div>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--text)", marginBottom: 10 }}>
          The full workflow,{" "}
          <span style={{ color: "var(--text-fade)" }}>one command at a time</span>
        </h2>
      </ScrollReveal>
      <ScrollReveal delay={0.15}>
        <p style={{ fontSize: 13, color: "rgba(240,240,255,0.38)", maxWidth: 420, lineHeight: 1.65, fontWeight: 300, marginBottom: 36 }}>
          Purpose-built for each attack class. Download one skill or an entire domain from GitHub.
        </p>
      </ScrollReveal>

      <ScrollRevealGroup
        className="skills-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}
        stagger={0.08}
      >
        {FEATURED.map((s) => (
          <ScrollRevealItem key={s.cmd}>
            <Link
              href={`/skills/${s.slug}`}
              className="skill-card"
              style={{
                background: "var(--s1)",
                border: "1px solid var(--b0)",
                borderRadius: 12,
                padding: "22px 24px",
                textDecoration: "none",
                display: "block",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", background: "var(--s2)", padding: "3px 8px", borderRadius: 4 }}>
                  {s.domain}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", background: "var(--accent-dim)", padding: "3px 8px", borderRadius: 4 }}>
                  {s.cmd}
                </span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 6, letterSpacing: "-0.01em" }}>
                {s.name}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6, fontWeight: 300 }}>
                {s.desc}
              </div>
            </Link>
          </ScrollRevealItem>
        ))}
      </ScrollRevealGroup>

      <ScrollReveal delay={0.1} style={{ marginTop: 28, textAlign: "center" }}>
        <Link href="/docs/quick-start" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textDecoration: "none", letterSpacing: "0.04em" }}>
          View all 51 skills →
        </Link>
      </ScrollReveal>
    </div>
  );
}
