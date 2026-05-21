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
