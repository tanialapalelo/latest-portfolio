# Supabase + Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded content in four homepage sections with Supabase-backed data and add a protected `/admin` route for managing that data via magic-link auth.

**Architecture:** One Next.js app, one Supabase project. Public sections become async Server Components fetching via a public ISR client (`lib/supabase/public.ts`, `revalidate: 60`). Admin pages use an auth-aware server client (`lib/supabase/server.ts`). Middleware guards `/admin/*`. Server Actions handle all mutations and call `revalidatePath('/')` after each write. Blog stays as MDX.

**Tech Stack:** Next.js 16 App Router, `@supabase/ssr`, `@supabase/supabase-js`, Tailwind CSS v4, Vitest + React Testing Library.

## Global Constraints

- Email throughout the project is `taniasilvanalapalelo@gmail.com`.
- `next.config.mjs` must NOT have `output: 'export'`, `images: { unoptimized: true }`, or `trailingSlash: true` — those break ISR and Server Actions. Revert this in Task 1.
- All public section components remain zero-prop async Server Components.
- Admin pages use existing Tailwind tokens only (`bg-bg`, `bg-bg-elevated`, `border-grid-line`, `text-periwinkle`, `font-mono`, `text-ink`, `text-ink-dim`).
- Accent color is stored as a base name (`'periwinkle'`, `'mint'`, `'coral'`, `'marigold'`) — components derive `text-*` and `border-*` classes from it.
- `pnpm` is the package manager. All run commands use `pnpm`.
- Tests use `globals: true` (no import needed for `vi`, `test`, `expect`).
- Never commit `.env.local`.

---

## File Map

**New files:**
```
lib/supabase/server.ts          ← auth-aware client (admin + middleware)
lib/supabase/public.ts          ← anon ISR client (public sections)
types/supabase.ts               ← shared row types
middleware.ts                   ← /admin/* auth guard
app/auth/callback/route.ts      ← magic-link code exchange
app/admin/layout.tsx            ← sidebar shell
app/admin/page.tsx              ← dashboard (row counts)
app/admin/login/page.tsx        ← email → magic link form
app/admin/experience/page.tsx         ← list
app/admin/experience/new/page.tsx     ← add form
app/admin/experience/[id]/edit/page.tsx ← edit form
app/admin/experience/actions.ts       ← Server Actions
app/admin/education/page.tsx          ← single-row edit form
app/admin/education/actions.ts
app/admin/projects/page.tsx
app/admin/projects/new/page.tsx
app/admin/projects/[id]/edit/page.tsx
app/admin/projects/actions.ts
app/admin/community/page.tsx
app/admin/community/new/page.tsx
app/admin/community/[id]/edit/page.tsx
app/admin/community/actions.ts
supabase/schema.sql             ← CREATE TABLE + RLS (run in Supabase dashboard)
supabase/seed.sql               ← INSERT current hardcoded data
tests/middleware.test.ts
tests/app/admin/login.test.tsx
tests/app/admin/dashboard.test.tsx
```

**Modified files:**
```
next.config.mjs                             ← revert output: 'export' additions
components/home/ExperienceSection.tsx       ← async fetch from Supabase
components/home/EducationSection.tsx        ← async fetch from Supabase
components/home/ProjectsSection.tsx         ← async fetch from Supabase
components/home/CommunitySection.tsx        ← async fetch from Supabase
tests/components/home/ExperienceSection.test.tsx  ← mock Supabase
tests/components/home/EducationSection.test.tsx   ← mock Supabase
```

**New test files:**
```
tests/components/home/ProjectsSection.test.tsx
tests/components/home/CommunitySection.test.tsx
```

---

### Task 1: Setup — packages, env, revert config

**Files:**
- Modify: `next.config.mjs`
- Create: `.env.local` (gitignored — do NOT commit)

**Interfaces:**
- Produces: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` available in process.env for all later tasks.

- [ ] **Step 1: Install Supabase packages**

Run:
```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

Expected: packages appear in `package.json` dependencies.

- [ ] **Step 2: Revert next.config.mjs**

Replace the contents of `next.config.mjs` with:

```js
// next.config.mjs
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  options: {
    rehypePlugins: [
      [
        'rehype-pretty-code',
        {
          theme: 'tokyo-night',
          keepBackground: false,
          defaultLang: 'typescript',
        },
      ],
    ],
  },
})

export default withMDX(nextConfig)
```

- [ ] **Step 3: Create .env.local**

Create `.env.local` in the project root (it is already gitignored):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

In production, set `NEXT_PUBLIC_SITE_URL` to your deployed domain (e.g. `https://tanialapalelo.com`) so magic-link redirects land on the right host.

Get these values from: Supabase Dashboard → Project → Settings → API.

- [ ] **Step 4: Verify build still compiles**

Run:
```bash
pnpm build 2>&1 | tail -5
```

Expected: build succeeds (no `output: 'export'` errors).

- [ ] **Step 5: Commit**

```bash
git add next.config.mjs package.json pnpm-lock.yaml
git commit -m "feat: install Supabase packages and revert static export config"
```

---

### Task 2: Supabase client utilities + TypeScript types

**Files:**
- Create: `types/supabase.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/public.ts`

**Interfaces:**
- Produces:
  - `Experience`, `Education`, `Project`, `Community` types from `types/supabase.ts`
  - `createClient(): Promise<SupabaseClient>` from `lib/supabase/server.ts` — used by middleware, admin pages, Server Actions
  - `createPublicClient(): SupabaseClient` from `lib/supabase/public.ts` — used by public section components

- [ ] **Step 1: Create shared TypeScript types**

Create `types/supabase.ts`:

```ts
export type Experience = {
  id: string
  title: string
  company: string
  location: string
  period: string
  accent: string
  bullets: string[]
  sort_order: number
}

export type Education = {
  id: string
  degree: string
  institution: string
  year: string
  certifications: string[]
}

export type Project = {
  id: string
  slug: string
  case_study_number: string
  tagline: string
  accent: 'coral' | 'marigold' | 'periwinkle' | 'mint'
  tech: string[]
  sort_order: number
}

export type Community = {
  id: string
  name: string
  description: string
  href: string
  accent: string
  sort_order: number
}
```

- [ ] **Step 2: Create the auth-aware server client**

Create `lib/supabase/server.ts`:

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from a Server Component — cookies are read-only
          }
        },
      },
    }
  )
}
```

- [ ] **Step 3: Create the public ISR client**

Create `lib/supabase/public.ts`:

```ts
import { createClient } from '@supabase/supabase-js'

export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      global: {
        fetch: (url, options) =>
          fetch(url, { ...options, next: { revalidate: 60 } } as RequestInit),
      },
    }
  )
}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run:
```bash
pnpm tsc --noEmit 2>&1 | head -20
```

Expected: no errors on the new files.

- [ ] **Step 5: Commit**

```bash
git add types/supabase.ts lib/supabase/server.ts lib/supabase/public.ts
git commit -m "feat: add Supabase client utilities and DB types"
```

---

### Task 3: Middleware auth guard

**Files:**
- Create: `middleware.ts`
- Create: `tests/middleware.test.ts`

**Interfaces:**
- Consumes: `createServerClient` from `@supabase/ssr`
- Produces: all `/admin/*` routes (except `/admin/login`) redirect to `/admin/login` when no Supabase session exists.

- [ ] **Step 1: Write the failing test**

Create `tests/middleware.test.ts`:

```ts
import { NextRequest } from 'next/server'

vi.mock('@supabase/ssr', () => ({
  createServerClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
  }),
}))

test('redirects unauthenticated request to /admin/login', async () => {
  const { middleware } = await import('@/middleware')
  const req = new NextRequest('http://localhost/admin/experience')
  const res = await middleware(req)
  expect(res.status).toBe(307)
  expect(res.headers.get('location')).toContain('/admin/login')
})

test('allows /admin/login without a session', async () => {
  const { middleware } = await import('@/middleware')
  const req = new NextRequest('http://localhost/admin/login')
  const res = await middleware(req)
  expect(res.status).not.toBe(307)
})

test('allows /auth/callback without a session', async () => {
  const { middleware } = await import('@/middleware')
  const req = new NextRequest('http://localhost/auth/callback?code=abc')
  const res = await middleware(req)
  expect(res.status).not.toBe(307)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/middleware.test.ts`
Expected: FAIL — `Cannot find module '@/middleware'`

- [ ] **Step 3: Create middleware**

Create `middleware.ts` in the project root:

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isLoginPage = pathname === '/admin/login'
  const isCallback = pathname.startsWith('/auth/callback')

  if (!user && !isLoginPage && !isCallback) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/auth/callback'],
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/middleware.test.ts`
Expected: 3 passed

- [ ] **Step 5: Commit**

```bash
git add middleware.ts tests/middleware.test.ts
git commit -m "feat: add middleware auth guard for /admin routes"
```

---

### Task 4: Auth flow — callback route + login page

**Files:**
- Create: `app/auth/callback/route.ts`
- Create: `app/admin/login/page.tsx`
- Create: `tests/app/admin/login.test.tsx`

**Interfaces:**
- Consumes: `createClient()` from `lib/supabase/server.ts`
- Produces:
  - `GET /auth/callback?code=<code>` — exchanges code, sets session cookie, redirects to `/admin`
  - `app/admin/login/page.tsx` — renders email form; form action calls `signInWithOtp` Server Action and shows confirmation

- [ ] **Step 1: Write the failing test**

Create `tests/app/admin/login.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import LoginPage from '@/app/admin/login/page'

test('renders email input and submit button', () => {
  render(<LoginPage />)
  expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /send magic link/i })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/app/admin/login.test.tsx`
Expected: FAIL — `Cannot find module '@/app/admin/login/page'`

- [ ] **Step 3: Create the auth callback route**

Create `app/auth/callback/route.ts`:

```ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${origin}/admin`)
}
```

- [ ] **Step 4: Create the login page**

Create `app/admin/login/page.tsx`:

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

async function sendMagicLink(formData: FormData) {
  'use server'
  const email = formData.get('email') as string
  const supabase = await createClient()
  await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
  })
  redirect('/admin/login?sent=1')
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>
}) {
  const { sent } = await searchParams

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-6">
          Admin Login
        </p>
        {sent && (
          <p className="font-mono text-xs text-mint mb-4">
            Magic link sent — check your email.
          </p>
        )}
        <form action={sendMagicLink} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="font-mono text-xs text-ink-dim">Email</span>
            <input
              type="email"
              name="email"
              required
              aria-label="Email"
              className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2.5 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle"
            />
          </label>
          <button
            type="submit"
            className="bg-periwinkle text-bg font-mono text-sm px-5 py-2.5 rounded-lg hover:-translate-y-0.5 transition-transform"
          >
            Send Magic Link
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm vitest run tests/app/admin/login.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add app/auth/callback/route.ts app/admin/login/page.tsx tests/app/admin/login.test.tsx
git commit -m "feat: add auth callback route and magic link login page"
```

---

### Task 5: SQL schema + seed

**Files:**
- Create: `supabase/schema.sql`
- Create: `supabase/seed.sql`

This task involves running SQL in the Supabase Dashboard — no automated tests. The tables must exist before Tasks 7–10 can be manually verified.

- [ ] **Step 1: Create schema.sql**

Create `supabase/schema.sql`:

```sql
-- experiences
create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  location text not null,
  period text not null,
  accent text not null default 'periwinkle',
  bullets jsonb not null default '[]',
  sort_order int not null default 0
);

alter table experiences enable row level security;
create policy "Public read experiences" on experiences for select using (true);
create policy "Auth insert experiences" on experiences for insert with check (auth.uid() is not null);
create policy "Auth update experiences" on experiences for update using (auth.uid() is not null);
create policy "Auth delete experiences" on experiences for delete using (auth.uid() is not null);

-- education (single row)
create table if not exists education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  institution text not null,
  year text not null,
  certifications jsonb not null default '[]'
);

alter table education enable row level security;
create policy "Public read education" on education for select using (true);
create policy "Auth insert education" on education for insert with check (auth.uid() is not null);
create policy "Auth update education" on education for update using (auth.uid() is not null);
create policy "Auth delete education" on education for delete using (auth.uid() is not null);

-- projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  case_study_number text not null,
  tagline text not null,
  accent text not null default 'periwinkle',
  tech jsonb not null default '[]',
  sort_order int not null default 0
);

alter table projects enable row level security;
create policy "Public read projects" on projects for select using (true);
create policy "Auth insert projects" on projects for insert with check (auth.uid() is not null);
create policy "Auth update projects" on projects for update using (auth.uid() is not null);
create policy "Auth delete projects" on projects for delete using (auth.uid() is not null);

-- community
create table if not exists community (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  href text not null,
  accent text not null default 'periwinkle',
  sort_order int not null default 0
);

alter table community enable row level security;
create policy "Public read community" on community for select using (true);
create policy "Auth insert community" on community for insert with check (auth.uid() is not null);
create policy "Auth update community" on community for update using (auth.uid() is not null);
create policy "Auth delete community" on community for delete using (auth.uid() is not null);
```

- [ ] **Step 2: Create seed.sql**

Create `supabase/seed.sql`:

```sql
-- Experiences
insert into experiences (title, company, location, period, accent, bullets, sort_order) values
(
  'Frontend Engineer',
  'Wings Group Indonesia (FMCG enterprise, ~20,000 employees)',
  'Jakarta, Indonesia',
  'Jun 2023 – Present',
  'periwinkle',
  '[
    "Built the Sales Order system in Next.js (Docker) with a multi-condition promotional pricing engine covering 10+ promo types, the primary order entry point for Wings'' national distribution network.",
    "Reduced campaign activation time by 95% by engineering the STAR promo module with a batch-upload pipeline processing 16,000 records per cycle.",
    "Co-built an enterprise design system (React, Material-UI, Storybook) adopted across 10+ internal apps, cutting per-feature UI development time by approximately 40%.",
    "Architected Master Generator v2, a schema-driven code-gen tool that auto-generates Joomla MVC CRUD modules from live database schemas, accelerating new-module delivery by 50%."
  ]',
  0
),
(
  'Software Engineer',
  'Wings Group Indonesia',
  'Jakarta, Indonesia',
  'Oct 2021 – Jun 2023',
  'mint',
  '[
    "Developed and maintained 7 HR modules (payroll, e-recruitment, termination, job-batch processing, online forms) using Java and Joomla, supporting 20,000+ employees.",
    "Delivered a fingerprint attendance management tool to bulk-transfer and clean biometric records, eliminating manual data-entry effort for 5,000+ users."
  ]',
  1
);

-- Education (single row)
insert into education (degree, institution, year, certifications) values
(
  'B.Sc. Computer Science',
  'University of Surabaya (UBAYA), Indonesia',
  '2021',
  '[
    "Bangkit 2021 Cloud Computing Track (Google, Tokopedia, Gojek, Traveloka)",
    "Kominfo Cyber Security Graduate Academy",
    "SIAS University China Exchange",
    "Hack2Skill GenAI APAC 2026 (in progress)"
  ]'
);

-- Projects
insert into projects (slug, case_study_number, tagline, accent, tech, sort_order) values
(
  'calendar-clone',
  '01',
  'A production-grade Google Calendar rebuild — OAuth, RRULE engine, real test suite.',
  'marigold',
  '["Next.js 16", "NestJS 11", "PostgreSQL", "Turborepo"]',
  0
),
(
  'giftclaw',
  '02',
  'AI-powered gift finder wrapped in a retro arcade claw machine game.',
  'mint',
  '["Next.js 16", "Tailwind CSS v4", "PostgreSQL", "Prisma 7", "Gemini 2.5 Flash", "Supabase", "Vitest", "Playwright"]',
  1
);

-- Community
insert into community (name, description, href, accent, sort_order) values
(
  'Women Talk Series',
  'A YouTube talk series I founded to amplify women in tech — engineers, designers, and founders sharing their journeys.',
  'https://www.youtube.com/watch?v=AxnzU07nlVk&list=PL-1PWH5uyT-eJSJf1oQTbnlbvUDS-I4HK',
  'mint',
  0
),
(
  'Rewriting the Code',
  'Global community supporting women in tech through scholarships, mentorship, and job placement.',
  'https://rewritingthecode.org/',
  'periwinkle',
  1
);
```

- [ ] **Step 3: Run schema.sql in Supabase**

Open Supabase Dashboard → project → SQL Editor → New query.
Paste the full contents of `supabase/schema.sql` and click Run.
Expected: all statements succeed, no errors.

- [ ] **Step 4: Run seed.sql in Supabase**

Open SQL Editor → New query.
Paste the full contents of `supabase/seed.sql` and click Run.
Expected: rows inserted without errors.

- [ ] **Step 5: Verify data**

In SQL Editor run:
```sql
select count(*) from experiences;
select count(*) from education;
select count(*) from projects;
select count(*) from community;
```

Expected: `2`, `1`, `2`, `2`.

- [ ] **Step 6: Commit**

```bash
git add supabase/schema.sql supabase/seed.sql
git commit -m "feat: add Supabase schema and seed data"
```

---

### Task 6: Admin layout + dashboard

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `app/admin/page.tsx`
- Create: `tests/app/admin/dashboard.test.tsx`

**Interfaces:**
- Consumes: `createClient()` from `lib/supabase/server.ts`
- Produces: `app/admin/layout.tsx` wraps all admin pages with a sidebar; `app/admin/page.tsx` shows row counts per table.

- [ ] **Step 1: Write the failing test**

Create `tests/app/admin/dashboard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import AdminLayout from '@/app/admin/layout'

test('renders admin sidebar navigation', () => {
  render(
    <AdminLayout>
      <div>content</div>
    </AdminLayout>
  )
  expect(screen.getByRole('link', { name: /experience/i })).toHaveAttribute('href', '/admin/experience')
  expect(screen.getByRole('link', { name: /education/i })).toHaveAttribute('href', '/admin/education')
  expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute('href', '/admin/projects')
  expect(screen.getByRole('link', { name: /community/i })).toHaveAttribute('href', '/admin/community')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/app/admin/dashboard.test.tsx`
Expected: FAIL — `Cannot find module '@/app/admin/layout'`

- [ ] **Step 3: Create admin layout**

Create `app/admin/layout.tsx`:

```tsx
import Link from 'next/link'

const navLinks = [
  { href: '/admin/experience', label: 'Experience' },
  { href: '/admin/education', label: 'Education' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/community', label: 'Community' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex">
      <aside className="w-48 border-r border-grid-line bg-bg-elevated flex flex-col gap-1 p-4 pt-8">
        <Link
          href="/admin"
          className="font-display italic text-lg text-ink mb-6 block hover:text-periwinkle transition-colors"
        >
          tania. admin
        </Link>
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="font-mono text-xs text-ink-dim hover:text-periwinkle transition-colors py-1"
          >
            {label}
          </Link>
        ))}
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
```

- [ ] **Step 4: Create dashboard overview page**

Create `app/admin/page.tsx`:

```tsx
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [{ count: expCount }, { count: eduCount }, { count: projCount }, { count: commCount }] =
    await Promise.all([
      supabase.from('experiences').select('*', { count: 'exact', head: true }),
      supabase.from('education').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('community').select('*', { count: 'exact', head: true }),
    ])

  const stats = [
    { label: 'Experience', count: expCount ?? 0, href: '/admin/experience' },
    { label: 'Education', count: eduCount ?? 0, href: '/admin/education' },
    { label: 'Projects', count: projCount ?? 0, href: '/admin/projects' },
    { label: 'Community', count: commCount ?? 0, href: '/admin/community' },
  ]

  return (
    <div>
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Dashboard</p>
      <div className="grid grid-cols-2 gap-4 max-w-md">
        {stats.map(({ label, count, href }) => (
          <a
            key={label}
            href={href}
            className="rounded-[14px] border border-grid-line bg-bg-elevated p-5 hover:-translate-y-0.5 transition-transform"
          >
            <p className="font-mono text-xs text-ink-dim mb-1">{label}</p>
            <p className="font-display italic text-3xl text-ink">{count}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm vitest run tests/app/admin/dashboard.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add app/admin/layout.tsx app/admin/page.tsx tests/app/admin/dashboard.test.tsx
git commit -m "feat: add admin layout and dashboard overview"
```

---

### Task 7: Migrate ExperienceSection to Supabase

**Files:**
- Modify: `components/home/ExperienceSection.tsx`
- Modify: `tests/components/home/ExperienceSection.test.tsx`

**Interfaces:**
- Consumes: `createPublicClient()` from `lib/supabase/public.ts`, `Experience` from `types/supabase.ts`
- Produces: `ExperienceSection()` — async zero-prop Server Component fetching from `experiences` table.

- [ ] **Step 1: Update the test to mock Supabase**

Replace `tests/components/home/ExperienceSection.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { ExperienceSection } from '@/components/home/ExperienceSection'

const mockExperiences = [
  {
    id: '1',
    title: 'Frontend Engineer',
    company: 'Wings Group Indonesia',
    location: 'Jakarta, Indonesia',
    period: 'Jun 2023 – Present',
    accent: 'periwinkle',
    bullets: ['Reduced campaign activation time by 95% by engineering the STAR promo module.'],
    sort_order: 0,
  },
  {
    id: '2',
    title: 'Software Engineer',
    company: 'Wings Group Indonesia',
    location: 'Jakarta, Indonesia',
    period: 'Oct 2021 – Jun 2023',
    accent: 'mint',
    bullets: ['Delivered a fingerprint attendance management tool.'],
    sort_order: 1,
  },
]

vi.mock('@/lib/supabase/public', () => ({
  createPublicClient: () => ({
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: mockExperiences, error: null }),
      }),
    }),
  }),
}))

test('renders experience entries from Supabase', async () => {
  const jsx = await ExperienceSection()
  render(jsx)
  expect(screen.getByText('Frontend Engineer')).toBeInTheDocument()
  expect(screen.getByText('Software Engineer')).toBeInTheDocument()
})

test('renders quantified achievement bullet', async () => {
  const jsx = await ExperienceSection()
  render(jsx)
  expect(screen.getByText(/Reduced campaign activation time by 95%/)).toBeInTheDocument()
})

test('section is anchorable from nav', async () => {
  const jsx = await ExperienceSection()
  const { container } = render(jsx)
  expect(container.querySelector('#experience')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/home/ExperienceSection.test.tsx`
Expected: FAIL — component still uses hardcoded data, not Supabase.

- [ ] **Step 3: Replace ExperienceSection with Supabase fetch**

Replace `components/home/ExperienceSection.tsx`:

```tsx
import { createPublicClient } from '@/lib/supabase/public'
import type { Experience } from '@/types/supabase'

const accentText: Record<string, string> = {
  periwinkle: 'text-periwinkle',
  mint: 'text-mint',
  coral: 'text-coral',
  marigold: 'text-marigold',
}

const accentBorder: Record<string, string> = {
  periwinkle: 'border-periwinkle',
  mint: 'border-mint',
  coral: 'border-coral',
  marigold: 'border-marigold',
}

export async function ExperienceSection() {
  const supabase = createPublicClient()
  const { data: roles } = await supabase
    .from('experiences')
    .select('*')
    .order('sort_order')

  if (!roles?.length) return null

  return (
    <section id="experience" className="pt-20">
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Experience</p>
      <div className="flex flex-col gap-6">
        {roles.map((role: Experience) => (
          <div
            key={role.id}
            className={`rounded-[14px] border-2 ${accentBorder[role.accent] ?? 'border-periwinkle'} bg-bg-elevated p-6`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
              <p className={`font-mono text-xs ${accentText[role.accent] ?? 'text-periwinkle'} uppercase tracking-widest`}>
                {role.title}
              </p>
              <p className="font-mono text-xs text-ink-dim">{role.period}</p>
            </div>
            <p className="text-sm text-ink mb-1">{role.company}</p>
            <p className="font-mono text-xs text-ink-dim mb-4">{role.location}</p>
            <ul className="flex flex-col gap-2 list-disc list-inside text-sm text-ink-dim">
              {role.bullets.map((bullet: string) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/components/home/ExperienceSection.test.tsx`
Expected: 3 passed

- [ ] **Step 5: Commit**

```bash
git add components/home/ExperienceSection.tsx tests/components/home/ExperienceSection.test.tsx
git commit -m "feat: migrate ExperienceSection to Supabase with ISR"
```

---

### Task 8: Migrate EducationSection to Supabase

**Files:**
- Modify: `components/home/EducationSection.tsx`
- Modify: `tests/components/home/EducationSection.test.tsx`

**Interfaces:**
- Consumes: `createPublicClient()` from `lib/supabase/public.ts`, `Education` from `types/supabase.ts`
- Produces: `EducationSection()` — async zero-prop Server Component fetching the single row from `education` table.

- [ ] **Step 1: Update the test to mock Supabase**

Replace `tests/components/home/EducationSection.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { EducationSection } from '@/components/home/EducationSection'

const mockEducation = {
  id: '1',
  degree: 'B.Sc. Computer Science',
  institution: 'University of Surabaya (UBAYA), Indonesia',
  year: '2021',
  certifications: [
    'Bangkit 2021 Cloud Computing Track (Google, Tokopedia, Gojek, Traveloka)',
    'Kominfo Cyber Security Graduate Academy',
    'SIAS University China Exchange',
    'Hack2Skill GenAI APAC 2026 (in progress)',
  ],
}

vi.mock('@/lib/supabase/public', () => ({
  createPublicClient: () => ({
    from: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: mockEducation, error: null }),
      }),
    }),
  }),
}))

test('renders degree and certifications from Supabase', async () => {
  const jsx = await EducationSection()
  render(jsx)
  expect(screen.getByText('B.Sc. Computer Science')).toBeInTheDocument()
  expect(screen.getByText(/University of Surabaya/)).toBeInTheDocument()
  expect(screen.getByText('Kominfo Cyber Security Graduate Academy')).toBeInTheDocument()
  expect(screen.getByText('Hack2Skill GenAI APAC 2026 (in progress)')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/home/EducationSection.test.tsx`
Expected: FAIL — component still uses hardcoded data.

- [ ] **Step 3: Replace EducationSection with Supabase fetch**

Replace `components/home/EducationSection.tsx`:

```tsx
import { createPublicClient } from '@/lib/supabase/public'
import type { Education } from '@/types/supabase'

export async function EducationSection() {
  const supabase = createPublicClient()
  const { data: edu } = await supabase.from('education').select('*').single()

  if (!edu) return null

  const education = edu as Education

  return (
    <section id="education" className="pt-20">
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Education</p>
      <div className="rounded-[14px] border border-grid-line bg-bg-elevated p-6">
        <p className="text-sm text-ink mb-1">{education.degree}</p>
        <p className="font-mono text-xs text-ink-dim mb-4">
          {education.institution} — {education.year}
        </p>
        <div className="flex flex-wrap gap-2">
          {education.certifications.map((cert: string) => (
            <span
              key={cert}
              className="font-mono text-xs text-ink border border-grid-line rounded-md px-2.5 py-1 bg-bg"
            >
              {cert}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/components/home/EducationSection.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/home/EducationSection.tsx tests/components/home/EducationSection.test.tsx
git commit -m "feat: migrate EducationSection to Supabase with ISR"
```

---

### Task 9: Migrate ProjectsSection to Supabase

**Files:**
- Modify: `components/home/ProjectsSection.tsx`
- Create: `tests/components/home/ProjectsSection.test.tsx`

**Interfaces:**
- Consumes: `createPublicClient()` from `lib/supabase/public.ts`, `Project` from `types/supabase.ts`
- Produces: `ProjectsSection()` — async zero-prop Server Component fetching from `projects` table. Passes `caseStudyNumber` (from `case_study_number` column) to `ProjectCard`.

- [ ] **Step 1: Write the failing test**

Create `tests/components/home/ProjectsSection.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { ProjectsSection } from '@/components/home/ProjectsSection'

const mockProjects = [
  {
    id: '1',
    slug: 'calendar-clone',
    case_study_number: '01',
    tagline: 'A production-grade Google Calendar rebuild.',
    accent: 'marigold',
    tech: ['Next.js 16', 'NestJS 11'],
    sort_order: 0,
  },
]

vi.mock('@/lib/supabase/public', () => ({
  createPublicClient: () => ({
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: mockProjects, error: null }),
      }),
    }),
  }),
}))

test('renders project cards from Supabase', async () => {
  const jsx = await ProjectsSection()
  render(jsx)
  expect(screen.getByText('A production-grade Google Calendar rebuild.')).toBeInTheDocument()
  expect(screen.getByText('Case Study 01')).toBeInTheDocument()
})

test('section has correct id anchor', async () => {
  const jsx = await ProjectsSection()
  const { container } = render(jsx)
  expect(container.querySelector('#projects')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/home/ProjectsSection.test.tsx`
Expected: FAIL — `ProjectsSection` still imports from MDX; mock not applied.

- [ ] **Step 3: Replace ProjectsSection with Supabase fetch**

Replace `components/home/ProjectsSection.tsx`:

```tsx
import { createPublicClient } from '@/lib/supabase/public'
import { ProjectCard } from './ProjectCard'
import type { Project } from '@/types/supabase'

export async function ProjectsSection() {
  const supabase = createPublicClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order')

  if (!projects?.length) return null

  return (
    <section id="projects" className="pt-20">
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Projects</p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {projects.map((p: Project) => (
          <ProjectCard
            key={p.id}
            slug={p.slug}
            caseStudyNumber={p.case_study_number}
            accent={p.accent}
            tagline={p.tagline}
            tech={p.tech}
          />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/components/home/ProjectsSection.test.tsx`
Expected: PASS

- [ ] **Step 5: Run full suite to confirm no regressions**

Run: `pnpm test:run`
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/home/ProjectsSection.tsx tests/components/home/ProjectsSection.test.tsx
git commit -m "feat: migrate ProjectsSection to Supabase with ISR"
```

---

### Task 10: Migrate CommunitySection to Supabase

**Files:**
- Modify: `components/home/CommunitySection.tsx`
- Create: `tests/components/home/CommunitySection.test.tsx`

**Interfaces:**
- Consumes: `createPublicClient()` from `lib/supabase/public.ts`, `Community` from `types/supabase.ts`
- Produces: `CommunitySection()` — async zero-prop Server Component fetching from `community` table.

- [ ] **Step 1: Write the failing test**

Create `tests/components/home/CommunitySection.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { CommunitySection } from '@/components/home/CommunitySection'

const mockCommunity = [
  {
    id: '1',
    name: 'Women Talk Series',
    description: 'A YouTube talk series I founded to amplify women in tech.',
    href: 'https://www.youtube.com/watch?v=AxnzU07nlVk',
    accent: 'mint',
    sort_order: 0,
  },
]

vi.mock('@/lib/supabase/public', () => ({
  createPublicClient: () => ({
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: mockCommunity, error: null }),
      }),
    }),
  }),
}))

test('renders community cards from Supabase', async () => {
  const jsx = await CommunitySection()
  render(jsx)
  expect(screen.getByText('Women Talk Series')).toBeInTheDocument()
  expect(screen.getByText(/YouTube talk series/)).toBeInTheDocument()
})

test('community card links to external href', async () => {
  const jsx = await CommunitySection()
  render(jsx)
  expect(screen.getByRole('link', { name: /Women Talk Series/i })).toHaveAttribute(
    'href',
    'https://www.youtube.com/watch?v=AxnzU07nlVk'
  )
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/home/CommunitySection.test.tsx`
Expected: FAIL — component uses hardcoded data.

- [ ] **Step 3: Replace CommunitySection with Supabase fetch**

Replace `components/home/CommunitySection.tsx`:

```tsx
import { createPublicClient } from '@/lib/supabase/public'
import type { Community } from '@/types/supabase'

const accentText: Record<string, string> = {
  periwinkle: 'text-periwinkle',
  mint: 'text-mint',
  coral: 'text-coral',
  marigold: 'text-marigold',
}

const accentBorder: Record<string, string> = {
  periwinkle: 'border-periwinkle',
  mint: 'border-mint',
  coral: 'border-coral',
  marigold: 'border-marigold',
}

export async function CommunitySection() {
  const supabase = createPublicClient()
  const { data: communities } = await supabase
    .from('community')
    .select('*')
    .order('sort_order')

  if (!communities?.length) return null

  return (
    <section id="community" className="pt-20 pb-20">
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Community</p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {communities.map((c: Community) => (
          <a
            key={c.id}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`block rounded-[14px] border-2 ${accentBorder[c.accent] ?? 'border-periwinkle'} bg-bg-elevated p-6 hover:-translate-y-1 transition-transform`}
          >
            <p className={`font-mono text-xs ${accentText[c.accent] ?? 'text-periwinkle'} uppercase tracking-widest mb-2`}>
              {c.name}
            </p>
            <p className="text-sm text-ink-dim">{c.description}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/components/home/CommunitySection.test.tsx`
Expected: PASS

- [ ] **Step 5: Run full suite**

Run: `pnpm test:run`
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/home/CommunitySection.tsx tests/components/home/CommunitySection.test.tsx
git commit -m "feat: migrate CommunitySection to Supabase with ISR"
```

---

### Task 11: Admin — Experience CRUD

**Files:**
- Create: `app/admin/experience/page.tsx`
- Create: `app/admin/experience/new/page.tsx`
- Create: `app/admin/experience/[id]/edit/page.tsx`
- Create: `app/admin/experience/actions.ts`

**Interfaces:**
- Consumes: `createClient()` from `lib/supabase/server.ts`, `Experience` from `types/supabase.ts`
- Produces: full CRUD for the `experiences` table; each mutation calls `revalidatePath('/')`.

- [ ] **Step 1: Create Server Actions**

Create `app/admin/experience/actions.ts`:

```ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createExperience(formData: FormData) {
  const supabase = await createClient()
  await supabase.from('experiences').insert({
    title: formData.get('title') as string,
    company: formData.get('company') as string,
    location: formData.get('location') as string,
    period: formData.get('period') as string,
    accent: formData.get('accent') as string,
    bullets: (formData.get('bullets') as string).split('\n').map(b => b.trim()).filter(Boolean),
    sort_order: Number(formData.get('sort_order') ?? 0),
  })
  revalidatePath('/')
  redirect('/admin/experience')
}

export async function updateExperience(id: string, formData: FormData) {
  const supabase = await createClient()
  await supabase.from('experiences').update({
    title: formData.get('title') as string,
    company: formData.get('company') as string,
    location: formData.get('location') as string,
    period: formData.get('period') as string,
    accent: formData.get('accent') as string,
    bullets: (formData.get('bullets') as string).split('\n').map(b => b.trim()).filter(Boolean),
    sort_order: Number(formData.get('sort_order') ?? 0),
  }).eq('id', id)
  revalidatePath('/')
  redirect('/admin/experience')
}

export async function deleteExperience(id: string) {
  const supabase = await createClient()
  await supabase.from('experiences').delete().eq('id', id)
  revalidatePath('/')
  redirect('/admin/experience')
}
```

- [ ] **Step 2: Create the list page**

Create `app/admin/experience/page.tsx`:

```tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { deleteExperience } from './actions'
import type { Experience } from '@/types/supabase'

export default async function ExperienceAdminPage() {
  const supabase = await createClient()
  const { data: roles } = await supabase
    .from('experiences')
    .select('*')
    .order('sort_order')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <p className="font-mono text-xs text-periwinkle uppercase tracking-widest">Experience</p>
        <Link
          href="/admin/experience/new"
          className="bg-periwinkle text-bg font-mono text-xs px-4 py-2 rounded-lg"
        >
          Add new
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {(roles ?? []).map((role: Experience) => (
          <div
            key={role.id}
            className="rounded-[14px] border border-grid-line bg-bg-elevated p-4 flex items-center justify-between gap-4"
          >
            <div>
              <p className="font-mono text-xs text-periwinkle">{role.title}</p>
              <p className="text-sm text-ink-dim">{role.company}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link
                href={`/admin/experience/${role.id}/edit`}
                className="font-mono text-xs text-ink-dim border border-grid-line rounded px-3 py-1 hover:text-periwinkle transition-colors"
              >
                Edit
              </Link>
              <form action={deleteExperience.bind(null, role.id)}>
                <button
                  type="submit"
                  className="font-mono text-xs text-ink-dim border border-grid-line rounded px-3 py-1 hover:text-coral transition-colors"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create the new-entry form page**

Create `app/admin/experience/new/page.tsx`:

```tsx
import { createExperience } from '../actions'

export default function NewExperiencePage() {
  return (
    <div>
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">New Experience</p>
      <form action={createExperience} className="flex flex-col gap-4 max-w-lg">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Title</span>
          <input name="title" required className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Company</span>
          <input name="company" required className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Location</span>
          <input name="location" required className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Period</span>
          <input name="period" required placeholder="Jun 2023 – Present" className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Accent</span>
          <select name="accent" className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle">
            <option value="periwinkle">periwinkle</option>
            <option value="mint">mint</option>
            <option value="coral">coral</option>
            <option value="marigold">marigold</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Bullets (one per line)</span>
          <textarea name="bullets" rows={5} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Sort order</span>
          <input name="sort_order" type="number" defaultValue={0} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <button type="submit" className="bg-periwinkle text-bg font-mono text-sm px-5 py-2.5 rounded-lg self-start">
          Save
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 4: Create the edit form page**

Create `app/admin/experience/[id]/edit/page.tsx`:

```tsx
import { createClient } from '@/lib/supabase/server'
import { updateExperience } from '../../actions'
import { notFound } from 'next/navigation'
import type { Experience } from '@/types/supabase'

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: role } = await supabase.from('experiences').select('*').eq('id', id).single()

  if (!role) notFound()

  const experience = role as Experience
  const updateWithId = updateExperience.bind(null, id)

  return (
    <div>
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Edit Experience</p>
      <form action={updateWithId} className="flex flex-col gap-4 max-w-lg">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Title</span>
          <input name="title" required defaultValue={experience.title} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Company</span>
          <input name="company" required defaultValue={experience.company} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Location</span>
          <input name="location" required defaultValue={experience.location} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Period</span>
          <input name="period" required defaultValue={experience.period} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Accent</span>
          <select name="accent" defaultValue={experience.accent} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle">
            <option value="periwinkle">periwinkle</option>
            <option value="mint">mint</option>
            <option value="coral">coral</option>
            <option value="marigold">marigold</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Bullets (one per line)</span>
          <textarea name="bullets" rows={5} defaultValue={experience.bullets.join('\n')} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Sort order</span>
          <input name="sort_order" type="number" defaultValue={experience.sort_order} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <button type="submit" className="bg-periwinkle text-bg font-mono text-sm px-5 py-2.5 rounded-lg self-start">
          Save
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `pnpm tsc --noEmit 2>&1 | head -20`
Expected: no errors on the new admin files.

- [ ] **Step 6: Commit**

```bash
git add app/admin/experience/
git commit -m "feat: admin Experience CRUD pages and Server Actions"
```

---

### Task 12: Admin — Education edit

**Files:**
- Create: `app/admin/education/page.tsx`
- Create: `app/admin/education/actions.ts`

**Interfaces:**
- Consumes: `createClient()` from `lib/supabase/server.ts`, `Education` from `types/supabase.ts`
- Produces: single-row edit form for the `education` table; save calls `revalidatePath('/')`.

- [ ] **Step 1: Create Server Action**

Create `app/admin/education/actions.ts`:

```ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateEducation(id: string, formData: FormData) {
  const supabase = await createClient()
  await supabase.from('education').update({
    degree: formData.get('degree') as string,
    institution: formData.get('institution') as string,
    year: formData.get('year') as string,
    certifications: (formData.get('certifications') as string)
      .split('\n')
      .map(c => c.trim())
      .filter(Boolean),
  }).eq('id', id)
  revalidatePath('/')
}
```

- [ ] **Step 2: Create the education admin page**

Create `app/admin/education/page.tsx`:

```tsx
import { createClient } from '@/lib/supabase/server'
import { updateEducation } from './actions'
import type { Education } from '@/types/supabase'

export default async function EducationAdminPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('education').select('*').single()
  const edu = data as Education | null

  if (!edu) {
    return (
      <p className="font-mono text-xs text-ink-dim">
        No education row found. Insert one in Supabase first.
      </p>
    )
  }

  const updateWithId = updateEducation.bind(null, edu.id)

  return (
    <div>
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Education</p>
      <form action={updateWithId} className="flex flex-col gap-4 max-w-lg">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Degree</span>
          <input name="degree" required defaultValue={edu.degree} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Institution</span>
          <input name="institution" required defaultValue={edu.institution} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Year</span>
          <input name="year" required defaultValue={edu.year} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Certifications (one per line)</span>
          <textarea name="certifications" rows={6} defaultValue={edu.certifications.join('\n')} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <button type="submit" className="bg-periwinkle text-bg font-mono text-sm px-5 py-2.5 rounded-lg self-start">
          Save
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `pnpm tsc --noEmit 2>&1 | head -20`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/admin/education/
git commit -m "feat: admin Education edit page and Server Action"
```

---

### Task 13: Admin — Projects CRUD

**Files:**
- Create: `app/admin/projects/page.tsx`
- Create: `app/admin/projects/new/page.tsx`
- Create: `app/admin/projects/[id]/edit/page.tsx`
- Create: `app/admin/projects/actions.ts`

**Interfaces:**
- Consumes: `createClient()` from `lib/supabase/server.ts`, `Project` from `types/supabase.ts`
- Produces: full CRUD for the `projects` table; each mutation calls `revalidatePath('/')`.

- [ ] **Step 1: Create Server Actions**

Create `app/admin/projects/actions.ts`:

```ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  await supabase.from('projects').insert({
    slug: formData.get('slug') as string,
    case_study_number: formData.get('case_study_number') as string,
    tagline: formData.get('tagline') as string,
    accent: formData.get('accent') as string,
    tech: (formData.get('tech') as string).split(',').map(t => t.trim()).filter(Boolean),
    sort_order: Number(formData.get('sort_order') ?? 0),
  })
  revalidatePath('/')
  redirect('/admin/projects')
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient()
  await supabase.from('projects').update({
    slug: formData.get('slug') as string,
    case_study_number: formData.get('case_study_number') as string,
    tagline: formData.get('tagline') as string,
    accent: formData.get('accent') as string,
    tech: (formData.get('tech') as string).split(',').map(t => t.trim()).filter(Boolean),
    sort_order: Number(formData.get('sort_order') ?? 0),
  }).eq('id', id)
  revalidatePath('/')
  redirect('/admin/projects')
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  await supabase.from('projects').delete().eq('id', id)
  revalidatePath('/')
  redirect('/admin/projects')
}
```

- [ ] **Step 2: Create the list page**

Create `app/admin/projects/page.tsx`:

```tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { deleteProject } from './actions'
import type { Project } from '@/types/supabase'

export default async function ProjectsAdminPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase.from('projects').select('*').order('sort_order')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <p className="font-mono text-xs text-periwinkle uppercase tracking-widest">Projects</p>
        <Link href="/admin/projects/new" className="bg-periwinkle text-bg font-mono text-xs px-4 py-2 rounded-lg">
          Add new
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {(projects ?? []).map((p: Project) => (
          <div key={p.id} className="rounded-[14px] border border-grid-line bg-bg-elevated p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-periwinkle">Case Study {p.case_study_number} — {p.slug}</p>
              <p className="text-sm text-ink-dim">{p.tagline}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href={`/admin/projects/${p.id}/edit`} className="font-mono text-xs text-ink-dim border border-grid-line rounded px-3 py-1 hover:text-periwinkle transition-colors">
                Edit
              </Link>
              <form action={deleteProject.bind(null, p.id)}>
                <button type="submit" className="font-mono text-xs text-ink-dim border border-grid-line rounded px-3 py-1 hover:text-coral transition-colors">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create the new-entry form page**

Create `app/admin/projects/new/page.tsx`:

```tsx
import { createProject } from '../actions'

export default function NewProjectPage() {
  return (
    <div>
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">New Project</p>
      <form action={createProject} className="flex flex-col gap-4 max-w-lg">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Slug (matches MDX filename)</span>
          <input name="slug" required placeholder="calendar-clone" className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Case Study Number</span>
          <input name="case_study_number" required placeholder="03" className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Tagline</span>
          <input name="tagline" required className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Accent</span>
          <select name="accent" className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle">
            <option value="periwinkle">periwinkle</option>
            <option value="mint">mint</option>
            <option value="coral">coral</option>
            <option value="marigold">marigold</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Tech (comma-separated)</span>
          <input name="tech" required placeholder="Next.js 16, TypeScript, PostgreSQL" className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Sort order</span>
          <input name="sort_order" type="number" defaultValue={0} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <button type="submit" className="bg-periwinkle text-bg font-mono text-sm px-5 py-2.5 rounded-lg self-start">
          Save
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 4: Create the edit form page**

Create `app/admin/projects/[id]/edit/page.tsx`:

```tsx
import { createClient } from '@/lib/supabase/server'
import { updateProject } from '../../actions'
import { notFound } from 'next/navigation'
import type { Project } from '@/types/supabase'

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('projects').select('*').eq('id', id).single()

  if (!data) notFound()

  const project = data as Project
  const updateWithId = updateProject.bind(null, id)

  return (
    <div>
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Edit Project</p>
      <form action={updateWithId} className="flex flex-col gap-4 max-w-lg">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Slug</span>
          <input name="slug" required defaultValue={project.slug} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Case Study Number</span>
          <input name="case_study_number" required defaultValue={project.case_study_number} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Tagline</span>
          <input name="tagline" required defaultValue={project.tagline} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Accent</span>
          <select name="accent" defaultValue={project.accent} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle">
            <option value="periwinkle">periwinkle</option>
            <option value="mint">mint</option>
            <option value="coral">coral</option>
            <option value="marigold">marigold</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Tech (comma-separated)</span>
          <input name="tech" required defaultValue={project.tech.join(', ')} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Sort order</span>
          <input name="sort_order" type="number" defaultValue={project.sort_order} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <button type="submit" className="bg-periwinkle text-bg font-mono text-sm px-5 py-2.5 rounded-lg self-start">
          Save
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `pnpm tsc --noEmit 2>&1 | head -20`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add app/admin/projects/
git commit -m "feat: admin Projects CRUD pages and Server Actions"
```

---

### Task 14: Admin — Community CRUD

**Files:**
- Create: `app/admin/community/page.tsx`
- Create: `app/admin/community/new/page.tsx`
- Create: `app/admin/community/[id]/edit/page.tsx`
- Create: `app/admin/community/actions.ts`

**Interfaces:**
- Consumes: `createClient()` from `lib/supabase/server.ts`, `Community` from `types/supabase.ts`
- Produces: full CRUD for the `community` table; each mutation calls `revalidatePath('/')`.

- [ ] **Step 1: Create Server Actions**

Create `app/admin/community/actions.ts`:

```ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCommunityEntry(formData: FormData) {
  const supabase = await createClient()
  await supabase.from('community').insert({
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    href: formData.get('href') as string,
    accent: formData.get('accent') as string,
    sort_order: Number(formData.get('sort_order') ?? 0),
  })
  revalidatePath('/')
  redirect('/admin/community')
}

export async function updateCommunityEntry(id: string, formData: FormData) {
  const supabase = await createClient()
  await supabase.from('community').update({
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    href: formData.get('href') as string,
    accent: formData.get('accent') as string,
    sort_order: Number(formData.get('sort_order') ?? 0),
  }).eq('id', id)
  revalidatePath('/')
  redirect('/admin/community')
}

export async function deleteCommunityEntry(id: string) {
  const supabase = await createClient()
  await supabase.from('community').delete().eq('id', id)
  revalidatePath('/')
  redirect('/admin/community')
}
```

- [ ] **Step 2: Create the list page**

Create `app/admin/community/page.tsx`:

```tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { deleteCommunityEntry } from './actions'
import type { Community } from '@/types/supabase'

export default async function CommunityAdminPage() {
  const supabase = await createClient()
  const { data: entries } = await supabase.from('community').select('*').order('sort_order')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <p className="font-mono text-xs text-periwinkle uppercase tracking-widest">Community</p>
        <Link href="/admin/community/new" className="bg-periwinkle text-bg font-mono text-xs px-4 py-2 rounded-lg">
          Add new
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {(entries ?? []).map((c: Community) => (
          <div key={c.id} className="rounded-[14px] border border-grid-line bg-bg-elevated p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-periwinkle">{c.name}</p>
              <p className="text-sm text-ink-dim truncate max-w-xs">{c.description}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href={`/admin/community/${c.id}/edit`} className="font-mono text-xs text-ink-dim border border-grid-line rounded px-3 py-1 hover:text-periwinkle transition-colors">
                Edit
              </Link>
              <form action={deleteCommunityEntry.bind(null, c.id)}>
                <button type="submit" className="font-mono text-xs text-ink-dim border border-grid-line rounded px-3 py-1 hover:text-coral transition-colors">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create the new-entry form page**

Create `app/admin/community/new/page.tsx`:

```tsx
import { createCommunityEntry } from '../actions'

export default function NewCommunityPage() {
  return (
    <div>
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">New Community Entry</p>
      <form action={createCommunityEntry} className="flex flex-col gap-4 max-w-lg">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Name</span>
          <input name="name" required className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Description</span>
          <textarea name="description" rows={3} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Link (href)</span>
          <input name="href" type="url" required className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Accent</span>
          <select name="accent" className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle">
            <option value="periwinkle">periwinkle</option>
            <option value="mint">mint</option>
            <option value="coral">coral</option>
            <option value="marigold">marigold</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Sort order</span>
          <input name="sort_order" type="number" defaultValue={0} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <button type="submit" className="bg-periwinkle text-bg font-mono text-sm px-5 py-2.5 rounded-lg self-start">
          Save
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 4: Create the edit form page**

Create `app/admin/community/[id]/edit/page.tsx`:

```tsx
import { createClient } from '@/lib/supabase/server'
import { updateCommunityEntry } from '../../actions'
import { notFound } from 'next/navigation'
import type { Community } from '@/types/supabase'

export default async function EditCommunityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('community').select('*').eq('id', id).single()

  if (!data) notFound()

  const entry = data as Community
  const updateWithId = updateCommunityEntry.bind(null, id)

  return (
    <div>
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Edit Community Entry</p>
      <form action={updateWithId} className="flex flex-col gap-4 max-w-lg">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Name</span>
          <input name="name" required defaultValue={entry.name} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Description</span>
          <textarea name="description" rows={3} defaultValue={entry.description} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Link (href)</span>
          <input name="href" type="url" required defaultValue={entry.href} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Accent</span>
          <select name="accent" defaultValue={entry.accent} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle">
            <option value="periwinkle">periwinkle</option>
            <option value="mint">mint</option>
            <option value="coral">coral</option>
            <option value="marigold">marigold</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Sort order</span>
          <input name="sort_order" type="number" defaultValue={entry.sort_order} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <button type="submit" className="bg-periwinkle text-bg font-mono text-sm px-5 py-2.5 rounded-lg self-start">
          Save
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 5: Run full test suite and build**

Run: `pnpm test:run`
Expected: all tests pass.

Run: `pnpm build 2>&1 | tail -10`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add app/admin/community/
git commit -m "feat: admin Community CRUD pages and Server Actions"
```

---

## Final Verification

- [ ] Set real Supabase credentials in `.env.local` (URL + anon key from Supabase Dashboard → Settings → API)
- [ ] Run `pnpm dev`, visit `http://localhost:3000/admin` — confirm redirect to `/admin/login`
- [ ] Enter `taniasilvanalapalelo@gmail.com`, click "Send magic link", click the email link — confirm redirect to `/admin`
- [ ] Visit `/admin/experience` — confirm both roles appear
- [ ] Edit one role, save, visit `http://localhost:3000` — confirm change appears within 60s
- [ ] Run `pnpm test:run` — all tests pass
- [ ] Run `pnpm build` — succeeds
