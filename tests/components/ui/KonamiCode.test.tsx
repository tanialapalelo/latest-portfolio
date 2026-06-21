import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GameModeProvider, useGameMode } from '@/lib/game-mode-context'
import { KonamiCode } from '@/components/ui/KonamiCode'

function Status() {
  const { isGameMode } = useGameMode()
  return <span>{isGameMode ? 'on' : 'off'}</span>
}

test('activates game mode on Konami sequence', async () => {
  const { getByText } = render(
    <GameModeProvider>
      <KonamiCode />
      <Status />
    </GameModeProvider>
  )
  expect(getByText('off')).toBeInTheDocument()
  await userEvent.keyboard(
    '{ArrowUp}{ArrowUp}{ArrowDown}{ArrowDown}{ArrowLeft}{ArrowRight}{ArrowLeft}{ArrowRight}ba'
  )
  expect(getByText('on')).toBeInTheDocument()
})

test('ignores Konami sequence typed while a text input is focused', async () => {
  const { getByText, getByRole } = render(
    <GameModeProvider>
      <KonamiCode />
      <Status />
      <input aria-label="search" />
    </GameModeProvider>
  )
  expect(getByText('off')).toBeInTheDocument()
  const input = getByRole('textbox')
  input.focus()
  await userEvent.keyboard(
    '{ArrowUp}{ArrowUp}{ArrowDown}{ArrowDown}{ArrowLeft}{ArrowRight}{ArrowLeft}{ArrowRight}ba'
  )
  expect(getByText('off')).toBeInTheDocument()
})
