import { supabase } from '@/lib/supabase';
import type { NACDocument } from '@/types/nac';

export async function fetchDocuments(filters: { fileNumber?: number; subsectionNumber?: number; academicYear?: string; search?: string; visibility?: string; }) {
  let query = supabase.from('nac_documents').select('*').order('uploaded_at', { ascending: false });
  if (filters.fileNumber) query = query.eq('file_number', filters.fileNumber);
  if (filters.subsectionNumber) query = query.eq('subsection_number', filters.subsectionNumber);
  if (filters.academicYear) query = query.eq('academic_year', filters.academicYear);
  if (filters.visibility) query = query.eq('visibility', filters.visibility);
  if (filters.search) query = query.or(`title.ilike.%${filters.search}%,filename.ilike.%${filters.search}%,file_title.ilike.%${filters.search}%,subsection_title.ilike.%${filters.search}%,academic_year.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as NACDocument[];
}

export async function getDocumentUrl(document: NACDocument) {
  if (document.visibility === 'public' && document.file_url) return document.file_url;
  const { data, error } = await supabase.storage.from('department-files').createSignedUrl(document.storage_path, 600);
  if (error || !data?.signedUrl) throw error ?? new Error('Document unavailable');
  return data.signedUrl;
}

export async function getPublicUrl(storagePath: string): Promise<string | null> {
  const { data } = supabase.storage.from('department-files').getPublicUrl(storagePath);
  return data?.publicUrl ?? null;
}
