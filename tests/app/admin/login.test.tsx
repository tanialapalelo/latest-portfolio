import { render, screen } from '@testing-library/react'
import LoginPage from '@/app/admin/login/page'

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))

test('renders email input and submit button', () => {
  render(<LoginPage />)
  expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /send magic link/i })).toBeInTheDocument()
})
