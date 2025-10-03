import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-utils'
import { handleApiError, createSuccessResponse } from '@/lib/errors'
import { createObjectiveSchema, objectiveQuerySchema } from '@/lib/validations/objective'

export async function GET(request: NextRequest) {
  try {
    // Require admin access
    await requireAdmin()

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    const query = objectiveQuerySchema.parse(queryParams)

    // Build where clause
    const where: any = {}
    if (query.status) where.status = query.status
    if (query.priority) where.priority = query.priority
    if (query.search) {
      where.title = {
        contains: query.search,
        mode: 'insensitive'
      }
    }

    // Calculate pagination
    const skip = (query.page - 1) * query.pageSize
    const take = query.pageSize

    // Fetch objectives with optimized queries
    const [objectives, totalCount] = await Promise.all([
      prisma.objective.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          assignments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          _count: {
            select: {
              pulseChecks: true,
              blockers: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        },
        skip,
        take
      }),
      prisma.objective.count({ where })
    ])

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / query.pageSize)

    return createSuccessResponse({
      objectives,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total: totalCount,
        totalPages
      }
    }, 'Objectives retrieved successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require admin access
    const user = await requireAdmin()

    // Parse and validate request body
    const body = await request.json()
    const validatedData = createObjectiveSchema.parse(body)

    // Create objective with assignments in a transaction
    const objective = await prisma.$transaction(async (tx) => {
      const createdObjective = await tx.objective.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          priority: validatedData.priority,
          targetDate: validatedData.targetDate ? new Date(validatedData.targetDate) : null,
          userId: user.id,
          assignments: {
            create: validatedData.assignedUsers.map((userId) => ({
              userId,
              assignedBy: user.id
            }))
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          assignments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      })

      return createdObjective
    })

    return createSuccessResponse(objective, 'Objective created successfully', 201)
  } catch (error) {
    return handleApiError(error)
  }
}
