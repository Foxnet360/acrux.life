import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ApiResponse, HealthMetrics } from '@/lib/types'

export async function GET(_request: NextRequest) { // eslint-disable-line @typescript-eslint/no-unused-vars
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

    const isAdmin = session.user.role === 'ADMIN'

    let objectives
    let totalObjectives
    let completedObjectives
    let blockedObjectives
    let averageHealthScore

    if (isAdmin) {
      // Admin sees all objectives
      objectives = await prisma.objective.findMany({
        include: {
          assignments: true,
          pulseRequests: {
            include: {
              responses: true
            }
          }
        }
      })

      totalObjectives = objectives.length
      completedObjectives = objectives.filter(obj => obj.status === 'COMPLETED').length
      blockedObjectives = objectives.filter(obj => obj.status === 'PAUSED').length

      if (objectives.length > 0) {
        const totalHealthScore = objectives.reduce((sum, obj) => sum + obj.healthScore, 0)
        averageHealthScore = Math.round(totalHealthScore / objectives.length)
      } else {
        averageHealthScore = 100
      }
    } else {
      // Member sees only assigned objectives
      objectives = await prisma.objective.findMany({
        where: {
          assignments: {
            some: {
              userId: session.user.id
            }
          }
        },
        include: {
          assignments: true,
          pulseRequests: {
            include: {
              responses: true
            }
          }
        }
      })

      totalObjectives = objectives.length
      completedObjectives = objectives.filter(obj => obj.status === 'COMPLETED').length
      blockedObjectives = objectives.filter(obj => obj.status === 'PAUSED').length

      if (objectives.length > 0) {
        const totalHealthScore = objectives.reduce((sum, obj) => sum + obj.healthScore, 0)
        averageHealthScore = Math.round(totalHealthScore / objectives.length)
      } else {
        averageHealthScore = 100
      }
    }

    // Calculate active pulse requests
    const activePulseRequests = await prisma.pulseRequest.count({
      where: {
        objective: isAdmin ? {} : {
          assignments: {
            some: {
              userId: session.user.id
            }
          }
        },
        dueDate: {
          gt: new Date()
        }
      }
    })

    const metrics: HealthMetrics = {
      averageScore: averageHealthScore,
      totalObjectives,
      completedObjectives,
      blockedObjectives,
      activePulseRequests
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Dashboard metrics retrieved successfully',
        data: metrics
      } as ApiResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('Get dashboard metrics error:', error)
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