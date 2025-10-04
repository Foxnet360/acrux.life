import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/types'

export async function GET(_request: NextRequest) { // eslint-disable-line @typescript-eslint/no-unused-vars
  try {
    console.log('Getting session')
    const session = await getServerSession(authOptions)
    console.log('Session:', session)

    if (!session?.user?.id) {
      console.log('No session user id')
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
          data: null
        } as ApiResponse,
        { status: 401 }
      )
    }

    const objectives = await prisma.objective.findMany({
      where: {
        assignments: {
          some: {
            userId: session.user.id
          }
        }
      },
      include: {
        user: true,
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
    console.error('Get my objectives error:', error)
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