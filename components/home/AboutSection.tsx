const skills = {
  Frontend: ['Next.js 16', 'React', 'TypeScript', 'Tailwind CSS', 'Material-UI', 'Storybook', 'Vitest', 'React Testing Library', 'Playwright'],
  Backend: ['NestJS', 'Node.js', 'Django', 'Java', 'REST APIs', 'Swagger'],
  Database: ['PostgreSQL', 'Redis', 'Prisma', 'Supabase'],
  'DevOps & Tools': ['Docker', 'GitHub Actions', 'GCP', 'Turborepo', 'pnpm', 'Jest', 'Supertest', 'Sentry'],
}

export function AboutSection() {
  return (
    <section id="about" className="pt-20">
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-4">About</p>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-4 text-ink-dim leading-relaxed">
          <p>
            I&apos;m a frontend engineer at Wings Group Indonesia — a 20,000-person FMCG enterprise — where I&apos;ve spent five years building and shipping production systems that real people depend on.
          </p>
          <p>
            My work sits at the intersection of engineering rigour and thoughtful design. I care about accessibility, test coverage, and systems that are maintainable long after the sprint ends.
          </p>
          <p>
            Outside of work I run the Women Talk Series — a community initiative for women in tech — and contribute to Rewriting the Code.
          </p>
        </div>
        <div className="flex flex-col gap-6">
          {Object.entries(skills).map(([group, chips]) => (
            <div key={group}>
              <p className="font-mono text-xs text-ink-dim mb-2">{group}</p>
              <div className="flex flex-wrap gap-2">
                {chips.map(skill => (
                  <span
                    key={skill}
                    className="font-mono text-xs text-ink border border-grid-line rounded-md px-2.5 py-1 bg-bg-elevated"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
