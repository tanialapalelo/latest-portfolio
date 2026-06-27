import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/Footer'

test('renders copyright and social links', () => {
  render(<Footer />)
  expect(screen.getByText(/Tania Lapalelo/)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
})

test('renders Medium link and CV-aligned contact email', () => {
  render(<Footer />)
  expect(screen.getByRole('link', { name: /medium/i })).toHaveAttribute(
    'href',
    'https://medium.com/@tanialapalelo'
  )
  expect(screen.getByRole('link', { name: /email/i })).toHaveAttribute(
    'href',
    'mailto:taniasilvanalapalelo@gmail.com'
  )
})
