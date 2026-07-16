import { createClient } from '@/lib/supabase/server'
import { updateExperience } from '../../actions'
import { notFound } from 'next/navigation'
import type { Experience } from '@/types/supabase'

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: role } = await supabase.from('experiences').select('*').eq('id', id).single()

  if (!role) notFound()

  const experience = role as Experience
  const updateWithId = updateExperience.bind(null, id)

  return (
    <div>
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Edit Experience</p>
      <form action={updateWithId} className="flex flex-col gap-4 max-w-lg">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Title</span>
          <input name="title" required defaultValue={experience.title} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Company</span>
          <input name="company" required defaultValue={experience.company} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Location</span>
          <input name="location" required defaultValue={experience.location} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Period</span>
          <input name="period" required defaultValue={experience.period} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Accent</span>
          <select name="accent" defaultValue={experience.accent} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle">
            <option value="periwinkle">periwinkle</option>
            <option value="mint">mint</option>
            <option value="coral">coral</option>
            <option value="marigold">marigold</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Bullets (one per line)</span>
          <textarea name="bullets" rows={5} defaultValue={experience.bullets.join('\n')} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Sort order</span>
          <input name="sort_order" type="number" defaultValue={experience.sort_order} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <button type="submit" className="bg-periwinkle text-bg font-mono text-sm px-5 py-2.5 rounded-lg self-start">
          Save
        </button>
      </form>
    </div>
  )
}
