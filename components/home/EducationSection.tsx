const certifications = [
  'Bangkit 2021 Cloud Computing Track (Google, Tokopedia, Gojek, Traveloka)',
  'Kominfo Cyber Security Graduate Academy',
  'SIAS University China Exchange',
  'Hack2Skill GenAI APAC 2026 (in progress)',
]

export function EducationSection() {
  return (
    <section id="education" className="pt-20">
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Education</p>
      <div className="rounded-[14px] border border-grid-line bg-bg-elevated p-6">
        <p className="text-sm text-ink mb-1">B.Sc. Computer Science</p>
        <p className="font-mono text-xs text-ink-dim mb-4">
          University of Surabaya (UBAYA), Indonesia — 2021
        </p>
        <div className="flex flex-wrap gap-2">
          {certifications.map(cert => (
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
