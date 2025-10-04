import React, { forwardRef } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'outline-primary' | 'outline-secondary' | 'outline-success' | 'outline-danger' | 'outline-warning' | 'outline-info' | 'outline-light' | 'outline-dark'
export type ButtonSize = 'sm' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size, loading = false, disabled = false, children, ...props }, ref) => {
    const baseClasses = 'btn'
    const variantClass = `btn${variant.startsWith('outline') ? `-${variant}` : `-${variant}`}`
    const sizeClass = size ? `btn-${size}` : ''
    const loadingClass = loading ? 'disabled' : ''
    const disabledClass = disabled ? 'disabled' : ''

    const combinedClasses = [
      baseClasses,
      variantClass,
      sizeClass,
      loadingClass,
      disabledClass,
      className
    ].filter(Boolean).join(' ')

    return (
      <button
        className={combinedClasses}
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }