'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useGameMode } from '@/lib/game-mode-context'
import { initSnake, moveSnake, type Direction, type SnakeState } from '@/lib/snake'
import { AchievementToast } from './AchievementToast'
import { GameOverPanel } from './GameOverPanel'

const CELL = 28
const FOOD_COLORS = ['#FF6B5C', '#FFB627', '#9AA6FF', '#4ED9B0']
const DIR_MAP: Record<string, Direction> = {
  ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
  a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
}

export function GameModeOverlay() {
  const { isGameMode, toggle } = useGameMode()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<SnakeState | null>(null)
  const dirRef = useRef<Direction>({ x: 1, y: 0 })
  const foodColorIdx = useRef(0)
  const [toast, setToast] = useState<{ msg: string; key: number } | null>(null)
  const [gameOverScore, setGameOverScore] = useState<number | null>(null)

  const getGrid = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return { w: 0, h: 0 }
    return {
      w: Math.floor(canvas.width / CELL),
      h: Math.floor(canvas.height / CELL),
    }
  }, [])

  useEffect(() => {
    if (!isGameMode) return
    const canvas = canvasRef.current!

    function restart() {
      const { w, h } = getGrid()
      stateRef.current = initSnake(w, h)
      dirRef.current = { x: 1, y: 0 }
      setGameOverScore(null)
    }

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      restart()
    }

    function onKey(e: KeyboardEvent) {
      if (DIR_MAP[e.key]) {
        e.preventDefault()
        dirRef.current = DIR_MAP[e.key]
      }
      if (e.key === ' ' && stateRef.current?.gameOver) {
        restart()
      }
      if (e.key === 'Escape') {
        toggle()
      }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('keydown', onKey)

    const ctx = canvas.getContext('2d')!
    const id = setInterval(() => {
      if (!stateRef.current) return
      const { w, h } = getGrid()
      const prev = stateRef.current
      stateRef.current = moveSnake(prev, dirRef.current, w, h)
      const s = stateRef.current

      if (s.score > prev.score && s.score % 5 === 0) {
        setToast({ msg: `COMBO ×${s.score / 5}`, key: Date.now() })
      }
      if (s.gameOver && !prev.gameOver) {
        setGameOverScore(s.score)
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw food
      const fc = FOOD_COLORS[foodColorIdx.current % FOOD_COLORS.length]
      ctx.fillStyle = fc
      ctx.beginPath()
      ctx.arc(s.food.x * CELL + CELL / 2, s.food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2)
      ctx.fill()

      // Draw snake: segments stay near-full cell size so the body reads as one
      // connected trail (classic grid-snake look); the head is bigger/rounder
      // and the tail tapers down slightly at its tip.
      s.snake.forEach((seg, i) => {
        const t = i / Math.max(s.snake.length - 1, 1)
        const size = CELL - 1 - t * 6
        const offset = (CELL - size) / 2
        const radius = i === 0 ? size / 2 : 6
        ctx.fillStyle = i === 0 ? '#6FA8D8' : `rgba(154,166,255,${1 - t * 0.55})`
        ctx.beginPath()
        ctx.roundRect(seg.x * CELL + offset, seg.y * CELL + offset, size, size, radius)
        ctx.fill()
      })

      // Eyes on the head, oriented toward the direction of travel
      const head = s.snake[0]
      const hx = head.x * CELL + CELL / 2 + dirRef.current.x * 5
      const hy = head.y * CELL + CELL / 2 + dirRef.current.y * 5
      const perpX = -dirRef.current.y * 6
      const perpY = dirRef.current.x * 6
      ctx.fillStyle = '#1C1E2A'
      for (const sign of [1, -1]) {
        ctx.beginPath()
        ctx.arc(hx + perpX * sign, hy + perpY * sign, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }, 120)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', onKey)
      clearInterval(id)
    }
  }, [isGameMode, getGrid, toggle])

  if (!isGameMode) return null

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-40"
        aria-hidden="true"
      />
      {/* HUD */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 font-mono text-xs text-ink-dim border border-grid-line bg-bg-elevated rounded-full px-4 py-2 pointer-events-none">
        {gameOverScore === null ? 'WASD / ↑↓←→ · ESC exit' : 'SPACE restart · ESC exit'}
      </div>
      {toast && (
        <AchievementToast
          key={toast.key}
          message={toast.msg}
          description="Score milestone!"
          onDismiss={() => setToast(null)}
        />
      )}
      {gameOverScore !== null && (
        <GameOverPanel
          score={gameOverScore}
          onRestart={() =>
            window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
          }
          onExit={toggle}
        />
      )}
    </>
  )
}
