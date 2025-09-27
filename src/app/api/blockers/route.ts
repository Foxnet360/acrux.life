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

    const { title, description, severity, objectiveId } = await request.json()

    // Validation
    if (!title || !objectiveId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title and objective ID are required',
          data: null
        } as ApiResponse,
        { status: 400 }
      )
    }

    // Check if objective exists and user is assigned
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

    const isAssigned = objective.assignments.some(
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

    // Create blocker
    const blocker = await prisma.blocker.create({
      data: {
        title,
        description,
        severity: severity || 'MEDIUM',
        objectiveId,
        reportedBy: session.user.id
      },
      include: {
        reporter: true,
        objective: true
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Blocker reported successfully',
        data: blocker
      } as ApiResponse,
      { status: 201 }
    )
  } catch (error) {
    console.error('Report blocker error:', error)
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const objectiveId = searchParams.get('objectiveId')

    let where: any = {}

    if (status) {
      where.status = status
    }

    if (objectiveId) {
      where.objectiveId = objectiveId
    }

    // If not admin, only show blockers from objectives they're assigned to
    if (session.user.role !== 'ADMIN') {
      where.objective = {
        assignments: {
          some: {
            userId: session.user.id
          }
        }
      }
    }

    const blockers = await prisma.blocker.findMany({
      where,
      include: {
        reporter: true,
        objective: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Blockers retrieved successfully',
        data: blockers
      } as ApiResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('Get blockers error:', error)
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