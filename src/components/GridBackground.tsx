import { useEffect, useRef, useState } from "react";

/**
 * Lightweight fixed reactive grid behind page content.
 * - Pure CSS gradients (no SVG patterns / no per-frame React state)
 * - rAF loop only runs while the grid is visible
 * - Disabled on touch devices and for reduced motion
 */
export default function GridBackground({
  gridSize = 100,
  maskRadius = 380,
}: {
  gridSize?: number;
  maskRadius?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setEnabled(true);

    const root = rootRef.current;
    if (!root) return;

    let visible = false;
    const onScroll = () => {
      const next = window.scrollY > window.innerHeight * 0.55;
      if (next === visible) return;
      visible = next;
      root.style.opacity = next ? "1" : "0";
      if (next && !reduce && !coarse) start();
      else stop();
    };

    let raf = 0;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    let pending = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      pending = true;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!pending && Math.abs(mx - cx) < 0.5 && Math.abs(my - cy) < 0.5) return;
      pending = false;
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      const glow = glowRef.current;
      if (glow) {
        const mask = `radial-gradient(${maskRadius}px circle at ${cx.toFixed(1)}px ${cy.toFixed(1)}px, #fff, transparent)`;
        glow.style.maskImage = mask;
        glow.style.webkitMaskImage = mask;
      }
    };

    const start = () => {
      if (raf) return;
      window.addEventListener("mousemove", onMove, { passive: true });
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
      window.removeEventListener("mousemove", onMove);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      stop();
      window.removeEventListener("scroll", onScroll);
    };
  }, [maskRadius]);

  if (!enabled) return null;

  const cell = `${gridSize}px ${gridSize}px`;
  const line = (color: string) =>
    `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-700"
      style={{ opacity: 0, contain: "strict" }}
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{ backgroundImage: line("oklch(0.97 0.005 270 / 10%)"), backgroundSize: cell }}
      />
      <div
        ref={glowRef}
        className="absolute inset-0"
        style={{ backgroundImage: line("oklch(0.78 0.18 295 / 70%)"), backgroundSize: cell }}
      />
    </div>
  );
}
