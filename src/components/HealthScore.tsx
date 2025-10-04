import React, { memo } from 'react'
import { HealthScoreProps } from '@/lib/types'

/**
 * Health score display component
 */
const HealthScore = memo(function HealthScore({ score }: HealthScoreProps) {
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
})

export default HealthScore