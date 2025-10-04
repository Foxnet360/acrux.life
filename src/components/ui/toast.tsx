import React, { forwardRef, useEffect } from 'react'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id: string
  title?: string
  message: string
  variant?: ToastVariant
  duration?: number
  onClose: (id: string) => void
}

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ id, title, message, variant = 'info', duration = 5000, onClose }, ref) => {
    useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => onClose(id), duration)
        return () => clearTimeout(timer)
      }
    }, [id, duration, onClose])

    const getVariantClasses = (variant: ToastVariant) => {
      switch (variant) {
        case 'success':
          return 'bg-success text-white'
        case 'error':
          return 'bg-danger text-white'
        case 'warning':
          return 'bg-warning text-dark'
        case 'info':
        default:
          return 'bg-info text-white'
      }
    }

    return (
      <div
        ref={ref}
        className={`toast show ${getVariantClasses(variant)}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="toast-header">
          {title && <strong className="me-auto">{title}</strong>}
          <button
            type="button"
            className="btn-close btn-close-white"
            aria-label="Close"
            onClick={() => onClose(id)}
          ></button>
        </div>
        <div className="toast-body">
          {message}
        </div>
      </div>
    )
  }
)

Toast.displayName = 'Toast'

export { Toast }