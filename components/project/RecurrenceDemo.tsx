'use client'
import { useState } from 'react'

type EditScope = 'this' | 'following' | 'all'

const SCOPES: { value: EditScope; label: string; description: string }[] = [
  { value: 'this', label: 'This event', description: 'Only this occurrence is changed. The rest of the series continues unchanged.' },
  { value: 'following', label: 'This and following', description: 'This occurrence and all future ones are updated. Past occurrences are unchanged.' },
  { value: 'all', label: 'All events', description: 'Every occurrence in the series is updated, including past ones.' },
]

export function RecurrenceDemo() {
  const [scope, setScope] = useState<EditScope>('this')
  const active = SCOPES.find(s => s.value === scope)!

  return (
    <div className="my-8 rounded-[14px] border border-marigold bg-marigold-soft p-6 not-prose">
      <p className="font-mono text-xs text-marigold uppercase tracking-widest mb-4">
        Interactive Demo — Edit Recurring Event
      </p>
      <p className="text-sm text-ink-dim mb-4">
        You&apos;re editing &quot;Weekly Sync&quot; (every Monday). Which occurrences should this change affect?
      </p>
      <div className="flex flex-col gap-2 mb-4">
        {SCOPES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setScope(value)}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left font-mono text-sm transition-colors ${
              scope === value
                ? 'border-marigold bg-bg text-marigold'
                : 'border-grid-line text-ink-dim hover:border-marigold hover:text-ink'
            }`}
          >
            <span className={`h-3 w-3 shrink-0 rounded-full border-2 ${scope === value ? 'border-marigold bg-marigold' : 'border-ink-dim'}`} />
            {label}
          </button>
        ))}
      </div>
      <div className="rounded-lg bg-bg border border-grid-line p-4">
        <p className="font-mono text-xs text-ink-dim mb-1">Result</p>
        <p className="text-sm text-ink">{active.description}</p>
      </div>
    </div>
  )
}
