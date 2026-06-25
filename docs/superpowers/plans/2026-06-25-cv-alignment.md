# CV Content & Brand Color Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the homepage's content in line with the actual CV (`TaniaSilvanaLapalelo CV.pdf`) — add the missing Experience and Education sections, fix inaccurate skill chips, tighten the Hero tagline, fix the contact email mismatch, add the Medium link — and swap the site's primary accent color to the user's actual brand blue.

**Architecture:** Two independent parts. Part A is content-only edits to existing components (`Hero`, `Footer`, `CommandPalette`, `Nav`, `AboutSection`) plus two new presentational components (`ExperienceSection`, `EducationSection`) wired into `app/page.tsx`, all following the existing card/section visual patterns already used by `CommunitySection`/`AboutSection`. Part B is a single CSS variable value change in `app/globals.css` that cascades through Tailwind v4's `@theme` token system with no component edits.

**Tech Stack:** Next.js 16 App Router, React Server/Client Components, Tailwind CSS v4 (`@theme` tokens), Vitest + React Testing Library.

## Global Constraints

- Email everywhere on the site must be `taniasilvanalapalelo@gmail.com` (was `niatania102@gmail.com`), per the spec's contact consistency requirement.
- New sections (`ExperienceSection`, `EducationSection`) must reuse the existing card visual pattern from `CommunitySection` (`rounded-[14px] border-2`, `bg-bg-elevated`, mono uppercase accent label) — no new visual language.
- `AboutSection` skill chips must only list technologies backed by the CV or by `content/projects/calendar-clone.mdx` / `content/projects/giftclaw.mdx` — `tRPC` must be removed, it appears nowhere else in the project.
- The `periwinkle` token swap (`#9AA6FF` → `#6FA8D8`) is a single-line value change in `app/globals.css` — do not touch any component file for this.
- Page section order on `app/page.tsx` must be: Hero → About → Experience → Education → Projects → Writing → Community.

---

### Task 1: `AboutSection` skill chips rewrite

**Files:**
- Modify: `components/home/AboutSection.tsx:1-5`
- Test: `tests/components/home/AboutSection.test.tsx` (new)

**Interfaces:**
- Produces: no exported interface change — `AboutSection` remains a zero-prop component.

- [ ] **Step 1: Write the failing test**

Create `tests/components/home/AboutSection.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { AboutSection } from '@/components/home/AboutSection'

test('renders accurate skill categories from CV and projects', () => {
  render(<AboutSection />)
  expect(screen.getByText('Material-UI')).toBeInTheDocument()
  expect(screen.getByText('Django')).toBeInTheDocument()
  expect(screen.getByText('Turborepo')).toBeInTheDocument()
  expect(screen.getByText('Database')).toBeInTheDocument()
  expect(screen.queryByText('tRPC')).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/home/AboutSection.test.tsx`
Expected: FAIL — `Material-UI` and `Django` not found (current chips are Next.js/React/TypeScript/Tailwind/Vitest/Playwright, NestJS/Node.js/PostgreSQL/Prisma/REST/tRPC, Vercel/Supabase/Upstash Redis/Sentry/GitHub Actions).

- [ ] **Step 3: Replace the skills object**

In `components/home/AboutSection.tsx`, replace lines 1-5:

```ts
const skills = {
  Frontend: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vitest', 'Playwright'],
  Backend: ['NestJS', 'Node.js', 'PostgreSQL', 'Prisma', 'REST', 'tRPC'],
  Cloud: ['Vercel', 'Supabase', 'Upstash Redis', 'Sentry', 'GitHub Actions'],
}
```

with:

```ts
const skills = {
  Frontend: ['Next.js 16', 'React', 'TypeScript', 'Tailwind CSS', 'Material-UI', 'Storybook', 'Vitest', 'React Testing Library', 'Playwright'],
  Backend: ['NestJS', 'Node.js', 'Django', 'Java', 'REST APIs', 'Swagger'],
  Database: ['PostgreSQL', 'Redis', 'Prisma', 'Supabase'],
  'DevOps & Tools': ['Docker', 'GitHub Actions', 'GCP', 'Turborepo', 'pnpm', 'Jest', 'Supertest', 'Sentry'],
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/components/home/AboutSection.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/home/AboutSection.tsx tests/components/home/AboutSection.test.tsx
git commit -m "fix: align AboutSection skill chips with CV and project stacks"
```

---

### Task 2: `Hero` tagline and contact email

**Files:**
- Modify: `components/home/Hero.tsx:13-15`, `components/home/Hero.tsx:30`
- Test: `tests/components/home/Hero.test.tsx` (new)

**Interfaces:**
- Produces: no exported interface change — `Hero` remains a zero-prop component.

- [ ] **Step 1: Write the failing test**

Create `tests/components/home/Hero.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { Hero } from '@/components/home/Hero'

test('renders CV-aligned tagline and contact email', () => {
  render(<Hero />)
  expect(
    screen.getByText('Frontend Engineer ● Next.js ● NestJS ● TypeScript ● PostgreSQL')
  ).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute(
    'href',
    'mailto:taniasilvanalapalelo@gmail.com'
  )
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/home/Hero.test.tsx`
Expected: FAIL — current tagline is `"IT ● Women Empowerment ● Creativity"` and email is `mailto:niatania102@gmail.com`.

- [ ] **Step 3: Update the tagline and email**

In `components/home/Hero.tsx`, replace:

```tsx
            <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-2">
              IT ● Women Empowerment ● Creativity
            </p>
```

with:

```tsx
            <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-2">
              Frontend Engineer ● Next.js ● NestJS ● TypeScript ● PostgreSQL
            </p>
```

and replace:

```tsx
              href="mailto:niatania102@gmail.com"
```

with:

```tsx
              href="mailto:taniasilvanalapalelo@gmail.com"
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/components/home/Hero.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/home/Hero.tsx tests/components/home/Hero.test.tsx
git commit -m "fix: align Hero tagline and contact email with CV"
```

---

### Task 3: `Footer` contact email and Medium link

**Files:**
- Modify: `components/layout/Footer.tsx:15-31`
- Modify: `tests/components/layout/Footer.test.tsx`

**Interfaces:**
- Produces: no exported interface change — `Footer` remains a zero-prop component.

- [ ] **Step 1: Write the failing test**

Replace the contents of `tests/components/layout/Footer.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/Footer'

test('renders copyright and social links', () => {
  render(<Footer />)
  expect(screen.getByText(/Tania Lapalelo/)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
})

test('renders Medium link and CV-aligned contact email', () => {
  render(<Footer />)
  expect(screen.getByRole('link', { name: /medium/i })).toHaveAttribute(
    'href',
    'https://medium.com/@tanialapalelo'
  )
  expect(screen.getByRole('link', { name: /email/i })).toHaveAttribute(
    'href',
    'mailto:taniasilvanalapalelo@gmail.com'
  )
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/layout/Footer.test.tsx`
Expected: FAIL — no Medium link exists yet, and the email link still points to `niatania102@gmail.com`.

- [ ] **Step 3: Add the Medium link and fix the email**

In `components/layout/Footer.tsx`, replace:

```tsx
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
```

with:

```tsx
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
            href="https://medium.com/@tanialapalelo"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-ink-dim hover:text-periwinkle transition-colors"
            aria-label="Medium"
          >
            Medium ↗
          </a>
          <a
            href="mailto:taniasilvanalapalelo@gmail.com"
            className="font-mono text-xs text-ink-dim hover:text-periwinkle transition-colors"
            aria-label="Email"
          >
            Email ↗
          </a>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/components/layout/Footer.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/layout/Footer.tsx tests/components/layout/Footer.test.tsx
git commit -m "feat: add Medium link to Footer and fix contact email"
```

---

### Task 4: `CommandPalette` contact email

**Files:**
- Modify: `components/ui/CommandPalette.tsx:13`
- Modify: `tests/components/ui/CommandPalette.test.tsx`

**Interfaces:**
- Produces: no interface change — `Props = { isOpen: boolean; onClose: () => void }` is unchanged.

- [ ] **Step 1: Write the failing test**

Append to `tests/components/ui/CommandPalette.test.tsx`:

```tsx
test('email item uses CV-aligned contact address', () => {
  render(<CommandPalette isOpen onClose={() => {}} />)
  expect(screen.getByRole('link', { name: /email/i })).toHaveAttribute(
    'href',
    'mailto:taniasilvanalapalelo@gmail.com'
  )
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/ui/CommandPalette.test.tsx`
Expected: FAIL — the `Email ↗` item still points to `mailto:niatania102@gmail.com`.

- [ ] **Step 3: Fix the email**

In `components/ui/CommandPalette.tsx`, replace:

```tsx
  { label: 'Email ↗', href: 'mailto:niatania102@gmail.com', keywords: 'contact', external: true },
```

with:

```tsx
  { label: 'Email ↗', href: 'mailto:taniasilvanalapalelo@gmail.com', keywords: 'contact', external: true },
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/components/ui/CommandPalette.test.tsx`
Expected: PASS (all 5 tests in the file)

- [ ] **Step 5: Commit**

```bash
git add components/ui/CommandPalette.tsx tests/components/ui/CommandPalette.test.tsx
git commit -m "fix: align CommandPalette contact email with CV"
```

---

### Task 5: New `ExperienceSection` component

**Files:**
- Create: `components/home/ExperienceSection.tsx`
- Test: `tests/components/home/ExperienceSection.test.tsx` (new)

**Interfaces:**
- Produces: `export function ExperienceSection()` — zero-prop component rendering a `<section id="experience">`. Consumed by Task 7 (`app/page.tsx` wiring).

- [ ] **Step 1: Write the failing test**

Create `tests/components/home/ExperienceSection.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { ExperienceSection } from '@/components/home/ExperienceSection'

test('renders both roles with key quantified achievements', () => {
  render(<ExperienceSection />)
  expect(screen.getByText('Frontend Engineer')).toBeInTheDocument()
  expect(screen.getByText('Software Engineer')).toBeInTheDocument()
  expect(screen.getByText(/Reduced campaign activation time by 95%/)).toBeInTheDocument()
  expect(screen.getByText(/fingerprint attendance management tool/)).toBeInTheDocument()
})

test('section is anchorable from nav', () => {
  const { container } = render(<ExperienceSection />)
  expect(container.querySelector('#experience')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/home/ExperienceSection.test.tsx`
Expected: FAIL — `Cannot find module '@/components/home/ExperienceSection'`

- [ ] **Step 3: Create the component**

Create `components/home/ExperienceSection.tsx`:

```tsx
const roles = [
  {
    title: 'Frontend Engineer',
    company: 'Wings Group Indonesia (FMCG enterprise, ~20,000 employees)',
    location: 'Jakarta, Indonesia',
    period: 'Jun 2023 – Present',
    accent: 'text-periwinkle',
    border: 'border-periwinkle',
    bullets: [
      "Built the Sales Order system in Next.js (Docker) with a multi-condition promotional pricing engine covering 10+ promo types, the primary order entry point for Wings' national distribution network.",
      'Reduced campaign activation time by 95% by engineering the STAR promo module with a batch-upload pipeline processing 16,000 records per cycle.',
      'Co-built an enterprise design system (React, Material-UI, Storybook) adopted across 10+ internal apps, cutting per-feature UI development time by approximately 40%.',
      'Architected Master Generator v2, a schema-driven code-gen tool that auto-generates Joomla MVC CRUD modules from live database schemas, accelerating new-module delivery by 50%.',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'Wings Group Indonesia',
    location: 'Jakarta, Indonesia',
    period: 'Oct 2021 – Jun 2023',
    accent: 'text-mint',
    border: 'border-mint',
    bullets: [
      'Developed and maintained 7 HR modules (payroll, e-recruitment, termination, job-batch processing, online forms) using Java and Joomla, supporting 20,000+ employees.',
      'Delivered a fingerprint attendance management tool to bulk-transfer and clean biometric records, eliminating manual data-entry effort for 5,000+ users.',
    ],
  },
]

export function ExperienceSection() {
  return (
    <section id="experience" className="pt-20">
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Experience</p>
      <div className="flex flex-col gap-6">
        {roles.map(role => (
          <div
            key={role.title}
            className={`rounded-[14px] border-2 ${role.border} bg-bg-elevated p-6`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
              <p className={`font-mono text-xs ${role.accent} uppercase tracking-widest`}>
                {role.title}
              </p>
              <p className="font-mono text-xs text-ink-dim">{role.period}</p>
            </div>
            <p className="text-sm text-ink mb-1">{role.company}</p>
            <p className="font-mono text-xs text-ink-dim mb-4">{role.location}</p>
            <ul className="flex flex-col gap-2 list-disc list-inside text-sm text-ink-dim">
              {role.bullets.map(bullet => (
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
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/home/ExperienceSection.tsx tests/components/home/ExperienceSection.test.tsx
git commit -m "feat: add ExperienceSection with CV-sourced role achievements"
```

---

### Task 6: `Nav` Experience link

**Files:**
- Modify: `components/layout/Nav.tsx:4-9`
- Modify: `tests/components/layout/Nav.test.tsx`

**Interfaces:**
- Consumes: the `#experience` anchor produced by Task 5's `ExperienceSection`.
- Produces: no interface change — `Nav` remains a zero-prop component.

- [ ] **Step 1: Write the failing test**

Replace the contents of `tests/components/layout/Nav.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { Nav } from '@/components/layout/Nav'

test('renders all nav links', () => {
  render(<Nav />)
  expect(screen.getByText('Projects')).toBeInTheDocument()
  expect(screen.getByText('Blog')).toBeInTheDocument()
  expect(screen.getByText('Community')).toBeInTheDocument()
})

test('renders Experience link pointing to the new section anchor', () => {
  render(<Nav />)
  expect(screen.getByRole('link', { name: 'Experience' })).toHaveAttribute('href', '/#experience')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/layout/Nav.test.tsx`
Expected: FAIL — no "Experience" link exists yet.

- [ ] **Step 3: Add the link**

In `components/layout/Nav.tsx`, replace:

```ts
const links = [
  { href: '/#about', label: 'About' },
  { href: '/#projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/#community', label: 'Community' },
]
```

with:

```ts
const links = [
  { href: '/#about', label: 'About' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/#community', label: 'Community' },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/components/layout/Nav.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/layout/Nav.tsx tests/components/layout/Nav.test.tsx
git commit -m "feat: add Experience link to Nav"
```

---

### Task 7: New `EducationSection` component, wired into the homepage

**Files:**
- Create: `components/home/EducationSection.tsx`
- Test: `tests/components/home/EducationSection.test.tsx` (new)
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks (independent of `ExperienceSection` except page placement order).
- Produces: `export function EducationSection()` — zero-prop component rendering a `<section id="education">`.

- [ ] **Step 1: Write the failing test**

Create `tests/components/home/EducationSection.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { EducationSection } from '@/components/home/EducationSection'

test('renders degree and certifications', () => {
  render(<EducationSection />)
  expect(screen.getByText('B.Sc. Computer Science')).toBeInTheDocument()
  expect(screen.getByText(/University of Surabaya/)).toBeInTheDocument()
  expect(screen.getByText('Kominfo Cyber Security Graduate Academy')).toBeInTheDocument()
  expect(screen.getByText('Hack2Skill GenAI APAC 2026 (in progress)')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/home/EducationSection.test.tsx`
Expected: FAIL — `Cannot find module '@/components/home/EducationSection'`

- [ ] **Step 3: Create the component**

Create `components/home/EducationSection.tsx`:

```tsx
const certifications = [
  'Bangkit 2021 Cloud Computing Track (Google, Tokopedia, Gojek, Traveloka)',
  'Kominfo Cyber Security Graduate Academy',
  'SIAS University China Exchange',
  'Hack2Skill GenAI APAC 2026 (in progress)',
]

export function EducationSection() {
  return (
    <section id="education" className="pt-20">
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Education</p>
      <div className="rounded-[14px] border border-grid-line bg-bg-elevated p-6">
        <p className="text-sm text-ink mb-1">B.Sc. Computer Science</p>
        <p className="font-mono text-xs text-ink-dim mb-4">
          University of Surabaya (UBAYA), Indonesia — 2021
        </p>
        <div className="flex flex-wrap gap-2">
          {certifications.map(cert => (
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

- [ ] **Step 5: Wire both new sections into the homepage**

In `app/page.tsx`, replace the full file contents:

```tsx
import { Hero } from '@/components/home/Hero'
import { AboutSection } from '@/components/home/AboutSection'
import { ExperienceSection } from '@/components/home/ExperienceSection'
import { EducationSection } from '@/components/home/EducationSection'
import { ProjectsSection } from '@/components/home/ProjectsSection'
import { WritingSection } from '@/components/home/WritingSection'
import { CommunitySection } from '@/components/home/CommunitySection'

export default function Home() {
  return (
    <div className="relative z-10 mx-auto max-w-[1080px] px-6">
      <Hero />
      <AboutSection />
      <ExperienceSection />
      <EducationSection />
      <ProjectsSection />
      <WritingSection />
      <CommunitySection />
    </div>
  )
}
```

- [ ] **Step 6: Run the full test suite and the build to verify nothing broke**

Run: `pnpm test:run`
Expected: all tests pass, including the new `EducationSection` and `ExperienceSection` tests.

Run: `pnpm build`
Expected: build succeeds, `/` is statically generated.

- [ ] **Step 7: Commit**

```bash
git add components/home/EducationSection.tsx tests/components/home/EducationSection.test.tsx app/page.tsx
git commit -m "feat: add EducationSection and wire Experience/Education into homepage"
```

---

### Task 8: Brand color token swap

**Files:**
- Modify: `app/globals.css:21,27`

**Interfaces:**
- Produces: no code interface — this changes a CSS custom property value consumed by Tailwind v4's generated `text-periwinkle` / `border-periwinkle` / `bg-periwinkle` / `bg-periwinkle-soft` utility classes used across ~20 files.

- [ ] **Step 1: Change the token values**

In `app/globals.css`, replace:

```css
  --color-periwinkle: #9AA6FF;
```

with:

```css
  --color-periwinkle: #6FA8D8;
```

and replace:

```css
  --color-periwinkle-soft: rgba(154 166 255 / 0.14);
```

with:

```css
  --color-periwinkle-soft: rgba(111 168 216 / 0.14);
```

- [ ] **Step 2: Verify the values landed**

Run: `grep -n "color-periwinkle" app/globals.css`
Expected output:
```
  --color-periwinkle: #6FA8D8;
  --color-periwinkle-soft: rgba(111 168 216 / 0.14);
```

- [ ] **Step 3: Run the full test suite and build to confirm nothing depends on the old hex value**

Run: `pnpm test:run`
Expected: all tests still pass (no test asserts on the literal hex value).

Run: `pnpm build`
Expected: build succeeds.

- [ ] **Step 4: Manual visual check**

Run: `pnpm dev`, open `http://localhost:3000`, and confirm the Hero "View Projects" button, nav link hover states, section labels ("About", "Experience", "Projects", etc.), focus-visible outlines, and the `AsciiPortrait` hover color all now render in the new blue (`#6FA8D8`) instead of the old periwinkle-purple.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat: align primary accent color with brand blue"
```

---

## Final Verification

- [ ] Run `pnpm test:run` — all tests pass (existing + new).
- [ ] Run `pnpm lint` — no new errors.
- [ ] Run `pnpm build` — succeeds, all routes statically generated.
- [ ] Run `pnpm dev` and manually click through Nav links (`About`, `Experience`, `Projects`, `Blog`, `Community`) to confirm anchors scroll to the right sections.
