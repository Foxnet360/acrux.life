import { NextRequest } from 'next/server'
import { requireAuth, requireRole, requireAdmin, requireResearcher, requireAnalyst, requireViewer } from '@/lib/auth-utils'
import { handleApiError, createSuccessResponse } from '@/lib/errors'
import { UserRole } from '@/lib/types'

/**
 * Type for API route handlers
 */
type ApiHandler<T = any> = (
  request: NextRequest,
  context: { params: Record<string, string> },
  user: any
) => Promise<Response> | Response

/**
 * Middleware to require authentication
 */
export function withAuth(handler: ApiHandler): (request: NextRequest, context?: { params?: Record<string, string> }) => Promise<Response> {
  return async (request: NextRequest, context?: { params?: Record<string, string> }) => {
    try {
      const user = await requireAuth()
      const safeContext = context || { params: {} }
      return await handler(request, safeContext as { params: Record<string, string> }, user)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

/**
 * Middleware to require specific roles
 */
export function withRole<T extends { params: Record<string, string> }>(requiredRoles: UserRole[]): (handler: (request: NextRequest, context: T, user: any) => Promise<Response> | Response) => (request: NextRequest, context?: T) => Promise<Response> {
  return (handler) => {
    return async (request: NextRequest, context?: T) => {
      try {
        const user = await requireAuth()
        requireRole(user.role, requiredRoles)
        const safeContext = context || { params: {} } as T
        return await handler(request, safeContext, user)
      } catch (error) {
        return handleApiError(error)
      }
    }
  }
}

/**
 * Middleware for admin-only routes
 */
export const withAdmin = withRole(['ADMIN'])

/**
 * Middleware for researcher or higher routes
 */
export const withResearcher = withRole(['ADMIN', 'RESEARCHER'])

/**
 * Middleware for analyst or higher routes
 */
export const withAnalyst = withRole(['ADMIN', 'RESEARCHER', 'ANALYST'])

/**
 * Middleware for viewer or higher routes (all authenticated users)
 */
export const withViewer = withRole(['ADMIN', 'RESEARCHER', 'ANALYST', 'VIEWER'])

/**
 * Middleware with custom authorization check
 */
export function withCustomAuth<T extends { params: Record<string, string> }>(
  authCheck: (user: any, request: NextRequest, context: T) => Promise<boolean> | boolean
): (handler: (request: NextRequest, context: T, user: any) => Promise<Response> | Response) => (request: NextRequest, context?: T) => Promise<Response> {
  return (handler) => {
    return async (request: NextRequest, context?: T) => {
      try {
        const user = await requireAuth()
        const safeContext = context || { params: {} } as T
        const authorized = await authCheck(user, request, safeContext)
        if (!authorized) {
          throw new Error('Forbidden')
        }
        return await handler(request, safeContext, user)
      } catch (error) {
        return handleApiError(error)
      }
    }
  }
}

/**
 * Generic error handling wrapper (for routes that don't use auth middleware)
 */
export function withErrorHandling(handler: (request: NextRequest, context?: { params?: Record<string, string> }) => Promise<Response> | Response): (request: NextRequest, context?: { params?: Record<string, string> }) => Promise<Response> {
  return async (request: NextRequest, context?: { params?: Record<string, string> }) => {
    try {
      return await handler(request, context)
    } catch (error) {
      return handleApiError(error)
    }
  }
}