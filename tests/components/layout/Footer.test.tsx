import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/Footer'

test('renders copyright and social links', () => {
  render(<Footer />)
  expect(screen.getByText(/Tania Lapalelo/)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
})
