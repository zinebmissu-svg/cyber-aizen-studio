ALTER TABLE public.pricing_plans
ADD COLUMN category text NOT NULL DEFAULT 'video_editing';

ALTER TABLE public.pricing_plans
ADD CONSTRAINT pricing_plans_category_check
CHECK (category IN ('design', 'video_editing'));

CREATE INDEX pricing_plans_category_sort_idx
ON public.pricing_plans (category, sort_order)
WHERE deleted_at IS NULL;