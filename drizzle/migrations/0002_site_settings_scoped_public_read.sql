DROP POLICY IF EXISTS "Site settings public read" ON public.site_settings;
CREATE POLICY "Site settings public read" ON public.site_settings FOR SELECT TO anon, authenticated USING (id = 1);