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
