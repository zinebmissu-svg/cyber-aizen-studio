import { useEffect, useRef } from "react";
import type { Review } from "@/hooks/use-site-data";

export function ReviewsMarquee({ reviews }: { reviews: Review[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const offsetRef = useRef(0);

  useEffect(() => {
    let raf = 0;
    const step = () => {
      if (!pausedRef.current && trackRef.current) {
        offsetRef.current -= 0.5; // px per frame
        const half = trackRef.current.scrollWidth / 2;
        if (-offsetRef.current >= half) offsetRef.current = 0;
        trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!reviews.length) return null;
  const loop = [...reviews, ...reviews];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-background to-transparent" />
      <div ref={trackRef} className="flex gap-6 will-change-transform">
        {loop.map((r, i) => (
          <article
            key={`${r.id}-${i}`}
            className="shrink-0 w-[340px] md:w-[420px] p-7 rounded-3xl glass-strong relative overflow-hidden"
          >
            <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-primary/30 blur-3xl opacity-50" />
            <div className="relative flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-lg font-bold text-white overflow-hidden">
                {r.avatar_url ? (
                  <img src={r.avatar_url} alt={r.name} className="w-full h-full object-cover" />
                ) : (
                  r.name.charAt(0)
                )}
              </div>
              <div>
                <div className="font-bold text-chrome">{r.name}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{r.role}</div>
              </div>
            </div>
            <div className="relative flex gap-1 mb-3 text-primary-glow">
              {Array.from({ length: r.rating }).map((_, k) => <span key={k}>★</span>)}
            </div>
            <p className="relative text-foreground/85 leading-relaxed text-sm md:text-base">"{r.quote}"</p>
          </article>
        ))}
      </div>
    </div>
  );
}
