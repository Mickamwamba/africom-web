-- Migration 001: categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Case-insensitive uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS categories_name_lower_idx
  ON public.categories (lower(name));
