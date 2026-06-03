"use client";
import { useEffect, useState, useRef } from "react";

const LINES = [
  { t: 0,    text: "$ /hunt https://target.com",         color: "rgba(255,255,255,0.9)",  bold: true },
  { t: 600,  text: "",                                    color: "",                        bold: false },
  { t: 700,  text: "  [recon] enumerating subdomains...", color: "rgba(255,255,255,0.4)",  bold: false },
  { t: 1400, text: "  [recon] 34 assets found",          color: "rgba(255,255,255,0.4)",  bold: false },
  { t: 1800, text: "  [scan]  SQLi patterns active",     color: "rgba(255,255,255,0.4)",  bold: false },
  { t: 2400, text: "",                                    color: "",                        bold: false },
  { t: 2500, text: "  ● /api/search?q= — blind SQLi",    color: "#60a5fa",                bold: false },
  { t: 2800, text: "    CVSS 8.1 · High · Data exfil",  color: "rgba(96,165,250,0.6)",   bold: false },
  { t: 3200, text: "  ● /profile/bio — stored XSS",      color: "#60a5fa",                bold: false },
  { t: 3500, text: "    CVSS 7.6 · High · Admin sink",  color: "rgba(96,165,250,0.6)",   bold: false },
  { t: 3900, text: "",                                    color: "",                        bold: false },
  { t: 4000, text: "$ /triage",                          color: "rgba(255,255,255,0.9)",  bold: true },
  { t: 4400, text: "  7-Question Gate running...",       color: "rgba(255,255,255,0.4)",  bold: false },
  { t: 5000, text: "  ✓ 7/7 — report cleared",          color: "#a78bfa",                bold: false },
];

export function TerminalDemo() {
  const [visible, setVisible] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          LINES.forEach((line, i) => {
            setTimeout(() => setVisible(i + 1), line.t);
          });
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        background: "#0d1117",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        padding: "20px 24px",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        lineHeight: 1.8,
        minHeight: 280,
      }}
    >
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {["#ff5f57","#febc2e","#28c840"].map((c) => (
          <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "inline-block" }} />
        ))}
      </div>
      {LINES.slice(0, visible).map((line, i) => (
        <div key={i} style={{ color: line.color, fontWeight: line.bold ? 600 : 400 }}>
          {line.text || " "}
        </div>
      ))}
      {visible > 0 && visible < LINES.length && (
        <span className="cursor" style={{ color: "rgba(255,255,255,0.5)" }}>▌</span>
      )}
    </div>
  );
}
