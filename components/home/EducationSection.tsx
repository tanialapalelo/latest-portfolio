import { createPublicClient } from '@/lib/supabase/public'
import type { Education } from '@/types/supabase'

export async function EducationSection() {
  const supabase = createPublicClient()
  const { data: edu } = await supabase.from('education').select('*').single()

  if (!edu) return null

  const education = edu as Education

  return (
    <section id="education" className="pt-20">
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Education</p>
      <div className="rounded-[14px] border border-grid-line bg-bg-elevated p-6">
        <p className="text-sm text-ink mb-1">{education.degree}</p>
        <p className="font-mono text-xs text-ink-dim mb-4">
          {education.institution} — {education.year}
        </p>
        <div className="flex flex-wrap gap-2">
          {education.certifications.map((cert: string) => (
            <span
              key={cert}
              className="font-mono text-xs text-ink border border-grid-line rounded-md px-2.5 py-1 bg-bg"
            >
              {cert}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
