-- ============ MEDIA LIBRARY ============
CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  alt text NOT NULL DEFAULT '',
  kind text NOT NULL DEFAULT 'image',
  url text NOT NULL,
  storage_path text,
  provider text NOT NULL DEFAULT 'upload',
  thumbnail_url text,
  mime_type text,
  size_bytes bigint,
  tags text[] NOT NULL DEFAULT '{}',
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media TO authenticated;
GRANT ALL ON public.media TO service_role;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Media public read" ON public.media FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Admins manage media" ON public.media FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER media_updated_at BEFORE UPDATE ON public.media FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ NAVIGATION ============
CREATE TABLE public.nav_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  target text NOT NULL,
  link_type text NOT NULL DEFAULT 'anchor',
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.nav_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nav_items TO authenticated;
GRANT ALL ON public.nav_items TO service_role;
ALTER TABLE public.nav_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Nav public read" ON public.nav_items FOR SELECT USING (true);
CREATE POLICY "Admins manage nav" ON public.nav_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER nav_items_updated_at BEFORE UPDATE ON public.nav_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.nav_items (label, target, link_type, sort_order) VALUES
  ('Home','home','anchor',0),
  ('About','about','anchor',1),
  ('Work','work','anchor',2),
  ('Services','services','anchor',3),
  ('Reviews','reviews','anchor',4),
  ('Contact','contact','anchor',5);

-- ============ SECTIONS ============
CREATE TABLE public.sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sections TO authenticated;
GRANT ALL ON public.sections TO service_role;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sections public read" ON public.sections FOR SELECT USING (true);
CREATE POLICY "Admins manage sections" ON public.sections FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER sections_updated_at BEFORE UPDATE ON public.sections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.sections (key,label,sort_order) VALUES
  ('hero','Hero',0),
  ('marquee','Marquee',1),
  ('about','About',2),
  ('timeline','Timeline',3),
  ('work','Portfolio',4),
  ('services','Services',5),
  ('reviews','Testimonials',6),
  ('contact','Contact',7);

-- ============ SERVICES ============
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL DEFAULT '01',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '✦',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'published',
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services public read" ON public.services FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Admins manage services" ON public.services FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.services (number,title,description,icon,sort_order) VALUES
  ('01','VFX','Compositing, simulations, and cinematic post-production for music videos, films, and brand work.','✦',0),
  ('02','Video Editing','Rhythm-first editorial — cutting story, music, and emotion into a single frame language.','▶',1),
  ('03','3D Motion Graphics','Procedural worlds, chrome typography, and physics-based motion for screens of every scale.','◆',2),
  ('04','Creative Direction','End-to-end concept, art direction, and visual treatment from mood to delivery.','◉',3),
  ('05','Visual Branding','Identity systems with motion baked in — logos, type, and brand films that move.','❖',4);

-- ============ TIMELINE ============
CREATE TABLE public.timeline_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year text NOT NULL,
  title text NOT NULL,
  text text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.timeline_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.timeline_items TO authenticated;
GRANT ALL ON public.timeline_items TO service_role;
ALTER TABLE public.timeline_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Timeline public read" ON public.timeline_items FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Admins manage timeline" ON public.timeline_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER timeline_items_updated_at BEFORE UPDATE ON public.timeline_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.timeline_items (year,title,text,sort_order) VALUES
  ('2019','Editing beginnings','Started creating football and anime edits.',0),
  ('2021','VFX mastery','Mastered VFX and cinematic editing.',1),
  ('2023','Creative expansion','Expanded into graphic design and visual branding.',2),
  ('2026','Content creator era','Started building a cinematic presence on Instagram through creative content.',3);

-- ============ PROJECTS UPGRADE ============
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'VFX',
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS cover_alt text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

DROP POLICY IF EXISTS "Projects public read" ON public.projects;
CREATE POLICY "Projects public read" ON public.projects FOR SELECT USING (deleted_at IS NULL);

CREATE TABLE public.project_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  kind text NOT NULL DEFAULT 'image',
  url text NOT NULL,
  provider text NOT NULL DEFAULT 'upload',
  thumbnail_url text,
  alt text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.project_media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_media TO authenticated;
GRANT ALL ON public.project_media TO service_role;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project media public read" ON public.project_media FOR SELECT USING (true);
CREATE POLICY "Admins manage project media" ON public.project_media FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER project_media_updated_at BEFORE UPDATE ON public.project_media FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ REVIEWS UPGRADE ============
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS company text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

DROP POLICY IF EXISTS "Reviews public read" ON public.reviews;
CREATE POLICY "Reviews public read" ON public.reviews FOR SELECT USING (deleted_at IS NULL);

-- ============ SITE SETTINGS UPGRADE ============
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS theme_secondary text NOT NULL DEFAULT 'oklch(0.28 0.03 275)',
  ADD COLUMN IF NOT EXISTS theme_accent text NOT NULL DEFAULT 'oklch(0.72 0.20 320)',
  ADD COLUMN IF NOT EXISTS theme_heading text NOT NULL DEFAULT 'oklch(0.98 0.005 270)',
  ADD COLUMN IF NOT EXISTS theme_muted text NOT NULL DEFAULT 'oklch(0.68 0.02 270)',
  ADD COLUMN IF NOT EXISTS theme_border text NOT NULL DEFAULT 'oklch(0.28 0.02 270)',
  ADD COLUMN IF NOT EXISTS theme_button_bg text NOT NULL DEFAULT 'oklch(0.97 0.005 270)',
  ADD COLUMN IF NOT EXISTS theme_button_fg text NOT NULL DEFAULT 'oklch(0.10 0.01 270)',
  ADD COLUMN IF NOT EXISTS theme_gradient_from text NOT NULL DEFAULT 'oklch(0.62 0.22 295)',
  ADD COLUMN IF NOT EXISTS theme_gradient_to text NOT NULL DEFAULT 'oklch(0.72 0.20 330)',
  ADD COLUMN IF NOT EXISTS theme_hover text NOT NULL DEFAULT 'oklch(0.78 0.18 295)',
  ADD COLUMN IF NOT EXISTS font_display text NOT NULL DEFAULT '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
  ADD COLUMN IF NOT EXISTS font_body text NOT NULL DEFAULT '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
  ADD COLUMN IF NOT EXISTS base_font_size text NOT NULL DEFAULT '16px',
  ADD COLUMN IF NOT EXISTS radius text NOT NULL DEFAULT '0.75rem',
  ADD COLUMN IF NOT EXISTS shadow_strength text NOT NULL DEFAULT '0.45',
  ADD COLUMN IF NOT EXISTS animations_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS cursor_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS seo_title text NOT NULL DEFAULT 'Aizen — Cinematic VFX, Editing & 3D Motion',
  ADD COLUMN IF NOT EXISTS seo_description text NOT NULL DEFAULT 'Moroccan VFX artist, video editor, and 3D motion designer crafting cinematic visuals for music, fashion, and film.',
  ADD COLUMN IF NOT EXISTS seo_og_image text,
  ADD COLUMN IF NOT EXISTS whatsapp_number text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS nav_cta_label text NOT NULL DEFAULT 'Hire ↗',
  ADD COLUMN IF NOT EXISTS hero_cta1_label text NOT NULL DEFAULT 'View work',
  ADD COLUMN IF NOT EXISTS hero_cta2_label text NOT NULL DEFAULT 'Get in touch',
  ADD COLUMN IF NOT EXISTS contact_form_button text NOT NULL DEFAULT 'Transmit',
  ADD COLUMN IF NOT EXISTS timeline_headline text NOT NULL DEFAULT 'The journey',
  ADD COLUMN IF NOT EXISTS draft_json jsonb;