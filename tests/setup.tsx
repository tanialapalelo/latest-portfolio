// tests/setup.tsx
import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/',
}))

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [k: string]: unknown }) =>
    <img src={src} alt={alt} {...props} />,
}))

const mockCtx = {
  fillStyle: '' as string,
  font: '' as string,
  fillRect: vi.fn(),
  fillText: vi.fn(),
  clearRect: vi.fn(),
  drawImage: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4 * 40 * 18) })),
}
HTMLCanvasElement.prototype.getContext = vi.fn(() => mockCtx) as never
