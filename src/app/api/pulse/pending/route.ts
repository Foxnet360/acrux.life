import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSuccessResponse } from '@/lib/errors'
import { withAuth } from '@/lib/api-middleware'

async function getPendingPulseRequests(_request: NextRequest, _context: any, user: any) {
  // Get pending pulse requests for the user
  const pendingRequests = await prisma.pulseRequest.findMany({
    where: {
      objective: {
        assignments: {
          some: {
            userId: user.id
          }
        }
      },
      // Not expired
      OR: [
        { dueDate: null },
        { dueDate: { gt: new Date() } }
      ],
      // User hasn't responded yet
      responses: {
        none: {
          userId: user.id
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

  return createSuccessResponse(pendingRequests, 'Pending pulse requests retrieved successfully')
}

export const GET = withAuth(getPendingPulseRequests)