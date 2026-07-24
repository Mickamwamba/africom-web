-- Migration 001: categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Case-insensitive uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS categories_name_lower_idx
  ON public.categories (lower(name));
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
-- Migration 005: user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role       text NOT NULL CHECK (role IN ('admin', 'staff')),
  created_at timestamptz NOT NULL DEFAULT now()
);
-- Migration 006: RLS policies for all tables

-- Helper function: get the current user's role
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql STABLE
AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- ============================================================
-- Enable RLS
-- ============================================================
ALTER TABLE public.categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles    ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- categories
-- ============================================================
DROP POLICY IF EXISTS "public_read_categories"   ON public.categories;
DROP POLICY IF EXISTS "admin_write_categories"   ON public.categories;
DROP POLICY IF EXISTS "admin_update_categories"  ON public.categories;
DROP POLICY IF EXISTS "admin_delete_categories"  ON public.categories;

CREATE POLICY "public_read_categories"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "admin_write_categories"
  ON public.categories FOR INSERT
  WITH CHECK (public.get_my_role() = 'admin');

CREATE POLICY "admin_update_categories"
  ON public.categories FOR UPDATE
  USING (public.get_my_role() = 'admin');

CREATE POLICY "admin_delete_categories"
  ON public.categories FOR DELETE
  USING (public.get_my_role() = 'admin');

-- ============================================================
-- events
-- ============================================================
DROP POLICY IF EXISTS "anon_read_published_events"  ON public.events;
DROP POLICY IF EXISTS "staff_read_all_events"       ON public.events;
DROP POLICY IF EXISTS "staff_write_events"          ON public.events;
DROP POLICY IF EXISTS "staff_update_events"         ON public.events;
DROP POLICY IF EXISTS "admin_delete_events"         ON public.events;

CREATE POLICY "anon_read_published_events"
  ON public.events FOR SELECT
  USING (status = 'published' OR public.get_my_role() IN ('admin', 'staff'));

CREATE POLICY "staff_write_events"
  ON public.events FOR INSERT
  WITH CHECK (public.get_my_role() IN ('admin', 'staff'));

CREATE POLICY "staff_update_events"
  ON public.events FOR UPDATE
  USING (public.get_my_role() IN ('admin', 'staff'));

CREATE POLICY "admin_delete_events"
  ON public.events FOR DELETE
  USING (public.get_my_role() = 'admin');

-- ============================================================
-- registrations
-- ============================================================
DROP POLICY IF EXISTS "anon_insert_registrations"      ON public.registrations;
DROP POLICY IF EXISTS "staff_read_registrations"       ON public.registrations;
DROP POLICY IF EXISTS "staff_update_registrations"     ON public.registrations;
DROP POLICY IF EXISTS "admin_delete_registrations"     ON public.registrations;

CREATE POLICY "anon_insert_registrations"
  ON public.registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "staff_read_registrations"
  ON public.registrations FOR SELECT
  USING (public.get_my_role() IN ('admin', 'staff'));

CREATE POLICY "staff_update_registrations"
  ON public.registrations FOR UPDATE
  USING (public.get_my_role() IN ('admin', 'staff'));

CREATE POLICY "admin_delete_registrations"
  ON public.registrations FOR DELETE
  USING (public.get_my_role() = 'admin');

-- ============================================================
-- inquiries
-- ============================================================
DROP POLICY IF EXISTS "anon_insert_inquiries"   ON public.inquiries;
DROP POLICY IF EXISTS "staff_read_inquiries"    ON public.inquiries;
DROP POLICY IF EXISTS "staff_update_inquiries"  ON public.inquiries;
DROP POLICY IF EXISTS "admin_delete_inquiries"  ON public.inquiries;

CREATE POLICY "anon_insert_inquiries"
  ON public.inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "staff_read_inquiries"
  ON public.inquiries FOR SELECT
  USING (public.get_my_role() IN ('admin', 'staff'));

CREATE POLICY "staff_update_inquiries"
  ON public.inquiries FOR UPDATE
  USING (public.get_my_role() IN ('admin', 'staff'));

CREATE POLICY "admin_delete_inquiries"
  ON public.inquiries FOR DELETE
  USING (public.get_my_role() = 'admin');

-- ============================================================
-- user_roles
-- ============================================================
DROP POLICY IF EXISTS "user_read_own_role"   ON public.user_roles;
DROP POLICY IF EXISTS "admin_manage_roles"   ON public.user_roles;

CREATE POLICY "user_read_own_role"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "admin_manage_roles"
  ON public.user_roles FOR ALL
  USING (public.get_my_role() = 'admin');
-- Migration 007: Supabase Storage bucket for event cover images
-- Run this in the Supabase SQL editor after enabling Storage in your project.

INSERT INTO storage.buckets (id, name, public)
VALUES ('event-covers', 'event-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read (download) objects in the bucket
DROP POLICY IF EXISTS "public_read_event_covers" ON storage.objects;
CREATE POLICY "public_read_event_covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-covers');

-- Allow authenticated admin/staff to upload
DROP POLICY IF EXISTS "staff_upload_event_covers" ON storage.objects;
CREATE POLICY "staff_upload_event_covers"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'event-covers'
    AND public.get_my_role() IN ('admin', 'staff')
  );

-- Allow authenticated admin/staff to update (replace) objects
DROP POLICY IF EXISTS "staff_update_event_covers" ON storage.objects;
CREATE POLICY "staff_update_event_covers"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'event-covers'
    AND public.get_my_role() IN ('admin', 'staff')
  );

-- Allow admin to delete objects
DROP POLICY IF EXISTS "admin_delete_event_covers" ON storage.objects;
CREATE POLICY "admin_delete_event_covers"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'event-covers'
    AND public.get_my_role() = 'admin'
  );
-- Admin user seed (run AFTER creating the user in Supabase Auth → Users)
-- Replace 'your@email.com' with the email you used when creating the user in Auth → Users
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'your@email.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
