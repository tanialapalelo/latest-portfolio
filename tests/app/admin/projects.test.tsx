import { render, screen } from '@testing-library/react'
import ProjectsAdminPage from '@/app/admin/projects/page'
import NewProjectPage from '@/app/admin/projects/new/page'
import EditProjectPage from '@/app/admin/projects/[id]/edit/page'

const mockProjects = [
  {
    id: '1',
    slug: 'calendar-clone',
    case_study_number: '01',
    tagline: 'A full-featured calendar application.',
    accent: 'periwinkle' as const,
    tech: ['Next.js 16', 'TypeScript', 'PostgreSQL'],
    sort_order: 0,
  },
  {
    id: '2',
    slug: 'portfolio-v2',
    case_study_number: '02',
    tagline: 'Personal portfolio redesign.',
    accent: 'mint' as const,
    tech: ['React', 'Tailwind CSS'],
    sort_order: 1,
  },
]

const mockProject = mockProjects[0]

vi.mock('@/lib/supabase/server', () => ({
  createClient: () =>
    Promise.resolve({
      from: () => ({
        select: () => ({
          order: () => Promise.resolve({ data: mockProjects, error: null }),
          eq: () => ({
            single: () => Promise.resolve({ data: mockProject, error: null }),
          }),
        }),
      }),
    }),
}))

vi.mock('@/app/admin/projects/actions', () => ({
  createProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
}))

test('list page renders project entries', async () => {
  const jsx = await ProjectsAdminPage()
  render(jsx)
  expect(screen.getByText('calendar-clone', { exact: false })).toBeInTheDocument()
  expect(screen.getByText('A full-featured calendar application.')).toBeInTheDocument()
  expect(screen.getByText('portfolio-v2', { exact: false })).toBeInTheDocument()
})

test('new page renders the project form with slug field', () => {
  render(<NewProjectPage />)
  expect(screen.getByText('Slug (matches MDX filename)')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
})

test('edit page renders pre-populated form with project data', async () => {
  const jsx = await EditProjectPage({ params: Promise.resolve({ id: '1' }) })
  render(jsx)
  expect(screen.getByDisplayValue('calendar-clone')).toBeInTheDocument()
  expect(screen.getByDisplayValue('A full-featured calendar application.')).toBeInTheDocument()
  expect(screen.getByDisplayValue('01')).toBeInTheDocument()
})
