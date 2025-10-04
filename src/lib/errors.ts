/**
 * Custom error classes for consistent error handling across the application
 */

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: any,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = 'AppError'

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super('AUTHENTICATION_ERROR', message, 401)
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super('AUTHORIZATION_ERROR', message, 403)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super('VALIDATION_ERROR', message, 400, details)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super('NOT_FOUND', `${resource} not found`, 404)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super('CONFLICT', message, 409)
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: any) {
    super('DATABASE_ERROR', message, 500, details, false)
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed') {
    super('NETWORK_ERROR', message, 0, undefined, false)
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super('RATE_LIMIT', message, 429)
  }
}

/**
 * Enhanced error handler middleware for API routes
 */
export function handleApiError(error: unknown, context?: string): Response {
  console.error(`API Error${context ? ` in ${context}` : ''}:`, error)

  if (error instanceof AppError) {
    // Log operational errors as warnings, programming errors as errors
    if (error.isOperational) {
      console.warn(`Operational error: ${error.message}`, error.details)
    } else {
      console.error(`Programming error: ${error.message}`, error)
    }

    return Response.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      },
      { status: error.statusCode }
    )
  }

  // Handle Zod validation errors
  if (error && typeof error === 'object' && 'issues' in error) {
    const zodError = error as any
    const errorMessages = zodError.issues?.map((issue: any) => issue.message).join(', ') || 'Validation failed'

    return Response.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: errorMessages,
          details: zodError.issues
        }
      },
      { status: 400 }
    )
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any
    if (prismaError.code === 'P2002') {
      return Response.json(
        {
          success: false,
          error: {
            code: 'DUPLICATE_ERROR',
            message: 'A record with this information already exists'
          }
        },
        { status: 409 }
      )
    }
  }

  // Unknown error
  console.error('Unknown error:', error)
  return Response.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred. Please try again later.'
      }
    },
    { status: 500 }
  )
}

/**
 * Success response helper
 */
export function createSuccessResponse<T = any>(
  data: T,
  message = 'Success',
  status = 200
): Response {
  return Response.json(
    {
      success: true,
      data,
      message
    },
    { status }
  )
}


/**
 * Utility function to check if error is operational (user-facing)
 */
export function isOperationalError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.isOperational
  }
  return false
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message
  }

  if (error && typeof error === 'object' && 'issues' in error) {
    const zodError = error as any
    return zodError.issues?.[0]?.message || 'Validation failed'
  }

  return 'An unexpected error occurred'
}