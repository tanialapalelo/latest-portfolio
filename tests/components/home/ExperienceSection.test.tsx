import { render, screen } from '@testing-library/react'
import { ExperienceSection } from '@/components/home/ExperienceSection'

test('renders both roles with key quantified achievements', () => {
  render(<ExperienceSection />)
  expect(screen.getByText('Frontend Engineer')).toBeInTheDocument()
  expect(screen.getByText('Software Engineer')).toBeInTheDocument()
  expect(screen.getByText(/Reduced campaign activation time by 95%/)).toBeInTheDocument()
  expect(screen.getByText(/fingerprint attendance management tool/)).toBeInTheDocument()
})

test('section is anchorable from nav', () => {
  const { container } = render(<ExperienceSection />)
  expect(container.querySelector('#experience')).toBeInTheDocument()
})
