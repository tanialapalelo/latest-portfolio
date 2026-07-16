import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { deleteCommunityEntry } from './actions'
import type { Community } from '@/types/supabase'

export default async function CommunityAdminPage() {
  const supabase = await createClient()
  const { data: entries } = await supabase.from('community').select('*').order('sort_order')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <p className="font-mono text-xs text-periwinkle uppercase tracking-widest">Community</p>
        <Link
          href="/admin/community/new"
          className="bg-periwinkle text-bg font-mono text-xs px-4 py-2 rounded-lg"
        >
          Add new
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {(entries ?? []).map((c: Community) => (
          <div
            key={c.id}
            className="rounded-[14px] border border-grid-line bg-bg-elevated p-4 flex items-center justify-between gap-4"
          >
            <div>
              <p className="font-mono text-xs text-periwinkle">{c.name}</p>
              <p className="text-sm text-ink-dim truncate max-w-xs">{c.description}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link
                href={`/admin/community/${c.id}/edit`}
                className="font-mono text-xs text-ink-dim border border-grid-line rounded px-3 py-1 hover:text-periwinkle transition-colors"
              >
                Edit
              </Link>
              <form action={deleteCommunityEntry.bind(null, c.id)}>
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
