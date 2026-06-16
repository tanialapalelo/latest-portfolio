import { render, screen, fireEvent } from '@testing-library/react'
import { TagFilter } from '@/components/blog/TagFilter'

const tags = ['nextjs', 'frontend', 'uipath']

test('renders all tags', () => {
  render(<TagFilter tags={tags} activeTag={null} onSelect={() => {}} />)
  expect(screen.getByText('nextjs')).toBeInTheDocument()
  expect(screen.getByText('uipath')).toBeInTheDocument()
})

test('calls onSelect with tag when clicked', () => {
  const onSelect = vi.fn()
  render(<TagFilter tags={tags} activeTag={null} onSelect={onSelect} />)
  fireEvent.click(screen.getByText('frontend'))
  expect(onSelect).toHaveBeenCalledWith('frontend')
})

test('calls onSelect with null when active tag clicked', () => {
  const onSelect = vi.fn()
  render(<TagFilter tags={tags} activeTag="nextjs" onSelect={onSelect} />)
  fireEvent.click(screen.getByText('nextjs'))
  expect(onSelect).toHaveBeenCalledWith(null)
})
