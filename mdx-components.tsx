import type { MDXComponents } from 'mdx/types'
import { Pre, BlogImage, Callout } from '@/components/blog/MDXComponents'
import { RecurrenceDemo } from '@/components/project/RecurrenceDemo'

export const mdxComponents: MDXComponents = {
  pre: Pre,
  img: BlogImage as MDXComponents['img'],
  Callout,
  RecurrenceDemo,
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...mdxComponents, ...components }
}
