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
    </footer>
  );
}
