import { render, screen } from '@testing-library/react'
import { CommunitySection } from '@/components/home/CommunitySection'

const mockCommunity = [
  {
    id: '1',
    name: 'Women Talk Series',
    description: 'A YouTube talk series I founded to amplify women in tech.',
    href: 'https://www.youtube.com/watch?v=AxnzU07nlVk',
    accent: 'mint',
    sort_order: 0,
  },
]

vi.mock('@/lib/supabase/public', () => ({
  createPublicClient: () => ({
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: mockCommunity, error: null }),
      }),
    }),
  }),
}))

test('renders community cards from Supabase', async () => {
  const jsx = await CommunitySection()
  render(jsx)
  expect(screen.getByText('Women Talk Series')).toBeInTheDocument()
  expect(screen.getByText(/YouTube talk series/)).toBeInTheDocument()
})

test('community card links to external href', async () => {
  const jsx = await CommunitySection()
  render(jsx)
  expect(screen.getByRole('link', { name: /Women Talk Series/i })).toHaveAttribute(
    'href',
    'https://www.youtube.com/watch?v=AxnzU07nlVk'
  )
})
