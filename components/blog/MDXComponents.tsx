'use client'
import { useState } from 'react'
import Image from 'next/image'
import type { MDXComponents } from 'mdx/types'

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch {
          // clipboard API unavailable or permission denied
        }
      }}
      className="absolute top-3 right-3 font-mono text-xs text-ink-dim border border-grid-line rounded px-2 py-1 hover:text-periwinkle transition-colors"
      aria-label="Copy code"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export function Pre({ children, ...props }: React.ComponentProps<'pre'>) {
  const code = typeof children === 'string'
    ? children
    : (children as React.ReactElement<{ children?: string }>)?.props?.children ?? ''
  return (
    <div className="relative my-6">
      <pre
        {...props}
        className="rounded-[14px] border border-grid-line bg-bg-elevated overflow-x-auto p-5 text-sm"
      >
        {children}
      </pre>
      <CopyButton code={String(code)} />
    </div>
  )
}

export function BlogImage({
  src, alt, ...props
}: { src: string; alt: string; width?: number; height?: number }) {
  return (
    <figure className="my-8">
      <Image
        src={src}
        alt={alt}
        width={props.width ?? 800}
        height={props.height ?? 450}
        className="rounded-[14px] border border-grid-line w-full h-auto"
      />
      {alt && <figcaption className="mt-2 text-center font-mono text-xs text-ink-dim">{alt}</figcaption>}
    </figure>
  )
}

export function Callout({
  type = 'info',
  children,
}: {
  type?: 'info' | 'warning' | 'tip'
  children: React.ReactNode
}) {
  const styles = {
    info: 'border-periwinkle bg-periwinkle-soft text-periwinkle',
    warning: 'border-marigold bg-marigold-soft text-marigold',
    tip: 'border-mint bg-mint-soft text-mint',
  }
  const labels = { info: 'Info', warning: 'Warning', tip: 'Tip' }
  return (
    <div className={`my-6 rounded-[14px] border-l-4 p-4 ${styles[type]}`}>
      <p className="font-mono text-xs uppercase tracking-widest mb-1">{labels[type]}</p>
      <div className="text-sm text-ink">{children}</div>
    </div>
  )
}

export const mdxComponents: MDXComponents = {
  pre: Pre,
  img: BlogImage as MDXComponents['img'],
  Callout,
}
