CREATE TABLE public.showcase_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'poster' CHECK (kind IN ('poster','video')),
  title text NOT NULL DEFAULT '',
  url text NOT NULL,
  storage_path text,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.showcase_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.showcase_items TO authenticated;
GRANT ALL ON public.showcase_items TO service_role;
ALTER TABLE public.showcase_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads visible showcase" ON public.showcase_items FOR SELECT TO anon, authenticated USING (visible = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage showcase" ON public.showcase_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER showcase_items_updated_at BEFORE UPDATE ON public.showcase_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();