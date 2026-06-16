import { render } from '@testing-library/react'
import { GameModeProvider } from '@/lib/game-mode-context'
import { FallingChars } from '@/components/ui/FallingChars'

test('renders canvas element', () => {
  const { container } = render(
    <GameModeProvider><FallingChars /></GameModeProvider>
  )
  expect(container.querySelector('canvas')).toBeInTheDocument()
})
