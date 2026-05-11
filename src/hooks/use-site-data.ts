import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  id: number;
  hero_eyebrow: string;
  hero_line1: string;
  hero_line2: string;
  hero_line3: string;
  hero_subtitle: string;
  about_headline: string;
  about_p1: string;
  about_p2: string;
  stat1_n: string; stat1_l: string;
  stat2_n: string; stat2_l: string;
  stat3_n: string; stat3_l: string;
  instagram_handle: string;
  contact_email: string;
};

export type Project = {
  id: string;
  title: string;
  client: string;
  kind: string;
  year: string;
  gradient: string;
  cover_url: string | null;
  link_url: string | null;
  sort_order: number;
};

export type Review = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar_url: string | null;
  sort_order: number;
};

export function useSiteData() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [s, p, r] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("projects").select("*").order("sort_order"),
      supabase.from("reviews").select("*").order("sort_order"),
    ]);
    if (s.data) setSettings(s.data as SiteSettings);
    if (p.data) setProjects(p.data as Project[]);
    if (r.data) setReviews(r.data as Review[]);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { settings, projects, reviews, loading, refresh };
}
