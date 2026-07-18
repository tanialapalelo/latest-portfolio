# Brand Mark + SEO Metadata Design

**Goal:** Replace the boilerplate `create-next-app` favicon and empty OG/Twitter metadata with a real "TL" brand mark, a proper Open Graph share image, and the SEO fundamentals (metadataBase, robots.txt, sitemap.xml, JSON-LD) the site currently has none of.

**Stack additions:** None. Everything uses `next/og`'s `ImageResponse` (already bundled with `next`) and Next's existing file-based metadata conventions.

---

## Brand Mark

A "TL" monogram: overlapping "T" and "L" letterforms inside a rounded square badge.

- Background: `#1C1E2A` (site's `--color-bg`)
- "T": `#6FA8D8` (`--color-periwinkle`)
- "L": `#EFEBE3` at 90% opacity (`--color-ink`)
- Letterforms: serif italic bold (visually consistent with the Fraunces display font used in the nav wordmark; rendered with a generic serif since `next/og` cannot load the Google Font by name without embedding font data)
- Container: rounded square (`rx` ~20% of size), not a circle or transparent background — matches the site's existing rounded-corner UI (cards, buttons)

The mark is defined once as a shared SVG-producing function and reused by every consumer below, so a future color/shape tweak only happens in one place.

`lib/brand-mark.tsx`:
```ts
export function BrandMarkSVG({ size }: { size: number }): JSX.Element
```
Returns the badge as JSX suitable for both `next/og`'s `ImageResponse` and plain inline SVG (for the nav).

---

## Consumers

### `app/icon.tsx`
- Generated via `ImageResponse`, 32x32, `contentType: 'image/png'`
- Renders `<BrandMarkSVG size={32} />`
- Replaces `app/favicon.ico` (deleted, the current file is the unmodified `create-next-app` default)

### `app/apple-icon.tsx`
- Generated via `ImageResponse`, 180x180, `contentType: 'image/png'`
- Renders `<BrandMarkSVG size={180} />`
- No extra corner rounding beyond the shared badge, iOS applies its own mask on top

### `components/layout/Nav.tsx`
- Small inline SVG badge (via `BrandMarkSVG`) added immediately before the existing "Tania." text link, same height as the text line
- Existing "Tania." text, links, and behavior unchanged

---

## OG Image

### `app/opengraph-image.tsx`
- Generated via `ImageResponse`, 1200x630, `contentType: 'image/png'`
- Terminal-styled layout, echoing the homepage's terminal hero:
  ```
  $ whoami
  tania_lapalelo

  $ role --current
  Frontend Engineer, Next.js / TypeScript / PostgreSQL
  ```
- Dark navy background, monospace text, mint/periwinkle accent lines (matching the terminal hero's palette)
- One site-wide image. Per-page/per-post OG images are out of scope for this pass (see Out of Scope)

No `twitter-image.tsx` file: when absent, Twitter/X falls back to `og:image`, so a duplicate file would just double-maintain the same content.

---

## Metadata Fields (`app/layout.tsx`)

Add to the existing `metadata` export:
- `metadataBase: new URL('https://tanialapalelo.com')`, resolves the OG image's relative path to an absolute URL
- `openGraph.images: ['/opengraph-image']`
- `twitter.title`, `twitter.description` (mirror the existing `openGraph` values), `twitter.images: ['/opengraph-image']`

Existing `title`, `description`, `openGraph.title/description/url/siteName/locale/type` are untouched.

---

## robots.txt + sitemap.xml

### `app/robots.ts`
```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin' },
    sitemap: 'https://tanialapalelo.com/sitemap.xml',
  }
}
```
`/admin` is disallowed since it's an authenticated dashboard with no public value being indexed.

### `app/sitemap.ts`
Generated dynamically, not hardcoded:
- `/` (home)
- `/blog/${slug}` for every slug from `getBlogSlugs()` (`lib/content.ts`)
- `/projects/${slug}` for every slug from `getProjectSlugs()` (`lib/content.ts`)

New blog posts or projects are picked up automatically on next build; no manual sitemap maintenance.

---

## JSON-LD Person Schema

A `<script type="application/ld+json">` rendered in `app/layout.tsx`'s `<body>`, schema.org `Person`:
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Tania Lapalelo",
  "jobTitle": "Frontend Engineer",
  "url": "https://tanialapalelo.com",
  "sameAs": [
    "https://github.com/tanialapalelo",
    "https://linkedin.com/in/tanialapalelo",
    "https://medium.com/@tanialapalelo"
  ]
}
```
`sameAs` links are copied from the existing `Footer.tsx` social links (GitHub, LinkedIn, Medium), not re-entered by hand, so they can't drift out of sync.

---

## Testing

- `pnpm dev`, confirm the browser tab shows the new favicon (not the Next.js default)
- Visit `/icon`, `/apple-icon`, `/opengraph-image` directly to confirm each renders correctly
- View source on `/`, confirm `og:image`, `twitter:image`, `metadataBase`-resolved absolute URLs, and the JSON-LD script tag are present
- Visit `/robots.txt` and `/sitemap.xml`, confirm all current blog/project slugs are listed and `/admin` is disallowed
- Existing Vitest suite: no new test requirement for static/generated metadata files (they're framework-evaluated, not app logic), but a small test asserting `sitemap()` returns one entry per slug plus home is reasonable if useful for regression safety

---

## Out of Scope

- Per-page/per-post OG images (e.g. a unique image per blog post), single site-wide image only
- Web app manifest / PWA install icons beyond `apple-icon`
- Twitter handle-specific fields (`twitter:site`, `twitter:creator`), no X/Twitter account currently linked in `Footer.tsx`
- Replacing the unused default Next.js SVGs in `public/` (`next.svg`, `vercel.svg`, `globe.svg`, `file.svg`, `window.svg`), unrelated cleanup, not part of this brand/SEO pass
