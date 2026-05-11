
-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- First signup becomes admin
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM auth.users;
  IF user_count <= 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Generic updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- SITE SETTINGS (single-row keyed by id=1)
CREATE TABLE public.site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_eyebrow TEXT NOT NULL DEFAULT 'Cinematic Portfolio · 2026',
  hero_line1 TEXT NOT NULL DEFAULT 'Turning Ideas',
  hero_line2 TEXT NOT NULL DEFAULT 'Into Moving',
  hero_line3 TEXT NOT NULL DEFAULT 'Worlds.',
  hero_subtitle TEXT NOT NULL DEFAULT 'Aizen — Moroccan VFX artist, video editor, and 3D motion designer crafting cinematic visuals for music, fashion, and film.',
  about_headline TEXT NOT NULL DEFAULT 'A frame is a feeling.',
  about_p1 TEXT NOT NULL DEFAULT 'I''m Aizen — a Moroccan VFX artist, editor, and 3D motion designer. My obsession is texture: how light bends across chrome, how fog softens an edge, how a single cut can change everything.',
  about_p2 TEXT NOT NULL DEFAULT 'I work between Casablanca and the cloud, building cinematic worlds for music videos, fashion campaigns, and brand films. Tools change — taste doesn''t. Every frame is a composition; every transition, a heartbeat.',
  stat1_n TEXT NOT NULL DEFAULT '120+',
  stat1_l TEXT NOT NULL DEFAULT 'Projects',
  stat2_n TEXT NOT NULL DEFAULT '30+',
  stat2_l TEXT NOT NULL DEFAULT 'Brands',
  stat3_n TEXT NOT NULL DEFAULT '7',
  stat3_l TEXT NOT NULL DEFAULT 'Years',
  instagram_handle TEXT NOT NULL DEFAULT 'aizen.visuals',
  contact_email TEXT NOT NULL DEFAULT 'contact@aizen.studio',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site settings public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage site settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.site_settings (id) VALUES (1);

-- PROJECTS
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  client TEXT NOT NULL DEFAULT '',
  kind TEXT NOT NULL DEFAULT 'VFX',
  year TEXT NOT NULL DEFAULT '2025',
  gradient TEXT NOT NULL DEFAULT 'from-violet-500/40 to-fuchsia-500/10',
  cover_url TEXT,
  link_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects public read" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admins manage projects" ON public.projects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.projects (title, client, kind, year, gradient, sort_order) VALUES
('Neon Dynasty', 'Music Video', 'VFX', '2025', 'from-violet-500/40 to-fuchsia-500/10', 1),
('Atlas Echoes', 'Brand Film', '3D Motion', '2025', 'from-cyan-400/30 to-violet-500/20', 2),
('Chrome Bloom', 'Fashion Campaign', 'Editing', '2025', 'from-violet-400/40 to-indigo-500/10', 3),
('Voidwalker', 'Short Film', 'VFX', '2024', 'from-fuchsia-500/30 to-violet-700/40', 4),
('Mirage Capital', 'Title Sequence', 'Direction', '2024', 'from-indigo-500/30 to-violet-500/20', 5),
('Solstice 04', 'Music Visual', '3D Motion', '2024', 'from-violet-600/40 to-purple-900/30', 6);

-- REVIEWS
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  quote TEXT NOT NULL,
  rating INT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  avatar_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews public read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Admins manage reviews" ON public.reviews FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.reviews (name, role, quote, rating, sort_order) VALUES
('Sara El Amrani', 'Creative Director, Atlas Records', 'Aizen turned our concept into something cinematic. Every frame was crafted with obsession — exactly what the project needed.', 5, 1),
('Yusuf Benali', 'Founder, Chrome Studio', 'Working with Aizen was effortless. The visuals were beyond what we briefed — clients keep asking who did the post.', 5, 2),
('Lina Moreau', 'Fashion Brand Manager', 'A rare blend of taste and technical skill. Aizen made our campaign film feel like a short film, not an ad.', 5, 3),
('Khalid Ouazzani', 'Music Artist', 'My music video felt alive. The motion, the grade, the cuts — Aizen gets it.', 5, 4),
('Maya Rodriguez', 'Producer, Halo Films', 'Reliable, fast, and visually relentless. The kind of artist you want on every project.', 5, 5);
