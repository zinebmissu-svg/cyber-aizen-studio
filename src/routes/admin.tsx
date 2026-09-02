import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteData } from "@/hooks/use-site-data";
import { Skeleton } from "@/components/admin/kit";
import {
  OverviewPanel,
  HomepagePanel,
  ThemePanel,
  SeoPanel,
  SectionsPanel,
  NavigationPanel,
  MessagesPanel,
  SettingsPanel,
} from "@/components/admin/panels-site";
import {
  PortfolioPanel,
  ServicesPanel,
  TestimonialsPanel,
  TimelinePanel,
  MediaPanel,
} from "@/components/admin/panels-collections";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Aizen" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

/* ================================ Auth gate ================================ */

function AdminPage() {
  const [session, setSession] = useState<{ userId: string; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const check = async (user: { id: string; email?: string } | undefined) => {
      if (!user) {
        setSession(null);
        setIsAdmin(null);
        setAuthReady(true);
        return;
      }
      setSession({ userId: user.id, email: user.email ?? "" });
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      setIsAdmin(!!data?.some((r) => r.role === "admin"));
      setAuthReady(true);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, sess) => {
      void check(sess?.user);
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => void check(s?.user));
    return () => subscription.unsubscribe();
  }, []);

  if (!authReady)
    return (
      <Centered>
        <div className="text-muted-foreground font-mono text-xs uppercase tracking-[0.3em]">Loading dashboard…</div>
      </Centered>
    );
  if (!session) return <AuthForm />;
  if (isAdmin === false)
    return (
      <Centered>
        <div className="glass-strong rounded-3xl p-10 text-center max-w-md">
          <h1 className="text-3xl font-bold text-chrome mb-2">Not authorized</h1>
          <p className="text-muted-foreground mb-6">This account doesn't have admin access.</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="px-5 py-2.5 rounded-full bg-foreground text-background font-mono text-[10px] uppercase tracking-[0.25em]"
          >
            Sign out
          </button>
        </div>
      </Centered>
    );
  return <Dashboard email={session.email} />;
}

function Centered({ children }: { children: ReactNode }) {
  return <div className="min-h-screen flex items-center justify-center px-6">{children}</div>;
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
    const { error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });
    setLoading(false);
    if (error) setErr(error.message);
  };

  return (
    <Centered>
      <div className="w-full max-w-md glass-strong rounded-3xl p-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary-glow mb-2">/ Aizen CMS</div>
        <h1 className="text-2xl font-bold text-chrome mb-1">{mode === "signin" ? "Sign in" : "Create admin account"}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {mode === "signup" ? "The first account becomes admin." : "Enter your admin credentials."}
        </p>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-glow"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-glow"
          />
          {err && <div className="text-sm text-destructive font-mono">{err}</div>}
          <button
            disabled={loading}
            className="w-full py-3 rounded-full bg-foreground text-background font-mono text-[10px] uppercase tracking-[0.25em] disabled:opacity-60"
          >
            {loading ? "…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>
        <button
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setErr(null);
          }}
          className="mt-4 text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
        <Link
          to="/"
          className="block mt-6 text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
        >
          ← Back to site
        </Link>
      </div>
    </Centered>
  );
}

/* ================================ Shell ================================ */

const NAV: { group: string; items: { key: string; label: string }[] }[] = [
  { group: "Dashboard", items: [{ key: "overview", label: "Overview" }] },
  {
    group: "Website",
    items: [
      { key: "homepage", label: "Homepage & text" },
      { key: "sections", label: "Sections" },
      { key: "navigation", label: "Navigation" },
      { key: "timeline", label: "Timeline" },
    ],
  },
  {
    group: "Content",
    items: [
      { key: "portfolio", label: "Portfolio" },
      { key: "services", label: "Services" },
      { key: "testimonials", label: "Testimonials" },
      { key: "media", label: "Media library" },
    ],
  },
  {
    group: "Configuration",
    items: [
      { key: "theme", label: "Theme / design" },
      { key: "seo", label: "SEO" },
      { key: "messages", label: "Messages" },
      { key: "settings", label: "Settings" },
    ],
  },
];

function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState("overview");
  const [menu, setMenu] = useState(false);
  const data = useSiteData({ admin: true });
  const { settings, projects, projectMedia, reviews, services, nav, sections, timeline, loading, refresh } = data;

  const go = (t: string) => {
    setTab(t);
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const body = () => {
    if (loading || !settings) return <Skeleton />;
    switch (tab) {
      case "overview":
        return <OverviewPanel data={data} go={go} />;
      case "homepage":
        return <HomepagePanel settings={settings} onSaved={refresh} />;
      case "sections":
        return <SectionsPanel rows={sections} onChanged={refresh} />;
      case "navigation":
        return <NavigationPanel rows={nav} onChanged={refresh} />;
      case "timeline":
        return <TimelinePanel rows={timeline} onChanged={refresh} />;
      case "portfolio":
        return <PortfolioPanel rows={projects} media={projectMedia} onChanged={refresh} />;
      case "services":
        return <ServicesPanel rows={services} onChanged={refresh} />;
      case "testimonials":
        return <TestimonialsPanel rows={reviews} onChanged={refresh} />;
      case "media":
        return <MediaPanel />;
      case "theme":
        return <ThemePanel settings={settings} onSaved={refresh} />;
      case "seo":
        return <SeoPanel settings={settings} onSaved={refresh} />;
      case "messages":
        return <MessagesPanel />;
      case "settings":
        return <SettingsPanel email={email} settings={settings} onSaved={refresh} />;
      default:
        return null;
    }
  };

  const sidebar = (
    <nav className="space-y-6">
      {NAV.map((g) => (
        <div key={g.group}>
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/70 mb-2 px-3">
            {g.group}
          </div>
          <div className="space-y-1">
            {g.items.map((it) => (
              <button
                key={it.key}
                onClick={() => go(it.key)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                  tab === it.key
                    ? "bg-primary/15 text-foreground border border-primary-glow/40"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/10 border border-transparent"
                }`}
              >
                {it.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* top bar */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="mx-auto max-w-[1500px] px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMenu((m) => !m)}
              className="lg:hidden w-9 h-9 rounded-xl border border-border text-sm"
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <div className="min-w-0">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-primary-glow">/ Aizen CMS</div>
              <div className="font-bold text-chrome truncate">Studio Dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground truncate max-w-[200px]">
              {email}
            </span>
            <Link
              to="/"
              className="px-4 py-2 rounded-full border border-border font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
            >
              View site
            </Link>
            <button
              onClick={() => supabase.auth.signOut()}
              className="px-4 py-2 rounded-full bg-foreground text-background font-mono text-[10px] uppercase tracking-[0.25em]"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-4 md:px-8 py-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className={`${menu ? "block" : "hidden"} lg:block lg:sticky lg:top-24 lg:self-start`}>{sidebar}</aside>
        <main className="min-w-0 space-y-8">{body()}</main>
      </div>
    </div>
  );
}
