import React, { memo } from 'react'
import { StatusBadgeProps } from '@/lib/types'

/**
 * Status badge component for objective status
 */
const StatusBadge = memo(function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-success'
      case 'ACTIVE':
        return 'bg-primary'
      case 'PAUSED':
        return 'bg-warning'
      default:
        return 'bg-secondary'
    }
  }

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').toLowerCase()
  }

  return (
    <span className={`badge ${getStatusColor(status)} ms-2`}>
      {formatStatus(status)}
    </span>
  )
})

export default StatusBadge