import React, { memo } from 'react'
import { DueDateProps } from '@/lib/types'

/**
 * Due date display component
 */
const DueDate = memo(function DueDate({ targetDate }: DueDateProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return 'No deadline'
    return new Date(date).toLocaleDateString()
  }

  const isOverdue = targetDate && new Date(targetDate) < new Date()

  return (
    <small className={`text-muted ${isOverdue ? 'text-danger fw-bold' : ''}`}>
      Due: {formatDate(targetDate)}
      {isOverdue && ' (Overdue)'}
    </small>
  )
})

export default DueDate