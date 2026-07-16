import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { deleteProject } from './actions'
import type { Project } from '@/types/supabase'

export default async function ProjectsAdminPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase.from('projects').select('*').order('sort_order')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <p className="font-mono text-xs text-periwinkle uppercase tracking-widest">Projects</p>
        <Link href="/admin/projects/new" className="bg-periwinkle text-bg font-mono text-xs px-4 py-2 rounded-lg">
          Add new
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {(projects ?? []).map((p: Project) => (
          <div key={p.id} className="rounded-[14px] border border-grid-line bg-bg-elevated p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-periwinkle">Case Study {p.case_study_number} — {p.slug}</p>
              <p className="text-sm text-ink-dim">{p.tagline}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href={`/admin/projects/${p.id}/edit`} className="font-mono text-xs text-ink-dim border border-grid-line rounded px-3 py-1 hover:text-periwinkle transition-colors">
                Edit
              </Link>
              <form action={deleteProject.bind(null, p.id)}>
                <button type="submit" className="font-mono text-xs text-ink-dim border border-grid-line rounded px-3 py-1 hover:text-coral transition-colors">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
