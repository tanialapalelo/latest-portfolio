import { createPublicClient } from '@/lib/supabase/public'
import { ProjectCard } from './ProjectCard'
import type { Project } from '@/types/supabase'

export async function ProjectsSection() {
  const supabase = createPublicClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order')

  if (!projects?.length) return null

  return (
    <section id="projects" className="pt-20">
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Projects</p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {projects.map((p: Project) => (
          <ProjectCard
            key={p.id}
            slug={p.slug}
            caseStudyNumber={p.case_study_number}
            accent={p.accent}
            tagline={p.tagline}
            tech={p.tech}
          />
        ))}
      </div>
    </section>
  )
}
