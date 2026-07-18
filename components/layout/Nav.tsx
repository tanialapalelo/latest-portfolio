'use client'
import { useState } from 'react'
import Link from 'next/link'
import { BrandMark } from '@/lib/brand-mark'

const links = [
  { href: '/#about', label: 'About' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/#community', label: 'Community' },
]

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 inset-x-0 z-[55] border-b border-grid-line bg-bg/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1080px] items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display italic text-lg text-ink hover:text-periwinkle transition-colors"
        >
          <span aria-hidden="true">
            <BrandMark size={24} />
          </span>
          Tania.
        </Link>

        {/* desktop links */}
        <div className="hidden md:flex items-center gap-6">
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
            onClick={() =>
              window.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
              )
            }
            className="font-mono text-xs text-ink-dim border border-grid-line rounded-md px-2 py-1 hover:text-periwinkle hover:border-periwinkle transition-colors"
            aria-label="Open command palette (⌘K)"
          >
            ⌘K
          </button>
        </div>

        {/* mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8 text-ink-dim hover:text-periwinkle transition-colors"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span
            className={`block h-px w-6 bg-current transition-transform duration-200 ${open ? 'translate-y-[7px] rotate-45' : ''}`}
          />
          <span
            className={`block h-px w-6 bg-current transition-opacity duration-200 ${open ? 'opacity-0' : ''}`}
          />
          <span
            className={`block h-px w-6 bg-current transition-transform duration-200 ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
          />
        </button>
      </div>

      {/* mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-grid-line bg-bg/95 backdrop-blur-sm">
          <div className="mx-auto max-w-[1080px] px-6 py-4 flex flex-col gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="font-mono text-sm text-ink-dim hover:text-periwinkle transition-colors py-3 border-b border-grid-line last:border-0"
              >
                {label}
              </Link>
            ))}
            <button
              onClick={() => {
                setOpen(false)
                window.dispatchEvent(
                  new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
                )
              }}
              className="font-mono text-xs text-ink-dim border border-grid-line rounded-md px-3 py-2 mt-2 hover:text-periwinkle hover:border-periwinkle transition-colors self-start"
            >
              ⌘K  search
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
