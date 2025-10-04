import React, { useEffect } from 'react'
import { ObjectiveCardProps } from '@/lib/types'
import UserAvatar from './UserAvatar'

/**
 * Status badge component for objective status
 */
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
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
}

/**
 * Health score display component
 */
const HealthScore: React.FC<{ score: number }> = ({ score }) => {
  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-success'
    if (score >= 60) return 'text-info'
    if (score >= 40) return 'text-warning'
    return 'text-danger'
  }

  return (
    <div className="text-center">
      <div className={`fw-bold ${getHealthColor(score)}`}>
        {score}%
      </div>
      <small className="text-muted">Health Score</small>
    </div>
  )
}

/**
 * Progress bar component
 */
const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="progress mb-2" style={{ height: '6px' }}>
    <div
      className="progress-bar bg-primary"
      style={{ width: `${Math.min(progress, 100)}%` }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  </div>
)

/**
 * Due date display component
 */
const DueDate: React.FC<{ targetDate: Date | null }> = ({ targetDate }) => {
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
}

/**
 * Assigned users display component
 */
const AssignedUsers: React.FC<{ assignments: any[] }> = ({ assignments }) => (
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

/**
 * Action buttons component
 */
const ActionButtons: React.FC<{
  objectiveId: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onSendPulse?: (id: string) => void
}> = ({ objectiveId, onEdit, onDelete, onSendPulse }) => (
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

export default function ObjectiveCard({
  objective,
  onEdit,
  onDelete,
  onSendPulse,
  className = ''
}: ObjectiveCardProps) {

  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    console.log('ObjectiveCard: Dark mode active?', isDarkMode)
    // Log computed styles for debugging
    const cardBody = document.querySelector('.card-body')
    if (cardBody) {
      const computedStyle = window.getComputedStyle(cardBody)
      console.log('Card body background:', computedStyle.backgroundColor)
      console.log('Card body color:', computedStyle.color)
    }
  }, [])

  return (
    <div className={`card h-100 ${className}`} role="article" aria-labelledby={`objective-${objective.id}`}>
      <div className="card-body">
        {/* Header with title and status */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <h5 className="card-title mb-2" id={`objective-${objective.id}`}>
              {objective.title}
            </h5>
            {objective.description && (
              <p className="card-text text-muted small mb-2">
                {objective.description}
              </p>
            )}
          </div>
          <StatusBadge status={objective.status} />
        </div>

        {/* Health and Progress metrics */}
        <div className="row mb-3">
          <div className="col-6">
            <HealthScore score={objective.healthScore} />
          </div>
          <div className="col-6">
            <div className="text-center">
              <div className="fw-bold">{objective.progress}%</div>
              <small className="text-muted">Progress</small>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <ProgressBar progress={objective.progress} />

        {/* Due date */}
        <div className="mb-3">
          <DueDate targetDate={objective.targetDate} />
        </div>

        {/* Assigned users */}
        <AssignedUsers assignments={objective.assignments} />

        {/* Action buttons */}
        <ActionButtons
          objectiveId={objective.id}
          onEdit={onEdit}
          onDelete={onDelete}
          onSendPulse={onSendPulse}
        />
      </div>
    </div>
  )
}