"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BugIcon } from "@/components/icons";

const LINKS = [
  { label: "Skills", href: "/skills" },
  { label: "Docs",   href: "/docs/quick-start" },
  { label: "GitHub", href: "https://github.com/x-cookie/cbughunter-k1", external: true },
];

export function Nav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href.startsWith("http") ? false : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      height: 56,
      display: "flex",
      alignItems: "center",
      background: "rgba(4,4,10,0.82)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "0 40px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <BugIcon size={15} color="var(--accent)" />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--text)", letterSpacing: "0.04em" }}>
            cbug
          </span>
        </Link>

        {/* Center links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {LINKS.map((link) => {
            const active = isActive(link.href);
            const base: React.CSSProperties = {
              fontSize: 13,
              fontFamily: "var(--font-sans)",
              fontWeight: active ? 500 : 400,
              textDecoration: "none",
              padding: "5px 12px",
              borderRadius: 6,
              transition: "background 0.15s, color 0.15s",
              color: active ? "var(--text)" : "rgba(240,240,255,0.45)",
              background: active ? "rgba(255,255,255,0.06)" : "transparent",
            };
            if (link.external) {
              return (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" style={base}
                  onMouseEnter={e => { e.currentTarget.style.color = "rgba(240,240,255,0.9)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = active ? "var(--text)" : "rgba(240,240,255,0.45)"; e.currentTarget.style.background = active ? "rgba(255,255,255,0.06)" : "transparent"; }}>
                  {link.label}
                </a>
              );
            }
            return (
              <Link key={link.label} href={link.href} style={base}>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <a
          href="https://github.com/x-cookie/cbughunter-k1"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 500,
            color: "var(--accent)",
            background: "var(--accent-dim)",
            border: "1px solid rgba(90,133,255,0.2)",
            padding: "6px 16px",
            borderRadius: 6,
            textDecoration: "none",
            letterSpacing: "0.04em",
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(90,133,255,0.22)"; e.currentTarget.style.borderColor = "rgba(90,133,255,0.40)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--accent-dim)"; e.currentTarget.style.borderColor = "rgba(90,133,255,0.2)"; }}
        >
          Download
        </a>
      </div>
    </nav>
  );
}
