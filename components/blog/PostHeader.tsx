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
      <time dateTime={date} className="font-mono text-xs text-ink-dim mb-4 block">{formatted}</time>
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
