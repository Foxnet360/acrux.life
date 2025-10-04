import React, { memo } from 'react'
import UserAvatar from './UserAvatar'
import { AssignedUsersProps } from '@/lib/types'

/**
 * Assigned users display component
 */
const AssignedUsers = memo(function AssignedUsers({ assignments }: AssignedUsersProps) {
  return (
    <div className="d-flex align-items-center mb-3">
      <small className="text-muted me-2">Assigned:</small>
      <div className="d-flex">
        {assignments.slice(0, 3).map((assignment) => (
          <UserAvatar
            key={assignment.userId}
            user={assignment.user}
            size="small"
            className="me-1"
            showTooltip
          />
        ))}
        {assignments.length > 3 && (
          <div
            className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
            style={{ width: '32px', height: '32px', fontSize: '12px' }}
            title={`${assignments.length - 3} more users`}
          >
            +{assignments.length - 3}
          </div>
        )}
      </div>
    </div>
  )
})

export default AssignedUsers