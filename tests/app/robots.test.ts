import robots from '@/app/robots'

test('allows crawling of the site but disallows /admin', () => {
  const result = robots()
  expect(result.rules).toEqual({
    userAgent: '*',
    allow: '/',
    disallow: '/admin',
  })
  expect(result.sitemap).toBe('https://tanialapalelo.vercel.app/sitemap.xml')
})
