import { render } from '@testing-library/react'
import { PersonJsonLd } from '@/components/layout/PersonJsonLd'

test('renders a Person JSON-LD script with expected fields', () => {
  const { container } = render(<PersonJsonLd />)
  const script = container.querySelector('script[type="application/ld+json"]')
  expect(script).not.toBeNull()
  const data = JSON.parse(script!.textContent ?? '{}')
  expect(data['@type']).toBe('Person')
  expect(data.name).toBe('Tania Lapalelo')
  expect(data.jobTitle).toBe('Frontend Engineer')
  expect(data.url).toBe('https://tanialapalelo.vercel.app')
  expect(data.sameAs).toEqual([
    'https://github.com/tanialapalelo',
    'https://linkedin.com/in/tanialapalelo',
    'https://medium.com/@tanialapalelo',
  ])
})
