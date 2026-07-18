import { render, screen } from '@testing-library/react'
import { Nav } from '@/components/layout/Nav'

test('renders all nav links', () => {
  render(<Nav />)
  expect(screen.getByText('Projects')).toBeInTheDocument()
  expect(screen.getByText('Blog')).toBeInTheDocument()
  expect(screen.getByText('Community')).toBeInTheDocument()
})

test('renders Experience link pointing to the new section anchor', () => {
  render(<Nav />)
  expect(screen.getByRole('link', { name: 'Experience' })).toHaveAttribute('href', '/#experience')
})

test('renders the brand mark before the wordmark', () => {
  render(<Nav />)
  expect(screen.getByTestId('brand-mark')).toBeInTheDocument()
})
