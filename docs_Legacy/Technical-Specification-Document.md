# Technical Specification Document (TSD)
## Acrux - Strategic Objectives Dashboard

**Version:** 1.0  
**Date:** September 27, 2025  
**Document Type:** Technical Specification Document  

---

## 1. Introduction

### 1.1 Purpose
This Technical Specification Document (TSD) provides comprehensive technical details for the development and implementation of Acrux, a strategic objectives dashboard designed to connect team well-being with business goals.

### 1.2 Scope
This document covers the complete technical architecture, implementation details, database design, API specifications, and deployment considerations for the Acrux platform.

### 1.3 Overview
Acrux is a modern, multilingual web application built with Next.js 14, featuring a sophisticated role-based system for managing strategic objectives while monitoring team well-being through pulse checks and blocker reporting.

---

## 2. System Architecture Design

### 2.1 Overall Architecture
Acrux follows a modern full-stack architecture pattern:

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   Frontend Layer    │    │   API Layer         │    │   Database Layer    │
│   (Next.js 14)     │◄──►│   (Next.js API      │◄──►│   (PostgreSQL +     │
│   - React 18        │    │    Routes)          │    │    Prisma ORM)      │
│   - TypeScript      │    │   - Authentication  │    │                     │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

### 2.2 Component Architecture
- **Authentication Layer**: NextAuth.js with role-based access control
- **UI Components**: Modular React components with TypeScript
- **State Management**: React hooks with local state management
- **Internationalization**: react-i18next for Spanish/English support
- **Styling**: Bootstrap 5.3 with custom CSS and Bizneo-inspired design

### 2.3 Data Flow Architecture
1. **User Authentication**: NextAuth.js handles login/signup
2. **Role-Based Access**: Admin/Member roles determine available features
3. **API Communication**: RESTful API endpoints handle CRUD operations
4. **Real-time Updates**: Database queries with optimistic updates
5. **Multilingual Support**: i18n provider manages language switching

---

## 3. Technical Specifications

### 3.1 Database Design

#### 3.1.1 Core Tables

**Users Table**
```sql
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  hashedPassword String?
  role          UserRole  @default(MEMBER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  createdObjectives  Objective[]
  assignedObjectives ObjectiveAssignment[]
  pulseResponses     PulseResponse[]
  blockers          Blocker[]
}
```

**Objectives Table**
```sql
model Objective {
  id              String   @id @default(cuid())
  title           String
  description     String?
  priority        Priority @default(MEDIUM)
  status          Status   @default(NOT_STARTED)
  healthScore     Int      @default(100)
  progress        Int      @default(0)
  targetDate      DateTime?
  createdBy       String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  creator         User     @relation(fields: [createdBy], references: [id])
  assignments     ObjectiveAssignment[]
  pulseRequests   PulseRequest[]
  blockers        Blocker[]
  metrics         Metric[]
}
```

#### 3.1.2 Supporting Tables

**ObjectiveAssignment**
```sql
model ObjectiveAssignment {
  id          String    @id @default(cuid())
  objectiveId String
  userId      String
  assignedAt  DateTime  @default(now())
  
  objective   Objective @relation(fields: [objectiveId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id])
  
  @@unique([objectiveId, userId])
}
```

**PulseRequest & PulseResponse**
```sql
model PulseRequest {
  id          String    @id @default(cuid())
  objectiveId String
  question    String
  createdAt   DateTime  @default(now())
  
  objective   Objective @relation(fields: [objectiveId], references: [id], onDelete: Cascade)
  responses   PulseResponse[]
}

model PulseResponse {
  id            String      @id @default(cuid())
  pulseRequestId String
  userId        String
  rating        Int         // 1-5 scale
  feedback      String?
  createdAt     DateTime    @default(now())
  
  pulseRequest  PulseRequest @relation(fields: [pulseRequestId], references: [id], onDelete: Cascade)
  user          User         @relation(fields: [userId], references: [id])
}
```

### 3.2 API Specifications

#### 3.2.1 Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User authentication
- `GET /api/auth/session` - Session validation

#### 3.2.2 Objectives Endpoints
- `GET /api/objectives` - List objectives (role-filtered)
- `POST /api/objectives` - Create objective (Admin only)
- `PUT /api/objectives/[id]` - Update objective
- `DELETE /api/objectives/[id]` - Delete objective (Admin only)
- `GET /api/objectives/[id]` - Get objective details

#### 3.2.3 Team Management Endpoints
- `POST /api/pulse/requests` - Send pulse request (Admin only)
- `POST /api/pulse/responses` - Submit pulse response
- `GET /api/pulse/pending` - Get pending pulse requests
- `POST /api/blockers` - Report blocker
- `GET /api/blockers` - List blockers
- `PUT /api/blockers/[id]` - Update blocker status

### 3.3 Algorithms

#### 3.3.1 Health Score Calculation
```typescript
function calculateHealthScore(pulseResponses: PulseResponse[]): number {
  if (pulseResponses.length === 0) return 100;
  
  const totalRating = pulseResponses.reduce((sum, response) => sum + response.rating, 0);
  const averageRating = totalRating / pulseResponses.length;
  
  // Convert 1-5 scale to 0-100 health score
  return Math.round(((averageRating - 1) / 4) * 100);
}
```

#### 3.3.2 Progress Tracking Algorithm
```typescript
function updateObjectiveProgress(objective: Objective, metrics: Metric[]): number {
  const completedMetrics = metrics.filter(m => m.isCompleted).length;
  return Math.round((completedMetrics / metrics.length) * 100);
}
```

---

## 4. Environments

### 4.1 Development Environment
- **Platform**: Ubuntu/Linux
- **Node.js**: v18+
- **Package Manager**: Yarn
- **Database**: PostgreSQL (local instance)
- **Development Server**: Next.js dev server (port 3000)

### 4.2 Testing Environment
- **Unit Testing**: Jest + React Testing Library
- **Integration Testing**: Prisma test database
- **E2E Testing**: Playwright (future implementation)
- **API Testing**: Postman/Insomnia collections

### 4.3 Production Environment
- **Hosting**: Vercel/Netlify
- **Database**: PostgreSQL (managed service)
- **CDN**: Vercel Edge Network
- **Monitoring**: Built-in Vercel analytics
- **SSL**: Automatic HTTPS

---

## 5. Technologies

### 5.1 Frontend Stack
- **Framework**: Next.js 14.2.28 (React 18)
- **Language**: TypeScript 5.2.2
- **Styling**: Bootstrap 5.3.2, Custom CSS
- **Icons**: Flaticon UI Icons
- **Internationalization**: react-i18next

### 5.2 Backend Stack
- **API**: Next.js API Routes
- **Authentication**: NextAuth.js 4.24.11
- **Database ORM**: Prisma 6.7.0
- **Database**: PostgreSQL
- **Validation**: Zod 3.23.8

### 5.3 Development Tools
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript
- **Version Control**: Git
- **Package Management**: Yarn
- **IDE Extensions**: Prisma, TypeScript, ESLint

### 5.4 Third-Party Libraries
```json
{
  "dependencies": {
    "@next-auth/prisma-adapter": "1.0.7",
    "@prisma/client": "6.7.0",
    "react-i18next": "Latest",
    "bootstrap": "5.3.2",
    "date-fns": "3.6.0",
    "framer-motion": "10.18.0"
  }
}
```

---

## 6. Security Considerations

### 6.1 Authentication Security
- **Password Hashing**: bcryptjs with salt
- **Session Management**: NextAuth.js secure cookies
- **CSRF Protection**: Built-in Next.js protection
- **JWT Tokens**: Secure token-based authentication

### 6.2 Data Protection
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **XSS Protection**: React built-in escaping
- **Input Validation**: Zod schema validation
- **Role-Based Access Control**: Server-side route protection

### 6.3 Environment Security
- **Environment Variables**: Secure credential storage
- **HTTPS Enforcement**: Production SSL certificates
- **Database Security**: Connection string encryption
- **API Rate Limiting**: Future implementation consideration

### 6.4 Secure Coding Guidelines
1. Always validate input data using Zod schemas
2. Use Prisma for all database interactions
3. Implement role checks on all API routes
4. Sanitize user-generated content
5. Use environment variables for sensitive data

---

## 7. Performance Requirements

### 7.1 Response Time Requirements
- **Page Load**: < 2 seconds (initial load)
- **API Response**: < 500ms (database queries)
- **Interactive Response**: < 100ms (UI interactions)
- **Search Operations**: < 1 second

### 7.2 Scalability Requirements
- **Concurrent Users**: 100+ simultaneous users
- **Database Growth**: Support for 10,000+ objectives
- **File Storage**: Cloud-based scalable storage
- **Memory Usage**: < 512MB per instance

### 7.3 Optimization Strategies
- **Next.js Image Optimization**: Automatic image compression
- **Code Splitting**: Route-based code splitting
- **Database Indexing**: Optimized queries with indexes
- **Caching**: Static generation where appropriate

---

## 8. Diagrams and Graphics

### 8.1 System Architecture Diagram
```
Frontend (Next.js)
│
├── Pages Router
│   ├── Authentication (/auth/*)
│   ├── Dashboard (/)
│   ├── Objectives (/objectives/*)
│   └── Admin (/admin/*)
│
├── Components
│   ├── UI Components (buttons, modals, forms)
│   ├── Feature Components (objective cards, pulse forms)
│   └── Layout Components (navbar, sidebar)
│
├── API Layer (/api/*)
│   ├── Auth Endpoints
│   ├── Objectives CRUD
│   ├── Team Management
│   └── Pulse/Blocker APIs
│
└── Database (PostgreSQL + Prisma)
    ├── Users & Roles
    ├── Objectives & Metrics
    ├── Pulse Requests/Responses
    └── Blockers & Assignments
```

### 8.2 Database ERD
```
Users ||--o{ ObjectiveAssignments : assigned_to
Users ||--o{ Objectives : creates
Users ||--o{ PulseResponses : submits
Users ||--o{ Blockers : reports

Objectives ||--o{ ObjectiveAssignments : has_assignments
Objectives ||--o{ PulseRequests : has_pulse_requests
Objectives ||--o{ Blockers : has_blockers
Objectives ||--o{ Metrics : has_metrics

PulseRequests ||--o{ PulseResponses : receives_responses
```

### 8.3 User Flow Diagram
```
Login → Role Check → Dashboard
│                    │
├── Admin Flow       └── Member Flow
│   ├── Create Objectives    ├── View Assigned Objectives
│   ├── Assign Team Members  ├── Submit Pulse Responses
│   ├── Send Pulse Requests  ├── Report Blockers
│   └── View Analytics       └── Update Progress
```

---

## 9. References

### 9.1 External Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/)
- [React i18next Documentation](https://react-i18next.com/)

### 9.2 Internal Documents
- `README.md` - Project setup and installation guide
- `prisma/schema.prisma` - Database schema definition
- `app/lib/types.ts` - TypeScript type definitions
- `package.json` - Project dependencies and scripts

### 9.3 Design References
- [Bizneo Design System](https://www.bizneo.com/) - UI/UX inspiration
- [Lattice.com](https://lattice.com/) - Landing page reference
- [Flaticon](https://www.flaticon.com/) - Icon library source

---

**Document Status**: ✅ Complete  
**Last Updated**: September 27, 2025  
**Next Review**: October 27, 2025  
**Approved By**: Development Team