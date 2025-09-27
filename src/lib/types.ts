// Database Types (generated from Prisma)
export type User = {
  id: string
  email: string
  name: string | null
  hashedPassword: string | null
  role: UserRole
  language: string
  createdAt: Date
  updatedAt: Date
}

export type Objective = {
  id: string
  title: string
  description: string | null
  priority: Priority
  status: Status
  healthScore: number
  progress: number
  targetDate: Date | null
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export type ObjectiveAssignment = {
  id: string
  objectiveId: string
  userId: string
  assignedAt: Date
}

export type PulseRequest = {
  id: string
  objectiveId: string
  question: string
  createdAt: Date
  expiresAt: Date | null
}

export type PulseResponse = {
  id: string
  pulseRequestId: string
  userId: string
  rating: number
  feedback: string | null
  createdAt: Date
}

export type Blocker = {
  id: string
  title: string
  description: string
  severity: BlockerSeverity
  status: BlockerStatus
  objectiveId: string
  reportedBy: string
  assignedTo: string | null
  createdAt: Date
  updatedAt: Date
  resolvedAt: Date | null
}

export type Metric = {
  id: string
  objectiveId: string
  name: string
  target: number
  current: number
  isCompleted: boolean
  createdAt: Date
  updatedAt: Date
}

// Enums
export type UserRole = 'ADMIN' | 'MEMBER'
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
export type Status = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED'
export type BlockerSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type BlockerStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message: string
  error?: string
}

// Form Types
export interface CreateObjectiveForm {
  title: string
  description: string
  priority: Priority
  targetDate: string
  assignedUsers: string[]
}

export interface PulseResponseForm {
  rating: number
  feedback: string
}

export interface BlockerForm {
  title: string
  description: string
  severity: BlockerSeverity
}

// Dashboard Types
export interface HealthMetrics {
  averageScore: number
  totalObjectives: number
  completedObjectives: number
  blockedObjectives: number
  activePulseRequests: number
}

export interface ObjectiveSummary {
  id: string
  title: string
  status: Status
  healthScore: number
  progress: number
  assignedUsers: User[]
  targetDate: Date | null
}

// Component Props Types
export interface ObjectiveCardProps {
  objective: Objective & {
    assignments: (ObjectiveAssignment & { user: User })[]
    creator: User
  }
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onSendPulse?: (id: string) => void
  className?: string
}

export interface UserAvatarProps {
  user: User
  size?: 'small' | 'medium' | 'large'
  showTooltip?: boolean
}

// Multilingual Types
export type Language = 'en' | 'es'

export interface TranslationKeys {
  // Common
  common: {
    save: string
    cancel: string
    delete: string
    edit: string
    create: string
    loading: string
    error: string
    success: string
  }
  // Navigation
  nav: {
    dashboard: string
    objectives: string
    team: string
    profile: string
  }
  // Auth
  auth: {
    signIn: string
    signUp: string
    signOut: string
    email: string
    password: string
    confirmPassword: string
  }
  // Add more as needed
}