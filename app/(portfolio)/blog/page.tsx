import type { Metadata } from 'next'
import Link from 'next/link'
import { getBlogSlugs } from '@/lib/content'
import { fetchMediumPosts } from '@/lib/medium'

export const metadata: Metadata = {
  title: 'Writing - Tania Lapalelo',
  description: 'Essays and notes on frontend engineering, full-stack systems, and building in public.',
}

type FeedItem = {
  key: string
  title: string
  date: string
  tags: string[]
  href: string
  external: boolean
  excerpt?: string
}

export default async function BlogPage() {
  const slugs = getBlogSlugs()
  const [mediumPosts, localMetas] = await Promise.all([
    fetchMediumPosts(),
    Promise.all(
      slugs.map(async slug => {
        const { metadata } = await import(`@/content/blog/${slug}.mdx`)
        return { slug, ...metadata } as {
          slug: string
          title: string
          date: string
          excerpt: string
          tags: string[]
        }
      })
    ),
  ])

  const localPosts = localMetas.filter(p => p.title !== 'Hello World')

  const feed: FeedItem[] = [
    ...mediumPosts.map(p => ({
      key: p.link,
      title: p.title,
      date: p.pubDate,
      tags: p.tags,
      href: p.link,
      external: true,
    })),
    ...localPosts.map(p => ({
      key: p.slug,
      title: p.title,
      date: p.date,
      tags: p.tags,
      href: `/blog/${p.slug}`,
      external: false,
      excerpt: p.excerpt,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="relative z-10 mx-auto max-w-[1080px] px-6 pt-28 pb-24">
      <div className="flex items-baseline justify-between mb-12">
        <div>
          <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-2">Writing</p>
          <h1 className="font-display italic text-5xl text-ink">All Posts</h1>
        </div>
        <a
          href="https://medium.com/@tanialapalelo"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-ink-dim hover:text-periwinkle transition-colors"
        >
          medium.com/@tanialapalelo
        </a>
      </div>

      {feed.length === 0 ? (
        <p className="font-mono text-sm text-ink-dim">No posts yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-grid-line">
          {feed.map(item =>
            item.external ? (
              <a
                key={item.key}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group py-6 flex flex-col sm:flex-row sm:items-baseline sm:gap-6 hover:text-periwinkle transition-colors"
              >
                <time className="font-mono text-xs text-ink-dim shrink-0 w-24">{item.date}</time>
                <div className="flex-1">
                  <span className="font-display italic text-xl text-ink group-hover:text-periwinkle transition-colors">
                    {item.title}
                  </span>
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.tags.map(tag => (
                        <span
                          key={tag}
                          className="font-mono text-xs text-periwinkle bg-periwinkle-soft rounded px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="font-mono text-xs text-ink-dim shrink-0">Medium</span>
              </a>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                className="group py-6 flex flex-col sm:flex-row sm:items-baseline sm:gap-6 hover:text-periwinkle transition-colors"
              >
                <time className="font-mono text-xs text-ink-dim shrink-0 w-24">{item.date}</time>
                <div className="flex-1">
                  <span className="font-display italic text-xl text-ink group-hover:text-periwinkle transition-colors">
                    {item.title}
                  </span>
                  {item.excerpt && (
                    <p className="mt-1 text-sm text-ink-dim line-clamp-2">{item.excerpt}</p>
                  )}
                </div>
              </Link>
            )
          )}
        </div>
      )}
    </div>
  )
}
