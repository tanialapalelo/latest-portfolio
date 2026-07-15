import { render, screen } from '@testing-library/react'
import AdminLayout from '@/app/admin/layout'

test('renders admin sidebar navigation', () => {
  render(
    <AdminLayout>
      <div>content</div>
    </AdminLayout>
  )
  expect(screen.getByRole('link', { name: /experience/i })).toHaveAttribute('href', '/admin/experience')
  expect(screen.getByRole('link', { name: /education/i })).toHaveAttribute('href', '/admin/education')
  expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute('href', '/admin/projects')
  expect(screen.getByRole('link', { name: /community/i })).toHaveAttribute('href', '/admin/community')
})
