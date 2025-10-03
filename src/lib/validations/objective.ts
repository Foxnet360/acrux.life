import { z } from 'zod'

/**
 * Validation schema for creating objectives
 */
export const createObjectiveSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
  targetDate: z.string().datetime().optional().nullable(),
  assignedUsers: z.array(z.string().cuid()).optional().default([])
})

/**
 * Validation schema for updating objectives
 */
export const updateObjectiveSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'PAUSED']).optional(),
  targetDate: z.string().datetime().optional().nullable(),
  assignedUsers: z.array(z.string().cuid()).optional()
})

/**
 * Validation schema for objective query parameters
 */
export const objectiveQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val)).refine(val => val > 0, 'Page must be greater than 0').optional().default(1),
  pageSize: z.string().transform(val => parseInt(val)).refine(val => val > 0 && val <= 100, 'Page size must be between 1 and 100').optional().default(20),
  status: z.enum(['ACTIVE', 'COMPLETED', 'PAUSED']).optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
  search: z.string().max(100).optional()
})

export type CreateObjectiveInput = z.infer<typeof createObjectiveSchema>
export type UpdateObjectiveInput = z.infer<typeof updateObjectiveSchema>
export type ObjectiveQueryInput = z.infer<typeof objectiveQuerySchema>