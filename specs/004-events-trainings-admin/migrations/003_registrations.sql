-- Migration 003: registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     uuid        NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  full_name    text        NOT NULL,
  email        text        NOT NULL,
  phone        text        NOT NULL,
  organisation text,
  status       text        NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  consent_given boolean    NOT NULL DEFAULT false CHECK (consent_given = true),
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS registrations_event_id_idx
  ON public.registrations (event_id);

CREATE INDEX IF NOT EXISTS registrations_created_at_idx
  ON public.registrations (created_at);
