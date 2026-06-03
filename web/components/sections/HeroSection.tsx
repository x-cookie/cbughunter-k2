import Link from "next/link";
import { HeroPingOverlay } from "@/components/HeroPingOverlay";
import { ArrowRight } from "@/components/icons";

/* Pre-computed star positions for a static galaxy field */
const STARS = [
  [415,18,1.1,0.9],[442,44,0.7,0.6],[468,12,0.5,0.8],[390,62,1.3,0.7],[510,30,0.6,0.5],
  [530,68,1.0,0.8],[475,90,0.8,0.6],[398,95,0.5,0.4],[525,110,1.2,0.9],[455,128,0.6,0.7],
  [490,22,0.4,0.5],[415,140,0.9,0.7],[535,155,0.5,0.6],[472,170,1.1,0.8],[405,185,0.6,0.5],
  [522,192,0.8,0.7],[388,210,0.4,0.6],[510,220,1.0,0.9],[448,235,0.6,0.5],[535,245,0.7,0.7],
  [395,258,1.2,0.8],[470,262,0.5,0.6],[522,278,0.9,0.7],[412,295,0.6,0.8],[488,300,0.4,0.5],
  [540,310,1.1,0.9],[420,325,0.7,0.6],[502,338,0.5,0.7],[380,342,1.0,0.8],[458,355,0.8,0.6],
  [528,365,0.6,0.5],[395,378,0.4,0.7],[475,390,1.2,0.9],[520,402,0.7,0.6],[408,415,0.5,0.7],
  [545,420,0.9,0.8],[440,432,0.6,0.5],[510,445,1.0,0.7],[390,455,0.4,0.6],[468,468,0.8,0.9],
  [535,478,0.5,0.5],[415,488,1.1,0.7],[480,498,0.6,0.6],[502,482,0.4,0.8],[370,472,0.9,0.7],
  [426,460,0.5,0.5],[557,442,0.7,0.6],[368,428,1.0,0.8],[546,398,0.6,0.7],[372,310,0.4,0.6],
  [558,285,0.8,0.5],[370,245,0.5,0.7],[558,200,0.9,0.8],[374,165,0.6,0.6],[555,135,0.4,0.5],
  [368,72,0.8,0.7],[558,52,0.5,0.6],[362,24,0.9,0.8],
] as const;

export function HeroSection() {
  return (
    <section style={{
      position: "relative",
      minHeight: "calc(100vh - 56px)",
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      padding: "80px 48px",
      background: "var(--bg)",
    }}>
      <HeroPingOverlay />

      {/* Nebula gradients */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        background: [
          "radial-gradient(ellipse 40% 50% at 72% 40%, rgba(130,89,239,0.09) 0%, transparent 65%)",
          "radial-gradient(ellipse 30% 40% at 85% 65%, rgba(77,124,255,0.07) 0%, transparent 60%)",
          "radial-gradient(ellipse 55% 70% at 22% 48%, rgba(77,124,255,0.05) 0%, transparent 70%)",
        ].join(", "),
      }} />

      {/* Left text */}
      <div style={{ position: "relative", zIndex: 3, maxWidth: 600, flexShrink: 0 }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 20 }}>
          51 skills · 15 commands · 574+ H1 patterns
        </p>
        <h1 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(48px, 7vw, 80px)", fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.05em", marginBottom: 24 }}>
          <span style={{ color: "var(--text)", display: "block" }}>Turn Claude into a</span>
          <span style={{ color: "var(--text-fade)", display: "block" }}>senior bug hunter</span>
        </h1>
        <p style={{ fontSize: 16, color: "rgba(240,240,255,0.40)", maxWidth: 440, lineHeight: 1.68, fontWeight: 300, marginBottom: 40 }}>
          51 specialized skills built from real bug bounty disclosures. Auto-load by context.
          7-Question Gate before every submission.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link href="/skills" style={{ background: "var(--accent)", color: "#fff", padding: "13px 28px", borderRadius: 7, fontSize: 14, fontWeight: 600, fontFamily: "var(--font-sans)", textDecoration: "none", display: "inline-block" }}>
            Browse all skills
          </Link>
          <a href="https://github.com/elementalsouls/Claude-BugHunter" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 14, fontWeight: 500, color: "rgba(240,240,255,0.45)", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: 7, textDecoration: "none" }}>
            View on GitHub <ArrowRight />
          </a>
        </div>
      </div>

      {/* Right — galaxy + floating cubes */}
      <div className="hero-diamonds" style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "55%", pointerEvents: "none", zIndex: 2 }}>
        {/* Galaxy starfield — static layer */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 560 520" preserveAspectRatio="xMidYMid meet">
          {STARS.map(([cx, cy, r, op], i) => (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="white"
              opacity={op}
              style={{ animation: `star-twinkle ${2.5 + (i % 7) * 0.7}s ease-in-out ${(i % 5) * 0.4}s infinite` }}
            />
          ))}
          {/* Faint nebula wisps */}
          <ellipse cx="480" cy="200" rx="60" ry="30" fill="rgba(130,89,239,0.04)" />
          <ellipse cx="420" cy="340" rx="50" ry="25" fill="rgba(77,124,255,0.04)" />
          <ellipse cx="510" cy="420" rx="45" ry="20" fill="rgba(154,114,240,0.03)" />
        </svg>

        {/* Floating cubes — each moves independently */}
        <div style={{ position: "absolute", inset: 0 }}>
          <svg width="100%" height="100%" viewBox="0 0 540 500" fill="none" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="glow-lg" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="14" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                <feDropShadow dx="0" dy="0" stdDeviation="22" floodColor="rgba(77,124,255,0.5)" />
              </filter>
              <filter id="glow-md" x="-60%" y="-60%" width="220%" height="220%">
                <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor="rgba(154,114,240,0.45)" />
              </filter>
              <filter id="glow-sm" x="-60%" y="-60%" width="220%" height="220%">
                <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="rgba(77,124,255,0.35)" />
              </filter>
              <linearGradient id="btop"  x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3a5fee"/><stop offset="100%" stopColor="#1e38c0"/></linearGradient>
              <linearGradient id="bleft" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1530a0"/><stop offset="100%" stopColor="#0c1f70"/></linearGradient>
              <linearGradient id="bright" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#2244cc"/><stop offset="100%" stopColor="#1530a0"/></linearGradient>
              <linearGradient id="ptop"  x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#7a52dc"/><stop offset="100%" stopColor="#5838b4"/></linearGradient>
              <linearGradient id="pleft" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#42268c"/><stop offset="100%" stopColor="#2c1870"/></linearGradient>
              <linearGradient id="pright" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#5838b4"/><stop offset="100%" stopColor="#42268c"/></linearGradient>
            </defs>

            {/* Large blue — float-a: 9s, no delay */}
            <g style={{ animation: "float-a 9s ease-in-out infinite", transformOrigin: "360px 125px" }}>
              <g filter="url(#glow-lg)" transform="translate(288,42)">
                <polygon points="72,0 144,41 72,82 0,41"    fill="url(#btop)"  opacity="1" />
                <polygon points="0,41 72,82 72,132 0,91"    fill="url(#bleft)" opacity="1" />
                <polygon points="72,82 144,41 144,91 72,132" fill="url(#bright)" opacity="1" />
                <polygon points="72,0 144,41 72,82 0,41" fill="none" stroke="rgba(140,180,255,0.5)" strokeWidth="0.8" />
              </g>
            </g>

            {/* Medium purple — float-b: 7s, delay 1.8s */}
            <g style={{ animation: "float-b 7s ease-in-out 1.8s infinite", transformOrigin: "406px 275px" }}>
              <g filter="url(#glow-md)" transform="translate(354,216)">
                <polygon points="52,0 104,30 52,60 0,30"   fill="url(#ptop)"  opacity="0.95" />
                <polygon points="0,30 52,60 52,98 0,68"    fill="url(#pleft)" opacity="0.95" />
                <polygon points="52,60 104,30 104,68 52,98" fill="url(#pright)" opacity="0.95" />
                <polygon points="52,0 104,30 52,60 0,30" fill="none" stroke="rgba(200,160,255,0.4)" strokeWidth="0.7" />
              </g>
            </g>

            {/* Small blue — float-c: 11s, delay 0.5s */}
            <g style={{ animation: "float-c 11s ease-in-out 0.5s infinite", transformOrigin: "234px 337px" }}>
              <g filter="url(#glow-sm)" transform="translate(196,315)">
                <polygon points="38,0 76,22 38,44 0,22"   fill="url(#btop)"  opacity="0.85" />
                <polygon points="0,22 38,44 38,70 0,48"   fill="url(#bleft)" opacity="0.85" />
                <polygon points="38,44 76,22 76,48 38,70"  fill="url(#bright)" opacity="0.85" />
                <polygon points="38,0 76,22 38,44 0,22" fill="none" stroke="rgba(120,160,255,0.4)" strokeWidth="0.6" />
              </g>
            </g>

            {/* Tiny purple — float-d: 8s, delay 3s */}
            <g style={{ animation: "float-d 8s ease-in-out 3s infinite", transformOrigin: "480px 154px" }}>
              <g filter="url(#glow-sm)" transform="translate(452,128)">
                <polygon points="28,0 56,16 28,32 0,16"   fill="url(#ptop)"  opacity="0.75" />
                <polygon points="0,16 28,32 28,52 0,36"   fill="url(#pleft)" opacity="0.75" />
                <polygon points="28,32 56,16 56,36 28,52"  fill="url(#pright)" opacity="0.75" />
              </g>
            </g>

            {/* Ghost — float-e: 13s, delay 1.2s */}
            <g style={{ animation: "float-e 13s ease-in-out 1.2s infinite", transformOrigin: "198px 205px" }} opacity="0.22">
              <g transform="translate(158,164)">
                <polygon points="40,0 80,23 40,46 0,23"   fill="url(#btop)" />
                <polygon points="0,23 40,46 40,72 0,49"   fill="url(#bleft)" />
                <polygon points="40,46 80,23 80,49 40,72"  fill="url(#bright)" />
              </g>
            </g>

            {/* Scattered glowing tiles */}
            {([
              [416,5, 22,12, 416,32, 394,19],
              [478,34, 494,43, 478,52, 462,43],
              [458,80, 478,91, 458,102, 438,91],
              [504,150, 522,160, 504,170, 486,160],
              [295,178, 309,186, 295,194, 281,186],
              [185,232, 201,241, 185,250, 169,241],
              [442,300, 462,311, 442,322, 422,311],
              [488,378, 510,391, 488,404, 466,391],
              [291,416, 309,426, 291,436, 273,426],
            ] as number[][]).map(([x1,y1,x2,y2,x3,y3,x4,y4], i) => (
              <polygon
                key={i}
                points={`${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`}
                fill={i % 2 === 0 ? "rgba(77,124,255,0.06)" : "rgba(154,114,240,0.06)"}
                stroke={i % 2 === 0 ? "rgba(77,124,255,0.30)" : "rgba(154,114,240,0.28)"}
                strokeWidth="0.6"
              />
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
