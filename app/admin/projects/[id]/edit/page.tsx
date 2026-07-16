import { createClient } from '@/lib/supabase/server'
import { updateProject } from '../../actions'
import { notFound } from 'next/navigation'
import type { Project } from '@/types/supabase'

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('projects').select('*').eq('id', id).single()

  if (!data) notFound()

  const project = data as Project
  const updateWithId = updateProject.bind(null, id)

  return (
    <div>
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Edit Project</p>
      <form action={updateWithId} className="flex flex-col gap-4 max-w-lg">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Slug</span>
          <input name="slug" required defaultValue={project.slug} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Case Study Number</span>
          <input name="case_study_number" required defaultValue={project.case_study_number} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Tagline</span>
          <input name="tagline" required defaultValue={project.tagline} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Accent</span>
          <select name="accent" defaultValue={project.accent} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle">
            <option value="periwinkle">periwinkle</option>
            <option value="mint">mint</option>
            <option value="coral">coral</option>
            <option value="marigold">marigold</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Tech (comma-separated)</span>
          <input name="tech" required defaultValue={project.tech.join(', ')} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Sort order</span>
          <input name="sort_order" type="number" defaultValue={project.sort_order} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <button type="submit" className="bg-periwinkle text-bg font-mono text-sm px-5 py-2.5 rounded-lg self-start">
          Save
        </button>
      </form>
    </div>
  )
}
