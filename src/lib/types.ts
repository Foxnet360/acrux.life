// Database Types (generated from Prisma)
export type User = {
  id: string
  email: string | null
  name: string | null
  passwordHash: string
  firstName: string | null
  lastName: string | null
  role: UserRole
  organizationId: string | null
  isActive: boolean
  emailVerified: Date | null
  image: string | null
  createdAt: Date
  updatedAt: Date
}

export type Objective = {
  id: string
  title: string
  description: string | null
  progress: number
  healthScore: number
  status: Status
  targetDate: Date | null
  ownerId: string | null
  userId: string
  createdAt: Date
  updatedAt: Date
}

export type ObjectiveAssignment = {
  id: string
  role: string
  assignedAt: Date
  isActive: boolean
  userId: string
  objectiveId: string
  assignedBy: string
}

export type PulseRequest = {
  id: string
  title: string
  message: string | null
  dueDate: Date | null
  status: PulseRequestStatus
  adminId: string
  memberId: string
  objectiveId: string | null
  createdAt: Date
  completedAt: Date | null
}

export type PulseResponse = {
  id: string
  sentiment: number
  confidence: number
  feedback: string | null
  isAnonymous: boolean
  userId: string
  objectiveId: string
  createdAt: Date
}

export type Blocker = {
  id: string
  title: string
  description: string
  severity: BlockerSeverity
  status: BlockerStatus
  isAnonymous: boolean
  objectiveId: string
  createdAt: Date
  updatedAt: Date
}

export type Metric = {
  id: string
  name: string
  description: string | null
  currentValue: number
  targetValue: number
  unit: string
  objectiveId: string
  createdAt: Date
  updatedAt: Date
}

export type PulseCheck = {
  id: string
  sentiment: number
  confidence: number
  feedback: string | null
  isAnonymous: boolean
  userId: string
  objectiveId: string
  createdAt: Date
}

export type TeamMember = {
  id: string
  role: string
  joinedAt: Date
  isActive: boolean
  userId: string
  adminId: string
}

export type TeamInvitation = {
  id: string
  email: string
  role: string
  status: InvitationStatus
  token: string
  expiresAt: Date
  adminId: string
  acceptedBy: string | null
  createdAt: Date
  acceptedAt: Date | null
}

export type Activity = {
  id: string
  action: string
  metadata: any
  userId: string
  projectId: string | null
  createdAt: Date
}

export type Project = {
  id: string
  name: string
  description: string | null
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

export type ProjectMember = {
  id: string
  projectId: string
  userId: string
  role: ProjectRole
  joinedAt: Date
}

export type Dataset = {
  id: string
  name: string
  description: string | null
  projectId: string
  fileKey: string
  fileSize: number
  fileType: string
  uploadedBy: string
  createdAt: Date
  updatedAt: Date
}

export type Tag = {
  id: string
  name: string
  color: string | null
  createdAt: Date
}

export type DatasetTag = {
  id: string
  datasetId: string
  tagId: string
}

export type Comment = {
  id: string
  content: string
  datasetId: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export type VerificationToken = {
  identifier: string
  token: string
  expires: Date
}

// Enums
export type UserRole = 'ADMIN' | 'RESEARCHER' | 'ANALYST' | 'VIEWER'
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
export type Status = 'ACTIVE' | 'COMPLETED' | 'PAUSED'
export type BlockerSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type BlockerStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'
export type ProjectRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER'
export type PulseRequestStatus = 'PENDING' | 'COMPLETED' | 'EXPIRED'
export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED'

// API Response Types
export interface ApiResponse<T = unknown> {
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