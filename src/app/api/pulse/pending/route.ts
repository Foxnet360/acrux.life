import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/types'

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

    // Get pending pulse requests for the user
    const pendingRequests = await prisma.pulseRequest.findMany({
      where: {
        objective: {
          assignments: {
            some: {
              userId: session.user.id
            }
          }
        },
        // Not expired
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ],
        // User hasn't responded yet
        responses: {
          none: {
            userId: session.user.id
          }
        }
      },
      include: {
        objective: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Pending pulse requests retrieved successfully',
        data: pendingRequests
      } as ApiResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('Get pending pulse requests error:', error)
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