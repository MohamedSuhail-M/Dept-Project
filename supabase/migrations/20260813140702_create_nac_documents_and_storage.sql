/*
# Create NAC digital archive storage and access controls

1. New tables
- `nac_documents` stores searchable metadata for files in Supabase Storage.
- `id`, `file_number`, `file_title`, `subsection_number`, `subsection_title`, `academic_year`, `title`, `filename`, `storage_path`, `file_url`, `file_type`, `file_size`, `visibility`, `uploaded_at`, `uploaded_by`, and `description`.
2. Storage
- Creates the private `department-files` bucket for NAC records.
3. Security
- Public readers can only view rows explicitly marked public.
- Signed-in administrators can view restricted records and manage document metadata.
- Only administrators identified by immutable `app_metadata.role = admin` can write or delete records and storage objects.
- Restricted files are never exposed through permanent public URLs.
4. Notes
- Storage binaries remain outside the database.
- The browser uses only the public Supabase key; service credentials are not used in the client.
*/

CREATE TABLE IF NOT EXISTS public.nac_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_number integer NOT NULL CHECK (file_number BETWEEN 1 AND 25),
  file_title text NOT NULL,
  subsection_number integer NOT NULL CHECK (subsection_number >= 0),
  subsection_title text NOT NULL,
  academic_year text NOT NULL,
  title text NOT NULL,
  filename text NOT NULL,
  storage_path text NOT NULL UNIQUE,
  file_url text,
  file_type text NOT NULL,
  file_size bigint NOT NULL CHECK (file_size >= 0),
  visibility text NOT NULL DEFAULT 'restricted' CHECK (visibility IN ('public', 'restricted')),
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  description text
);

CREATE INDEX IF NOT EXISTS nac_documents_file_idx ON public.nac_documents (file_number, subsection_number, academic_year);
CREATE INDEX IF NOT EXISTS nac_documents_visibility_idx ON public.nac_documents (visibility);
CREATE INDEX IF NOT EXISTS nac_documents_uploaded_at_idx ON public.nac_documents (uploaded_at DESC);

ALTER TABLE public.nac_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view public NAC documents" ON public.nac_documents;
CREATE POLICY "Public can view public NAC documents" ON public.nac_documents FOR SELECT TO anon, authenticated USING (visibility = 'public');

DROP POLICY IF EXISTS "Admins can view all NAC documents" ON public.nac_documents;
CREATE POLICY "Admins can view all NAC documents" ON public.nac_documents FOR SELECT TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins can insert NAC documents" ON public.nac_documents;
CREATE POLICY "Admins can insert NAC documents" ON public.nac_documents FOR INSERT TO authenticated WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' AND uploaded_by = auth.uid());

DROP POLICY IF EXISTS "Admins can update NAC documents" ON public.nac_documents;
CREATE POLICY "Admins can update NAC documents" ON public.nac_documents FOR UPDATE TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins can delete NAC documents" ON public.nac_documents;
CREATE POLICY "Admins can delete NAC documents" ON public.nac_documents FOR DELETE TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

INSERT INTO storage.buckets (id, name, public) VALUES ('department-files', 'department-files', false) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Admins can upload department files" ON storage.objects;
CREATE POLICY "Admins can upload department files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'department-files' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins can read department files" ON storage.objects;
CREATE POLICY "Admins can read department files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'department-files' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins can update department files" ON storage.objects;
CREATE POLICY "Admins can update department files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'department-files' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') WITH CHECK (bucket_id = 'department-files' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins can delete department files" ON storage.objects;
CREATE POLICY "Admins can delete department files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'department-files' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');