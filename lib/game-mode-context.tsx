// lib/game-mode-context.tsx
'use client'
import { createContext, useContext, useState } from 'react'

type GameModeCtx = { isGameMode: boolean; toggle: () => void }
const Ctx = createContext<GameModeCtx>({ isGameMode: false, toggle: () => {} })

export function GameModeProvider({ children }: { children: React.ReactNode }) {
  const [isGameMode, setIsGameMode] = useState(false)
  return (
    <Ctx.Provider value={{ isGameMode, toggle: () => setIsGameMode(v => !v) }}>
      {children}
    </Ctx.Provider>
  )
}

export const useGameMode = () => useContext(Ctx)
