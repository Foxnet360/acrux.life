import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSuccessResponse, ValidationError, NotFoundError } from '@/lib/errors'
import { withAdmin } from '@/lib/api-middleware'

async function createPulseRequest(request: NextRequest, context: any, user: any) {
  const { objectiveId, question, expiresAt } = await request.json()

  // Validation
  if (!objectiveId) {
    throw new ValidationError('Objective ID is required')
  }

  // Check if objective exists
  const objective = await prisma.objective.findUnique({
    where: { id: objectiveId },
    include: { assignments: true }
  })

  if (!objective) {
    throw new NotFoundError('Objective')
  }

  // Create pulse request
  const pulseRequest = await prisma.pulseRequest.create({
    data: {
      objectiveId,
      title: 'Pulse Check',
      message: question || 'How are you feeling about this objective?',
      dueDate: expiresAt ? new Date(expiresAt) : null,
      adminId: user.id,
      memberId: user.id // For now, set to same user
    },
    include: {
      objective: {
        include: {
          assignments: {
            include: {
              user: true
            }
          }
        }
      }
    }
  })

  // TODO: Send notifications to assigned users
  // For now, just return the pulse request

  return createSuccessResponse(pulseRequest, 'Pulse request sent successfully', 201)
}

async function getPulseRequests(_request: NextRequest, _context: any, _user: any) {
  const pulseRequests = await prisma.pulseRequest.findMany({
    include: {
      objective: true,
      responses: {
        include: {
          user: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return createSuccessResponse(pulseRequests, 'Pulse requests retrieved successfully')
}

export const POST = withAdmin(createPulseRequest)
export const GET = withAdmin(getPulseRequests)