import type { Metadata } from 'next'
import { getProjectSlugs } from '@/lib/content'
import { ProjectHero } from '@/components/project/ProjectHero'
import { FeatureGrid } from '@/components/project/FeatureGrid'
import { mdxComponents } from '@/mdx-components'

export async function generateStaticParams() {
  return getProjectSlugs().map(slug => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const { metadata } = await import(`@/content/projects/${slug}.mdx`)
  return {
    title: `${metadata.title} — Tania Lapalelo`,
    description: metadata.tagline,
    openGraph: { title: metadata.title, description: metadata.tagline },
  }
}

export default async function ProjectPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { default: Content, metadata } = await import(`@/content/projects/${slug}.mdx`)
  return (
    <div className="relative z-10 mx-auto max-w-[1080px] px-6">
      <ProjectHero {...metadata} />
      <FeatureGrid features={metadata.features} />
      <div className="prose prose-invert max-w-none py-12">
        <Content components={mdxComponents} />
      </div>
    </div>
  )
}
