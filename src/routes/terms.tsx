import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Aizen" },
      { name: "description", content: "The terms that govern the use of aizenvfx.com and the creative services provided by Aizen Studio." },
      { property: "og:title", content: "Terms of Service — Aizen" },
      { property: "og:description", content: "The terms that govern the use of aizenvfx.com and Aizen Studio's creative services." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});

const SECTIONS = [
  {
    h: "1. Acceptance of terms",
    p: [
      "By using aizenvfx.com or engaging Aizen Studio (\"Aizen\", \"we\", \"us\") for creative services, you agree to these Terms of Service. If you do not agree, please do not use the site or our services.",
    ],
  },
  {
    h: "2. Our services",
    p: [
      "Aizen Studio provides VFX, video editing, 3D motion design, and graphic design services. Services are delivered on a project basis, as agreed with each client before work begins.",
    ],
  },
  {
    h: "3. Quotes, pricing, and payment",
    p: [
      "Prices shown on the site are starting points. Final pricing depends on project complexity, duration, and deliverables, and is always confirmed in a written quote before work starts.",
      "Unless agreed otherwise, projects begin after an advance payment and the remaining balance is due on final delivery. Payment details are provided in each quote.",
    ],
  },
  {
    h: "4. Revisions",
    p: [
      "Each package includes the revision rounds stated in its description. Additional revisions beyond those rounds are quoted separately. Feedback must be consolidated and provided in a reasonable timeframe to keep projects on schedule.",
    ],
  },
  {
    h: "5. Client responsibilities",
    p: [
      "You confirm that you own or have licensed all materials you send us (footage, logos, fonts, music, images). You agree not to send content that is unlawful, defamatory, or infringes anyone's rights.",
    ],
  },
  {
    h: "6. Intellectual property",
    p: [
      "Upon full payment, you receive the agreed usage rights to the final delivered work. Aizen retains the right to display completed work and process materials in its portfolio and on social media unless you ask otherwise in writing before delivery. Pre-delivery drafts, project files, and internal materials remain the property of Aizen.",
    ],
  },
  {
    h: "7. Timeline and delays",
    p: [
      "Delivery timelines are estimates confirmed per project. Aizen is not liable for delays caused by late feedback, missing materials, or events outside its reasonable control.",
    ],
  },
  {
    h: "8. Limitation of liability",
    p: [
      "To the maximum extent permitted by law, Aizen's total liability for any claim relating to the site or a project is limited to the amount you paid for that project. Aizen is not liable for indirect or consequential losses.",
    ],
  },
  {
    h: "9. Third-party content and links",
    p: [
      "The site may display work containing third-party assets or link to external platforms (for example, Instagram or video hosting). Aizen is not responsible for the content or policies of those external services.",
    ],
  },
  {
    h: "10. Changes",
    p: [
      "Aizen may update these terms from time to time. The current version posted on this page applies to new projects and site use from its effective date.",
    ],
  },
];

function TermsPage() {
  return (
    <section className="relative pt-40 pb-32 px-6 md:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow mb-4">/ Legal</div>
        <h1 className="text-5xl md:text-6xl font-bold text-chrome leading-[0.95]">
          Terms of <span className="italic font-light text-violet-glow">Service</span>
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
          Questions about these terms?{" "}
          <Link to="/contact" className="text-violet-glow hover:underline">Contact us</Link> or reach out on Instagram{" "}
          <a href="https://instagram.com/aizen.visuals" target="_blank" rel="noreferrer" className="text-violet-glow hover:underline">@aizen.visuals</a>. See also our{" "}
          <Link to="/privacy" className="text-violet-glow hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </section>
  );
}
