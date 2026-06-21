'use client'
import { useGameMode } from '@/lib/game-mode-context'

export function GameModePill() {
  const { isGameMode, toggle } = useGameMode()
  return (
    <button
      onClick={toggle}
      className="fixed top-[76px] left-6 z-50 flex items-center gap-2 font-mono text-xs border border-grid-line bg-bg-elevated rounded-full px-3 py-1.5 hover:border-mint transition-colors"
      aria-pressed={isGameMode}
      aria-label="Toggle game mode"
    >
      <span className={`h-2 w-2 rounded-full transition-colors ${isGameMode ? 'bg-mint shadow-[0_0_6px_#4ED9B0]' : 'bg-ink-dim'}`} />
      Game Mode
    </button>
  )
}
