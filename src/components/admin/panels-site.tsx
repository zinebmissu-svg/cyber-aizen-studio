import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { NavItem, SectionRow, SiteData, SiteSettings } from "@/hooks/use-site-data";
import {
  Area,
  Btn,
  ColorField,
  Empty,
  Group,
  MediaField,
  Num,
  OrderButtons,
  Panel,
  SaveBar,
  Select,
  Text,
  Toggle,
  moveItem,
  persistOrder,
  useConfirm,
} from "./kit";

/* ============================== settings form hook ============================== */

function useSettingsForm(settings: SiteSettings, onSaved: () => void) {
  const [s, setS] = useState(settings);
  const [saving, setSaving] = useState(false);
  useEffect(() => setS(settings), [settings]);
  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => setS((p) => ({ ...p, [k]: v }));
  const save = async () => {
    setSaving(true);
    const { id, updated_at, ...rest } = s as SiteSettings & { updated_at: string };
    void id;
    void updated_at;
    const { error } = await supabase
      .from("site_settings")
      .update(rest as never)
      .eq("id", 1);
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Saved — live on the website");
      onSaved();
    }
  };
  const saveDraft = async () => {
    const { error } = await supabase
      .from("site_settings")
      .update({ draft_json: s as never })
      .eq("id", 1);
    if (error) toast.error(error.message);
    else toast.success("Draft saved (not published)");
  };
  const restoreDraft = () => {
    const d = settings.draft_json as unknown as SiteSettings | null;
    if (!d) return toast.info("No draft stored");
    setS({ ...d, id: 1 });
    toast.success("Draft loaded into the editor");
  };
  return { s, set, saving, save, saveDraft, restoreDraft };
}

function DraftBar(p: { saving: boolean; save: () => void; saveDraft: () => void; restoreDraft: () => void }) {
  return (
    <SaveBar saving={p.saving} onSave={p.save}>
      <Btn variant="ghost" onClick={p.saveDraft}>
        Save as draft
      </Btn>
      <Btn variant="ghost" onClick={p.restoreDraft}>
        Load draft
      </Btn>
    </SaveBar>
  );
}

/* ============================== Overview ============================== */

export function OverviewPanel({ data, go }: { data: SiteData; go: (t: string) => void }) {
  const [messages, setMessages] = useState(0);
  useEffect(() => {
    supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => setMessages(count ?? 0));
  }, []);
  const stats = [
    { n: data.projects.length, l: "Projects", t: "portfolio" },
    { n: data.services.length, l: "Services", t: "services" },
    { n: data.reviews.length, l: "Testimonials", t: "testimonials" },
    { n: data.timeline.length, l: "Timeline items", t: "timeline" },
    { n: data.nav.length, l: "Nav links", t: "navigation" },
    { n: messages, l: "Messages", t: "messages" },
  ];
  return (
    <Panel title="Overview" desc="Everything on the public website is managed from here. Changes are live the moment you save.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <button key={s.l} onClick={() => go(s.t)} className="text-left glass rounded-2xl p-5 hover:border-primary-glow/50 border border-transparent transition-colors">
            <div className="text-4xl font-bold text-violet-glow">{s.n}</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-2">{s.l}</div>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <Btn onClick={() => go("homepage")}>Edit homepage text</Btn>
        <Btn variant="ghost" onClick={() => go("theme")}>
          Theme & design
        </Btn>
        <Btn variant="ghost" onClick={() => go("media")}>
          Media library
        </Btn>
      </div>
    </Panel>
  );
}

/* ============================== Homepage content ============================== */

export function HomepagePanel({ settings, onSaved }: { settings: SiteSettings; onSaved: () => void }) {
  const f = useSettingsForm(settings, onSaved);
  const { s, set } = f;
  return (
    <div className="space-y-6">
      <Panel title="Hero" desc="The first screen visitors see.">
        <Group cols={2}>
          <Text label="Eyebrow badge" value={s.hero_eyebrow} onChange={(v) => set("hero_eyebrow", v)} />
          <Text label="Marquee text" value={s.marquee_text} onChange={(v) => set("marquee_text", v)} />
          <Text label="Headline line 1" value={s.hero_line1} onChange={(v) => set("hero_line1", v)} />
          <Text label="Headline line 2 (italic)" value={s.hero_line2} onChange={(v) => set("hero_line2", v)} />
          <Text label="Headline line 3" value={s.hero_line3} onChange={(v) => set("hero_line3", v)} />
          <Text label="Primary button label" value={s.hero_cta1_label} onChange={(v) => set("hero_cta1_label", v)} />
          <Text label="Secondary button label" value={s.hero_cta2_label} onChange={(v) => set("hero_cta2_label", v)} />
          <Text label="Nav CTA label" value={s.nav_cta_label} onChange={(v) => set("nav_cta_label", v)} />
        </Group>
        <Area label="Hero subtitle" value={s.hero_subtitle} onChange={(v) => set("hero_subtitle", v)} />
        <MediaField label="Hero background image (optional)" value={s.hero_image_url} onChange={(u) => set("hero_image_url", u)} />
      </Panel>

      <Panel title="About" desc="Portrait, story and statistics.">
        <Text label="Headline" value={s.about_headline} onChange={(v) => set("about_headline", v)} />
        <Area label="Paragraph 1" value={s.about_p1} onChange={(v) => set("about_p1", v)} />
        <Area label="Paragraph 2" value={s.about_p2} onChange={(v) => set("about_p2", v)} />
        <MediaField label="Portrait image" value={s.portrait_url} onChange={(u) => set("portrait_url", u)} />
        <Group label="Statistics" cols={3}>
          <Text label="Stat 1 value" value={s.stat1_n} onChange={(v) => set("stat1_n", v)} />
          <Text label="Stat 2 value" value={s.stat2_n} onChange={(v) => set("stat2_n", v)} />
          <Text label="Stat 3 value" value={s.stat3_n} onChange={(v) => set("stat3_n", v)} />
          <Text label="Stat 1 label" value={s.stat1_l} onChange={(v) => set("stat1_l", v)} />
          <Text label="Stat 2 label" value={s.stat2_l} onChange={(v) => set("stat2_l", v)} />
          <Text label="Stat 3 label" value={s.stat3_l} onChange={(v) => set("stat3_l", v)} />
        </Group>
      </Panel>

      <Panel title="Section headlines">
        <Group cols={2}>
          <Text label="Timeline headline" value={s.timeline_headline} onChange={(v) => set("timeline_headline", v)} />
          <Text label="Portfolio headline" value={s.work_headline} onChange={(v) => set("work_headline", v)} />
          <Text label="Services headline" value={s.services_headline} onChange={(v) => set("services_headline", v)} />
          <Text label="Testimonials headline" value={s.reviews_headline} onChange={(v) => set("reviews_headline", v)} />
          <Text label="Contact headline" value={s.contact_headline} onChange={(v) => set("contact_headline", v)} />
          <Text label="Contact form button" value={s.contact_form_button} onChange={(v) => set("contact_form_button", v)} />
        </Group>
        <Area label="Portfolio subtitle" value={s.work_subtitle} onChange={(v) => set("work_subtitle", v)} rows={3} />
      </Panel>

      <Panel title="Contact, socials & footer">
        <Group cols={2}>
          <Text label="Brand name" value={s.brand_name} onChange={(v) => set("brand_name", v)} />
          <Text label="Contact email" value={s.contact_email} onChange={(v) => set("contact_email", v)} />
          <Text label="Instagram handle" value={s.instagram_handle} onChange={(v) => set("instagram_handle", v)} hint="Without the @" />
          <Text label="WhatsApp number" value={s.whatsapp_number} onChange={(v) => set("whatsapp_number", v)} />
          <Text label="Location" value={s.location_text} onChange={(v) => set("location_text", v)} />
          <Text label="Location sub-line" value={s.location_sub} onChange={(v) => set("location_sub", v)} />
          <Text label="Footer text" value={s.footer_text} onChange={(v) => set("footer_text", v)} />
        </Group>
      </Panel>

      <div className="glass-strong rounded-3xl p-6">
        <DraftBar {...f} />
      </div>
    </div>
  );
}

/* ============================== Theme ============================== */

const FONTS = [
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
  "'Space Grotesk', sans-serif",
  "'Syne', sans-serif",
  "'Archivo', sans-serif",
  "Georgia, 'Times New Roman', serif",
  "'JetBrains Mono', monospace",
];

export function ThemePanel({ settings, onSaved }: { settings: SiteSettings; onSaved: () => void }) {
  const f = useSettingsForm(settings, onSaved);
  const { s, set } = f;
  return (
    <div className="space-y-6">
      <Panel title="Colors" desc="Hex (#9d6bff) or oklch(0.62 0.22 295). Applied globally, live.">
        <Group cols={3}>
          <ColorField label="Background" value={s.theme_bg} onChange={(v) => set("theme_bg", v)} />
          <ColorField label="Text" value={s.theme_foreground} onChange={(v) => set("theme_foreground", v)} />
          <ColorField label="Heading" value={s.theme_heading} onChange={(v) => set("theme_heading", v)} />
          <ColorField label="Primary" value={s.theme_primary} onChange={(v) => set("theme_primary", v)} />
          <ColorField label="Primary glow" value={s.theme_primary_glow} onChange={(v) => set("theme_primary_glow", v)} />
          <ColorField label="Secondary" value={s.theme_secondary} onChange={(v) => set("theme_secondary", v)} />
          <ColorField label="Accent" value={s.theme_accent} onChange={(v) => set("theme_accent", v)} />
          <ColorField label="Muted text" value={s.theme_muted} onChange={(v) => set("theme_muted", v)} />
          <ColorField label="Borders" value={s.theme_border} onChange={(v) => set("theme_border", v)} />
          <ColorField label="Button background" value={s.theme_button_bg} onChange={(v) => set("theme_button_bg", v)} />
          <ColorField label="Button text" value={s.theme_button_fg} onChange={(v) => set("theme_button_fg", v)} />
          <ColorField label="Hover" value={s.theme_hover} onChange={(v) => set("theme_hover", v)} />
          <ColorField label="Gradient from" value={s.theme_gradient_from} onChange={(v) => set("theme_gradient_from", v)} />
          <ColorField label="Gradient to" value={s.theme_gradient_to} onChange={(v) => set("theme_gradient_to", v)} />
          <ColorField label="Cursor" value={s.cursor_color} onChange={(v) => set("cursor_color", v)} />
        </Group>
      </Panel>

      <Panel title="Typography & shape">
        <Group cols={2}>
          <Select label="Display font" value={s.font_display} onChange={(v) => set("font_display", v)} options={[s.font_display, ...FONTS.filter((x) => x !== s.font_display)]} />
          <Select label="Body font" value={s.font_body} onChange={(v) => set("font_body", v)} options={[s.font_body, ...FONTS.filter((x) => x !== s.font_body)]} />
          <Text label="Base font size" value={s.base_font_size} onChange={(v) => set("base_font_size", v)} hint="e.g. 16px" />
          <Text label="Border radius" value={s.radius} onChange={(v) => set("radius", v)} hint="e.g. 1rem" />
          <Select label="Shadow strength" value={s.shadow_strength} onChange={(v) => set("shadow_strength", v)} options={["none", "soft", "medium", "strong"]} />
        </Group>
        <div className="flex flex-wrap gap-6 pt-2">
          <Toggle label="Animations enabled" value={s.animations_enabled} onChange={(v) => set("animations_enabled", v)} />
          <Toggle label="Custom cursor enabled" value={s.cursor_enabled} onChange={(v) => set("cursor_enabled", v)} />
        </div>
      </Panel>

      <div className="glass-strong rounded-3xl p-6">
        <DraftBar {...f} />
      </div>
    </div>
  );
}

/* ============================== SEO ============================== */

export function SeoPanel({ settings, onSaved }: { settings: SiteSettings; onSaved: () => void }) {
  const f = useSettingsForm(settings, onSaved);
  const { s, set } = f;
  return (
    <Panel title="SEO & sharing" desc="Title, description and social preview image used across the site.">
      <Text label="SEO title" value={s.seo_title} onChange={(v) => set("seo_title", v)} hint={`${s.seo_title.length}/60 characters`} />
      <Area label="Meta description" value={s.seo_description} onChange={(v) => set("seo_description", v)} rows={3} hint={`${s.seo_description.length}/160 characters`} />
      <MediaField label="Social share image (og:image)" value={s.seo_og_image} onChange={(u) => set("seo_og_image", u)} />
      <DraftBar {...f} />
    </Panel>
  );
}

/* ============================== Sections ============================== */

export function SectionsPanel({ rows, onChanged }: { rows: SectionRow[]; onChanged: () => void }) {
  const [list, setList] = useState(rows);
  useEffect(() => setList(rows), [rows]);
  const confirm = useConfirm();

  const move = async (i: number, dir: -1 | 1) => {
    const next = moveItem(list, i, i + dir);
    setList(next);
    await persistOrder("sections", next.map((x) => x.id));
    onChanged();
  };
  const toggle = async (r: SectionRow) => {
    const { error } = await supabase.from("sections").update({ visible: !r.visible }).eq("id", r.id);
    if (error) toast.error(error.message);
    else {
      toast.success(`${r.label} ${r.visible ? "hidden" : "visible"}`);
      onChanged();
    }
  };
  const rename = async (r: SectionRow, label: string) => {
    setList(list.map((x) => (x.id === r.id ? { ...x, label } : x)));
    await supabase.from("sections").update({ label }).eq("id", r.id);
  };
  const remove = (r: SectionRow) =>
    confirm.ask("Remove section?", `"${r.label}" will no longer render on the website. Content is kept and you can add it back.`, async () => {
      const { error } = await supabase.from("sections").delete().eq("id", r.id);
      if (error) toast.error(error.message);
      else {
        toast.success("Section removed");
        onChanged();
      }
    });
  const addBack = async (key: string, label: string) => {
    const { error } = await supabase.from("sections").insert({ key, label, sort_order: list.length, visible: true });
    if (error) toast.error(error.message);
    else onChanged();
  };

  const KNOWN: Record<string, string> = {
    hero: "Hero",
    marquee: "Marquee",
    about: "About",
    timeline: "Timeline",
    work: "Portfolio",
    services: "Services",
    reviews: "Testimonials",
    contact: "Contact",
  };
  const missing = Object.entries(KNOWN).filter(([k]) => !list.some((x) => x.key === k));

  return (
    <Panel title="Sections" desc="Reorder, rename or hide any section of the homepage. Order here is the order on the site.">
      <div className="space-y-3">
        {list.map((r, i) => (
          <div key={r.id} className="glass rounded-2xl p-4 flex items-center gap-4">
            <OrderButtons onUp={() => move(i, -1)} onDown={() => move(i, 1)} />
            <div className="flex-1 min-w-0 space-y-1">
              <input
                value={r.label}
                onChange={(e) => rename(r, e.target.value)}
                className="w-full bg-transparent border border-transparent hover:border-border focus:border-primary-glow rounded-lg px-2 py-1 font-bold text-chrome outline-none"
              />
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground px-2">#{r.key}</div>
            </div>
            <Toggle label={r.visible ? "Visible" : "Hidden"} value={r.visible} onChange={() => toggle(r)} />
            <Btn variant="danger" onClick={() => remove(r)}>
              Remove
            </Btn>
          </div>
        ))}
        {list.length === 0 && <Empty>No sections. Add one below.</Empty>}
      </div>
      {missing.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Add section:</span>
          {missing.map(([k, l]) => (
            <Btn key={k} variant="ghost" onClick={() => addBack(k, l)}>
              + {l}
            </Btn>
          ))}
        </div>
      )}
      {confirm.node}
    </Panel>
  );
}

/* ============================== Navigation ============================== */

export function NavigationPanel({ rows, onChanged }: { rows: NavItem[]; onChanged: () => void }) {
  const [list, setList] = useState(rows);
  useEffect(() => setList(rows), [rows]);
  const confirm = useConfirm();

  const patch = (id: string, p: Partial<NavItem>) => setList(list.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const saveRow = async (r: NavItem) => {
    const { error } = await supabase
      .from("nav_items")
      .update({ label: r.label, target: r.target, link_type: r.link_type, visible: r.visible })
      .eq("id", r.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Nav item saved");
      onChanged();
    }
  };
  const move = async (i: number, dir: -1 | 1) => {
    const next = moveItem(list, i, i + dir);
    setList(next);
    await persistOrder("nav_items", next.map((x) => x.id));
    onChanged();
  };
  const add = async () => {
    const { error } = await supabase.from("nav_items").insert({ label: "New link", target: "home", link_type: "section", sort_order: list.length });
    if (error) toast.error(error.message);
    else onChanged();
  };
  const remove = (r: NavItem) =>
    confirm.ask("Delete navigation item?", `"${r.label}" will be removed from the header.`, async () => {
      const { error } = await supabase.from("nav_items").delete().eq("id", r.id);
      if (error) toast.error(error.message);
      else {
        toast.success("Deleted");
        onChanged();
      }
    });

  return (
    <Panel
      title="Navigation"
      desc="Header links. Section links scroll to a section on the homepage; URL links can point anywhere."
      actions={<Btn onClick={add}>+ Add link</Btn>}
    >
      <div className="space-y-3">
        {list.map((r, i) => (
          <div key={r.id} className="glass rounded-2xl p-4 flex flex-wrap items-end gap-3">
            <OrderButtons onUp={() => move(i, -1)} onDown={() => move(i, 1)} />
            <div className="w-40">
              <Text label="Label" value={r.label} onChange={(v) => patch(r.id, { label: v })} />
            </div>
            <div className="w-40">
              <Select label="Type" value={r.link_type} onChange={(v) => patch(r.id, { link_type: v })} options={["section", "url", "route"]} />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Text label="Target" value={r.target} onChange={(v) => patch(r.id, { target: v })} hint={r.link_type === "section" ? "Section id, e.g. work" : "https://…"} />
            </div>
            <Toggle label={r.visible ? "Visible" : "Hidden"} value={r.visible} onChange={(v) => patch(r.id, { visible: v })} />
            <Btn onClick={() => saveRow(r)}>Save</Btn>
            <Btn variant="danger" onClick={() => remove(r)}>
              Delete
            </Btn>
          </div>
        ))}
        {list.length === 0 && <Empty>No navigation items yet.</Empty>}
      </div>
      {confirm.node}
    </Panel>
  );
}

/* ============================== Messages ============================== */

type Submission = { id: string; name: string; email: string; message: string; created_at: string };

export function MessagesPanel() {
  const [items, setItems] = useState<Submission[]>([]);
  const [q, setQ] = useState("");
  const confirm = useConfirm();
  const load = async () => {
    const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data ?? []) as Submission[]);
  };
  useEffect(() => {
    load();
  }, []);
  const filtered = items.filter((m) => (m.name + m.email + m.message).toLowerCase().includes(q.toLowerCase()));
  return (
    <Panel title="Messages" desc="Submissions from the contact form.">
      <Text label="Search" value={q} onChange={setQ} placeholder="Name, email or content" />
      <div className="space-y-3">
        {filtered.map((m) => (
          <div key={m.id} className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-bold text-chrome">
                  {m.name} <span className="font-normal text-muted-foreground">— {m.email}</span>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div>
              </div>
              <Btn
                variant="danger"
                onClick={() =>
                  confirm.ask("Delete message?", "This cannot be undone.", async () => {
                    await supabase.from("contact_submissions").delete().eq("id", m.id);
                    toast.success("Deleted");
                    load();
                  })
                }
              >
                Delete
              </Btn>
            </div>
            <p className="mt-3 whitespace-pre-line text-foreground/85">{m.message}</p>
          </div>
        ))}
        {filtered.length === 0 && <Empty>No messages yet.</Empty>}
      </div>
      {confirm.node}
    </Panel>
  );
}

/* ============================== Settings ============================== */

export function SettingsPanel({ email, settings, onSaved }: { email: string; settings: SiteSettings; onSaved: () => void }) {
  const f = useSettingsForm(settings, onSaved);
  const { s, set } = f;
  return (
    <div className="space-y-6">
      <Panel title="Account">
        <p className="text-sm text-muted-foreground">
          Signed in as <span className="text-foreground font-mono">{email}</span> with admin access.
        </p>
        <Btn variant="ghost" onClick={() => supabase.auth.signOut()}>
          Sign out
        </Btn>
      </Panel>
      <Panel title="Site identity">
        <Group cols={2}>
          <Text label="Brand name" value={s.brand_name} onChange={(v) => set("brand_name", v)} />
          <Text label="Footer text" value={s.footer_text} onChange={(v) => set("footer_text", v)} />
        </Group>
        <Num label="Draft stored" value={s.draft_json ? 1 : 0} onChange={() => {}} />
        <DraftBar {...f} />
      </Panel>
    </div>
  );
}
