import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { scrollToId } from "./SmoothScroll";
import { useSiteData } from "@/hooks/use-site-data";

const links = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "pricing", label: "Pricing" },
  { id: "reviews", label: "Reviews" },
  { id: "contact", label: "Contact" },
] as const;

function go(e: React.MouseEvent<HTMLAnchorElement>, id: string, after?: () => void) {
  e.preventDefault();
  after?.();
  scrollToId(id);
  if (typeof window !== "undefined") history.replaceState(null, "", `#${id}`);
}

export function Nav() {
  const { settings } = useSiteData();
  const brand = settings?.brand_name ?? "AIZEN";
  const [active, setActive] = useState<string>("home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => en.isIntersecting && setActive(en.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["home", ...links.map((l) => l.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-10 py-4">
      <div
        className={`mx-auto max-w-7xl flex items-center justify-between rounded-full px-5 md:px-6 py-2.5 transition-all duration-500 ${
          scrolled ? "glass-strong shadow-[var(--shadow-elegant)]" : "glass"
        }`}
      >
        <a
          href="#home"
          onClick={(e) => go(e, "home", () => setOpen(false))}
          className="font-bold tracking-[0.3em] text-sm rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring px-1"
          aria-label={`${brand} — back to top`}
        >
          <span className="text-chrome">{brand}</span>
          <span className="ml-2 text-primary-glow">▸</span>
        </a>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const isActive = active === l.id;
            return (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => go(e, l.id)}
                aria-current={isActive ? "true" : undefined}
                className={`relative px-3 py-2 text-xs font-mono uppercase tracking-[0.18em] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
                <span
                  aria-hidden
                  className={`absolute left-1/2 -bottom-0.5 h-1 w-1 -translate-x-1/2 rounded-full bg-primary-glow transition-opacity ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            onClick={(e) => go(e, "contact", () => setOpen(false))}
            className="hidden sm:inline-flex text-xs font-mono uppercase tracking-[0.18em] px-4 py-2.5 rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            data-cursor-label="Get in touch"
          >
            Let's Talk ↗
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full glass-strong text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`md:hidden mx-auto max-w-7xl mt-2 overflow-hidden rounded-3xl glass-strong bg-background/95 backdrop-blur-2xl transition-all duration-500 ${
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0 pointer-events-none border-transparent"
        }`}
      >
        <nav aria-label="Mobile" className="flex flex-col p-3">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              tabIndex={open ? 0 : -1}
              onClick={(e) => go(e, l.id, () => setOpen(false))}
              className={`flex items-center justify-between min-h-12 px-4 rounded-2xl text-base transition-colors ${
                active === l.id ? "text-foreground bg-primary/10" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
              <span className="font-mono text-[11px] text-primary-glow">↗</span>
            </a>
          ))}
          <a
            href="#contact"
            tabIndex={open ? 0 : -1}
            onClick={(e) => go(e, "contact", () => setOpen(false))}
            className="mt-2 flex items-center justify-center min-h-12 rounded-2xl bg-foreground text-background font-mono text-xs uppercase tracking-[0.2em]"
          >
            Start a Project ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
