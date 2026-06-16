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
