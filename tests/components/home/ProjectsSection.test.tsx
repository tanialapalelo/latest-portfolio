import { render, screen } from '@testing-library/react'
import { ProjectsSection } from '@/components/home/ProjectsSection'

const mockProjects = [
  {
    id: '1',
    slug: 'calendar-clone',
    case_study_number: '01',
    tagline: 'A production-grade Google Calendar rebuild.',
    accent: 'marigold',
    tech: ['Next.js 16', 'NestJS 11'],
    sort_order: 0,
  },
]

vi.mock('@/lib/supabase/public', () => ({
  createPublicClient: () => ({
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: mockProjects, error: null }),
      }),
    }),
  }),
}))

test('renders project cards from Supabase', async () => {
  const jsx = await ProjectsSection()
  render(jsx)
  expect(screen.getByText('A production-grade Google Calendar rebuild.')).toBeInTheDocument()
  expect(screen.getByText('Case Study 01')).toBeInTheDocument()
})

test('section has correct id anchor', async () => {
  const jsx = await ProjectsSection()
  const { container } = render(jsx)
  expect(container.querySelector('#projects')).toBeInTheDocument()
})
