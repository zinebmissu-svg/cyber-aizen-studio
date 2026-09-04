import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type FormEvent, type MouseEvent } from "react";
import { ClientOnly } from "../components/ClientOnly";
import { HeroScene } from "../components/HeroScene";
import { MagneticButton } from "../components/MagneticButton";
import { Portrait3D } from "../components/Portrait3D";
import { ReviewsMarquee } from "../components/ReviewsMarquee";
import { scrollToId } from "../components/SmoothScroll";
import { useSiteData, type Project } from "../hooks/use-site-data";
import Timeline from "../components/Timeline";
import VideoWork from "../components/VideoWork";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { Instagram, Mail, MapPin, ArrowUpRight , MessageCircle} from "lucide-react";


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

const FILTERS = ["All", "VFX", "Editing", "3D Motion", "Direction"] as const;

type ServiceItem = { n: string; t: string; d: string; icon: string };

function LastWordGradient({ text, baseClass = "text-chrome" }: { text?: string; baseClass?: string }) {
  const value = text?.trim() ?? "";
  const i = value.lastIndexOf(" ");
  if (i === -1) return <span className="text-gradient-purple">{value}</span>;
  return (
    <>
      <span className={baseClass}>{value.slice(0, i + 1)}</span>
      <span className="text-gradient-purple">{value.slice(i + 1)}</span>
    </>
  );
}

function TiltCard({ s }: { s: ServiceItem }) {
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

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(120),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message required").max(5000),
});

/* ============================================================ */
function Index() {
  const { settings, projects, projectMedia, reviews } = useSiteData();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const items: Project[] = projects.filter((p) => filter === "All" || p.kind === filter);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [projectType, setProjectType] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = contactSchema.safeParse({
      ...form,
      message: projectType ? `[${projectType}] ${form.message}` : form.message,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setStatus("sending");
    const { error } = await supabase.from("contact_submissions").insert(parsed.data);
    if (error) {
      setStatus("error");
      setError(error.message);
    } else {
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setProjectType("");
    }
  };

  const ig = settings?.instagram_handle ?? "aizen.visuals";
  const igUrl = `https://instagram.com/${ig.replace(/^@/, "")}`;
  const email = settings?.contact_email ?? "contact@aizenvfx.com";
  const whatsapp = "+212 627 477 131";

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
              {settings?.hero_eyebrow ?? "Cinematic Portfolio · 2026"}
            </span>
          </div>

          <h1 className="font-bold leading-[0.9] tracking-tight text-[clamp(2.8rem,9vw,8rem)]">
            <span className="block"><LastWordGradient text={settings?.hero_line1 ?? "Turning Ideas"} /></span>
            <span className="block italic font-light text-violet-glow">{settings?.hero_line2 ?? "Into Moving"}</span>
            <span className="block"><LastWordGradient text={settings?.hero_line3 ?? "Worlds."} /></span>
          </h1>

          <p className="mt-8 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed">
            {settings?.hero_subtitle}
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton label="View work" onClick={() => scrollToId("work")}>Enter Portfolio</MagneticButton>
            <MagneticButton variant="ghost" label="Reach out" onClick={() => scrollToId("contact")}>Start a Project</MagneticButton>
          </div>

          <div className="mt-16 max-w-md mx-auto">
            <Visualizer />
          </div>
        </div>

        <button
          onClick={() => scrollToId("about")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3"
        >
          <span>Scroll</span>
          <span className="w-12 h-px bg-gradient-to-r from-primary-glow to-transparent" />
        </button>
      </section>

      {/* MARQUEE */}
      <section
        className="relative py-12 md:py-16 border-y border-border/50 overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee-x whitespace-nowrap text-4xl md:text-6xl font-semibold tracking-tight">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-10 md:gap-14 pr-10 md:pr-14 leading-[1.2] py-1">
              <span className="text-chrome">
                {settings?.marquee_text ?? "VFX ◆ EDITING ◆ 3D MOTION ◆ DIRECTION"}
              </span>
              <span className="text-primary-glow text-2xl md:text-3xl">◆</span>
            </span>
          ))}
        </div>
      </section>



      {/* ABOUT (now before WORK) */}
      <section id="about" className="relative py-32 px-6 md:px-10 scroll-mt-24">
        <div className="mx-auto max-w-6xl">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow mb-4">/ 01 — About</div>
          <h2 className="text-5xl md:text-8xl font-bold text-chrome leading-[0.92]">
            <LastWordGradient text={settings?.about_headline ?? "A frame is a feeling."} />
          </h2>

          <div className="mt-20 grid gap-12 md:grid-cols-[1fr_1.4fr] items-start">
            <Portrait3D src={settings?.portrait_url} />

            <div className="space-y-8">
              <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed whitespace-pre-line">
                {settings?.about_p1}
              </p>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {settings?.about_p2}
              </p>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
                {[
                  { n: settings?.stat1_n, l: settings?.stat1_l },
                  { n: settings?.stat2_n, l: settings?.stat2_l },
                  { n: settings?.stat3_n, l: settings?.stat3_l },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold text-violet-glow">{s.n}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Timeline />

      {/* WORK */}
      <section id="work" className="relative py-32 px-6 md:px-10 scroll-mt-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow mb-4">/ 02 — Portfolio</div>
            <h2 className="text-5xl md:text-7xl font-bold text-chrome leading-[0.95]">
              <LastWordGradient text={settings?.work_headline ?? "Selected work"} />
            </h2>
            <p className="mt-6 max-w-2xl text-muted-foreground">
              {settings?.work_subtitle}
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
            {items.map((p) => {
              const inner = (
                <>
                  {p.cover_url ? (
                    <img src={p.cover_url} alt={p.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} transition-transform duration-700 group-hover:scale-110`} />
                  )}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,oklch(0_0_0/70%)_100%)]" />
                  <div
                    className="absolute inset-0 mix-blend-overlay opacity-25 transition-opacity group-hover:opacity-40"
                    style={{ background: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.85'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")" }}
                  />
                  <div className="absolute inset-0 p-7 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] px-2.5 py-1 rounded-full glass">{p.kind}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{p.year}</span>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">{p.client}</div>
                      <h3 className="text-2xl md:text-3xl font-bold text-chrome leading-tight">{p.title}</h3>
                      <div className="mt-4 h-px w-0 bg-primary-glow transition-all duration-500 group-hover:w-full" />
                    </div>
                  </div>
                  <div className="absolute top-5 right-5 w-9 h-9 rounded-full glass flex items-center justify-center text-primary-glow opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">↗</div>
                </>
              );
              return p.link_url ? (
                <a key={p.id} href={p.link_url} target="_blank" rel="noopener noreferrer" data-cursor-label="Open" className="group relative aspect-[4/5] rounded-2xl overflow-hidden glass-strong cursor-none block">
                  {inner}
                </a>
              ) : (
                <article key={p.id} data-cursor-label="Open" className="group relative aspect-[4/5] rounded-2xl overflow-hidden glass-strong cursor-none">
                  {inner}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* VIDEO WORK */}
      <VideoWork projects={projects} projectMedia={projectMedia} />

      {/* SERVICES */}
      <section id="services" className="relative py-32 px-6 md:px-10 scroll-mt-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow mb-4">/ 03 — Services</div>
            <h2 className="text-5xl md:text-7xl font-bold text-chrome leading-[0.95]">
              <LastWordGradient text={settings?.services_headline ?? "What I make"} />
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(settings?.services_json ?? []).map((s: ServiceItem) => <TiltCard key={s.n} s={s} />)}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="relative py-32 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10 mb-16">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow mb-4">/ 04 — Reviews</div>
          <h2 className="text-5xl md:text-7xl font-bold text-chrome leading-[0.95]">
            <LastWordGradient text={settings?.reviews_headline ?? "Words from collaborators"} />
          </h2>
        </div>
        <ReviewsMarquee reviews={reviews} />
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative py-32 px-6 md:px-10 scroll-mt-24">
        <div className="mx-auto max-w-6xl">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow mb-4">/ 04 — Contact</div>
          <h2 className="text-5xl md:text-8xl font-bold text-chrome leading-[0.92]">
            <LastWordGradient text={settings?.contact_headline ?? "Let's make something moving."} />
          </h2>
          <p className="mt-6 text-muted-foreground">Got a project? Let's talk.</p>

          <div className="mt-16 grid gap-14 md:grid-cols-[1fr_1.1fr] items-start">
            {/* Contact list */}
            <div className="space-y-9">
              <a href={`mailto:${email}`} data-cursor-label="Email" className="group flex items-center gap-5">
                <div className="w-11 h-11 shrink-0 rounded-full border border-border flex items-center justify-center text-primary-glow transition-all group-hover:border-primary-glow group-hover:shadow-[0_0_24px_-4px_oklch(0.62_0.22_295/70%)]">
                  <Mail className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Email</div>
                  <div className="text-xl font-bold text-chrome">{email}</div>
                </div>
              </a>

              <a href={igUrl} target="_blank" rel="noopener noreferrer" data-cursor-label="Open Instagram" className="group flex items-center gap-5">
                <div className="w-11 h-11 shrink-0 rounded-full border border-border flex items-center justify-center text-primary-glow transition-all group-hover:border-primary-glow group-hover:shadow-[0_0_24px_-4px_oklch(0.62_0.22_295/70%)]">
                  <Instagram className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Instagram</div>
                  <div className="text-xl font-bold text-chrome">@{ig.replace(/^@/, "")}</div>
                </div>
              </a>

              <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" data-cursor-label="WhatsApp" className="group flex items-center gap-5">
                <div className="w-11 h-11 shrink-0 rounded-full border border-border flex items-center justify-center text-primary-glow transition-all group-hover:border-primary-glow group-hover:shadow-[0_0_24px_-4px_oklch(0.62_0.22_295/70%)]">
                  <MessageCircle className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">WhatsApp</div>
                  <div className="text-xl font-bold text-chrome">{whatsapp}</div>
                </div>
              </a>

              <div className="flex items-center gap-5">
                <div className="w-11 h-11 shrink-0 rounded-full border border-border flex items-center justify-center text-primary-glow">
                  <MapPin className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Based in</div>
                  <div className="text-xl font-bold text-chrome">{settings?.location_text ?? "Casablanca, Morocco"}</div>
                </div>
              </div>
            </div>

            {/* Form card */}
            <form onSubmit={handleSubmit} className="glass-strong rounded-3xl p-8 md:p-10 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block group">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2 group-focus-within:text-primary-glow transition-colors">Name</div>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    data-cursor-label="Type"
                    className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-foreground outline-none transition-all focus:border-primary-glow focus:shadow-[0_0_30px_-5px_oklch(0.62_0.22_295/60%)]"
                  />
                </label>
                <label className="block group">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2 group-focus-within:text-primary-glow transition-colors">Email</div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    data-cursor-label="Type"
                    className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-foreground outline-none transition-all focus:border-primary-glow focus:shadow-[0_0_30px_-5px_oklch(0.62_0.22_295/60%)]"
                  />
                </label>
              </div>

              <label className="block group">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2 group-focus-within:text-primary-glow transition-colors">Project type</div>
                <input
                  type="text"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  data-cursor-label="Type"
                  className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-foreground outline-none transition-all focus:border-primary-glow focus:shadow-[0_0_30px_-5px_oklch(0.62_0.22_295/60%)]"
                />
              </label>

              <label className="block group">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2 group-focus-within:text-primary-glow transition-colors">Tell me about it</div>
                <textarea
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  data-cursor-label="Type"
                  className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-foreground outline-none transition-all focus:border-primary-glow focus:shadow-[0_0_30px_-5px_oklch(0.62_0.22_295/60%)]"
                />
              </label>

              {error && <div className="text-sm text-destructive font-mono">{error}</div>}
              {status === "sent" && (
                <div className="text-sm text-primary-glow font-mono">✓ Message sent. I'll get back to you shortly.</div>
              )}

              <div className="flex items-center justify-between gap-6 pt-2">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Replies within 48h</div>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  data-cursor-label="Send"
                  className="inline-flex items-center gap-3 px-7 py-3 rounded-full bg-foreground text-background font-mono text-xs uppercase tracking-[0.25em] hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-60"
                >
                  {status === "sending" ? "Sending..." : "Transmit"}
                  <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_2px_oklch(0.62_0.22_295/80%)]" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
