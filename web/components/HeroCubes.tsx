"use client";
import { useEffect, useRef } from "react";

// ── types ──────────────────────────────────────────────────────────────────
interface Cube {
  id: number;
  x: number;       // center-top x in canvas px
  y: number;       // top y in canvas px
  vx: number;
  vy: number;
  hw: number;      // half-width
  opacity: number;
  fadeIn: boolean;
  fading: boolean;
  fadeSpeed: number; // opacity lost per second (only when fading)
  blue: boolean;
  fragment: boolean;
  dead: boolean;
}

// ── palette ────────────────────────────────────────────────────────────────
const BLUE = { top: "#3a5fee", left: "#1530a0", right: "#2244cc", glow: "rgba(77,124,255," } as const;
const PURP = { top: "#7a52dc", left: "#42268c", right: "#5838b4", glow: "rgba(130,89,239," } as const;

// ── factory helpers ────────────────────────────────────────────────────────
let _id = 0;
const uid = () => ++_id;

function makeMain(w: number, h: number): Cube {
  const hw = 22 + Math.random() * 26;
  return {
    id: uid(),
    x: -hw * 2,
    y: hw + Math.random() * Math.max(0, h - hw * 4.5),
    vx: 0.50 + Math.random() * 0.90,
    vy: (Math.random() - 0.5) * 0.22,
    hw,
    opacity: 0, fadeIn: true, fading: false, fadeSpeed: 0,
    blue: Math.random() > 0.45,
    fragment: false, dead: false,
  };
}

function makeFragments(cx: number, cy: number, n: number): Cube[] {
  return Array.from({ length: n }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.7 + Math.random() * 2.6;
    const hw = 4 + Math.random() * 11;
    return {
      id: uid(),
      x: cx + (Math.random() - 0.5) * 14,
      y: cy + (Math.random() - 0.5) * 14,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.9,
      hw,
      opacity: 0.75 + Math.random() * 0.25,
      fadeIn: false, fading: true,
      fadeSpeed: 0.33 + Math.random() * 0.67, // 1 – 3 s fade
      blue: Math.random() > 0.45,
      fragment: true, dead: false,
    };
  });
}

// ── isometric cube renderer ────────────────────────────────────────────────
// x,y = center-top of cube; hw = half-width
function drawCube(ctx: CanvasRenderingContext2D, c: Cube) {
  const { x, y, hw, opacity, blue, fragment } = c;
  if (opacity <= 0) return;
  const col = blue ? BLUE : PURP;
  const fh = hw * 0.57;   // half of top-diamond height
  const sh = hw * 0.70;   // side face height

  // glow on main cubes only
  if (!fragment) {
    ctx.shadowBlur = hw * 0.75;
    ctx.shadowColor = col.glow + "0.48)";
  }

  // ── top diamond ──────────────────────────────────────────────────────────
  ctx.globalAlpha = opacity;
  ctx.beginPath();
  ctx.moveTo(x,      y);
  ctx.lineTo(x + hw, y + fh);
  ctx.lineTo(x,      y + 2 * fh);
  ctx.lineTo(x - hw, y + fh);
  ctx.closePath();
  ctx.fillStyle = col.top;
  ctx.fill();

  ctx.shadowBlur = 0;

  // ── left face ────────────────────────────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(x - hw, y + fh);
  ctx.lineTo(x,      y + 2 * fh);
  ctx.lineTo(x,      y + 2 * fh + sh);
  ctx.lineTo(x - hw, y + fh + sh);
  ctx.closePath();
  ctx.fillStyle = col.left;
  ctx.fill();

  // ── right face ───────────────────────────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(x,      y + 2 * fh);
  ctx.lineTo(x + hw, y + fh);
  ctx.lineTo(x + hw, y + fh + sh);
  ctx.lineTo(x,      y + 2 * fh + sh);
  ctx.closePath();
  ctx.fillStyle = col.right;
  ctx.fill();

  // ── top edge highlight ───────────────────────────────────────────────────
  ctx.globalAlpha = opacity * 0.45;
  ctx.strokeStyle = col.glow + "1)";
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(x,      y);
  ctx.lineTo(x + hw, y + fh);
  ctx.lineTo(x,      y + 2 * fh);
  ctx.lineTo(x - hw, y + fh);
  ctx.closePath();
  ctx.stroke();

  ctx.globalAlpha = 1;
}

function cubeCenterY(c: Cube) {
  return c.y + c.hw * 0.57 + c.hw * 0.35;
}

// ── component ──────────────────────────────────────────────────────────────
export function HeroCubes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const auraRef      = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const sm    = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      mouse.current.x = e.clientX - r.left - r.width / 2;
      mouse.current.y = e.clientY - r.top  - r.height / 2;
    };
    window.addEventListener("mousemove", onMove);

    // ── simulation state ─────────────────────────────────────────────────
    const cubes: Cube[] = [makeMain(canvas.width, canvas.height)];
    let spawnIn  = 2000 + Math.random() * 1500;
    let spawnAcc = 0;
    let last     = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 50); // cap delta to avoid spiral
      last = now;
      const ds = dt / 16.67; // ≈ 1 at 60fps

      // ── cursor aura ───────────────────────────────────────────────────
      sm.current.x += (mouse.current.x - sm.current.x) * 0.06;
      sm.current.y += (mouse.current.y - sm.current.y) * 0.06;
      if (auraRef.current) {
        const r = container.getBoundingClientRect();
        auraRef.current.style.left = `${sm.current.x + r.width  / 2}px`;
        auraRef.current.style.top  = `${sm.current.y + r.height / 2}px`;
      }

      // ── spawn new main cube ───────────────────────────────────────────
      spawnAcc += dt;
      if (spawnAcc >= spawnIn) {
        spawnAcc = 0;
        spawnIn  = 1800 + Math.random() * 2200;
        if (cubes.filter(c => !c.fragment && !c.dead).length < 5)
          cubes.push(makeMain(canvas.width, canvas.height));
      }

      // ── collision detection (main cubes only) ─────────────────────────
      const fresh: Cube[] = [];
      const hit = new Set<number>();
      const live = cubes.filter(c => !c.fragment && !c.dead && !c.fading);

      for (let i = 0; i < live.length; i++) {
        for (let j = i + 1; j < live.length; j++) {
          const a = live[i], b = live[j];
          if (hit.has(a.id) || hit.has(b.id)) continue;
          const dx = a.x - b.x;
          const dy = cubeCenterY(a) - cubeCenterY(b);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < (a.hw + b.hw) * 1.45) {
            hit.add(a.id); hit.add(b.id);
            const mx = (a.x + b.x) / 2;
            const my = (cubeCenterY(a) + cubeCenterY(b)) / 2;
            fresh.push(...makeFragments(mx, my, 5 + Math.floor(Math.random() * 5)));
            a.dead = true;
            b.dead = true;
          }
        }
      }

      // ── physics update ────────────────────────────────────────────────
      for (const c of cubes) {
        if (c.dead) continue;

        c.x  += c.vx * ds;
        c.y  += c.vy * ds;
        c.vy += (c.fragment ? 0.05 : 0.006) * ds; // gravity

        // bounce main cubes off top/bottom walls
        if (!c.fragment) {
          if (c.y < 0) {
            c.y  = 0;
            c.vy = Math.abs(c.vy) * 0.55;
          }
          const floor = canvas.height - c.hw * 2.2;
          if (c.y > floor) {
            c.y  = floor;
            c.vy = -Math.abs(c.vy) * 0.55;
          }
        }

        // fade in
        if (c.fadeIn) {
          c.opacity = Math.min(1, c.opacity + 0.85 * (dt / 1000));
          if (c.opacity >= 1) { c.opacity = 1; c.fadeIn = false; }
        }

        // fade out
        if (c.fading) {
          c.opacity -= c.fadeSpeed * (dt / 1000);
          if (c.opacity <= 0) { c.dead = true; continue; }
        }

        // cull off-screen
        if (!c.fragment && c.x - c.hw > canvas.width + 20) {
          c.dead = true; continue;
        }
        if (c.fragment && (
          c.x < -80 || c.x > canvas.width + 80 ||
          c.y < -80 || c.y > canvas.height + 80
        )) { c.dead = true; continue; }
      }

      // merge new fragments
      cubes.push(...fresh);

      // compact (remove dead) — iterate backwards to splice safely
      for (let i = cubes.length - 1; i >= 0; i--)
        if (cubes[i].dead) cubes.splice(i, 1);

      // ── render ────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // draw fragments first (below main cubes)
      for (const c of cubes) if (c.fragment)  drawCube(ctx, c);
      for (const c of cubes) if (!c.fragment) drawCube(ctx, c);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0 }}>
      {/* soft cursor aura */}
      <div ref={auraRef} style={{
        position: "absolute",
        width: 320, height: 320,
        borderRadius: "50%",
        transform: "translate(-50%,-50%)",
        background: "radial-gradient(circle, rgba(77,124,255,0.10) 0%, rgba(130,89,239,0.05) 40%, transparent 68%)",
        pointerEvents: "none",
        zIndex: 4,
        willChange: "left, top",
      }} />
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}
