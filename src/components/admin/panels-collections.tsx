import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Project, ProjectMedia, Review, Service, TimelineRow, MediaRow } from "@/hooks/use-site-data";
import {
  Panel,
  Group,
  Text,
  Area,
  Num,
  Select,
  Toggle,
  Btn,
  Empty,
  Skeleton,
  useConfirm,
  MediaField,
  OrderButtons,
  persistOrder,
  moveItem,
  loadMedia,
  uploadToLibrary,
} from "./kit";

const CATEGORIES = ["Graphic Design", "Video Editing", "VFX", "3D", "Motion Design", "Web Development", "Other"];
const STATUSES = ["draft", "published", "unpublished"];

function Row({
  children,
  onUp,
  onDown,
  badges,
}: {
  children: React.ReactNode;
  onUp: () => void;
  onDown: () => void;
  badges?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border p-4 md:p-5 space-y-4 bg-background/30">
      <div className="flex items-start gap-4">
        <OrderButtons onUp={onUp} onDown={onDown} />
        <div className="flex-1 min-w-0 space-y-4">{children}</div>
      </div>
      {badges && <div className="flex flex-wrap items-center gap-3 pt-1">{badges}</div>}
    </div>
  );
}

/* ================================ Portfolio ================================ */

export function PortfolioPanel({
  rows,
  media,
  onChanged,
}: {
  rows: Project[];
  media: ProjectMedia[];
  onChanged: () => void;
}) {
  const [items, setItems] = useState<Project[]>(rows);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const confirm = useConfirm();

  useEffect(() => setItems(rows), [rows]);

  const patch = (id: string, p: Partial<Project>) =>
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const saveAll = async () => {
    setSaving(true);
    for (const p of items) {
      const { id, created_at, updated_at, ...rest } = p;
      void created_at;
      void updated_at;
      const { error } = await supabase.from("projects").update(rest).eq("id", id);
      if (error) {
        toast.error(error.message);
        setSaving(false);
        return;
      }
    }
    await persistOrder("projects", items.map((i) => i.id));
    setSaving(false);
    toast.success("Projects saved");
    onChanged();
  };

  const add = async () => {
    const { error } = await supabase.from("projects").insert({
      title: "New project",
      client: "",
      kind: "Film",
      year: String(new Date().getFullYear()),
      gradient: "linear-gradient(135deg, oklch(0.62 0.22 295), oklch(0.3 0.1 280))",
      description: "",
      category: "Other",
      tags: [],
      status: "draft",
      featured: false,
      visible: true,
      cover_alt: "",
      sort_order: items.length,
    });
    if (error) return toast.error(error.message);
    toast.success("Project created");
    onChanged();
  };

  const duplicate = async (p: Project) => {
    const { id, created_at, updated_at, ...rest } = p;
    void id;
    void created_at;
    void updated_at;
    const { error } = await supabase
      .from("projects")
      .insert({ ...rest, title: `${p.title} (copy)`, slug: null, status: "draft", sort_order: items.length });
    if (error) return toast.error(error.message);
    toast.success("Duplicated");
    onChanged();
  };

  const remove = (p: Project) =>
    confirm.ask("Delete project?", `"${p.title}" will be hidden from the site and moved to the trash.`, async () => {
      const { error } = await supabase.from("projects").update({ deleted_at: new Date().toISOString() }).eq("id", p.id);
      if (error) return toast.error(error.message);
      toast.success("Project deleted");
      onChanged();
    });

  const move = async (i: number, d: -1 | 1) => {
    const next = moveItem(items, i, i + d);
    setItems(next);
    await persistOrder("projects", next.map((x) => x.id));
  };

  const shown = items.filter((p) => (p.title + p.category + p.client).toLowerCase().includes(filter.toLowerCase()));

  return (
    <Panel
      title="Portfolio"
      desc="Create, edit, reorder, publish and feature projects. Each project can carry a cover, gallery images and videos."
      actions={
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={saveAll} disabled={saving}>
            {saving ? "Saving…" : "Save all"}
          </Btn>
          <Btn onClick={add}>+ New project</Btn>
        </div>
      }
    >
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search projects…"
        className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-glow"
      />
      {items.length === 0 && <Empty>No projects yet — create your first one.</Empty>}
      <div className="space-y-4">
        {shown.map((p) => {
          const i = items.findIndex((x) => x.id === p.id);
          const expanded = open === p.id;
          return (
            <Row
              key={p.id}
              onUp={() => move(i, -1)}
              onDown={() => move(i, 1)}
              badges={
                <>
                  <Toggle label="Visible" value={p.visible} onChange={(v) => patch(p.id, { visible: v })} />
                  <Toggle label="Featured" value={p.featured} onChange={(v) => patch(p.id, { featured: v })} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {p.status}
                  </span>
                  <div className="ml-auto flex gap-2">
                    <Btn variant="ghost" onClick={() => setOpen(expanded ? null : p.id)}>
                      {expanded ? "Collapse" : "Edit"}
                    </Btn>
                    <Btn variant="ghost" onClick={() => duplicate(p)}>
                      Duplicate
                    </Btn>
                    <Btn variant="danger" onClick={() => remove(p)}>
                      Delete
                    </Btn>
                  </div>
                </>
              }
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-border shrink-0 bg-muted/10">
                  {p.cover_url ? (
                    <img src={p.cover_url} alt={p.cover_alt} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full" style={{ background: p.gradient }} />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-chrome truncate">{p.title || "Untitled"}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground truncate">
                    {p.category} · {p.year}
                  </div>
                </div>
              </div>

              {expanded && (
                <div className="space-y-6 pt-2">
                  <Group cols={2}>
                    <Text label="Title" value={p.title} onChange={(v) => patch(p.id, { title: v })} />
                    <Text label="Client" value={p.client} onChange={(v) => patch(p.id, { client: v })} />
                    <Text label="Type / kind" value={p.kind} onChange={(v) => patch(p.id, { kind: v })} />
                    <Text label="Year" value={p.year} onChange={(v) => patch(p.id, { year: v })} />
                    <Select
                      label="Category"
                      value={p.category}
                      onChange={(v) => patch(p.id, { category: v })}
                      options={CATEGORIES}
                    />
                    <Select
                      label="Status"
                      value={p.status}
                      onChange={(v) => patch(p.id, { status: v })}
                      options={STATUSES}
                    />
                    <Text
                      label="Tags (comma separated)"
                      value={(p.tags ?? []).join(", ")}
                      onChange={(v) =>
                        patch(p.id, { tags: v.split(",").map((t) => t.trim()).filter(Boolean) })
                      }
                    />
                    <Text label="Project link" value={p.link_url ?? ""} onChange={(v) => patch(p.id, { link_url: v || null })} />
                    <Text label="Slug" value={p.slug ?? ""} onChange={(v) => patch(p.id, { slug: v || null })} />
                    <Text label="Gradient (fallback cover)" value={p.gradient} onChange={(v) => patch(p.id, { gradient: v })} />
                  </Group>
                  <Group cols={1}>
                    <Area label="Description" value={p.description} onChange={(v) => patch(p.id, { description: v })} />
                  </Group>
                  <Group cols={2} label="Media">
                    <MediaField
                      label="Cover image"
                      value={p.cover_url}
                      onChange={(u) => patch(p.id, { cover_url: u })}
                      alt={p.cover_alt}
                      onAltChange={(v) => patch(p.id, { cover_alt: v })}
                    />
                    <MediaField
                      label="Main video"
                      kind="video"
                      value={p.video_url}
                      onChange={(u) => patch(p.id, { video_url: u })}
                    />
                  </Group>
                  <GalleryEditor projectId={p.id} rows={media.filter((m) => m.project_id === p.id)} onChanged={onChanged} />
                </div>
              )}
            </Row>
          );
        })}
      </div>
      {confirm.node}
    </Panel>
  );
}

function GalleryEditor({
  projectId,
  rows,
  onChanged,
}: {
  projectId: string;
  rows: ProjectMedia[];
  onChanged: () => void;
}) {
  const confirm = useConfirm();
  const [items, setItems] = useState<ProjectMedia[]>(rows);
  useEffect(() => setItems(rows), [rows]);

  const add = async (kind: "image" | "video") => {
    const { error } = await supabase.from("project_media").insert({
      project_id: projectId,
      kind,
      url: "",
      provider: "upload",
      alt: "",
      visible: true,
      sort_order: items.length,
    });
    if (error) return toast.error(error.message);
    onChanged();
  };

  const save = async (m: ProjectMedia) => {
    const { error } = await supabase
      .from("project_media")
      .update({ url: m.url, alt: m.alt, kind: m.kind, thumbnail_url: m.thumbnail_url, visible: m.visible })
      .eq("id", m.id);
    if (error) return toast.error(error.message);
    toast.success("Gallery item saved");
    onChanged();
  };

  const remove = (m: ProjectMedia) =>
    confirm.ask("Remove gallery item?", "It will be detached from this project.", async () => {
      const { error } = await supabase.from("project_media").delete().eq("id", m.id);
      if (error) return toast.error(error.message);
      onChanged();
    });

  const move = async (i: number, d: -1 | 1) => {
    const next = moveItem(items, i, i + d);
    setItems(next);
    await persistOrder("project_media", next.map((x) => x.id));
  };

  return (
    <div className="space-y-3 rounded-2xl border border-border/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary-glow">/ Gallery</div>
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={() => add("image")}>
            + Image
          </Btn>
          <Btn variant="ghost" onClick={() => add("video")}>
            + Video
          </Btn>
        </div>
      </div>
      {items.length === 0 && <Empty>No gallery media for this project.</Empty>}
      {items.map((m, i) => (
        <div key={m.id} className="flex items-start gap-3">
          <OrderButtons onUp={() => move(i, -1)} onDown={() => move(i, 1)} />
          <div className="flex-1 space-y-2">
            <MediaField
              label={m.kind === "video" ? "Video" : "Image"}
              kind={m.kind === "video" ? "video" : "image"}
              value={m.url || null}
              onChange={(u) => setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, url: u ?? "" } : x)))}
              alt={m.alt}
              onAltChange={(v) => setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, alt: v } : x)))}
            />
            <div className="flex flex-wrap items-center gap-3">
              <Toggle
                label="Visible"
                value={m.visible}
                onChange={(v) => setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, visible: v } : x)))}
              />
              <Btn variant="ghost" onClick={() => save(m)}>
                Save
              </Btn>
              <Btn variant="danger" onClick={() => remove(m)}>
                Remove
              </Btn>
            </div>
          </div>
        </div>
      ))}
      {confirm.node}
    </div>
  );
}

/* ================================ Services ================================ */

export function ServicesPanel({ rows, onChanged }: { rows: Service[]; onChanged: () => void }) {
  const [items, setItems] = useState<Service[]>(rows);
  const [saving, setSaving] = useState(false);
  const confirm = useConfirm();
  useEffect(() => setItems(rows), [rows]);

  const patch = (id: string, p: Partial<Service>) => setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const saveAll = async () => {
    setSaving(true);
    for (const s of items) {
      const { error } = await supabase
        .from("services")
        .update({
          number: s.number,
          title: s.title,
          description: s.description,
          icon: s.icon,
          image_url: s.image_url,
          visible: s.visible,
          status: s.status,
        })
        .eq("id", s.id);
      if (error) {
        toast.error(error.message);
        setSaving(false);
        return;
      }
    }
    await persistOrder("services", items.map((i) => i.id));
    setSaving(false);
    toast.success("Services saved");
    onChanged();
  };

  const add = async () => {
    const { error } = await supabase.from("services").insert({
      number: String(items.length + 1).padStart(2, "0"),
      title: "New service",
      description: "",
      icon: "sparkles",
      visible: true,
      status: "published",
      sort_order: items.length,
    });
    if (error) return toast.error(error.message);
    onChanged();
  };

  const remove = (s: Service) =>
    confirm.ask("Delete service?", `"${s.title}" will be removed from the site.`, async () => {
      const { error } = await supabase.from("services").update({ deleted_at: new Date().toISOString() }).eq("id", s.id);
      if (error) return toast.error(error.message);
      onChanged();
    });

  const move = async (i: number, d: -1 | 1) => {
    const next = moveItem(items, i, i + d);
    setItems(next);
    await persistOrder("services", next.map((x) => x.id));
  };

  return (
    <Panel
      title="Services"
      desc="What you offer. Numbers, titles, descriptions, icons and optional images."
      actions={
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={saveAll} disabled={saving}>
            {saving ? "Saving…" : "Save all"}
          </Btn>
          <Btn onClick={add}>+ New service</Btn>
        </div>
      }
    >
      {items.length === 0 && <Empty>No services yet.</Empty>}
      <div className="space-y-4">
        {items.map((s, i) => (
          <Row
            key={s.id}
            onUp={() => move(i, -1)}
            onDown={() => move(i, 1)}
            badges={
              <>
                <Toggle label="Visible" value={s.visible} onChange={(v) => patch(s.id, { visible: v })} />
                <div className="ml-auto">
                  <Btn variant="danger" onClick={() => remove(s)}>
                    Delete
                  </Btn>
                </div>
              </>
            }
          >
            <Group cols={3}>
              <Text label="Number" value={s.number} onChange={(v) => patch(s.id, { number: v })} />
              <Text label="Title" value={s.title} onChange={(v) => patch(s.id, { title: v })} />
              <Select
                label="Status"
                value={s.status}
                onChange={(v) => patch(s.id, { status: v })}
                options={STATUSES}
              />
            </Group>
            <Group cols={1}>
              <Area label="Description" rows={3} value={s.description} onChange={(v) => patch(s.id, { description: v })} />
            </Group>
            <Group cols={2}>
              <Text label="Icon name (lucide)" value={s.icon} onChange={(v) => patch(s.id, { icon: v })} hint="e.g. sparkles, film, wand-2" />
              <MediaField label="Image" value={s.image_url} onChange={(u) => patch(s.id, { image_url: u })} />
            </Group>
          </Row>
        ))}
      </div>
      {confirm.node}
    </Panel>
  );
}

/* ================================ Testimonials ================================ */

export function TestimonialsPanel({ rows, onChanged }: { rows: Review[]; onChanged: () => void }) {
  const [items, setItems] = useState<Review[]>(rows);
  const [saving, setSaving] = useState(false);
  const confirm = useConfirm();
  useEffect(() => setItems(rows), [rows]);

  const patch = (id: string, p: Partial<Review>) => setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const saveAll = async () => {
    setSaving(true);
    for (const r of items) {
      const { error } = await supabase
        .from("reviews")
        .update({
          name: r.name,
          role: r.role,
          company: r.company,
          quote: r.quote,
          rating: r.rating,
          avatar_url: r.avatar_url,
          visible: r.visible,
          status: r.status,
        })
        .eq("id", r.id);
      if (error) {
        toast.error(error.message);
        setSaving(false);
        return;
      }
    }
    await persistOrder("reviews", items.map((i) => i.id));
    setSaving(false);
    toast.success("Testimonials saved");
    onChanged();
  };

  const add = async () => {
    const { error } = await supabase.from("reviews").insert({
      name: "New reviewer",
      role: "",
      company: "",
      quote: "",
      rating: 5,
      status: "published",
      visible: true,
      sort_order: items.length,
    });
    if (error) return toast.error(error.message);
    onChanged();
  };

  const remove = (r: Review) =>
    confirm.ask("Delete testimonial?", `"${r.name}" will be removed from the site.`, async () => {
      const { error } = await supabase.from("reviews").update({ deleted_at: new Date().toISOString() }).eq("id", r.id);
      if (error) return toast.error(error.message);
      onChanged();
    });

  const move = async (i: number, d: -1 | 1) => {
    const next = moveItem(items, i, i + d);
    setItems(next);
    await persistOrder("reviews", next.map((x) => x.id));
  };

  return (
    <Panel
      title="Testimonials"
      desc="Reviews shown in the horizontally scrolling section."
      actions={
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={saveAll} disabled={saving}>
            {saving ? "Saving…" : "Save all"}
          </Btn>
          <Btn onClick={add}>+ New review</Btn>
        </div>
      }
    >
      {items.length === 0 && <Empty>No testimonials yet.</Empty>}
      <div className="space-y-4">
        {items.map((r, i) => (
          <Row
            key={r.id}
            onUp={() => move(i, -1)}
            onDown={() => move(i, 1)}
            badges={
              <>
                <Toggle label="Visible" value={r.visible} onChange={(v) => patch(r.id, { visible: v })} />
                <div className="ml-auto">
                  <Btn variant="danger" onClick={() => remove(r)}>
                    Delete
                  </Btn>
                </div>
              </>
            }
          >
            <Group cols={3}>
              <Text label="Name" value={r.name} onChange={(v) => patch(r.id, { name: v })} />
              <Text label="Role" value={r.role} onChange={(v) => patch(r.id, { role: v })} />
              <Text label="Company" value={r.company} onChange={(v) => patch(r.id, { company: v })} />
            </Group>
            <Group cols={1}>
              <Area label="Quote" rows={3} value={r.quote} onChange={(v) => patch(r.id, { quote: v })} />
            </Group>
            <Group cols={3}>
              <Num label="Rating (1-5)" min={1} max={5} value={r.rating} onChange={(v) => patch(r.id, { rating: v })} />
              <Select label="Status" value={r.status} onChange={(v) => patch(r.id, { status: v })} options={STATUSES} />
              <MediaField label="Avatar" value={r.avatar_url} onChange={(u) => patch(r.id, { avatar_url: u })} />
            </Group>
          </Row>
        ))}
      </div>
      {confirm.node}
    </Panel>
  );
}

/* ================================ Timeline ================================ */

export function TimelinePanel({ rows, onChanged }: { rows: TimelineRow[]; onChanged: () => void }) {
  const [items, setItems] = useState<TimelineRow[]>(rows);
  const [saving, setSaving] = useState(false);
  const confirm = useConfirm();
  useEffect(() => setItems(rows), [rows]);

  const patch = (id: string, p: Partial<TimelineRow>) =>
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const saveAll = async () => {
    setSaving(true);
    for (const t of items) {
      const { error } = await supabase
        .from("timeline_items")
        .update({ year: t.year, title: t.title, text: t.text, visible: t.visible })
        .eq("id", t.id);
      if (error) {
        toast.error(error.message);
        setSaving(false);
        return;
      }
    }
    await persistOrder("timeline_items", items.map((i) => i.id));
    setSaving(false);
    toast.success("Timeline saved");
    onChanged();
  };

  const add = async () => {
    const { error } = await supabase.from("timeline_items").insert({
      year: String(new Date().getFullYear()),
      title: "New milestone",
      text: "",
      visible: true,
      sort_order: items.length,
    });
    if (error) return toast.error(error.message);
    onChanged();
  };

  const remove = (t: TimelineRow) =>
    confirm.ask("Delete milestone?", `"${t.title}" will be removed from the timeline.`, async () => {
      const { error } = await supabase
        .from("timeline_items")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", t.id);
      if (error) return toast.error(error.message);
      onChanged();
    });

  const move = async (i: number, d: -1 | 1) => {
    const next = moveItem(items, i, i + d);
    setItems(next);
    await persistOrder("timeline_items", next.map((x) => x.id));
  };

  return (
    <Panel
      title="Timeline"
      desc="Career milestones animated on scroll."
      actions={
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={saveAll} disabled={saving}>
            {saving ? "Saving…" : "Save all"}
          </Btn>
          <Btn onClick={add}>+ New milestone</Btn>
        </div>
      }
    >
      {items.length === 0 && <Empty>No milestones yet.</Empty>}
      <div className="space-y-4">
        {items.map((t, i) => (
          <Row
            key={t.id}
            onUp={() => move(i, -1)}
            onDown={() => move(i, 1)}
            badges={
              <>
                <Toggle label="Visible" value={t.visible} onChange={(v) => patch(t.id, { visible: v })} />
                <div className="ml-auto">
                  <Btn variant="danger" onClick={() => remove(t)}>
                    Delete
                  </Btn>
                </div>
              </>
            }
          >
            <Group cols={2}>
              <Text label="Year" value={t.year} onChange={(v) => patch(t.id, { year: v })} />
              <Text label="Title" value={t.title} onChange={(v) => patch(t.id, { title: v })} />
            </Group>
            <Group cols={1}>
              <Area label="Text" rows={2} value={t.text} onChange={(v) => patch(t.id, { text: v })} />
            </Group>
          </Row>
        ))}
      </div>
      {confirm.node}
    </Panel>
  );
}

/* ================================ Media library ================================ */

export function MediaPanel() {
  const [items, setItems] = useState<MediaRow[] | null>(null);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("all");
  const [busy, setBusy] = useState(false);
  const confirm = useConfirm();

  const reload = async () => setItems(await loadMedia());
  useEffect(() => {
    reload();
  }, []);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    for (const f of Array.from(files)) await uploadToLibrary(f);
    setBusy(false);
    toast.success("Upload complete");
    reload();
  };

  const saveRow = async (m: MediaRow) => {
    const { error } = await supabase.from("media").update({ title: m.title, alt: m.alt, url: m.url }).eq("id", m.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    reload();
  };

  const remove = async (m: MediaRow) => {
    const [p, s, r, st] = await Promise.all([
      supabase.from("projects").select("id").or(`cover_url.eq.${m.url},video_url.eq.${m.url}`),
      supabase.from("services").select("id").eq("image_url", m.url),
      supabase.from("reviews").select("id").eq("avatar_url", m.url),
      supabase.from("site_settings").select("id").or(`portrait_url.eq.${m.url},hero_image_url.eq.${m.url}`),
    ]);
    const uses = (p.data?.length ?? 0) + (s.data?.length ?? 0) + (r.data?.length ?? 0) + (st.data?.length ?? 0);
    confirm.ask(
      "Delete asset?",
      uses > 0
        ? `Warning: this asset is used in ${uses} place(s) on the site. Deleting it will leave broken references.`
        : "This asset is not referenced anywhere. It will be removed from the library.",
      async () => {
        if (m.storage_path) await supabase.storage.from("site-assets").remove([m.storage_path]);
        const { error } = await supabase.from("media").update({ deleted_at: new Date().toISOString() }).eq("id", m.id);
        if (error) return toast.error(error.message);
        toast.success("Asset deleted");
        reload();
      },
    );
  };

  if (!items) return <Panel title="Media library"><Skeleton /></Panel>;

  const shown = items.filter(
    (m) =>
      (kind === "all" || m.kind === kind) &&
      (m.title + m.alt + m.tags.join(" ")).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <Panel
      title="Media library"
      desc="Every image, video and file used across the site. Upload, rename, copy URLs and delete safely."
      actions={
        <label className="cursor-pointer px-5 py-2.5 rounded-full bg-foreground text-background font-mono text-[10px] uppercase tracking-[0.25em]">
          {busy ? "Uploading…" : "+ Upload"}
          <input type="file" multiple className="hidden" onChange={(e) => upload(e.target.files)} disabled={busy} />
        </label>
      }
    >
      <div className="grid gap-3 md:grid-cols-[1fr_200px]">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search assets…"
          className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-glow"
        />
        <Select label="" value={kind} onChange={setKind} options={["all", "image", "video", "file"]} />
      </div>
      {shown.length === 0 && <Empty>No assets found.</Empty>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((m) => (
          <div key={m.id} className="rounded-2xl border border-border overflow-hidden bg-background/30">
            <div className="aspect-video bg-muted/10 flex items-center justify-center overflow-hidden">
              {m.kind === "image" ? (
                <img src={m.url} alt={m.alt} className="w-full h-full object-cover" />
              ) : m.kind === "video" ? (
                <video src={m.url} className="w-full h-full object-cover" muted playsInline />
              ) : (
                <span className="font-mono text-[10px] uppercase text-muted-foreground">file</span>
              )}
            </div>
            <div className="p-4 space-y-3">
              <Text
                label="Title"
                value={m.title}
                onChange={(v) => setItems((prev) => prev!.map((x) => (x.id === m.id ? { ...x, title: v } : x)))}
              />
              <Text
                label="Alt text"
                value={m.alt}
                onChange={(v) => setItems((prev) => prev!.map((x) => (x.id === m.id ? { ...x, alt: v } : x)))}
              />
              <div className="flex flex-wrap gap-2">
                <Btn variant="ghost" onClick={() => saveRow(m)}>
                  Save
                </Btn>
                <Btn
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard?.writeText(m.url);
                    toast.success("URL copied");
                  }}
                >
                  Copy URL
                </Btn>
                <Btn variant="danger" onClick={() => remove(m)}>
                  Delete
                </Btn>
              </div>
            </div>
          </div>
        ))}
      </div>
      {confirm.node}
    </Panel>
  );
}
