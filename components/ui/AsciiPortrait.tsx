'use client'
import { useEffect, useRef } from 'react'

const CHARS = ' .,:;i1tfLCG08@'

export function AsciiPortrait({ src, width = 42 }: { src: string; width?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src
    img.onload = () => {
      const aspect = img.height / img.width
      const cols = width
      const rows = Math.floor(cols * aspect * 0.45)
      const offscreen = document.createElement('canvas')
      offscreen.width = cols
      offscreen.height = rows
      const oc = offscreen.getContext('2d')
      if (!oc) return
      oc.drawImage(img, 0, 0, cols, rows)
      const pixels = oc.getImageData(0, 0, cols, rows).data
      let html = ''
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = (r * cols + c) * 4
          const brightness =
            (pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114) / 255
          const charIdx = Math.floor(brightness * (CHARS.length - 1))
          html += `<span>${CHARS[charIdx]}</span>`
        }
        html += '\n'
      }
      if (containerRef.current) containerRef.current.innerHTML = html
    }
  }, [src, width])

  return (
    <div
      ref={containerRef}
      className="font-mono text-[7px] leading-[1.18] tracking-[0.08em] text-periwinkle select-none whitespace-pre transition-colors duration-300 hover:text-ink"
      aria-hidden="true"
    />
  )
}
