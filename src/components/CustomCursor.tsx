import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let dx = mx, dy = my;
    let rx = mx, ry = my;
    let hovering = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const t = e.target as HTMLElement;
      const interactive = t.closest("a,button,[data-cursor]");
      if (interactive) {
        if (!hovering) {
          hovering = true;
          ringRef.current?.classList.add("cursor-hover");
        }
        const lbl = interactive.getAttribute("data-cursor-label");
        setLabel(lbl);
      } else if (hovering) {
        hovering = false;
        ringRef.current?.classList.remove("cursor-hover");
        setLabel(null);
      }
    };

    const onClick = () => {
      if (!ringRef.current) return;
      ringRef.current.classList.remove("cursor-burst");
      void ringRef.current.offsetWidth;
      ringRef.current.classList.add("cursor-burst");
    };

    const tick = () => {
      dx += (mx - dx) * 0.55;
      dy += (my - dy) * 0.55;
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <style>{`
        .cursor-dot {
          position: fixed; left: 0; top: 0; width: 6px; height: 6px;
          background: var(--cursor-color, oklch(0.92 0.02 295)); border-radius: 9999px;
          pointer-events: none; z-index: 9999;
          box-shadow: 0 0 12px var(--cursor-color, oklch(0.62 0.22 295));
          mix-blend-mode: difference;
        }
        .cursor-ring {
          position: fixed; left: 0; top: 0; width: 38px; height: 38px;
          border: 1px solid var(--cursor-color, oklch(0.78 0.18 295));
          border-radius: 9999px; pointer-events: none; z-index: 9998;
          transition: width .25s ease, height .25s ease, background .25s ease, border-color .25s ease;
          box-shadow: 0 0 30px color-mix(in oklab, var(--cursor-color, oklch(0.62 0.22 295)) 40%, transparent),
                      inset 0 0 12px color-mix(in oklab, var(--cursor-color, oklch(0.62 0.22 295)) 25%, transparent);
        }
        .cursor-ring.cursor-hover {
          width: 70px; height: 70px;
          background: color-mix(in oklab, var(--cursor-color, oklch(0.62 0.22 295)) 14%, transparent);
          border-color: var(--cursor-color, oklch(0.85 0.15 295));
        }
        .cursor-ring.cursor-burst { animation: cursor-burst .55s ease-out; }
        @keyframes cursor-burst {
          0% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--cursor-color, oklch(0.62 0.22 295)) 60%, transparent); }
          100% { box-shadow: 0 0 0 60px transparent; }
        }
        .cursor-label {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--font-mono);
          font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
          color: oklch(0.97 0.005 270); white-space: nowrap;
        }
      `}</style>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring">
        {label && <span className="cursor-label">{label}</span>}
      </div>
    </>
  );
}
