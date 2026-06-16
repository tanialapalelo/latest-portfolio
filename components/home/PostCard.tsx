import Link from 'next/link'

type Props = {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
}

export function PostCard({ slug, title, date, excerpt, tags }: Props) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="block rounded-[14px] border border-grid-line bg-bg-elevated p-6 hover:-translate-y-1 transition-transform"
    >
      <div className="flex items-center justify-between mb-3">
        <time dateTime={date} className="font-mono text-xs text-ink-dim">{date}</time>
        <div className="flex gap-2">
          {tags.map(tag => (
            <span key={tag} className="font-mono text-xs text-periwinkle bg-periwinkle-soft rounded px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <p className="font-display italic text-xl text-ink mb-2">{title}</p>
      <p className="text-sm text-ink-dim line-clamp-2">{excerpt}</p>
    </Link>
  )
}
