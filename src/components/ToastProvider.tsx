'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Toast, ToastVariant } from './ui/toast'

interface ToastItem {
  id: string
  title?: string
  message: string
  variant: ToastVariant
  duration?: number
}

interface ToastContextType {
  showToast: (message: string, options?: {
    title?: string
    variant?: ToastVariant
    duration?: number
  }) => void
  showSuccess: (message: string, title?: string) => void
  showError: (message: string, title?: string) => void
  showWarning: (message: string, title?: string) => void
  showInfo: (message: string, title?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showToast = useCallback((
    message: string,
    options: { title?: string; variant?: ToastVariant; duration?: number } = {}
  ) => {
    const id = Date.now().toString()
    const toast: ToastItem = {
      id,
      message,
      variant: options.variant || 'info',
      title: options.title,
      duration: options.duration ?? 5000
    }

    setToasts(prev => [...prev, toast])
  }, [])

  const showSuccess = useCallback((message: string, title?: string) => {
    showToast(message, { title, variant: 'success' })
  }, [showToast])

  const showError = useCallback((message: string, title?: string) => {
    showToast(message, { title, variant: 'error' })
  }, [showToast])

  const showWarning = useCallback((message: string, title?: string) => {
    showToast(message, { title, variant: 'warning' })
  }, [showToast])

  const showInfo = useCallback((message: string, title?: string) => {
    showToast(message, { title, variant: 'info' })
  }, [showToast])

  const contextValue: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Toast Container */}
      <div
        className="toast-container position-fixed top-0 end-0 p-3"
        style={{ zIndex: 1050 }}
      >
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            id={toast.id}
            title={toast.title}
            message={toast.message}
            variant={toast.variant}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}