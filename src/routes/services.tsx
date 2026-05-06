import { createFileRoute } from "@tanstack/react-router";
import { useRef, type MouseEvent } from "react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Aizen" },
      { name: "description", content: "VFX, video editing, 3D motion graphics, creative direction, and visual branding by Aizen." },
      { property: "og:title", content: "Services — Aizen" },
      { property: "og:description", content: "What Aizen makes: VFX, editing, 3D motion, direction, branding." },
    ],
  }),
  component: ServicesPage,
});

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

function ServicesPage() {
  return (
    <section className="relative pt-40 pb-32 px-6 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow mb-4">/ Services</div>
        <h1 className="text-5xl md:text-7xl font-bold text-chrome leading-[0.92] max-w-4xl">
          Five disciplines, <span className="italic font-light text-violet-glow">one frame</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground">
          Whether it's a 30-second spot or a full brand world, every service ships with the same obsession for
          motion, light, and detail.
        </p>

        <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => <TiltCard key={s.n} s={s} />)}
        </div>
      </div>
    </section>
  );
}
