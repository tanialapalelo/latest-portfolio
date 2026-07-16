'use client'
import { useEffect, useState } from 'react'

type Props = { score: number; onRestart: () => void; onExit: () => void }

export function GameOverPanel({ score, onRestart, onExit }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true)
  }, [])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-bg/70 backdrop-blur-sm transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div
        className={`border border-coral bg-bg-elevated rounded-[14px] px-10 py-8 text-center shadow-lg transition-transform duration-300 ${
          visible ? 'scale-100' : 'scale-95'
        }`}
      >
        <p className="font-mono text-lg text-coral uppercase tracking-widest">Game Over</p>
        <p className="font-mono text-sm text-ink-dim mt-2">Score: {score}</p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={onRestart}
            className="font-mono text-xs border border-grid-line rounded-md px-3 py-1.5 hover:border-mint hover:text-mint transition-colors"
          >
            SPACE restart
          </button>
          <button
            onClick={onExit}
            className="font-mono text-xs border border-grid-line rounded-md px-3 py-1.5 hover:border-coral hover:text-coral transition-colors"
          >
            ESC exit
          </button>
        </div>
      </div>
    </div>
  )
}
