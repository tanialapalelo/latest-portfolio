'use client'
import { useState, useMemo } from 'react'
import { PostCard } from '@/components/home/PostCard'
import { TagFilter } from './TagFilter'

type Post = {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
}

export function BlogIndex({ posts }: { posts: Post[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap(p => p.tags))).sort(),
    [posts]
  )
  const filtered = activeTag
    ? posts.filter(p => p.tags.includes(activeTag))
    : posts

  return (
    <div>
      <TagFilter tags={allTags} activeTag={activeTag} onSelect={setActiveTag} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filtered.map(p => <PostCard key={p.slug} {...p} />)}
      </div>
      {filtered.length === 0 && (
        <p className="font-mono text-sm text-ink-dim text-center py-12">
          No posts tagged &quot;{activeTag}&quot;.
        </p>
      )}
    </div>
  )
}
