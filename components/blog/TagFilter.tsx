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
