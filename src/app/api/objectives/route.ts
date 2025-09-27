import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/types'

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

    // Only admins can see all objectives
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

    const objectives = await prisma.objective.findMany({
      include: {
        creator: true,
        assignments: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Objectives retrieved successfully',
        data: objectives
      } as ApiResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('Get objectives error:', error)
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

    // Only admins can create objectives
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

    const { title, description, priority, targetDate, assignedUsers } = await request.json()

    // Validation
    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title is required',
          data: null
        } as ApiResponse,
        { status: 400 }
      )
    }

    // Create objective
    const objective = await prisma.objective.create({
      data: {
        title,
        description,
        priority: priority || 'MEDIUM',
        targetDate: targetDate ? new Date(targetDate) : null,
        createdBy: session.user.id,
        assignments: {
          create: assignedUsers?.map((userId: string) => ({
            userId
          })) || []
        }
      },
      include: {
        creator: true,
        assignments: {
          include: {
            user: true
          }
        }
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Objective created successfully',
        data: objective
      } as ApiResponse,
      { status: 201 }
    )
  } catch (error) {
    console.error('Create objective error:', error)
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