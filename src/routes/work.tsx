import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — Aizen" },
      { name: "description", content: "Selected cinematic work by Aizen: VFX, editing, 3D motion, and creative direction." },
      { property: "og:title", content: "Work — Aizen" },
      { property: "og:description", content: "A selected gallery of cinematic projects by Aizen." },
    ],
  }),
  component: WorkPage,
});

const FILTERS = ["All", "VFX", "Editing", "3D Motion", "Direction"] as const;

const PROJECTS = [
  { t: "Neon Dynasty", c: "Music Video", k: "VFX", y: "2025", g: "from-violet-500/40 to-fuchsia-500/10" },
  { t: "Atlas Echoes", c: "Brand Film", k: "3D Motion", y: "2025", g: "from-cyan-400/30 to-violet-500/20" },
  { t: "Chrome Bloom", c: "Fashion Campaign", k: "Editing", y: "2025", g: "from-violet-400/40 to-indigo-500/10" },
  { t: "Voidwalker", c: "Short Film", k: "VFX", y: "2024", g: "from-fuchsia-500/30 to-violet-700/40" },
  { t: "Mirage Capital", c: "Title Sequence", k: "Direction", y: "2024", g: "from-indigo-500/30 to-violet-500/20" },
  { t: "Solstice 04", c: "Music Visual", k: "3D Motion", y: "2024", g: "from-violet-600/40 to-purple-900/30" },
  { t: "Halo Method", c: "Sneaker Launch", k: "Editing", y: "2024", g: "from-violet-500/30 to-cyan-500/10" },
  { t: "Crimson Drift", c: "Auto Campaign", k: "VFX", y: "2023", g: "from-rose-500/20 to-violet-700/30" },
  { t: "Kintsugi", c: "Documentary", k: "Direction", y: "2023", g: "from-amber-500/20 to-violet-500/30" },
] as const;

function WorkPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const items = PROJECTS.filter((p) => filter === "All" || p.k === filter);

  return (
    <section className="relative pt-40 pb-32 px-6 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow mb-4">/ Portfolio</div>
          <h1 className="text-5xl md:text-7xl font-bold text-chrome leading-[0.95]">
            Selected <span className="italic font-light text-violet-glow">work</span>
          </h1>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            A living archive of cinematic frames — music, fashion, film, and brand work
            shot, edited, and crafted with obsessive detail.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              data-cursor-label="Filter"
              className={`px-5 py-2 rounded-full font-mono text-[10px] uppercase tracking-[0.3em] border transition-all ${
                filter === f
                  ? "bg-foreground text-background border-foreground shadow-[var(--shadow-glow)]"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary-glow/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <article
              key={p.t}
              data-cursor-label="Open"
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden glass-strong cursor-none"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${p.g} transition-transform duration-700 group-hover:scale-110`} />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,oklch(0_0_0/70%)_100%)]" />
              <div
                className="absolute inset-0 mix-blend-overlay opacity-25 transition-opacity group-hover:opacity-40"
                style={{ background: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.85'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")" }}
              />
              <div className="absolute inset-0 p-7 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] px-2.5 py-1 rounded-full glass">{p.k}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{p.y}</span>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">{p.c}</div>
                  <h2 className="text-2xl md:text-3xl font-bold text-chrome leading-tight">{p.t}</h2>
                  <div className="mt-4 h-px w-0 bg-primary-glow transition-all duration-500 group-hover:w-full" />
                </div>
              </div>
              <div className="absolute top-5 right-5 w-9 h-9 rounded-full glass flex items-center justify-center text-primary-glow opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">↗</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
