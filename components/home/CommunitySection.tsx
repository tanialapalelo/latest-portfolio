const communities = [
  {
    name: 'Women Talk Series',
    description: 'A YouTube talk series I founded to amplify women in tech — engineers, designers, and founders sharing their journeys.',
    href: 'https://www.youtube.com/watch?v=AxnzU07nlVk&list=PL-1PWH5uyT-eJSJf1oQTbnlbvUDS-I4HK',
    accent: 'text-mint',
    border: 'border-mint',
  },
  {
    name: 'Rewriting the Code',
    description: 'Global community supporting women in tech through scholarships, mentorship, and job placement.',
    href: 'https://rewritingthecode.org/',
    accent: 'text-periwinkle',
    border: 'border-periwinkle',
  },
]

export function CommunitySection() {
  return (
    <section id="community" className="pt-20 pb-20">
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">Community</p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {communities.map(c => (
          <a
            key={c.name}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`block rounded-[14px] border-2 ${c.border} bg-bg-elevated p-6 hover:-translate-y-1 transition-transform`}
          >
            <p className={`font-mono text-xs ${c.accent} uppercase tracking-widest mb-2`}>{c.name}</p>
            <p className="text-sm text-ink-dim">{c.description}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
