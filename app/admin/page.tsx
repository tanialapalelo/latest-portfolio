import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [{ count: expCount }, { count: eduCount }, { count: projCount }, { count: commCount }] =
    await Promise.all([
      supabase.from('experiences').select('*', { count: 'exact', head: true }),
      supabase.from('education').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('community').select('*', { count: 'exact', head: true }),
    ])

  const stats = [
    { label: 'Experience', count: expCount ?? 0, href: '/admin/experience' },
    { label: 'Education', count: eduCount ?? 0, href: '/admin/education' },
    { label: 'Projects', count: projCount ?? 0, href: '/admin/projects' },
    { label: 'Community', count: commCount ?? 0, href: '/admin/community' },
  ]

  return (
    <div>
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Dashboard</p>
      <div className="grid grid-cols-2 gap-4 max-w-md">
        {stats.map(({ label, count, href }) => (
          <a
            key={label}
            href={href}
            className="rounded-[14px] border border-grid-line bg-bg-elevated p-5 hover:-translate-y-0.5 transition-transform"
          >
            <p className="font-mono text-xs text-ink-dim mb-1">{label}</p>
            <p className="font-display italic text-3xl text-ink">{count}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
