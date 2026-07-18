# Portfolio

Personal portfolio and blog, built with Next.js 16 (App Router). Includes a terminal-style hero section, a hidden Snake game mode, an MDX-powered blog and project showcase, a live writing feed pulled from Medium's RSS, and a custom admin CMS backed by Supabase for managing content without touching code.

## Features

- **Terminal hero**: animated terminal-style introduction on the landing page
- **Snake game mode**: playable easter egg embedded in the UI
- **MDX blog & projects**: content authored in MDX with syntax highlighting (`rehype-pretty-code`, Tokyo Night theme)
- **Medium RSS feed**: pulls and displays recent writing directly from a Medium profile
- **Admin CMS** (`/admin`): Supabase-authenticated dashboard for managing projects, experience, education, and community entries
- **Responsive nav**: adapts across breakpoints, layered correctly above game mode UI

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Supabase](https://supabase.com) (`@supabase/ssr`) for auth and data
- [MDX](https://mdxjs.com) for blog/project content
- [Vitest](https://vitest.dev) + Testing Library for tests

## Getting Started

### Prerequisites

- Node.js
- [pnpm](https://pnpm.io)
- A [Supabase](https://supabase.com) project (for the admin CMS and auth)

### Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a `.env.local` file with your Supabase credentials:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   ```

3. Apply the database schema and seed data (via the Supabase SQL editor or CLI):

   ```
   supabase/schema.sql
   supabase/seed.sql
   ```

4. Run the development server:

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the site. The admin dashboard lives at `/admin` and requires Supabase auth.

### Testing

```bash
pnpm test       # watch mode
pnpm test:run   # single run
```

## Project Structure

```
app/
  (portfolio)/   # public-facing pages: home, blog, projects
  admin/         # authenticated CMS for managing content
  auth/          # Supabase auth callback route
components/      # UI, layout, blog, project, and home components
content/         # MDX blog posts and project write-ups
lib/             # Supabase clients, game logic, Medium feed parsing
supabase/        # database schema and seed SQL
```
