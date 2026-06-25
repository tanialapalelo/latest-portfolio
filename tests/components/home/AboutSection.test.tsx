import { render, screen } from '@testing-library/react'
import { AboutSection } from '@/components/home/AboutSection'

test('renders accurate skill categories from CV and projects', () => {
  render(<AboutSection />)
  expect(screen.getByText('Material-UI')).toBeInTheDocument()
  expect(screen.getByText('Django')).toBeInTheDocument()
  expect(screen.getByText('Turborepo')).toBeInTheDocument()
  expect(screen.getByText('Database')).toBeInTheDocument()
  expect(screen.queryByText('tRPC')).not.toBeInTheDocument()
})
