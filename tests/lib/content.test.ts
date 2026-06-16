import { describe, it, expect, vi, beforeEach } from 'vitest'
import fs from 'fs'

vi.mock('fs', () => ({
  default: {
    readdirSync: vi.fn(),
  },
}))

describe('getProjectSlugs', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.mocked(fs.readdirSync).mockReturnValue(
      ['calendar-clone.mdx', 'giftclaw.mdx', '_template.mdx'] as never
    )
  })

  it('returns slugs without extension, excluding _ prefix', async () => {
    const { getProjectSlugs } = await import('@/lib/content')
    expect(getProjectSlugs()).toEqual(['calendar-clone', 'giftclaw'])
  })
})

describe('getBlogSlugs', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.mocked(fs.readdirSync).mockReturnValue(
      ['2026-06-16-hello-world.mdx', '2026-05-01-rrule.mdx'] as never
    )
  })

  it('returns all blog slugs without extension', async () => {
    const { getBlogSlugs } = await import('@/lib/content')
    expect(getBlogSlugs()).toEqual([
      '2026-06-16-hello-world',
      '2026-05-01-rrule',
    ])
  })
})
