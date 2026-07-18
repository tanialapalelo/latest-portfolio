import { render, screen } from '@testing-library/react'
import { BrandMark } from '@/lib/brand-mark'

test('renders a rounded badge with T and L glyphs', () => {
  render(<BrandMark size={32} />)
  const badge = screen.getByTestId('brand-mark')
  expect(badge).toHaveStyle({ width: '32px', height: '32px', background: '#1C1E2A' })
  expect(screen.getByText('T')).toBeInTheDocument()
  expect(screen.getByText('L')).toBeInTheDocument()
})

test('scales font size and border radius proportionally to size', () => {
  render(<BrandMark size={180} />)
  const badge = screen.getByTestId('brand-mark')
  expect(badge).toHaveStyle({ width: '180px', height: '180px', borderRadius: '36px' })
})
