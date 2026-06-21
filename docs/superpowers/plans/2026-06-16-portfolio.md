# Portfolio Tania Lapalelo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete personal portfolio — foundation, blog, game mode, and polish — all in one implementation using the skeleton-first approach.

**Architecture:** Scaffold all routes empty first, then fill content layer by layer: design system → shell (Nav/Footer) → ambient (FallingChars) → home sections → content pipeline (MDX) → blog → interactivity (AsciiPortrait, CommandPalette, GameMode) → polish.

**Tech Stack:** Next.js 16.2.9, Tailwind CSS v4.3.1, @next/mdx 16.2.9, @mdx-js/loader, @mdx-js/react, rehype-pretty-code 0.14.3, shiki 4.2.0, @tailwindcss/typography 0.5.20, Vitest 4.1.9, @testing-library/react 16.3.2, pnpm

---

## File Map

```
next.config.mjs                          MDX + rehype-pretty-code config
tailwind.config.ts                       (not used in v4 — config is in CSS)
postcss.config.mjs                       @tailwindcss/postcss plugin
vitest.config.ts                         test runner config
tests/setup.ts                           RTL + canvas mocks
mdx-components.tsx                       root-level @next/mdx requirement

styles/globals.css                       @import tailwindcss + @theme tokens

app/layout.tsx                           fonts, GameModeContext, Nav, Footer, FallingChars
app/page.tsx                             home page assembly
app/projects/[slug]/page.tsx             case study page
app/blog/page.tsx                        blog index page
app/blog/[slug]/page.tsx                 blog post page

lib/content.ts                           getProjectSlugs(), getBlogSlugs()
lib/game-mode-context.tsx                React Context: isGameMode, toggle
lib/snake.ts                             pure snake game logic (testable)

components/layout/Nav.tsx                logo, links, ⌘K pill
components/layout/Footer.tsx             copyright, social links

components/home/Hero.tsx                 AsciiPortrait + h1 + CTAs + AgendaCard
components/home/AgendaCard.tsx           3 status items
components/home/AboutSection.tsx         bio + skill chips
components/home/ProjectsSection.tsx      dynamic grid wrapper
components/home/ProjectCard.tsx          single project card
components/home/WritingSection.tsx       3 latest posts wrapper
components/home/PostCard.tsx             single post card
components/home/CommunitySection.tsx     Women Talk + RTC cards

components/project/ProjectHero.tsx       title, tagline, stats, links
components/project/FeatureGrid.tsx       4 feature cards
components/project/RecurrenceDemo.tsx    interactive RRULE widget

components/blog/BlogIndex.tsx            post list + filter logic ('use client')
components/blog/TagFilter.tsx            clickable tag chips ('use client')
components/blog/PostHeader.tsx           title, date, tags
components/blog/MDXComponents.tsx        Pre (copy btn), BlogImage, Callout

components/ui/AsciiPortrait.tsx          canvas ASCII renderer ('use client')
components/ui/FallingChars.tsx           ambient canvas ('use client')
components/ui/CommandPalette.tsx         ⌘K palette ('use client')
components/ui/GameModeOverlay.tsx        snake canvas overlay ('use client')
components/ui/AchievementToast.tsx       slide-in toast ('use client')
components/ui/XPBar.tsx                  scroll-progress bar ('use client')

content/projects/_template.mdx          copy when adding new project
content/projects/calendar-clone.mdx     Calendar Clone case study
content/projects/giftclaw.mdx           GiftClaw case study
content/blog/2026-06-16-hello-world.mdx placeholder post to test pipeline
```

---

### Task 1: Scaffold project and install dependencies

**Files:**
- Create: `package.json` (via create-next-app)
- Create: `postcss.config.mjs`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/tania/projects/latest-portfolio
pnpm create next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
# When asked about existing files in directory: continue (Y)
# When asked about Turbopack: Yes
```

- [ ] **Step 2: Install MDX + syntax highlighting**

```bash
pnpm add @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
pnpm add rehype-pretty-code shiki
```

- [ ] **Step 3: Install Tailwind v4 and typography plugin**

```bash
pnpm add tailwindcss@latest @tailwindcss/postcss@latest @tailwindcss/typography
# If create-next-app installed Tailwind v3, this upgrades it to v4
```

- [ ] **Step 4: Install test dependencies**

```bash
pnpm add -D vitest@latest @vitejs/plugin-react vite-tsconfig-paths jsdom
pnpm add -D @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

- [ ] **Step 5: Create postcss.config.mjs**

```js
// postcss.config.mjs
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
export default config
```

- [ ] **Step 6: Create vitest.config.ts**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
  },
})
```

- [ ] **Step 7: Create tests/setup.ts**

```ts
// tests/setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/',
}))

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [k: string]: unknown }) =>
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />,
}))

const mockCtx = {
  fillStyle: '' as string,
  font: '' as string,
  fillRect: vi.fn(),
  fillText: vi.fn(),
  clearRect: vi.fn(),
  drawImage: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4 * 40 * 18) })),
}
HTMLCanvasElement.prototype.getContext = vi.fn(() => mockCtx) as never
```

- [ ] **Step 8: Add test script to package.json**

Open `package.json`, add to `"scripts"`:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 9: Verify test runner works**

```bash
pnpm test:run
```
Expected: "No test files found" (not an error crash)

- [ ] **Step 10: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js 16 project with Tailwind v4, MDX, Vitest"
```

---

### Task 2: Design system — globals.css with Tailwind v4 tokens

**Files:**
- Modify: `styles/globals.css`

- [ ] **Step 1: Replace globals.css entirely**

```css
/* styles/globals.css */
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  /* Background */
  --color-bg: #1C1E2A;
  --color-bg-elevated: #242738;
  --color-bg-elevated-2: #2C2F45;

  /* Text */
  --color-ink: #EFEBE3;
  --color-ink-dim: #9C99AC;

  /* Borders */
  --color-grid-line: rgba(239 235 227 / 0.10);

  /* Accent — categorical, not decorative */
  --color-coral: #FF6B5C;
  --color-marigold: #FFB627;
  --color-periwinkle: #9AA6FF;
  --color-mint: #4ED9B0;

  /* Accent soft backgrounds */
  --color-coral-soft: rgba(255 107 92 / 0.14);
  --color-marigold-soft: rgba(255 182 39 / 0.14);
  --color-periwinkle-soft: rgba(154 166 255 / 0.14);
  --color-mint-soft: rgba(78 217 176 / 0.14);

  /* Typography — populated by next/font CSS vars in layout.tsx */
  --font-display: var(--font-fraunces);
  --font-body: var(--font-inter);
  --font-mono: var(--font-ibm-plex-mono);

  /* Border radius */
  --radius-card: 14px;
}

body {
  background-color: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-body);
}

* {
  border-color: var(--color-grid-line);
}

::selection {
  background-color: var(--color-periwinkle);
  color: var(--color-bg);
}

:focus-visible {
  outline: 2px solid var(--color-periwinkle);
  outline-offset: 2px;
}
```

- [ ] **Step 2: Commit**

```bash
git add styles/globals.css postcss.config.mjs
git commit -m "feat: design system tokens via Tailwind v4 @theme"
```

---

### Task 3: Configure @next/mdx with rehype-pretty-code

**Files:**
- Modify: `next.config.mjs`
- Create: `mdx-components.tsx` (root-level stub — full implementation in Task 17)

- [ ] **Step 1: Write next.config.mjs**

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

- [ ] **Step 2: Create root-level mdx-components.tsx stub**

```tsx
// mdx-components.tsx
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components }
}
```

(This stub gets replaced in Task 17 with real custom components.)

- [ ] **Step 3: Commit**

```bash
git add next.config.mjs mdx-components.tsx
git commit -m "feat: configure @next/mdx with rehype-pretty-code"
```

---

### Task 4: Root layout — fonts, providers, shell

**Files:**
- Create: `lib/game-mode-context.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write failing test for GameModeContext**

```tsx
// tests/lib/game-mode-context.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { GameModeProvider, useGameMode } from '@/lib/game-mode-context'

function Toggle() {
  const { isGameMode, toggle } = useGameMode()
  return (
    <button onClick={toggle}>
      {isGameMode ? 'on' : 'off'}
    </button>
  )
}

test('starts off, toggles on', () => {
  render(<GameModeProvider><Toggle /></GameModeProvider>)
  expect(screen.getByText('off')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button'))
  expect(screen.getByText('on')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:run tests/lib/game-mode-context.test.tsx
```
Expected: FAIL — "Cannot find module '@/lib/game-mode-context'"

- [ ] **Step 3: Create lib/game-mode-context.tsx**

```tsx
// lib/game-mode-context.tsx
'use client'
import { createContext, useContext, useState } from 'react'

type GameModeCtx = { isGameMode: boolean; toggle: () => void }
const Ctx = createContext<GameModeCtx>({ isGameMode: false, toggle: () => {} })

export function GameModeProvider({ children }: { children: React.ReactNode }) {
  const [isGameMode, setIsGameMode] = useState(false)
  return (
    <Ctx.Provider value={{ isGameMode, toggle: () => setIsGameMode(v => !v) }}>
      {children}
    </Ctx.Provider>
  )
}

export const useGameMode = () => useContext(Ctx)
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:run tests/lib/game-mode-context.test.tsx
```
Expected: PASS

- [ ] **Step 5: Write app/layout.tsx**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Fraunces, Inter, IBM_Plex_Mono } from 'next/font/google'
import { GameModeProvider } from '@/lib/game-mode-context'
import '@/styles/globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  style: ['normal', 'italic'],
})
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
})

export const metadata: Metadata = {
  title: 'Tania Lapalelo — Frontend Engineer',
  description:
    'Frontend engineer with 5 years of production experience building full-stack systems with Next.js, NestJS, TypeScript, and PostgreSQL.',
  openGraph: {
    title: 'Tania Lapalelo',
    description:
      'Frontend engineer with 5 years of production experience.',
    url: 'https://tanialapalelo.com',
    siteName: 'Tania Lapalelo',
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body className="min-h-screen bg-bg font-body text-ink antialiased">
        <GameModeProvider>
          {/* Nav, FallingChars, XPBar wired in Tasks 6, 8, 26 */}
          <main>{children}</main>
          {/* Footer wired in Task 7 */}
        </GameModeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Scaffold all empty routes**

```bash
mkdir -p app/projects/\[slug\] app/blog/\[slug\]
```

```tsx
// app/page.tsx
export default function Home() {
  return <div className="mx-auto max-w-[1080px] px-6">Home — coming soon</div>
}
```

```tsx
// app/projects/[slug]/page.tsx
export default function ProjectPage() {
  return <div>Project — coming soon</div>
}
```

```tsx
// app/blog/page.tsx
export default function BlogPage() {
  return <div>Blog — coming soon</div>
}
```

```tsx
// app/blog/[slug]/page.tsx
export default function BlogPostPage() {
  return <div>Post — coming soon</div>
}
```

- [ ] **Step 7: Start dev server and verify no crashes**

```bash
pnpm dev
```
Expected: http://localhost:3000 loads, shows "Home — coming soon", dark background `#1C1E2A` visible.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: root layout with fonts, GameModeContext, empty routes"
```

---

### Task 5: Nav component

**Files:**
- Create: `components/layout/Nav.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write smoke test**

```tsx
// tests/components/layout/Nav.test.tsx
import { render, screen } from '@testing-library/react'
import { Nav } from '@/components/layout/Nav'

test('renders all nav links', () => {
  render(<Nav />)
  expect(screen.getByText('Projects')).toBeInTheDocument()
  expect(screen.getByText('Blog')).toBeInTheDocument()
  expect(screen.getByText('Community')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:run tests/components/layout/Nav.test.tsx
```

- [ ] **Step 3: Create components/layout/Nav.tsx**

```tsx
// components/layout/Nav.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/#about', label: 'About' },
  { href: '/#projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/#community', label: 'Community' },
]

export function Nav() {
  const pathname = usePathname()
  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-grid-line bg-bg/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1080px] items-center justify-between px-6">
        <Link href="/" className="font-display italic text-lg text-ink hover:text-periwinkle transition-colors">
          tania.
        </Link>
        <div className="flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-mono text-sm text-ink-dim hover:text-periwinkle transition-colors"
            >
              {label}
            </Link>
          ))}
          {/* ⌘K pill — wired in Task 23 */}
          <button
            className="font-mono text-xs text-ink-dim border border-grid-line rounded-md px-2 py-1 hover:text-periwinkle hover:border-periwinkle transition-colors"
            aria-label="Open command palette"
          >
            ⌘K
          </button>
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:run tests/components/layout/Nav.test.tsx
```

- [ ] **Step 5: Wire Nav into layout.tsx**

Replace the `{/* Nav ... */}` comment in `app/layout.tsx`:

```tsx
import { Nav } from '@/components/layout/Nav'
// inside <body>:
<Nav />
```

- [ ] **Step 6: Commit**

```bash
git add components/layout/Nav.tsx app/layout.tsx tests/components/layout/Nav.test.tsx
git commit -m "feat: Nav component with links and ⌘K pill stub"
```

---

### Task 6: Footer component

**Files:**
- Create: `components/layout/Footer.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write smoke test**

```tsx
// tests/components/layout/Footer.test.tsx
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/Footer'

test('renders copyright and social links', () => {
  render(<Footer />)
  expect(screen.getByText(/Tania Lapalelo/)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:run tests/components/layout/Footer.test.tsx
```

- [ ] **Step 3: Create components/layout/Footer.tsx**

```tsx
// components/layout/Footer.tsx
export function Footer() {
  return (
    <footer className="border-t border-grid-line mt-24">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between px-6 py-8">
        <p className="font-mono text-xs text-ink-dim">
          © {new Date().getFullYear()} Tania Lapalelo
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/tanialapalelo"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-ink-dim hover:text-periwinkle transition-colors"
            aria-label="GitHub"
          >
            GitHub ↗
          </a>
          <a
            href="https://linkedin.com/in/tanialapalelo"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-ink-dim hover:text-periwinkle transition-colors"
            aria-label="LinkedIn"
          >
            LinkedIn ↗
          </a>
          <a
            href="mailto:niatania102@gmail.com"
            className="font-mono text-xs text-ink-dim hover:text-periwinkle transition-colors"
            aria-label="Email"
          >
            Email ↗
          </a>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:run tests/components/layout/Footer.test.tsx
```

- [ ] **Step 5: Wire Footer into layout.tsx**

```tsx
import { Footer } from '@/components/layout/Footer'
// inside <GameModeProvider>, after <main>:
<Footer />
```

- [ ] **Step 6: Commit**

```bash
git add components/layout/Footer.tsx app/layout.tsx tests/components/layout/Footer.test.tsx
git commit -m "feat: Footer with social links"
```

---

### Task 7: FallingChars ambient background

**Files:**
- Create: `components/ui/FallingChars.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write smoke test**

```tsx
// tests/components/ui/FallingChars.test.tsx
import { render } from '@testing-library/react'
import { GameModeProvider } from '@/lib/game-mode-context'
import { FallingChars } from '@/components/ui/FallingChars'

test('renders canvas element', () => {
  const { container } = render(
    <GameModeProvider><FallingChars /></GameModeProvider>
  )
  expect(container.querySelector('canvas')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:run tests/components/ui/FallingChars.test.tsx
```

- [ ] **Step 3: Create components/ui/FallingChars.tsx**

```tsx
// components/ui/FallingChars.tsx
'use client'
import { useEffect, useRef } from 'react'
import { useGameMode } from '@/lib/game-mode-context'

const CHARS = '{}[]<>=+-*/\\|:.,#@$%^&!?;'
const CELL = 16
const COLORS = ['#9AA6FF', '#9AA6FF', '#4ED9B0']

export function FallingChars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isGameMode } = useGameMode()

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let cols: number
    let drops: number[]

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      cols = Math.floor(canvas.width / CELL)
      drops = Array.from({ length: cols }, () => Math.random() * -80)
    }

    function draw() {
      ctx.fillStyle = 'rgba(28,30,42,0.18)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < cols; i++) {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)]
        ctx.fillStyle = COLORS[i % COLORS.length]
        ctx.font = `${CELL - 2}px "IBM Plex Mono", monospace`
        ctx.fillText(ch, i * CELL, drops[i] * CELL)
        if (drops[i] * CELL > canvas.height && Math.random() > 0.975) drops[i] = 0
        else drops[i] += 0.4
      }
    }

    resize()
    window.addEventListener('resize', resize)
    const id = setInterval(draw, 55)
    return () => {
      window.removeEventListener('resize', resize)
      clearInterval(id)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none z-0 transition-opacity duration-700"
      style={{ opacity: isGameMode ? 0.13 : 0.045 }}
      aria-hidden="true"
    />
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:run tests/components/ui/FallingChars.test.tsx
```

- [ ] **Step 5: Wire into layout.tsx**

```tsx
import { FallingChars } from '@/components/ui/FallingChars'
// inside <body>, before <Nav>:
<FallingChars />
```

- [ ] **Step 6: Commit**

```bash
git add components/ui/FallingChars.tsx app/layout.tsx tests/components/ui/FallingChars.test.tsx
git commit -m "feat: FallingChars ambient canvas background"
```

---

### Task 8: lib/content.ts — content discovery utilities

**Files:**
- Create: `lib/content.ts`
- Create: `tests/lib/content.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// tests/lib/content.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import fs from 'fs'

vi.mock('fs')

describe('getProjectSlugs', () => {
  beforeEach(() => {
    vi.mocked(fs.readdirSync).mockReturnValue(
      ['calendar-clone.mdx', 'giftclaw.mdx', '_template.mdx'] as never
    )
  })

  it('returns slugs without extension, excluding _ prefix', async () => {
    const { getProjectSlugs } = await import('@/lib/content')
    expect(getProjectSlugs()).toEqual(['calendar-clone', 'giftclaw'])
  })
})

describe('getBlogSlugs', () => {
  beforeEach(() => {
    vi.mocked(fs.readdirSync).mockReturnValue(
      ['2026-06-16-hello-world.mdx', '2026-05-01-rrule.mdx'] as never
    )
  })

  it('returns all blog slugs without extension', async () => {
    const { getBlogSlugs } = await import('@/lib/content')
    expect(getBlogSlugs()).toEqual([
      '2026-06-16-hello-world',
      '2026-05-01-rrule',
    ])
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:run tests/lib/content.test.ts
```

- [ ] **Step 3: Create lib/content.ts**

```ts
// lib/content.ts
import fs from 'fs'
import path from 'path'

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects')
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export function getProjectSlugs(): string[] {
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter(f => f.endsWith('.mdx') && !f.startsWith('_'))
    .map(f => f.replace('.mdx', ''))
}

export function getBlogSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace('.mdx', ''))
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:run tests/lib/content.test.ts
```

- [ ] **Step 5: Scaffold content directories**

```bash
mkdir -p content/projects content/blog
```

- [ ] **Step 6: Commit**

```bash
git add lib/content.ts tests/lib/content.test.ts content/
git commit -m "feat: content discovery utilities with tests"
```

---

### Task 9: Home page — Hero and AgendaCard

**Files:**
- Create: `components/home/AgendaCard.tsx`
- Create: `components/home/Hero.tsx`

- [ ] **Step 1: Create components/home/AgendaCard.tsx**

```tsx
// components/home/AgendaCard.tsx
const items = [
  {
    dot: 'bg-mint',
    label: 'Current',
    value: 'Frontend Engineer @ Wings Group Indonesia',
  },
  {
    dot: 'bg-periwinkle',
    label: 'Open to',
    value: 'Full-stack SWE roles',
  },
  {
    dot: 'bg-marigold',
    label: 'Pursuing',
    value: 'Master\'s in HCI / CS with AI & Learning Systems',
  },
]

export function AgendaCard() {
  return (
    <div className="rounded-[14px] border border-grid-line bg-bg-elevated p-6 flex flex-col gap-4">
      <p className="font-mono text-xs text-ink-dim uppercase tracking-widest">Status</p>
      {items.map(({ dot, label, value }) => (
        <div key={label} className="flex items-start gap-3">
          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} />
          <div>
            <p className="font-mono text-xs text-ink-dim">{label}</p>
            <p className="text-sm text-ink">{value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create components/home/Hero.tsx**

```tsx
// components/home/Hero.tsx
import Link from 'next/link'
import { AgendaCard } from './AgendaCard'

export function Hero() {
  return (
    <section className="pt-32 pb-20">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-6">
          {/* AsciiPortrait wired in Task 22 */}
          <div className="h-48 w-48 rounded-[14px] border border-grid-line bg-bg-elevated flex items-center justify-center">
            <span className="font-mono text-xs text-ink-dim">portrait</span>
          </div>
          <div>
            <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-2">
              IT ● Women Empowerment ● Creativity
            </p>
            <h1 className="font-display italic text-5xl text-ink leading-tight">
              Tania Lapalelo
            </h1>
            <p className="mt-4 text-ink-dim max-w-md">
              Frontend engineer with 5 years of production experience. Building full-stack systems with Next.js, NestJS, TypeScript, and PostgreSQL.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/#projects"
              className="bg-periwinkle text-bg font-mono text-sm px-5 py-2.5 rounded-lg hover:-translate-y-0.5 transition-transform"
            >
              View Projects
            </Link>
            <a
              href="mailto:niatania102@gmail.com"
              className="border border-grid-line text-ink font-mono text-sm px-5 py-2.5 rounded-lg hover:-translate-y-0.5 transition-transform"
            >
              Get in Touch
            </a>
          </div>
        </div>
        <div>
          <AgendaCard />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/home/Hero.tsx components/home/AgendaCard.tsx
git commit -m "feat: Hero and AgendaCard home sections"
```

---

### Task 10: Home page — AboutSection

**Files:**
- Create: `components/home/AboutSection.tsx`

- [ ] **Step 1: Create components/home/AboutSection.tsx**

```tsx
// components/home/AboutSection.tsx
const skills = {
  Frontend: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vitest', 'Playwright'],
  Backend: ['NestJS', 'Node.js', 'PostgreSQL', 'Prisma', 'REST', 'tRPC'],
  Cloud: ['Vercel', 'Supabase', 'Upstash Redis', 'Sentry', 'GitHub Actions'],
}

export function AboutSection() {
  return (
    <section id="about" className="pt-20">
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-4">About</p>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-4 text-ink-dim leading-relaxed">
          <p>
            I&apos;m a frontend engineer at Wings Group Indonesia — a 20,000-person FMCG enterprise — where I&apos;ve spent five years building and shipping production systems that real people depend on.
          </p>
          <p>
            My work sits at the intersection of engineering rigour and thoughtful design. I care about accessibility, test coverage, and systems that are maintainable long after the sprint ends.
          </p>
          <p>
            Outside of work I run the Women Talk Series — a community initiative for women in tech — and contribute to Rewriting the Code.
          </p>
        </div>
        <div className="flex flex-col gap-6">
          {Object.entries(skills).map(([group, chips]) => (
            <div key={group}>
              <p className="font-mono text-xs text-ink-dim mb-2">{group}</p>
              <div className="flex flex-wrap gap-2">
                {chips.map(skill => (
                  <span
                    key={skill}
                    className="font-mono text-xs text-ink border border-grid-line rounded-md px-2.5 py-1 bg-bg-elevated"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/AboutSection.tsx
git commit -m "feat: AboutSection with bio and skill chips"
```

---

### Task 11: Home page — ProjectCard and ProjectsSection

**Files:**
- Create: `components/home/ProjectCard.tsx`
- Create: `components/home/ProjectsSection.tsx`

- [ ] **Step 1: Create components/home/ProjectCard.tsx**

```tsx
// components/home/ProjectCard.tsx
import Link from 'next/link'

type Accent = 'coral' | 'marigold' | 'periwinkle' | 'mint'

const accentBorder: Record<Accent, string> = {
  coral: 'border-coral',
  marigold: 'border-marigold',
  periwinkle: 'border-periwinkle',
  mint: 'border-mint',
}

const accentText: Record<Accent, string> = {
  coral: 'text-coral',
  marigold: 'text-marigold',
  periwinkle: 'text-periwinkle',
  mint: 'text-mint',
}

type Props = {
  slug: string
  caseStudyNumber: string
  title: string
  accent: Accent
  tagline: string
  tech: string[]
}

export function ProjectCard({ slug, caseStudyNumber, title, accent, tagline, tech }: Props) {
  return (
    <Link
      href={`/projects/${slug}`}
      className={`group block rounded-[14px] border-2 ${accentBorder[accent]} bg-bg-elevated p-6 hover:-translate-y-1 transition-transform`}
    >
      <p className={`font-mono text-xs ${accentText[accent]} uppercase tracking-widest mb-2`}>
        Case Study {caseStudyNumber}
      </p>
      <h3 className="font-display italic text-2xl text-ink mb-2">{title}</h3>
      <p className="text-sm text-ink-dim mb-4">{tagline}</p>
      <div className="flex flex-wrap gap-2">
        {tech.slice(0, 4).map(t => (
          <span key={t} className="font-mono text-xs text-ink-dim border border-grid-line rounded px-2 py-0.5">
            {t}
          </span>
        ))}
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Create components/home/ProjectsSection.tsx**

```tsx
// components/home/ProjectsSection.tsx
import { ProjectCard } from './ProjectCard'
import { getProjectSlugs } from '@/lib/content'

export async function ProjectsSection() {
  const slugs = getProjectSlugs()
  const projects = await Promise.all(
    slugs.map(async slug => {
      const { metadata } = await import(`@/content/projects/${slug}.mdx`)
      return { slug, ...metadata }
    })
  )

  return (
    <section id="projects" className="pt-20">
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-4">Projects</p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map(p => (
          <ProjectCard key={p.slug} {...p} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/home/ProjectCard.tsx components/home/ProjectsSection.tsx
git commit -m "feat: ProjectCard and ProjectsSection"
```

---

### Task 12: Home page — PostCard and WritingSection

**Files:**
- Create: `components/home/PostCard.tsx`
- Create: `components/home/WritingSection.tsx`

- [ ] **Step 1: Create components/home/PostCard.tsx**

```tsx
// components/home/PostCard.tsx
import Link from 'next/link'

type Props = {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
}

export function PostCard({ slug, title, date, excerpt, tags }: Props) {
  const formatted = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
  return (
    <Link
      href={`/blog/${slug}`}
      className="group block rounded-[14px] border border-grid-line bg-bg-elevated p-6 hover:-translate-y-1 transition-transform"
    >
      <p className="font-mono text-xs text-ink-dim mb-2">{formatted}</p>
      <h3 className="font-display italic text-xl text-ink mb-2 group-hover:text-periwinkle transition-colors">
        {title}
      </h3>
      <p className="text-sm text-ink-dim mb-4 line-clamp-2">{excerpt}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="font-mono text-xs text-periwinkle border border-periwinkle-soft rounded px-2 py-0.5 bg-periwinkle-soft">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Create components/home/WritingSection.tsx**

```tsx
// components/home/WritingSection.tsx
import Link from 'next/link'
import { PostCard } from './PostCard'
import { getBlogSlugs } from '@/lib/content'

export async function WritingSection() {
  const slugs = getBlogSlugs()
  const allPosts = await Promise.all(
    slugs.map(async slug => {
      const { metadata } = await import(`@/content/blog/${slug}.mdx`)
      return { slug, ...metadata }
    })
  )
  const posts = allPosts
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

  return (
    <section id="writing" className="pt-20">
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-xs text-periwinkle uppercase tracking-widest">Writing</p>
        <Link href="/blog" className="font-mono text-xs text-ink-dim hover:text-periwinkle transition-colors">
          All posts →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {posts.map(p => <PostCard key={p.slug} {...p} />)}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/home/PostCard.tsx components/home/WritingSection.tsx
git commit -m "feat: PostCard and WritingSection"
```

---

### Task 13: Home page — CommunitySection

**Files:**
- Create: `components/home/CommunitySection.tsx`

- [ ] **Step 1: Create components/home/CommunitySection.tsx**

```tsx
// components/home/CommunitySection.tsx
const communities = [
  {
    accent: 'coral' as const,
    label: 'Women Talk Series',
    description: 'A talk series spotlighting women in technology — their journeys, their craft, their advice.',
    link: 'https://www.youtube.com/watch?v=AxnzU07nlVk&list=PL-1PWH5uyT-eJSJf1oQTbnlbvUDS-I4HK',
    linkLabel: 'Watch on YouTube ↗',
  },
  {
    accent: 'mint' as const,
    label: 'Rewriting the Code',
    description: 'A nonprofit supporting women and non-binary students in tech with community, mentorship, and opportunities.',
    link: 'https://rewritingthecode.org/',
    linkLabel: 'Visit RTC ↗',
  },
]

const accentBorder = { coral: 'border-coral', mint: 'border-mint' }
const accentText = { coral: 'text-coral', mint: 'text-mint' }

export function CommunitySection() {
  return (
    <section id="community" className="pt-20 pb-20">
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-4">Community</p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {communities.map(({ accent, label, description, link, linkLabel }) => (
          <div
            key={label}
            className={`rounded-[14px] border-2 ${accentBorder[accent]} bg-bg-elevated p-6`}
          >
            <p className={`font-mono text-xs ${accentText[accent]} uppercase tracking-widest mb-2`}>{label}</p>
            <p className="text-sm text-ink-dim mb-4">{description}</p>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-mono text-xs ${accentText[accent]} hover:underline`}
            >
              {linkLabel}
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/CommunitySection.tsx
git commit -m "feat: CommunitySection with Women Talk Series and RTC"
```

---

### Task 14: Assemble home page and create content files

**Files:**
- Modify: `app/page.tsx`
- Create: `content/projects/_template.mdx`
- Create: `content/projects/calendar-clone.mdx`
- Create: `content/projects/giftclaw.mdx`
- Create: `content/blog/2026-06-16-hello-world.mdx`

- [ ] **Step 1: Assemble app/page.tsx**

```tsx
// app/page.tsx
import { Hero } from '@/components/home/Hero'
import { AboutSection } from '@/components/home/AboutSection'
import { ProjectsSection } from '@/components/home/ProjectsSection'
import { WritingSection } from '@/components/home/WritingSection'
import { CommunitySection } from '@/components/home/CommunitySection'

export default function Home() {
  return (
    <div className="relative z-10 mx-auto max-w-[1080px] px-6">
      <Hero />
      <AboutSection />
      <ProjectsSection />
      <WritingSection />
      <CommunitySection />
    </div>
  )
}
```

- [ ] **Step 2: Create content/projects/_template.mdx**

```mdx
export const metadata = {
  title: "Project Title",
  slug: "project-slug",
  caseStudyNumber: "03",
  accent: "periwinkle",
  tagline: "One sentence describing what this project does.",
  liveUrl: "https://example.com",
  repoUrl: "https://github.com/tanialapalelo/project-slug",
  tech: ["Next.js 16", "TypeScript"],
  stats: [
    { label: "Scope", value: "Solo" },
  ],
  features: [
    {
      title: "Feature Title",
      accent: "periwinkle",
      description: "What this feature does.",
      chips: ["Tech 1", "Tech 2"],
    },
  ],
}

## Why I built this

Write case study body here.
```

- [ ] **Step 3: Create content/projects/calendar-clone.mdx**

```mdx
export const metadata = {
  title: "Calendar Clone",
  slug: "calendar-clone",
  caseStudyNumber: "01",
  accent: "marigold",
  tagline: "A production-grade Google Calendar rebuild — OAuth, RRULE engine, real test suite.",
  liveUrl: "https://calendar-web-ivory.vercel.app",
  repoUrl: "https://github.com/tanialapalelo/calendar-clone",
  tech: ["Next.js 16", "NestJS 11", "PostgreSQL", "Turborepo"],
  stats: [
    { label: "Monorepo", value: "Turborepo" },
    { label: "Views", value: "4 (Year / Month / Week / Day)" },
    { label: "Milestones", value: "7 / 7 shipped" },
    { label: "Scope", value: "Solo" },
  ],
  features: [
    {
      title: "API-owned OAuth",
      accent: "coral",
      description: "Google OAuth 2.0 with HttpOnly JWT cookies and CSRF state validation.",
      chips: ["OAuth 2.0", "HttpOnly JWT", "CSRF protection"],
    },
    {
      title: "Real RRULE semantics",
      accent: "marigold",
      description: "Recurring events with per-instance exceptions: this, following, or all.",
      chips: ["RRULE", "Exceptions", "Edit scopes"],
    },
    {
      title: "Tested like production",
      accent: "periwinkle",
      description: "Vitest + RTL on the frontend. Jest + Supertest e2e against real PostgreSQL.",
      chips: ["Vitest", "Jest + Supertest", "CodeQL"],
    },
    {
      title: "Built for keyboards too",
      accent: "mint",
      description: "WAI-ARIA modals, dark mode, four calendar views, keyboard shortcuts.",
      chips: ["WAI-ARIA", "Keyboard nav", "Dark mode"],
    },
  ],
}

## Why I built a calendar from scratch

Most engineers treat Google Calendar as a black box. I wanted to understand every moving part — especially recurring events, which look simple until you try to implement "edit this and all following" semantics across timezones.

## The RRULE engine

The hardest part wasn't the UI. It was building a recurrence engine that correctly handles exceptions. When you edit one occurrence in a recurring series, you need to store that exception without breaking the rest of the series.

<RecurrenceDemo />

## Architecture

The monorepo splits cleanly: a Next.js frontend, a NestJS API, and a shared TypeScript package for types. Turborepo caches build artifacts so CI stays fast.

## What I learned

OAuth is harder than it looks when you own the backend. HttpOnly cookies, CSRF tokens, and refresh token rotation all need to work together. Getting this wrong in production means silent auth failures.
```

- [ ] **Step 4: Create content/projects/giftclaw.mdx**

```mdx
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
    {
      title: "AI Gift Matching",
      accent: "mint",
      description: "Describe a friend's interests and budget — Gemini generates 8 personalized gift ideas.",
      chips: ["Gemini 2.5 Flash", "Prompt engineering", "Rate limiting"],
    },
    {
      title: "Arcade Claw Machine",
      accent: "coral",
      description: "Recipients play a claw machine game that reveals mood-based clues — without seeing names or prices.",
      chips: ["Canvas game", "Clue system", "Shareable link"],
    },
    {
      title: "Privacy by Design",
      accent: "marigold",
      description: "Budget and gift names never exposed to the recipient. Only mood clues revealed through gameplay.",
      chips: ["Privacy-first", "Supabase", "Prisma 7"],
    },
    {
      title: "Production-grade Infra",
      accent: "periwinkle",
      description: "Upstash Redis rate limiting, Sentry error tracking, Vercel Analytics, Vitest + Playwright.",
      chips: ["Vitest", "Playwright", "Sentry"],
    },
  ],
}

## The idea

Gift-giving is hard. You know someone well enough to care, but not well enough to be certain. I wanted to use AI to bridge that gap — and make the reveal itself feel special.

## How it works

The gift giver describes their friend: interests, personality, budget. Gemini 2.5 Flash generates eight gift suggestions, each tagged with a mood (cozy, adventurous, creative, etc.).

The receiver gets a link to a playable claw machine. As they grab items, they see mood-based clues — "something cozy" — without ever seeing the budget or exact gift names. It's a discovery experience, not a shopping list.

## Privacy by design

The constraint that made this interesting: the receiver should feel surprised, not surveilled. The backend never sends gift names or prices to the client until the giver chooses to reveal. All the claw machine knows is mood tags.

## What I learned

Rate limiting matters earlier than you think. Without Upstash Redis limiting Gemini calls per user per day, the API costs would spiral immediately. Adding it after launch would have been much harder.
```

- [ ] **Step 5: Create content/blog/2026-06-16-hello-world.mdx**

```mdx
export const metadata = {
  title: "Hello World",
  date: "2026-06-16",
  excerpt: "First post — testing the blog pipeline.",
  tags: ["meta"],
}

# Hello World

This is a placeholder post to verify the blog pipeline works end-to-end.

```typescript
// Code highlighting test
function greet(name: string): string {
  return `Hello, ${name}!`
}
```

More writing coming soon.
```

- [ ] **Step 6: Start dev server, verify home page loads with project cards**

```bash
pnpm dev
```
Expected: http://localhost:3000 shows Hero, About, 2 project cards (Calendar Clone + GiftClaw), Community section. No 500 errors.

- [ ] **Step 7: Commit**

```bash
git add app/page.tsx content/
git commit -m "feat: assemble home page and add MDX content files"
```

---

### Task 15: MDXComponents and mdx-components.tsx

**Files:**
- Create: `components/blog/MDXComponents.tsx`
- Modify: `mdx-components.tsx`

- [ ] **Step 1: Create components/blog/MDXComponents.tsx**

```tsx
// components/blog/MDXComponents.tsx
'use client'
import { useState } from 'react'
import Image from 'next/image'
import type { MDXComponents } from 'mdx/types'

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="absolute top-3 right-3 font-mono text-xs text-ink-dim border border-grid-line rounded px-2 py-1 hover:text-periwinkle transition-colors"
      aria-label="Copy code"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export function Pre({ children, ...props }: React.ComponentProps<'pre'>) {
  const code = typeof children === 'string'
    ? children
    : (children as React.ReactElement)?.props?.children ?? ''
  return (
    <div className="relative my-6">
      <pre
        {...props}
        className="rounded-[14px] border border-grid-line bg-bg-elevated overflow-x-auto p-5 text-sm"
      >
        {children}
      </pre>
      <CopyButton code={String(code)} />
    </div>
  )
}

export function BlogImage({
  src, alt, ...props
}: { src: string; alt: string; width?: number; height?: number }) {
  return (
    <figure className="my-8">
      <Image
        src={src}
        alt={alt}
        width={props.width ?? 800}
        height={props.height ?? 450}
        className="rounded-[14px] border border-grid-line w-full h-auto"
      />
      {alt && <figcaption className="mt-2 text-center font-mono text-xs text-ink-dim">{alt}</figcaption>}
    </figure>
  )
}

export function Callout({
  type = 'info',
  children,
}: {
  type?: 'info' | 'warning' | 'tip'
  children: React.ReactNode
}) {
  const styles = {
    info: 'border-periwinkle bg-periwinkle-soft text-periwinkle',
    warning: 'border-marigold bg-marigold-soft text-marigold',
    tip: 'border-mint bg-mint-soft text-mint',
  }
  const labels = { info: 'Info', warning: 'Warning', tip: 'Tip' }
  return (
    <div className={`my-6 rounded-[14px] border-l-4 p-4 ${styles[type]}`}>
      <p className="font-mono text-xs uppercase tracking-widest mb-1">{labels[type]}</p>
      <div className="text-sm text-ink">{children}</div>
    </div>
  )
}

export const mdxComponents: MDXComponents = {
  pre: Pre,
  img: BlogImage as MDXComponents['img'],
  Callout,
}
```

- [ ] **Step 2: Update root mdx-components.tsx**

```tsx
// mdx-components.tsx
import type { MDXComponents } from 'mdx/types'
import { mdxComponents } from '@/components/blog/MDXComponents'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...mdxComponents, ...components }
}
```

- [ ] **Step 3: Commit**

```bash
git add components/blog/MDXComponents.tsx mdx-components.tsx
git commit -m "feat: MDX custom components — Pre with copy, BlogImage, Callout"
```

---

### Task 16: Project case study components and page

**Files:**
- Create: `components/project/ProjectHero.tsx`
- Create: `components/project/FeatureGrid.tsx`
- Modify: `app/projects/[slug]/page.tsx`

- [ ] **Step 1: Create components/project/ProjectHero.tsx**

```tsx
// components/project/ProjectHero.tsx
type Stat = { label: string; value: string }
type Props = {
  caseStudyNumber: string
  title: string
  accent: string
  tagline: string
  liveUrl: string
  repoUrl: string
  tech: string[]
  stats: Stat[]
}

const accentText: Record<string, string> = {
  coral: 'text-coral', marigold: 'text-marigold',
  periwinkle: 'text-periwinkle', mint: 'text-mint',
}

export function ProjectHero({ caseStudyNumber, title, accent, tagline, liveUrl, repoUrl, tech, stats }: Props) {
  return (
    <div className="pt-28 pb-12 border-b border-grid-line">
      <p className={`font-mono text-xs ${accentText[accent] ?? 'text-periwinkle'} uppercase tracking-widest mb-3`}>
        Case Study {caseStudyNumber}
      </p>
      <h1 className="font-display italic text-5xl text-ink mb-4">{title}</h1>
      <p className="text-ink-dim text-lg max-w-2xl mb-8">{tagline}</p>
      <div className="flex flex-wrap gap-3 mb-8">
        <a href={liveUrl} target="_blank" rel="noopener noreferrer"
          className="bg-periwinkle text-bg font-mono text-sm px-4 py-2 rounded-lg hover:-translate-y-0.5 transition-transform">
          Live Site ↗
        </a>
        <a href={repoUrl} target="_blank" rel="noopener noreferrer"
          className="border border-grid-line text-ink font-mono text-sm px-4 py-2 rounded-lg hover:-translate-y-0.5 transition-transform">
          GitHub ↗
        </a>
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
        {tech.map(t => (
          <span key={t} className="font-mono text-xs text-ink-dim border border-grid-line rounded px-2.5 py-1 bg-bg-elevated">
            {t}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-[14px] border border-grid-line bg-bg-elevated p-4">
            <p className="font-mono text-xs text-ink-dim mb-1">{label}</p>
            <p className="font-mono text-sm text-ink">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create components/project/FeatureGrid.tsx**

```tsx
// components/project/FeatureGrid.tsx
type Feature = {
  title: string
  accent: string
  description: string
  chips: string[]
}

const accentStyles: Record<string, { border: string; text: string; bg: string }> = {
  coral:      { border: 'border-coral',      text: 'text-coral',      bg: 'bg-coral-soft' },
  marigold:   { border: 'border-marigold',   text: 'text-marigold',   bg: 'bg-marigold-soft' },
  periwinkle: { border: 'border-periwinkle', text: 'text-periwinkle', bg: 'bg-periwinkle-soft' },
  mint:       { border: 'border-mint',       text: 'text-mint',       bg: 'bg-mint-soft' },
}

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 my-12">
      {features.map(({ title, accent, description, chips }) => {
        const s = accentStyles[accent] ?? accentStyles.periwinkle
        return (
          <div key={title} className={`rounded-[14px] border ${s.border} ${s.bg} p-6`}>
            <h3 className={`font-mono text-sm ${s.text} mb-2`}>{title}</h3>
            <p className="text-sm text-ink-dim mb-4">{description}</p>
            <div className="flex flex-wrap gap-2">
              {chips.map(chip => (
                <span key={chip} className={`font-mono text-xs ${s.text} border ${s.border} rounded px-2 py-0.5`}>
                  {chip}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Write app/projects/[slug]/page.tsx**

```tsx
// app/projects/[slug]/page.tsx
import type { Metadata } from 'next'
import { getProjectSlugs } from '@/lib/content'
import { ProjectHero } from '@/components/project/ProjectHero'
import { FeatureGrid } from '@/components/project/FeatureGrid'

export async function generateStaticParams() {
  return getProjectSlugs().map(slug => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const { metadata } = await import(`@/content/projects/${slug}.mdx`)
  return {
    title: `${metadata.title} — Tania Lapalelo`,
    description: metadata.tagline,
    openGraph: { title: metadata.title, description: metadata.tagline },
  }
}

export default async function ProjectPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { default: Content, metadata } = await import(`@/content/projects/${slug}.mdx`)
  return (
    <div className="relative z-10 mx-auto max-w-[1080px] px-6">
      <ProjectHero {...metadata} />
      <FeatureGrid features={metadata.features} />
      <div className="prose prose-invert max-w-none py-12">
        <Content />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify project pages load**

```bash
pnpm dev
```
Open http://localhost:3000/projects/calendar-clone — expect: ProjectHero with marigold accent, 4 feature cards, case study body text.
Open http://localhost:3000/projects/giftclaw — expect: mint accent, GiftClaw content.

- [ ] **Step 5: Commit**

```bash
git add components/project/ app/projects/
git commit -m "feat: project case study page — ProjectHero and FeatureGrid"
```

---

### Task 17: Blog index and post pages

**Files:**
- Create: `components/blog/TagFilter.tsx`
- Create: `components/blog/BlogIndex.tsx`
- Create: `components/blog/PostHeader.tsx`
- Modify: `app/blog/page.tsx`
- Modify: `app/blog/[slug]/page.tsx`

- [ ] **Step 1: Write failing TagFilter test**

```tsx
// tests/components/blog/TagFilter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { TagFilter } from '@/components/blog/TagFilter'

const tags = ['nextjs', 'frontend', 'uipath']

test('renders all tags', () => {
  render(<TagFilter tags={tags} activeTag={null} onSelect={() => {}} />)
  expect(screen.getByText('nextjs')).toBeInTheDocument()
  expect(screen.getByText('uipath')).toBeInTheDocument()
})

test('calls onSelect with tag when clicked', () => {
  const onSelect = vi.fn()
  render(<TagFilter tags={tags} activeTag={null} onSelect={onSelect} />)
  fireEvent.click(screen.getByText('frontend'))
  expect(onSelect).toHaveBeenCalledWith('frontend')
})

test('calls onSelect with null when active tag clicked', () => {
  const onSelect = vi.fn()
  render(<TagFilter tags={tags} activeTag="nextjs" onSelect={onSelect} />)
  fireEvent.click(screen.getByText('nextjs'))
  expect(onSelect).toHaveBeenCalledWith(null)
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:run tests/components/blog/TagFilter.test.tsx
```

- [ ] **Step 3: Create components/blog/TagFilter.tsx**

```tsx
// components/blog/TagFilter.tsx
'use client'
type Props = {
  tags: string[]
  activeTag: string | null
  onSelect: (tag: string | null) => void
}

export function TagFilter({ tags, activeTag, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by tag">
      {tags.map(tag => {
        const isActive = tag === activeTag
        return (
          <button
            key={tag}
            onClick={() => onSelect(isActive ? null : tag)}
            className={`font-mono text-xs rounded px-2.5 py-1 border transition-colors ${
              isActive
                ? 'bg-periwinkle text-bg border-periwinkle'
                : 'text-ink-dim border-grid-line hover:text-periwinkle hover:border-periwinkle'
            }`}
            aria-pressed={isActive}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:run tests/components/blog/TagFilter.test.tsx
```

- [ ] **Step 5: Create components/blog/BlogIndex.tsx**

```tsx
// components/blog/BlogIndex.tsx
'use client'
import { useState, useMemo } from 'react'
import { PostCard } from '@/components/home/PostCard'
import { TagFilter } from './TagFilter'

type Post = {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
}

export function BlogIndex({ posts }: { posts: Post[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap(p => p.tags))).sort(),
    [posts]
  )
  const filtered = activeTag
    ? posts.filter(p => p.tags.includes(activeTag))
    : posts

  return (
    <div>
      <TagFilter tags={allTags} activeTag={activeTag} onSelect={setActiveTag} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filtered.map(p => <PostCard key={p.slug} {...p} />)}
      </div>
      {filtered.length === 0 && (
        <p className="font-mono text-sm text-ink-dim text-center py-12">
          No posts tagged &quot;{activeTag}&quot;.
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 6: Create components/blog/PostHeader.tsx**

```tsx
// components/blog/PostHeader.tsx
type Props = {
  title: string
  date: string
  tags: string[]
  excerpt: string
}

export function PostHeader({ title, date, tags, excerpt }: Props) {
  const formatted = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  return (
    <div className="pt-28 pb-8 border-b border-grid-line">
      <p className="font-mono text-xs text-ink-dim mb-4">{formatted}</p>
      <h1 className="font-display italic text-5xl text-ink mb-4">{title}</h1>
      <p className="text-ink-dim text-lg mb-6">{excerpt}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="font-mono text-xs text-periwinkle border border-periwinkle-soft bg-periwinkle-soft rounded px-2 py-0.5">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Write app/blog/page.tsx**

```tsx
// app/blog/page.tsx
import type { Metadata } from 'next'
import { getBlogSlugs } from '@/lib/content'
import { BlogIndex } from '@/components/blog/BlogIndex'

export const metadata: Metadata = {
  title: 'Writing — Tania Lapalelo',
  description: 'Essays and notes on frontend engineering, full-stack systems, and building in public.',
}

export default async function BlogPage() {
  const slugs = getBlogSlugs()
  const allPosts = await Promise.all(
    slugs.map(async slug => {
      const { metadata } = await import(`@/content/blog/${slug}.mdx`)
      return { slug, ...metadata }
    })
  )
  const posts = allPosts.sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="relative z-10 mx-auto max-w-[1080px] px-6 pt-28">
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-2">Writing</p>
      <h1 className="font-display italic text-5xl text-ink mb-12">All Posts</h1>
      <BlogIndex posts={posts} />
    </div>
  )
}
```

- [ ] **Step 8: Write app/blog/[slug]/page.tsx**

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { getBlogSlugs } from '@/lib/content'
import { PostHeader } from '@/components/blog/PostHeader'

export async function generateStaticParams() {
  return getBlogSlugs().map(slug => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const { metadata } = await import(`@/content/blog/${slug}.mdx`)
  return {
    title: `${metadata.title} — Tania Lapalelo`,
    description: metadata.excerpt,
    openGraph: {
      title: metadata.title,
      description: metadata.excerpt,
      ...(metadata.coverImage && { images: [metadata.coverImage] }),
    },
  }
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { default: Content, metadata } = await import(`@/content/blog/${slug}.mdx`)
  return (
    <div className="relative z-10 mx-auto max-w-[1080px] px-6">
      <PostHeader {...metadata} />
      <div className="prose prose-invert max-w-none py-12">
        <Content />
      </div>
    </div>
  )
}
```

- [ ] **Step 9: Run tests and verify blog pages**

```bash
pnpm test:run
pnpm dev
```
Open http://localhost:3000/blog — expect: tag filter chips visible, hello world post card.
Open http://localhost:3000/blog/2026-06-16-hello-world — expect: PostHeader with date and tag, code block styled.

- [ ] **Step 10: Commit**

```bash
git add components/blog/ app/blog/ tests/components/blog/
git commit -m "feat: blog index with tag filter and post pages"
```

---

### Task 18: AsciiPortrait

**Files:**
- Create: `components/ui/AsciiPortrait.tsx`
- Modify: `components/home/Hero.tsx`

- [ ] **Step 1: Write smoke test**

```tsx
// tests/components/ui/AsciiPortrait.test.tsx
import { render } from '@testing-library/react'
import { AsciiPortrait } from '@/components/ui/AsciiPortrait'

test('renders aria-hidden container', () => {
  const { container } = render(<AsciiPortrait src="/tania-portrait.jpeg" width={40} />)
  const el = container.firstChild as HTMLElement
  expect(el).toHaveAttribute('aria-hidden', 'true')
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:run tests/components/ui/AsciiPortrait.test.tsx
```

- [ ] **Step 3: Create components/ui/AsciiPortrait.tsx**

```tsx
// components/ui/AsciiPortrait.tsx
'use client'
import { useEffect, useRef } from 'react'

const CHARS = ' .,:;i1tfLCG08@'

export function AsciiPortrait({ src, width = 42 }: { src: string; width?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src
    img.onload = () => {
      const aspect = img.height / img.width
      const cols = width
      const rows = Math.floor(cols * aspect * 0.45)
      const offscreen = document.createElement('canvas')
      offscreen.width = cols
      offscreen.height = rows
      const oc = offscreen.getContext('2d')!
      oc.drawImage(img, 0, 0, cols, rows)
      const pixels = oc.getImageData(0, 0, cols, rows).data
      let html = ''
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = (r * cols + c) * 4
          const brightness =
            (pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114) / 255
          const charIdx = Math.floor(brightness * (CHARS.length - 1))
          html += `<span>${CHARS[charIdx]}</span>`
        }
        html += '\n'
      }
      if (containerRef.current) containerRef.current.innerHTML = html
    }
  }, [src, width])

  return (
    <div
      ref={containerRef}
      className="font-mono text-[7px] leading-[1.18] tracking-[0.08em] text-periwinkle select-none whitespace-pre transition-colors duration-300 hover:text-ink"
      aria-hidden="true"
    />
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:run tests/components/ui/AsciiPortrait.test.tsx
```

- [ ] **Step 5: Wire AsciiPortrait into Hero.tsx**

In `components/home/Hero.tsx`, replace the placeholder `<div>` with:
```tsx
import { AsciiPortrait } from '@/components/ui/AsciiPortrait'
// Replace the placeholder div:
<AsciiPortrait src="/tania-portrait.jpeg" width={42} />
```

Also add this reminder: place `/public/tania-portrait.jpeg` (your portrait photo) in the public folder before testing the hero visually.

- [ ] **Step 6: Commit**

```bash
git add components/ui/AsciiPortrait.tsx components/home/Hero.tsx tests/components/ui/AsciiPortrait.test.tsx
git commit -m "feat: AsciiPortrait canvas renderer"
```

---

### Task 19: CommandPalette

**Files:**
- Create: `components/ui/CommandPalette.tsx`
- Modify: `components/layout/Nav.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// tests/components/ui/CommandPalette.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommandPalette } from '@/components/ui/CommandPalette'

test('renders when open', () => {
  render(<CommandPalette isOpen onClose={() => {}} />)
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  expect(screen.getByRole('textbox')).toBeInTheDocument()
})

test('does not render when closed', () => {
  render(<CommandPalette isOpen={false} onClose={() => {}} />)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

test('calls onClose on Escape', async () => {
  const onClose = vi.fn()
  render(<CommandPalette isOpen onClose={onClose} />)
  await userEvent.keyboard('{Escape}')
  expect(onClose).toHaveBeenCalled()
})

test('filters items by query', async () => {
  render(<CommandPalette isOpen onClose={() => {}} />)
  await userEvent.type(screen.getByRole('textbox'), 'proj')
  expect(screen.getByText('Projects')).toBeInTheDocument()
  expect(screen.queryByText('Blog')).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:run tests/components/ui/CommandPalette.test.tsx
```

- [ ] **Step 3: Create components/ui/CommandPalette.tsx**

```tsx
// components/ui/CommandPalette.tsx
'use client'
import { useEffect, useRef, useState } from 'react'

type Item = { label: string; href: string; keywords?: string; external?: boolean }

const ITEMS: Item[] = [
  { label: 'About', href: '/#about', keywords: 'about me' },
  { label: 'Projects', href: '/#projects', keywords: 'work portfolio' },
  { label: 'Blog', href: '/blog', keywords: 'writing posts' },
  { label: 'Community', href: '/#community', keywords: 'women talk rtc' },
  { label: 'GitHub ↗', href: 'https://github.com/tanialapalelo', keywords: 'code repos', external: true },
  { label: 'LinkedIn ↗', href: 'https://linkedin.com/in/tanialapalelo', keywords: 'connect', external: true },
  { label: 'Email ↗', href: 'mailto:niatania102@gmail.com', keywords: 'contact', external: true },
]

type Props = { isOpen: boolean; onClose: () => void }

export function CommandPalette({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = ITEMS.filter(item =>
    `${item.label} ${item.keywords ?? ''}`.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => { setActiveIdx(0) }, [query])
  useEffect(() => { if (isOpen) { inputRef.current?.focus(); setQuery('') } }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') setActiveIdx(i => Math.min(i + 1, filtered.length - 1))
      if (e.key === 'ArrowUp') setActiveIdx(i => Math.max(i - 1, 0))
      if (e.key === 'Enter' && filtered[activeIdx]) {
        const item = filtered[activeIdx]
        if (item.external) window.open(item.href, '_blank')
        else window.location.href = item.href
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, filtered, activeIdx, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-bg/60 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label="Command palette"
    >
      <div
        className="w-full max-w-lg rounded-[14px] border border-grid-line bg-bg-elevated shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full bg-transparent px-5 py-4 font-mono text-sm text-ink placeholder:text-ink-dim outline-none border-b border-grid-line"
          aria-label="Search commands"
        />
        <ul className="max-h-64 overflow-y-auto py-2">
          {filtered.map((item, i) => (
            <li key={item.href}>
              <a
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={onClose}
                className={`flex items-center px-5 py-3 font-mono text-sm transition-colors ${
                  i === activeIdx
                    ? 'bg-periwinkle-soft text-periwinkle'
                    : 'text-ink-dim hover:text-periwinkle hover:bg-periwinkle-soft'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-5 py-3 font-mono text-sm text-ink-dim">No results.</li>
          )}
        </ul>
        <div className="border-t border-grid-line px-5 py-2 flex gap-4">
          <span className="font-mono text-xs text-ink-dim">↑↓ navigate</span>
          <span className="font-mono text-xs text-ink-dim">↵ open</span>
          <span className="font-mono text-xs text-ink-dim">esc close</span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:run tests/components/ui/CommandPalette.test.tsx
```

- [ ] **Step 5: Wire CommandPalette into layout.tsx**

```tsx
// app/layout.tsx — add to imports and body
'use client' // layout stays server — create a client wrapper
```

Create `components/layout/CommandPaletteProvider.tsx`:

```tsx
// components/layout/CommandPaletteProvider.tsx
'use client'
import { useEffect, useState } from 'react'
import { CommandPalette } from '@/components/ui/CommandPalette'

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(v => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {children}
      <CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
```

In `app/layout.tsx`, wrap children with `<CommandPaletteProvider>`. Update Nav's ⌘K button to dispatch a custom event or use a shared context — for simplicity, the ⌘K keyboard shortcut already handles it. The Nav button can use the same keyboard trigger via a click handler that dispatches `keydown` with metaKey.

Update the Nav ⌘K button:
```tsx
// In Nav.tsx, replace the ⌘K button with:
<button
  onClick={() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))
  }}
  className="font-mono text-xs text-ink-dim border border-grid-line rounded-md px-2 py-1 hover:text-periwinkle hover:border-periwinkle transition-colors"
  aria-label="Open command palette (⌘K)"
>
  ⌘K
</button>
```

- [ ] **Step 6: Commit**

```bash
git add components/ui/CommandPalette.tsx components/layout/CommandPaletteProvider.tsx components/layout/Nav.tsx app/layout.tsx tests/components/ui/CommandPalette.test.tsx
git commit -m "feat: CommandPalette with keyboard nav and ⌘K shortcut"
```

---

### Task 20: Snake game logic

**Files:**
- Create: `lib/snake.ts`
- Create: `tests/lib/snake.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// tests/lib/snake.test.ts
import { describe, it, expect } from 'vitest'
import { wrapPosition, initSnake, moveSnake, checkFoodCollision } from '@/lib/snake'

describe('wrapPosition', () => {
  it('wraps x past right edge', () => {
    expect(wrapPosition({ x: 10, y: 5 }, 10, 8)).toEqual({ x: 0, y: 5 })
  })
  it('wraps x past left edge', () => {
    expect(wrapPosition({ x: -1, y: 5 }, 10, 8)).toEqual({ x: 9, y: 5 })
  })
  it('wraps y past bottom', () => {
    expect(wrapPosition({ x: 3, y: 8 }, 10, 8)).toEqual({ x: 3, y: 0 })
  })
})

describe('initSnake', () => {
  it('starts at center with length 3', () => {
    const state = initSnake(20, 15)
    expect(state.snake).toHaveLength(3)
    expect(state.snake[0]).toEqual({ x: 10, y: 7 })
    expect(state.score).toBe(0)
  })
})

describe('moveSnake', () => {
  it('moves head in direction', () => {
    const state = initSnake(20, 15)
    const next = moveSnake(state, { x: 1, y: 0 }, 20, 15)
    expect(next.snake[0]).toEqual({ x: 11, y: 7 })
  })

  it('grows snake on food collision', () => {
    const state = initSnake(20, 15)
    const foodState = { ...state, food: { x: 11, y: 7 } }
    const next = moveSnake(foodState, { x: 1, y: 0 }, 20, 15)
    expect(next.snake).toHaveLength(4)
    expect(next.score).toBe(1)
  })
})

describe('checkFoodCollision', () => {
  it('returns true when head matches food', () => {
    expect(checkFoodCollision({ x: 5, y: 3 }, { x: 5, y: 3 })).toBe(true)
  })
  it('returns false otherwise', () => {
    expect(checkFoodCollision({ x: 5, y: 3 }, { x: 5, y: 4 })).toBe(false)
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:run tests/lib/snake.test.ts
```

- [ ] **Step 3: Create lib/snake.ts**

```ts
// lib/snake.ts
export type Point = { x: number; y: number }
export type Direction = Point

export type SnakeState = {
  snake: Point[]
  food: Point
  score: number
  gameOver: boolean
}

export function wrapPosition(pos: Point, gridW: number, gridH: number): Point {
  return {
    x: ((pos.x % gridW) + gridW) % gridW,
    y: ((pos.y % gridH) + gridH) % gridH,
  }
}

export function initSnake(gridW: number, gridH: number): SnakeState {
  const cx = Math.floor(gridW / 2)
  const cy = Math.floor(gridH / 2)
  const snake = [{ x: cx, y: cy }, { x: cx - 1, y: cy }, { x: cx - 2, y: cy }]
  return {
    snake,
    food: randomFood(snake, gridW, gridH),
    score: 0,
    gameOver: false,
  }
}

export function randomFood(snake: Point[], gridW: number, gridH: number): Point {
  let food: Point
  do {
    food = { x: Math.floor(Math.random() * gridW), y: Math.floor(Math.random() * gridH) }
  } while (snake.some(s => s.x === food.x && s.y === food.y))
  return food
}

export function checkFoodCollision(head: Point, food: Point): boolean {
  return head.x === food.x && head.y === food.y
}

export function moveSnake(
  state: SnakeState,
  dir: Direction,
  gridW: number,
  gridH: number
): SnakeState {
  const head = wrapPosition(
    { x: state.snake[0].x + dir.x, y: state.snake[0].y + dir.y },
    gridW,
    gridH
  )
  const ate = checkFoodCollision(head, state.food)
  const newSnake = ate
    ? [head, ...state.snake]
    : [head, ...state.snake.slice(0, -1)]
  return {
    snake: newSnake,
    food: ate ? randomFood(newSnake, gridW, gridH) : state.food,
    score: ate ? state.score + 1 : state.score,
    gameOver: false,
  }
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:run tests/lib/snake.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add lib/snake.ts tests/lib/snake.test.ts
git commit -m "feat: snake game pure logic with tests"
```

---

### Task 21: GameModeOverlay, AchievementToast, XPBar

**Files:**
- Create: `components/ui/AchievementToast.tsx`
- Create: `components/ui/XPBar.tsx`
- Create: `components/ui/GameModeOverlay.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create components/ui/AchievementToast.tsx**

```tsx
// components/ui/AchievementToast.tsx
'use client'
import { useEffect, useState } from 'react'

type Props = { message: string; description?: string; onDismiss: () => void }

export function AchievementToast({ message, description, onDismiss }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const t = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 300) }, 3200)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div
      className={`fixed bottom-6 right-6 z-[200] rounded-[14px] border border-mint bg-bg-elevated p-4 shadow-lg transition-all duration-300 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
      }`}
      role="status"
      aria-live="polite"
    >
      <p className="font-mono text-xs text-mint uppercase tracking-widest">{message}</p>
      {description && <p className="font-mono text-xs text-ink-dim mt-1">{description}</p>}
    </div>
  )
}
```

- [ ] **Step 2: Create components/ui/XPBar.tsx**

```tsx
// components/ui/XPBar.tsx
'use client'
import { useEffect, useState } from 'react'

export function XPBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement
      const scrolled = el.scrollTop / (el.scrollHeight - el.clientHeight)
      setProgress(Math.min(1, Math.max(0, scrolled)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-1 bg-bg-elevated">
      <div
        className="h-full bg-gradient-to-r from-periwinkle to-mint transition-all duration-100"
        style={{ width: `${progress * 100}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
      />
    </div>
  )
}
```

- [ ] **Step 3: Create components/ui/GameModeOverlay.tsx**

```tsx
// components/ui/GameModeOverlay.tsx
'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useGameMode } from '@/lib/game-mode-context'
import { initSnake, moveSnake, type Direction, type SnakeState } from '@/lib/snake'
import { AchievementToast } from './AchievementToast'

const CELL = 28
const FOOD_COLORS = ['#FF6B5C', '#FFB627', '#9AA6FF', '#4ED9B0']
const DIR_MAP: Record<string, Direction> = {
  ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
  a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
}

export function GameModeOverlay() {
  const { isGameMode } = useGameMode()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<SnakeState | null>(null)
  const dirRef = useRef<Direction>({ x: 1, y: 0 })
  const foodColorIdx = useRef(0)
  const [toast, setToast] = useState<{ msg: string; key: number } | null>(null)

  const getGrid = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return { w: 0, h: 0 }
    return {
      w: Math.floor(canvas.width / CELL),
      h: Math.floor(canvas.height / CELL),
    }
  }, [])

  useEffect(() => {
    if (!isGameMode) return
    const canvas = canvasRef.current!

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const { w, h } = getGrid()
      stateRef.current = initSnake(w, h)
      dirRef.current = { x: 1, y: 0 }
    }

    function onKey(e: KeyboardEvent) {
      if (DIR_MAP[e.key]) {
        e.preventDefault()
        dirRef.current = DIR_MAP[e.key]
      }
      if (e.key === ' ' && stateRef.current?.gameOver) {
        const { w, h } = getGrid()
        stateRef.current = initSnake(w, h)
        dirRef.current = { x: 1, y: 0 }
      }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('keydown', onKey)

    const ctx = canvas.getContext('2d')!
    const id = setInterval(() => {
      if (!stateRef.current) return
      const { w, h } = getGrid()
      const prev = stateRef.current
      stateRef.current = moveSnake(prev, dirRef.current, w, h)
      const s = stateRef.current

      if (s.score > prev.score && s.score % 5 === 0) {
        setToast({ msg: `COMBO ×${s.score / 5}`, key: Date.now() })
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw food
      const fc = FOOD_COLORS[foodColorIdx.current % FOOD_COLORS.length]
      ctx.fillStyle = fc
      ctx.beginPath()
      ctx.arc(s.food.x * CELL + CELL / 2, s.food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2)
      ctx.fill()

      // Draw snake
      s.snake.forEach((seg, i) => {
        const alpha = 1 - (i / s.snake.length) * 0.7
        ctx.fillStyle = `rgba(154,166,255,${alpha})`
        ctx.beginPath()
        ctx.roundRect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4, 4)
        ctx.fill()
      })
    }, 120)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', onKey)
      clearInterval(id)
    }
  }, [isGameMode, getGrid])

  if (!isGameMode) return null

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-40"
        aria-hidden="true"
      />
      {/* HUD */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 font-mono text-xs text-ink-dim border border-grid-line bg-bg-elevated rounded-full px-4 py-2 pointer-events-none">
        WASD / ↑↓←→ · SPACE restart
      </div>
      {toast && (
        <AchievementToast
          key={toast.key}
          message={toast.msg}
          description="Score milestone!"
          onDismiss={() => setToast(null)}
        />
      )}
    </>
  )
}
```

- [ ] **Step 4: Create game mode toggle pill**

Add to `app/layout.tsx` (inside `<GameModeProvider>`):

```tsx
import { GameModePill } from '@/components/ui/GameModePill'
```

Create `components/ui/GameModePill.tsx`:

```tsx
// components/ui/GameModePill.tsx
'use client'
import { useGameMode } from '@/lib/game-mode-context'

export function GameModePill() {
  const { isGameMode, toggle } = useGameMode()
  return (
    <button
      onClick={toggle}
      className="fixed top-[76px] left-6 z-50 flex items-center gap-2 font-mono text-xs border border-grid-line bg-bg-elevated rounded-full px-3 py-1.5 hover:border-mint transition-colors"
      aria-pressed={isGameMode}
      aria-label="Toggle game mode"
    >
      <span className={`h-2 w-2 rounded-full transition-colors ${isGameMode ? 'bg-mint shadow-[0_0_6px_#4ED9B0]' : 'bg-ink-dim'}`} />
      Game Mode
    </button>
  )
}
```

- [ ] **Step 5: Wire everything into layout.tsx**

```tsx
// app/layout.tsx — final body content:
import { XPBar } from '@/components/ui/XPBar'
import { GameModeOverlay } from '@/components/ui/GameModeOverlay'
import { GameModePill } from '@/components/ui/GameModePill'

// Inside <GameModeProvider>:
<XPBar />
<Nav />
<GameModePill />
<GameModeOverlay />
<CommandPaletteProvider>
  <main className="pt-16">{children}</main>
</CommandPaletteProvider>
<Footer />
```

- [ ] **Step 6: Verify in browser**

```bash
pnpm dev
```
Click "Game Mode" pill — snake starts on full-page canvas, FallingChars intensify, XPBar appears at top, scroll progress updates. WASD moves snake, food changes color, score milestone triggers toast.

- [ ] **Step 7: Commit**

```bash
git add components/ui/ app/layout.tsx
git commit -m "feat: Game Mode — snake overlay, XPBar, AchievementToast, GameModePill"
```

---

### Task 22: Konami code easter egg

**Files:**
- Create: `components/ui/KonamiCode.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// tests/components/ui/KonamiCode.test.tsx
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GameModeProvider, useGameMode } from '@/lib/game-mode-context'
import { KonamiCode } from '@/components/ui/KonamiCode'

function Status() {
  const { isGameMode } = useGameMode()
  return <span>{isGameMode ? 'on' : 'off'}</span>
}

test('activates game mode on Konami sequence', async () => {
  const { getByText } = render(
    <GameModeProvider>
      <KonamiCode />
      <Status />
    </GameModeProvider>
  )
  expect(getByText('off')).toBeInTheDocument()
  await userEvent.keyboard(
    '{ArrowUp}{ArrowUp}{ArrowDown}{ArrowDown}{ArrowLeft}{ArrowRight}{ArrowLeft}{ArrowRight}ba'
  )
  expect(getByText('on')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:run tests/components/ui/KonamiCode.test.tsx
```

- [ ] **Step 3: Create components/ui/KonamiCode.tsx**

```tsx
// components/ui/KonamiCode.tsx
'use client'
import { useEffect, useRef } from 'react'
import { useGameMode } from '@/lib/game-mode-context'

const SEQUENCE = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a',
]

export function KonamiCode() {
  const { toggle } = useGameMode()
  const progress = useRef(0)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === SEQUENCE[progress.current]) {
        progress.current += 1
        if (progress.current === SEQUENCE.length) {
          toggle()
          progress.current = 0
        }
      } else {
        progress.current = e.key === SEQUENCE[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle])

  return null
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:run tests/components/ui/KonamiCode.test.tsx
```

- [ ] **Step 5: Wire into layout.tsx**

```tsx
import { KonamiCode } from '@/components/ui/KonamiCode'
// inside <GameModeProvider>:
<KonamiCode />
```

- [ ] **Step 6: Commit**

```bash
git add components/ui/KonamiCode.tsx app/layout.tsx tests/components/ui/KonamiCode.test.tsx
git commit -m "feat: Konami code easter egg activates Game Mode"
```

---

### Task 23: RecurrenceDemo interactive widget

**Files:**
- Create: `components/project/RecurrenceDemo.tsx`

- [ ] **Step 1: Create components/project/RecurrenceDemo.tsx**

```tsx
// components/project/RecurrenceDemo.tsx
'use client'
import { useState } from 'react'

type EditScope = 'this' | 'following' | 'all'

const SCOPES: { value: EditScope; label: string; description: string }[] = [
  { value: 'this', label: 'This event', description: 'Only this occurrence is changed. The rest of the series continues unchanged.' },
  { value: 'following', label: 'This and following', description: 'This occurrence and all future ones are updated. Past occurrences are unchanged.' },
  { value: 'all', label: 'All events', description: 'Every occurrence in the series is updated, including past ones.' },
]

export function RecurrenceDemo() {
  const [scope, setScope] = useState<EditScope>('this')
  const active = SCOPES.find(s => s.value === scope)!

  return (
    <div className="my-8 rounded-[14px] border border-marigold bg-marigold-soft p-6 not-prose">
      <p className="font-mono text-xs text-marigold uppercase tracking-widest mb-4">
        Interactive Demo — Edit Recurring Event
      </p>
      <p className="text-sm text-ink-dim mb-4">
        You&apos;re editing &quot;Weekly Sync&quot; (every Monday). Which occurrences should this change affect?
      </p>
      <div className="flex flex-col gap-2 mb-4">
        {SCOPES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setScope(value)}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left font-mono text-sm transition-colors ${
              scope === value
                ? 'border-marigold bg-bg text-marigold'
                : 'border-grid-line text-ink-dim hover:border-marigold hover:text-ink'
            }`}
          >
            <span className={`h-3 w-3 shrink-0 rounded-full border-2 ${scope === value ? 'border-marigold bg-marigold' : 'border-ink-dim'}`} />
            {label}
          </button>
        ))}
      </div>
      <div className="rounded-lg bg-bg border border-grid-line p-4">
        <p className="font-mono text-xs text-ink-dim mb-1">Result</p>
        <p className="text-sm text-ink">{active.description}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Make RecurrenceDemo available in MDX**

In `components/blog/MDXComponents.tsx`, add to exports:

```tsx
import { RecurrenceDemo } from '@/components/project/RecurrenceDemo'

export const mdxComponents: MDXComponents = {
  pre: Pre,
  img: BlogImage as MDXComponents['img'],
  Callout,
  RecurrenceDemo,
}
```

- [ ] **Step 3: Commit**

```bash
git add components/project/RecurrenceDemo.tsx components/blog/MDXComponents.tsx
git commit -m "feat: RecurrenceDemo interactive widget for Calendar Clone"
```

---

### Task 24: Final polish — typography, a11y, build verification

**Files:**
- Modify: `styles/globals.css`
- Run: build and lighthouse audit

- [ ] **Step 1: Tune prose styles for MDX content**

Add to `styles/globals.css`:

```css
/* Prose overrides for dark theme */
.prose {
  --tw-prose-body: var(--color-ink-dim);
  --tw-prose-headings: var(--color-ink);
  --tw-prose-links: var(--color-periwinkle);
  --tw-prose-code: var(--color-mint);
  --tw-prose-pre-bg: var(--color-bg-elevated);
  --tw-prose-invert-body: var(--color-ink-dim);
  --tw-prose-invert-headings: var(--color-ink);
  --tw-prose-invert-links: var(--color-periwinkle);
}
```

- [ ] **Step 2: Run full test suite**

```bash
pnpm test:run
```
Expected: All tests PASS. Fix any failures before continuing.

- [ ] **Step 3: Run production build**

```bash
pnpm build
```
Expected: Build succeeds with no errors. Note any warnings about missing `public/tania-portrait.jpeg` — add the portrait photo before final deploy.

- [ ] **Step 4: Verify all routes statically generated**

After build, check `.next/server/app/` — should see:
- `page.html` (home)
- `projects/calendar-clone/page.html`
- `projects/giftclaw/page.html`
- `blog/page.html`
- `blog/2026-06-16-hello-world/page.html`

- [ ] **Step 5: Run dev server for manual a11y check**

```bash
pnpm dev
```

Check:
- Tab through Nav links — focus ring (periwinkle outline) visible on each
- Open CommandPalette (⌘K) — focus trapped inside dialog, Escape closes
- AsciiPortrait has `aria-hidden="true"` (screen readers skip it)
- Game Mode toggle button has `aria-pressed` state
- XPBar has `role="progressbar"` with aria values

- [ ] **Step 6: Add portrait photo**

Copy your portrait photo to `/public/tania-portrait.jpeg`.

- [ ] **Step 7: Final commit**

```bash
git add .
git commit -m "feat: portfolio complete — all 4 phases shipped"
```

---

## Pre-deploy checklist

- [ ] `public/tania-portrait.jpeg` added
- [ ] `pnpm build` succeeds with no errors
- [ ] `pnpm test:run` all PASS
- [ ] LinkedIn URL in Footer updated to your actual profile slug
- [ ] Buy `tanialapalelo.com` and connect in Vercel project settings → Domains
- [ ] Push to GitHub → Vercel auto-deploys

```bash
git remote add origin https://github.com/tanialapalelo/portfolio
git push -u origin main
```
