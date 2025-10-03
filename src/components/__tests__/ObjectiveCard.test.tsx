import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ObjectiveCard from '../ObjectiveCard'
import { Objective, User } from '@/lib/types'

// Mock UserAvatar component
jest.mock('../UserAvatar', () => {
  return function MockUserAvatar({ user, showTooltip }: any) {
    return (
      <div data-testid={`user-avatar-${user.id}`} title={showTooltip ? user.name : undefined}>
        {user.name}
      </div>
    )
  }
})

describe('ObjectiveCard', () => {
  const mockUser: User = {
    id: 'user-1',
    email: 'john@example.com',
    name: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    role: 'RESEARCHER',
    organizationId: null,
    isActive: true,
    emailVerified: null,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockObjective: Objective & {
    assignments: Array<{
      id: string
      userId: string
      objectiveId: string
      user: User
    }>
  } = {
    id: 'obj-1',
    title: 'Test Objective',
    description: 'This is a test objective',
    progress: 75,
    healthScore: 85,
    status: 'ACTIVE',
    targetDate: new Date('2025-12-31'),
    ownerId: null,
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    assignments: [
      {
        id: 'assign-1',
        userId: 'user-1',
        objectiveId: 'obj-1',
        user: mockUser
      }
    ]
  }

  const defaultProps = {
    objective: mockObjective,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onSendPulse: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders objective title and description', () => {
      render(<ObjectiveCard {...defaultProps} />)

      expect(screen.getByText('Test Objective')).toBeInTheDocument()
      expect(screen.getByText('This is a test objective')).toBeInTheDocument()
    })

    it('displays health score correctly', () => {
      render(<ObjectiveCard {...defaultProps} />)

      expect(screen.getByText('85%')).toBeInTheDocument()
      expect(screen.getByText('Health Score')).toBeInTheDocument()
    })

    it('displays progress correctly', () => {
      render(<ObjectiveCard {...defaultProps} />)

      expect(screen.getByText('75%')).toBeInTheDocument()
      expect(screen.getByText('Progress')).toBeInTheDocument()
    })

    it('shows status badge', () => {
      render(<ObjectiveCard {...defaultProps} />)

      expect(screen.getByText('active')).toBeInTheDocument()
    })

    it('displays due date', () => {
      render(<ObjectiveCard {...defaultProps} />)

      expect(screen.getByText(/Due:/)).toBeInTheDocument()
    })

    it('shows assigned users', () => {
      render(<ObjectiveCard {...defaultProps} />)

      expect(screen.getByText('Assigned:')).toBeInTheDocument()
      expect(screen.getByTestId('user-avatar-user-1')).toBeInTheDocument()
    })
  })

  describe('Status Badge', () => {
    it('shows correct color for ACTIVE status', () => {
      render(<ObjectiveCard {...defaultProps} />)

      const badge = screen.getByText('active')
      expect(badge).toHaveClass('badge', 'bg-primary')
    })

    it('shows correct color for COMPLETED status', () => {
      const completedObjective = {
        ...mockObjective,
        status: 'COMPLETED' as const
      }

      render(<ObjectiveCard {...defaultProps} objective={completedObjective} />)

      const badge = screen.getByText('completed')
      expect(badge).toHaveClass('badge', 'bg-success')
    })
  })

  describe('Progress Bar', () => {
    it('renders progress bar with correct width', () => {
      render(<ObjectiveCard {...defaultProps} />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveStyle({ width: '75%' })
    })

    it('caps progress at 100%', () => {
      const highProgressObjective = {
        ...mockObjective,
        progress: 150
      }

      render(<ObjectiveCard {...defaultProps} objective={highProgressObjective} />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveStyle({ width: '100%' })
    })
  })

  describe('Due Date', () => {
    it('shows overdue indicator for past due date', () => {
      const overdueObjective = {
        ...mockObjective,
        targetDate: new Date('2020-01-01')
      }

      render(<ObjectiveCard {...defaultProps} objective={overdueObjective} />)

      expect(screen.getByText(/Overdue/)).toBeInTheDocument()
    })

    it('shows "No deadline" for null target date', () => {
      const noDeadlineObjective = {
        ...mockObjective,
        targetDate: null
      }

      render(<ObjectiveCard {...defaultProps} objective={noDeadlineObjective} />)

      expect(screen.getByText(/No deadline/)).toBeInTheDocument()
    })
  })

  describe('Action Buttons', () => {
    it('renders all action buttons when handlers provided', () => {
      render(<ObjectiveCard {...defaultProps} />)

      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /send pulse/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })

    it('does not render edit button when onEdit not provided', () => {
      render(<ObjectiveCard {...defaultProps} onEdit={undefined} />)

      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
    })

    it('calls onEdit when edit button clicked', () => {
      render(<ObjectiveCard {...defaultProps} />)

      const editButton = screen.getByRole('button', { name: /edit/i })
      fireEvent.click(editButton)

      expect(defaultProps.onEdit).toHaveBeenCalledWith('obj-1')
    })

    it('calls onDelete when delete button clicked', () => {
      render(<ObjectiveCard {...defaultProps} />)

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      fireEvent.click(deleteButton)

      expect(defaultProps.onDelete).toHaveBeenCalledWith('obj-1')
    })

    it('calls onSendPulse when send pulse button clicked', () => {
      render(<ObjectiveCard {...defaultProps} />)

      const pulseButton = screen.getByRole('button', { name: /send pulse/i })
      fireEvent.click(pulseButton)

      expect(defaultProps.onSendPulse).toHaveBeenCalledWith('obj-1')
    })
  })

  describe('Assigned Users', () => {
    it('shows overflow indicator for more than 3 users', () => {
      const multipleUsersObjective = {
        ...mockObjective,
        assignments: Array.from({ length: 5 }, (_, i) => ({
          id: `assign-${i}`,
          userId: `user-${i}`,
          objectiveId: 'obj-1',
          user: {
            ...mockUser,
            id: `user-${i}`,
            name: `User ${i}`
          }
        }))
      }

      render(<ObjectiveCard {...defaultProps} objective={multipleUsersObjective} />)

      expect(screen.getByText('+2')).toBeInTheDocument()
    })

    it('shows tooltip for user avatars when showTooltip is true', () => {
      render(<ObjectiveCard {...defaultProps} />)

      const avatar = screen.getByTestId('user-avatar-user-1')
      expect(avatar).toHaveAttribute('title', 'John Doe')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<ObjectiveCard {...defaultProps} />)

      expect(screen.getByRole('article')).toBeInTheDocument()
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75')
    })

    it('has descriptive button labels', () => {
      render(<ObjectiveCard {...defaultProps} />)

      expect(screen.getByRole('button', { name: /edit objective/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /send pulse check/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete objective/i })).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies custom className', () => {
      render(<ObjectiveCard {...defaultProps} className="custom-class" />)

      const card = screen.getByRole('article')
      expect(card).toHaveClass('card', 'h-100', 'custom-class')
    })

    it('applies health score color classes correctly', () => {
      const excellentHealth = { ...mockObjective, healthScore: 90 }
      const { rerender } = render(<ObjectiveCard {...defaultProps} objective={excellentHealth} />)

      expect(screen.getByText('90%')).toHaveClass('text-success')

      const warningHealth = { ...mockObjective, healthScore: 50 }
      rerender(<ObjectiveCard {...defaultProps} objective={warningHealth} />)

      expect(screen.getByText('50%')).toHaveClass('text-warning')
    })
  })
})