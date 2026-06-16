'use client'
import { useEffect, useRef } from 'react'
import { useGameMode } from '@/lib/game-mode-context'

const CHARS = '{}[]<>=+-*/\\|:.,#@$%^&!?;'
const CELL = 16
const COLORS = ['#9AA6FF', '#9AA6FF', '#4ED9B0']

export function FallingChars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isGameMode } = useGameMode()

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let cols: number
    let drops: number[]

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      cols = Math.floor(canvas.width / CELL)
      drops = Array.from({ length: cols }, () => Math.random() * -80)
    }

    function draw() {
      ctx.fillStyle = 'rgba(28,30,42,0.18)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < cols; i++) {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)]
        ctx.fillStyle = COLORS[i % COLORS.length]
        ctx.font = `${CELL - 2}px "IBM Plex Mono", monospace`
        ctx.fillText(ch, i * CELL, drops[i] * CELL)
        if (drops[i] * CELL > canvas.height && Math.random() > 0.975) drops[i] = 0
        else drops[i] += 0.4
      }
    }

    resize()
    window.addEventListener('resize', resize)
    const id = setInterval(draw, 55)
    return () => {
      window.removeEventListener('resize', resize)
      clearInterval(id)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none z-0 transition-opacity duration-700"
      style={{ opacity: isGameMode ? 0.13 : 0.045 }}
      aria-hidden="true"
    />
  )
}
