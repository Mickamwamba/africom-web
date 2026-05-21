-- Migration 002: events table
CREATE TABLE IF NOT EXISTS public.events (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text          NOT NULL,
  slug            text          NOT NULL,
  type            text          NOT NULL CHECK (type IN ('event', 'training')),
  category_id     uuid          REFERENCES public.categories(id) ON DELETE RESTRICT,
  description     text          NOT NULL DEFAULT '',
  start_at        timestamptz   NOT NULL,
  end_at          timestamptz   NOT NULL,
  location        text          NOT NULL DEFAULT '',
  is_online       boolean       NOT NULL DEFAULT false,
  price           numeric(10,2),
  is_free         boolean       NOT NULL DEFAULT true,
  cover_image_url text,
  status          text          NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at      timestamptz   NOT NULL DEFAULT now(),
  updated_at      timestamptz   NOT NULL DEFAULT now(),
  CONSTRAINT events_end_after_start CHECK (end_at > start_at)
);

CREATE UNIQUE INDEX IF NOT EXISTS events_slug_idx
  ON public.events (slug);

CREATE INDEX IF NOT EXISTS events_status_start_at_idx
  ON public.events (status, start_at);

CREATE INDEX IF NOT EXISTS events_category_id_idx
  ON public.events (category_id);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS events_updated_at ON public.events;
CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
