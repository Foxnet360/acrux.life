import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSuccessResponse, ValidationError, NotFoundError, AuthorizationError } from '@/lib/errors'
import { withCustomAuth } from '@/lib/api-middleware'

async function createBlocker(request: NextRequest, context: any, user: any) {
  const { title, description, severity, objectiveId } = await request.json()

  // Validation
  if (!title || !objectiveId) {
    throw new ValidationError('Title and objective ID are required')
  }

  // Check if objective exists and user is assigned
  const objective = await prisma.objective.findUnique({
    where: { id: objectiveId },
    include: { assignments: true }
  })

  if (!objective) {
    throw new NotFoundError('Objective')
  }

  const isAssigned = objective.assignments.some(
    assignment => assignment.userId === user.id
  )

  if (!isAssigned) {
    throw new AuthorizationError('You are not assigned to this objective')
  }

  // Create blocker
  const blocker = await prisma.blocker.create({
    data: {
      title,
      description,
      severity: severity || 'MEDIUM',
      objectiveId,
      userId: user.id
    },
    include: {
      user: true,
      objective: true
    }
  })

  return createSuccessResponse(blocker, 'Blocker reported successfully', 201)
}

async function checkBlockerAccess(user: any, request: NextRequest, context: any) {
  // For POST, we check assignment in the handler
  // For GET, we filter in the query
  return true
}

async function getBlockers(request: NextRequest, context: any, user: any) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const objectiveId = searchParams.get('objectiveId')

  const where: Record<string, unknown> = {}

  if (status) {
    where.status = status
  }

  if (objectiveId) {
    where.objectiveId = objectiveId
  }

  // If not admin, only show blockers from objectives they're assigned to
  if (user.role !== 'ADMIN') {
    where.objective = {
      assignments: {
        some: {
          userId: user.id
        }
      }
    }
  }

  const blockers = await prisma.blocker.findMany({
    where,
    include: {
      user: true,
      objective: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return createSuccessResponse(blockers, 'Blockers retrieved successfully')
}

export const POST = withCustomAuth(checkBlockerAccess)(createBlocker)
export const GET = withCustomAuth(checkBlockerAccess)(getBlockers)