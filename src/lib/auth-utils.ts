import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AuthenticationError, AuthorizationError } from '@/lib/errors'
import { UserRole } from '@/lib/types'

/**
 * Get authenticated user session
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new AuthenticationError()
  }

  return session.user
}

/**
 * Check if user has required role
 */
export function requireRole(userRole: string, requiredRoles: UserRole[]): void {
  if (!requiredRoles.includes(userRole as UserRole)) {
    throw new AuthorizationError(`Required roles: ${requiredRoles.join(', ')}`)
  }
}

/**
 * Check admin access
 */
export async function requireAdmin() {
  const user = await requireAuth()
  requireRole(user.role, ['ADMIN'])
  return user
}

/**
 * Check researcher or higher access
 */
export async function requireResearcher() {
  const user = await requireAuth()
  requireRole(user.role, ['ADMIN', 'RESEARCHER'])
  return user
}

/**
 * Check analyst or higher access
 */
export async function requireAnalyst() {
  const user = await requireAuth()
  requireRole(user.role, ['ADMIN', 'RESEARCHER', 'ANALYST'])
  return user
}

/**
 * Check viewer or higher access (all authenticated users)
 */
export async function requireViewer() {
  const user = await requireAuth()
  requireRole(user.role, ['ADMIN', 'RESEARCHER', 'ANALYST', 'VIEWER'])
  return user
}