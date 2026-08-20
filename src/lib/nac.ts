import { supabase } from '@/lib/supabase';
import type { NACDocument } from '@/types/nac';

// Define your single source of truth for the Supabase Storage Bucket name
const BUCKET_NAME = 'department-files'; // Adjust to 'nac-bucket' if that is your bucket name in Supabase

export async function fetchDocuments(filters: {
  fileNumber?: number;
  subsectionNumber?: number;
  academicYear?: string;
  search?: string;
  visibility?: string;
}) {
  let query = supabase.from('nac_documents').select('*').order('uploaded_at', { ascending: false });

  if (filters.fileNumber) query = query.eq('file_number', filters.fileNumber);
  if (filters.subsectionNumber) query = query.eq('subsection_number', filters.subsectionNumber);
  if (filters.academicYear) query = query.eq('academic_year', filters.academicYear);
  if (filters.visibility) query = query.eq('visibility', filters.visibility);
  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,filename.ilike.%${filters.search}%,file_title.ilike.%${filters.search}%,subsection_title.ilike.%${filters.search}%,academic_year.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as NACDocument[];
}

export function getDocumentUrl(document: NACDocument, isDownload = false): string {
  if (!document) return '';

  // 1. If document already stores a direct HTTP URL, use it directly
  if (document.file_url && document.file_url.startsWith('http')) {
    return isDownload && !document.file_url.includes('download=')
      ? `${document.file_url}${document.file_url.includes('?') ? '&' : '?'}download=${encodeURIComponent(document.filename || 'file')}`
      : document.file_url;
  }

  // 2. Derive file path from storage_path or filename
  const filePath = document.storage_path || document.filename;
  if (!filePath) return '';

  // 3. Use Supabase SDK to build the public URL directly
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  let publicUrl = data?.publicUrl || '';

  // 4. Force attachment download header if requested
  if (isDownload && publicUrl) {
    const filename = document.filename || 'document';
    publicUrl = `${publicUrl}?download=${encodeURIComponent(filename)}`;
  }

  return publicUrl;
}

export async function getPublicUrl(storagePath: string): Promise<string | null> {
  if (!storagePath) return null;
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
  return data?.publicUrl ?? null;
}
