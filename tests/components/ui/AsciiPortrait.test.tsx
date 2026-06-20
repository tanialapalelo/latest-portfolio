import { render } from '@testing-library/react'
import { AsciiPortrait } from '@/components/ui/AsciiPortrait'

test('renders aria-hidden container', () => {
  const { container } = render(<AsciiPortrait src="/tania-portrait.jpg" width={40} />)
  const el = container.firstChild as HTMLElement
  expect(el).toHaveAttribute('aria-hidden', 'true')
})
