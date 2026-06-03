"use client";
import { useEffect } from "react";

/* Custom event name — sidebar uses this to trigger lerp scroll */
export const SCROLL_TO_EVENT = "cbug:scroll-to";

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("ontouchstart" in window) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let raf: number;
    const LERP = 0.045;

    /* Wheel: update target */
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 44;
      if (e.deltaMode === 2) delta *= window.innerHeight;
      target += delta * 1.3;
      target = Math.max(0, Math.min(target, document.body.scrollHeight - window.innerHeight));
    };

    /* Sidebar / anchor click: jump lerp target directly */
    const onScrollTo = (e: Event) => {
      const y = (e as CustomEvent<{ y: number }>).detail.y;
      target = Math.max(0, Math.min(y, document.body.scrollHeight - window.innerHeight));
    };

    const tick = () => {
      /* If something external jumped the scroll (e.g. browser anchor nav),
         adopt the new position so lerp doesn't fight it */
      const actual = window.scrollY;
      if (Math.abs(actual - current) > 80) {
        target = actual;
        current = actual;
      }

      const diff = target - current;
      current += diff * LERP;
      if (Math.abs(diff) > 0.1) window.scrollTo(0, current);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener(SCROLL_TO_EVENT, onScrollTo);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener(SCROLL_TO_EVENT, onScrollTo);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
