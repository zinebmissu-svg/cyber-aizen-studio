import { Link } from "@tanstack/react-router";
import { useSiteData } from "@/hooks/use-site-data";

export function Footer() {
  const { settings } = useSiteData();
  const brand = settings?.brand_name ?? "AIZEN";
  return (
    <footer className="relative mt-32 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-12 grid gap-8 md:grid-cols-3 items-end">
        <div>
          <div className="text-4xl font-bold tracking-[0.3em] text-chrome">{brand}</div>
          <div className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            VFX · Editing · 3D Motion
          </div>
        </div>
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground md:text-center">
          {settings?.location_text ?? "Based in Morocco"} · {settings?.location_sub ?? "Working worldwide"}
        </div>
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground md:text-right">
          {settings?.footer_text ?? `© ${new Date().getFullYear()} Aizen Studio`}
        </div>
      </div>
      <div className="border-t border-border/30">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8">
          <Link to="/privacy" className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <span className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground/40" aria-hidden />
          <Link to="/terms" className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
