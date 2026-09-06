-- restore normal table read for anon (drafts move out of this table)
GRANT SELECT ON public.site_settings TO anon;

CREATE TABLE public.site_drafts (
  id integer PRIMARY KEY,
  draft_json jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_drafts TO authenticated;
GRANT ALL ON public.site_drafts TO service_role;

ALTER TABLE public.site_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage site drafts" ON public.site_drafts
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER site_drafts_updated_at BEFORE UPDATE ON public.site_drafts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_drafts (id, draft_json)
SELECT id, draft_json FROM public.site_settings WHERE draft_json IS NOT NULL
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.site_settings DROP COLUMN draft_json;