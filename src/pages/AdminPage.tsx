import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  LogIn, LogOut, ShieldCheck, UploadCloud, LayoutDashboard, FileText,
  Search, Trash2, Pencil, Download, Eye,
  Replace, X, AlertCircle, CheckCircle2, Files, Lock, Globe, Settings, Key, Mail
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { nacStructure } from '@/data/nacStructure';
import { academicYears, type NACDocument, type Visibility } from '@/types/nac';
import { Brand } from '@/components/Shell';
import { fetchDocuments, getDocumentUrl } from '@/lib/nac';
import { deleteDocument, updateDocument, replaceFile, formatFileSize, formatDate } from '@/lib/admin';

const ACCEPTED_TYPES = [
  'application/pdf', 'image/png', 'image/jpeg', 'image/webp',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];
const ACCEPTED_EXTS = '.pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx';
const MAX_FILE_SIZE = 50 * 1024 * 1024;

type Tab = 'overview' | 'documents' | 'upload' | 'settings';

export function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (!next) setIsAdmin(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) { setIsAdmin(false); return; }
    
    // Checks for metadata role OR specific allowed email fallback
    const role = (session.user.app_metadata as Record<string, unknown>)?.role;
    const hasAdminRole = role === 'admin';
    
    setIsAdmin(hasAdminRole);
  }, [session]);

  if (loading) return <LoadingScreen />;
  if (!session) return <Login />;
  if (!isAdmin) return <AccessDenied onLogout={() => supabase.auth.signOut()} />;
  return <AdminDashboard onLogout={() => supabase.auth.signOut()} />;
}

function LoadingScreen() {
  return <main className="grid min-h-screen place-items-center bg-forest text-cream">Loading secure access…</main>;
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setMessage('Sign-in was not accepted. Please check your details.');
  };
  return (
    <main className="grid min-h-screen place-items-center bg-forest px-5 text-cream">
      <form onSubmit={submit} className="w-full max-w-md border border-cream/12 bg-deep-emerald p-8 md:p-12">
        <Brand />
        <div className="mt-10 grid h-12 w-12 place-items-center bg-lime text-forest"><ShieldCheck /></div>
        <p className="eyebrow mt-8 text-lime">SECURE ADMIN AREA</p>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight">Archive access</h1>
        <p className="mt-4 text-sm leading-6 text-cream/55">Sign in with an administrator account to manage confidential documents.</p>
        <label className="mt-8 block field-label">Email<input className="field mt-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label className="mt-4 block field-label">Password<input className="field mt-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        {message && <p className="mt-4 text-sm text-red-400">{message}</p>}
        <button className="button-dark mt-7 w-full justify-center" disabled={busy}><LogIn size={15} /> {busy ? 'SIGNING IN…' : 'SIGN IN'}</button>
      </form>
    </main>
  );
}

function AccessDenied({ onLogout }: { onLogout: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-forest px-5 text-cream">
      <div className="max-w-md text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center bg-red-500/20 text-red-400"><AlertCircle size={32} /></div>
        <h1 className="display mt-8 text-cream">Access denied</h1>
        <p className="mt-4 text-sm leading-6 text-cream/55">Your account does not have administrator privileges. Contact the department to request access.</p>
        <button onClick={onLogout} className="button-outline mt-8 mx-auto"><LogOut size={14} /> SIGN OUT</button>
      </div>
    </main>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('overview');
  const [docs, setDocs] = useState<NACDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    setLoadingDocs(true);
    fetchDocuments({}).then((d) => { setDocs(d); setLoadingDocs(false); }).catch(() => { setDocs([]); setLoadingDocs(false); });
  }, [refreshKey]);

  return (
    <main className="min-h-screen bg-forest px-5 pb-24 pt-8 text-cream lg:px-10">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-center justify-between">
          <Brand />
          <button onClick={onLogout} className="button-outline"><LogOut size={14} /> SIGN OUT</button>
        </div>
        <nav className="mt-12 flex gap-1 border-b border-cream/12">
          {([
            ['overview', 'Overview', <LayoutDashboard size={15} key="o" />],
            ['documents', 'NAC Documents', <FileText size={15} key="d" />],
            ['upload', 'Upload', <UploadCloud size={15} key="u" />],
            ['settings', 'Settings', <Settings size={15} key="s" />],
          ] as const).map(([key, label, icon]) => (
            <button key={key} onClick={() => setTab(key as Tab)}
              className={`flex items-center gap-2 px-5 py-3 text-[11px] font-bold tracking-[0.14em] transition-colors ${tab === key ? 'border-b-2 border-lime text-lime' : 'text-cream/50 hover:text-cream'}`}>
              {icon} {label.toUpperCase()}
            </button>
          ))}
        </nav>
        <div className="mt-10">
          {tab === 'overview' && <Overview docs={docs} loading={loadingDocs} setTab={setTab} />}
          {tab === 'documents' && <DocumentManager docs={docs} loading={loadingDocs} onRefresh={refresh} />}
          {tab === 'upload' && <UploadPanel onUploaded={refresh} />}
          {tab === 'settings' && <SettingsPanel />}
        </div>
      </div>
    </main>
  );
}

function Overview({ docs, loading, setTab }: { docs: NACDocument[]; loading: boolean; setTab: (t: Tab) => void }) {
  const publicCount = docs.filter((d) => d.visibility === 'public').length;
  const restrictedCount = docs.filter((d) => d.visibility === 'restricted').length;
  const latest = docs[0];
  const categories = new Set(docs.map((d) => d.file_number)).size;

  const cards = [
    { label: 'TOTAL DOCUMENTS', value: loading ? '—' : String(docs.length), icon: <Files size={18} /> },
    { label: 'PUBLIC DOCUMENTS', value: loading ? '—' : String(publicCount), icon: <Globe size={18} /> },
    { label: 'RESTRICTED DOCUMENTS', value: loading ? '—' : String(restrictedCount), icon: <Lock size={18} /> },
    { label: 'FILE CATEGORIES', value: loading ? '—' : String(categories), icon: <FileText size={18} /> },
  ];

  return (
    <div>
      <p className="eyebrow text-lime">ADMIN / OVERVIEW</p>
      <h1 className="display mt-4">Dashboard.</h1>
      <div className="mt-12 grid gap-px bg-cream/12 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-forest p-8">
            <div className="text-lime/70">{card.icon}</div>
            <strong className="mt-6 block font-serif text-4xl font-medium text-lime">{card.value}</strong>
            <span className="mt-3 block text-[10px] font-bold tracking-[0.16em] text-cream/50">{card.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-10 border border-cream/12 bg-deep-emerald p-8">
        <p className="eyebrow text-lime/70">LATEST UPLOAD</p>
        {loading ? <p className="mt-4 text-sm text-cream/50">Loading…</p> : latest ? (
          <div className="mt-4">
            <h3 className="text-lg font-bold text-cream">{latest.title}</h3>
            <p className="mt-2 text-sm text-cream/55">File No. {String(latest.file_number).padStart(2, '0')} · {latest.subsection_title} · {latest.academic_year} · {formatDate(latest.uploaded_at)}</p>
          </div>
        ) : <p className="mt-4 text-sm text-cream/50">No documents uploaded yet.</p>}
      </div>
      <button onClick={() => setTab('documents')} className="button-dark mt-8">VIEW ALL DOCUMENTS</button>
    </div>
  );
}

function DocumentManager({ docs, loading, onRefresh }: { docs: NACDocument[]; loading: boolean; onRefresh: () => void }) {
  const [search, setSearch] = useState('');
  const [filterFile, setFilterFile] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterVisibility, setFilterVisibility] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sort, setSort] = useState('newest');
  const [editDoc, setEditDoc] = useState<NACDocument | null>(null);
  const [deleteDoc, setDeleteDoc] = useState<NACDocument | null>(null);

  const filtered = useMemo(() => {
    let result = docs;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((d) =>
        `${d.title} ${d.filename} ${d.file_title} ${d.subsection_title} ${d.academic_year} ${d.description ?? ''}`.toLowerCase().includes(q));
    }
    if (filterFile) result = result.filter((d) => d.file_number === Number(filterFile));
    if (filterYear) result = result.filter((d) => d.academic_year === filterYear);
    if (filterVisibility) result = result.filter((d) => d.visibility === filterVisibility);
    if (filterType) result = result.filter((d) => d.file_type.includes(filterType));
    if (sort === 'newest') result = [...result].sort((a, b) => b.uploaded_at.localeCompare(a.uploaded_at));
    if (sort === 'oldest') result = [...result].sort((a, b) => a.uploaded_at.localeCompare(b.uploaded_at));
    if (sort === 'az') result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'za') result = [...result].sort((a, b) => b.title.localeCompare(a.title));
    return result;
  }, [docs, search, filterFile, filterYear, filterVisibility, filterType, sort]);

  return (
    <div>
      <p className="eyebrow text-lime">ADMIN / DOCUMENTS</p>
      <h1 className="display mt-4">Manage <em className="text-lime">documents.</em></h1>

      <div className="mt-10 grid gap-3 border-y border-cream/12 py-4 md:grid-cols-[1fr_160px_160px_140px_140px_140px]">
        <label className="relative">
          <Search size={16} className="absolute left-3 top-3 text-cream/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents…" className="field pl-10" />
        </label>
        <select value={filterFile} onChange={(e) => setFilterFile(e.target.value)} className="field">
          <option value="">All files</option>
          {nacStructure.map((f) => <option key={f.fileNumber} value={f.fileNumber}>{String(f.fileNumber).padStart(2, '0')}</option>)}
        </select>
        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="field">
          <option value="">All years</option>
          {academicYears.map((y) => <option key={y}>{y}</option>)}
        </select>
        <select value={filterVisibility} onChange={(e) => setFilterVisibility(e.target.value)} className="field">
          <option value="">Visibility</option>
          <option value="public">Public</option>
          <option value="restricted">Restricted</option>
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="field">
          <option value="">All types</option>
          <option value="pdf">PDF</option>
          <option value="image">Image</option>
          <option value="word">Word</option>
          <option value="excel">Excel</option>
          <option value="powerpoint">PowerPoint</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="field">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A–Z</option>
          <option value="za">Z–A</option>
        </select>
      </div>

      <p className="mt-4 text-[10px] font-bold tracking-[0.16em] text-cream/45">{filtered.length} RESULT{filtered.length === 1 ? '' : 'S'}</p>

      {loading ? <p className="mt-8 text-sm text-cream/50">Loading documents…</p> : filtered.length === 0 ? (
        <div className="mt-8 border border-dashed border-cream/20 px-6 py-16 text-center">
          <FileText className="mx-auto text-lime/50" size={28} />
          <p className="mt-4 text-sm text-cream/50">No documents match your filters.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-cream/12 text-[10px] font-bold tracking-[0.14em] text-cream/45">
                <th className="p-3">FILE</th>
                <th className="p-3">TITLE</th>
                <th className="p-3 hidden md:table-cell">SUBSECTION</th>
                <th className="p-3 hidden lg:table-cell">YEAR</th>
                <th className="p-3 hidden lg:table-cell">TYPE</th>
                <th className="p-3">VISIBILITY</th>
                <th className="p-3 hidden md:table-cell">UPLOADED</th>
                <th className="p-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id} className="border-b border-cream/8 hover:bg-deep-emerald/50">
                  <td className="p-3 font-mono text-xs text-lime/70">{String(doc.file_number).padStart(2, '0')}</td>
                  <td className="p-3 font-bold text-cream">{doc.title}</td>
                  <td className="p-3 hidden md:table-cell text-cream/60">{doc.subsection_title}</td>
                  <td className="p-3 hidden lg:table-cell text-cream/60">{doc.academic_year}</td>
                  <td className="p-3 hidden lg:table-cell text-cream/60 text-xs">{doc.file_type.split('/').pop()}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.12em] ${doc.visibility === 'public' ? 'text-lime' : 'text-orange-400'}`}>
                      {doc.visibility === 'public' ? <Globe size={11} /> : <Lock size={11} />} {doc.visibility}
                    </span>
                  </td>
                  <td className="p-3 hidden md:table-cell text-cream/50 text-xs">{formatDate(doc.uploaded_at)}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        title="View File"
                        onClick={async () => {
                          const url = await getDocumentUrl(doc);
                          if (url) window.open(url, '_blank', 'noopener,noreferrer');
                          else alert('Failed to get file URL');
                        }}
                        className="p-1 text-cream/70 hover:text-lime transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        type="button"
                        title="Download File"
                        onClick={async () => {
                          const url = await getDocumentUrl(doc);
                          if (!url) return alert('Failed to get file URL');
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = doc.filename || 'download';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="p-1 text-cream/70 hover:text-lime transition-colors"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        type="button"
                        title="Edit Document"
                        onClick={() => setEditDoc(doc)}
                        className="p-1 text-cream/70 hover:text-lime transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        title="Delete Document"
                        onClick={() => setDeleteDoc(doc)}
                        className="p-1 text-cream/70 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editDoc && <EditModal doc={editDoc} onClose={() => setEditDoc(null)} onSaved={() => { setEditDoc(null); onRefresh(); }} />}
      {deleteDoc && <DeleteModal doc={deleteDoc} onClose={() => setDeleteDoc(null)} onDeleted={() => { setDeleteDoc(null); onRefresh(); }} />}
    </div>
  );
}

function EditModal({ doc, onClose, onSaved }: { doc: NACDocument; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(doc.title);
  const [description, setDescription] = useState(doc.description ?? '');
  const [year, setYear] = useState(doc.academic_year);
  const [visibility, setVisibility] = useState<Visibility>(doc.visibility);
  const [fileNumber, setFileNumber] = useState(doc.file_number);
  const [subsectionNumber, setSubsectionNumber] = useState(doc.subsection_number);
  const [replace, setReplace] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const active = nacStructure.find((f) => f.fileNumber === fileNumber);
  const current = active?.sections.find((s) => s.number === subsectionNumber) ?? active?.sections[0];

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setStatus('Saving…');
    if (!active || !current) { setStatus('Invalid file/subsection.'); setBusy(false); return; }
    if (replace) {
      setStatus('Replacing file…');
      const { error: replaceError } = await replaceFile(doc, replace);
      if (replaceError) { setStatus(`Replace failed: ${replaceError}`); setBusy(false); return; }
    }
    const { error } = await updateDocument(doc.id, {
      title, description, academic_year: year, visibility,
      file_number: fileNumber, file_title: active.title,
      subsection_number: current.number, subsection_title: current.title,
    });
    if (error) { setStatus(`Update failed: ${error}`); setBusy(false); return; }
    setStatus('Saved successfully.');
    setBusy(false);
    setTimeout(onSaved, 600);
  };

  return (
    <Modal onClose={onClose} title="Edit document">
      <form onSubmit={save} className="space-y-5">
        <label className="block field-label">Document title<input className="field mt-2" value={title} onChange={(e) => setTitle(e.target.value)} required /></label>
        <label className="block field-label">Description<textarea className="field mt-2 min-h-[80px]" value={description} onChange={(e) => setDescription(e.target.value)} /></label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field-label">File number<select className="field mt-2" value={fileNumber} onChange={(e) => setFileNumber(Number(e.target.value))}>{nacStructure.map((f) => <option key={f.fileNumber} value={f.fileNumber}>{String(f.fileNumber).padStart(2, '0')} — {f.title}</option>)}</select></label>
          <label className="field-label">Subsection<select className="field mt-2" value={subsectionNumber} onChange={(e) => setSubsectionNumber(Number(e.target.value))}>{active?.sections.map((s) => <option key={s.number} value={s.number}>{s.number} — {s.title}</option>)}</select></label>
          <label className="field-label">Academic year<select className="field mt-2" value={year} onChange={(e) => setYear(e.target.value)}>{academicYears.map((y) => <option key={y}>{y}</option>)}</select></label>
          <label className="field-label">Visibility<select className="field mt-2" value={visibility} onChange={(e) => setVisibility(e.target.value as Visibility)}><option value="restricted">Restricted</option><option value="public">Public</option></select></label>
        </div>
        <div>
          <p className="field-label mb-2">Replace file (optional)</p>
          <label className="flex cursor-pointer items-center gap-3 border border-dashed border-cream/20 bg-deep-emerald p-4 transition-colors hover:border-lime/40">
            <Replace className="text-lime" size={18} />
            <span className="text-sm text-cream/60">{replace ? replace.name : 'Choose a new file to replace the current one'}</span>
            <input className="sr-only" type="file" accept={ACCEPTED_EXTS} onChange={(e) => setReplace(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        {status && <p className={`text-sm ${status.includes('failed') || status.includes('Invalid') ? 'text-red-400' : 'text-lime'}`}>{status}</p>}
        <div className="flex gap-3">
          <button className="button-dark" disabled={busy}><CheckCircle2 size={15} /> SAVE CHANGES</button>
          <button type="button" onClick={onClose} className="button-outline">CANCEL</button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteModal({ doc, onClose, onDeleted }: { doc: NACDocument; onClose: () => void; onDeleted: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const confirm = async () => {
    setBusy(true);
    setError('');
    const { error: err } = await deleteDocument(doc);
    setBusy(false);
    if (err) { setError(err); return; }
    onDeleted();
  };
  return (
    <Modal onClose={onClose} title="Delete document">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center bg-red-500/20 text-red-400"><AlertCircle size={24} /></div>
        <div>
          <p className="text-sm leading-6 text-cream/70">Are you sure you want to delete <strong className="text-cream">{doc.title}</strong>? This will remove both the database record and the stored file. This cannot be undone.</p>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </div>
      </div>
      <div className="mt-8 flex gap-3">
        <button onClick={confirm} className="button-dark" disabled={busy} style={{ background: '#dc2626', color: '#fff' }}><Trash2 size={15} /> {busy ? 'DELETING…' : 'DELETE'}</button>
        <button onClick={onClose} className="button-outline">CANCEL</button>
      </div>
    </Modal>
  );
}

function UploadPanel({ onUploaded }: { onUploaded: () => void }) {
  const [fileNumber, setFileNumber] = useState(1);
  const [section, setSection] = useState(1);
  const [year, setYear] = useState(academicYears[1]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('restricted');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const active = nacStructure.find((f) => f.fileNumber === fileNumber);
  useEffect(() => { setSection(active?.sections[0]?.number ?? 1); }, [fileNumber, active]);

  const validate = (f: File): string | null => {
    if (!f) return 'No file selected.';
    if (f.size > MAX_FILE_SIZE) return `File is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`;
    const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
    const validExts = ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
    if (!validExts.includes(ext)) return `Unsupported file type: .${ext}. Allowed: ${ACCEPTED_EXTS}`;
    if (ACCEPTED_TYPES.includes(f.type) || f.type === '') return null;
    return null;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) { setError('Please choose a file.'); return; }
    const validationError = validate(file);
    if (validationError) { setError(validationError); return; }
    setBusy(true);
    setError('');
    setStatus('Preparing…');
    const current = active?.sections.find((s) => s.number === section);
    if (!active || !current) { setError('Choose a valid archive location.'); setBusy(false); return; }

    const safeYear = String(year).replace(/[^a-zA-Z0-9-]/g, '-');
    const cleanExt = file.name.split('.').pop()?.toLowerCase() || 'file';
    const rawBaseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const safeBaseName = rawBaseName.replace(/[^a-zA-Z0-9]/g, '_');

    const path = `nac/file-${String(fileNumber).padStart(2, '0')}/${safeYear}/${crypto.randomUUID()}-${safeBaseName}.${cleanExt}`;
    setStatus('Uploading…');
    const upload = await supabase.storage.from('department-files').upload(path, file, { contentType: file.type || 'application/octet-stream', upsert: false });
    if (upload.error) { setError(`Upload failed: ${upload.error.message}`); setStatus(''); setBusy(false); return; }
    setStatus('Saving record…');
    const { data: { user } } = await supabase.auth.getUser();
    const insert = await supabase.from('nac_documents').insert({
      file_number: fileNumber, file_title: active.title, subsection_number: current.number, subsection_title: current.title,
      academic_year: year, title: title || file.name, filename: file.name, storage_path: path,
      file_type: file.type || 'application/octet-stream', file_size: file.size, visibility, uploaded_by: user?.id ?? null,
      description: description || null,
    }).select().maybeSingle();
    if (insert.error) {
      await supabase.storage.from('department-files').remove([path]);
      setError(`Database error: ${insert.error.message}. The uploaded file has been cleaned up.`);
      setStatus('');
      setBusy(false);
      return;
    }
    setStatus('Completed. Document added to the archive.');
    setBusy(false);
    setTitle(''); setDescription(''); setFile(null);
    onUploaded();
    setTimeout(() => setStatus(''), 4000);
  };

  return (
    <div>
      <p className="eyebrow text-lime">ADMIN / UPLOAD</p>
      <h1 className="display mt-4">Upload <em className="text-lime">evidence.</em></h1>
      <form onSubmit={submit} className="mt-10 max-w-2xl border-t border-cream/12 pt-8">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="field-label">File number<select className="field mt-2" value={fileNumber} onChange={(e) => setFileNumber(Number(e.target.value))}>{nacStructure.map((f) => <option key={f.fileNumber} value={f.fileNumber}>{String(f.fileNumber).padStart(2, '0')} — {f.title}</option>)}</select></label>
          <label className="field-label">Subsection<select className="field mt-2" value={section} onChange={(e) => setSection(Number(e.target.value))}>{active?.sections.map((s) => <option key={s.number} value={s.number}>{s.number} — {s.title}</option>)}</select></label>
          <label className="field-label">Academic year<select className="field mt-2" value={year} onChange={(e) => setYear(e.target.value)}>{academicYears.map((y) => <option key={y}>{y}</option>)}</select></label>
          <label className="field-label">Visibility<select className="field mt-2" value={visibility} onChange={(e) => setVisibility(e.target.value as Visibility)}><option value="restricted">Restricted — sign-in required</option><option value="public">Public — visible to everyone</option></select></label>
        </div>
        <label className="field-label mt-5 block">Document title<input className="field mt-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Result Analysis 2025" /></label>
        <label className="field-label mt-5 block">Description<textarea className="field mt-2 min-h-[80px]" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" /></label>
        <label className="mt-5 flex cursor-pointer items-center gap-4 border border-dashed border-cream/20 bg-deep-emerald p-6 transition-colors hover:border-lime/40">
          <UploadCloud className="text-lime" />
          <span className="text-sm text-cream/60">{file ? `${file.name} · ${formatFileSize(file.size)}` : 'Choose a PDF, image or document file'}</span>
          <input className="sr-only" type="file" accept={ACCEPTED_EXTS} onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
        </label>
        {error && <div className="mt-4 flex items-start gap-2 text-sm text-red-400"><AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}</div>}
        {status && <div className="mt-4 flex items-start gap-2 text-sm text-lime"><CheckCircle2 size={16} className="mt-0.5 shrink-0" /> {status}</div>}
        <button className="button-dark mt-7" disabled={busy || !file}><UploadCloud size={15} /> {busy ? 'PROCESSING…' : 'UPLOAD DOCUMENT'}</button>
      </form>
    </div>
  );
}

function SettingsPanel() {
  const [newEmail, setNewEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [emailError, setEmailError] = useState('');
  const [busyEmail, setBusyEmail] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [busyPassword, setBusyPassword] = useState(false);

  const handleEmailUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setBusyEmail(true);
    setEmailStatus('');
    setEmailError('');

    const { error } = await supabase.auth.updateUser({ email: newEmail });

    setBusyEmail(false);
    if (error) {
      setEmailError(`Failed to update email: ${error.message}`);
    } else {
      setEmailStatus('Confirmation links sent to your old and new email addresses. Please verify to apply changes.');
      setNewEmail('');
    }
  };

  const handlePasswordUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    setBusyPassword(true);
    setPasswordStatus('');
    setPasswordError('');

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setBusyPassword(false);
    if (error) {
      setPasswordError(`Failed to update password: ${error.message}`);
    } else {
      setPasswordStatus('Password updated successfully!');
      setPasswordError('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div>
      <p className="eyebrow text-lime">ADMIN / SETTINGS</p>
      <h1 className="display mt-4">Account <em className="text-lime">settings.</em></h1>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {/* Update Email */}
        <form onSubmit={handleEmailUpdate} className="border border-cream/12 bg-deep-emerald p-8">
          <div className="flex items-center gap-3 text-lime">
            <Mail size={20} />
            <h2 className="text-lg font-bold text-cream">Change Email Address</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-cream/55">
            Update the email address associated with your administrator account.
          </p>
          <label className="field-label mt-6 block">
            New Email Address
            <input
              type="email"
              className="field mt-2"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </label>
          {emailError && (
            <div className="mt-4 flex items-start gap-2 text-sm text-red-400">
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> {emailError}
            </div>
          )}
          {emailStatus && (
            <div className="mt-4 flex items-start gap-2 text-sm text-lime">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> {emailStatus}
            </div>
          )}
          <button className="button-dark mt-6" disabled={busyEmail || !newEmail}>
            <Mail size={15} /> {busyEmail ? 'UPDATING…' : 'UPDATE EMAIL'}
          </button>
        </form>

        {/* Update Password */}
        <form onSubmit={handlePasswordUpdate} className="border border-cream/12 bg-deep-emerald p-8">
          <div className="flex items-center gap-3 text-lime">
            <Key size={20} />
            <h2 className="text-lg font-bold text-cream">Change Password</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-cream/55">
            Ensure your account is using a long, secure password.
          </p>
          <label className="field-label mt-6 block">
            New Password
            <input
              type="password"
              className="field mt-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </label>
          <label className="field-label mt-4 block">
            Confirm New Password
            <input
              type="password"
              className="field mt-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </label>
          {passwordError && (
            <div className="mt-4 flex items-start gap-2 text-sm text-red-400">
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> {passwordError}
            </div>
          )}
          {passwordStatus && (
            <div className="mt-4 flex items-start gap-2 text-sm text-lime">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> {passwordStatus}
            </div>
          )}
          <button className="button-dark mt-6" disabled={busyPassword || !newPassword || !confirmPassword}>
            <Key size={15} /> {busyPassword ? 'SAVING…' : 'UPDATE PASSWORD'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl border border-cream/12 bg-deep-emerald p-6 text-cream shadow-2xl md:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-cream/12 pb-4">
          <h2 className="font-serif text-2xl font-medium">{title}</h2>
          <button onClick={onClose} className="p-1 text-cream/50 hover:text-cream transition-colors">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
