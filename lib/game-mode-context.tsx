'use client'
import { createContext, useCallback, useContext, useState } from 'react'

type GameModeCtx = { isGameMode: boolean; toggle: () => void }
const GameModeContext = createContext<GameModeCtx>({ isGameMode: false, toggle: () => {} })

export function GameModeProvider({ children }: { children: React.ReactNode }) {
  const [isGameMode, setIsGameMode] = useState(false)
  const toggle = useCallback(() => setIsGameMode(v => !v), [])
  return (
    <GameModeContext.Provider value={{ isGameMode, toggle }}>
      {children}
    </GameModeContext.Provider>
  )
}

export const useGameMode = () => useContext(GameModeContext)
