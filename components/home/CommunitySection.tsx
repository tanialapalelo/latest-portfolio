import { createPublicClient } from '@/lib/supabase/public'
import type { Community } from '@/types/supabase'

const accentText: Record<string, string> = {
  periwinkle: 'text-periwinkle',
  mint: 'text-mint',
  coral: 'text-coral',
  marigold: 'text-marigold',
}

const accentBorder: Record<string, string> = {
  periwinkle: 'border-periwinkle',
  mint: 'border-mint',
  coral: 'border-coral',
  marigold: 'border-marigold',
}

export async function CommunitySection() {
  const supabase = createPublicClient()
  const { data: communities } = await supabase
    .from('community')
    .select('*')
    .order('sort_order')

  if (!communities?.length) return null

  return (
    <section id="community" className="pt-20 pb-20">
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Community</p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {communities.map((c: Community) => (
          <a
            key={c.id}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`block rounded-[14px] border-2 ${accentBorder[c.accent] ?? 'border-periwinkle'} bg-bg-elevated p-6 hover:-translate-y-1 transition-transform`}
          >
            <p className={`font-mono text-xs ${accentText[c.accent] ?? 'text-periwinkle'} uppercase tracking-widest mb-2`}>
              {c.name}
            </p>
            <p className="text-sm text-ink-dim">{c.description}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
