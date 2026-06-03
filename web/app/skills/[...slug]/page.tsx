import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/ScrollReveal";
import { DemoVideo } from "@/components/DemoVideo";
import { CrosshairIcon, LockIcon, NetworkIcon, BuildingIcon, TargetIcon, EyeIcon, FileCheckIcon, ChainIcon, ArrowRight } from "@/components/icons";
import { CubeAccent } from "@/components/CubeAccent";
import { getSkill, getSkillsByDomain, skills } from "@/content/skills";
import { getDomain, domains } from "@/content/domains";
import { getDemoId } from "@/content/demos";

/* Domain slug → filesystem folder name */
const DOMAIN_FOLDER: Record<string, string> = {
  "web-hunting": "web-hunting",
  "auth":        "auth-identity",
  "api-infra":   "api-infra",
  "enterprise":  "enterprise",
  "red-team":    "red-team",
  "recon":       "recon-osint",
  "reporting":   "reporting",
  "specialized": "specialized",
};

const DOMAIN_ICONS: Record<string, React.ReactNode> = {
  "web-hunting": <CrosshairIcon size={16} color="var(--accent)" />,
  "auth":        <LockIcon size={16} color="var(--accent2)" />,
  "api-infra":   <NetworkIcon size={16} color="var(--accent)" />,
  "enterprise":  <BuildingIcon size={16} color="var(--accent2)" />,
  "red-team":    <TargetIcon size={16} color="#ef4444" />,
  "recon":       <EyeIcon size={16} color="var(--accent)" />,
  "reporting":   <FileCheckIcon size={16} color="var(--accent2)" />,
  "specialized": <ChainIcon size={16} color="var(--accent)" />,
};

const ENV_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  chat: { bg: "var(--accent-dim)",   color: "var(--accent)",  label: "Chat ✓" },
  both: { bg: "var(--accent2-dim)",  color: "var(--accent2)", label: "Both ✓" },
  code: { bg: "rgba(234,179,8,0.1)", color: "#ca8a04",        label: "Limited ⚠" },
};

interface Props { params: { slug: string[] } }

export function generateStaticParams() {
  const domainPaths = domains.map((d) => ({ slug: [d.slug] }));
  const skillPaths  = skills.map((s) => ({ slug: s.id.split("/") }));
  return [...domainPaths, ...skillPaths];
}

/* ── Domain listing ────────────────────────────────────────── */
function DomainPage({ domainSlug }: { domainSlug: string }) {
  const domain = getDomain(domainSlug);
  if (!domain) notFound();
  const domainSkills = getSkillsByDomain(domainSlug);

  return (
    <>
      <Nav />
      <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <div style={{ background: "var(--hero)", padding: "56px 48px 48px", borderBottom: "1px solid var(--b0)", position: "relative", overflow: "hidden" }}>
          <CubeAccent variant="mixed" size="md" opacity={0.70}
            style={{ position: "absolute", top: -5, right: 32, zIndex: 0 }} />
          <CubeAccent variant="purple" size="sm" opacity={0.45}
            style={{ position: "absolute", bottom: 4, right: 220, zIndex: 0 }} />
          <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <ScrollReveal>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", color: "rgba(240,240,255,0.2)", marginBottom: 20 }}>
                <Link href="/skills" style={{ color: "inherit", textDecoration: "none" }}>skills</Link>
                <span>/</span>
                <span style={{ color: "rgba(240,240,255,0.45)" }}>{domainSlug}</span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.06}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                {DOMAIN_ICONS[domainSlug]}
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent2)" }}>
                  {domainSkills.length} skills
                </span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h1 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(28px, 4.5vw, 50px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, color: "var(--text)", marginBottom: 12 }}>
                {domain.title}
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.14}>
              <p style={{ fontSize: 14, color: "rgba(240,240,255,0.38)", maxWidth: 520, lineHeight: 1.7, fontWeight: 300 }}>
                {domain.description}
              </p>
            </ScrollReveal>
          </div>
        </div>

        <div style={{ padding: "48px 48px", maxWidth: 1200, margin: "0 auto" }}>
          <ScrollRevealGroup
            className="skills-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridAutoRows: "1fr", gap: 12 }}
            stagger={0.07}
          >
            {domainSkills.map((skill) => {
              const env = ENV_STYLE[skill.env];
              return (
                <ScrollRevealItem key={skill.id} style={{ height: "100%" }}>
                  <Link
                    href={`/skills/${skill.id}`}
                    className="skill-card"
                    style={{
                      background: "var(--s1)",
                      border: "1px solid var(--b0)",
                      borderRadius: 12,
                      padding: "22px 24px",
                      textDecoration: "none",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    {/* Top row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", background: "var(--accent-dim)", padding: "3px 8px", borderRadius: 4 }}>
                        {skill.command}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, background: env.bg, color: env.color, padding: "3px 8px", borderRadius: 4 }}>
                        {env.label}
                      </span>
                    </div>
                    {/* Name */}
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 6, letterSpacing: "-0.01em" }}>
                      {skill.name}
                    </div>
                    {/* Description — clamped, takes remaining space */}
                    <div style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      lineHeight: 1.65,
                      fontWeight: 300,
                      flex: 1,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                    } as React.CSSProperties}>
                      {skill.description}
                    </div>
                    {/* Footer */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                      {skill.reportCount && (
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.04em" }}>
                          {skill.reportCount} reports
                        </span>
                      )}
                      <ArrowRight size={8} />
                    </div>
                  </Link>
                </ScrollRevealItem>
              );
            })}
          </ScrollRevealGroup>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ── Skill detail ──────────────────────────────────────────── */
function SkillDetailPage({ skillId }: { skillId: string }) {
  const skill = getSkill(skillId);
  if (!skill) notFound();

  const domain  = getDomain(skill.domain);
  const demoId  = getDemoId(skillId);
  const env     = ENV_STYLE[skill.env];

  /* Read the actual SKILL.md from disk */
  let frontmatter: Record<string, unknown> = {};
  let bodyContent = "";
  const folderName = DOMAIN_FOLDER[skill.domain];
  const skillName  = skill.folderPath.split("/").pop() ?? "";
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "..", "skills", folderName, skillName, "SKILL.md"),
      "utf-8"
    );
    const parsed = matter(raw);
    frontmatter = parsed.data as Record<string, unknown>;
    bodyContent = parsed.content;
  } catch {
    bodyContent = skill.description;
  }

  /* Parse sources into array */
  const sources: string[] = typeof frontmatter.sources === "string"
    ? frontmatter.sources.split(",").map((s: string) => s.trim()).filter(Boolean)
    : [];

  /* Split body into ## sections */
  const sections: { heading: string; body: string }[] = [];
  let curH = "";
  let curB: string[] = [];
  for (const line of bodyContent.split("\n")) {
    if (line.startsWith("## ")) {
      if (curH || curB.some((l) => l.trim())) sections.push({ heading: curH, body: curB.join("\n").trim() });
      curH = line.replace(/^##\s+/, "");
      curB = [];
    } else {
      curB.push(line);
    }
  }
  if (curH || curB.some((l) => l.trim())) sections.push({ heading: curH, body: curB.join("\n").trim() });

  return (
    <>
      <Nav />
      <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
        {/* Hero */}
        <div style={{ background: "var(--hero)", padding: "56px 48px 48px", borderBottom: "1px solid var(--b0)", position: "relative", overflow: "hidden" }}>
          <CubeAccent variant="blue" size="sm" opacity={0.60}
            style={{ position: "absolute", top: 0, right: 24, zIndex: 0 }} />
          <CubeAccent variant="purple" size="sm" opacity={0.40}
            style={{ position: "absolute", bottom: 0, right: 170, zIndex: 0 }} />
          <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <ScrollReveal>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", color: "rgba(240,240,255,0.2)", marginBottom: 20 }}>
                <Link href="/skills" style={{ color: "inherit", textDecoration: "none" }}>skills</Link>
                <span>/</span>
                <Link href={`/skills/${skill.domain}`} style={{ color: "inherit", textDecoration: "none" }}>{skill.domain}</Link>
                <span>/</span>
                <span style={{ color: "rgba(240,240,255,0.45)" }}>{skillName}</span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.06}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, background: "rgba(90,133,255,0.18)", color: "var(--accent)", padding: "5px 14px", borderRadius: 6, fontWeight: 600 }}>
                  {skill.command}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, background: env.bg, color: env.color, padding: "4px 9px", borderRadius: 4 }}>
                  {env.label}
                </span>
                {skill.reportCount && (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, background: "var(--accent2-dim)", color: "var(--accent2)", padding: "4px 9px", borderRadius: 4 }}>
                    {skill.reportCount} reports
                  </span>
                )}
                {frontmatter.version != null && (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, background: "rgba(255,255,255,0.05)", color: "var(--text-muted)", padding: "4px 9px", borderRadius: 4 }}>
                    v{String(frontmatter.version)}
                  </span>
                )}
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h1 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(28px, 4.5vw, 50px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, color: "var(--text)", marginBottom: 14 }}>
                {skill.name}
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.14}>
              <p style={{ fontSize: 14, color: "rgba(240,240,255,0.40)", maxWidth: 600, lineHeight: 1.75, fontWeight: 300 }}>
                {skill.description}
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* Body — 2-col: content + sidebar */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 48px", display: "grid", gridTemplateColumns: "1fr 260px", gap: 32, alignItems: "start" }}>

          {/* Main content — min-width:0 prevents grid overflow */}
          <div style={{ minWidth: 0, overflow: "hidden" }}>
            {demoId && (
              <ScrollReveal style={{ marginBottom: 36 }}>
                <DemoVideo videoId={demoId} title={`${skill.name} demo`} />
              </ScrollReveal>
            )}

            {/* SKILL.md sections */}
            <ScrollRevealGroup style={{ display: "flex", flexDirection: "column", gap: 0 }} stagger={0.06}>
              {sections.map((sec, i) => (
                <ScrollRevealItem key={i}>
                  <SkillSection heading={sec.heading} body={sec.body} />
                </ScrollRevealItem>
              ))}
            </ScrollRevealGroup>
          </div>

          {/* Sidebar — dense metadata */}
          <div style={{ position: "sticky", top: 72 }}>
            <ScrollReveal>
              {/* Metadata card */}
              <div style={{ background: "var(--s1)", border: "1px solid var(--b0)", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--b0)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Skill metadata
                </div>
                <div style={{ padding: "4px 0" }}>
                  {[
                    { label: "Command",  value: skill.command,                    mono: true },
                    { label: "Domain",   value: domain?.title ?? skill.domain,    mono: false },
                    { label: "Env",      value: env.label,                        mono: true },
                    { label: "Reports",  value: skill.reportCount ? String(skill.reportCount) : "—", mono: true },
                    { label: "Version",  value: frontmatter.version ? String(frontmatter.version) : "—", mono: true },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "9px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", width: 56, flexShrink: 0, paddingTop: 1 }}>
                        {row.label}
                      </span>
                      <span style={{ fontFamily: row.mono ? "var(--font-mono)" : "var(--font-sans)", fontSize: row.mono ? 10 : 12, color: "rgba(240,240,255,0.65)", fontWeight: row.mono ? 400 : 500, letterSpacing: row.mono ? "0.02em" : undefined }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sources card */}
              {sources.length > 0 && (
                <div style={{ background: "var(--s1)", border: "1px solid var(--b0)", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--b0)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    Sources · {sources.length}
                  </div>
                  <div style={{ padding: "10px 16px", display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {sources.map((src) => (
                      <span key={src} style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", background: "var(--s2)", padding: "3px 7px", borderRadius: 4, letterSpacing: "0.02em" }}>
                        {src}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Install card */}
              <div style={{ background: "var(--s1)", border: "1px solid var(--b0)", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--b0)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Install
                </div>
                <div style={{ padding: "10px 0" }}>
                  {[
                    `Download skills/${folderName}/${skillName}/`,
                    "Zip → upload to claude.ai/customize/skills",
                    `Type ${skill.command} in Claude`,
                  ].map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "7px 16px", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : undefined }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--accent)", background: "var(--accent-dim)", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700 }}>
                        {i + 1}
                      </span>
                      <span style={{ fontSize: 11, color: "rgba(240,240,255,0.40)", lineHeight: 1.55, fontFamily: i === 0 ? "var(--font-mono)" : undefined }}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download CTA */}
              <a
                href={`https://github.com/x-cookie/cbughunter-k1/tree/main/skills/${folderName}/${skillName}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: "var(--accent)",
                  color: "#fff",
                  padding: "11px 16px",
                  borderRadius: 9,
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                  marginBottom: 8,
                  letterSpacing: "-0.01em",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download skill
              </a>
              <a
                href="https://github.com/x-cookie/cbughunter-k1"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  background: "transparent",
                  color: "rgba(240,240,255,0.35)",
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid var(--b0)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  textDecoration: "none",
                  marginBottom: 16,
                  letterSpacing: "0.04em",
                }}
              >
                View all skills on GitHub →
              </a>

              <Link
                href={`/skills/${skill.domain}`}
                style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", textDecoration: "none", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 6, padding: "4px 0" }}
              >
                ← More {domain?.title} skills
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* Render one ## section from SKILL.md */
function SkillSection({ heading, body }: { heading: string; body: string }) {
  if (!body.trim()) return null;
  return (
    <div style={{ borderTop: "1px solid var(--b0)", paddingTop: "1.75rem", paddingBottom: "1.5rem" }}>
      {heading && (
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.85rem" }}>
          {heading}
        </div>
      )}
      <div
        className="skill-prose"
        dangerouslySetInnerHTML={{ __html: markdownToHtml(body) }}
      />
    </div>
  );
}

/* Two-pass markdown→HTML: extract code blocks BEFORE HTML escaping */
function markdownToHtml(md: string): string {
  const ph: string[] = [];

  /* Pass 1a — fenced code blocks (must come before HTML escape) */
  let text = md.replace(/```([\w-]*)\n?([\s\S]*?)```/g, (_m, lang: string, code: string) => {
    const escaped = code
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const langBadge = lang
      ? `<span class="code-lang">${lang}</span>` : "";
    const id = ph.length;
    ph.push(`<div class="code-block">${langBadge}<pre><code>${escaped.trimEnd()}</code></pre></div>`);
    return `\x02${id}\x03`;
  });

  /* Pass 1b — inline code */
  text = text.replace(/`([^`\n]+)`/g, (_m, c: string) => {
    const id = ph.length;
    ph.push(`<code>${c.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</code>`);
    return `\x02${id}\x03`;
  });

  /* Pass 2 — HTML escape remaining text */
  text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* Pass 3 — markdown formatting */

  /* Tables — must come before list processing */
  text = text.replace(
    /(?:^|\n)(\|[^\n]+\|)\n\|[-| :]+\|\n((?:\|[^\n]+\|\n?)*)/gm,
    (_match, headerLine: string, bodyLines: string) => {
      const headers = headerLine.split("|").map((h: string) => h.trim()).filter(Boolean);
      const rows = bodyLines.trim().split("\n").map((row: string) =>
        row.split("|").map((c: string) => c.trim()).filter(Boolean)
      ).filter((r: string[]) => r.length > 0);
      const thead = `<thead><tr>${headers.map((h: string) => `<th>${h}</th>`).join("")}</tr></thead>`;
      const tbody = `<tbody>${rows.map((r: string[]) => `<tr>${r.map((c: string) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>`;
      return `<table>${thead}${tbody}</table>`;
    }
  );

  text = text
    .replace(/\*\*\*([^*\n]+)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
    .replace(/^#{4} (.+)$/gm, "<h4>$1</h4>")
    .replace(/^#{3} (.+)$/gm, "<h3>$1</h3>")
    .replace(/^---$/gm, "<hr>")
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    .replace(/(?:<li>.*\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/<\/ul>\s*<ul>/g, "");

  /* Pass 4 — restore placeholders */
  text = text.replace(/\x02(\d+)\x03/g, (_m, i) => ph[Number(i)] ?? "");

  /* Pass 5 — wrap paragraphs */
  text = text
    .split(/\n{2,}/)
    .map((b) => {
      const t = b.trim();
      if (!t) return "";
      if (/^<(pre|ul|ol|h[1-6]|hr|div|blockquote)/.test(t)) return t;
      return `<p>${t.replace(/\n/g, " ")}</p>`;
    })
    .filter(Boolean)
    .join("\n");

  return text;
}

/* ── Route dispatcher ──────────────────────────────────────── */
export default function SkillsRouter({ params }: Props) {
  const { slug } = params;
  if (slug.length === 1) return <DomainPage domainSlug={slug[0]} />;
  return <SkillDetailPage skillId={slug.join("/")} />;
}
