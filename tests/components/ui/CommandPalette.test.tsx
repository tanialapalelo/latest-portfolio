import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommandPalette } from '@/components/ui/CommandPalette'

test('renders when open', () => {
  render(<CommandPalette isOpen onClose={() => {}} />)
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  expect(screen.getByRole('textbox')).toBeInTheDocument()
})

test('does not render when closed', () => {
  render(<CommandPalette isOpen={false} onClose={() => {}} />)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

test('calls onClose on Escape', async () => {
  const onClose = vi.fn()
  render(<CommandPalette isOpen onClose={onClose} />)
  await userEvent.keyboard('{Escape}')
  expect(onClose).toHaveBeenCalled()
})

test('filters items by query', async () => {
  render(<CommandPalette isOpen onClose={() => {}} />)
  await userEvent.type(screen.getByRole('textbox'), 'proj')
  expect(screen.getByText('Projects')).toBeInTheDocument()
  expect(screen.queryByText('Blog')).not.toBeInTheDocument()
})

test('email item uses CV-aligned contact address', () => {
  render(<CommandPalette isOpen onClose={() => {}} />)
  expect(screen.getByRole('link', { name: /email/i })).toHaveAttribute(
    'href',
    'mailto:taniasilvanalapalelo@gmail.com'
  )
})
