import { render, screen } from '@testing-library/react'
import EducationAdminPage from '@/app/admin/education/page'

const mockEducation = {
  id: 'edu-1',
  degree: 'Bachelor of Computer Science',
  institution: 'Universitas Indonesia',
  year: '2021',
  certifications: [
    'AWS Certified Developer – Associate',
    'Google Professional Cloud Architect',
  ],
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: () =>
    Promise.resolve({
      from: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: mockEducation, error: null }),
        }),
      }),
    }),
}))

vi.mock('@/app/admin/education/actions', () => ({
  updateEducation: vi.fn(),
}))

test('renders the form with pre-populated degree', async () => {
  const jsx = await EducationAdminPage()
  render(jsx)
  expect(
    screen.getByDisplayValue('Bachelor of Computer Science'),
  ).toBeInTheDocument()
})

test('renders certifications textarea with one entry per line', async () => {
  const jsx = await EducationAdminPage()
  render(jsx)
  const textarea = screen.getByRole('textbox', { name: /certifications/i })
  expect(textarea).toBeInTheDocument()
  expect((textarea as HTMLTextAreaElement).value).toContain('AWS Certified Developer')
  expect((textarea as HTMLTextAreaElement).value).toContain('Google Professional Cloud Architect')
})
