import { supabase } from '@/lib/supabase';
import type { NACDocument } from '@/types/nac';

export async function deleteDocument(doc: NACDocument): Promise<{ error: string | null }> {
  const { error: dbError } = await supabase.from('nac_documents').delete().eq('id', doc.id);
  if (dbError) return { error: dbError.message };
  if (doc.storage_path) {
    const { error: storageError } = await supabase.storage.from('department-files').remove([doc.storage_path]);
    if (storageError) return { error: `Database record deleted, but storage cleanup failed: ${storageError.message}` };
  }
  return { error: null };
}

export async function updateDocument(id: string, updates: Partial<NACDocument>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('nac_documents').update({
    title: updates.title,
    description: updates.description,
    academic_year: updates.academic_year,
    visibility: updates.visibility,
    file_number: updates.file_number,
    file_title: updates.file_title,
    subsection_number: updates.subsection_number,
    subsection_title: updates.subsection_title,
  }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function replaceFile(doc: NACDocument, newFile: File): Promise<{ error: string | null }> {
  const oldPath = doc.storage_path;
  const safeName = newFile.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
  const newPath = `nac/file-${String(doc.file_number).padStart(2, '0')}/${doc.academic_year}/${crypto.randomUUID()}-${safeName}`;
  const { error: uploadError } = await supabase.storage.from('department-files').upload(newPath, newFile, { contentType: newFile.type || 'application/octet-stream', upsert: false });
  if (uploadError) return { error: uploadError.message };
  const { error: updateError } = await supabase.from('nac_documents').update({
    storage_path: newPath,
    filename: newFile.name,
    file_type: newFile.type || 'application/octet-stream',
    file_size: newFile.size,
  }).eq('id', doc.id);
  if (updateError) {
    await supabase.storage.from('department-files').remove([newPath]);
    return { error: updateError.message };
  }
  await supabase.storage.from('department-files').remove([oldPath]);
  return { error: null };
}
export function getDocumentPublicUrl(storagePath: string): string | null {
  if (!storagePath) return null;
  
  const { data } = supabase.storage
    .from('department-files')
    .getPublicUrl(storagePath);

  return data.publicUrl;
}

export async function downloadDocumentFile(doc: NACDocument): Promise<{ error: string | null }> {
  if (!doc.storage_path) return { error: 'No storage path found for this document.' };

  const { data, error } = await supabase.storage
    .from('department-files')
    .download(doc.storage_path);

  if (error || !data) return { error: error?.message || 'Failed to download file.' };

  const blobUrl = URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = doc.filename || 'downloaded-file';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);

  return { error: null };
}
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
