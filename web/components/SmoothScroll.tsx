"use client";
import { useEffect } from "react";

/* LERP 0.045 = very heavy, weighted — premium feel */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("ontouchstart" in window) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let raf: number;
    const LERP = 0.045;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 44;
      if (e.deltaMode === 2) delta *= window.innerHeight;
      /* Amplify slightly so it doesn't feel unresponsive despite heavy lerp */
      target += delta * 1.3;
      target = Math.max(0, Math.min(target, document.body.scrollHeight - window.innerHeight));
    };

    const tick = () => {
      const diff = target - current;
      current += diff * LERP;
      if (Math.abs(diff) > 0.1) window.scrollTo(0, current);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
