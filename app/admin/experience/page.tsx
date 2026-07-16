import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { deleteExperience } from './actions'
import type { Experience } from '@/types/supabase'

export default async function ExperienceAdminPage() {
  const supabase = await createClient()
  const { data: roles } = await supabase
    .from('experiences')
    .select('*')
    .order('sort_order')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <p className="font-mono text-xs text-periwinkle uppercase tracking-widest">Experience</p>
        <Link
          href="/admin/experience/new"
          className="bg-periwinkle text-bg font-mono text-xs px-4 py-2 rounded-lg"
        >
          Add new
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {(roles ?? []).map((role: Experience) => (
          <div
            key={role.id}
            className="rounded-[14px] border border-grid-line bg-bg-elevated p-4 flex items-center justify-between gap-4"
          >
            <div>
              <p className="font-mono text-xs text-periwinkle">{role.title}</p>
              <p className="text-sm text-ink-dim">{role.company}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link
                href={`/admin/experience/${role.id}/edit`}
                className="font-mono text-xs text-ink-dim border border-grid-line rounded px-3 py-1 hover:text-periwinkle transition-colors"
              >
                Edit
              </Link>
              <form action={deleteExperience.bind(null, role.id)}>
                <button
                  type="submit"
                  className="font-mono text-xs text-ink-dim border border-grid-line rounded px-3 py-1 hover:text-coral transition-colors"
                >
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
