import { getBlogSlugs } from '@/lib/content'
import { PostCard } from './PostCard'

type PostMeta = {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
}

export async function WritingSection() {
  const slugs = getBlogSlugs()
  const posts: PostMeta[] = await Promise.all(
    slugs.map(async slug => {
      const { metadata } = await import(`@/content/blog/${slug}.mdx`)
      return { slug, ...metadata }
    })
  )
  posts.sort((a, b) => b.date.localeCompare(a.date))
  const latest = posts.slice(0, 3)

  return (
    <section id="writing" className="pt-20">
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Writing</p>
      <div className="flex flex-col gap-4">
        {latest.map(p => (
          <PostCard key={p.slug} {...p} />
        ))}
      </div>
    </section>
  )
}
