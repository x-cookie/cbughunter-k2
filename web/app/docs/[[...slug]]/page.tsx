import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { DocsSidebar } from "@/components/DocsSidebar";
import { CubeAccent } from "@/components/CubeAccent";

const docsDir = path.join(process.cwd(), "..", "docs");

const SECTIONS = [
  { slug: "quick-start",     title: "Quick Start",      label: "Get started in 5 min",  group: "Getting started" },
  { slug: "install",         title: "Install",           label: "ZIP upload & CLI",       group: "Getting started" },
  { slug: "chat-vs-code",    title: "Chat vs Code",      label: "Which env to use",       group: "Usage" },
  { slug: "7-question-gate", title: "7-Question Gate",   label: "Pre-submit checklist",   group: "Quality" },
];

/* Custom heading components that add anchored IDs */
const mdxComponents = {
  h1: ({ children, ...props }: React.ComponentPropsWithoutRef<"h1">) => {
    const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return <h1 id={id} {...props}>{children}</h1>;
  },
  h2: ({ children, ...props }: React.ComponentPropsWithoutRef<"h2">) => {
    const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return <h2 id={id} {...props}>{children}</h2>;
  },
  h3: ({ children, ...props }: React.ComponentPropsWithoutRef<"h3">) => {
    const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return <h3 id={id} {...props}>{children}</h3>;
  },
};

export function generateStaticParams() {
  return [
    { slug: [] },
    ...SECTIONS.map((p) => ({ slug: [p.slug] })),
  ];
}

export default function DocsPage() {
  /* Merge all docs into ONE MDX string — single compilation avoids timeout */
  let mergedMdx = "";
  let totalWords = 0;

  for (const section of SECTIONS) {
    const fp = path.join(docsDir, `${section.slug}.mdx`);
    if (!fs.existsSync(fp)) continue;
    const raw = fs.readFileSync(fp, "utf-8");
    const { content } = matter(raw);
    totalWords += content.split(/\s+/).length;
    /* Inject explicit anchor div before each section so sidebar links work */
    mergedMdx += `\n<div id="${section.slug}" />\n\n${content}\n\n`;
  }

  const totalReadTime = Math.max(1, Math.round(totalWords / 200));

  return (
    <>
      <Nav />
      <div style={{ display: "flex", minHeight: "calc(100vh - 68px)", background: "var(--bg)" }}>

        {/* ── Scrollspy sidebar (client) ── */}
        <DocsSidebar sections={SECTIONS} />

        {/* ── Content ── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{ borderBottom: "1px solid var(--b0)", padding: "36px 56px 30px", background: "var(--s1)", position: "relative", overflow: "hidden" }}>
            <CubeAccent variant="mixed" size="md" opacity={0.40} style={{ position: "absolute", top: -8, right: 16, zIndex: 0 }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)" }}>
                  cbug docs
                </span>
                <span style={{ color: "rgba(240,240,255,0.12)" }}>·</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.06em" }}>
                  {totalReadTime} min total
                </span>
              </div>
              <h1 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(20px, 2.8vw, 28px)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text)", margin: "0 0 6px" }}>
                Documentation
              </h1>
              <p style={{ fontSize: 13, color: "rgba(240,240,255,0.32)", fontWeight: 300, margin: 0 }}>
                Quick start, install, environment guide, 7-Question Gate — all on one page.
              </p>
            </div>
          </div>

          {/* All docs — single MDXRemote call */}
          <div className="docs-prose" style={{ padding: "48px 56px 80px", maxWidth: 760 }}>
            <MDXRemote
              source={mergedMdx}
              components={mdxComponents}
            />

            {/* Bottom CTA */}
            <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid var(--b0)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", marginBottom: 6 }}>
                  Ready to hunt?
                </p>
                <p style={{ fontSize: 13, color: "rgba(240,240,255,0.45)", fontWeight: 300 }}>
                  Browse all 8 attack domains and 51 skills.
                </p>
              </div>
              <Link href="/skills" style={{
                background: "var(--accent)", color: "#fff",
                padding: "10px 22px", borderRadius: 8, fontSize: 13,
                fontWeight: 600, textDecoration: "none", fontFamily: "var(--font-sans)",
              }}>
                Browse skills →
              </Link>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
