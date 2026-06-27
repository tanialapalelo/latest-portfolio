import Link from 'next/link'
import { AgendaCard } from './AgendaCard'
import { AsciiPortrait } from '@/components/ui/AsciiPortrait'

export function Hero() {
  return (
    <section className="pt-32 pb-20">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-6">
          <AsciiPortrait src="/tania-portrait.jpeg" width={42} />
          <div>
            <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-2">
              Frontend Engineer ● Next.js ● NestJS ● TypeScript ● PostgreSQL
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
              href="mailto:taniasilvanalapalelo@gmail.com"
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
