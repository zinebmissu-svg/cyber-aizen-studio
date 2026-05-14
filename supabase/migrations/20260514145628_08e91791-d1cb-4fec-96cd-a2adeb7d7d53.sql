
-- Extend site_settings with theme + content + image controls
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS brand_name text NOT NULL DEFAULT 'AIZEN',
  ADD COLUMN IF NOT EXISTS marquee_text text NOT NULL DEFAULT 'VFX ◆ EDITING ◆ 3D MOTION ◆ DIRECTION',
  ADD COLUMN IF NOT EXISTS work_headline text NOT NULL DEFAULT 'Selected work',
  ADD COLUMN IF NOT EXISTS work_subtitle text NOT NULL DEFAULT 'A living archive of cinematic frames — music, fashion, film, and brand work shot, edited, and crafted with obsessive detail.',
  ADD COLUMN IF NOT EXISTS services_headline text NOT NULL DEFAULT 'What I make',
  ADD COLUMN IF NOT EXISTS reviews_headline text NOT NULL DEFAULT 'Words from collaborators',
  ADD COLUMN IF NOT EXISTS contact_headline text NOT NULL DEFAULT 'Let''s make something.',
  ADD COLUMN IF NOT EXISTS location_text text NOT NULL DEFAULT 'Casablanca, Morocco',
  ADD COLUMN IF NOT EXISTS location_sub text NOT NULL DEFAULT 'Working worldwide',
  ADD COLUMN IF NOT EXISTS footer_text text NOT NULL DEFAULT '© Aizen — Crafted with obsession.',
  ADD COLUMN IF NOT EXISTS portrait_url text,
  ADD COLUMN IF NOT EXISTS hero_image_url text,
  ADD COLUMN IF NOT EXISTS theme_bg text NOT NULL DEFAULT 'oklch(0.08 0.012 270)',
  ADD COLUMN IF NOT EXISTS theme_foreground text NOT NULL DEFAULT 'oklch(0.97 0.005 270)',
  ADD COLUMN IF NOT EXISTS theme_primary text NOT NULL DEFAULT 'oklch(0.62 0.22 295)',
  ADD COLUMN IF NOT EXISTS theme_primary_glow text NOT NULL DEFAULT 'oklch(0.78 0.18 295)',
  ADD COLUMN IF NOT EXISTS cursor_color text NOT NULL DEFAULT 'oklch(0.78 0.18 295)',
  ADD COLUMN IF NOT EXISTS services_json jsonb NOT NULL DEFAULT '[
    {"n":"01","t":"VFX","d":"Compositing, simulations, and cinematic post-production for music videos, films, and brand work.","icon":"✦"},
    {"n":"02","t":"Video Editing","d":"Rhythm-first editorial — cutting story, music, and emotion into a single frame language.","icon":"▶"},
    {"n":"03","t":"3D Motion Graphics","d":"Procedural worlds, chrome typography, and physics-based motion for screens of every scale.","icon":"◆"},
    {"n":"04","t":"Creative Direction","d":"End-to-end concept, art direction, and visual treatment from mood to delivery.","icon":"◉"},
    {"n":"05","t":"Visual Branding","d":"Identity systems with motion baked in — logos, type, and brand films that move.","icon":"❖"}
  ]'::jsonb;

-- Public storage bucket for site images
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, admin write
DROP POLICY IF EXISTS "Site assets public read" ON storage.objects;
CREATE POLICY "Site assets public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Admins upload site assets" ON storage.objects;
CREATE POLICY "Admins upload site assets" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update site assets" ON storage.objects;
CREATE POLICY "Admins update site assets" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete site assets" ON storage.objects;
CREATE POLICY "Admins delete site assets" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
