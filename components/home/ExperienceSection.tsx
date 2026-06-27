const roles = [
  {
    title: 'Frontend Engineer',
    company: 'Wings Group Indonesia (FMCG enterprise, ~20,000 employees)',
    location: 'Jakarta, Indonesia',
    period: 'Jun 2023 – Present',
    accent: 'text-periwinkle',
    border: 'border-periwinkle',
    bullets: [
      "Built the Sales Order system in Next.js (Docker) with a multi-condition promotional pricing engine covering 10+ promo types, the primary order entry point for Wings' national distribution network.",
      'Reduced campaign activation time by 95% by engineering the STAR promo module with a batch-upload pipeline processing 16,000 records per cycle.',
      'Co-built an enterprise design system (React, Material-UI, Storybook) adopted across 10+ internal apps, cutting per-feature UI development time by approximately 40%.',
      'Architected Master Generator v2, a schema-driven code-gen tool that auto-generates Joomla MVC CRUD modules from live database schemas, accelerating new-module delivery by 50%.',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'Wings Group Indonesia',
    location: 'Jakarta, Indonesia',
    period: 'Oct 2021 – Jun 2023',
    accent: 'text-mint',
    border: 'border-mint',
    bullets: [
      'Developed and maintained 7 HR modules (payroll, e-recruitment, termination, job-batch processing, online forms) using Java and Joomla, supporting 20,000+ employees.',
      'Delivered a fingerprint attendance management tool to bulk-transfer and clean biometric records, eliminating manual data-entry effort for 5,000+ users.',
    ],
  },
]

export function ExperienceSection() {
  return (
    <section id="experience" className="pt-20">
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Experience</p>
      <div className="flex flex-col gap-6">
        {roles.map(role => (
          <div
            key={role.title}
            className={`rounded-[14px] border-2 ${role.border} bg-bg-elevated p-6`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
              <p className={`font-mono text-xs ${role.accent} uppercase tracking-widest`}>
                {role.title}
              </p>
              <p className="font-mono text-xs text-ink-dim">{role.period}</p>
            </div>
            <p className="text-sm text-ink mb-1">{role.company}</p>
            <p className="font-mono text-xs text-ink-dim mb-4">{role.location}</p>
            <ul className="flex flex-col gap-2 list-disc list-inside text-sm text-ink-dim">
              {role.bullets.map(bullet => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
