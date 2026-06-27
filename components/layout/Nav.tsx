'use client'
import Link from 'next/link'

const links = [
  { href: '/#about', label: 'About' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/#community', label: 'Community' },
]

export function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-grid-line bg-bg/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1080px] items-center justify-between px-6">
        <Link href="/" className="font-display italic text-lg text-ink hover:text-periwinkle transition-colors">
          tania.
        </Link>
        <div className="flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-mono text-sm text-ink-dim hover:text-periwinkle transition-colors"
            >
              {label}
            </Link>
          ))}
          <button
            onClick={() => {
              window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))
            }}
            className="font-mono text-xs text-ink-dim border border-grid-line rounded-md px-2 py-1 hover:text-periwinkle hover:border-periwinkle transition-colors"
            aria-label="Open command palette (⌘K)"
          >
            ⌘K
          </button>
        </div>
      </div>
    </nav>
  )
}
