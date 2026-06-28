import { render, screen } from '@testing-library/react'
import { EducationSection } from '@/components/home/EducationSection'

test('renders degree and certifications', () => {
  render(<EducationSection />)
  expect(screen.getByText('B.Sc. Computer Science')).toBeInTheDocument()
  expect(screen.getByText(/University of Surabaya/)).toBeInTheDocument()
  expect(screen.getByText('Kominfo Cyber Security Graduate Academy')).toBeInTheDocument()
  expect(screen.getByText('Hack2Skill GenAI APAC 2026 (in progress)')).toBeInTheDocument()
})
