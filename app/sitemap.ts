import type { MetadataRoute } from 'next'
import { getBlogSlugs, getProjectSlugs } from '@/lib/content'

const BASE_URL = 'https://tanialapalelo.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries = getBlogSlugs().map(slug => ({
    url: `${BASE_URL}/blog/${slug}`,
  }))
  const projectEntries = getProjectSlugs().map(slug => ({
    url: `${BASE_URL}/projects/${slug}`,
  }))

  return [{ url: BASE_URL }, ...blogEntries, ...projectEntries]
}
