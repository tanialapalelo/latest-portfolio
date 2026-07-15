import Link from 'next/link'

const navLinks = [
  { href: '/admin/experience', label: 'Experience' },
  { href: '/admin/education', label: 'Education' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/community', label: 'Community' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex">
      <aside className="w-48 border-r border-grid-line bg-bg-elevated flex flex-col gap-1 p-4 pt-8">
        <Link
          href="/admin"
          className="font-display italic text-lg text-ink mb-6 block hover:text-periwinkle transition-colors"
        >
          tania. admin
        </Link>
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="font-mono text-xs text-ink-dim hover:text-periwinkle transition-colors py-1"
          >
            {label}
          </Link>
        ))}
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
