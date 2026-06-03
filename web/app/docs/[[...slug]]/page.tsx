import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CubeAccent } from "@/components/CubeAccent";

const docsDir = path.join(process.cwd(), "..", "docs");

const DOC_PAGES = [
  { slug: "quick-start",     title: "Quick Start",       label: "Get started in 5 min",    group: "Getting started" },
  { slug: "install",         title: "Install",            label: "ZIP upload & CLI setup",  group: "Getting started" },
  { slug: "chat-vs-code",    title: "Chat vs Code",       label: "Which env to use",        group: "Usage" },
  { slug: "7-question-gate", title: "7-Question Gate",    label: "Pre-submit checklist",    group: "Quality" },
];

const GROUPS = ["Getting started", "Usage", "Quality"];

interface DocMeta {
  content: string;
  headings: { text: string; level: number }[];
  readingTime: number;
  wordCount: number;
}

function readDoc(slug: string): DocMeta | null {
  const fp = path.join(docsDir, `${slug}.mdx`);
  if (!fs.existsSync(fp)) return null;
  const raw = fs.readFileSync(fp, "utf-8");
  const { content } = matter(raw);

  /* Extract headings */
  const headings: { text: string; level: number }[] = [];
  for (const line of content.split("\n")) {
    const m = line.match(/^(#{1,3})\s+(.+)$/);
    if (m) headings.push({ level: m[1].length, text: m[2].trim() });
  }

  /* Reading time */
  const words = content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(words / 200));

  return { content, headings, readingTime, wordCount: words };
}

interface Props { params: { slug?: string[] } }

export function generateStaticParams() {
  return [
    { slug: undefined },
    ...DOC_PAGES.map((p) => ({ slug: [p.slug] })),
  ];
}

export default function DocsPage({ params }: Props) {
  const activeSlug = params.slug?.[0] ?? "quick-start";
  const doc        = readDoc(activeSlug);
  const activePage = DOC_PAGES.find((p) => p.slug === activeSlug);
  if (!doc) notFound();

  const idx  = DOC_PAGES.findIndex((p) => p.slug === activeSlug);
  const prev = DOC_PAGES[idx - 1];
  const next = DOC_PAGES[idx + 1];

  /* Heading slug for TOC anchors */
  const toAnchor = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <>
      <Nav />
      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>

        {/* ── Left sidebar ── */}
        <aside style={{
          width: 232,
          flexShrink: 0,
          borderRight: "1px solid var(--b0)",
          background: "var(--hero)",
          position: "sticky",
          top: 56,
          height: "calc(100vh - 56px)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{ padding: "28px 0 12px" }}>
            <div style={{ padding: "0 22px 14px", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Documentation
            </div>

            {GROUPS.map((group) => {
              const pages = DOC_PAGES.filter((p) => p.group === group);
              return (
                <div key={group} style={{ marginBottom: 8 }}>
                  <div style={{ padding: "6px 22px 4px", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,240,255,0.18)" }}>
                    {group}
                  </div>
                  {pages.map((page) => {
                    const active = page.slug === activeSlug;
                    return (
                      <Link key={page.slug} href={`/docs/${page.slug}`} style={{
                        display: "block",
                        padding: "9px 22px 9px 20px",
                        textDecoration: "none",
                        borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
                        background: active ? "rgba(90,133,255,0.08)" : "transparent",
                      }}>
                        <div style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "var(--text)" : "rgba(240,240,255,0.40)", lineHeight: 1.25, marginBottom: 2 }}>
                          {page.title}
                        </div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: active ? "var(--accent)" : "rgba(240,240,255,0.18)", letterSpacing: "0.02em" }}>
                          {page.label}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div style={{ margin: "4px 22px", borderTop: "1px solid var(--b0)" }} />
          <div style={{ padding: "12px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
            <a href="https://github.com/x-cookie/cbughunter-k1" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(240,240,255,0.25)", textDecoration: "none", letterSpacing: "0.04em" }}>
              GitHub →
            </a>
            <Link href="/skills" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(240,240,255,0.25)", textDecoration: "none", letterSpacing: "0.04em" }}>
              All skills →
            </Link>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Page hero band */}
          <div style={{ borderBottom: "1px solid var(--b0)", padding: "36px 52px 30px", background: "var(--s1)", position: "relative", overflow: "hidden" }}>
            <CubeAccent variant="mixed" size="md" opacity={0.45}
              style={{ position: "absolute", top: -8, right: 16, zIndex: 0 }} />
            <ScrollReveal style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)" }}>
                  {activePage?.group}
                </span>
                <span style={{ color: "rgba(240,240,255,0.15)", fontSize: 10 }}>·</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.08em" }}>
                  {doc.readingTime} min read · {doc.wordCount.toLocaleString()} words
                </span>
              </div>
              <h1 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(20px, 2.8vw, 28px)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text)", margin: "0 0 6px" }}>
                {activePage?.title}
              </h1>
              <p style={{ fontSize: 13, color: "rgba(240,240,255,0.35)", fontWeight: 300, margin: 0 }}>
                {activePage?.label}
              </p>
            </ScrollReveal>
          </div>

          {/* Content + TOC */}
          <div style={{ display: "flex", gap: 0 }}>
            {/* Prose */}
            <ScrollReveal style={{ flex: 1, minWidth: 0 }}>
              <div className="docs-prose" style={{ padding: "44px 52px", maxWidth: 720 }}>
                <MDXRemote source={doc.content} />
              </div>
            </ScrollReveal>

            {/* Right TOC */}
            {doc.headings.length > 2 && (
              <aside style={{
                width: 200,
                flexShrink: 0,
                padding: "44px 20px 44px 0",
                position: "sticky",
                top: 56,
                height: "calc(100vh - 56px)",
                overflowY: "auto",
              }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>
                  On this page
                </div>
                <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {doc.headings.map((h, i) => (
                    <a key={i} href={`#${toAnchor(h.text)}`} style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 11,
                      color: "rgba(240,240,255,0.30)",
                      textDecoration: "none",
                      paddingLeft: (h.level - 1) * 10,
                      lineHeight: 1.4,
                      padding: "4px 0",
                    } as React.CSSProperties}>
                      {h.text}
                    </a>
                  ))}
                </nav>
              </aside>
            )}
          </div>

          {/* Prev / Next */}
          <div style={{ borderTop: "1px solid var(--b0)", padding: "28px 52px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {prev ? (
              <Link href={`/docs/${prev.slug}`} style={{ textDecoration: "none", background: "var(--s1)", border: "1px solid var(--b0)", borderRadius: 10, padding: "16px 20px" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 5 }}>← Previous</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", margin: 0 }}>{prev.title}</p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>{prev.label}</p>
              </Link>
            ) : <div />}
            {next ? (
              <Link href={`/docs/${next.slug}`} style={{ textDecoration: "none", background: "var(--s1)", border: "1px solid var(--b0)", borderRadius: 10, padding: "16px 20px", textAlign: "right" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 5 }}>Next →</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", margin: 0 }}>{next.title}</p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>{next.label}</p>
              </Link>
            ) : <div />}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
