import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Aizen" },
      { name: "description", content: "Moroccan-born cinematic creative crafting VFX, editing, and 3D motion for global brands and artists." },
      { property: "og:title", content: "About Aizen" },
      { property: "og:description", content: "The story behind Aizen — Moroccan VFX & motion designer." },
    ],
  }),
  component: AboutPage,
});

const TIMELINE = [
  { y: "2019", t: "First frames", d: "Self-taught editor cutting music videos in Casablanca." },
  { y: "2021", t: "VFX awakening", d: "Dove into Houdini, Nuke, and procedural 3D — building a personal cinematic language." },
  { y: "2023", t: "Going global", d: "Collaborated with international labels and fashion houses on hero campaigns." },
  { y: "2025", t: "Aizen Studio", d: "Founded a one-person studio focused on emotional, cinematic motion." },
] as const;

function AboutPage() {
  return (
    <section className="relative pt-40 pb-32 px-6 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow mb-4">/ About</div>
        <h1 className="text-5xl md:text-8xl font-bold text-chrome leading-[0.92]">
          A frame is <span className="italic font-light text-violet-glow">a feeling</span>.
        </h1>

        <div className="mt-20 grid gap-12 md:grid-cols-[1fr_1.4fr] items-start">
          {/* Portrait */}
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

          {/* Bio */}
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

        {/* Timeline */}
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
  );
}
