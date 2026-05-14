import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ServiceItem = { n: string; t: string; d: string; icon: string };

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
  brand_name: string;
  marquee_text: string;
  work_headline: string;
  work_subtitle: string;
  services_headline: string;
  reviews_headline: string;
  contact_headline: string;
  location_text: string;
  location_sub: string;
  footer_text: string;
  portrait_url: string | null;
  hero_image_url: string | null;
  theme_bg: string;
  theme_foreground: string;
  theme_primary: string;
  theme_primary_glow: string;
  cursor_color: string;
  services_json: ServiceItem[];
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
    if (s.data) setSettings(s.data as unknown as SiteSettings);
    if (p.data) setProjects(p.data as Project[]);
    if (r.data) setReviews(r.data as Review[]);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { settings, projects, reviews, loading, refresh };
}
