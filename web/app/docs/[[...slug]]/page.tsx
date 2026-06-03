import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/PageHeader";
import { DocsSidebar } from "@/components/DocsSidebar";
import { CubeAccent } from "@/components/CubeAccent";
import { domains } from "@/content/domains";

const GITHUB = "https://github.com/x-cookie/cbughunter-k1/tree/main/skills";

const SECTIONS = [
  { slug: "overview",      title: "What you need",   label: "Prerequisites",      group: "Getting started" },
  { slug: "install",       title: "Install a skill",  label: "Step-by-step guide", group: "Getting started" },
  { slug: "install-order", title: "Install order",    label: "Where to start",     group: "Getting started" },
  { slug: "faq",           title: "FAQ",              label: "Common questions",   group: "Support" },
];

export function generateStaticParams() {
  return [{ slug: [] }, ...SECTIONS.map((s) => ({ slug: [s.slug] }))];
}

const DOMAIN_ORDER = [
  { slug: "web-hunting",  note: "Start here — 22 skills, covers the most common H1 vulnerability classes" },
  { slug: "auth",         note: "OAuth, JWT, SAML, ATO, MFA bypass patterns" },
  { slug: "reporting",    note: "7-Question Gate, report writing, evidence hygiene" },
  { slug: "recon",        note: "OSINT methodology, subdomain hunting, offensive recon" },
  { slug: "api-infra",    note: "API misconfig, cloud storage, GraphQL, NTLM" },
  { slug: "enterprise",   note: "M365, Okta, vCenter, IAM privilege escalation" },
  { slug: "red-team",     note: "APK pipeline, supply chain recon, IR detection" },
  { slug: "specialized",  note: "Web3 smart contracts, meme coin audits" },
];

const FAQ = [
  {
    q: "Do I need a paid Claude account?",
    a: "No. Claude Free works for Chat-mode skills. Pro and higher give more context, faster responses, and better throughput. Claude Code (terminal) requires Claude Pro or higher.",
  },
  {
    q: "Do these skills work with the Anthropic API?",
    a: "Yes. Each SKILL.md is a complete system prompt. You can pass it directly to the Anthropic API or OpenRouter. See the GitHub repo for API usage examples.",
  },
  {
    q: "Can I install individual skills or only full domains?",
    a: "Both. Each skill folder can be downloaded and uploaded independently. Download the full domain ZIP to get all skills in one upload.",
  },
  {
    q: "Can I modify the skills?",
    a: "Absolutely. The skills are MIT licensed. Fork the repo, edit the SKILL.md files to match your target types, scope, or program rules, and upload your modified version.",
  },
  {
    q: "Are skills visible to my whole Claude workspace?",
    a: "When you upload via claude.ai/customize/skills, the skill is available to your workspace by default. Check Claude admin settings to control skill visibility.",
  },
  {
    q: "What's the 7-Question Gate?",
    a: "A mandatory pre-submission checklist built into the triage-validation skill. Every finding must pass all 7 questions before a report gets written. One wrong answer kills the finding — this keeps your N/A ratio clean.",
  },
];

export default function DocsPage() {
  return (
    <>
      <Nav />
      {/* Cubes float behind PageHeader */}
      <div style={{ position: "relative" }}>
        <CubeAccent variant="blue"   size="lg" opacity={0.55} style={{ position: "absolute", top: -15, right: 0, zIndex: 0 }} />
        <CubeAccent variant="purple" size="md" opacity={0.38} style={{ position: "absolute", bottom: 0, right: 240, zIndex: 0 }} />
      </div>
      <PageHeader
        eyebrow="Quick start · No code required"
        title={
          <>
            Getting Started{" "}
            <span style={{ color: "var(--text-fade)" }}>in under 5 minutes</span>
          </>
        }
        subtitle="How to download a cbug skill and add it to Claude. No API keys. No code. No setup."
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 56, alignItems: "start" }}>

          {/* Sidebar — inline scrollspy */}
          <div style={{ position: "sticky", top: 80 }}>
            <DocsSidebar sections={SECTIONS} inline />
          </div>

          {/* Main content */}
          <div style={{ display: "flex", flexDirection: "column", gap: 72 }}>

            {/* Overview */}
            <div id="overview" style={{
              background: "var(--accent-dim)",
              border: "1px solid rgba(90,133,255,0.18)",
              borderRadius: 14,
              padding: "24px 28px",
            }}>
              <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 14, letterSpacing: "-0.02em" }}>
                What you need
              </h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  <>A <strong>Claude account</strong> — Free works for Chat mode. Pro+ for Claude Code.</>,
                  <>Access to <a href="https://claude.ai/customize/skills" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>claude.ai/customize/skills</a> (admin or skill-install permission)</>,
                  <>A ZIP file of the skill — downloaded from the <a href={GITHUB} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>cbug GitHub repo</a></>,
                ].map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "rgba(240,240,255,0.55)", lineHeight: 1.6, fontWeight: 300 }}>
                    <span style={{ color: "var(--accent)", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Step-by-step install */}
            <section id="install">
              <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text)", marginBottom: 36 }}>
                Install a skill —{" "}
                <span style={{ color: "var(--text-fade)" }}>step by step</span>
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  {
                    n: "1",
                    title: "Find the skill you want",
                    body: <>Browse the <Link href="/skills" style={{ color: "var(--accent)", textDecoration: "none" }}>skills directory</Link> — 51 skills across 8 attack domains. Each page shows the slash command, environment support, and description.</>,
                    extra: (
                      <div style={{ background: "var(--s2)", border: "1px solid var(--b0)", borderRadius: 10, padding: "16px 20px", marginTop: 14 }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>
                          8 attack domains
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                          {domains.map((d) => (
                            <Link key={d.slug} href={`/skills/${d.slug}`} style={{
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              fontSize: 12, color: "rgba(240,240,255,0.40)", textDecoration: "none",
                              padding: "5px 8px", borderRadius: 6, transition: "color 0.15s",
                            }}>
                              <span>{d.title}</span>
                              <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{d.skillCount}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ),
                  },
                  {
                    n: "2",
                    title: "Download the skill ZIP from GitHub",
                    body: <>Navigate to the skill folder in the <a href={GITHUB} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>cbug skills repo</a>. Click the green <strong>Code</strong> button → <strong>Download ZIP</strong>. Each skill lives in its own folder — download one skill or an entire domain.</>,
                    extra: null,
                  },
                  {
                    n: "3",
                    title: "Upload to claude.ai/customize/skills",
                    body: <>Go to <a href="https://claude.ai/customize/skills" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>claude.ai/customize/skills</a>, click <strong>Add skill</strong>, and upload the ZIP. The skill becomes available as a slash command workspace-wide — immediately, no restart needed.</>,
                    extra: null,
                  },
                  {
                    n: "4",
                    title: "Use the skill in Claude",
                    body: <>Type <code style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", background: "var(--accent-dim)", borderRadius: 4, padding: "1px 6px" }}>/</code> in any Claude conversation to see your skills, select one, and attach your target URL or file. Findings are streamed back in the conversation.</>,
                    extra: (
                      <div style={{ background: "#080810", border: "1px solid rgba(90,133,255,0.1)", borderRadius: 10, padding: "14px 18px", marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.75 }}>
                        <p style={{ color: "rgba(255,255,255,0.35)" }}># Example — SQLi hunt</p>
                        <p>
                          <span style={{ color: "var(--accent)" }}>›</span>{" "}
                          <span style={{ color: "rgba(240,240,255,0.85)" }}>/hunt-sqli https://target.com/search?q=test</span>
                        </p>
                        <p style={{ color: "rgba(240,240,255,0.40)" }}>  Running SQLi patterns... time-based check...</p>
                        <p style={{ color: "#4ade80" }}>  ✓ Blind SQLi found — /api/search?q= (8.3s delay)</p>
                        <p style={{ color: "rgba(240,240,255,0.40)" }}>  CVSS: 9.1 · Ready for /triage</p>
                      </div>
                    ),
                  },
                ].map((step, idx, arr) => (
                  <div key={step.n} style={{ display: "flex", gap: 20 }}>
                    {/* Timeline */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: "var(--accent)", color: "#fff",
                        fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 14,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        {step.n}
                      </div>
                      {idx < arr.length - 1 && (
                        <div style={{ width: 1, flex: 1, background: "var(--b0)", marginTop: 8, marginBottom: 8 }} />
                      )}
                    </div>
                    {/* Content */}
                    <div style={{ paddingBottom: idx < arr.length - 1 ? 32 : 0, flex: 1 }}>
                      <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.02em" }}>
                        {step.title}
                      </h3>
                      <p style={{ fontSize: 13, color: "rgba(240,240,255,0.45)", lineHeight: 1.7, fontWeight: 300 }}>
                        {step.body}
                      </p>
                      {step.extra}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommended install order */}
            <section id="install-order">
              <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text)", marginBottom: 10 }}>
                Recommended{" "}
                <span style={{ color: "var(--text-fade)" }}>install order</span>
              </h2>
              <p style={{ fontSize: 13, color: "rgba(240,240,255,0.40)", marginBottom: 24, fontWeight: 300 }}>
                Start with <Link href="/skills/web-hunting" style={{ color: "var(--accent)", textDecoration: "none" }}>Web Hunting</Link> — it covers the majority of H1 bug class patterns and is the most commonly used domain.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {DOMAIN_ORDER.map((item, i) => {
                  const domain = domains.find((d) => d.slug === item.slug);
                  if (!domain) return null;
                  return (
                    <div key={item.slug} style={{
                      display: "flex", alignItems: "center", gap: 14,
                      background: "var(--s1)", border: "1px solid var(--b0)",
                      borderRadius: 10, padding: "12px 16px",
                    }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", width: 40, flexShrink: 0, letterSpacing: "0.04em" }}>
                        {i === 0 ? "First" : "Then"}
                      </span>
                      <Link href={`/skills/${item.slug}`} style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--text)", textDecoration: "none", minWidth: 120, flexShrink: 0 }}>
                        {domain.title}
                      </Link>
                      <span style={{ fontSize: 12, color: "rgba(240,240,255,0.35)", fontWeight: 300 }}>
                        {item.note}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text)", marginBottom: 36 }}>
                FAQ
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {FAQ.map((item, i) => (
                  <div key={i} style={{ borderBottom: "1px solid var(--b0)", padding: "20px 0", ...(i === FAQ.length - 1 ? { borderBottom: "none" } : {}) }}>
                    <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.01em" }}>
                      {item.q}
                    </h3>
                    <p style={{ fontSize: 13, color: "rgba(240,240,255,0.42)", lineHeight: 1.7, fontWeight: 300 }}>
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div style={{ background: "var(--accent-dim)", border: "1px solid rgba(90,133,255,0.18)", borderRadius: 14, padding: "32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <CubeAccent variant="mixed" size="sm" opacity={0.35} style={{ position: "absolute", top: -5, right: 8, zIndex: 0 }} />
              <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 6, letterSpacing: "-0.02em" }}>
                Ready to get started?
              </h2>
              <p style={{ fontSize: 13, color: "rgba(240,240,255,0.40)", marginBottom: 24, fontWeight: 300 }}>
                Browse all 51 skills across 8 attack domains — MIT licensed.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                <Link href="/skills" style={{ background: "var(--accent)", color: "#fff", fontWeight: 600, padding: "10px 22px", borderRadius: 8, fontSize: 13, textDecoration: "none", fontFamily: "var(--font-sans)" }}>
                  Browse all skills
                </Link>
                <a href={GITHUB} target="_blank" rel="noopener noreferrer"
                  style={{ background: "var(--s2)", color: "rgba(240,240,255,0.55)", border: "1px solid var(--b0)", fontWeight: 500, padding: "10px 22px", borderRadius: 8, fontSize: 13, textDecoration: "none", fontFamily: "var(--font-sans)" }}>
                  View on GitHub
                </a>
                <a href="https://claude.ai/customize/skills" target="_blank" rel="noopener noreferrer"
                  style={{ background: "var(--s2)", color: "rgba(240,240,255,0.55)", border: "1px solid var(--b0)", fontWeight: 500, padding: "10px 22px", borderRadius: 8, fontSize: 13, textDecoration: "none", fontFamily: "var(--font-sans)" }}>
                  Claude Skills Manager
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
