'use client'
import { useEffect, useState } from 'react'

type Line = { kind: 'cmd' | 'out'; text: string }

const SEQUENCE: Line[] = [
  { kind: 'cmd', text: '$ whoami' },
  { kind: 'out', text: 'tania lapalelo   //   frontend engineer' },
  { kind: 'cmd', text: '$ cat stack.txt' },
  { kind: 'out', text: 'Next.js  NestJS  TypeScript  PostgreSQL' },
  { kind: 'cmd', text: '$ echo $OPEN_TO' },
  { kind: 'out', text: 'full-stack SWE roles' },
]

const DELAYS: Record<Line['kind'], number> = { cmd: 700, out: 250 }

export function TerminalHero() {
  const [lines, setLines] = useState<Line[]>([])
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    let i = 0
    let timer: ReturnType<typeof setTimeout>

    function next() {
      if (i >= SEQUENCE.length) return
      const line = SEQUENCE[i++]
      setLines(prev => [...prev, line])
      timer = setTimeout(next, DELAYS[SEQUENCE[i]?.kind ?? 'out'] ?? 400)
    }

    timer = setTimeout(next, 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setBlink(b => !b), 530)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="rounded-[14px] border border-grid-line overflow-hidden font-mono text-sm leading-relaxed select-none">
      <div className="flex items-center gap-1.5 px-4 py-3 bg-bg-elevated border-b border-grid-line">
        <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        <span className="ml-auto text-xs text-ink-dim">~/portfolio -- zsh</span>
      </div>
      <div className="p-5 bg-bg min-h-[172px] flex flex-col gap-1">
        {lines.map((line, i) => (
          <p key={i} className={line.kind === 'cmd' ? 'text-periwinkle' : 'text-ink-dim'}>
            {line.text}
          </p>
        ))}
        <p className="text-periwinkle flex items-center gap-0">
          {'$ '}
          <span
            className="inline-block w-[7px] h-[1.1em] bg-periwinkle ml-0.5 transition-opacity duration-75"
            style={{ opacity: blink ? 1 : 0 }}
          />
        </p>
      </div>
    </div>
  )
}
