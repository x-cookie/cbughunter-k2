import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/ScrollReveal";
import { CrosshairIcon, LockIcon, NetworkIcon, BuildingIcon, TargetIcon, EyeIcon, FileCheckIcon, ChainIcon, ArrowRight } from "@/components/icons";
import { CubeAccent } from "@/components/CubeAccent";
import { domains } from "@/content/domains";
import { skills } from "@/content/skills";

export const metadata: Metadata = { title: "Skills — cbug" };

const ICONS: Record<string, React.ReactNode> = {
  "web-hunting": <CrosshairIcon size={22} color="var(--accent)" />,
  "auth":        <LockIcon size={22} color="var(--accent2)" />,
  "api-infra":   <NetworkIcon size={22} color="var(--accent)" />,
  "enterprise":  <BuildingIcon size={22} color="var(--accent2)" />,
  "red-team":    <TargetIcon size={22} color="#ef4444" />,
  "recon":       <EyeIcon size={22} color="var(--accent)" />,
  "reporting":   <FileCheckIcon size={22} color="var(--accent2)" />,
  "specialized": <ChainIcon size={22} color="var(--accent)" />,
};

export default function SkillsPage() {
  return (
    <>
      <Nav />
      <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
        {/* Header */}
        <div style={{ background: "var(--hero)", padding: "64px 48px 56px", borderBottom: "1px solid var(--b0)", position: "relative", overflow: "hidden" }}>
          {/* Floating cube accent — top right */}
          <CubeAccent variant="blue" size="lg" opacity={0.75}
            style={{ position: "absolute", top: -10, right: 40, zIndex: 0 }} />
          <CubeAccent variant="purple" size="sm" opacity={0.55}
            style={{ position: "absolute", bottom: 8, right: 260, zIndex: 0 }} />
          <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <ScrollReveal>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
                Skill library
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h1 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, color: "var(--text)", marginBottom: 14 }}>
                51 skills across{" "}
                <span style={{ color: "var(--text-fade)" }}>8 domains</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <p style={{ fontSize: 14, color: "rgba(240,240,255,0.38)", maxWidth: 500, lineHeight: 1.7, fontWeight: 300 }}>
                Each skill is a context bundle built from real bug bounty disclosures.
                Select a domain to browse its skills.
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* Domain cards */}
        <div style={{ padding: "56px 48px", maxWidth: 1200, margin: "0 auto" }}>
          <ScrollRevealGroup
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}
            className="skills-grid"
            stagger={0.07}
          >
            {domains.map((domain) => {
              const domainSkills = skills.filter((s) => s.domain === domain.slug);
              const preview = domainSkills.slice(0, 3).map((s) => s.command);
              return (
                <ScrollRevealItem key={domain.slug}>
                  <Link
                    href={`/skills/${domain.slug}`}
                    className="skill-card"
                    style={{
                      background: "var(--s1)",
                      border: "1px solid var(--b0)",
                      borderRadius: 14,
                      padding: "26px 24px",
                      textDecoration: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 0,
                    }}
                  >
                    <div style={{ marginBottom: 16 }}>{ICONS[domain.slug]}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 6, letterSpacing: "-0.02em" }}>
                      {domain.title}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.55, marginBottom: 16, fontWeight: 300, flex: 1 }}>
                      {domain.description.split("—")[0].trim()}
                    </div>
                    {/* Command preview pills */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                      {preview.map((cmd) => (
                        <span key={cmd} style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--accent)", background: "var(--accent-dim)", padding: "2px 7px", borderRadius: 4 }}>
                          {cmd}
                        </span>
                      ))}
                      {domainSkills.length > 3 && (
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", background: "var(--s2)", padding: "2px 7px", borderRadius: 4 }}>
                          +{domainSkills.length - 3} more
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        {domain.skillCount} skills
                      </span>
                      <ArrowRight size={9} />
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
