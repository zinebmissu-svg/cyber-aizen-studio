import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Aizen" },
      { name: "description", content: "How Aizen Studio collects, uses, and protects your personal information when you visit aizenvfx.com." },
      { property: "og:title", content: "Privacy Policy — Aizen" },
      { property: "og:description", content: "How Aizen Studio collects, uses, and protects your personal information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

const SECTIONS = [
  {
    h: "1. Who we are",
    p: [
      "Aizen Studio (\"Aizen\", \"we\", \"us\") is a creative studio based in Morocco offering VFX, video editing, 3D motion design, and graphic design services. This policy applies to the website aizenvfx.com and any communication you send us through it.",
    ],
  },
  {
    h: "2. Information we collect",
    p: [
      "Contact form submissions: your name, email address, project type, budget, and message — sent only when you choose to contact us.",
      "Communication details: anything you share with us by email, Instagram (@aizen.visuals), or WhatsApp when discussing a project.",
      "Basic technical data: anonymous, aggregated information about how the site is used (for example, page visits), and standard server log data such as browser type.",
      "We do not collect sensitive personal data, and we do not sell your information to anyone.",
    ],
  },
  {
    h: "3. How we use your information",
    p: [
      "To reply to your inquiry and prepare a quote for your project.",
      "To deliver and manage the work we do together.",
      "To keep the site secure and understand how it is used, at an aggregate level.",
    ],
  },
  {
    h: "4. Storage and sharing",
    p: [
      "Form submissions are stored securely in our website backend and are visible only to Aizen Studio. We never sell, rent, or trade your personal information. Your details are shared only with service providers strictly necessary to run the business (for example, email or cloud hosting), under their own confidentiality obligations.",
    ],
  },
  {
    h: "5. Cookies and analytics",
    p: [
      "The site itself uses no advertising cookies. If analytics or social embeds are enabled in the future, this policy will be updated to describe exactly what they collect.",
    ],
  },
  {
    h: "6. Your rights",
    p: [
      "You may ask at any time to access, correct, or delete the personal information you have shared with us. Email contact@aizenvfx.com or message @aizen.visuals and we will act on your request promptly.",
    ],
  },
  {
    h: "7. Data retention",
    p: [
      "Inquiry details are kept only as long as needed to handle your request and any resulting project, or as required by law, after which they are deleted.",
    ],
  },
  {
    h: "8. Changes to this policy",
    p: [
      "If this policy changes, the updated version will be posted on this page with a new effective date.",
    ],
  },
];

function PrivacyPage() {
  return (
    <section className="relative pt-40 pb-32 px-6 md:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow mb-4">/ Legal</div>
        <h1 className="text-5xl md:text-6xl font-bold text-chrome leading-[0.95]">
          Privacy <span className="italic font-light text-violet-glow">Policy</span>
        </h1>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Effective November 2026 · aizenvfx.com
        </p>

        <div className="mt-14 space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.h}>
              <h2 className="text-xl font-semibold text-chrome">{s.h}</h2>
              <div className="mt-3 space-y-3">
                {s.p.map((t, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">{t}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-16 text-sm text-muted-foreground">
          Questions about this policy?{" "}
          <Link to="/contact" className="text-violet-glow hover:underline">Contact us</Link> or reach out on Instagram{" "}
          <a href="https://instagram.com/aizen.visuals" target="_blank" rel="noreferrer" className="text-violet-glow hover:underline">@aizen.visuals</a>. See also our{" "}
          <Link to="/terms" className="text-violet-glow hover:underline">Terms of Service</Link>.
        </p>
      </div>
    </section>
  );
}
