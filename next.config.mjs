// next.config.mjs
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  options: {
    rehypePlugins: [
      [
        'rehype-pretty-code',
        {
          theme: 'tokyo-night',
          keepBackground: false,
          defaultLang: 'typescript',
        },
      ],
    ],
  },
})

export default withMDX(nextConfig)
