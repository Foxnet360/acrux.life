import React, { memo } from 'react'
import { ProgressBarProps } from '@/lib/types'

/**
 * Progress bar component
 */
const ProgressBar = memo(function ProgressBar({ progress }: ProgressBarProps) {
  return (
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
})

export default ProgressBar