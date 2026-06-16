// tests/lib/game-mode-context.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { GameModeProvider, useGameMode } from '@/lib/game-mode-context'

function Toggle() {
  const { isGameMode, toggle } = useGameMode()
  return (
    <button onClick={toggle}>
      {isGameMode ? 'on' : 'off'}
    </button>
  )
}

test('starts off, toggles on', () => {
  render(<GameModeProvider><Toggle /></GameModeProvider>)
  expect(screen.getByText('off')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button'))
  expect(screen.getByText('on')).toBeInTheDocument()
})
