import { getProjectSlugs } from '@/lib/content'
import { ProjectCard } from './ProjectCard'

type ProjectMeta = {
  slug: string
  caseStudyNumber: string
  accent: 'coral' | 'marigold' | 'periwinkle' | 'mint'
  tagline: string
  tech: string[]
}

export async function ProjectsSection() {
  const slugs = getProjectSlugs()
  const projects: ProjectMeta[] = await Promise.all(
    slugs.map(async slug => {
      const { metadata } = await import(`@/content/projects/${slug}.mdx`)
      return { slug, ...metadata }
    })
  )

  return (
    <section id="projects" className="pt-20">
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Projects</p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {projects.map(p => (
          <ProjectCard key={p.slug} {...p} />
        ))}
      </div>
    </section>
  )
}
