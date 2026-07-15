import { render, screen } from '@testing-library/react'
import { EducationSection } from '@/components/home/EducationSection'

const mockEducation = {
  id: '1',
  degree: 'B.Sc. Computer Science',
  institution: 'University of Surabaya (UBAYA), Indonesia',
  year: '2021',
  certifications: [
    'Bangkit 2021 Cloud Computing Track (Google, Tokopedia, Gojek, Traveloka)',
    'Kominfo Cyber Security Graduate Academy',
    'SIAS University China Exchange',
    'Hack2Skill GenAI APAC 2026 (in progress)',
  ],
}

vi.mock('@/lib/supabase/public', () => ({
  createPublicClient: () => ({
    from: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: mockEducation, error: null }),
      }),
    }),
  }),
}))

test('renders degree and certifications from Supabase', async () => {
  const jsx = await EducationSection()
  render(jsx)
  expect(screen.getByText('B.Sc. Computer Science')).toBeInTheDocument()
  expect(screen.getByText(/University of Surabaya/)).toBeInTheDocument()
  expect(screen.getByText('Kominfo Cyber Security Graduate Academy')).toBeInTheDocument()
  expect(screen.getByText('Hack2Skill GenAI APAC 2026 (in progress)')).toBeInTheDocument()
})
