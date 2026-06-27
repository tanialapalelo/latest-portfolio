export function Footer() {
  return (
    <footer className="border-t border-grid-line mt-24">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between px-6 py-8">
        <p className="font-mono text-xs text-ink-dim">
          © {new Date().getFullYear()} Tania Lapalelo
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/tanialapalelo"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-ink-dim hover:text-periwinkle transition-colors"
            aria-label="GitHub"
          >
            GitHub ↗
          </a>
          <a
            href="https://linkedin.com/in/tanialapalelo"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-ink-dim hover:text-periwinkle transition-colors"
            aria-label="LinkedIn"
          >
            LinkedIn ↗
          </a>
          <a
            href="https://medium.com/@tanialapalelo"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-ink-dim hover:text-periwinkle transition-colors"
            aria-label="Medium"
          >
            Medium ↗
          </a>
          <a
            href="mailto:taniasilvanalapalelo@gmail.com"
            className="font-mono text-xs text-ink-dim hover:text-periwinkle transition-colors"
            aria-label="Email"
          >
            Email ↗
          </a>
        </div>
      </div>
    </footer>
  )
}
