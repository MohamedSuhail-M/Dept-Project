-- Allow public read access to files in department-files bucket
-- so that documents marked visibility='public' can be viewed without auth.
-- Restricted files remain protected — only admins get signed URLs.

DROP POLICY IF EXISTS "Public can read public department files" ON storage.objects;
CREATE POLICY "Public can read public department files" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (
    bucket_id = 'department-files'
    AND (storage.foldername(name))[1] = 'public'
  );
