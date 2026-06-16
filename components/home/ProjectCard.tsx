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
  accent: Accent
  tagline: string
  tech: string[]
}

export function ProjectCard({ slug, caseStudyNumber, accent, tagline, tech }: Props) {
  return (
    <Link
      href={`/projects/${slug}`}
      className={`block rounded-[14px] border-2 ${accentBorder[accent]} bg-bg-elevated p-6 hover:-translate-y-1 transition-transform`}
    >
      <p className={`font-mono text-xs ${accentText[accent]} uppercase tracking-widest mb-2`}>
        Case Study {caseStudyNumber}
      </p>
      <p className="text-ink font-display italic text-2xl mb-4">{tagline}</p>
      <div className="flex flex-wrap gap-2">
        {tech.map(t => (
          <span
            key={t}
            className="font-mono text-xs text-ink-dim border border-grid-line rounded-md px-2 py-0.5"
          >
            {t}
          </span>
        ))}
      </div>
    </Link>
  )
}
