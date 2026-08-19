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

export function getDocumentUrl(document: NACDocument): string | null {
  if (!document) return null;

  // 1. If storage_path exists, generate public URL directly
  if (document.storage_path) {
    const cleanPath = document.storage_path.replace(/^\/+/, '');
    const { data } = supabase.storage
      .from('department-files')
      .getPublicUrl(cleanPath);

    if (data?.publicUrl) return data.publicUrl;
  }

  // 2. Fallback to file_url
  if (document.file_url) return document.file_url;

  return null;
}

export async function getPublicUrl(storagePath: string): Promise<string | null> {
  const { data } = supabase.storage.from('department-files').getPublicUrl(storagePath);
  return data?.publicUrl ?? null;
}
