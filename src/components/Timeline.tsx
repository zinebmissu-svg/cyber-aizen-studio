import { useEffect, useRef, useState } from "react";

export type TimelineItem = { year: string; title: string; text: string };

const DEFAULT_ITEMS: TimelineItem[] = [
  { year: "2019", title: "Editing beginnings", text: "Started creating football and anime edits." },
  { year: "2021", title: "VFX mastery", text: "Mastered VFX and cinematic editing." },
  { year: "2023", title: "Creative expansion", text: "Expanded into graphic design and visual branding." },
  { year: "2026", title: "Content creator era", text: "Started building a cinematic presence on Instagram through creative content." },
];

function Row({ item, index }: { item: TimelineItem; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      style={{ transitionDelay: `${index * 120}ms` }}
      className={`relative pl-10 transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-8 blur-[6px]"
      }`}
    >
      <span
        className={`absolute left-0 top-1.5 h-3 w-3 -translate-x-[5px] rounded-full bg-primary transition-all duration-700 ${
          visible ? "scale-100 shadow-[0_0_18px_4px_hsl(var(--primary)/0.55)]" : "scale-0"
        }`}
      />
      <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary-glow">{item.year}</div>
      <h3 className="mt-2 text-2xl md:text-3xl font-bold text-chrome">{item.title}</h3>
      <p className="mt-2 text-muted-foreground leading-relaxed">{item.text}</p>
    </li>
  );
}

export default function Timeline({ items = DEFAULT_ITEMS }: { items?: TimelineItem[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height + window.innerHeight * 0.5;
      const p = (window.innerHeight * 0.85 - r.top) / total;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="timeline" className="relative py-32 px-6 md:px-10 scroll-mt-24">
      <div className="mx-auto max-w-4xl">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow mb-12">/ <span className="text-violet-glow">Timeline</span></div>
        <div ref={wrapRef} className="relative">
          <div className="absolute left-0 top-0 h-full w-px bg-border/60" />
          <div
            className="absolute left-0 top-0 w-px bg-gradient-to-b from-primary to-primary-glow shadow-[0_0_12px_2px_hsl(var(--primary)/0.5)]"
            style={{ height: `${progress * 100}%` }}
          />
          <ul className="space-y-16">
            {items.map((it, i) => (
              <Row key={it.year + i} item={it} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
