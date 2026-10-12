import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ShowcaseItem = Database["public"]["Tables"]["showcase_items"]["Row"];

export function ServicesShowcase({ headline }: { headline: ReactNode }) {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [tab, setTab] = useState<"poster" | "video">("poster");
  const [open, setOpen] = useState<ShowcaseItem | null>(null);

  useEffect(() => {
    supabase
      .from("showcase_items")
      .select("*")
      .eq("visible", true)
      .order("sort_order")
      .then(({ data }) => setItems(data ?? []));
  }, []);

  const list = items.filter((i) => i.kind === tab);

  return (
    <section id="services" className="relative py-32 px-6 md:px-10 scroll-mt-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow mb-4">/ 03 — Services</div>
            <h2 className="text-5xl md:text-7xl font-bold text-chrome leading-[0.95]">{headline}</h2>
          </div>
          <div className="inline-flex p-1 rounded-full glass-strong">
            {(["poster", "video"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`px-5 py-2 rounded-full font-mono text-[11px] uppercase tracking-[0.25em] transition-colors ${
                  tab === k ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {k === "poster" ? "Posters" : "Reels"}
              </button>
            ))}
          </div>
        </div>

        {list.length === 0 ? (
          <div className="glass-strong rounded-3xl p-12 text-center text-muted-foreground">Coming soon.</div>
        ) : tab === "poster" ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [&>*]:mb-6">
            {list.map((i) => (
              <button key={i.id} onClick={() => setOpen(i)} className="block w-full overflow-hidden rounded-3xl border border-border group">
                <img src={i.url} alt={i.title || "Poster"} loading="lazy" className="w-full h-auto transition-transform duration-700 group-hover:scale-105" />
              </button>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {list.map((i) => (
              <div key={i.id} className="relative aspect-[9/16] overflow-hidden rounded-3xl border border-border bg-card">
                <video
                  src={i.url}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  controls
                  onMouseEnter={(e) => void e.currentTarget.play().catch(() => {})}
                  onMouseLeave={(e) => e.currentTarget.pause()}
                  className="w-full h-full object-cover"
                />
                {i.title && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass-strong text-xs pointer-events-none">{i.title}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-[150] bg-background/90 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setOpen(null)}>
          <img src={open.url} alt={open.title || "Poster"} className="max-h-[90vh] max-w-full rounded-2xl" />
        </div>
      )}
    </section>
  );
}
