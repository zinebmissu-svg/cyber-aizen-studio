import { useEffect, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BUCKET, Panel, Empty } from "@/components/admin/kit";
import type { ShowcaseItem } from "@/components/WorkShowcase";

export function ShowcasePanel() {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data, error } = await supabase.from("showcase_items").select("*").order("sort_order");
    if (error) toast.error(error.message);
    setItems(data ?? []);
  };
  useEffect(() => {
    void load();
  }, []);

  const upload = async (e: ChangeEvent<HTMLInputElement>, kind: "poster" | "video") => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    let order = items.length;
    for (const f of files) {
      const ext = f.name.split(".").pop() || "bin";
      const path = `showcase/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const up = await supabase.storage.from(BUCKET).upload(path, f, { contentType: f.type });
      if (up.error) {
        toast.error(`${f.name}: ${up.error.message}`);
        continue;
      }
      const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      const { error } = await supabase
        .from("showcase_items")
        .insert({ kind, url, storage_path: path, title: f.name.replace(/\.[^.]+$/, ""), sort_order: order++ });
      if (error) toast.error(error.message);
    }
    setBusy(false);
    toast.success("Uploaded");
    void load();
  };

  const update = async (id: string, patch: Partial<ShowcaseItem>) => {
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    const { error } = await supabase.from("showcase_items").update(patch).eq("id", id);
    if (error) toast.error(error.message);
  };

  const remove = async (it: ShowcaseItem) => {
    if (!window.confirm("Delete this item?")) return;
    await supabase.from("showcase_items").delete().eq("id", it.id);
    if (it.storage_path) await supabase.storage.from(BUCKET).remove([it.storage_path]);
    void load();
  };

  const move = async (idx: number, dir: -1 | 1, list: ShowcaseItem[]) => {
    const j = idx + dir;
    if (j < 0 || j >= list.length) return;
    const a = list[idx], b = list[j];
    await Promise.all([
      supabase.from("showcase_items").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("showcase_items").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    void load();
  };

  const section = (kind: "poster" | "video", title: string, accept: string) => {
    const list = items.filter((i) => i.kind === kind);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">{title} ({list.length})</h3>
          <label className={`px-5 py-2.5 rounded-full bg-foreground text-background font-mono text-[10px] uppercase tracking-[0.25em] cursor-pointer ${busy ? "opacity-50 pointer-events-none" : ""}`}>
            {busy ? "Uploading…" : "+ Upload"}
            <input type="file" accept={accept} multiple hidden onChange={(e) => upload(e, kind)} />
          </label>
        </div>
        {list.length === 0 ? (
          <Empty>Nothing yet — upload your first {kind === "poster" ? "poster" : "reel"}.</Empty>
        ) : (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {list.map((it, i) => (
              <div key={it.id} className="rounded-2xl border border-border overflow-hidden bg-card">
                <div className="aspect-[4/5] bg-muted/10">
                  {kind === "poster" ? (
                    <img src={it.url} alt={it.title} className="w-full h-full object-cover" />
                  ) : (
                    <video src={it.url} muted controls preload="metadata" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <input
                    value={it.title}
                    onChange={(e) => setItems((xs) => xs.map((x) => (x.id === it.id ? { ...x, title: e.target.value } : x)))}
                    onBlur={(e) => update(it.id, { title: e.target.value })}
                    placeholder="Title"
                    className="w-full bg-transparent border border-border rounded-lg px-2 py-1.5 text-sm outline-none focus:border-primary-glow"
                  />
                  <div className="flex items-center justify-between gap-1 text-xs">
                    <label className="flex items-center gap-1.5">
                      <input type="checkbox" checked={it.visible} onChange={(e) => update(it.id, { visible: e.target.checked })} />
                      Visible
                    </label>
                    <div className="flex gap-1">
                      <button onClick={() => move(i, -1, list)} className="w-7 h-7 rounded-lg border border-border" aria-label="Move up">↑</button>
                      <button onClick={() => move(i, 1, list)} className="w-7 h-7 rounded-lg border border-border" aria-label="Move down">↓</button>
                      <button onClick={() => remove(it)} className="w-7 h-7 rounded-lg border border-destructive/60 text-destructive" aria-label="Delete">✕</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Panel title="Work" desc="Upload posters (JPG/PNG) and edited reels/videos shown in the Work section.">
      <div className="space-y-10">
        {section("poster", "Posters", "image/jpeg,image/png,image/webp")}
        {section("video", "Reels & edited videos", "video/mp4,video/webm,video/quicktime")}
      </div>
    </Panel>
  );
}
