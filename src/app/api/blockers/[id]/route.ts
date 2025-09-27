import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/types'

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

    const { status, assignedTo } = await request.json()

    // Check if blocker exists
    const existingBlocker = await prisma.blocker.findUnique({
      where: { id: params.id },
      include: { objective: true }
    })

    if (!existingBlocker) {
      return NextResponse.json(
        {
          success: false,
          message: 'Blocker not found',
          data: null
        } as ApiResponse,
        { status: 404 }
      )
    }

    // Only admins can update blockers
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

    // Update blocker
    const blocker = await prisma.blocker.update({
      where: { id: params.id },
      data: {
        status: status || existingBlocker.status,
        assignedTo: assignedTo || existingBlocker.assignedTo,
        resolvedAt: status === 'RESOLVED' ? new Date() : existingBlocker.resolvedAt
      },
      include: {
        reporter: true,
        objective: true
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Blocker updated successfully',
        data: blocker
      } as ApiResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('Update blocker error:', error)
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

    // Only admins can delete blockers
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

    // Check if blocker exists
    const existingBlocker = await prisma.blocker.findUnique({
      where: { id: params.id }
    })

    if (!existingBlocker) {
      return NextResponse.json(
        {
          success: false,
          message: 'Blocker not found',
          data: null
        } as ApiResponse,
        { status: 404 }
      )
    }

    // Delete blocker
    await prisma.blocker.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Blocker deleted successfully',
        data: null
      } as ApiResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete blocker error:', error)
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