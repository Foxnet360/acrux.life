import { Objective, User, ObjectiveCardProps } from '@/lib/types'
import UserAvatar from './UserAvatar'

export default function ObjectiveCard({
  objective,
  onEdit,
  onDelete,
  onSendPulse,
  className = ''
}: ObjectiveCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'status-completed'
      case 'IN_PROGRESS':
        return 'status-in-progress'
      case 'BLOCKED':
        return 'status-blocked'
      default:
        return 'status-not-started'
    }
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'health-excellent'
    if (score >= 60) return 'health-good'
    if (score >= 40) return 'health-warning'
    return 'health-critical'
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'No deadline'
    return new Date(date).toLocaleDateString()
  }

  const isOverdue = objective.targetDate && new Date(objective.targetDate) < new Date()

  return (
    <div className={`card h-100 ${className}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <h5 className="card-title mb-2">{objective.title}</h5>
            <p className="card-text text-muted small mb-2">
              {objective.description}
            </p>
          </div>
          <span className={`badge ${getStatusColor(objective.status)} ms-2`}>
            {objective.status.replace('_', ' ')}
          </span>
        </div>

        <div className="row mb-3">
          <div className="col-6">
            <div className="text-center">
              <div className={`fw-bold ${getHealthColor(objective.healthScore)}`}>
                {objective.healthScore}%
              </div>
              <small className="text-muted">Health Score</small>
            </div>
          </div>
          <div className="col-6">
            <div className="text-center">
              <div className="fw-bold">{objective.progress}%</div>
              <small className="text-muted">Progress</small>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <div className="progress" style={{ height: '6px' }}>
            <div
              className="progress-bar bg-primary"
              style={{ width: `${objective.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-3">
          <small className={`text-muted ${isOverdue ? 'text-danger' : ''}`}>
            Due: {formatDate(objective.targetDate)}
            {isOverdue && ' (Overdue)'}
          </small>
        </div>

        <div className="d-flex align-items-center mb-3">
          <small className="text-muted me-2">Assigned:</small>
          <div className="d-flex">
            {objective.assignments.slice(0, 3).map((assignment) => (
              <UserAvatar
                key={assignment.userId}
                user={assignment.user}
                size="small"
                className="me-1"
                showTooltip
              />
            ))}
            {objective.assignments.length > 3 && (
              <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                   style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                +{objective.assignments.length - 3}
              </div>
            )}
          </div>
        </div>

        <div className="d-flex gap-2">
          {onEdit && (
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => onEdit(objective.id)}
            >
              Edit
            </button>
          )}
          {onSendPulse && (
            <button
              className="btn btn-outline-success btn-sm"
              onClick={() => onSendPulse(objective.id)}
            >
              Send Pulse
            </button>
          )}
          {onDelete && (
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onDelete(objective.id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}