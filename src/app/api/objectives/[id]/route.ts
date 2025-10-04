import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSuccessResponse, NotFoundError, AuthorizationError } from '@/lib/errors'
import { withCustomAuth, withAdmin } from '@/lib/api-middleware'
import { cache } from '@/lib/cache'

async function getObjective(request: NextRequest, context: { params: { id: string } }, user: any) {
  const cacheKey = `objective:${context.params.id}`

  // Check cache first
  const cachedObjective = cache.get(cacheKey)
  if (cachedObjective) {
    return createSuccessResponse(cachedObjective, 'Objective retrieved successfully (cached)')
  }

  const objective = await prisma.objective.findUnique({
    where: { id: context.params.id },
    include: {
      user: true,
      assignments: {
        include: {
          user: true
        }
      }
    }
  })

  if (!objective) {
    throw new NotFoundError('Objective')
  }

  // Cache for 5 minutes
  cache.set(cacheKey, objective, 5 * 60 * 1000)

  return createSuccessResponse(objective, 'Objective retrieved successfully')
}

async function checkObjectiveAccess(user: any, request: NextRequest, context: { params: { id: string } }) {
  const objective = await prisma.objective.findUnique({
    where: { id: context.params.id },
    include: { assignments: true }
  })

  if (!objective) return true // Let the handler throw NotFoundError

  const isAdmin = user.role === 'ADMIN'
  const isAssigned = objective.assignments.some((a: any) => a.userId === user.id)
  const isCreator = objective.userId === user.id

  return isAdmin || isAssigned || isCreator
}

async function updateObjective(request: NextRequest, context: { params: { id: string } }, user: any) {
  const { title, description, status, progress, targetDate, assignedUsers } = await request.json()

  // Check if objective exists and user has permission
  const existingObjective = await prisma.objective.findUnique({
    where: { id: context.params.id },
    include: { assignments: true }
  })

  if (!existingObjective) {
    throw new NotFoundError('Objective')
  }

  const isAdmin = user.role === 'ADMIN'
  const isCreator = existingObjective.userId === user.id

  if (!isAdmin && !isCreator) {
    throw new AuthorizationError('Only admins or creators can update objectives')
  }

  // Update objective
  const objective = await prisma.objective.update({
    where: { id: context.params.id },
    data: {
      title,
      description,
      status,
      progress,
      targetDate: targetDate ? new Date(targetDate) : null,
      assignments: assignedUsers ? {
        deleteMany: {},
        create: assignedUsers.map((userId: string) => ({
          userId
        }))
      } : undefined
    },
    include: {
      user: true,
      assignments: {
        include: {
          user: true
        }
      }
    }
  })

  // Clear related caches
  cache.delete(`objective:${context.params.id}`)
  // Also clear general objectives cache to be safe
  cache.clear()

  return createSuccessResponse(objective, 'Objective updated successfully')
}

async function checkUpdateAccess(user: any, request: NextRequest, context: { params: { id: string } }) {
  const objective = await prisma.objective.findUnique({
    where: { id: context.params.id }
  })

  if (!objective) return true // Let the handler throw NotFoundError

  const isAdmin = user.role === 'ADMIN'
  const isCreator = objective.userId === user.id

  return isAdmin || isCreator
}

async function deleteObjective(request: NextRequest, context: { params: Record<string, string> }, user: any) {
  // Check if objective exists
  const existingObjective = await prisma.objective.findUnique({
    where: { id: context.params.id }
  })

  if (!existingObjective) {
    throw new NotFoundError('Objective')
  }

  // Delete objective (cascade will handle assignments)
  await prisma.objective.delete({
    where: { id: context.params.id }
  })

  // Clear related caches
  cache.delete(`objective:${context.params.id}`)
  // Also clear general objectives cache
  cache.clear()

  return createSuccessResponse(null, 'Objective deleted successfully')
}

export const GET = withCustomAuth(checkObjectiveAccess)(getObjective)
export const PUT = withCustomAuth(checkUpdateAccess)(updateObjective)
export const DELETE = withAdmin(deleteObjective)