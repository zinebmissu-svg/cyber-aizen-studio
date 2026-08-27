import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { MagneticButton } from "../components/MagneticButton";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Aizen" },
      { name: "description", content: "Start a cinematic project with Aizen. Based in Morocco, working worldwide." },
      { property: "og:title", content: "Contact Aizen" },
      { property: "og:description", content: "Get in touch to start a cinematic project." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://cyber-aizen-studio.lovable.app/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://cyber-aizen-studio.lovable.app/contact" }],
  }),
  component: ContactPage,
});

const SOCIALS = [
  { n: "Instagram", h: "https://instagram.com" },
  { n: "Behance", h: "https://behance.net" },
  { n: "Vimeo", h: "https://vimeo.com" },
  { n: "YouTube", h: "https://youtube.com" },
];

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(120),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message required").max(5000),
});

function Field({
  label,
  type = "text",
  as,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  as?: "textarea";
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block group">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2 group-focus-within:text-primary-glow transition-colors">
        {label}
      </div>
      {as === "textarea" ? (
        <textarea
          rows={5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          data-cursor-label="Type"
          className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-foreground outline-none transition-all focus:border-primary-glow focus:shadow-[0_0_30px_-5px_oklch(0.62_0.22_295/60%)]"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          data-cursor-label="Type"
          className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-foreground outline-none transition-all focus:border-primary-glow focus:shadow-[0_0_30px_-5px_oklch(0.62_0.22_295/60%)]"
        />
      )}
    </label>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", projectType: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const sent = status === "sent";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const message = form.projectType
      ? `Project type: ${form.projectType}\n\n${form.message}`
      : form.message;
    const parsed = contactSchema.safeParse({ name: form.name, email: form.email, message });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      setStatus("error");
      return;
    }
    setStatus("sending");
    const { error: insertError } = await supabase.from("contact_submissions").insert(parsed.data);
    if (insertError) {
      setStatus("error");
      setError(insertError.message);
    } else {
      setStatus("sent");
      setForm({ name: "", email: "", projectType: "", message: "" });
    }
  };
  return (
    <section className="relative pt-40 pb-32 px-6 md:px-10 overflow-hidden">
      {/* ambient particles */}
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
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow mb-4">/ Contact</div>
        <h1 className="text-5xl md:text-8xl font-bold text-chrome leading-[0.92]">
          Let's make <span className="italic font-light text-violet-glow">something</span> moving.
        </h1>

        <div className="mt-20 grid gap-12 md:grid-cols-[1fr_1.4fr]">
          {/* Info */}
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

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="relative glass-strong rounded-3xl p-8 md:p-10 space-y-6"
          >
            <div className="absolute -inset-px rounded-3xl pointer-events-none" style={{ background: "linear-gradient(135deg, oklch(0.62 0.22 295 / 30%), transparent 50%)", maskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)", WebkitMaskComposite: "xor", maskComposite: "exclude", padding: "1px" }} />

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
  );
}
