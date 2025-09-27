import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
          data: null
        } as ApiResponse,
        { status: 401 }
      )
    }

    const { pulseRequestId, rating, feedback } = await request.json()

    // Validation
    if (!pulseRequestId || rating === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: 'Pulse request ID and rating are required',
          data: null
        } as ApiResponse,
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          message: 'Rating must be between 1 and 5',
          data: null
        } as ApiResponse,
        { status: 400 }
      )
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
      return NextResponse.json(
        {
          success: false,
          message: 'Pulse request not found',
          data: null
        } as ApiResponse,
        { status: 404 }
      )
    }

    // Check if user is assigned to the objective
    const isAssigned = pulseRequest.objective.assignments.some(
      assignment => assignment.userId === session.user.id
    )

    if (!isAssigned) {
      return NextResponse.json(
        {
          success: false,
          message: 'You are not assigned to this objective',
          data: null
        } as ApiResponse,
        { status: 403 }
      )
    }

    // Check if user already responded
    const existingResponse = await prisma.pulseResponse.findUnique({
      where: {
        pulseRequestId_userId: {
          pulseRequestId,
          userId: session.user.id
        }
      }
    })

    if (existingResponse) {
      // Update existing response
      const response = await prisma.pulseResponse.update({
        where: {
          pulseRequestId_userId: {
            pulseRequestId,
            userId: session.user.id
          }
        },
        data: {
          rating,
          feedback
        },
        include: {
          user: true,
          pulseRequest: true
        }
      })

      // Update objective health score
      await updateObjectiveHealthScore(pulseRequest.objectiveId)

      return NextResponse.json(
        {
          success: true,
          message: 'Pulse response updated successfully',
          data: response
        } as ApiResponse,
        { status: 200 }
      )
    } else {
      // Create new response
      const response = await prisma.pulseResponse.create({
        data: {
          pulseRequestId,
          userId: session.user.id,
          rating,
          feedback
        },
        include: {
          user: true,
          pulseRequest: true
        }
      })

      // Update objective health score
      await updateObjectiveHealthScore(pulseRequest.objectiveId)

      return NextResponse.json(
        {
          success: true,
          message: 'Pulse response submitted successfully',
          data: response
        } as ApiResponse,
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('Submit pulse response error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        data: null
      } as ApiResponse,
      { status: 500 }
    )
  }
}

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

    // Calculate average rating
    const totalRating = pulseResponses.reduce((sum, response) => sum + response.rating, 0)
    const averageRating = totalRating / pulseResponses.length

    // Convert to health score (0-100)
    const healthScore = Math.round(((averageRating - 1) / 4) * 100)

    // Update objective
    await prisma.objective.update({
      where: { id: objectiveId },
      data: { healthScore }
    })
  } catch (error) {
    console.error('Update health score error:', error)
  }
}