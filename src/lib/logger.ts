/**
 * Centralized logging utility for consistent logging across the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  userId?: string
  requestId?: string
  [key: string]: any
}

class Logger {
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` | ${JSON.stringify(context)}` : ''
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, context))
    }
  }

  info(message: string, context?: LogContext): void {
    console.info(this.formatMessage('info', message, context))
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context))
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = error instanceof Error
      ? { ...context, error: error.message, stack: error.stack }
      : context

    console.error(this.formatMessage('error', message, errorContext))
  }

  // API-specific logging methods
  apiRequest(method: string, path: string, userId?: string): void {
    this.info(`API ${method} ${path}`, { userId, type: 'api_request' })
  }

  apiResponse(method: string, path: string, statusCode: number, duration: number, userId?: string): void {
    this.info(`API ${method} ${path} - ${statusCode} (${duration}ms)`, {
      userId,
      statusCode,
      duration,
      type: 'api_response'
    })
  }

  databaseQuery(operation: string, table: string, duration: number, userId?: string): void {
    this.debug(`DB ${operation} on ${table} (${duration}ms)`, {
      userId,
      operation,
      table,
      duration,
      type: 'database_query'
    })
  }

  authEvent(event: string, userId?: string, details?: any): void {
    this.info(`Auth: ${event}`, { userId, details, type: 'auth_event' })
  }
}

export const logger = new Logger()

/**
 * Middleware to log API requests
 */
export function withLogging(handler: Function) {
  return async (request: Request, context?: any) => {
    const startTime = Date.now()
    const url = new URL(request.url)
    const method = request.method
    const path = url.pathname

    try {
      const result = await handler(request, context)
      const duration = Date.now() - startTime

      // Log successful requests
      logger.apiResponse(method, path, result.status || 200, duration)

      return result
    } catch (error) {
      const duration = Date.now() - startTime

      // Log failed requests
      logger.apiResponse(method, path, 500, duration)
      logger.error('API request failed', error)

      throw error
    }
  }
}