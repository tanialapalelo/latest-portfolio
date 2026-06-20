'use client'
import { useEffect, useRef, useState } from 'react'

type Item = { label: string; href: string; keywords?: string; external?: boolean }

const ITEMS: Item[] = [
  { label: 'About', href: '/#about', keywords: 'about me' },
  { label: 'Projects', href: '/#projects', keywords: 'work portfolio' },
  { label: 'Blog', href: '/blog', keywords: 'writing posts' },
  { label: 'Community', href: '/#community', keywords: 'women talk rtc' },
  { label: 'GitHub ↗', href: 'https://github.com/tanialapalelo', keywords: 'code repos', external: true },
  { label: 'LinkedIn ↗', href: 'https://linkedin.com/in/tanialapalelo', keywords: 'connect', external: true },
  { label: 'Email ↗', href: 'mailto:niatania102@gmail.com', keywords: 'contact', external: true },
]

type Props = { isOpen: boolean; onClose: () => void }

export function CommandPalette({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = ITEMS.filter(item =>
    `${item.label} ${item.keywords ?? ''}`.toLowerCase().includes(query.toLowerCase())
  )

  const [activeIdx, setActiveIdx] = useState(0)
  // Keep the highlighted row in range as the result set shrinks (e.g. while typing).
  const clampedActiveIdx = Math.min(activeIdx, Math.max(filtered.length - 1, 0))

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      // Reset transient UI state each time the palette is opened.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('')
      setActiveIdx(0)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') setActiveIdx(i => Math.min(i + 1, filtered.length - 1))
      if (e.key === 'ArrowUp') setActiveIdx(i => Math.max(i - 1, 0))
      if (e.key === 'Enter' && filtered[clampedActiveIdx]) {
        const item = filtered[clampedActiveIdx]
        if (item.external) window.open(item.href, '_blank')
        else window.location.href = item.href
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, filtered, clampedActiveIdx, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-bg/60 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label="Command palette"
    >
      <div
        className="w-full max-w-lg rounded-[14px] border border-grid-line bg-bg-elevated shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full bg-transparent px-5 py-4 font-mono text-sm text-ink placeholder:text-ink-dim outline-none border-b border-grid-line"
          aria-label="Search commands"
        />
        <ul className="max-h-64 overflow-y-auto py-2">
          {filtered.map((item, i) => (
            <li key={item.href}>
              <a
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={onClose}
                className={`flex items-center px-5 py-3 font-mono text-sm transition-colors ${
                  i === clampedActiveIdx
                    ? 'bg-periwinkle-soft text-periwinkle'
                    : 'text-ink-dim hover:text-periwinkle hover:bg-periwinkle-soft'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-5 py-3 font-mono text-sm text-ink-dim">No results.</li>
          )}
        </ul>
        <div className="border-t border-grid-line px-5 py-2 flex gap-4">
          <span className="font-mono text-xs text-ink-dim">↑↓ navigate</span>
          <span className="font-mono text-xs text-ink-dim">↵ open</span>
          <span className="font-mono text-xs text-ink-dim">esc close</span>
        </div>
      </div>
    </div>
  )
}
