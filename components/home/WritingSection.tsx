import Link from 'next/link'
import { fetchMediumPosts } from '@/lib/medium'

export async function WritingSection() {
  const posts = await fetchMediumPosts()
  const preview = posts.slice(0, 3)

  if (preview.length === 0) return null

  return (
    <section id="writing" className="pt-20">
      <div className="flex items-baseline justify-between mb-8">
        <p className="font-mono text-xs text-periwinkle uppercase tracking-widest">Writing</p>
        <Link
          href="/blog"
          className="font-mono text-xs text-ink-dim hover:text-periwinkle transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-grid-line">
        {preview.map(post => (
          <a
            key={post.link}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group py-5 flex flex-col sm:flex-row sm:items-baseline sm:gap-6 hover:text-periwinkle transition-colors"
          >
            <time className="font-mono text-xs text-ink-dim shrink-0 w-24">{post.pubDate}</time>
            <span className="font-display italic text-lg text-ink group-hover:text-periwinkle transition-colors flex-1">
              {post.title}
            </span>
            {post.tags.length > 0 && (
              <div className="flex gap-2 mt-2 sm:mt-0 shrink-0">
                {post.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="font-mono text-xs text-periwinkle bg-periwinkle-soft rounded px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </section>
  )
}
