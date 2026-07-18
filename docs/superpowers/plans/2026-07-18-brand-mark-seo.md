# Brand Mark + SEO Metadata Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the boilerplate Next.js favicon and empty OG/Twitter metadata with a real "TL" brand mark plus the SEO fundamentals (OG image, metadataBase, robots.txt, sitemap.xml, JSON-LD) the site currently lacks.

**Architecture:** One shared `BrandMark` component (plain `div`/`span` markup, no raw SVG tags) renders the badge for both the browser (Nav) and `next/og`'s `ImageResponse` (favicon, apple touch icon). A separate `opengraph-image.tsx` renders the terminal-styled share image. `robots.ts`/`sitemap.ts` are plain functions that reuse the existing `getBlogSlugs()`/`getProjectSlugs()` helpers.

**Tech Stack:** Next.js 16 App Router file-based metadata conventions, `next/og`'s `ImageResponse`, Vitest + Testing Library.

## Global Constraints

- Badge background: `#1C1E2A` (site's `--color-bg`)
- "T" color: `#6FA8D8` (`--color-periwinkle`)
- "L" color: `#EFEBE3` (`--color-ink`) at 90% opacity
- Canonical domain: `https://tanialapalelo.vercel.app`
- `BrandMark` must use only `div`/`span` elements with inline style objects — no `<svg>`, `<rect>`, `<text>` tags. `next/og`'s `ImageResponse` is powered by `satori`, which only renders a constrained HTML/CSS subset; raw SVG primitives are not part of that subset, but absolutely-positioned `div`/`span` text is (this is exactly what the official `next/og` icon example uses).
- Font: hardcode `fontFamily: 'serif'` (a generic family satori renders without extra setup) in `BrandMark` — do not reference the site's Fraunces `next/font` variable, `next/og` cannot load a Google Font by name without fetching and embedding its binary, which is out of scope here.
- No `twitter-image.tsx` file — Twitter/X falls back to `og:image` when it's absent, so don't create a duplicate.
- Follow existing code style: single quotes, no semicolons, 2-space indent (see `components/layout/Nav.tsx`, `lib/content.ts`).
- `sameAs` links in the JSON-LD must match exactly what's already in `components/layout/Footer.tsx`: `https://github.com/tanialapalelo`, `https://linkedin.com/in/tanialapalelo`, `https://medium.com/@tanialapalelo`.

---

### Task 1: Shared brand mark component

**Files:**
- Create: `lib/brand-mark.tsx`
- Test: `tests/lib/brand-mark.test.tsx`

**Interfaces:**
- Produces: `BrandMark({ size }: { size: number }): JSX.Element` — a `div` sized `size`×`size`, rounded corners, navy background, containing two absolutely-positioned `span`s with text `"T"` and `"L"`. Root `div` carries `data-testid="brand-mark"`.

- [ ] **Step 1: Write the failing test**

```tsx
// tests/lib/brand-mark.test.tsx
import { render, screen } from '@testing-library/react'
import { BrandMark } from '@/lib/brand-mark'

test('renders a rounded badge with T and L glyphs', () => {
  render(<BrandMark size={32} />)
  const badge = screen.getByTestId('brand-mark')
  expect(badge).toHaveStyle({ width: '32px', height: '32px', background: '#1C1E2A' })
  expect(screen.getByText('T')).toBeInTheDocument()
  expect(screen.getByText('L')).toBeInTheDocument()
})

test('scales font size and border radius proportionally to size', () => {
  render(<BrandMark size={180} />)
  const badge = screen.getByTestId('brand-mark')
  expect(badge).toHaveStyle({ width: '180px', height: '180px', borderRadius: '36px' })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/lib/brand-mark.test.tsx`
Expected: FAIL with `Cannot find module '@/lib/brand-mark'`

- [ ] **Step 3: Write minimal implementation**

```tsx
// lib/brand-mark.tsx
export function BrandMark({ size }: { size: number }) {
  const radius = size * 0.2
  const fontSize = size * 0.6

  return (
    <div
      data-testid="brand-mark"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: '#1C1E2A',
        position: 'relative',
        display: 'flex',
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: size * 0.22,
          top: size * 0.08,
          fontFamily: 'serif',
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize,
          color: '#6FA8D8',
        }}
      >
        T
      </span>
      <span
        style={{
          position: 'absolute',
          left: size * 0.4,
          top: size * 0.16,
          fontFamily: 'serif',
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize,
          color: '#EFEBE3',
          opacity: 0.9,
        }}
      >
        L
      </span>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/lib/brand-mark.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/brand-mark.tsx tests/lib/brand-mark.test.tsx
git commit -m "feat: add shared TL brand mark component"
```

---

### Task 2: Generated favicon and apple touch icon

**Files:**
- Create: `app/icon.tsx`
- Create: `app/apple-icon.tsx`
- Delete: `app/favicon.ico`

**Interfaces:**
- Consumes: `BrandMark({ size })` from Task 1 (`@/lib/brand-mark`)

No automated test: `next/og`'s `ImageResponse` renders through Next's dev/build server (WASM-based `resvg`), which vitest's jsdom environment does not execute — the existing suite has zero tests touching generated route handlers for the same reason. Verified manually below instead.

- [ ] **Step 1: Write the icon route**

```tsx
// app/icon.tsx
import { ImageResponse } from 'next/og'
import { BrandMark } from '@/lib/brand-mark'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(<BrandMark size={32} />, { ...size })
}
```

- [ ] **Step 2: Write the apple-icon route**

```tsx
// app/apple-icon.tsx
import { ImageResponse } from 'next/og'
import { BrandMark } from '@/lib/brand-mark'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(<BrandMark size={180} />, { ...size })
}
```

- [ ] **Step 3: Delete the boilerplate favicon**

```bash
git rm app/favicon.ico
```

- [ ] **Step 4: Verify manually**

Run: `pnpm dev`, then in another terminal:
```bash
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" http://localhost:3000/icon
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" http://localhost:3000/apple-icon
```
Expected: both print `200 image/png`. Also open `http://localhost:3000/` in a browser and confirm the browser tab shows the new badge, not the default Next.js icon.

- [ ] **Step 5: Commit**

```bash
git add app/icon.tsx app/apple-icon.tsx
git commit -m "feat: generate favicon and apple touch icon from brand mark"
```

---

### Task 3: Brand mark in the nav

**Files:**
- Modify: `components/layout/Nav.tsx`
- Modify: `tests/components/layout/Nav.test.tsx`

**Interfaces:**
- Consumes: `BrandMark({ size })` from Task 1 (`@/lib/brand-mark`)

- [ ] **Step 1: Write the failing test**

Add to `tests/components/layout/Nav.test.tsx`:

```tsx
test('renders the brand mark before the wordmark', () => {
  render(<Nav />)
  expect(screen.getByTestId('brand-mark')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/components/layout/Nav.test.tsx`
Expected: FAIL — `Unable to find an element by: [data-testid="brand-mark"]`

- [ ] **Step 3: Add the brand mark to Nav**

In `components/layout/Nav.tsx`, add the import:

```tsx
import { BrandMark } from '@/lib/brand-mark'
```

Change the wordmark link:

```tsx
        <Link
          href="/"
          className="flex items-center gap-2 font-display italic text-lg text-ink hover:text-periwinkle transition-colors"
        >
          <span aria-hidden="true">
            <BrandMark size={24} />
          </span>
          Tania.
        </Link>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/components/layout/Nav.test.tsx`
Expected: PASS (all Nav tests, including the new one)

- [ ] **Step 5: Commit**

```bash
git add components/layout/Nav.tsx tests/components/layout/Nav.test.tsx
git commit -m "feat: show brand mark next to nav wordmark"
```

---

### Task 4: Open Graph share image

**Files:**
- Create: `app/opengraph-image.tsx`

No automated test, same reasoning as Task 2 (generated image route, not renderable under vitest/jsdom). Verified manually below.

- [ ] **Step 1: Write the OG image route**

```tsx
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 8,
          background: '#1C1E2A',
          padding: 48,
          fontFamily: 'monospace',
        }}
      >
        <div style={{ display: 'flex', color: '#9C99AC', fontSize: 20 }}>$ whoami</div>
        <div style={{ display: 'flex', color: '#EFEBE3', fontSize: 40, fontWeight: 600 }}>
          tania_lapalelo
        </div>
        <div style={{ display: 'flex', color: '#4ED9B0', fontSize: 20, marginTop: 16 }}>
          $ role --current
        </div>
        <div style={{ display: 'flex', color: '#6FA8D8', fontSize: 26 }}>
          Frontend Engineer, Next.js / TypeScript / PostgreSQL
        </div>
        <div style={{ display: 'flex', color: '#EFEBE3', fontSize: 20, marginTop: 16 }}>$ _</div>
      </div>
    ),
    { ...size }
  )
}
```

- [ ] **Step 2: Verify manually**

Run: `pnpm dev`, then:
```bash
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" http://localhost:3000/opengraph-image
```
Expected: `200 image/png`. Open `http://localhost:3000/opengraph-image` directly in a browser and confirm it shows the terminal-styled card at 1200×630.

- [ ] **Step 3: Commit**

```bash
git add app/opengraph-image.tsx
git commit -m "feat: add terminal-styled Open Graph share image"
```

---

### Task 5: Metadata fields and JSON-LD Person schema

**Files:**
- Create: `components/layout/PersonJsonLd.tsx`
- Test: `tests/components/layout/PersonJsonLd.test.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `PersonJsonLd(): JSX.Element` — a `<script type="application/ld+json">` with the schema.org `Person` payload.

No automated test for the `app/layout.tsx` metadata changes themselves: the file calls `Fraunces()`/`Inter()`/`IBM_Plex_Mono()` from `next/font/google` at module scope, which only works inside Next's own build pipeline (its SWC font-loader transform), not under plain Vitest — consistent with the existing suite, which has zero tests importing `app/layout.tsx`. `PersonJsonLd` is extracted into its own file specifically so the JSON-LD payload stays unit-testable in isolation.

- [ ] **Step 1: Write the failing test for PersonJsonLd**

```tsx
// tests/components/layout/PersonJsonLd.test.tsx
import { render } from '@testing-library/react'
import { PersonJsonLd } from '@/components/layout/PersonJsonLd'

test('renders a Person JSON-LD script with expected fields', () => {
  const { container } = render(<PersonJsonLd />)
  const script = container.querySelector('script[type="application/ld+json"]')
  expect(script).not.toBeNull()
  const data = JSON.parse(script!.textContent ?? '{}')
  expect(data['@type']).toBe('Person')
  expect(data.name).toBe('Tania Lapalelo')
  expect(data.jobTitle).toBe('Frontend Engineer')
  expect(data.url).toBe('https://tanialapalelo.vercel.app')
  expect(data.sameAs).toEqual([
    'https://github.com/tanialapalelo',
    'https://linkedin.com/in/tanialapalelo',
    'https://medium.com/@tanialapalelo',
  ])
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/components/layout/PersonJsonLd.test.tsx`
Expected: FAIL with `Cannot find module '@/components/layout/PersonJsonLd'`

- [ ] **Step 3: Write PersonJsonLd**

```tsx
// components/layout/PersonJsonLd.tsx
export function PersonJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Tania Lapalelo',
    jobTitle: 'Frontend Engineer',
    url: 'https://tanialapalelo.vercel.app',
    sameAs: [
      'https://github.com/tanialapalelo',
      'https://linkedin.com/in/tanialapalelo',
      'https://medium.com/@tanialapalelo',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/components/layout/PersonJsonLd.test.tsx`
Expected: PASS

- [ ] **Step 5: Wire it into layout.tsx and add metadata fields**

In `app/layout.tsx`, add the import:

```tsx
import { PersonJsonLd } from '@/components/layout/PersonJsonLd'
```

Update the `metadata` export:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://tanialapalelo.vercel.app'),
  title: 'Tania Lapalelo - Frontend Engineer',
  description:
    'Frontend engineer with 5 years of production experience building full-stack systems with Next.js, NestJS, TypeScript, and PostgreSQL.',
  openGraph: {
    title: 'Tania Lapalelo',
    description:
      'Frontend engineer with 5 years of production experience.',
    url: 'https://tanialapalelo.vercel.app',
    siteName: 'Tania Lapalelo',
    images: ['/opengraph-image'],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tania Lapalelo',
    description: 'Frontend engineer with 5 years of production experience.',
    images: ['/opengraph-image'],
  },
}
```

Render `PersonJsonLd` in the body:

```tsx
      <body className="min-h-screen bg-bg font-body text-ink antialiased">
        <PersonJsonLd />
        {children}
      </body>
```

- [ ] **Step 6: Verify manually**

Run: `pnpm dev`, open `http://localhost:3000/`, view page source, and confirm:
- `<meta property="og:image" content="https://tanialapalelo.vercel.app/opengraph-image" />` (absolute URL, proves `metadataBase` resolved it)
- `<meta name="twitter:image" content="https://tanialapalelo.vercel.app/opengraph-image" />`
- a `<script type="application/ld+json">` containing `"@type":"Person"`

- [ ] **Step 7: Commit**

```bash
git add components/layout/PersonJsonLd.tsx tests/components/layout/PersonJsonLd.test.tsx app/layout.tsx
git commit -m "feat: add OG/Twitter image metadata and Person JSON-LD"
```

---

### Task 6: robots.txt

**Files:**
- Create: `app/robots.ts`
- Test: `tests/app/robots.test.ts`

**Interfaces:**
- Produces: `robots(): MetadataRoute.Robots`

- [ ] **Step 1: Write the failing test**

```ts
// tests/app/robots.test.ts
import robots from '@/app/robots'

test('allows crawling of the site but disallows /admin', () => {
  const result = robots()
  expect(result.rules).toEqual({
    userAgent: '*',
    allow: '/',
    disallow: '/admin',
  })
  expect(result.sitemap).toBe('https://tanialapalelo.vercel.app/sitemap.xml')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/app/robots.test.ts`
Expected: FAIL with `Cannot find module '@/app/robots'`

- [ ] **Step 3: Write the implementation**

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin',
    },
    sitemap: 'https://tanialapalelo.vercel.app/sitemap.xml',
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/app/robots.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/robots.ts tests/app/robots.test.ts
git commit -m "feat: add robots.txt disallowing /admin"
```

---

### Task 7: sitemap.xml

**Files:**
- Create: `app/sitemap.ts`
- Test: `tests/app/sitemap.test.ts`

**Interfaces:**
- Consumes: `getBlogSlugs(): string[]`, `getProjectSlugs(): string[]` from `@/lib/content` (already exist)
- Produces: `sitemap(): MetadataRoute.Sitemap`

- [ ] **Step 1: Write the failing test**

```ts
// tests/app/sitemap.test.ts
import { vi } from 'vitest'

vi.mock('@/lib/content', () => ({
  getBlogSlugs: () => ['2026-06-16-hello-world'],
  getProjectSlugs: () => ['calendar-clone', 'giftclaw'],
}))

test('includes home, all blog slugs, and all project slugs', async () => {
  const { default: sitemap } = await import('@/app/sitemap')
  const urls = sitemap().map(entry => entry.url)
  expect(urls).toEqual([
    'https://tanialapalelo.vercel.app',
    'https://tanialapalelo.vercel.app/blog/2026-06-16-hello-world',
    'https://tanialapalelo.vercel.app/projects/calendar-clone',
    'https://tanialapalelo.vercel.app/projects/giftclaw',
  ])
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/app/sitemap.test.ts`
Expected: FAIL with `Cannot find module '@/app/sitemap'`

- [ ] **Step 3: Write the implementation**

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { getBlogSlugs, getProjectSlugs } from '@/lib/content'

const BASE_URL = 'https://tanialapalelo.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries = getBlogSlugs().map(slug => ({
    url: `${BASE_URL}/blog/${slug}`,
  }))
  const projectEntries = getProjectSlugs().map(slug => ({
    url: `${BASE_URL}/projects/${slug}`,
  }))

  return [{ url: BASE_URL }, ...blogEntries, ...projectEntries]
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/app/sitemap.test.ts`
Expected: PASS

- [ ] **Step 5: Verify manually against the real content directory**

Run: `pnpm dev`, then:
```bash
curl -s http://localhost:3000/sitemap.xml
```
Expected: XML listing the home URL plus every real slug currently in `content/blog/` and `content/projects/`.

- [ ] **Step 6: Commit**

```bash
git add app/sitemap.ts tests/app/sitemap.test.ts
git commit -m "feat: add dynamic sitemap.xml from blog and project slugs"
```
