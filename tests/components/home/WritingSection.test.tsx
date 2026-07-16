import { render, screen } from '@testing-library/react'
import { WritingSection } from '@/components/home/WritingSection'

vi.mock('@/lib/medium', () => ({
  fetchMediumPosts: vi.fn().mockResolvedValue([
    {
      title: 'Understanding JavaScript Primitives',
      link: 'https://medium.com/@tanialapalelo/test',
      pubDate: '2024-03-01',
      tags: ['javascript', 'webdev'],
    },
    {
      title: 'DOM Manipulation Deep Dive',
      link: 'https://medium.com/@tanialapalelo/test2',
      pubDate: '2024-02-10',
      tags: ['dom'],
    },
    {
      title: 'SQL Indexing Explained',
      link: 'https://medium.com/@tanialapalelo/test3',
      pubDate: '2024-01-15',
      tags: ['sql'],
    },
  ]),
}))

test('renders Writing heading and top 3 posts', async () => {
  render(await WritingSection())
  expect(screen.getByText('Writing')).toBeInTheDocument()
  expect(screen.getByText('Understanding JavaScript Primitives')).toBeInTheDocument()
  expect(screen.getByText('DOM Manipulation Deep Dive')).toBeInTheDocument()
  expect(screen.getByText('SQL Indexing Explained')).toBeInTheDocument()
})

test('links to /blog for view all', async () => {
  render(await WritingSection())
  expect(screen.getByRole('link', { name: /view all/i })).toHaveAttribute('href', '/blog')
})

test('returns null when no posts', async () => {
  const { fetchMediumPosts } = await import('@/lib/medium')
  vi.mocked(fetchMediumPosts).mockResolvedValueOnce([])
  const result = await WritingSection()
  expect(result).toBeNull()
})
