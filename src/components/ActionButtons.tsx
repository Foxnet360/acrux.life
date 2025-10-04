import React, { memo } from 'react'
import { ActionButtonsProps } from '@/lib/types'

/**
 * Action buttons component
 */
const ActionButtons = memo(function ActionButtons({
  objectiveId,
  onEdit,
  onDelete,
  onSendPulse
}: ActionButtonsProps) {
  return (
    <div className="d-flex gap-2">
      {onEdit && (
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => onEdit(objectiveId)}
          aria-label="Edit objective"
        >
          Edit
        </button>
      )}
      {onSendPulse && (
        <button
          className="btn btn-outline-success btn-sm"
          onClick={() => onSendPulse(objectiveId)}
          aria-label="Send pulse check"
        >
          Send Pulse
        </button>
      )}
      {onDelete && (
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => onDelete(objectiveId)}
          aria-label="Delete objective"
        >
          Delete
        </button>
      )}
    </div>
  )
})

export default ActionButtons