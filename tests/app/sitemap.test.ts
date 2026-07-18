import { vi } from 'vitest'

vi.mock('@/lib/content', () => ({
  getBlogSlugs: () => ['2026-06-16-hello-world'],
  getProjectSlugs: () => ['calendar-clone', 'giftclaw'],
}))

test('includes home, all blog slugs, and all project slugs', async () => {
  const { default: sitemap } = await import('@/app/sitemap')
  const urls = sitemap().map(entry => entry.url)
  expect(urls).toEqual([
    'https://tanialapalelo.vercel.app',
    'https://tanialapalelo.vercel.app/blog/2026-06-16-hello-world',
    'https://tanialapalelo.vercel.app/projects/calendar-clone',
    'https://tanialapalelo.vercel.app/projects/giftclaw',
  ])
})
