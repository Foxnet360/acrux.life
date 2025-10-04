import { z } from 'zod'

/**
 * Validation schema for creating objectives
 */
export const createObjectiveSchema = z.object({
  title: z.string()
    .min(1, 'Objective title is required and cannot be empty')
    .max(200, 'Objective title must be less than 200 characters')
    .trim(),
  description: z.string()
    .max(1000, 'Objective description must be less than 1000 characters')
    .optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW'], {
    message: 'Priority must be HIGH, MEDIUM, or LOW'
  }).default('MEDIUM'),
  targetDate: z.string()
    .datetime('Target date must be a valid date')
    .optional()
    .nullable(),
  assignedUsers: z.array(z.string().cuid('Invalid user ID format'))
    .optional()
    .default([])
})

/**
 * Validation schema for updating objectives
 */
export const updateObjectiveSchema = z.object({
  title: z.string()
    .min(1, 'Objective title cannot be empty')
    .max(200, 'Objective title must be less than 200 characters')
    .trim()
    .optional(),
  description: z.string()
    .max(1000, 'Objective description must be less than 1000 characters')
    .optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW'], {
    message: 'Priority must be HIGH, MEDIUM, or LOW'
  }).optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'PAUSED'], {
    message: 'Status must be ACTIVE, COMPLETED, or PAUSED'
  }).optional(),
  targetDate: z.string()
    .datetime('Target date must be a valid date')
    .optional()
    .nullable(),
  assignedUsers: z.array(z.string().cuid('Invalid user ID format'))
    .optional()
})

/**
 * Validation schema for objective query parameters
 */
export const objectiveQuerySchema = z.object({
  page: z.string()
    .transform(val => parseInt(val))
    .refine(val => val > 0, 'Page number must be greater than 0')
    .optional()
    .default(1),
  pageSize: z.string()
    .transform(val => parseInt(val))
    .refine(val => val > 0 && val <= 100, 'Page size must be between 1 and 100')
    .optional()
    .default(20),
  status: z.enum(['ACTIVE', 'COMPLETED', 'PAUSED'], {
    message: 'Status filter must be ACTIVE, COMPLETED, or PAUSED'
  }).optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW'], {
    message: 'Priority filter must be HIGH, MEDIUM, or LOW'
  }).optional(),
  search: z.string()
    .max(100, 'Search query must be less than 100 characters')
    .optional()
})

export type CreateObjectiveInput = z.infer<typeof createObjectiveSchema>
export type UpdateObjectiveInput = z.infer<typeof updateObjectiveSchema>
export type ObjectiveQueryInput = z.infer<typeof objectiveQuerySchema>