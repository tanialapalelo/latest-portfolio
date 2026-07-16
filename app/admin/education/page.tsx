import { createClient } from '@/lib/supabase/server'
import { updateEducation } from './actions'
import type { Education } from '@/types/supabase'

export default async function EducationAdminPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('education').select('*').single()
  const edu = data as Education | null

  if (!edu) {
    return (
      <p className="font-mono text-xs text-ink-dim">
        No education row found. Insert one in Supabase first.
      </p>
    )
  }

  const updateWithId = updateEducation.bind(null, edu.id)

  return (
    <div>
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Education</p>
      <form action={updateWithId} className="flex flex-col gap-4 max-w-lg">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Degree</span>
          <input
            name="degree"
            required
            defaultValue={edu.degree}
            className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Institution</span>
          <input
            name="institution"
            required
            defaultValue={edu.institution}
            className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Year</span>
          <input
            name="year"
            required
            defaultValue={edu.year}
            className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Certifications (one per line)</span>
          <textarea
            name="certifications"
            rows={6}
            defaultValue={edu.certifications.join('\n')}
            className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle"
          />
        </label>
        <button
          type="submit"
          className="bg-periwinkle text-bg font-mono text-sm px-5 py-2.5 rounded-lg self-start"
        >
          Save
        </button>
      </form>
    </div>
  )
}
