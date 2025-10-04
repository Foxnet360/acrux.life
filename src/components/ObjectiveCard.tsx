import React, { memo } from 'react'
import { ObjectiveCardProps } from '@/lib/types'
import { logger } from '@/lib/logger'
import ErrorBoundary from './ErrorBoundary'
import StatusBadge from './StatusBadge'
import HealthScore from './HealthScore'
import ProgressBar from './ProgressBar'
import DueDate from './DueDate'
import AssignedUsers from './AssignedUsers'
import ActionButtons from './ActionButtons'

const ObjectiveCard = memo(function ObjectiveCard({
  objective,
  onEdit,
  onDelete,
  onSendPulse,
  className = ''
}: ObjectiveCardProps) {


  return (
    <div className={`card h-100 ${className}`} role="article" aria-labelledby={`objective-${objective.id}`}>
      <ErrorBoundary>
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
      </ErrorBoundary>
    </div>
  )
})

export default ObjectiveCard