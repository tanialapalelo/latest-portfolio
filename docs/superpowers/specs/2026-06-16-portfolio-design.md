# Portfolio Tania Lapalelo - Design Document

**Date:** 2026-06-16
**Status:** Approved
**Domain:** tanialapalelo.com (placeholder during development)

---

## 1. Identity & Goals

**Name:** Tania Silvana Lapalelo
**Role:** Frontend Engineer at Wings Group Indonesia (5 years, 20,000-employee FMCG enterprise)
**Brand tagline:** IT ● Women Empowerment ● Creativity
**Tone:** Bold and playful but professional. Not stiff, not generic.

---

## 2. Tech Stack

| Layer | Package | Version | Reason |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.2.9 | Production stack, latest |
| Styling | Tailwind CSS | v4.3.1 | Latest |
| MDX rendering | `@next/mdx` + `@mdx-js/loader` + `@mdx-js/react` | 16.2.9 | Official Vercel package, replaces archived next-mdx-remote |
| Content discovery | Node.js `fs` (built-in) | — | Zero deps, flat folder structure |
| Frontmatter | `export const metadata = {}` in MDX | — | Native JS exports, no gray-matter needed |
| Syntax highlight | `rehype-pretty-code` + `shiki` | 0.14.3 / 4.2.0 | Both actively maintained, shiki = VS Code engine |
| Fonts/Images | `next/font` + `next/image` | bundled | Self-hosted fonts, auto WebP |
| Package manager | pnpm | latest | Already in use |
| Deploy | Vercel | — | Auto-deploy on push |

**Packages explicitly excluded:**
- `next-mdx-remote` — archived by Hashicorp, unsupported
- `gray-matter` — 5 years no commits, unmaintained dep chain
- `globby` — overkill for flat folder structure, Node.js `fs` is sufficient
- `contentlayer2` / `velite` — too new or uncertain future

---

## 3. Design System

### Color Tokens
```ts
colors: {
  bg:              '#1C1E2A',
  'bg-elevated':   '#242738',
  'bg-elevated-2': '#2C2F45',
  ink:             '#EFEBE3',
  'ink-dim':       '#9C99AC',
  'grid-line':     'rgba(239,235,227,0.10)',

  // Accent palette — categorical, not decorative
  coral:       '#FF6B5C',  // security / auth
  marigold:    '#FFB627',  // recurrence / logic
  periwinkle:  '#9AA6FF',  // testing / CI / primary brand
  mint:        '#4ED9B0',  // accessibility / community / game mode

  'coral-soft':      'rgba(255,107,92,0.14)',
  'marigold-soft':   'rgba(255,182,39,0.14)',
  'periwinkle-soft': 'rgba(154,166,255,0.14)',
  'mint-soft':       'rgba(78,217,176,0.14)',
}
```

### Typography
```ts
fontFamily: {
  display: ['Fraunces', 'serif'],          // headings — italic serif
  body:    ['Inter', 'sans-serif'],         // body text
  mono:    ['IBM Plex Mono', 'monospace'],  // labels, eyebrows, code
}
```

### Spacing & Borders
- Card border: `1px solid var(--grid-line)`, border-radius: `14px`
- Section padding-top: `5rem`
- Max content width: `1080px`, `mx-auto px-6`

### Interactive States
- Primary button: `bg-periwinkle text-bg`, hover → `translateY(-2px)`
- Focus ring: `outline-2 outline-periwinkle outline-offset-2`
- Nav links hover: `color-periwinkle`
- Card hover: `translateY(-4px)`

---

## 4. Folder Structure

```
app/
  layout.tsx                    ← fonts, nav, footer, providers, FallingChars
  page.tsx                      ← home: Hero, About, Projects, Writing, Community
  projects/[slug]/page.tsx      ← case study template
  blog/
    page.tsx                    ← blog index with client-side tag filter
    [slug]/page.tsx             ← blog post template

content/
  projects/
    _template.mdx
    calendar-clone.mdx
    giftclaw.mdx
  blog/
    YYYY-MM-DD-slug.mdx

components/
  layout/    Nav.tsx, Footer.tsx
  home/      Hero.tsx, AgendaCard.tsx, AboutSection.tsx, ProjectsSection.tsx,
             ProjectCard.tsx, WritingSection.tsx, PostCard.tsx, CommunitySection.tsx
  project/   ProjectHero.tsx, FeatureGrid.tsx, RecurrenceDemo.tsx
  blog/      BlogIndex.tsx, TagFilter.tsx, PostHeader.tsx, MDXComponents.tsx
  ui/        AsciiPortrait.tsx, FallingChars.tsx, CommandPalette.tsx,
             GameModeOverlay.tsx, AchievementToast.tsx, XPBar.tsx

lib/
  content.ts             ← getProjectSlugs(), getBlogSlugs()
  game-mode-context.tsx

mdx-components.tsx    ← root-level entry point required by @next/mdx App Router
                         re-exports from components/blog/MDXComponents.tsx
public/
  tania-portrait.jpeg  ← source image for AsciiPortrait
  blog/               ← images per post slug
  projects/           ← images per project slug

styles/
  globals.css         ← Tailwind base + CSS variables
```

---

## 5. Content Architecture

### MDX Metadata Pattern
No YAML frontmatter, no gray-matter. Metadata as JS exports:

```mdx
export const metadata = {
  title: "Calendar Clone",
  slug: "calendar-clone",
  caseStudyNumber: "01",
  accent: "marigold",
  tagline: "A production-grade Google Calendar rebuild.",
  liveUrl: "https://calendar-web-ivory.vercel.app",
  repoUrl: "https://github.com/tanialapalelo/calendar-clone",
  tech: ["Next.js 16", "NestJS 11", "PostgreSQL", "Turborepo"],
  stats: [...],
  features: [...]
}
```

### Content Reading Pattern

```ts
// lib/content.ts
export function getProjectSlugs() {
  return fs.readdirSync('content/projects')
    .filter(f => f.endsWith('.mdx') && !f.startsWith('_'))
    .map(f => f.replace('.mdx', ''))
}

export function getBlogSlugs() {
  return fs.readdirSync('content/blog')
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace('.mdx', ''))
}
```

```ts
// Index pages — metadata via dynamic import, sorted by date desc
const slugs = getBlogSlugs()
const posts = await Promise.all(
  slugs.map(async (slug) => {
    const { metadata } = await import(`@/content/blog/${slug}.mdx`)
    return { slug, ...metadata }
  })
)
posts.sort((a, b) => b.date.localeCompare(a.date))
```

```ts
// Single pages — render directly
const { default: Post, metadata } = await import(`@/content/blog/${params.slug}.mdx`)
return <Post />
```

### GiftClaw Frontmatter
```ts
export const metadata = {
  title: "GiftClaw",
  slug: "giftclaw",
  caseStudyNumber: "02",
  accent: "mint",
  tagline: "AI-powered gift finder wrapped in a retro arcade claw machine game.",
  liveUrl: "https://giftclaw.vercel.app",
  repoUrl: "https://github.com/tanialapalelo/giftclaw",
  tech: ["Next.js 16", "Tailwind CSS v4", "PostgreSQL", "Prisma 7", "Gemini 2.5 Flash", "Supabase", "Vitest", "Playwright"],
  stats: [
    { label: "AI Model", value: "Gemini 2.5 Flash" },
    { label: "Game", value: "Claw Machine" },
    { label: "Gifts Generated", value: "8 per session" },
    { label: "Scope", value: "Solo" },
  ],
  features: [
    { title: "AI Gift Matching", accent: "mint", description: "Describe a friend's interests and budget — Gemini generates 8 personalized gift ideas.", chips: ["Gemini 2.5 Flash", "Prompt engineering", "Rate limiting"] },
    { title: "Arcade Claw Machine", accent: "coral", description: "Recipients play a claw machine game that reveals mood-based clues — without seeing names or prices.", chips: ["Canvas game", "Clue system", "Shareable link"] },
    { title: "Privacy by Design", accent: "marigold", description: "Budget and gift names never exposed to the recipient. Only mood clues revealed through gameplay.", chips: ["Privacy-first", "Supabase", "Prisma 7"] },
    { title: "Production-grade Infra", accent: "periwinkle", description: "Upstash Redis rate limiting, Sentry error tracking, Vercel Analytics, Vitest + Playwright test suite.", chips: ["Vitest", "Playwright", "Sentry"] },
  ]
}
```

---

## 6. Page Specs

### Home (`app/page.tsx`)
Sections in order:
1. **Hero** — grid: left = AsciiPortrait + h1 + lede + CTAs; right = AgendaCard (current job / open to SWE / S2 research)
2. **About** — bio paragraphs + skill chips (Frontend / Backend / Cloud)
3. **Projects** — dynamic grid from `getProjectSlugs()`, renders `ProjectCard` per entry
4. **Writing** — top 3 posts from `getBlogSlugs()`, sorted by date desc, renders `PostCard`
5. **Community** — 2 cards: Women Talk Series + Rewriting the Code

**Community links:**
- Women Talk Series: `https://www.youtube.com/watch?v=AxnzU07nlVk&list=PL-1PWH5uyT-eJSJf1oQTbnlbvUDS-I4HK`
- RTC: `https://rewritingthecode.org/`

### Blog Index (`app/blog/page.tsx`)
- All posts sorted by date descending
- Client-side tag filter: clickable chips, active state periwinkle, click to filter, click again to clear
- Each post shows: title, date, excerpt, tags

### Blog Post (`app/blog/[slug]/page.tsx`)
- `generateStaticParams()` from `getBlogSlugs()`
- `generateMetadata()` from metadata.title + metadata.excerpt + metadata.coverImage
- `PostHeader` (title, date, tags) + MDX body with `MDXComponents.tsx`

### Project Case Study (`app/projects/[slug]/page.tsx`)
- `generateStaticParams()` from `getProjectSlugs()`
- `generateMetadata()` from metadata.title + metadata.tagline
- `ProjectHero` + `FeatureGrid` + MDX body

---

## 7. Component Inventory

```
layout/
  Nav.tsx              logo, links (About/Projects/Blog/Community), ⌘K pill
  Footer.tsx           copyright, GitHub/LinkedIn/Email

home/
  Hero.tsx             AsciiPortrait + h1 + lede + CTAs + AgendaCard
  AgendaCard.tsx       3 status items
  AboutSection.tsx     bio + skill chips (Frontend / Backend / Cloud)
  ProjectsSection.tsx  dynamic grid
  ProjectCard.tsx      accent border, tagline, tech chips, hover lift
  WritingSection.tsx   3 latest posts
  PostCard.tsx         title, date, excerpt, tag chips
  CommunitySection.tsx Women Talk Series + RTC cards

project/
  ProjectHero.tsx      title, tagline, stats grid, live/repo links
  FeatureGrid.tsx      4 feature cards with accent colors
  RecurrenceDemo.tsx   interactive widget (Calendar Clone only)

blog/
  BlogIndex.tsx        post list + tag filter logic
  TagFilter.tsx        clickable chips, active = periwinkle
  PostHeader.tsx       title, date, tags
  MDXComponents.tsx    Pre (+ copy button), BlogImage, Callout
                       (imported by root mdx-components.tsx)

ui/
  AsciiPortrait.tsx    canvas, /public/tania-portrait.jpeg, hover randomize effect
  FallingChars.tsx     ambient canvas, IBM Plex Mono chars, always-on
  CommandPalette.tsx   Cmd+K, arrow nav, Escape to close
  GameModeOverlay.tsx  snake canvas, pointer-events:none, wrap-around walls
  AchievementToast.tsx fixed bottom-right, slide-in, 3.2s auto-dismiss
  XPBar.tsx            4px top bar, periwinkle→mint, scroll-based

lib/
  content.ts            getProjectSlugs(), getBlogSlugs()
  game-mode-context.tsx React Context, isGameMode boolean + toggle
```

**Dropped from original spec:** `PixelAvatar.tsx` (replaced by `AsciiPortrait.tsx`), `lib/mdx.ts` (config now in `next.config.mjs`)

---

## 8. Game Mode Spec

- **Toggle:** floating pill `position: fixed; top: 76px; left: 1.5rem`
- **Indicator dot:** `ink-dim` (off) → `mint` glowing (on)
- **Konami code easter egg:** ↑↑↓↓←→←→BA triggers toggle
- **Snake canvas:** `position: fixed; inset: 0; pointer-events: none; z-index: 40`
- **Snake behaviour:** wrap-around walls, cell size 28px, WASD + Arrow keys
- **Food:** cycles coral → marigold → periwinkle → mint
- **Score milestone every 5:** AchievementToast "COMBO ×N"
- **FallingChars opacity:** `0.045` normal → `0.13` in game mode
- **XPBar:** 4px, periwinkle→mint gradient, scroll-progress based
- **Project cards:** "QUEST 0X" badge + "+50 XP" chip when game mode active
- **Pointer events none:** user can still scroll and click links during game

---

## 9. Blog Features

- **Sort:** date descending (newest first) always
- **Date display:** on PostCard (index) and PostHeader (post page)
- **Tags:** array of strings, displayed as chips
- **Tag filter:** client-side, click chip to filter, click again to clear, no page reload
- **Cross-posting:** canonical URL always `tanialapalelo.com`, Medium is distribution only

---

## 10. Build Sequence (Skeleton-First)

```
Step 1 — Scaffold
  pnpm create next-app → deps → tailwind tokens → fonts → globals.css
  → next.config.mjs (@next/mdx + rehype-pretty-code)

Step 2 — Shell
  Nav + Footer + all routes (empty placeholders, no 404s)

Step 3 — Ambient layer
  FallingChars.tsx + GameModeContext provider in root layout

Step 4 — Home sections
  Hero → About → Projects → Writing → Community

Step 5 — Content pipeline + real content
  lib/content.ts → calendar-clone.mdx → giftclaw.mdx
  ProjectHero + FeatureGrid + MDX body rendering

Step 6 — Blog
  MDXComponents.tsx → root mdx-components.tsx → blog index → blog post → placeholder post

Step 7 — Interactivity
  AsciiPortrait → CommandPalette → GameModeOverlay
  AchievementToast + XPBar + Konami code

Step 8 — Polish
  generateMetadata() all pages + @tailwindcss/typography
  a11y audit + Lighthouse
```

---

## 11. SEO & Metadata

- Root layout: static metadata (name, description, OG, Twitter card)
- Blog posts: `generateMetadata()` from metadata.title + metadata.excerpt + metadata.coverImage
- Projects: `generateMetadata()` from metadata.title + metadata.tagline
- Canonical: always `tanialapalelo.com`

---

## 12. A11y Baseline

- Focus ring: `outline-2 outline-periwinkle outline-offset-2` on all interactive elements
- `AsciiPortrait` + `FallingChars`: `aria-hidden="true"`
- Command palette: `role="dialog"` + `aria-modal` + focus trap
- Game canvas: `aria-hidden="true"`, toggle button has accessible label
- `@tailwindcss/typography` prose for MDX content
