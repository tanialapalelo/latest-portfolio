import { render, screen } from '@testing-library/react'
import { Nav } from '@/components/layout/Nav'

test('renders all nav links', () => {
  render(<Nav />)
  expect(screen.getByText('Projects')).toBeInTheDocument()
  expect(screen.getByText('Blog')).toBeInTheDocument()
  expect(screen.getByText('Community')).toBeInTheDocument()
})
