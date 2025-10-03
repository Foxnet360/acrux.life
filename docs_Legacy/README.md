
# Acrux MVP Documentation

Welcome to the comprehensive documentation for the Acrux MVP platform—an objective and key result (OKR) management system designed to empower teams through transparent progress tracking, pulse checks, and blocker management.

---

## 📚 Documentation Index

This documentation suite provides a complete reference for developers, product managers, designers, and stakeholders working with the Acrux platform.

### 1. [Database Schema](./01-database-schema.md)
**Purpose:** Technical reference for the PostgreSQL database structure  
**Audience:** Developers, Database Administrators, Backend Engineers

**Contents:**
- Complete data model with 12 database tables
- Field definitions and data types
- Relationship diagrams
- Indexes and performance considerations
- Query patterns and examples
- Migration strategy
- Security and data integrity rules

**When to reference:**
- Implementing new features that require database changes
- Understanding data relationships
- Optimizing queries
- Planning database migrations
- Debugging data issues

---

### 2. [Application Modules](./02-app-modules.md)
**Purpose:** Architectural overview of the application's modular structure  
**Audience:** Developers, System Architects, Technical Leads

**Contents:**
- 10 core application modules
- Module responsibilities and boundaries
- Component hierarchies
- API route structure
- Data flow patterns
- Module dependencies and communication
- Authentication and authorization
- Shared UI component library

**Key Modules:**
1. Authentication Module
2. Landing Page Module
3. Dashboard Module
4. Objectives Module
5. Pulse Check Module
6. Blocker Module
7. Team Management Module
8. Profile Module
9. API Module
10. Shared UI Module

**When to reference:**
- Understanding codebase organization
- Planning new feature development
- Refactoring existing code
- Onboarding new developers
- Architectural decision-making

---

### 3. [Screen Descriptions](./03-screen-descriptions.md)
**Purpose:** Detailed walkthrough of every screen in the application  
**Audience:** Developers, Designers, Product Managers, QA Engineers

**Contents:**
- 11 main screens with layouts and wireframes
- User interface specifications
- Form fields and validation rules
- User actions and workflows
- Success/error states
- Modal dialogs
- Navigation patterns
- Responsive design specifications
- Accessibility features

**Key Screens:**
1. Landing Page
2. Login Page
3. Signup Page
4. Dashboard Home
5. Objectives List
6. Create Objective
7. Objective Detail
8. Edit Objective
9. Team Management
10. Pulse Requests Inbox
11. Profile Page

**When to reference:**
- Implementing UI components
- Designing new features
- Writing user acceptance tests
- Creating design mockups
- Planning UX improvements

---

### 4. [User Stories](./04-user-stories.md)
**Purpose:** Feature requirements from user perspective  
**Audience:** Product Managers, Developers, QA Engineers, Stakeholders

**Contents:**
- 75+ user stories across 11 epics
- Acceptance criteria for each story
- Priority levels (P0, P1, P2)
- Complexity estimates
- Implementation status
- Role-based story organization

**Epics:**
1. Authentication & Account Management
2. Objective Management
3. Metrics & Progress Tracking
4. Pulse Checks & Team Sentiment
5. Blocker Management
6. Team Management (Admin)
7. Health Score & Analytics
8. Notifications & Alerts
9. Search & Filtering
10. User Experience & Accessibility
11. Security & Privacy

**When to reference:**
- Sprint planning
- Feature prioritization
- Requirements gathering
- QA test planning
- Product roadmap development

---

### 5. [Intent Stories](./05-intent-stories.md)
**Purpose:** Understanding user motivations and behaviors  
**Audience:** Product Managers, UX Designers, Product Strategists

**Contents:**
- 20+ intent stories across 6 categories
- User personas and emotional states
- Underlying motivations
- Success indicators
- Intent-to-feature mapping
- Design principles derived from intents
- Intent priority framework

**Intent Categories:**
1. Goal Achievement Intents
2. Communication & Collaboration Intents
3. Monitoring & Assessment Intents
4. Problem-Solving Intents
5. Team Management Intents
6. Personal Productivity Intents

**When to reference:**
- Product strategy discussions
- Feature prioritization decisions
- UX research and design
- Understanding "why" behind features
- Aligning team on user needs

---

## 🎯 Quick Start Guide

### For Developers
1. Start with [Database Schema](./01-database-schema.md) to understand data model
2. Review [Application Modules](./02-app-modules.md) for codebase architecture
3. Reference [Screen Descriptions](./03-screen-descriptions.md) when implementing UI
4. Use [User Stories](./04-user-stories.md) for acceptance criteria

### For Product Managers
1. Begin with [Intent Stories](./05-intent-stories.md) to understand user needs
2. Review [User Stories](./04-user-stories.md) for feature requirements
3. Reference [Screen Descriptions](./03-screen-descriptions.md) for UX specifications
4. Use documentation for sprint planning and roadmapping

### For Designers
1. Start with [Intent Stories](./05-intent-stories.md) to understand user motivations
2. Review [Screen Descriptions](./03-screen-descriptions.md) for detailed UI specs
3. Reference [User Stories](./04-user-stories.md) for feature context
4. Use documentation for design system consistency

### For QA Engineers
1. Begin with [User Stories](./04-user-stories.md) for acceptance criteria
2. Review [Screen Descriptions](./03-screen-descriptions.md) for UI test cases
3. Reference [Application Modules](./02-app-modules.md) for integration testing
4. Use [Database Schema](./01-database-schema.md) for data validation

---

## 📊 Project Statistics

- **Total Database Tables:** 12 (core) + 3 (auth)
- **Application Modules:** 10 major modules
- **Screens:** 11 main screens + modals
- **User Stories:** 75+ stories across 11 epics
- **Intent Stories:** 20+ intents across 6 categories
- **API Routes:** 25+ RESTful endpoints
- **Documentation Pages:** 5 comprehensive documents

---

## 🔑 Key Concepts

### Objectives
Strategic goals with measurable key results (metrics), tracked via progress percentages and health scores.

### Pulse Checks
Team sentiment and confidence ratings (1-5 scale) that provide qualitative feedback on objective health.

### Blockers
Obstacles preventing progress, categorized by severity (low, medium, high, critical) and status (open, in-progress, resolved).

### Health Score
Auto-calculated metric (0-100) combining pulse check data and blocker severity to indicate objective risk level.

### Metrics (Key Results)
Quantifiable measurements with current and target values that define objective success.

### Team Members
Users with team_member role who are assigned to objectives and submit pulse checks/blockers.

### Admins
Users with admin role who create objectives, manage team, and have full platform access.

---

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend:** Next.js 14, React 18, TypeScript
- **UI Library:** Radix UI, Tailwind CSS
- **Backend:** Next.js API Routes, Node.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js with credentials provider
- **State Management:** React hooks, server components

### Design Patterns
- **Server-Side Rendering (SSR):** For SEO and initial page load performance
- **Client Components:** For interactive UI elements
- **RESTful API:** Consistent API route structure
- **Role-Based Access Control (RBAC):** Admin vs team member permissions
- **Anonymous Submissions:** For honest feedback without fear

---

## 🎨 Design System

### Colors
- **Primary:** Blue (#0066cc) - Actions, links, focus
- **Success:** Green (#10b981) - Healthy status
- **Warning:** Yellow (#f59e0b) - Warning status
- **Danger:** Red (#ef4444) - At-risk status
- **Neutral:** Gray scale - Backgrounds, text

### Health Score Indicators
- 🟢 **Green (80-100):** Healthy, on track
- 🟡 **Yellow (60-79):** Warning, needs attention
- 🔴 **Red (0-59):** At risk, immediate action needed

### Sentiment Scale
- 😞 (1): Very negative
- 😕 (2): Negative
- 😐 (3): Neutral
- 🙂 (4): Positive
- 😊 (5): Very positive

---

## 📈 Metrics & Success Criteria

### User Engagement
- Daily active users (DAU)
- Objectives created per team
- Pulse check submission rate
- Blocker reporting frequency

### Product Health
- % of objectives completed on time
- Average objective health score
- Time to blocker resolution
- User retention rate

### Team Satisfaction
- Average pulse check sentiment
- User satisfaction surveys
- Feature adoption rates
- Support ticket volume

---

## 🔐 Security & Privacy

### Authentication
- Secure password hashing (bcrypt)
- Session-based authentication via NextAuth.js
- HTTP-only cookies for session tokens
- CSRF protection on all forms

### Authorization
- Role-based access control (admin vs team_member)
- Resource-level permissions (objective ownership)
- API route protection with session checks

### Privacy
- Anonymous pulse check and blocker submissions
- User identity not stored for anonymous data
- No way for admins to identify anonymous submitters
- Data retention policies (to be defined)

---

## 🧪 Testing Strategy

### Unit Tests
- Component rendering
- Form validation logic
- Utility functions
- Business logic calculations

### Integration Tests
- API route handlers
- Database operations
- Authentication flows
- Permission checks

### E2E Tests
- Complete user workflows
- Critical paths (signup → create objective → submit pulse)
- Multi-user scenarios
- Role-based access verification

---

## 🚀 Deployment

### Development Environment
```bash
# Install dependencies
cd app && yarn install

# Run database migrations
yarn prisma migrate dev

# Seed database
yarn prisma db seed

# Start development server
yarn dev
```

### Production Considerations
- Environment variables configured
- Database connection pooling
- Session secret rotation
- Rate limiting on API routes
- Error logging and monitoring
- Backup and disaster recovery

---

## 📝 Contributing

### Documentation Updates
When updating documentation:
1. Maintain consistent formatting
2. Update version date at bottom
3. Cross-reference related documents
4. Include examples where helpful
5. Keep language clear and concise

### Code Changes
When implementing features:
1. Reference relevant user stories
2. Follow module architecture
3. Update screen descriptions if UI changes
4. Add tests for new functionality
5. Update database schema docs if needed

---

## 🗺️ Roadmap

### MVP (v1.0) - Completed
✅ Core objective management  
✅ Pulse checks and sentiment tracking  
✅ Blocker reporting  
✅ Health score calculation  
✅ Team management  
✅ Anonymous submissions  

### v1.1 - Planned
🔲 Team invitation acceptance flow  
🔲 Email notifications  
🔲 Metric history tracking  
🔲 Data export (CSV/Excel)  

### v1.2 - Future
🔲 Mobile app (React Native)  
🔲 Advanced analytics and dashboards  
🔲 Custom workflows and automations  
🔲 Integrations (Slack, Teams, etc.)  
🔲 Multi-organization support  

---

## 📞 Support & Resources

### For Questions
- **Technical Issues:** Check [Application Modules](./02-app-modules.md)
- **Feature Clarifications:** Review [User Stories](./04-user-stories.md)
- **UX Decisions:** Reference [Intent Stories](./05-intent-stories.md)
- **Data Model:** Consult [Database Schema](./01-database-schema.md)

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 📄 Document Versions

| Document | Last Updated | Version |
|----------|--------------|---------|
| Database Schema | 2025-10-03 | 1.0 |
| Application Modules | 2025-10-03 | 1.0 |
| Screen Descriptions | 2025-10-03 | 1.0 |
| User Stories | 2025-10-03 | 1.0 |
| Intent Stories | 2025-10-03 | 1.0 |

---

## ✨ Acknowledgments

This documentation was created to support the Acrux MVP development team and ensure consistent understanding across all stakeholders.

**Document Creation Date:** October 3, 2025  
**Project Status:** MVP Complete  
**Current Version:** 1.0

---

*For the latest updates and changes, refer to individual document version history.*
