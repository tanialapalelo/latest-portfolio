import { createClient } from '@/lib/supabase/server'
import { updateCommunityEntry } from '../../actions'
import { notFound } from 'next/navigation'
import type { Community } from '@/types/supabase'

export default async function EditCommunityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('community').select('*').eq('id', id).single()

  if (!data) notFound()

  const entry = data as Community
  const updateWithId = updateCommunityEntry.bind(null, id)

  return (
    <div>
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Edit Community Entry</p>
      <form action={updateWithId} className="flex flex-col gap-4 max-w-lg">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Name</span>
          <input name="name" required defaultValue={entry.name} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Description</span>
          <textarea name="description" rows={3} defaultValue={entry.description} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Link (href)</span>
          <input name="href" type="url" required defaultValue={entry.href} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Accent</span>
          <select name="accent" defaultValue={entry.accent} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle">
            {['periwinkle', 'mint', 'coral', 'marigold'].map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Sort order</span>
          <input name="sort_order" type="number" defaultValue={entry.sort_order} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <button type="submit" className="bg-periwinkle text-bg font-mono text-sm px-5 py-2.5 rounded-lg self-start">
          Save
        </button>
      </form>
    </div>
  )
}
