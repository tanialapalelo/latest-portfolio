import type { Metadata } from 'next'
import { getBlogSlugs } from '@/lib/content'
import { BlogIndex } from '@/components/blog/BlogIndex'

export const metadata: Metadata = {
  title: 'Writing — Tania Lapalelo',
  description: 'Essays and notes on frontend engineering, full-stack systems, and building in public.',
}

export default async function BlogPage() {
  const slugs = getBlogSlugs()
  const allPosts = await Promise.all(
    slugs.map(async slug => {
      const { metadata } = await import(`@/content/blog/${slug}.mdx`)
      return { slug, ...metadata }
    })
  )
  const posts = allPosts.sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="relative z-10 mx-auto max-w-[1080px] px-6 pt-28">
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-2">Writing</p>
      <h1 className="font-display italic text-5xl text-ink mb-12">All Posts</h1>
      <BlogIndex posts={posts} />
    </div>
  )
}
