import { render, screen } from '@testing-library/react'
import { ExperienceSection } from '@/components/home/ExperienceSection'

const mockExperiences = [
  {
    id: '1',
    title: 'Frontend Engineer',
    company: 'Wings Group Indonesia',
    location: 'Jakarta, Indonesia',
    period: 'Jun 2023 – Present',
    accent: 'periwinkle',
    bullets: ['Reduced campaign activation time by 95% by engineering the STAR promo module.'],
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

vi.mock('@/lib/supabase/public', () => ({
  createPublicClient: () => ({
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: mockExperiences, error: null }),
      }),
    }),
  }),
}))

test('renders experience entries from Supabase', async () => {
  const jsx = await ExperienceSection()
  render(jsx)
  expect(screen.getByText('Frontend Engineer')).toBeInTheDocument()
  expect(screen.getByText('Software Engineer')).toBeInTheDocument()
})

test('renders quantified achievement bullet', async () => {
  const jsx = await ExperienceSection()
  render(jsx)
  expect(screen.getByText(/Reduced campaign activation time by 95%/)).toBeInTheDocument()
})

test('section is anchorable from nav', async () => {
  const jsx = await ExperienceSection()
  const { container } = render(jsx)
  expect(container.querySelector('#experience')).toBeInTheDocument()
})
