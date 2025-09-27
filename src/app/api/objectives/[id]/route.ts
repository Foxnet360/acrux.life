import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const objective = await prisma.objective.findUnique({
      where: { id: params.id },
      include: {
        creator: true,
        assignments: {
          include: {
            user: true
          }
        }
      }
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

    // Check if user has access (admin or assigned)
    const isAdmin = session.user.role === 'ADMIN'
    const isAssigned = objective.assignments.some(a => a.userId === session.user.id)
    const isCreator = objective.createdBy === session.user.id

    if (!isAdmin && !isAssigned && !isCreator) {
      return NextResponse.json(
        {
          success: false,
          message: 'Forbidden',
          data: null
        } as ApiResponse,
        { status: 403 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Objective retrieved successfully',
        data: objective
      } as ApiResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('Get objective error:', error)
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { title, description, priority, status, progress, targetDate, assignedUsers } = await request.json()

    // Check if objective exists and user has permission
    const existingObjective = await prisma.objective.findUnique({
      where: { id: params.id },
      include: { assignments: true }
    })

    if (!existingObjective) {
      return NextResponse.json(
        {
          success: false,
          message: 'Objective not found',
          data: null
        } as ApiResponse,
        { status: 404 }
      )
    }

    const isAdmin = session.user.role === 'ADMIN'
    const isCreator = existingObjective.createdBy === session.user.id

    if (!isAdmin && !isCreator) {
      return NextResponse.json(
        {
          success: false,
          message: 'Forbidden',
          data: null
        } as ApiResponse,
        { status: 403 }
      )
    }

    // Update objective
    const objective = await prisma.objective.update({
      where: { id: params.id },
      data: {
        title,
        description,
        priority,
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
        message: 'Objective updated successfully',
        data: objective
      } as ApiResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('Update objective error:', error)
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Only admins can delete objectives
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

    // Check if objective exists
    const existingObjective = await prisma.objective.findUnique({
      where: { id: params.id }
    })

    if (!existingObjective) {
      return NextResponse.json(
        {
          success: false,
          message: 'Objective not found',
          data: null
        } as ApiResponse,
        { status: 404 }
      )
    }

    // Delete objective (cascade will handle assignments)
    await prisma.objective.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Objective deleted successfully',
        data: null
      } as ApiResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete objective error:', error)
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