import { render, screen } from '@testing-library/react'
import UserAvatar from '../UserAvatar'
import { User } from '@/lib/types'

const mockUser: User = {
  id: '1',
  email: 'john@example.com',
  name: 'John Doe',
  hashedPassword: null,
  role: 'MEMBER',
  language: 'en',
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('UserAvatar', () => {
  it('renders user initials correctly', () => {
    render(<UserAvatar user={mockUser} />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('renders email initials when no name is provided', () => {
    const userWithoutName = { ...mockUser, name: null }
    render(<UserAvatar user={userWithoutName} />)
    expect(screen.getByText('JO')).toBeInTheDocument()
  })

  it('applies correct size classes', () => {
    const { container } = render(<UserAvatar user={mockUser} size="large" />)
    const avatar = container.firstChild as HTMLElement
    expect(avatar).toHaveClass('w-16', 'h-16', 'text-lg')
  })

  it('has correct background color class', () => {
    const { container } = render(<UserAvatar user={mockUser} />)
    const avatar = container.firstChild as HTMLElement
    const bgColors = ['bg-primary', 'bg-success', 'bg-info', 'bg-warning', 'bg-danger', 'bg-secondary']
    const hasBgColor = bgColors.some(color => avatar.classList.contains(color))
    expect(hasBgColor).toBe(true)
  })
})