import React, { useEffect, useMemo, useState } from 'react';
import { 
  ArrowUpRight, 
  ChevronLeft, 
  Download, 
  ExternalLink, 
  FileText, 
  LockKeyhole, 
  Search, 
  SlidersHorizontal 
} from 'lucide-react';

import { nacStructure } from '@/data/nacStructure';
import { academicYears, type NACDocument, type NACFile } from '@/types/nac';
import { fetchDocuments, getDocumentUrl } from '@/lib/nac';
import { Reveal } from '@/components/Shell';

export function ArchiveLanding() {
  return (
    <main className="bg-forest pt-32 text-cream">
      <section className="border-b border-cream/12 px-5 pb-16 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <p className="eyebrow text-lime">QUALITY ASSURANCE / REPOSITORY</p>
            <h1 className="display mt-6 max-w-4xl">
              NAC <em className="text-lime">Digital</em>
              <br />
              Archive.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-cream/60">
              Academic documentation, evidence and quality assurance records — organised by file, subsection and academic year.
            </p>
            <div className="mt-14 grid grid-cols-3 gap-px bg-cream/12 py-px md:max-w-2xl">
              {[
                ['25', 'FILES'],
                ['100+', 'DOCUMENT TYPES'],
                ['MULTI', 'YEAR ARCHIVE'],
              ].map(([value, label]) => (
                <div key={label} className="bg-forest px-4 py-8 text-center">
                  <strong className="block font-serif text-3xl font-medium text-lime">{value}</strong>
                  <span className="mt-2 block text-[9px] font-bold tracking-[0.16em] text-cream/50">{label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow text-lime">ARCHIVE INDEX</p>
              <h2 className="section-title mt-3 text-cream">Explore the files</h2>
            </div>
            <span className="hidden text-xs uppercase tracking-[0.18em] text-cream/40 md:block">01 — 25</span>
          </div>
        </Reveal>
        <div className="grid gap-px bg-cream/10 sm:grid-cols-2 lg:grid-cols-3">
          {nacStructure.map((file) => (
            <FileCard key={file.fileNumber} file={file} />
          ))}
        </div>
      </section>
    </main>
  );
}

function FileCard({ file }: { file: NACFile }) {
  return (
    <Reveal>
      <a href={`/nac/${file.fileNumber}`} className="group block bg-forest p-6 transition-colors hover:bg-deep-emerald md:p-8">
        <span className="font-mono text-xs text-lime/70">FILE NO. {String(file.fileNumber).padStart(2, '0')}</span>
        <h3 className="mt-8 min-h-[52px] text-xl font-bold tracking-tight text-cream">{file.title}</h3>
        <p className="mt-3 min-h-[44px] text-sm leading-6 text-cream/50">{file.description}</p>
        <span className="mt-8 inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] text-lime">
          EXPLORE <ArrowUpRight size={14} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </a>
    </Reveal>
  );
}

export function CategoryPage({ fileNumber }: { fileNumber: number }) {
  const file = nacStructure.find((item) => item.fileNumber === fileNumber);
  const [docs, setDocs] = useState<NACDocument[]>([]);

  useEffect(() => {
    if (file) {
      fetchDocuments({ fileNumber })
        .then(setDocs)
        .catch(() => setDocs([]));
    }
  }, [fileNumber, file]);

  if (!file) return <NotFound />;

  return (
    <main className="bg-forest px-5 pb-24 pt-32 text-cream lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <a href="/nac" className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-lime/70 transition hover:text-lime">
            <ChevronLeft size={15} /> NAC FILES
          </a>
          <p className="eyebrow mt-12 text-cream/40">FILE NO. {String(file.fileNumber).padStart(2, '0')}</p>
          <h1 className="display mt-4 max-w-4xl">{file.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-cream/60">{file.description}</p>
        </Reveal>
        <div className="mt-16 border-t border-cream/12">
          {file.headings?.map((h) => (
            <div key={h.label} className="border-b border-cream/12 bg-deep-emerald px-5 py-5 text-sm font-bold tracking-[0.12em] text-lime">
              {h.label}
            </div>
          ))}
          {file.sections.map((section) => {
            const sectionDocs = docs.filter((doc) => doc.subsection_number === section.number);
            return (
              <div key={section.number} className="group grid gap-5 border-b border-cream/12 py-7 md:grid-cols-[90px_1fr_auto] md:items-center">
                <span className="font-mono text-sm text-lime/70">
                  {section.number === 0 ? '—' : String(section.number).padStart(2, '0')}
                </span>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-cream">{section.title}</h2>
                  {section.remark && <p className="mt-2 text-xs italic text-cream/45">Remark: {section.remark}</p>}
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-cream/40">
                    {sectionDocs.length ? `${sectionDocs.length} DOCUMENT${sectionDocs.length === 1 ? '' : 'S'}` : 'NO DOCUMENTS YET'}
                  </p>
                </div>
                <a href={`/nac/${file.fileNumber}/${section.number}`} className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] text-lime transition hover:text-cream">
                  OPEN <ArrowUpRight size={14} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export function SubsectionPage({ fileNumber, subsectionNumber }: { fileNumber: number; subsectionNumber: number }) {
  const file = nacStructure.find((item) => item.fileNumber === fileNumber);
  const subsection = file?.sections.find((item) => item.number === subsectionNumber);
  const [docs, setDocs] = useState<NACDocument[]>([]);
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    if (file && subsection) {
      fetchDocuments({ fileNumber, subsectionNumber, academicYear: year || undefined })
        .then(setDocs)
        .catch(() => setDocs([]));
    }
  }, [fileNumber, subsectionNumber, year, file, subsection]);

  const filtered = useMemo(
    () => docs.filter((doc) => `${doc.title} ${doc.filename}`.toLowerCase().includes(search.toLowerCase())),
    [docs, search]
  );

  if (!file || !subsection) return <NotFound />;

  return (
    <main className="bg-forest px-5 pb-24 pt-32 text-cream lg:px-10">
      <div className="mx-auto max-w-[1100px]">
        <Reveal>
          <a href={`/nac/${file.fileNumber}`} className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-lime/70 transition hover:text-lime">
            <ChevronLeft size={15} /> {file.title}
          </a>
          <p className="eyebrow mt-10 text-cream/40">HOME / NAC FILES / {file.title} / {subsection.title}</p>
          <h1 className="display mt-6 max-w-4xl">{subsection.title}</h1>
          <p className="mt-5 text-sm text-cream/55">{subsection.remark ?? 'Documents organised by academic year.'}</p>
        </Reveal>
        <div className="mt-10 grid gap-3 border-y border-cream/12 py-4 md:grid-cols-[1fr_220px_auto]">
          <label className="relative">
            <Search size={16} className="absolute left-3 top-3 text-cream/40" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search this subsection" className="field pl-10" />
          </label>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="field">
            <option value="">All academic years</option>
            {academicYears.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <span className="inline-flex items-center justify-center gap-2 px-3 text-[10px] font-bold tracking-[0.16em] text-cream/45">
            <SlidersHorizontal size={14} /> {filtered.length} RESULTS
          </span>
        </div>
        <div className="mt-10 space-y-3">
          {filtered.length ? (
            filtered.map((doc) => <DocumentRow key={doc.id} document={doc} />)
          ) : (
            <div className="border border-dashed border-cream/20 px-6 py-16 text-center">
              <FileText className="mx-auto text-lime/50" size={28} />
              <p className="mt-4 text-sm text-cream/50">No documents have been uploaded here yet.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function DocumentRow({ document }: { document: NACDocument }) {
  // Handler for viewing documents
  const handleView = () => {
    const url = getDocumentUrl(document);
    if (!url) return alert(`No valid file path found for: ${document.title}`);

    const fileType = (document.file_type || '').toLowerCase();
    const fileName = (document.filename || '').toLowerCase();

    const isExcel =
      fileType.includes('excel') ||
      fileType.includes('spreadsheetml') ||
      fileName.endsWith('.xlsx') ||
      fileName.endsWith('.xls');

    const isWord =
      fileType.includes('word') ||
      fileType.includes('wordprocessingml') ||
      fileName.endsWith('.docx') ||
      fileName.endsWith('.doc');

    if (isExcel || isWord) {
      const viewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
      window.open(viewerUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Direct download handler (No fetch / No CORS errors)
  const handleDownload = () => {
    const fileUrl = getDocumentUrl(document);
    if (!fileUrl) return alert(`No valid file path found for: ${document.title}`);

    // If using Supabase Storage, append download query param to force browser download
    const downloadUrl = fileUrl.includes('supabase.co') 
      ? `${fileUrl}${fileUrl.includes('?') ? '&' : '?'}download=` 
      : fileUrl;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    link.setAttribute('download', document.filename || 'nac-document');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <article className="flex flex-col gap-5 border border-cream/12 bg-deep-emerald p-5 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center bg-lime text-forest">
          <FileText size={19} />
        </div>
        <div>
          <h2 className="font-bold text-cream">{document.title}</h2>
          <p className="mt-1 text-xs text-cream/45">
            {document.filename} · {document.academic_year} · {(document.file_size / 1024).toFixed(0)} KB
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.14em] text-cream/45">
            {document.visibility === 'restricted' && <LockKeyhole size={12} />} {document.visibility}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {/* VIEW BUTTON */}
        <button
          type="button"
          onClick={handleView}
          className="inline-flex items-center gap-1.5 rounded bg-cream px-3 py-1.5 text-xs font-semibold text-deep-emerald transition-colors hover:bg-lime"
        >
          <ExternalLink size={14} />
          VIEW
        </button>

        {/* DOWNLOAD BUTTON */}
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 rounded bg-cream px-3 py-1.5 text-xs font-semibold text-deep-emerald transition-colors hover:bg-lime"
        >
          <Download size={14} />
          DOWNLOAD
        </button>
      </div>
    </article>
  );
}
function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-forest p-6 text-cream">
      <div>
        <h1 className="display text-cream">Not found</h1>
        <a href="/nac" className="mt-6 inline-block text-sm font-bold text-lime">
          ← Return to archive
        </a>
      </div>
    </main>
  );
}
