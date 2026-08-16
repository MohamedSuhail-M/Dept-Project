export type Visibility = 'public' | 'restricted';

export interface NACSubsection {
  number: number;
  title: string;
  remark?: string;
}

export interface NACFile {
  fileNumber: number;
  title: string;
  description: string;
  sections: NACSubsection[];
  headings?: Array<{ label: string; beforeSection: number }>;
}

export interface NACDocument {
  id: string;
  file_number: number;
  file_title: string;
  subsection_number: number;
  subsection_title: string;
  academic_year: string;
  title: string;
  filename: string;
  file_url: string | null;
  storage_path: string;
  file_type: string;
  file_size: number;
  visibility: Visibility;
  uploaded_at: string;
  uploaded_by: string | null;
  description: string | null;
}

export const academicYears = ['2024–2025','2025–2026','2026–2027','2027–2028','2028–2029','2029–2030','2030–2031','2031–2032','2032–2033','2033–2034','2034–2035','2035–2036','2036–2037','2037–2038'];
