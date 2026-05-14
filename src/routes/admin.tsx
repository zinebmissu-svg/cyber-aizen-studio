import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteData, type Project, type Review, type SiteSettings, type ServiceItem } from "@/hooks/use-site-data";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Aizen" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [session, setSession] = useState<{ userId: string; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, sess) => {
      if (sess?.user) {
        setSession({ userId: sess.user.id, email: sess.user.email ?? "" });
        const { data } = await supabase.from("user_roles").select("role").eq("user_id", sess.user.id);
        setIsAdmin(!!data?.some((r) => r.role === "admin"));
      } else {
        setSession(null); setIsAdmin(null);
      }
      setAuthReady(true);
    });
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (s?.user) {
        setSession({ userId: s.user.id, email: s.user.email ?? "" });
        const { data } = await supabase.from("user_roles").select("role").eq("user_id", s.user.id);
        setIsAdmin(!!data?.some((r) => r.role === "admin"));
      }
      setAuthReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!authReady) return <Shell><div className="text-muted-foreground">Loading…</div></Shell>;
  if (!session) return <AuthForm />;
  if (isAdmin === false) {
    return (
      <Shell>
        <div className="glass-strong rounded-3xl p-10 text-center">
          <h1 className="text-3xl font-bold text-chrome mb-2">Not authorized</h1>
          <p className="text-muted-foreground mb-6">Your account doesn't have admin access.</p>
          <button onClick={() => supabase.auth.signOut()} className="px-5 py-2 rounded-full bg-foreground text-background font-mono text-xs uppercase tracking-[0.25em]">Sign out</button>
        </div>
      </Shell>
    );
  }
  return <Dashboard email={session.email} />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow">/ Admin</div>
            <h1 className="text-4xl font-bold text-chrome mt-1">Studio Dashboard</h1>
          </div>
          <Link to="/" className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground">← Back to site</Link>
        </div>
        {children}
      </div>
    </div>
  );
}

function AuthForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null); setLoading(true);
    const fn = mode === "signin"
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    const { error } = await fn;
    setLoading(false);
    if (error) setErr(error.message);
  };

  return (
    <Shell>
      <div className="max-w-md mx-auto glass-strong rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-chrome mb-1">{mode === "signin" ? "Sign in" : "Create admin account"}</h2>
        <p className="text-sm text-muted-foreground mb-6">{mode === "signup" ? "First account becomes admin." : "Enter your admin credentials."}</p>
        <form onSubmit={submit} className="space-y-4">
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent border border-border rounded-xl px-4 py-3 outline-none focus:border-primary-glow" />
          <input type="password" required placeholder="Password (min 6 chars)" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent border border-border rounded-xl px-4 py-3 outline-none focus:border-primary-glow" />
          {err && <div className="text-sm text-destructive font-mono">{err}</div>}
          <button disabled={loading} className="w-full py-3 rounded-full bg-foreground text-background font-mono text-xs uppercase tracking-[0.25em] disabled:opacity-60">
            {loading ? "…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>
        <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(null); }} className="mt-4 text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground">
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </Shell>
  );
}

type Tab = "theme" | "content" | "services" | "projects" | "reviews" | "messages";

function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<Tab>("theme");
  const { settings, projects, reviews, refresh } = useSiteData();

  return (
    <Shell>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {(["theme", "content", "services", "projects", "reviews", "messages"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full font-mono text-[10px] uppercase tracking-[0.25em] border transition ${
                tab === t ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"
              }`}>{t}</button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-muted-foreground">{email}</span>
          <button onClick={() => supabase.auth.signOut()} className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground">Sign out</button>
        </div>
      </div>

      {!settings && <div className="text-muted-foreground">Loading settings…</div>}
      {settings && tab === "theme" && <ThemeEditor settings={settings} onSaved={refresh} />}
      {settings && tab === "content" && <ContentEditor settings={settings} onSaved={refresh} />}
      {settings && tab === "services" && <ServicesEditor settings={settings} onSaved={refresh} />}
      {tab === "projects" && <ProjectsEditor projects={projects} onChanged={refresh} />}
      {tab === "reviews" && <ReviewsEditor reviews={reviews} onChanged={refresh} />}
      {tab === "messages" && <MessagesPanel />}
    </Shell>
  );
}

/* ======================== Helpers ======================== */

async function uploadImage(file: File): Promise<string | null> {
  const ext = file.name.split(".").pop() || "png";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("site-assets").upload(path, file, { upsert: false, contentType: file.type });
  if (error) { alert(error.message); return null; }
  const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
  return data.publicUrl;
}

function ImageUpload({ value, onChange, label }: { value: string | null; onChange: (url: string | null) => void; label: string }) {
  const [busy, setBusy] = useState(false);
  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setBusy(true);
    const url = await uploadImage(f);
    setBusy(false);
    if (url) onChange(url);
  };
  return (
    <div className="space-y-2">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
      <div className="flex items-start gap-3">
        {value ? <img src={value} alt="" className="w-20 h-20 rounded-xl object-cover border border-border" /> : <div className="w-20 h-20 rounded-xl border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">none</div>}
        <div className="flex-1 space-y-2">
          <input value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} placeholder="Paste image URL" className="w-full bg-transparent border border-border rounded-xl px-3 py-2 text-sm" />
          <div className="flex items-center gap-2">
            <label className="cursor-pointer text-[10px] font-mono uppercase tracking-[0.25em] px-3 py-2 rounded-full border border-border hover:text-foreground">
              {busy ? "Uploading…" : "Upload file"}
              <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={busy} />
            </label>
            {value && <button type="button" onClick={() => onChange(null)} className="text-[10px] font-mono uppercase tracking-[0.25em] text-destructive">Remove</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  // Accept any CSS color (oklch, hex). Provide a hex picker that converts to direct hex string.
  return (
    <label className="block">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">{label}</div>
      <div className="flex items-center gap-2">
        <input type="color" defaultValue="#9d6bff" onChange={(e) => onChange(e.target.value)} className="h-10 w-12 rounded-lg bg-transparent border border-border cursor-pointer" />
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="oklch(...) or #rrggbb" className="flex-1 bg-transparent border border-border rounded-xl px-3 py-2 text-sm font-mono" />
      </div>
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow">/ {title}</div>
      {children}
    </div>
  );
}

function SaveBar({ saving, msg, onSave }: { saving: boolean; msg: string | null; onSave: () => void }) {
  return (
    <div className="flex items-center gap-4 pt-2">
      <button disabled={saving} onClick={onSave} className="px-6 py-3 rounded-full bg-foreground text-background font-mono text-xs uppercase tracking-[0.25em] disabled:opacity-60">
        {saving ? "Saving…" : "Save changes"}
      </button>
      {msg && <span className="text-sm font-mono text-primary-glow">{msg}</span>}
    </div>
  );
}

function useSettingsForm(settings: SiteSettings, onSaved: () => void) {
  const [s, setS] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => { setS(settings); }, [settings]);
  const save = async () => {
    setSaving(true); setMsg(null);
    const { error } = await supabase.from("site_settings").update(s).eq("id", 1);
    setSaving(false);
    setMsg(error ? error.message : "Saved.");
    if (!error) onSaved();
  };
  return { s, setS, saving, msg, save };
}

/* ======================== Theme tab ======================== */

function ThemeEditor({ settings, onSaved }: { settings: SiteSettings; onSaved: () => void }) {
  const { s, setS, saving, msg, save } = useSettingsForm(settings, onSaved);
  return (
    <div className="glass-strong rounded-3xl p-8 space-y-8">
      <Section title="Colors (live preview)">
        <p className="text-xs text-muted-foreground -mt-2">Use a hex value (e.g. <code className="font-mono">#9d6bff</code>) or an oklch color (e.g. <code className="font-mono">oklch(0.62 0.22 295)</code>).</p>
        <div className="grid md:grid-cols-2 gap-4">
          <ColorField label="Background" value={s.theme_bg} onChange={(v) => setS({ ...s, theme_bg: v })} />
          <ColorField label="Foreground (text)" value={s.theme_foreground} onChange={(v) => setS({ ...s, theme_foreground: v })} />
          <ColorField label="Primary" value={s.theme_primary} onChange={(v) => setS({ ...s, theme_primary: v })} />
          <ColorField label="Primary glow" value={s.theme_primary_glow} onChange={(v) => setS({ ...s, theme_primary_glow: v })} />
          <ColorField label="Cursor color" value={s.cursor_color} onChange={(v) => setS({ ...s, cursor_color: v })} />
        </div>
      </Section>
      <Section title="Brand & images">
        <label className="block">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Brand name (nav + footer)</div>
          <input value={s.brand_name} onChange={(e) => setS({ ...s, brand_name: e.target.value })} className="w-full bg-transparent border border-border rounded-xl px-4 py-3" />
        </label>
        <ImageUpload label="Portrait image (About section)" value={s.portrait_url} onChange={(u) => setS({ ...s, portrait_url: u })} />
        <ImageUpload label="Hero background image (optional)" value={s.hero_image_url} onChange={(u) => setS({ ...s, hero_image_url: u })} />
      </Section>
      <SaveBar saving={saving} msg={msg} onSave={save} />
    </div>
  );
}

/* ======================== Content tab ======================== */

function ContentEditor({ settings, onSaved }: { settings: SiteSettings; onSaved: () => void }) {
  const { s, setS, saving, msg, save } = useSettingsForm(settings, onSaved);
  const F = (k: keyof SiteSettings, label: string, ta = false) => (
    <label className="block">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">{label}</div>
      {ta ? (
        <textarea rows={3} value={String(s[k] ?? "")} onChange={(e) => setS({ ...s, [k]: e.target.value })} className="w-full bg-transparent border border-border rounded-xl px-4 py-3 outline-none focus:border-primary-glow" />
      ) : (
        <input value={String(s[k] ?? "")} onChange={(e) => setS({ ...s, [k]: e.target.value })} className="w-full bg-transparent border border-border rounded-xl px-4 py-3 outline-none focus:border-primary-glow" />
      )}
    </label>
  );
  return (
    <div className="glass-strong rounded-3xl p-8 space-y-8">
      <Section title="Hero">
        <div className="grid md:grid-cols-2 gap-4">
          {F("hero_eyebrow", "Eyebrow")}
          {F("hero_line1", "Line 1")}
          {F("hero_line2", "Line 2 (italic)")}
          {F("hero_line3", "Line 3")}
        </div>
        {F("hero_subtitle", "Subtitle", true)}
        {F("marquee_text", "Marquee text")}
      </Section>
      <Section title="About">
        {F("about_headline", "Headline")}
        {F("about_p1", "Paragraph 1", true)}
        {F("about_p2", "Paragraph 2", true)}
        <div className="grid grid-cols-3 gap-4">
          {F("stat1_n", "Stat 1 #")}{F("stat1_l", "Stat 1 label")}<div />
          {F("stat2_n", "Stat 2 #")}{F("stat2_l", "Stat 2 label")}<div />
          {F("stat3_n", "Stat 3 #")}{F("stat3_l", "Stat 3 label")}<div />
        </div>
      </Section>
      <Section title="Section headlines">
        <div className="grid md:grid-cols-2 gap-4">
          {F("work_headline", "Work headline")}
          {F("services_headline", "Services headline")}
          {F("reviews_headline", "Reviews headline")}
          {F("contact_headline", "Contact headline")}
        </div>
        {F("work_subtitle", "Work subtitle", true)}
      </Section>
      <Section title="Contact & footer">
        <div className="grid md:grid-cols-2 gap-4">
          {F("instagram_handle", "Instagram handle (without @)")}
          {F("contact_email", "Contact email")}
          {F("location_text", "Location")}
          {F("location_sub", "Location sub-line")}
        </div>
        {F("footer_text", "Footer text")}
      </Section>
      <SaveBar saving={saving} msg={msg} onSave={save} />
    </div>
  );
}

/* ======================== Services tab ======================== */

function ServicesEditor({ settings, onSaved }: { settings: SiteSettings; onSaved: () => void }) {
  const [list, setList] = useState<ServiceItem[]>(settings.services_json ?? []);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => { setList(settings.services_json ?? []); }, [settings]);

  const update = (i: number, patch: Partial<ServiceItem>) => setList(list.map((x, j) => j === i ? { ...x, ...patch } : x));
  const remove = (i: number) => setList(list.filter((_, j) => j !== i));
  const add = () => setList([...list, { n: String(list.length + 1).padStart(2, "0"), t: "New service", d: "Description.", icon: "✦" }]);
  const save = async () => {
    setSaving(true); setMsg(null);
    const { error } = await supabase.from("site_settings").update({ services_json: list }).eq("id", 1);
    setSaving(false);
    setMsg(error ? error.message : "Saved.");
    if (!error) onSaved();
  };

  return (
    <div className="glass-strong rounded-3xl p-8 space-y-6">
      <Section title="Services">
        <div className="space-y-4">
          {list.map((it, i) => (
            <div key={i} className="grid md:grid-cols-[80px_80px_1fr_1.5fr_auto] gap-3 items-start p-4 rounded-2xl border border-border">
              <input value={it.n} onChange={(e) => update(i, { n: e.target.value })} placeholder="01" className="bg-transparent border border-border rounded-lg px-2 py-2 font-mono text-sm" />
              <input value={it.icon} onChange={(e) => update(i, { icon: e.target.value })} placeholder="✦" className="bg-transparent border border-border rounded-lg px-2 py-2 text-center" />
              <input value={it.t} onChange={(e) => update(i, { t: e.target.value })} placeholder="Title" className="bg-transparent border border-border rounded-lg px-3 py-2" />
              <textarea rows={2} value={it.d} onChange={(e) => update(i, { d: e.target.value })} placeholder="Description" className="bg-transparent border border-border rounded-lg px-3 py-2" />
              <button onClick={() => remove(i)} className="text-xs font-mono uppercase tracking-[0.25em] text-destructive">Delete</button>
            </div>
          ))}
        </div>
        <button onClick={add} className="px-4 py-2 rounded-full border border-border font-mono text-xs uppercase tracking-[0.25em] hover:text-foreground">+ Add service</button>
      </Section>
      <SaveBar saving={saving} msg={msg} onSave={save} />
    </div>
  );
}

/* ======================== Projects tab ======================== */

const KINDS = ["VFX", "Editing", "3D Motion", "Direction"];
const GRADIENTS = [
  "from-violet-500/40 to-fuchsia-500/10",
  "from-cyan-400/30 to-violet-500/20",
  "from-violet-400/40 to-indigo-500/10",
  "from-fuchsia-500/30 to-violet-700/40",
  "from-indigo-500/30 to-violet-500/20",
  "from-violet-600/40 to-purple-900/30",
];

function ProjectsEditor({ projects, onChanged }: { projects: Project[]; onChanged: () => void }) {
  const blank: Omit<Project, "id"> = { title: "", client: "", kind: "VFX", year: "2025", gradient: GRADIENTS[0], cover_url: "", link_url: "", sort_order: (projects.at(-1)?.sort_order ?? 0) + 1 };
  const [draft, setDraft] = useState<Omit<Project, "id">>(blank);
  const [editing, setEditing] = useState<string | null>(null);

  const startEdit = (p: Project) => { setEditing(p.id); setDraft({ ...p, cover_url: p.cover_url ?? "", link_url: p.link_url ?? "" }); };
  const reset = () => { setEditing(null); setDraft({ ...blank, sort_order: (projects.at(-1)?.sort_order ?? 0) + 1 }); };

  const save = async () => {
    const payload = { ...draft, cover_url: draft.cover_url || null, link_url: draft.link_url || null };
    const { error } = editing
      ? await supabase.from("projects").update(payload).eq("id", editing)
      : await supabase.from("projects").insert(payload);
    if (!error) { reset(); onChanged(); } else alert(error.message);
  };
  const del = async (id: string) => {
    if (!confirm("Delete project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) onChanged();
  };

  return (
    <div className="grid md:grid-cols-[1fr_1.4fr] gap-6">
      <div className="glass-strong rounded-3xl p-6 space-y-3 h-fit">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow">/ {editing ? "Edit project" : "Add project"}</div>
        <input placeholder="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="w-full bg-transparent border border-border rounded-xl px-3 py-2" />
        <input placeholder="Client / category text" value={draft.client} onChange={(e) => setDraft({ ...draft, client: e.target.value })} className="w-full bg-transparent border border-border rounded-xl px-3 py-2" />
        <div className="grid grid-cols-2 gap-2">
          <select value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value })} className="bg-background border border-border rounded-xl px-3 py-2">
            {KINDS.map((k) => <option key={k}>{k}</option>)}
          </select>
          <input placeholder="Year" value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} className="bg-transparent border border-border rounded-xl px-3 py-2" />
        </div>
        <select value={draft.gradient} onChange={(e) => setDraft({ ...draft, gradient: e.target.value })} className="w-full bg-background border border-border rounded-xl px-3 py-2 font-mono text-xs">
          {GRADIENTS.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <ImageUpload label="Cover image" value={draft.cover_url ?? null} onChange={(u) => setDraft({ ...draft, cover_url: u ?? "" })} />
        <input placeholder="Link URL (optional)" value={draft.link_url ?? ""} onChange={(e) => setDraft({ ...draft, link_url: e.target.value })} className="w-full bg-transparent border border-border rounded-xl px-3 py-2" />
        <input type="number" placeholder="Sort order" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} className="w-full bg-transparent border border-border rounded-xl px-3 py-2" />
        <div className="flex gap-2 pt-2">
          <button onClick={save} className="flex-1 py-2 rounded-full bg-foreground text-background font-mono text-xs uppercase tracking-[0.25em]">{editing ? "Update" : "Add"}</button>
          {editing && <button onClick={reset} className="px-4 py-2 rounded-full border border-border font-mono text-xs uppercase tracking-[0.25em]">Cancel</button>}
        </div>
      </div>

      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p.id} className="glass rounded-2xl p-4 flex items-center gap-4">
            <div className={`w-16 h-20 rounded-lg bg-gradient-to-br ${p.gradient} shrink-0 overflow-hidden`}>
              {p.cover_url && <img src={p.cover_url} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-chrome truncate">{p.title}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{p.kind} · {p.year} · {p.client}</div>
            </div>
            <button onClick={() => startEdit(p)} className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground">Edit</button>
            <button onClick={() => del(p.id)} className="text-xs font-mono uppercase tracking-[0.25em] text-destructive">Delete</button>
          </div>
        ))}
        {projects.length === 0 && <div className="text-muted-foreground text-sm">No projects yet.</div>}
      </div>
    </div>
  );
}

/* ======================== Reviews tab ======================== */

function ReviewsEditor({ reviews, onChanged }: { reviews: Review[]; onChanged: () => void }) {
  const blank: Omit<Review, "id"> = { name: "", role: "", quote: "", rating: 5, avatar_url: "", sort_order: (reviews.at(-1)?.sort_order ?? 0) + 1 };
  const [draft, setDraft] = useState<Omit<Review, "id">>(blank);
  const [editing, setEditing] = useState<string | null>(null);

  const startEdit = (r: Review) => { setEditing(r.id); setDraft({ ...r, avatar_url: r.avatar_url ?? "" }); };
  const reset = () => { setEditing(null); setDraft({ ...blank, sort_order: (reviews.at(-1)?.sort_order ?? 0) + 1 }); };

  const save = async () => {
    const payload = { ...draft, avatar_url: draft.avatar_url || null };
    const { error } = editing
      ? await supabase.from("reviews").update(payload).eq("id", editing)
      : await supabase.from("reviews").insert(payload);
    if (!error) { reset(); onChanged(); } else alert(error.message);
  };
  const del = async (id: string) => {
    if (!confirm("Delete review?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (!error) onChanged();
  };

  return (
    <div className="grid md:grid-cols-[1fr_1.4fr] gap-6">
      <div className="glass-strong rounded-3xl p-6 space-y-3 h-fit">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow">/ {editing ? "Edit review" : "Add review"}</div>
        <input placeholder="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="w-full bg-transparent border border-border rounded-xl px-3 py-2" />
        <input placeholder="Role / company" value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} className="w-full bg-transparent border border-border rounded-xl px-3 py-2" />
        <textarea rows={3} placeholder="Quote" value={draft.quote} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} className="w-full bg-transparent border border-border rounded-xl px-3 py-2" />
        <div className="grid grid-cols-2 gap-2">
          <input type="number" min={1} max={5} placeholder="Rating 1-5" value={draft.rating} onChange={(e) => setDraft({ ...draft, rating: Math.max(1, Math.min(5, Number(e.target.value))) })} className="bg-transparent border border-border rounded-xl px-3 py-2" />
          <input type="number" placeholder="Sort order" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} className="bg-transparent border border-border rounded-xl px-3 py-2" />
        </div>
        <ImageUpload label="Avatar" value={draft.avatar_url ?? null} onChange={(u) => setDraft({ ...draft, avatar_url: u ?? "" })} />
        <div className="flex gap-2 pt-2">
          <button onClick={save} className="flex-1 py-2 rounded-full bg-foreground text-background font-mono text-xs uppercase tracking-[0.25em]">{editing ? "Update" : "Add"}</button>
          {editing && <button onClick={reset} className="px-4 py-2 rounded-full border border-border font-mono text-xs uppercase tracking-[0.25em]">Cancel</button>}
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="glass rounded-2xl p-4">
            <div className="flex items-start gap-3">
              {r.avatar_url ? <img src={r.avatar_url} className="w-10 h-10 rounded-full object-cover shrink-0" alt="" /> : <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-chrome">{r.name} <span className="text-primary-glow">{"★".repeat(r.rating)}</span></div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{r.role}</div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{r.quote}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => startEdit(r)} className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground">Edit</button>
                <button onClick={() => del(r.id)} className="text-xs font-mono uppercase tracking-[0.25em] text-destructive">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <div className="text-muted-foreground text-sm">No reviews yet.</div>}
      </div>
    </div>
  );
}

/* ======================== Messages tab ======================== */

type Submission = { id: string; name: string; email: string; message: string; created_at: string };

function MessagesPanel() {
  const [items, setItems] = useState<Submission[]>([]);
  const load = async () => {
    const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    if (data) setItems(data as Submission[]);
  };
  useEffect(() => { load(); }, []);
  const del = async (id: string) => {
    if (!confirm("Delete message?")) return;
    await supabase.from("contact_submissions").delete().eq("id", id);
    load();
  };
  return (
    <div className="space-y-3">
      {items.map((m) => (
        <div key={m.id} className="glass-strong rounded-2xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-bold text-chrome">{m.name} <span className="text-muted-foreground font-normal">— {m.email}</span></div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div>
            </div>
            <button onClick={() => del(m.id)} className="text-xs font-mono uppercase tracking-[0.25em] text-destructive">Delete</button>
          </div>
          <p className="mt-3 text-foreground/85 whitespace-pre-line">{m.message}</p>
        </div>
      ))}
      {items.length === 0 && <div className="text-muted-foreground text-sm">No messages yet.</div>}
    </div>
  );
}
