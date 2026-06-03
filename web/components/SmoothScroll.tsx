"use client";
import { useEffect } from "react";

/* Lerp-based scroll — LERP 0.07 = very heavy, weighted feel */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("ontouchstart" in window) return; // skip mobile
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let raf: number;
    const LERP = 0.072;
    const SPEED = 1.1;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 40;
      if (e.deltaMode === 2) delta *= window.innerHeight;
      target += delta * SPEED;
      target = Math.max(0, Math.min(target, document.body.scrollHeight - window.innerHeight));
    };

    const tick = () => {
      const diff = target - current;
      if (Math.abs(diff) > 0.15) {
        current += diff * LERP;
        window.scrollTo(0, current);
      } else {
        current = target;
      }
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
