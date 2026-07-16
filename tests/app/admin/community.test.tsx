import { render, screen } from '@testing-library/react'
import CommunityAdminPage from '@/app/admin/community/page'
import NewCommunityPage from '@/app/admin/community/new/page'
import EditCommunityPage from '@/app/admin/community/[id]/edit/page'

const mockEntries = [
  {
    id: '1',
    name: 'Next.js Community',
    description: 'Official Next.js community on Discord.',
    href: 'https://nextjs.org/discord',
    accent: 'periwinkle',
    sort_order: 0,
  },
  {
    id: '2',
    name: 'Tailwind CSS',
    description: 'Tailwind CSS community forum.',
    href: 'https://github.com/tailwindlabs/tailwindcss/discussions',
    accent: 'mint',
    sort_order: 1,
  },
]

const mockEntry = mockEntries[0]

vi.mock('@/lib/supabase/server', () => ({
  createClient: () =>
    Promise.resolve({
      from: () => ({
        select: () => ({
          order: () => Promise.resolve({ data: mockEntries, error: null }),
          eq: () => ({
            single: () => Promise.resolve({ data: mockEntry, error: null }),
          }),
        }),
      }),
    }),
}))

vi.mock('@/app/admin/community/actions', () => ({
  createCommunityEntry: vi.fn(),
  updateCommunityEntry: vi.fn(),
  deleteCommunityEntry: vi.fn(),
}))

test('list page renders community entries', async () => {
  const jsx = await CommunityAdminPage()
  render(jsx)
  expect(screen.getByText('Next.js Community')).toBeInTheDocument()
  expect(screen.getByText('Official Next.js community on Discord.')).toBeInTheDocument()
  expect(screen.getByText('Tailwind CSS')).toBeInTheDocument()
})

test('new page renders the community form with name field', () => {
  render(<NewCommunityPage />)
  expect(screen.getByText('Name')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
})

test('edit page renders pre-populated form with community data', async () => {
  const jsx = await EditCommunityPage({ params: Promise.resolve({ id: '1' }) })
  render(jsx)
  expect(screen.getByDisplayValue('Next.js Community')).toBeInTheDocument()
  expect(screen.getByDisplayValue('Official Next.js community on Discord.')).toBeInTheDocument()
  expect(screen.getByDisplayValue('https://nextjs.org/discord')).toBeInTheDocument()
})
