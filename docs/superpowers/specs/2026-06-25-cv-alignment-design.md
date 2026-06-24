# CV Content & Brand Color Alignment — Design

## Context

The portfolio's content has drifted from the actual CV (`TaniaSilvanaLapalelo CV.pdf`): there's no Experience or Education section despite the CV's strongest material being quantified work achievements, the About skill chips list technologies that don't appear in the CV or any project (e.g. `tRPC`) while omitting real ones (Material-UI, Storybook, Django, Java, Docker, GCP, Turborepo, pnpm, Jest...), the Hero tagline is thematic rather than role-based, and the contact email differs from the CV's email. Separately, the site's primary accent color doesn't match the user's actual brand blue used on LinkedIn/GitHub/YouTube.

This is one spec covering two independent but small changes: (A) CV content alignment, (B) a brand color token swap. They're bundled here because both are straightforward, low-risk edits with no shared mechanics — implementation can do them as two separate tasks.

This spec does NOT cover: game-mode loss visibility, snake food visuals, AsciiPortrait quality/replacement, or Medium writing integration — those are separate specs to be brainstormed individually.

## Part A: CV Content Alignment

### A1. New `ExperienceSection` component

File: `components/home/ExperienceSection.tsx`. Placed on the homepage between `AboutSection` and `ProjectsSection`, with `id="experience"`.

Visual style: reuse the existing card pattern from `CommunitySection` (rounded-[14px] border-2, accent color per card, `bg-bg-elevated`, mono uppercase label) so no new visual language is introduced.

Content — two role cards, bullets adapted from the CV:

**Frontend Engineer** — Wings Group Indonesia (FMCG enterprise, ~20,000 employees), Jakarta, Indonesia — Jun 2023–Present
- Built the Sales Order system in Next.js (Docker) with a multi-condition promotional pricing engine covering 10+ promo types, the primary order entry point for Wings' national distribution network.
- Reduced campaign activation time by 95% by engineering the STAR promo module with a batch-upload pipeline processing 16,000 records per cycle.
- Co-built an enterprise design system (React, Material-UI, Storybook) adopted across 10+ internal apps, cutting per-feature UI development time by ~40%.
- Architected Master Generator v2, a schema-driven code-gen tool that auto-generates Joomla MVC CRUD modules from live database schemas, accelerating new-module delivery by 50%.

**Software Engineer** — Wings Group Indonesia, Jakarta, Indonesia — Oct 2021–Jun 2023
- Developed and maintained 7 HR modules (payroll, e-recruitment, termination, job-batch processing, online forms) using Java and Joomla, supporting 20,000+ employees.
- Delivered a fingerprint attendance management tool to bulk-transfer and clean biometric records, eliminating manual data-entry effort for 5,000+ users.

### A2. New `EducationSection` component

File: `components/home/EducationSection.tsx`. Placed immediately after `ExperienceSection`, with `id="education"`.

Content:
- **B.Sc. Computer Science** — University of Surabaya (UBAYA), Indonesia — 2021
- Certifications/programs as a compact mono tag list: Bangkit 2021 Cloud Computing Track (Google, Tokopedia, Gojek, Traveloka), Kominfo Cyber Security Graduate Academy, SIAS University China Exchange, Hack2Skill GenAI APAC 2026 (in progress).

### A3. `AboutSection` skill chips rewrite

Replace the current `skills` object (`Frontend`/`Backend`/`Cloud`) with categories grounded in the CV plus what's actually used in the two project case studies (`calendar-clone.mdx`, `giftclaw.mdx`):

```ts
const skills = {
  Frontend: ['Next.js 16', 'React', 'TypeScript', 'Tailwind CSS', 'Material-UI', 'Storybook', 'Vitest', 'React Testing Library', 'Playwright'],
  Backend: ['NestJS', 'Node.js', 'Django', 'Java', 'REST APIs', 'Swagger'],
  Database: ['PostgreSQL', 'Redis', 'Prisma', 'Supabase'],
  'DevOps & Tools': ['Docker', 'GitHub Actions', 'GCP', 'Turborepo', 'pnpm', 'Jest', 'Supertest', 'Sentry'],
}
```

Drop `tRPC` (appears nowhere except the current chip list — no project or CV backing it).

### A4. `Hero` tagline

Replace:
```
IT ● Women Empowerment ● Creativity
```
with:
```
Frontend Engineer ● Next.js ● NestJS ● TypeScript ● PostgreSQL
```
matching the CV's role/stack line. The bio paragraph beneath stays as-is (already CV-aligned).

### A5. Contact consistency

- Replace `mailto:niatania102@gmail.com` with `mailto:taniasilvanalapalelo@gmail.com` in `components/home/Hero.tsx`, `components/layout/Footer.tsx`, and `components/ui/CommandPalette.tsx`.
- Add a Medium link to `components/layout/Footer.tsx`, alongside GitHub/LinkedIn/Email: `https://medium.com/@tanialapalelo`, label `Medium ↗`, same styling/`target`/`rel` pattern as the existing links.

### A6. `Nav.tsx`

Add `{ href: '/#experience', label: 'Experience' }` to the `links` array, in the same position as the new section appears on the page (after About, before Projects).

## Part B: Brand Color Alignment

Update the `periwinkle` token in `app/globals.css`:

```css
--color-periwinkle: #6FA8D8;       /* was #9AA6FF */
--color-periwinkle-soft: rgba(111 168 216 / 0.14);  /* was rgba(154 166 255 / 0.14) */
```

No component files change — every consumer references the token via Tailwind v4's `@theme`-generated utility classes (`text-periwinkle`, `border-periwinkle`, `bg-periwinkle`, `bg-periwinkle-soft`), so the swap cascades automatically to the Hero CTA button, nav links, section labels, focus-visible outlines, and the `AsciiPortrait` hover color.

## Testing

- No new logic to unit test — these are content/copy/token changes.
- Manual verification: run `pnpm dev`, visually confirm Experience and Education sections render, skill chips show the new categories, Hero tagline updated, footer links (including Medium) work and point to the right URLs, accent color reads as the new blue across buttons/links/focus rings.
- `pnpm build` must still succeed (static content, no new dynamic behavior).

## Out of scope

- Game mode loss-state visibility, snake food visuals, AsciiPortrait quality/replacement, Medium content integration into the Writing section — each gets its own spec.
- Any visual/layout redesign beyond the two reused card patterns and the one color token.
