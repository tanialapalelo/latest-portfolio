import { NextRequest } from 'next/server'

vi.mock('@supabase/ssr', () => ({
  createServerClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
  }),
}))

test('redirects unauthenticated request to /admin/login', async () => {
  const { middleware } = await import('@/middleware')
  const req = new NextRequest('http://localhost/admin/experience')
  const res = await middleware(req)
  expect(res.status).toBe(307)
  expect(res.headers.get('location')).toContain('/admin/login')
})

test('allows /admin/login without a session', async () => {
  const { middleware } = await import('@/middleware')
  const req = new NextRequest('http://localhost/admin/login')
  const res = await middleware(req)
  expect(res.status).not.toBe(307)
})

test('allows /auth/callback without a session', async () => {
  const { middleware } = await import('@/middleware')
  const req = new NextRequest('http://localhost/auth/callback?code=abc')
  const res = await middleware(req)
  expect(res.status).not.toBe(307)
})
