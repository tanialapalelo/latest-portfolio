import type { Metadata } from 'next'
import { getBlogSlugs } from '@/lib/content'
import { PostHeader } from '@/components/blog/PostHeader'

export async function generateStaticParams() {
  return getBlogSlugs().map(slug => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const { metadata } = await import(`@/content/blog/${slug}.mdx`)
  return {
    title: `${metadata.title} - Tania Lapalelo`,
    description: metadata.excerpt,
    openGraph: {
      title: metadata.title,
      description: metadata.excerpt,
      ...(metadata.coverImage && { images: [metadata.coverImage] }),
    },
  }
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { default: Content, metadata } = await import(`@/content/blog/${slug}.mdx`)
  return (
    <div className="relative z-10 mx-auto max-w-[1080px] px-6">
      <PostHeader {...metadata} />
      <div className="prose prose-invert max-w-none py-12">
        <Content />
      </div>
    </div>
  )
}
