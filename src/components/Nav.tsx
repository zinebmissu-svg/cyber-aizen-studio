import { Link } from "@tanstack/react-router";
import { scrollToId } from "./SmoothScroll";
import { useSiteData } from "@/hooks/use-site-data";

const links = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "reviews", label: "Reviews" },
  { id: "contact", label: "Contact" },
] as const;

function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  scrollToId(id);
  if (typeof window !== "undefined") {
    history.replaceState(null, "", `#${id}`);
  }
}

export function Nav() {
  const { settings } = useSiteData();
  const brand = settings?.brand_name ?? "AIZEN";
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5">
      <div className="mx-auto max-w-7xl flex items-center justify-between glass rounded-full px-5 md:px-7 py-3">
        <a
          href="#home"
          onClick={(e) => handleClick(e, "home")}
          className="font-bold tracking-[0.3em] text-sm"
          data-cursor-label="Home"
        >
          <span className="text-chrome">{brand}</span>
          <span className="ml-2 text-primary-glow">▸</span>
        </a>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => handleClick(e, l.id)}
              className="px-3 py-2 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors rounded-full"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#contact"
            onClick={(e) => handleClick(e, "contact")}
            className="text-xs font-mono uppercase tracking-[0.2em] px-4 py-2 rounded-full bg-foreground/95 text-background hover:bg-primary hover:text-primary-foreground transition-colors"
            data-cursor-label="Get in touch"
          >
            Hire ↗
          </a>
        </div>
      </div>
    </header>
  );
}
