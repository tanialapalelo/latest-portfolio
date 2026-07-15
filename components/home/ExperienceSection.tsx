import { createPublicClient } from '@/lib/supabase/public'
import type { Experience } from '@/types/supabase'

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

export async function ExperienceSection() {
  const supabase = createPublicClient()
  const { data: roles } = await supabase
    .from('experiences')
    .select('*')
    .order('sort_order')

  if (!roles?.length) return null

  return (
    <section id="experience" className="pt-20">
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Experience</p>
      <div className="flex flex-col gap-6">
        {roles.map((role: Experience) => (
          <div
            key={role.id}
            className={`rounded-[14px] border-2 ${accentBorder[role.accent] ?? 'border-periwinkle'} bg-bg-elevated p-6`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
              <p className={`font-mono text-xs ${accentText[role.accent] ?? 'text-periwinkle'} uppercase tracking-widest`}>
                {role.title}
              </p>
              <p className="font-mono text-xs text-ink-dim">{role.period}</p>
            </div>
            <p className="text-sm text-ink mb-1">{role.company}</p>
            <p className="font-mono text-xs text-ink-dim mb-4">{role.location}</p>
            <ul className="flex flex-col gap-2 list-disc list-inside text-sm text-ink-dim">
              {role.bullets.map((bullet: string) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
