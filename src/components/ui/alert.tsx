import React, { forwardRef } from 'react'

export type AlertVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  dismissible?: boolean
  onDismiss?: () => void
  icon?: React.ReactNode
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className = '', variant = 'info', dismissible = false, onDismiss, icon, children, ...props }, ref) => {
    const baseClasses = 'alert'
    const variantClass = `alert-${variant}`
    const dismissibleClass = dismissible ? 'alert-dismissible fade show' : ''

    const combinedClasses = [
      baseClasses,
      variantClass,
      dismissibleClass,
      className
    ].filter(Boolean).join(' ')

    return (
      <div
        className={combinedClasses}
        role="alert"
        ref={ref}
        {...props}
      >
        {icon && (
          <div className="d-flex align-items-center">
            <span className="me-2">{icon}</span>
            <div className="flex-grow-1">{children}</div>
          </div>
        )}
        {!icon && children}
        {dismissible && (
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onDismiss}
          ></button>
        )}
      </div>
    )
  }
)

Alert.displayName = 'Alert'

export { Alert }