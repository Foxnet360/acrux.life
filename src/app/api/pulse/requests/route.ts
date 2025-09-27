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

    // Only admins can send pulse requests
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        {
          success: false,
          message: 'Forbidden',
          data: null
        } as ApiResponse,
        { status: 403 }
      )
    }

    const { objectiveId, question, expiresAt } = await request.json()

    // Validation
    if (!objectiveId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Objective ID is required',
          data: null
        } as ApiResponse,
        { status: 400 }
      )
    }

    // Check if objective exists
    const objective = await prisma.objective.findUnique({
      where: { id: objectiveId },
      include: { assignments: true }
    })

    if (!objective) {
      return NextResponse.json(
        {
          success: false,
          message: 'Objective not found',
          data: null
        } as ApiResponse,
        { status: 404 }
      )
    }

    // Create pulse request
    const pulseRequest = await prisma.pulseRequest.create({
      data: {
        objectiveId,
        question: question || 'How are you feeling about this objective?',
        expiresAt: expiresAt ? new Date(expiresAt) : null
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

    return NextResponse.json(
      {
        success: true,
        message: 'Pulse request sent successfully',
        data: pulseRequest
      } as ApiResponse,
      { status: 201 }
    )
  } catch (error) {
    console.error('Send pulse request error:', error)
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

export async function GET(request: NextRequest) {
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

    // Only admins can view all pulse requests
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        {
          success: false,
          message: 'Forbidden',
          data: null
        } as ApiResponse,
        { status: 403 }
      )
    }

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

    return NextResponse.json(
      {
        success: true,
        message: 'Pulse requests retrieved successfully',
        data: pulseRequests
      } as ApiResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('Get pulse requests error:', error)
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