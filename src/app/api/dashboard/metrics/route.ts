import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSuccessResponse } from '@/lib/errors'
import { withAuth } from '@/lib/api-middleware'
import { calculateTotalObjectives, calculateCompletedObjectives, calculateBlockedObjectives, calculateAverageHealthScore } from '@/lib/metrics'
import { cache } from '@/lib/cache'

async function getDashboardMetrics(_request: NextRequest, _context: any, user: any) {
  const cacheKey = `dashboard-metrics:${user.id}`

  // Check cache first
  const cachedMetrics = cache.get(cacheKey)
  if (cachedMetrics) {
    return createSuccessResponse(cachedMetrics, 'Dashboard metrics retrieved successfully (cached)')
  }

  const isAdmin = user.role === 'ADMIN'

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

    totalObjectives = calculateTotalObjectives(objectives)
    completedObjectives = calculateCompletedObjectives(objectives)
    blockedObjectives = calculateBlockedObjectives(objectives)
    averageHealthScore = calculateAverageHealthScore(objectives)
  } else {
    // Member sees only assigned objectives
    objectives = await prisma.objective.findMany({
      where: {
        assignments: {
          some: {
            userId: user.id
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

    totalObjectives = calculateTotalObjectives(objectives)
    completedObjectives = calculateCompletedObjectives(objectives)
    blockedObjectives = calculateBlockedObjectives(objectives)
    averageHealthScore = calculateAverageHealthScore(objectives)
  }

  // Calculate active pulse requests
  const activePulseRequests = await prisma.pulseRequest.count({
    where: {
      objective: isAdmin ? {} : {
        assignments: {
          some: {
            userId: user.id
          }
        }
      },
      dueDate: {
        gt: new Date()
      }
    }
  })

  const metrics = {
    averageScore: averageHealthScore,
    totalObjectives,
    completedObjectives,
    blockedObjectives,
    activePulseRequests
  }

  // Cache for 5 minutes
  cache.set(cacheKey, metrics, 5 * 60 * 1000)

  return createSuccessResponse(metrics, 'Dashboard metrics retrieved successfully')
}

export const GET = withAuth(getDashboardMetrics)