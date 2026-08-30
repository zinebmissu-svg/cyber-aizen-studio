import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];

export type ServiceItem = { n: string; t: string; d: string; icon: string };

export type SiteSettings = Omit<Tables["site_settings"]["Row"], "services_json" | "draft_json"> & {
  services_json: ServiceItem[];
  draft_json: Record<string, unknown> | null;
};
export type Project = Tables["projects"]["Row"];
export type ProjectMedia = Tables["project_media"]["Row"];
export type Review = Tables["reviews"]["Row"];
export type Service = Tables["services"]["Row"];
export type NavItem = Tables["nav_items"]["Row"];
export type SectionRow = Tables["sections"]["Row"];
export type TimelineRow = Tables["timeline_items"]["Row"];
export type MediaRow = Tables["media"]["Row"];

export type SiteData = {
  settings: SiteSettings | null;
  projects: Project[];
  projectMedia: ProjectMedia[];
  reviews: Review[];
  services: Service[];
  nav: NavItem[];
  sections: SectionRow[];
  timeline: TimelineRow[];
  loading: boolean;
  refresh: () => Promise<void>;
};

/**
 * Loads every piece of CMS content used by the public website.
 * Pass { admin: true } to include drafts / hidden / soft-deleted-free rows for the dashboard.
 */
export function useSiteData(opts: { admin?: boolean } = {}): SiteData {
  const admin = !!opts.admin;
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectMedia, setProjectMedia] = useState<ProjectMedia[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [nav, setNav] = useState<NavItem[]>([]);
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [timeline, setTimeline] = useState<TimelineRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const live = <B extends { is: (c: string, v: null) => B; eq: (c: string, v: unknown) => B }>(q: B, hasStatus: boolean) => {
      let out = q.is("deleted_at", null);
      if (!admin) {
        out = out.eq("visible", true);
        if (hasStatus) out = out.eq("status", "published");
      }
      return out;
    };

    const [s, p, pm, r, sv, nv, sec, tl] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      live(supabase.from("projects").select("*").order("sort_order") as never, true),
      supabase.from("project_media").select("*").order("sort_order"),
      live(supabase.from("reviews").select("*").order("sort_order") as never, true),
      live(supabase.from("services").select("*").order("sort_order") as never, true),
      admin
        ? supabase.from("nav_items").select("*").order("sort_order")
        : supabase.from("nav_items").select("*").eq("visible", true).order("sort_order"),
      admin
        ? supabase.from("sections").select("*").order("sort_order")
        : supabase.from("sections").select("*").eq("visible", true).order("sort_order"),
      live(supabase.from("timeline_items").select("*").order("sort_order") as never, false),
    ]);

    if (s.data) setSettings(s.data as unknown as SiteSettings);
    setProjects(((p as { data: Project[] | null }).data ?? []));
    setProjectMedia((pm.data ?? []) as ProjectMedia[]);
    setReviews(((r as { data: Review[] | null }).data ?? []));
    setServices(((sv as { data: Service[] | null }).data ?? []));
    setNav((nv.data ?? []) as NavItem[]);
    setSections((sec.data ?? []) as SectionRow[]);
    setTimeline(((tl as { data: TimelineRow[] | null }).data ?? []));
    setLoading(false);
  }, [admin]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { settings, projects, projectMedia, reviews, services, nav, sections, timeline, loading, refresh };
}
