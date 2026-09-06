-- contact_submissions: allow admins to update
CREATE POLICY "Admins update submissions" ON public.contact_submissions
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- media: add visibility flag and enforce it publicly
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;
DROP POLICY "Media public read" ON public.media;
CREATE POLICY "Media public read" ON public.media
FOR SELECT TO anon, authenticated
USING (deleted_at IS NULL AND visible = true);

-- projects
DROP POLICY "Projects public read" ON public.projects;
CREATE POLICY "Projects public read" ON public.projects
FOR SELECT TO anon, authenticated
USING (deleted_at IS NULL AND visible = true AND status = 'published');

-- reviews
DROP POLICY "Reviews public read" ON public.reviews;
CREATE POLICY "Reviews public read" ON public.reviews
FOR SELECT TO anon, authenticated
USING (deleted_at IS NULL AND visible = true AND status = 'published');

-- services
DROP POLICY "Services public read" ON public.services;
CREATE POLICY "Services public read" ON public.services
FOR SELECT TO anon, authenticated
USING (deleted_at IS NULL AND visible = true AND status = 'published');

-- timeline_items
DROP POLICY "Timeline public read" ON public.timeline_items;
CREATE POLICY "Timeline public read" ON public.timeline_items
FOR SELECT TO anon, authenticated
USING (deleted_at IS NULL AND visible = true);

-- site_settings: hide draft_json from anonymous visitors via column-level grants
REVOKE SELECT ON public.site_settings FROM anon;
GRANT SELECT (
  id, hero_eyebrow, hero_line1, hero_line2, hero_line3, hero_subtitle,
  about_headline, about_p1, about_p2, stat1_n, stat1_l, stat2_n, stat2_l,
  stat3_n, stat3_l, instagram_handle, contact_email, updated_at, brand_name,
  marquee_text, work_headline, work_subtitle, services_headline,
  reviews_headline, contact_headline, location_text, location_sub, footer_text,
  portrait_url, hero_image_url, theme_bg, theme_foreground, theme_primary,
  theme_primary_glow, cursor_color, services_json, theme_secondary,
  theme_accent, theme_heading, theme_muted, theme_border, theme_button_bg,
  theme_button_fg, theme_gradient_from, theme_gradient_to, theme_hover,
  font_display, font_body, base_font_size, radius, shadow_strength,
  animations_enabled, cursor_enabled, seo_title, seo_description, seo_og_image,
  whatsapp_number, nav_cta_label, hero_cta1_label, hero_cta2_label,
  contact_form_button, timeline_headline
) ON public.site_settings TO anon;