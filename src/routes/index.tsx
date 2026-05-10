import { createFileRoute, Link } from "@tanstack/react-router";
import { ClientOnly } from "../components/ClientOnly";
import { HeroScene } from "../components/HeroScene";
import { MagneticButton } from "../components/MagneticButton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aizen — Turning Ideas Into Moving Worlds" },
      { name: "description", content: "Cinematic VFX, video editing, and 3D motion design portfolio of Aizen — Moroccan creative director." },
      { property: "og:title", content: "Aizen — Turning Ideas Into Moving Worlds" },
      { property: "og:description", content: "Cinematic VFX, video editing, and 3D motion design." },
    ],
  }),
  component: Index,
});

function Visualizer() {
  return (
    <div className="flex items-end justify-center gap-[3px] h-16">
      {Array.from({ length: 64 }).map((_, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full animate-pulse-glow"
          style={{
            height: `${10 + Math.abs(Math.sin(i * 0.4) * 40)}px`,
            background: "linear-gradient(180deg, oklch(0.85 0.15 295), oklch(0.45 0.2 295))",
            animationDelay: `${(i % 12) * 0.08}s`,
            boxShadow: "0 0 10px oklch(0.62 0.22 295 / 60%)",
          }}
        />
      ))}
    </div>
  );
}

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ClientOnly>
            <HeroScene />
          </ClientOnly>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background pointer-events-none" />

        <div className="relative z-10 text-center px-6 max-w-6xl">
          <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 rounded-full glass">
            <span className="w-2 h-2 rounded-full bg-primary-glow animate-pulse-glow" />
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
              Cinematic Portfolio · 2026
            </span>
          </div>

          <h1 className="font-bold leading-[0.9] tracking-tight text-[clamp(2.8rem,9vw,8rem)]">
            <span className="block text-chrome">Turning Ideas</span>
            <span className="block italic font-light text-violet-glow">Into Moving</span>
            <span className="block text-chrome">Worlds.</span>
          </h1>

          <p className="mt-8 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed">
            Aizen — Moroccan VFX artist, video editor, and 3D motion designer
            crafting cinematic visuals for music, fashion, and film.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link to="/work" className="inline-block">
              <MagneticButton label="View work">Enter Portfolio</MagneticButton>
            </Link>
            <Link to="/contact" className="inline-block">
              <MagneticButton variant="ghost" label="Reach out">Start a Project</MagneticButton>
            </Link>
          </div>

          <div className="mt-16 max-w-md mx-auto">
            <Visualizer />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
          <span>Scroll</span>
          <span className="w-12 h-px bg-gradient-to-r from-primary-glow to-transparent" />
        </div>
      </section>

      {/* MARQUEE */}
      <section className="relative py-20 border-y border-border/50 overflow-hidden">
        <div className="flex gap-16 animate-[shimmer_30s_linear_infinite] whitespace-nowrap text-6xl md:text-8xl font-bold text-chrome opacity-30">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-16 font-semibold">
              VFX <span className="text-primary-glow">◆</span>
              EDITING <span className="text-primary-glow">◆</span>
              3D MOTION <span className="text-primary-glow">◆</span>
              DIRECTION <span className="text-primary-glow">◆</span>
            </span>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="relative py-32 px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow mb-4">/ 01 — Selected Works</div>
              <h2 className="text-4xl md:text-6xl font-bold text-chrome">Recent Frames</h2>
            </div>
            <Link
              to="/work"
              className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors"
              data-cursor-label="See all"
            >
              View all projects ↗
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              { t: "Neon Dynasty", c: "Music Video · VFX", g: "from-violet-500/30 to-fuchsia-500/10" },
              { t: "Atlas Echoes", c: "Brand Film · 3D Motion", g: "from-cyan-400/20 to-violet-500/20" },
              { t: "Chrome Bloom", c: "Fashion Campaign · Editing", g: "from-violet-400/30 to-indigo-500/10" },
              { t: "Voidwalker", c: "Short Film · VFX Direction", g: "from-fuchsia-500/20 to-violet-700/30" },
            ].map((p) => (
              <div
                key={p.t}
                data-cursor-label="Open"
                className="group relative aspect-[16/10] rounded-2xl overflow-hidden glass-strong"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${p.g} opacity-90 transition-opacity group-hover:opacity-100`} />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,oklch(0_0_0/60%)_100%)]" />
                <div className="absolute inset-0 mix-blend-overlay opacity-30" style={{ background: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.8'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")" }} />
                <div className="absolute inset-0 p-8 flex flex-col justify-end transition-transform duration-700 group-hover:translate-y-[-6px]">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">{p.c}</div>
                  <h3 className="text-3xl md:text-4xl font-bold text-chrome">{p.t}</h3>
                </div>
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-primary-glow opacity-0 group-hover:opacity-100 transition-opacity">↗</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
