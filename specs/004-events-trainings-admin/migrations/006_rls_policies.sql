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
