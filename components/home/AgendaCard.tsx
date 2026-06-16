const items = [
  {
    dot: 'bg-mint',
    label: 'Current',
    value: 'Frontend Engineer @ Wings Group Indonesia',
  },
  {
    dot: 'bg-periwinkle',
    label: 'Open to',
    value: 'Full-stack SWE roles',
  },
  {
    dot: 'bg-marigold',
    label: 'Pursuing',
    value: "Master's in HCI / CS with AI & Learning Systems",
  },
]

export function AgendaCard() {
  return (
    <div className="rounded-[14px] border border-grid-line bg-bg-elevated p-6 flex flex-col gap-4">
      <p className="font-mono text-xs text-ink-dim uppercase tracking-widest">Status</p>
      {items.map(({ dot, label, value }) => (
        <div key={label} className="flex items-start gap-3">
          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} />
          <div>
            <p className="font-mono text-xs text-ink-dim">{label}</p>
            <p className="text-sm text-ink">{value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
