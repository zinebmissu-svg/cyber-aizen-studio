import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type MouseEvent } from "react";
import { ClientOnly } from "../components/ClientOnly";
import { HeroScene } from "../components/HeroScene";
import { MagneticButton } from "../components/MagneticButton";
import { scrollToId } from "../components/SmoothScroll";

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

/* ---------- Hero visualizer ---------- */
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

/* ---------- Work data ---------- */
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

/* ---------- About data ---------- */
const TIMELINE = [
  { y: "2019", t: "First frames", d: "Self-taught editor cutting music videos in Casablanca." },
  { y: "2021", t: "VFX awakening", d: "Dove into Houdini, Nuke, and procedural 3D — building a personal cinematic language." },
  { y: "2023", t: "Going global", d: "Collaborated with international labels and fashion houses on hero campaigns." },
  { y: "2025", t: "Aizen Studio", d: "Founded a one-person studio focused on emotional, cinematic motion." },
] as const;

/* ---------- Services data ---------- */
const SERVICES = [
  { n: "01", t: "VFX", d: "Compositing, simulations, and cinematic post-production for music videos, films, and brand work.", icon: "✦" },
  { n: "02", t: "Video Editing", d: "Rhythm-first editorial — cutting story, music, and emotion into a single frame language.", icon: "▶" },
  { n: "03", t: "3D Motion Graphics", d: "Procedural worlds, chrome typography, and physics-based motion for screens of every scale.", icon: "◆" },
  { n: "04", t: "Creative Direction", d: "End-to-end concept, art direction, and visual treatment from mood to delivery.", icon: "◉" },
  { n: "05", t: "Visual Branding", d: "Identity systems with motion baked in — logos, type, and brand films that move.", icon: "❖" },
] as const;

function TiltCard({ s }: { s: (typeof SERVICES)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(0)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(1000px) rotateY(0) rotateX(0)";
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor-label={s.t}
      className="group relative p-8 rounded-3xl glass-strong overflow-hidden transition-transform duration-300 will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: "linear-gradient(135deg, oklch(0.62 0.22 295 / 25%), transparent 60%)" }}
      />
      <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/30 blur-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-700" />

      <div className="relative flex items-start justify-between mb-12">
        <span className="font-mono text-xs tracking-[0.3em] text-primary-glow">/ {s.n}</span>
        <span className="text-3xl text-violet-glow group-hover:rotate-180 transition-transform duration-700">{s.icon}</span>
      </div>
      <h3 className="relative text-3xl md:text-4xl font-bold text-chrome mb-4">{s.t}</h3>
      <p className="relative text-muted-foreground leading-relaxed">{s.d}</p>

      <div className="relative mt-8 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/70">
        <span className="w-8 h-px bg-primary-glow transition-all duration-500 group-hover:w-16" />
        <span>Inquire</span>
      </div>
    </div>
  );
}

/* ---------- Contact form helpers ---------- */
const SOCIALS = [
  { n: "Instagram", h: "https://instagram.com" },
  { n: "Behance", h: "https://behance.net" },
  { n: "Vimeo", h: "https://vimeo.com" },
  { n: "YouTube", h: "https://youtube.com" },
];

function Field({ label, type = "text", as }: { label: string; type?: string; as?: "textarea" }) {
  return (
    <label className="block group">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2 group-focus-within:text-primary-glow transition-colors">
        {label}
      </div>
      {as === "textarea" ? (
        <textarea
          rows={5}
          data-cursor-label="Type"
          className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-foreground outline-none transition-all focus:border-primary-glow focus:shadow-[0_0_30px_-5px_oklch(0.62_0.22_295/60%)]"
        />
      ) : (
        <input
          type={type}
          data-cursor-label="Type"
          className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-foreground outline-none transition-all focus:border-primary-glow focus:shadow-[0_0_30px_-5px_oklch(0.62_0.22_295/60%)]"
        />
      )}
    </label>
  );
}

/* ============================================================ */
function Index() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const items = PROJECTS.filter((p) => filter === "All" || p.k === filter);
  const [sent, setSent] = useState(false);

  return (
    <>
      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
            <button onClick={() => scrollToId("work")} className="inline-block">
              <MagneticButton label="View work">Enter Portfolio</MagneticButton>
            </button>
            <button onClick={() => scrollToId("contact")} className="inline-block">
              <MagneticButton variant="ghost" label="Reach out">Start a Project</MagneticButton>
            </button>
          </div>

          <div className="mt-16 max-w-md mx-auto">
            <Visualizer />
          </div>
        </div>

        <button
          onClick={() => scrollToId("work")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3"
        >
          <span>Scroll</span>
          <span className="w-12 h-px bg-gradient-to-r from-primary-glow to-transparent" />
        </button>
      </section>

      {/* MARQUEE */}
      <section className="relative py-20 border-y border-border/50 overflow-hidden">
        <div className="flex gap-16 w-max animate-marquee-x whitespace-nowrap text-6xl md:text-8xl font-bold text-chrome opacity-30">
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

      {/* WORK */}
      <section id="work" className="relative py-32 px-6 md:px-10 scroll-mt-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow mb-4">/ 01 — Portfolio</div>
            <h2 className="text-5xl md:text-7xl font-bold text-chrome leading-[0.95]">
              Selected <span className="italic font-light text-violet-glow">work</span>
            </h2>
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
                    <h3 className="text-2xl md:text-3xl font-bold text-chrome leading-tight">{p.t}</h3>
                    <div className="mt-4 h-px w-0 bg-primary-glow transition-all duration-500 group-hover:w-full" />
                  </div>
                </div>
                <div className="absolute top-5 right-5 w-9 h-9 rounded-full glass flex items-center justify-center text-primary-glow opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">↗</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative py-32 px-6 md:px-10 scroll-mt-24">
        <div className="mx-auto max-w-6xl">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow mb-4">/ 02 — About</div>
          <h2 className="text-5xl md:text-8xl font-bold text-chrome leading-[0.92]">
            A frame is <span className="italic font-light text-violet-glow">a feeling</span>.
          </h2>

          <div className="mt-20 grid gap-12 md:grid-cols-[1fr_1.4fr] items-start">
            <div className="relative">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden glass-strong relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-700/40 via-violet-500/10 to-fuchsia-500/30" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,oklch(0.78_0.18_295/40%),transparent_60%)]" />
                <div
                  className="absolute inset-0 mix-blend-overlay opacity-40"
                  style={{ background: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.9'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")" }}
                />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Portrait</div>
                    <div className="text-2xl font-bold text-chrome mt-1">Aizen</div>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">MA · 1998</div>
                </div>
              </div>
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/30 blur-3xl opacity-50" />
            </div>

            <div className="space-y-8">
              <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed">
                I'm <span className="text-violet-glow">Aizen</span> — a Moroccan VFX artist,
                editor, and 3D motion designer. My obsession is texture: how light bends across chrome,
                how fog softens an edge, how a single cut can change everything.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I work between Casablanca and the cloud, building cinematic worlds for music videos,
                fashion campaigns, and brand films. Tools change — taste doesn't. Every frame is a
                composition; every transition, a heartbeat.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
                {[
                  { n: "120+", l: "Projects" },
                  { n: "30+", l: "Brands" },
                  { n: "7", l: "Years" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="text-3xl font-bold text-violet-glow">{s.n}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-32">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow mb-8">/ Timeline</div>
            <div className="relative space-y-8 pl-8 border-l border-border">
              {TIMELINE.map((t) => (
                <div key={t.y} className="relative">
                  <div className="absolute -left-[37px] top-2 w-3 h-3 rounded-full bg-primary-glow shadow-[0_0_16px_oklch(0.62_0.22_295)]" />
                  <div className="font-mono text-xs tracking-[0.3em] text-primary-glow">{t.y}</div>
                  <h3 className="mt-1 text-2xl font-bold text-chrome">{t.t}</h3>
                  <p className="mt-2 max-w-2xl text-muted-foreground">{t.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="relative py-32 px-6 md:px-10 scroll-mt-24">
        <div className="mx-auto max-w-7xl">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow mb-4">/ 03 — Services</div>
          <h2 className="text-5xl md:text-7xl font-bold text-chrome leading-[0.92] max-w-4xl">
            Five disciplines, <span className="italic font-light text-violet-glow">one frame</span>.
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Whether it's a 30-second spot or a full brand world, every service ships with the same obsession for
            motion, light, and detail.
          </p>

          <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => <TiltCard key={s.n} s={s} />)}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative py-32 px-6 md:px-10 overflow-hidden scroll-mt-24">
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <span
              key={i}
              className="absolute block rounded-full animate-float-slow"
              style={{
                left: `${(i * 173) % 100}%`,
                top: `${(i * 67) % 100}%`,
                width: `${1 + (i % 3)}px`,
                height: `${1 + (i % 3)}px`,
                background: "oklch(0.78 0.18 295 / 80%)",
                boxShadow: "0 0 8px oklch(0.62 0.22 295 / 80%)",
                animationDelay: `${(i % 7) * 0.5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow mb-4">/ 04 — Contact</div>
          <h2 className="text-5xl md:text-8xl font-bold text-chrome leading-[0.92]">
            Let's make <span className="italic font-light text-violet-glow">something</span> moving.
          </h2>

          <div className="mt-20 grid gap-12 md:grid-cols-[1fr_1.4fr]">
            <div className="space-y-10">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Email</div>
                <a href="mailto:hello@aizen.studio" className="text-2xl font-bold text-chrome hover:text-violet-glow transition-colors" data-cursor-label="Write">hello@aizen.studio</a>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Based in</div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary-glow animate-pulse-glow" />
                  <span className="text-2xl font-bold text-chrome">Casablanca, Morocco</span>
                </div>
                <div className="font-mono text-xs text-muted-foreground mt-2">33.5731° N, 7.5898° W</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Elsewhere</div>
                <div className="flex flex-wrap gap-2">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.n}
                      href={s.h}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor-label="Visit"
                      className="px-4 py-2 rounded-full glass font-mono text-[10px] uppercase tracking-[0.3em] hover:bg-primary/15 hover:border-primary-glow/60 transition-all"
                    >
                      {s.n} ↗
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="relative glass-strong rounded-3xl p-8 md:p-10 space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Name" />
                <Field label="Email" type="email" />
              </div>
              <Field label="Project type" />
              <Field label="Tell me about it" as="textarea" />

              <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Replies within 48h
                </div>
                <MagneticButton onClick={() => {}} label="Send">
                  {sent ? "Transmitted ✓" : "Transmit"}
                </MagneticButton>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
