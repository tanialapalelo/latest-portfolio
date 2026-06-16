import fs from 'fs'
import path from 'path'

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects')
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export function getProjectSlugs(): string[] {
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter(f => f.endsWith('.mdx') && !f.startsWith('_'))
    .map(f => f.replace('.mdx', ''))
}

export function getBlogSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace('.mdx', ''))
}
