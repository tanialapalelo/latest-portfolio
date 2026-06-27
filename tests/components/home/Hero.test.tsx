import { render, screen } from '@testing-library/react'
import { Hero } from '@/components/home/Hero'

test('renders CV-aligned tagline and contact email', () => {
  render(<Hero />)
  expect(
    screen.getByText('Frontend Engineer ● Next.js ● NestJS ● TypeScript ● PostgreSQL')
  ).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute(
    'href',
    'mailto:taniasilvanalapalelo@gmail.com'
  )
})
