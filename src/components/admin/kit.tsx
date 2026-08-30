import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { MediaRow } from "@/hooks/use-site-data";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/* ============================== Storage / media ============================== */

export const BUCKET = "site-assets";

export async function uploadToLibrary(file: File): Promise<MediaRow | null> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const up = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
  if (up.error) {
    toast.error(`Upload failed: ${up.error.message}`);
    return null;
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const kind = file.type.startsWith("video") ? "video" : file.type.startsWith("image") ? "image" : "file";
  const ins = await supabase
    .from("media")
    .insert({
      title: file.name,
      alt: "",
      kind,
      url: data.publicUrl,
      storage_path: path,
      provider: "upload",
      mime_type: file.type,
      size_bytes: file.size,
    })
    .select("*")
    .single();
  if (ins.error) {
    toast.error(ins.error.message);
    return null;
  }
  return ins.data as MediaRow;
}

export async function loadMedia(kind?: "image" | "video"): Promise<MediaRow[]> {
  let q = supabase.from("media").select("*").is("deleted_at", null).order("created_at", { ascending: false });
  if (kind) q = q.eq("kind", kind);
  const { data, error } = await q;
  if (error) toast.error(error.message);
  return (data ?? []) as MediaRow[];
}

/* ============================== Layout primitives ============================== */

export function Panel({ title, desc, children, actions }: { title: string; desc?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="glass-strong rounded-3xl p-6 md:p-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-chrome">{title}</h2>
          {desc && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{desc}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function Group({ label, children, cols = 2 }: { label?: string; children: ReactNode; cols?: 1 | 2 | 3 }) {
  return (
    <div className="space-y-3">
      {label && <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary-glow">/ {label}</div>}
      <div className={`grid gap-4 ${cols === 1 ? "" : cols === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>{children}</div>
    </div>
  );
}

export function Lbl({ children }: { children: ReactNode }) {
  return <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">{children}</div>;
}

const inputCls =
  "w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-primary-glow";

export function Text({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <Lbl>{label}</Lbl>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </label>
  );
}

export function Area({ label, value, onChange, rows = 4, hint }: { label: string; value: string; onChange: (v: string) => void; rows?: number; hint?: string }) {
  return (
    <label className="block">
      <Lbl>{label}</Lbl>
      <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </label>
  );
}

export function Num({ label, value, onChange, min, max }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <label className="block">
      <Lbl>{label}</Lbl>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={inputCls}
      />
    </label>
  );
}

export function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <Lbl>{label}</Lbl>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`${inputCls} bg-background`}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex items-center gap-3 group"
      aria-pressed={value}
    >
      <span
        className={`relative w-11 h-6 rounded-full border transition-colors ${
          value ? "bg-primary/80 border-primary" : "bg-muted/20 border-border"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-foreground transition-all ${value ? "left-6" : "left-0.5"}`}
        />
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground group-hover:text-foreground">
        {label}
      </span>
    </button>
  );
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const cls =
    variant === "primary"
      ? "bg-foreground text-background hover:bg-primary hover:text-primary-foreground"
      : variant === "danger"
        ? "border border-destructive/60 text-destructive hover:bg-destructive/10"
        : "border border-border text-muted-foreground hover:text-foreground hover:border-primary-glow/50";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-full font-mono text-[10px] uppercase tracking-[0.25em] transition-colors disabled:opacity-50 ${cls}`}
    >
      {children}
    </button>
  );
}

export function SaveBar({ saving, onSave, children }: { saving: boolean; onSave: () => void; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/50">
      <div className="pt-4 flex flex-wrap items-center gap-3">
        <Btn onClick={onSave} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Btn>
        {children}
      </div>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">{children}</div>
  );
}

export function Skeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-16 rounded-2xl bg-muted/10 animate-pulse" />
      ))}
    </div>
  );
}

/* ============================== Confirm dialog ============================== */

export function useConfirm() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<{ title: string; body: string; onYes: () => void } | null>(null);
  const ask = (title: string, body: string, onYes: () => void) => {
    setState({ title, body, onYes });
    setOpen(true);
  };
  const node = (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="glass-strong border-border">
        <AlertDialogHeader>
          <AlertDialogTitle>{state?.title}</AlertDialogTitle>
          <AlertDialogDescription>{state?.body}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              state?.onYes();
              setOpen(false);
            }}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
  return { ask, node };
}

/* ============================== Media field ============================== */

export function MediaField({
  label,
  value,
  onChange,
  kind = "image",
  alt,
  onAltChange,
}: {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  kind?: "image" | "video";
  alt?: string;
  onAltChange?: (v: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [picking, setPicking] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    const row = await uploadToLibrary(f);
    setBusy(false);
    if (row) {
      onChange(row.url);
      toast.success("Uploaded to media library");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <Lbl>{label}</Lbl>
      <div className="flex items-start gap-3">
        <div className="w-24 h-24 shrink-0 rounded-xl border border-border overflow-hidden bg-muted/10 flex items-center justify-center">
          {value ? (
            kind === "video" ? (
              <span className="text-[10px] font-mono text-muted-foreground px-2 text-center break-all">video</span>
            ) : (
              <img src={value} alt="" className="w-full h-full object-cover" />
            )
          ) : (
            <span className="text-[10px] font-mono text-muted-foreground">empty</span>
          )}
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          <input
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder={kind === "video" ? "Video URL (mp4 / YouTube / Vimeo)" : "Image URL"}
            className={inputCls}
          />
          {onAltChange && (
            <input value={alt ?? ""} onChange={(e) => onAltChange(e.target.value)} placeholder="Alt text (accessibility & SEO)" className={inputCls} />
          )}
          <div className="flex flex-wrap items-center gap-2">
            <label className="cursor-pointer text-[10px] font-mono uppercase tracking-[0.25em] px-4 py-2 rounded-full border border-border hover:text-foreground">
              {busy ? "Uploading…" : "Upload"}
              <input ref={fileRef} type="file" accept={kind === "video" ? "video/*" : "image/*"} className="hidden" onChange={onFile} disabled={busy} />
            </label>
            <Btn variant="ghost" onClick={() => setPicking(true)}>
              Library
            </Btn>
            {value && (
              <Btn variant="danger" onClick={() => onChange(null)}>
                Remove
              </Btn>
            )}
          </div>
        </div>
      </div>
      <MediaPicker
        open={picking}
        onOpenChange={setPicking}
        kind={kind}
        onPick={(m) => {
          onChange(m.url);
          if (onAltChange && m.alt) onAltChange(m.alt);
          setPicking(false);
        }}
      />
    </div>
  );
}

export function MediaPicker({
  open,
  onOpenChange,
  onPick,
  kind,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onPick: (m: MediaRow) => void;
  kind?: "image" | "video";
}) {
  const [items, setItems] = useState<MediaRow[]>([]);
  const [q, setQ] = useState("");
  useEffect(() => {
    if (open) loadMedia(kind).then(setItems);
  }, [open, kind]);
  const filtered = items.filter((m) => (m.title + m.tags.join(" ")).toLowerCase().includes(q.toLowerCase()));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-border max-w-3xl">
        <DialogHeader>
          <DialogTitle>Media library</DialogTitle>
        </DialogHeader>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className={inputCls} />
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto pt-2">
          {filtered.map((m) => (
            <button key={m.id} onClick={() => onPick(m)} className="group rounded-xl border border-border overflow-hidden text-left">
              <div className="aspect-square bg-muted/10 flex items-center justify-center overflow-hidden">
                {m.kind === "image" ? (
                  <img src={m.thumbnail_url ?? m.url} alt={m.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <span className="text-[10px] font-mono text-muted-foreground">{m.kind}</span>
                )}
              </div>
              <div className="px-2 py-1.5 text-[10px] font-mono truncate text-muted-foreground">{m.title}</div>
            </button>
          ))}
          {filtered.length === 0 && <div className="col-span-4 text-sm text-muted-foreground">No media yet.</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ============================== Reorder helper ============================== */

export function OrderButtons({ onUp, onDown }: { onUp: () => void; onDown: () => void }) {
  return (
    <div className="flex flex-col gap-1">
      <button onClick={onUp} className="w-7 h-6 rounded-md border border-border text-xs hover:text-primary-glow" aria-label="Move up">
        ↑
      </button>
      <button onClick={onDown} className="w-7 h-6 rounded-md border border-border text-xs hover:text-primary-glow" aria-label="Move down">
        ↓
      </button>
    </div>
  );
}

export async function persistOrder(table: "projects" | "reviews" | "services" | "nav_items" | "sections" | "timeline_items" | "project_media", ids: string[]) {
  await Promise.all(ids.map((id, i) => supabase.from(table).update({ sort_order: i }).eq("id", id)));
}

export function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const copy = [...arr];
  const [x] = copy.splice(from, 1);
  copy.splice(to, 0, x);
  return copy;
}

export const ColorField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <label className="block">
    <Lbl>{label}</Lbl>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#9d6bff"}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-12 rounded-lg bg-transparent border border-border cursor-pointer"
      />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="#rrggbb or oklch(...)" className={`${inputCls} font-mono`} />
    </div>
  </label>
);
