import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSuccessResponse } from '@/lib/errors'
import { withAuth } from '@/lib/api-middleware'
import { cache } from '@/lib/cache'

async function getMyObjectives(_request: NextRequest, _context: any, user: any) {
  const cacheKey = `my-objectives:${user.id}`

  // Check cache first
  const cachedObjectives = cache.get(cacheKey)
  if (cachedObjectives) {
    return createSuccessResponse(cachedObjectives, 'Objectives retrieved successfully (cached)')
  }

  const objectives = await prisma.objective.findMany({
    where: {
      assignments: {
        some: {
          userId: user.id
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

  // Cache for 5 minutes
  cache.set(cacheKey, objectives, 5 * 60 * 1000)

  return createSuccessResponse(objectives, 'Objectives retrieved successfully')
}

export const GET = withAuth(getMyObjectives)