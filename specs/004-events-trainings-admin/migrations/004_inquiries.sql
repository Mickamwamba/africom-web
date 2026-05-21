-- Migration 004: inquiries table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name         text        NOT NULL,
  email               text        NOT NULL,
  service_of_interest text,
  message             text        NOT NULL,
  is_read             boolean     NOT NULL DEFAULT false,
  submitted_at        timestamptz NOT NULL DEFAULT now()
);
