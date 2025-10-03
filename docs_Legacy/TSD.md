# Technical Specification Document (TSD)
# Acrux MVP - Research Data Management Platform

**Version**: 1.0  
**Last Updated**: October 3, 2025  
**Document Owner**: Engineering Team  
**Status**: Active

---

## Table of Contents

1. [System Overview](#system-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Database Design](#database-design)
5. [API Specifications](#api-specifications)
6. [Authentication & Authorization](#authentication--authorization)
7. [File Storage System](#file-storage-system)
8. [Security Architecture](#security-architecture)
9. [Performance Requirements](#performance-requirements)
10. [Deployment Architecture](#deployment-architecture)
11. [Monitoring & Logging](#monitoring--logging)
12. [Error Handling](#error-handling)
13. [Testing Strategy](#testing-strategy)

---

## System Overview

### Purpose

Acrux MVP is a Next.js-based web application designed to provide researchers with a centralized platform for managing, organizing, and collaborating on research data. The system handles file uploads, metadata management, search functionality, user authentication, and team collaboration features.

### Scope

This technical specification covers:
- Frontend application architecture (Next.js, React)
- Backend API design (Next.js API routes)
- Database schema (PostgreSQL with Prisma ORM)
- File storage system (AWS S3 or compatible)
- Authentication system (NextAuth.js)
- Security measures and data protection
- Performance optimization strategies

### Key Technical Requirements

- **Scalability**: Support 1000+ concurrent users
- **Performance**: Page load times < 3 seconds
- **Availability**: 99.9% uptime SLA
- **Security**: End-to-end encryption for sensitive data
- **Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │    Mobile    │  │     API      │      │
│  │   (React)    │  │  (Responsive)│  │   Clients    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Next.js Application                    │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │    │
│  │  │  Pages   │  │  API     │  │   Middleware     │ │    │
│  │  │  (SSR)   │  │  Routes  │  │   (Auth, CORS)   │ │    │
│  │  └──────────┘  └──────────┘  └──────────────────┘ │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
┌───────────────────────────┐  ┌──────────────────────────┐
│     Data Layer            │  │    Storage Layer         │
│  ┌──────────────────┐    │  │  ┌──────────────────┐   │
│  │   PostgreSQL     │    │  │  │   AWS S3 /       │   │
│  │   Database       │    │  │  │   Cloud Storage  │   │
│  │   (Prisma ORM)   │    │  │  │   (Files/Media)  │   │
│  └──────────────────┘    │  │  └──────────────────┘   │
└───────────────────────────┘  └──────────────────────────┘
                │                          │
                └──────────┬───────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Email      │  │  Analytics   │  │   Monitoring │      │
│  │   Service    │  │  (Optional)  │  │   (Logs)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

#### Frontend Components

```
app/
├── (dashboard)/           # Dashboard routes
│   ├── page.tsx          # Main dashboard
│   └── layout.tsx        # Dashboard layout
├── projects/             # Project management
│   ├── [id]/            # Individual project pages
│   │   ├── page.tsx
│   │   ├── settings/
│   │   └── data/
│   └── new/             # Create new project
├── datasets/            # Dataset views
├── search/              # Search interface
└── settings/            # User settings

components/
├── ui/                  # Reusable UI components (shadcn/ui)
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   └── ...
├── layout/              # Layout components
│   ├── header.tsx
│   ├── sidebar.tsx
│   └── footer.tsx
├── features/            # Feature-specific components
│   ├── file-upload/
│   ├── data-preview/
│   ├── visualization/
│   └── collaboration/
└── shared/              # Shared components
    ├── loading.tsx
    ├── error-boundary.tsx
    └── pagination.tsx
```

#### Backend API Structure

```
app/api/
├── auth/
│   └── [...nextauth]/
│       └── route.ts           # NextAuth configuration
├── projects/
│   ├── route.ts               # GET all, POST new project
│   ├── [id]/
│   │   ├── route.ts          # GET, PATCH, DELETE project
│   │   ├── datasets/
│   │   │   └── route.ts      # Manage datasets
│   │   ├── members/
│   │   │   └── route.ts      # Manage collaborators
│   │   └── activity/
│   │       └── route.ts      # Activity feed
├── datasets/
│   ├── route.ts               # GET all, POST new dataset
│   ├── [id]/
│   │   ├── route.ts          # GET, PATCH, DELETE dataset
│   │   ├── download/
│   │   │   └── route.ts      # Download file
│   │   ├── preview/
│   │   │   └── route.ts      # File preview
│   │   └── comments/
│   │       └── route.ts      # Dataset comments
├── upload/
│   └── route.ts               # File upload handler
├── search/
│   └── route.ts               # Search API
└── users/
    ├── profile/
    │   └── route.ts           # User profile
    └── settings/
        └── route.ts           # User settings
```

### Data Flow Architecture

#### File Upload Flow

```
1. User selects files in browser
   │
   ▼
2. Client validates files (type, size)
   │
   ▼
3. POST /api/upload with FormData
   │
   ▼
4. Server receives and validates
   │
   ▼
5. Generate unique file key
   │
   ▼
6. Upload to S3/Cloud Storage
   │
   ▼
7. Create database record (Prisma)
   │
   ▼
8. Return metadata to client
   │
   ▼
9. Update UI with success
```

#### Authentication Flow

```
1. User enters credentials
   │
   ▼
2. POST /api/auth/signin
   │
   ▼
3. NextAuth validates credentials
   │
   ▼
4. Query database for user
   │
   ▼
5. Verify password (bcrypt)
   │
   ▼
6. Generate JWT session token
   │
   ▼
7. Set secure HTTP-only cookie
   │
   ▼
8. Return session data
   │
   ▼
9. Redirect to dashboard
```

---

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2.x | React framework with SSR and API routes |
| **React** | 18.2.x | UI component library |
| **TypeScript** | 5.2.x | Type-safe JavaScript |
| **Tailwind CSS** | 3.3.x | Utility-first CSS framework |
| **shadcn/ui** | Latest | Pre-built React components |
| **Radix UI** | Latest | Headless UI primitives |
| **React Hook Form** | 7.x | Form state management |
| **Zod** | 3.x | Schema validation |
| **TanStack Query** | 5.x | Data fetching and caching |
| **Zustand** | 5.x | State management |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | JavaScript runtime |
| **Next.js API Routes** | 14.2.x | Serverless API endpoints |
| **NextAuth.js** | 4.24.x | Authentication solution |
| **Prisma** | 6.7.x | Database ORM |
| **PostgreSQL** | 15.x | Relational database |
| **AWS SDK** | 3.x | S3 file storage integration |
| **bcryptjs** | 2.4.x | Password hashing |
| **jsonwebtoken** | 9.x | JWT token generation |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Yarn** | Package manager |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **TypeScript** | Static type checking |
| **Git** | Version control |

### Cloud Services

| Service | Purpose |
|---------|---------|
| **AWS S3** | File storage |
| **PostgreSQL (Cloud)** | Database hosting |
| **Vercel / AWS** | Application hosting |
| **CloudFront (optional)** | CDN for static assets |

---

## Database Design

### Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    User      │         │   Project    │         │   Dataset    │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │         │ id (PK)      │         │ id (PK)      │
│ email        │◄───────┐│ name         │◄───────┐│ name         │
│ name         │        ││ description  │        ││ description  │
│ passwordHash │        ││ ownerId (FK) │        ││ projectId(FK)│
│ role         │        │└──────────────┘        ││ fileKey      │
│ createdAt    │        │        │               ││ fileSize     │
│ updatedAt    │        │        │               ││ fileType     │
└──────────────┘        │        │               ││ uploadedBy   │
                        │        │               ││ createdAt    │
┌──────────────┐        │        │               │└──────────────┘
│ProjectMember │        │        │               │       │
├──────────────┤        │        │               │       │
│ id (PK)      │        │        │               │       │
│ projectId(FK)├────────┘        │               │       │
│ userId (FK)  ├─────────────────┘               │       │
│ role         │                                 │       │
│ joinedAt     │                                 │       │
└──────────────┘                                 │       │
                                                 │       │
┌──────────────┐                                 │       │
│   Comment    │                                 │       │
├──────────────┤                                 │       │
│ id (PK)      │                                 │       │
│ datasetId(FK)├─────────────────────────────────┘       │
│ userId (FK)  │                                         │
│ content      │                                         │
│ createdAt    │                                         │
│ updatedAt    │                                         │
└──────────────┘                                         │
                                                         │
┌──────────────┐                                         │
│     Tag      │                                         │
├──────────────┤                                         │
│ id (PK)      │         ┌──────────────┐               │
│ name         │◄────────┤ DatasetTag   │               │
│ color        │         ├──────────────┤               │
│ createdAt    │         │ datasetId(FK)├───────────────┘
└──────────────┘         │ tagId (FK)   │
                         └──────────────┘

┌──────────────┐         
│  Activity    │         
├──────────────┤         
│ id (PK)      │         
│ userId (FK)  │         
│ projectId(FK)│         
│ action       │         
│ metadata     │         
│ createdAt    │         
└──────────────┘         
```

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  passwordHash  String
  role          UserRole  @default(RESEARCHER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  ownedProjects   Project[]
  projectMemberships ProjectMember[]
  comments        Comment[]
  activities      Activity[]
  datasets        Dataset[]

  @@map("users")
}

enum UserRole {
  ADMIN
  RESEARCHER
  ANALYST
  VIEWER
}

model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  ownerId     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  owner       User            @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  members     ProjectMember[]
  datasets    Dataset[]
  activities  Activity[]

  @@map("projects")
  @@index([ownerId])
}

model ProjectMember {
  id        String       @id @default(cuid())
  projectId String
  userId    String
  role      ProjectRole  @default(VIEWER)
  joinedAt  DateTime     @default(now())

  // Relations
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([projectId, userId])
  @@map("project_members")
  @@index([projectId])
  @@index([userId])
}

enum ProjectRole {
  OWNER
  ADMIN
  EDITOR
  VIEWER
}

model Dataset {
  id          String   @id @default(cuid())
  name        String
  description String?
  projectId   String
  fileKey     String   // S3 key or cloud storage path
  fileSize    Int
  fileType    String
  uploadedBy  String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  project     Project      @relation(fields: [projectId], references: [id], onDelete: Cascade)
  uploader    User         @relation(fields: [uploadedBy], references: [id])
  tags        DatasetTag[]
  comments    Comment[]

  @@map("datasets")
  @@index([projectId])
  @@index([uploadedBy])
}

model Tag {
  id        String   @id @default(cuid())
  name      String   @unique
  color     String?
  createdAt DateTime @default(now())

  // Relations
  datasets  DatasetTag[]

  @@map("tags")
}

model DatasetTag {
  id        String @id @default(cuid())
  datasetId String
  tagId     String

  // Relations
  dataset   Dataset @relation(fields: [datasetId], references: [id], onDelete: Cascade)
  tag       Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@unique([datasetId, tagId])
  @@map("dataset_tags")
  @@index([datasetId])
  @@index([tagId])
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  datasetId String
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  dataset   Dataset @relation(fields: [datasetId], references: [id], onDelete: Cascade)
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("comments")
  @@index([datasetId])
  @@index([userId])
}

model Activity {
  id        String   @id @default(cuid())
  action    String   // e.g., "created_project", "uploaded_dataset", "added_comment"
  metadata  Json?    // Additional context about the action
  userId    String
  projectId String?
  createdAt DateTime @default(now())

  // Relations
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  project   Project? @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@map("activities")
  @@index([userId])
  @@index([projectId])
  @@index([createdAt])
}
```

### Database Indexes

Key indexes for performance optimization:

1. **User Lookups**:
   - `users.email` (unique index)
   - `users.id` (primary key)

2. **Project Queries**:
   - `projects.ownerId` (foreign key index)
   - `projects.id` (primary key)

3. **Dataset Queries**:
   - `datasets.projectId` (foreign key index)
   - `datasets.uploadedBy` (foreign key index)
   - `datasets.createdAt` (for sorting)

4. **Activity Feed**:
   - `activities.projectId` (foreign key index)
   - `activities.createdAt` (for chronological sorting)
   - Composite index on `(projectId, createdAt)` for efficient feed queries

### Database Migrations

```bash
# Create migration
yarn prisma migrate dev --name migration_name

# Apply migrations in production
yarn prisma migrate deploy

# Generate Prisma Client
yarn prisma generate

# Seed database
yarn prisma db seed
```

---

## API Specifications

### REST API Design Principles

- **RESTful** resource-based URLs
- **JSON** request and response bodies
- **HTTP status codes** for success/error indication
- **Pagination** for list endpoints
- **Filtering and sorting** query parameters
- **Versioning** via URL path (future: /api/v2/)

### Authentication

All API routes (except public endpoints) require authentication via session cookies set by NextAuth.js.

### Common Response Format

```typescript
// Success Response
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { /* additional context */ }
  }
}

// Paginated Response
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### API Endpoints

#### Authentication

**POST /api/auth/signin**
```typescript
// Request
{
  "email": "user@example.com",
  "password": "securePassword123"
}

// Response (200)
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

**POST /api/auth/signup**
```typescript
// Request
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "name": "Jane Smith"
}

// Response (201)
{
  "success": true,
  "data": {
    "user": {
      "id": "user_456",
      "email": "newuser@example.com",
      "name": "Jane Smith"
    }
  }
}
```

#### Projects

**GET /api/projects**
```typescript
// Query Parameters
?page=1&pageSize=20&sort=createdAt&order=desc

// Response (200)
{
  "success": true,
  "data": [
    {
      "id": "project_1",
      "name": "Cancer Research Study",
      "description": "Longitudinal study...",
      "ownerId": "user_123",
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-02-20T15:30:00Z",
      "memberCount": 5,
      "datasetCount": 23
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 47,
    "totalPages": 3
  }
}
```

**POST /api/projects**
```typescript
// Request
{
  "name": "New Research Project",
  "description": "Description of the project"
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "project_789",
    "name": "New Research Project",
    "description": "Description of the project",
    "ownerId": "user_123",
    "createdAt": "2025-10-03T12:00:00Z"
  }
}
```

**GET /api/projects/[id]**
```typescript
// Response (200)
{
  "success": true,
  "data": {
    "id": "project_1",
    "name": "Cancer Research Study",
    "description": "Longitudinal study...",
    "owner": {
      "id": "user_123",
      "name": "Dr. Sarah Chen",
      "email": "sarah@university.edu"
    },
    "members": [
      {
        "id": "user_456",
        "name": "Alex Rodriguez",
        "role": "EDITOR"
      }
    ],
    "datasets": [ /* array of datasets */ ],
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-02-20T15:30:00Z"
  }
}
```

**PATCH /api/projects/[id]**
```typescript
// Request
{
  "name": "Updated Project Name",
  "description": "Updated description"
}

// Response (200)
{
  "success": true,
  "data": {
    "id": "project_1",
    "name": "Updated Project Name",
    "description": "Updated description",
    "updatedAt": "2025-10-03T12:30:00Z"
  }
}
```

**DELETE /api/projects/[id]**
```typescript
// Response (200)
{
  "success": true,
  "message": "Project deleted successfully"
}
```

#### Datasets

**GET /api/datasets**
```typescript
// Query Parameters
?projectId=project_1&page=1&pageSize=20

// Response (200)
{
  "success": true,
  "data": [
    {
      "id": "dataset_1",
      "name": "Patient Survey Data Q1 2025",
      "description": "Survey responses...",
      "projectId": "project_1",
      "fileKey": "uploads/1234567890-survey.csv",
      "fileSize": 2048576, // bytes
      "fileType": "text/csv",
      "uploadedBy": {
        "id": "user_456",
        "name": "Alex Rodriguez"
      },
      "tags": ["survey", "Q1", "patients"],
      "createdAt": "2025-03-01T09:00:00Z"
    }
  ],
  "pagination": { /* pagination info */ }
}
```

**POST /api/datasets**
```typescript
// Request (multipart/form-data)
FormData {
  "name": "Dataset Name",
  "description": "Dataset description",
  "projectId": "project_1",
  "file": File
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "dataset_new",
    "name": "Dataset Name",
    "fileKey": "uploads/1696356789-filename.csv",
    "fileSize": 1024000,
    "fileType": "text/csv",
    "createdAt": "2025-10-03T13:00:00Z"
  }
}
```

**GET /api/datasets/[id]/download**
```typescript
// Response (200)
// Returns signed S3 URL for download
{
  "success": true,
  "data": {
    "downloadUrl": "https://s3.amazonaws.com/bucket/path?signature=...",
    "expiresIn": 3600 // seconds
  }
}
```

**GET /api/datasets/[id]/preview**
```typescript
// Response (200)
// For CSV/Excel files
{
  "success": true,
  "data": {
    "columns": ["ID", "Name", "Age", "Location"],
    "rows": [
      ["1", "John Doe", "35", "New York"],
      ["2", "Jane Smith", "28", "Los Angeles"]
      // ... up to 1000 rows
    ],
    "totalRows": 5420,
    "previewRows": 1000
  }
}
```

#### File Upload

**POST /api/upload**
```typescript
// Request (multipart/form-data)
FormData {
  "file": File,
  "projectId": "project_1" // optional context
}

// Response (200)
{
  "success": true,
  "data": {
    "fileKey": "uploads/1696356789-myfile.pdf",
    "fileSize": 524288,
    "fileType": "application/pdf",
    "uploadedAt": "2025-10-03T14:00:00Z"
  }
}

// Error Response (400)
{
  "success": false,
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds maximum allowed (500MB)",
    "details": {
      "maxSize": 524288000,
      "actualSize": 600000000
    }
  }
}
```

#### Search

**GET /api/search**
```typescript
// Query Parameters
?q=patient+data&projectId=project_1&type=dataset&page=1

// Response (200)
{
  "success": true,
  "data": {
    "results": [
      {
        "type": "dataset",
        "id": "dataset_1",
        "name": "Patient Survey Data",
        "description": "Survey responses from patients...",
        "highlights": [
          "...responses from <mark>patient</mark>s in Q1 2025..."
        ],
        "score": 0.95,
        "projectId": "project_1"
      }
    ],
    "total": 15,
    "query": "patient data",
    "executionTime": 0.042 // seconds
  }
}
```

### Rate Limiting

```typescript
// Rate limit response (429)
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "limit": 100,
      "window": "1 hour",
      "retryAfter": 3600 // seconds
    }
  }
}
```

---

## Authentication & Authorization

### NextAuth.js Configuration

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.passwordHash) {
          throw new Error("Invalid credentials")
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isPasswordValid) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### Authorization Middleware

```typescript
// lib/auth.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "./db"

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    throw new Error("Unauthorized")
  }
  
  return session.user
}

export async function requireProjectAccess(
  projectId: string,
  requiredRole: "VIEWER" | "EDITOR" | "ADMIN" | "OWNER" = "VIEWER"
) {
  const user = await requireAuth()
  
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: {
        where: { userId: user.id }
      }
    }
  })
  
  if (!project) {
    throw new Error("Project not found")
  }
  
  // Owner always has access
  if (project.ownerId === user.id) {
    return { user, project }
  }
  
  // Check membership
  const membership = project.members[0]
  if (!membership) {
    throw new Error("Access denied")
  }
  
  // Check role hierarchy
  const roleHierarchy = {
    VIEWER: 0,
    EDITOR: 1,
    ADMIN: 2,
    OWNER: 3
  }
  
  if (roleHierarchy[membership.role] < roleHierarchy[requiredRole]) {
    throw new Error("Insufficient permissions")
  }
  
  return { user, project, role: membership.role }
}
```

### Password Security

```typescript
// lib/password.ts
import bcrypt from "bcryptjs"

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Password requirements
export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters")
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number")
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}
```

---

## File Storage System

### AWS S3 Configuration

```typescript
// lib/aws-config.ts
import { S3Client } from "@aws-sdk/client-s3"

export function getBucketConfig() {
  return {
    bucketName: process.env.AWS_BUCKET_NAME!,
    folderPrefix: process.env.AWS_FOLDER_PREFIX || ""
  }
}

export function createS3Client() {
  return new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
  })
}
```

### File Operations

```typescript
// lib/s3.ts
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { createS3Client, getBucketConfig } from "./aws-config"

const s3Client = createS3Client()
const { bucketName, folderPrefix } = getBucketConfig()

export async function uploadFile(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const key = `${folderPrefix}uploads/${Date.now()}-${fileName}`
  
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: mimeType
  })
  
  await s3Client.send(command)
  return key
}

export async function getDownloadUrl(
  fileKey: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileKey
  })
  
  return getSignedUrl(s3Client, command, { expiresIn })
}

export async function deleteFile(fileKey: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: fileKey
  })
  
  await s3Client.send(command)
}
```

### File Upload API Route

```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { uploadFile } from "@/lib/s3"

const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif',
  'application/pdf',
  'text/csv', 'text/plain',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    
    const formData = await req.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      )
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          success: false, 
          error: "File size exceeds maximum allowed (500MB)" 
        },
        { status: 400 }
      )
    }
    
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "File type not allowed" 
        },
        { status: 400 }
      )
    }
    
    // Convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Upload to S3
    const fileKey = await uploadFile(buffer, file.name, file.type)
    
    return NextResponse.json({
      success: true,
      data: {
        fileKey,
        fileSize: file.size,
        fileType: file.type,
        uploadedAt: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    )
  }
}
```

---

## Security Architecture

### Security Measures

1. **Authentication**:
   - JWT-based session management
   - Secure HTTP-only cookies
   - Password hashing with bcrypt (10 rounds)
   - Session expiration (30 days)

2. **Authorization**:
   - Role-based access control (RBAC)
   - Project-level permissions
   - API route protection middleware

3. **Data Protection**:
   - HTTPS encryption in transit
   - Database encryption at rest
   - S3 bucket encryption
   - No sensitive data in logs

4. **Input Validation**:
   - Zod schema validation
   - File type whitelisting
   - File size limits
   - SQL injection prevention (Prisma ORM)
   - XSS protection (React escaping)

5. **API Security**:
   - CORS configuration
   - Rate limiting (future)
   - Request size limits
   - CSRF protection

### Environment Variables

```bash
# .env.local
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# AWS S3
AWS_BUCKET_NAME="acrux-storage"
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_FOLDER_PREFIX="production/"

# Optional
NEXT_PUBLIC_APP_URL="https://acrux.app"
```

### Security Headers

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
```

---

## Performance Requirements

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Page Load Time** | < 3 seconds | Largest Contentful Paint (LCP) |
| **Time to Interactive** | < 5 seconds | First Input Delay (FID) |
| **API Response Time** | < 500ms | Server-side processing |
| **Search Response** | < 2 seconds | Full-text search results |
| **File Upload** | 10MB/sec | Upload throughput |

### Optimization Strategies

1. **Frontend Optimization**:
   - Code splitting with Next.js
   - Image optimization (next/image)
   - Lazy loading components
   - Caching with TanStack Query
   - Debounced search inputs

2. **Backend Optimization**:
   - Database query optimization
   - Connection pooling
   - Caching (Redis - future)
   - Efficient Prisma queries
   - Pagination for large datasets

3. **Asset Optimization**:
   - CDN for static assets
   - Image compression
   - Minified CSS/JS bundles
   - Gzip compression

4. **Database Optimization**:
   - Proper indexing
   - Query result limiting
   - Eager/lazy loading relations
   - Database connection pooling

---

## Deployment Architecture

### Production Deployment

```
                    ┌────────────────┐
                    │   CloudFlare   │
                    │   or CDN       │
                    └────────┬───────┘
                             │
                    ┌────────▼───────┐
                    │  Load Balancer │
                    └────────┬───────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         ┌────▼─────┐   ┌───▼──────┐  ┌───▼──────┐
         │ Next.js  │   │ Next.js  │  │ Next.js  │
         │ Instance │   │ Instance │  │ Instance │
         └────┬─────┘   └───┬──────┘  └───┬──────┘
              │             │             │
              └──────────┬──┴─────────────┘
                         │
              ┌──────────▼───────────┐
              │   PostgreSQL RDS     │
              │   (Primary/Replica)  │
              └──────────────────────┘
                         
              ┌──────────────────────┐
              │      AWS S3          │
              │   (File Storage)     │
              └──────────────────────┘
```

### Environment Configuration

**Development**:
- Local PostgreSQL database
- Local file storage or S3
- Hot module reloading
- Source maps enabled

**Staging**:
- Cloud-hosted database
- S3 file storage
- Production-like configuration
- Testing environment

**Production**:
- Multi-instance deployment
- Database replication
- S3 with CloudFront CDN
- Monitoring and alerting
- Automated backups

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: yarn install
      - name: Run linter
        run: yarn lint
      - name: Run type check
        run: yarn tsc --noEmit
      - name: Run tests
        run: yarn test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## Monitoring & Logging

### Application Monitoring

**Metrics to Track**:
- Request rate and latency
- Error rate and types
- Database query performance
- File upload success rate
- User session duration
- API endpoint usage

**Tools**:
- Application logs (Winston/Pino)
- Error tracking (Sentry - future)
- Performance monitoring (Vercel Analytics)
- Uptime monitoring (Pingdom/UptimeRobot)

### Logging Strategy

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta)
  },
  error: (message: string, error?: Error, meta?: any) => {
    console.error(
      `[ERROR] ${new Date().toISOString()} - ${message}`,
      error,
      meta
    )
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta)
  }
}

// Usage in API routes
import { logger } from "@/lib/logger"

export async function POST(req: NextRequest) {
  try {
    logger.info("Upload request received", { userId: user.id })
    // ... upload logic
    logger.info("Upload successful", { fileKey, fileSize })
  } catch (error) {
    logger.error("Upload failed", error as Error, { userId: user.id })
  }
}
```

---

## Error Handling

### Error Types

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message)
    this.name = "AppError"
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super("AUTHENTICATION_ERROR", message, 401)
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Access denied") {
    super("AUTHORIZATION_ERROR", message, 403)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super("VALIDATION_ERROR", message, 400, details)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super("NOT_FOUND", `${resource} not found`, 404)
  }
}
```

### Error Handler Middleware

```typescript
// lib/error-handler.ts
import { NextResponse } from "next/server"
import { AppError } from "./errors"
import { logger } from "./logger"

export function handleError(error: unknown) {
  logger.error("Request error", error as Error)
  
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      },
      { status: error.statusCode }
    )
  }
  
  // Unknown errors
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred"
      }
    },
    { status: 500 }
  )
}

// Usage
export async function POST(req: NextRequest) {
  try {
    // ... route logic
  } catch (error) {
    return handleError(error)
  }
}
```

---

## Testing Strategy

### Testing Pyramid

```
           ┌──────────────────┐
           │   E2E Tests      │  (10%)
           │  (Playwright)    │
           └────────┬─────────┘
          ┌─────────▼────────────┐
          │  Integration Tests   │  (30%)
          │   (API, DB)          │
          └─────────┬────────────┘
        ┌───────────▼──────────────┐
        │     Unit Tests           │  (60%)
        │   (Components, Utils)    │
        └──────────────────────────┘
```

### Test Configuration

```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ],
}
```

### Example Tests

```typescript
// __tests__/lib/password.test.ts
import { validatePassword, hashPassword, verifyPassword } from '@/lib/password'

describe('Password Validation', () => {
  it('should reject passwords shorter than 8 characters', () => {
    const result = validatePassword('Short1')
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Password must be at least 8 characters')
  })

  it('should accept valid passwords', () => {
    const result = validatePassword('ValidPass123')
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })
})

describe('Password Hashing', () => {
  it('should hash and verify passwords correctly', async () => {
    const password = 'TestPassword123'
    const hash = await hashPassword(password)
    
    expect(hash).not.toBe(password)
    
    const isValid = await verifyPassword(password, hash)
    expect(isValid).toBe(true)
    
    const isInvalid = await verifyPassword('WrongPassword', hash)
    expect(isInvalid).toBe(false)
  })
})
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Oct 3, 2025 | Engineering Team | Initial TSD creation |

---

## Appendix

### Glossary

- **API**: Application Programming Interface
- **CDN**: Content Delivery Network
- **CORS**: Cross-Origin Resource Sharing
- **JWT**: JSON Web Token
- **ORM**: Object-Relational Mapping
- **REST**: Representational State Transfer
- **S3**: Simple Storage Service (AWS)
- **SSR**: Server-Side Rendering

### References

- Next.js Documentation: https://nextjs.org/docs
- Prisma Documentation: https://www.prisma.io/docs
- NextAuth.js Documentation: https://next-auth.js.org
- AWS S3 Documentation: https://docs.aws.amazon.com/s3/

---

**Document Status**: ✅ Active  
**Next Review**: January 2026  
**Owner**: Engineering Lead - Acrux Team
