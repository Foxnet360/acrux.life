import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSuccessResponse, ValidationError, NotFoundError, AuthorizationError } from '@/lib/errors'
import { withCustomAuth } from '@/lib/api-middleware'

async function submitPulseResponse(request: NextRequest, context: any, user: any) {
  const { pulseRequestId, rating, feedback } = await request.json()

  // Validation
  if (!pulseRequestId || rating === undefined) {
    throw new ValidationError('Pulse request ID and rating are required')
  }

  if (rating < 1 || rating > 5) {
    throw new ValidationError('Rating must be between 1 and 5')
  }

  // Check if pulse request exists and user is assigned to the objective
  const pulseRequest = await prisma.pulseRequest.findUnique({
    where: { id: pulseRequestId },
    include: {
      objective: {
        include: {
          assignments: true
        }
      }
    }
  })

  if (!pulseRequest) {
    throw new NotFoundError('Pulse request')
  }

  if (!pulseRequest.objective) {
    throw new NotFoundError('Objective')
  }

  // Check if user is assigned to the objective
  const isAssigned = pulseRequest.objective.assignments.some(
    assignment => assignment.userId === user.id
  )

  if (!isAssigned) {
    throw new AuthorizationError('You are not assigned to this objective')
  }

  // Check if user already responded
  const existingResponse = await prisma.pulseResponse.findFirst({
    where: {
      pulseRequestId,
      userId: user.id
    }
  })

  if (existingResponse) {
    // Update existing response
    await prisma.pulseResponse.updateMany({
      where: {
        pulseRequestId,
        userId: user.id
      },
      data: {
        sentiment: rating,
        confidence: 5, // Default confidence
        feedback
      }
    })

    // Get the updated response
    const updatedResponse = await prisma.pulseResponse.findFirst({
      where: {
        pulseRequestId,
        userId: user.id
      },
      include: {
        user: true,
        pulseRequest: true
      }
    })

    // Update objective health score
    await updateObjectiveHealthScore(pulseRequest.objectiveId!)

    return createSuccessResponse(updatedResponse, 'Pulse response updated successfully')
  } else {
    // Create new response
    const response = await prisma.pulseResponse.create({
      data: {
        pulseRequestId,
        userId: user.id,
        sentiment: rating,
        confidence: 5, // Default confidence
        feedback,
        objectiveId: pulseRequest.objectiveId!
      },
      include: {
        user: true,
        pulseRequest: true
      }
    })

    // Update objective health score
    await updateObjectiveHealthScore(pulseRequest.objectiveId!)

    return createSuccessResponse(response, 'Pulse response submitted successfully', 201)
  }
}

async function checkPulseResponseAccess(user: any, request: NextRequest, context: any) {
  // Access check is done in the handler
  return true
}

export const POST = withCustomAuth(checkPulseResponseAccess)(submitPulseResponse)

async function updateObjectiveHealthScore(objectiveId: string) {
  try {
    // Get all pulse responses for the objective
    const pulseResponses = await prisma.pulseResponse.findMany({
      where: {
        pulseRequest: {
          objectiveId
        }
      }
    })

    if (pulseResponses.length === 0) {
      // No responses, keep default health score
      return
    }

    // Calculate average sentiment
    const totalSentiment = pulseResponses.reduce((sum, response) => sum + response.sentiment, 0)
    const averageSentiment = totalSentiment / pulseResponses.length

    // Convert to health score (0-100)
    const healthScore = Math.round(((averageSentiment - 1) / 4) * 100)

    // Update objective
    await prisma.objective.update({
      where: { id: objectiveId },
      data: { healthScore }
    })
  } catch (error) {
    console.error('Update health score error:', error)
  }
}