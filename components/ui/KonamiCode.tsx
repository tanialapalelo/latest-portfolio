'use client'
import { useEffect, useRef } from 'react'
import { useGameMode } from '@/lib/game-mode-context'

const SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

export function KonamiCode() {
  const { toggle } = useGameMode()
  const progress = useRef(0)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === SEQUENCE[progress.current]) {
        progress.current += 1
        if (progress.current === SEQUENCE.length) {
          toggle()
          progress.current = 0
        }
      } else {
        progress.current = e.key === SEQUENCE[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle])

  return null
}
