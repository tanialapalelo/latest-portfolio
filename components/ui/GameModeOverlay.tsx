'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useGameMode } from '@/lib/game-mode-context'
import { initSnake, moveSnake, type Direction, type SnakeState } from '@/lib/snake'
import { AchievementToast } from './AchievementToast'

const CELL = 28
const FOOD_COLORS = ['#FF6B5C', '#FFB627', '#9AA6FF', '#4ED9B0']
const DIR_MAP: Record<string, Direction> = {
  ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
  a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
}

export function GameModeOverlay() {
  const { isGameMode } = useGameMode()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<SnakeState | null>(null)
  const dirRef = useRef<Direction>({ x: 1, y: 0 })
  const foodColorIdx = useRef(0)
  const [toast, setToast] = useState<{ msg: string; key: number } | null>(null)

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

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const { w, h } = getGrid()
      stateRef.current = initSnake(w, h)
      dirRef.current = { x: 1, y: 0 }
    }

    function onKey(e: KeyboardEvent) {
      if (DIR_MAP[e.key]) {
        e.preventDefault()
        dirRef.current = DIR_MAP[e.key]
      }
      if (e.key === ' ' && stateRef.current?.gameOver) {
        const { w, h } = getGrid()
        stateRef.current = initSnake(w, h)
        dirRef.current = { x: 1, y: 0 }
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

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw food
      const fc = FOOD_COLORS[foodColorIdx.current % FOOD_COLORS.length]
      ctx.fillStyle = fc
      ctx.beginPath()
      ctx.arc(s.food.x * CELL + CELL / 2, s.food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2)
      ctx.fill()

      // Draw snake
      s.snake.forEach((seg, i) => {
        const alpha = 1 - (i / s.snake.length) * 0.7
        ctx.fillStyle = `rgba(154,166,255,${alpha})`
        ctx.beginPath()
        ctx.roundRect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4, 4)
        ctx.fill()
      })
    }, 120)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', onKey)
      clearInterval(id)
    }
  }, [isGameMode, getGrid])

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
        WASD / ↑↓←→ · SPACE restart
      </div>
      {toast && (
        <AchievementToast
          key={toast.key}
          message={toast.msg}
          description="Score milestone!"
          onDismiss={() => setToast(null)}
        />
      )}
    </>
  )
}
