import { render, screen } from '@testing-library/react'
import ExperienceAdminPage from '@/app/admin/experience/page'
import NewExperiencePage from '@/app/admin/experience/new/page'
import EditExperiencePage from '@/app/admin/experience/[id]/edit/page'

const mockExperiences = [
  {
    id: '1',
    title: 'Frontend Engineer',
    company: 'Wings Group Indonesia',
    location: 'Jakarta, Indonesia',
    period: 'Jun 2023 – Present',
    accent: 'periwinkle',
    bullets: ['Reduced campaign activation time by 95%.'],
    sort_order: 0,
  },
  {
    id: '2',
    title: 'Software Engineer',
    company: 'Wings Group Indonesia',
    location: 'Jakarta, Indonesia',
    period: 'Oct 2021 – Jun 2023',
    accent: 'mint',
    bullets: ['Delivered a fingerprint attendance management tool.'],
    sort_order: 1,
  },
]

const mockExperience = mockExperiences[0]

vi.mock('@/lib/supabase/server', () => ({
  createClient: () =>
    Promise.resolve({
      from: () => ({
        select: () => ({
          order: () => Promise.resolve({ data: mockExperiences, error: null }),
          eq: () => ({
            single: () => Promise.resolve({ data: mockExperience, error: null }),
          }),
        }),
      }),
    }),
}))

vi.mock('@/app/admin/experience/actions', () => ({
  createExperience: vi.fn(),
  updateExperience: vi.fn(),
  deleteExperience: vi.fn(),
}))

test('list page renders experience entries', async () => {
  const jsx = await ExperienceAdminPage()
  render(jsx)
  expect(screen.getByText('Frontend Engineer')).toBeInTheDocument()
  expect(screen.getByText('Software Engineer')).toBeInTheDocument()
})

test('new page renders the experience form with title field', () => {
  render(<NewExperiencePage />)
  expect(screen.getByText('Title')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
})

test('edit page renders pre-populated form with experience data', async () => {
  const jsx = await EditExperiencePage({ params: Promise.resolve({ id: '1' }) })
  render(jsx)
  expect(screen.getByDisplayValue('Frontend Engineer')).toBeInTheDocument()
  expect(screen.getByDisplayValue('Wings Group Indonesia')).toBeInTheDocument()
})
