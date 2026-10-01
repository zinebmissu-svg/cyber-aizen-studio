create table if not exists public.pricing_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price text not null default '',
  period text not null default '',
  description text not null default '',
  features jsonb not null default '[]'::jsonb,
  badge text not null default '',
  cta_label text not null default 'Start a project',
  featured boolean not null default false,
  sort_order int not null default 0,
  visible boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT SELECT ON public.pricing_plans TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pricing_plans TO authenticated;
GRANT ALL ON public.pricing_plans TO service_role;

alter table public.pricing_plans enable row level security;

drop policy if exists "Public can read visible pricing plans" on public.pricing_plans;
create policy "Public can read visible pricing plans"
  on public.pricing_plans for select
  to anon
  using (visible = true and deleted_at is null);

drop policy if exists "Admins can read all pricing plans" on public.pricing_plans;
create policy "Admins can read all pricing plans"
  on public.pricing_plans for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can insert pricing plans" on public.pricing_plans;
create policy "Admins can insert pricing plans"
  on public.pricing_plans for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can update pricing plans" on public.pricing_plans;
create policy "Admins can update pricing plans"
  on public.pricing_plans for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can delete pricing plans" on public.pricing_plans;
create policy "Admins can delete pricing plans"
  on public.pricing_plans for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

alter table public.site_settings
  add column if not exists pricing_headline text not null default 'Simple, transparent pricing.';
alter table public.site_settings
  add column if not exists pricing_subtitle text not null default 'Pick a package that fits your project — every quote includes revisions, source files and worldwide delivery.';

insert into public.pricing_plans (name, price, period, description, features, badge, cta_label, featured, sort_order)
select * from (values
('Basic Edit', '$99', '/ video', 'Perfect for short-form content, reels and quick turnarounds.', '["Up to 60s final cut","Color grading","2 revision rounds","3-day delivery","Music & SFX sync"]'::jsonb, '', 'Start a project', false, 0),
('Standard', '$249', '/ video', 'Full editing + motion graphics for brands, artists and creators.', '["Up to 3 min final cut","Color grading + sound design","Motion graphics & titles","3 revision rounds","5-day delivery","Vertical + horizontal cutdowns"]'::jsonb, 'Most popular', 'Start a project', true, 1),
('Premium', 'Custom', '/ project', 'Cinematic VFX, 3D and full creative direction for productions.', '["Cinematic VFX & compositing","3D animation & CGI","Unlimited revisions","Creative direction included","Priority delivery","Full source files"]'::jsonb, '', 'Let''s talk', false, 2)
) as seed(name, price, period, description, features, badge, cta_label, featured, sort_order)
where not exists (select 1 from public.pricing_plans);
