import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteData, type Project, type Review, type SiteSettings } from "@/hooks/use-site-data";

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
        setSession(null);
        setIsAdmin(null);
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
    setErr(null);
    setLoading(true);
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
        <p className="text-sm text-muted-foreground mb-6">
          {mode === "signup" ? "First account becomes admin." : "Enter your admin credentials."}
        </p>
        <form onSubmit={submit} className="space-y-4">
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-border rounded-xl px-4 py-3 outline-none focus:border-primary-glow" />
          <input type="password" required placeholder="Password (min 6 chars)" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border border-border rounded-xl px-4 py-3 outline-none focus:border-primary-glow" />
          {err && <div className="text-sm text-destructive font-mono">{err}</div>}
          <button disabled={loading} className="w-full py-3 rounded-full bg-foreground text-background font-mono text-xs uppercase tracking-[0.25em] disabled:opacity-60">
            {loading ? "…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>
        <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(null); }}
          className="mt-4 text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground">
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </Shell>
  );
}

type Tab = "settings" | "projects" | "reviews" | "messages";

function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<Tab>("settings");
  const { settings, projects, reviews, refresh } = useSiteData();

  return (
    <Shell>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {(["settings", "projects", "reviews", "messages"] as Tab[]).map((t) => (
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

      {tab === "settings" && settings && <SettingsEditor settings={settings} onSaved={refresh} />}
      {tab === "projects" && <ProjectsEditor projects={projects} onChanged={refresh} />}
      {tab === "reviews" && <ReviewsEditor reviews={reviews} onChanged={refresh} />}
      {tab === "messages" && <MessagesPanel />}
    </Shell>
  );
}

function SettingsEditor({ settings, onSaved }: { settings: SiteSettings; onSaved: () => void }) {
  const [s, setS] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const save = async () => {
    setSaving(true); setMsg(null);
    const { error } = await supabase.from("site_settings").update(s).eq("id", 1);
    setSaving(false);
    setMsg(error ? error.message : "Saved.");
    if (!error) onSaved();
  };

  const F = ({ k, label, ta }: { k: keyof SiteSettings; label: string; ta?: boolean }) => (
    <label className="block">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">{label}</div>
      {ta ? (
        <textarea rows={3} value={String(s[k] ?? "")} onChange={(e) => setS({ ...s, [k]: e.target.value })}
          className="w-full bg-transparent border border-border rounded-xl px-4 py-3 outline-none focus:border-primary-glow" />
      ) : (
        <input value={String(s[k] ?? "")} onChange={(e) => setS({ ...s, [k]: e.target.value })}
          className="w-full bg-transparent border border-border rounded-xl px-4 py-3 outline-none focus:border-primary-glow" />
      )}
    </label>
  );

  return (
    <div className="glass-strong rounded-3xl p-8 space-y-8">
      <Section title="Hero">
        <div className="grid md:grid-cols-2 gap-4">
          <F k="hero_eyebrow" label="Eyebrow" />
          <F k="hero_line1" label="Line 1" />
          <F k="hero_line2" label="Line 2 (italic)" />
          <F k="hero_line3" label="Line 3" />
        </div>
        <F k="hero_subtitle" label="Subtitle" ta />
      </Section>
      <Section title="About">
        <F k="about_headline" label="Headline" />
        <F k="about_p1" label="Paragraph 1" ta />
        <F k="about_p2" label="Paragraph 2" ta />
        <div className="grid grid-cols-3 gap-4">
          <F k="stat1_n" label="Stat 1 #" /><F k="stat1_l" label="Stat 1 label" />
          <div />
          <F k="stat2_n" label="Stat 2 #" /><F k="stat2_l" label="Stat 2 label" />
          <div />
          <F k="stat3_n" label="Stat 3 #" /><F k="stat3_l" label="Stat 3 label" />
        </div>
      </Section>
      <Section title="Contact">
        <div className="grid md:grid-cols-2 gap-4">
          <F k="instagram_handle" label="Instagram handle (without @)" />
          <F k="contact_email" label="Contact email" />
        </div>
      </Section>
      <div className="flex items-center gap-4">
        <button disabled={saving} onClick={save} className="px-6 py-3 rounded-full bg-foreground text-background font-mono text-xs uppercase tracking-[0.25em] disabled:opacity-60">
          {saving ? "Saving…" : "Save changes"}
        </button>
        {msg && <span className="text-sm font-mono text-primary-glow">{msg}</span>}
      </div>
    </div>
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
  const [draft, setDraft] = useState(blank);
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
        <input placeholder="Cover image URL (optional)" value={draft.cover_url ?? ""} onChange={(e) => setDraft({ ...draft, cover_url: e.target.value })} className="w-full bg-transparent border border-border rounded-xl px-3 py-2" />
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

function ReviewsEditor({ reviews, onChanged }: { reviews: Review[]; onChanged: () => void }) {
  const blank: Omit<Review, "id"> = { name: "", role: "", quote: "", rating: 5, avatar_url: "", sort_order: (reviews.at(-1)?.sort_order ?? 0) + 1 };
  const [draft, setDraft] = useState(blank);
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
        <input placeholder="Avatar URL (optional)" value={draft.avatar_url ?? ""} onChange={(e) => setDraft({ ...draft, avatar_url: e.target.value })} className="w-full bg-transparent border border-border rounded-xl px-3 py-2" />
        <div className="flex gap-2 pt-2">
          <button onClick={save} className="flex-1 py-2 rounded-full bg-foreground text-background font-mono text-xs uppercase tracking-[0.25em]">{editing ? "Update" : "Add"}</button>
          {editing && <button onClick={reset} className="px-4 py-2 rounded-full border border-border font-mono text-xs uppercase tracking-[0.25em]">Cancel</button>}
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="glass rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shrink-0" />
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
