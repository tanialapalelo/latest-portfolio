# Supabase + Admin Dashboard Design

**Goal:** Replace hardcoded content in `ExperienceSection`, `EducationSection`, `ProjectsSection`, and `CommunitySection` with Supabase-backed data. Add a protected `/admin` route for managing that data via magic-link auth. Blog posts remain as MDX files.

**Stack additions:** `@supabase/ssr`, `@supabase/supabase-js`, Supabase project (Postgres + Auth).

---

## Architecture

One Next.js app, one Supabase project. Public site and admin deploy together.

```
/app
  /admin
    layout.tsx          ← shared sidebar + nav shell
    page.tsx            ← dashboard overview (row counts)
    /login
      page.tsx          ← magic link email form
    /experience
      page.tsx          ← list + inline add/edit/delete
    /education
      page.tsx          ← single-row edit + certifications
    /projects
      page.tsx          ← list + inline add/edit/delete
    /community
      page.tsx          ← list + inline add/edit/delete
  /auth/callback
    route.ts            ← exchanges Supabase code for session cookie, redirects to /admin
middleware.ts           ← guards /admin/* routes, redirects to /admin/login if no session
lib/
  supabase/
    client.ts           ← browser client (used in Client Components if needed)
    server.ts           ← server client (used in Server Components + Server Actions)
```

**Data flow — public site:**
- `ExperienceSection`, `EducationSection`, `ProjectsSection`, `CommunitySection` become async Server Components
- Each calls the Supabase server client with `{ next: { revalidate: 60 } }` for ISR
- Cached pages served to visitors; stale after 60 seconds

**Data flow — admin:**
- Admin pages are Server Components that fetch current data from Supabase
- Forms submit to Server Actions that write to Supabase then call `revalidatePath('/')`
- After mutation, redirect back to the section list

**What is untouched:** `/blog`, `content/blog/`, `getBlogSlugs()`, `WritingSection` — MDX pipeline unchanged.

---

## Database Schema

All tables use UUID primary keys. Multi-row tables have `sort_order int` for display ordering.

### `experiences`
| column | type | notes |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| title | text | e.g. "Frontend Engineer" |
| company | text | full company string |
| location | text | "Jakarta, Indonesia" |
| period | text | "Jun 2023 – Present" |
| accent | text | `'periwinkle'` or `'mint'` |
| bullets | jsonb | string[] — achievement bullets |
| sort_order | int | ascending = top of list |

### `education`
Single row. No `sort_order`.

| column | type | notes |
|---|---|---|
| id | uuid | PK |
| degree | text | "B.Sc. Computer Science" |
| institution | text | "University of Surabaya (UBAYA), Indonesia" |
| year | text | "2021" |
| certifications | jsonb | string[] — cert names in display order |

### `projects`
| column | type | notes |
|---|---|---|
| id | uuid | PK |
| slug | text | matches MDX filename in `content/projects/` |
| tagline | text | one-liner shown on `ProjectCard` |
| accent | text | `'coral'` / `'marigold'` / `'periwinkle'` / `'mint'` |
| tech | jsonb | string[] — tech stack tags |
| sort_order | int | ascending = top of grid |

### `community_events`
| column | type | notes |
|---|---|---|
| id | uuid | PK |
| title | text | talk or event title |
| role | text | "Speaker", "Organizer", etc. |
| event | text | event/conference name |
| date | text | "YYYY-MM" format for sort |
| sort_order | int | ascending = top of list |

---

## Auth & Middleware

**Magic link flow:**
1. `/admin/*` request → middleware checks session cookie → no session → redirect `/admin/login`
2. User enters email → Server Action calls `supabase.auth.signInWithOtp({ email })` → Supabase emails link
3. User clicks link → `/auth/callback?code=...` → route handler exchanges code → sets session cookie → redirect `/admin`
4. Session persists in cookie (default 1-week expiry); middleware passes through on subsequent requests

**Middleware rules:**
- Guard: all `/admin/*` paths except `/admin/login`
- Pass-through: `/auth/callback`, `/admin/login`, all public routes
- Implementation: `@supabase/ssr` `createServerClient` reads/writes cookie on each request

**Environment variables:**
```
NEXT_PUBLIC_SUPABASE_URL       # safe to expose — RLS enforces access
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  # safe to expose — read-only for public data
```

No service role key needed. Public sections use the anon key. Admin mutations also use the anon key — Row Level Security policies on each table restrict writes to authenticated users only.

**RLS policy pattern (applied to all four tables):**
- `SELECT` — allowed for `anon` role (public reads)
- `INSERT`, `UPDATE`, `DELETE` — allowed for `authenticated` role only (magic-link session)

---

## Admin UI

Styled with existing Tailwind tokens (`bg-bg-elevated`, `border-grid-line`, `text-periwinkle`, font-mono) to match the site aesthetic.

**`/admin`** — sidebar layout with links to each section, row-count stats per table.

**Section pages (Experience, Projects, Community):**
- Table/list of existing rows with Edit and Delete buttons
- "Add new" button appends an inline form below the list
- Edit pre-fills the same inline form
- Save → Server Action → Supabase write → `revalidatePath('/')` → redirect to list
- Delete → confirm → Server Action → Supabase delete → `revalidatePath('/')` → redirect

**Education page:** single-row form (always in edit mode), plus a managed list of certifications (add/remove individual strings).

**Form fields per section:**
- **Experience:** title, company, location, period, accent (select), bullets (textarea — one per line), sort_order (number)
- **Education:** degree, institution, year, certifications (textarea — one per line)
- **Projects:** slug, tagline, accent (select), tech (comma-separated), sort_order (number)
- **Community:** title, role, event, date, sort_order (number)

**`/admin/login`:** single email input, "Send magic link" button, confirmation message after submit. No password field. No signup. Minimal — mono aesthetic.

---

## Public Section Migration

Each section component is converted from static import to async Supabase fetch:

| Component | Before | After |
|---|---|---|
| `ExperienceSection` | hardcoded `roles` array | `supabase.from('experiences').select('*').order('sort_order')` |
| `EducationSection` | hardcoded `certifications` array | `supabase.from('education').select('*').single()` |
| `ProjectsSection` | MDX `import()` per slug | `supabase.from('projects').select('*').order('sort_order')` + existing MDX case study links |
| `CommunitySection` | hardcoded data | `supabase.from('community_events').select('*').order('sort_order')` |

ISR: fetch calls use `{ next: { revalidate: 60 } }`. The `next.config.mjs` `output: 'export'` change is reverted — static export is incompatible with ISR and Server Actions.

---

## Out of Scope

- Image uploads (project screenshots, etc.) — future iteration
- Blog post management — MDX stays
- Multi-user admin — single owner (magic link to your email only)
- Public-facing project detail pages beyond existing MDX case studies
