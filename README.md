# S.I.V.E.T. College — B.Sc. Computer Science with Artificial Intelligence

Departmental portal for the B.Sc. Computer Science with Artificial Intelligence programme at S.I.V.E.T. College, Gowrivakkam, Chennai.

## Tech Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Storage, Authentication, Row Level Security)
- **Maps:** OpenStreetMap + Leaflet (no API key required)
- **Deployment:** Vercel

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # production build → dist/
npm run typecheck  # TypeScript check
npm run lint       # ESLint
```

## Environment Variables

Create a `.env` file in the project root (or add these in Vercel → Project → Settings → Environment Variables):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Never commit `.env` — it is gitignored. The `.env.example` file documents the required keys.

**Never expose `SUPABASE_SERVICE_ROLE_KEY` in the browser.** Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are used in the frontend.

## Vercel Deployment

1. Push the repository to GitHub/GitLab/Bitbucket.
2. Import the project in Vercel.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel environment variables.
4. Vercel auto-detects Vite. Build command: `npm run build`. Output directory: `dist`.
5. `vercel.json` handles SPA routing so all paths (e.g. `/nac/15/2`, `/admin`) resolve to `index.html`.

## Supabase Setup

Run the migration in `supabase/migrations/` against your Supabase project (via Supabase Dashboard → SQL Editor):

1. `20260813140702_create_nac_documents_and_storage.sql` — Creates the `nac_documents` table, RLS policies, and the `department-files` storage bucket.
2. `20260816000000_public_read_department_files.sql` — Allows public read access to files stored under the `public/` folder in the bucket.

## Create First Admin

The admin portal at `/admin` uses Supabase Auth (email + password). Authorization is enforced by Row Level Security — only users with `app_metadata.role = 'admin'` can insert, update, or delete documents.

### Steps

1. **Create the user in Supabase Auth:**
   - Go to Supabase Dashboard → Authentication → Users → Add user.
   - Enter the admin email and password. Disable "Email Confirmation" if you want immediate access.

2. **Assign the admin role:**
   - Go to Supabase Dashboard → Authentication → Users → click the user.
   - In the `app_metadata` JSON field, add:
     ```json
     { "role": "admin" }
     ```
   - Save. This is stored in the JWT and checked by RLS policies — it cannot be edited by the user.

3. **Log in at `/admin`** using the email and password.

> Do NOT put admin credentials or the service-role key in the frontend code. The role assignment is done server-side through the Supabase dashboard or a secure admin script.

## NAC Archive

The NAC (National Assessment and Accreditation Council) digital archive organizes 25 file categories (File No. 1–25), each with subsections and academic years. Documents are stored in Supabase Storage (`department-files` bucket) under `nac/file-XX/YYYY-YYYY/filename`. Metadata is stored in the `nac_documents` table.

- **Public documents** are visible to all visitors.
- **Restricted documents** require admin authentication and are accessed via signed URLs.

## Contact

S.I.V.E.T. College, Velachery Main Road, Gowrivakkam, Chennai – 600073
