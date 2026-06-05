"use client";
import { useEffect, useRef } from "react";

const LERP = 0.062;
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

// Parallax depth factor per cube — larger = feels closer = moves more with cursor
const DEPTH = [
  [0.013, 0.010],  // large blue   — distant anchor
  [0.042, 0.032],  // medium purple — mid-layer
  [0.068, 0.054],  // small blue   — foreground
  [0.026, 0.020],  // tiny purple  — mid-far
] as const;

export function HeroCubes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const p0 = useRef<SVGGElement>(null);
  const p1 = useRef<SVGGElement>(null);
  const p2 = useRef<SVGGElement>(null);
  const p3 = useRef<SVGGElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const sm = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mouse.current.x = e.clientX - r.left - r.width / 2;
      mouse.current.y = e.clientY - r.top - r.height / 2;
    };
    window.addEventListener("mousemove", onMove);

    const parallaxRefs = [p0.current, p1.current, p2.current, p3.current];
    let raf: number;

    const tick = () => {
      sm.current.x = lerp(sm.current.x, mouse.current.x, LERP);
      sm.current.y = lerp(sm.current.y, mouse.current.y, LERP);
      const { x, y } = sm.current;

      parallaxRefs.forEach((g, i) => {
        if (!g) return;
        const dx = (x * DEPTH[i][0]).toFixed(2);
        const dy = (y * DEPTH[i][1]).toFixed(2);
        g.setAttribute("transform", `translate(${dx},${dy})`);
      });

      if (auraRef.current) {
        const r = el.getBoundingClientRect();
        auraRef.current.style.left = `${x + r.width / 2}px`;
        auraRef.current.style.top  = `${y + r.height / 2}px`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0 }}>
      {/* Soft cursor aura that follows mouse */}
      <div ref={auraRef} style={{
        position: "absolute",
        width: 320,
        height: 320,
        borderRadius: "50%",
        transform: "translate(-50%,-50%)",
        background: "radial-gradient(circle, rgba(77,124,255,0.10) 0%, rgba(130,89,239,0.05) 40%, transparent 68%)",
        pointerEvents: "none",
        zIndex: 4,
        willChange: "left, top",
      }} />

      <svg
        width="100%" height="100%"
        viewBox="0 0 540 500" fill="none"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <filter id="hc-glow-lg" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
            <feDropShadow dx="0" dy="0" stdDeviation="22" floodColor="rgba(77,124,255,0.5)" />
          </filter>
          <filter id="hc-glow-md" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor="rgba(154,114,240,0.45)" />
          </filter>
          <filter id="hc-glow-sm" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="rgba(77,124,255,0.35)" />
          </filter>

          <linearGradient id="hc-btop"  x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3a5fee"/><stop offset="100%" stopColor="#1e38c0"/></linearGradient>
          <linearGradient id="hc-bleft" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1530a0"/><stop offset="100%" stopColor="#0c1f70"/></linearGradient>
          <linearGradient id="hc-bright" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#2244cc"/><stop offset="100%" stopColor="#1530a0"/></linearGradient>
          <linearGradient id="hc-ptop"  x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#7a52dc"/><stop offset="100%" stopColor="#5838b4"/></linearGradient>
          <linearGradient id="hc-pleft" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#42268c"/><stop offset="100%" stopColor="#2c1870"/></linearGradient>
          <linearGradient id="hc-pright" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#5838b4"/><stop offset="100%" stopColor="#42268c"/></linearGradient>
        </defs>

        {/* Constellation lines between cube centers — very faint depth cue */}
        <line x1="360" y1="125" x2="406" y2="265" stroke="rgba(130,89,239,0.07)" strokeWidth="0.6" />
        <line x1="406" y1="265" x2="234" y2="355" stroke="rgba(77,124,255,0.06)"  strokeWidth="0.6" />
        <line x1="360" y1="125" x2="480" y2="160" stroke="rgba(77,124,255,0.05)"  strokeWidth="0.6" />
        <line x1="480" y1="160" x2="406" y2="265" stroke="rgba(130,89,239,0.05)" strokeWidth="0.4" />

        {/* Large blue — float-a 9s, no delay — parallax layer p0 */}
        <g style={{ animation: "float-a 9s ease-in-out infinite", transformOrigin: "360px 125px" }}>
          <g ref={p0}>
            <g filter="url(#hc-glow-lg)" transform="translate(288,42)">
              <polygon points="72,0 144,41 72,82 0,41"     fill="url(#hc-btop)"  />
              <polygon points="0,41 72,82 72,132 0,91"     fill="url(#hc-bleft)" />
              <polygon points="72,82 144,41 144,91 72,132"  fill="url(#hc-bright)" />
              <polygon points="72,0 144,41 72,82 0,41" fill="none" stroke="rgba(140,180,255,0.5)" strokeWidth="0.8" />
            </g>
          </g>
        </g>

        {/* Medium purple — float-b 7s, delay 1.8s — parallax layer p1 */}
        <g style={{ animation: "float-b 7s ease-in-out 1.8s infinite", transformOrigin: "406px 275px" }}>
          <g ref={p1}>
            <g filter="url(#hc-glow-md)" transform="translate(354,216)">
              <polygon points="52,0 104,30 52,60 0,30"    fill="url(#hc-ptop)"  opacity="0.95" />
              <polygon points="0,30 52,60 52,98 0,68"     fill="url(#hc-pleft)" opacity="0.95" />
              <polygon points="52,60 104,30 104,68 52,98"  fill="url(#hc-pright)" opacity="0.95" />
              <polygon points="52,0 104,30 52,60 0,30" fill="none" stroke="rgba(200,160,255,0.4)" strokeWidth="0.7" />
            </g>
          </g>
        </g>

        {/* Small blue — float-c 11s, delay 0.5s — parallax layer p2 */}
        <g style={{ animation: "float-c 11s ease-in-out 0.5s infinite", transformOrigin: "234px 337px" }}>
          <g ref={p2}>
            <g filter="url(#hc-glow-sm)" transform="translate(196,315)">
              <polygon points="38,0 76,22 38,44 0,22"    fill="url(#hc-btop)"  opacity="0.85" />
              <polygon points="0,22 38,44 38,70 0,48"    fill="url(#hc-bleft)" opacity="0.85" />
              <polygon points="38,44 76,22 76,48 38,70"   fill="url(#hc-bright)" opacity="0.85" />
              <polygon points="38,0 76,22 38,44 0,22" fill="none" stroke="rgba(120,160,255,0.4)" strokeWidth="0.6" />
            </g>
          </g>
        </g>

        {/* Tiny purple — float-d 8s, delay 3s — parallax layer p3 */}
        <g style={{ animation: "float-d 8s ease-in-out 3s infinite", transformOrigin: "480px 154px" }}>
          <g ref={p3}>
            <g filter="url(#hc-glow-sm)" transform="translate(452,128)">
              <polygon points="28,0 56,16 28,32 0,16"    fill="url(#hc-ptop)"  opacity="0.75" />
              <polygon points="0,16 28,32 28,52 0,36"    fill="url(#hc-pleft)" opacity="0.75" />
              <polygon points="28,32 56,16 56,36 28,52"   fill="url(#hc-pright)" opacity="0.75" />
            </g>
          </g>
        </g>

        {/* Scattered glowing tiles */}
        {([
          [416,5, 438,12, 416,32, 394,19],
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
  );
}
