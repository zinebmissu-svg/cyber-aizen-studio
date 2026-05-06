import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Home" },
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5">
      <div className="mx-auto max-w-7xl flex items-center justify-between glass rounded-full px-5 md:px-7 py-3">
        <Link to="/" className="font-bold tracking-[0.3em] text-sm" data-cursor-label="Home">
          <span className="text-chrome">AIZEN</span>
          <span className="ml-2 text-primary-glow">▸</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors rounded-full"
              activeOptions={{ exact: true }}
              activeProps={{ className: "px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] text-foreground bg-primary/15 rounded-full" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/contact"
          className="text-xs font-mono uppercase tracking-[0.2em] px-4 py-2 rounded-full bg-foreground/95 text-background hover:bg-primary hover:text-primary-foreground transition-colors"
          data-cursor-label="Get in touch"
        >
          Hire ↗
        </Link>
      </div>
    </header>
  );
}
