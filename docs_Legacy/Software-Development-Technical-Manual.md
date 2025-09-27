# Software Development Technical Manual
## Acrux - Strategic Objectives Dashboard

**Version:** 1.0  
**Date:** September 27, 2025  
**Document Type:** Software Development Technical Manual  

---

## 1. Introduction

### 1.1 Purpose
This Software Development Technical Manual provides comprehensive guidance for developers working on the Acrux platform. It establishes development standards, processes, and tools to ensure consistent, maintainable, and scalable code.

### 1.2 Target Audience
- Frontend Developers
- Backend Developers
- Full-Stack Developers
- DevOps Engineers
- Quality Assurance Engineers
- Technical Lead/Architects

### 1.3 Document Scope
This manual covers development environment setup, coding standards, tools, processes, and best practices for the Acrux project.

---

## 2. System Requirements

### 2.1 Hardware Requirements

#### 2.1.1 Minimum Development Machine Specifications
- **CPU**: Dual-core processor (Intel i5 or equivalent)
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 256GB SSD with at least 50GB free space
- **Network**: Stable internet connection for package downloads

#### 2.1.2 Recommended Development Machine Specifications
- **CPU**: Quad-core processor (Intel i7 or equivalent)
- **RAM**: 16GB or higher
- **Storage**: 512GB+ SSD
- **Display**: 1920x1080 or higher resolution

### 2.2 Software Requirements

#### 2.2.1 Required Software
```bash
# Core Requirements
Node.js >= 18.0.0
npm >= 8.0.0
Yarn >= 1.22.0 (preferred package manager)
Git >= 2.30.0
PostgreSQL >= 12.0

# Development Tools
Visual Studio Code (recommended IDE)
Docker >= 20.0.0 (optional, for containerization)
```

#### 2.2.2 Browser Requirements for Testing
- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

---

## 3. Best Coding Practices

### 3.1 General Coding Standards

#### 3.1.1 File Naming Conventions
```bash
# React Components (PascalCase)
ObjectiveCard.tsx
UserProfileModal.tsx
DashboardLayout.tsx

# Utility functions (camelCase)
calculateHealthScore.ts
formatDateTime.ts
validateUserInput.ts

# API routes (kebab-case)
pulse-requests.ts
objective-assignments.ts
team-members.ts

# Constants (UPPER_SNAKE_CASE)
API_ENDPOINTS.ts
DEFAULT_VALUES.ts
```

#### 3.1.2 Variable and Function Naming
```typescript
// Variables: camelCase, descriptive names
const userHealthScore = 85;
const objectiveAssignments = [];
const isModalOpen = true;

// Functions: camelCase, verb-noun pattern
const getUserById = (id: string) => {};
const calculateProgressPercentage = (completed: number, total: number) => {};
const validateEmailAddress = (email: string) => {};

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.acrux.life';
```

### 3.2 TypeScript Standards

#### 3.2.1 Type Definitions
```typescript
// Interface naming: PascalCase with 'I' prefix (optional)
interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
}

// Type aliases: PascalCase
type ObjectiveStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

// Generic types
interface ApiEndpoint<TRequest, TResponse> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  handler: (req: TRequest) => Promise<TResponse>;
}
```

#### 3.2.2 React Component Standards
```typescript
// Functional Component with TypeScript
interface ObjectiveCardProps {
  objective: Objective;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  onEdit,
  onDelete,
  className = ''
}) => {
  // Component logic here
  return (
    <div className={`objective-card ${className}`}>
      {/* JSX content */}
    </div>
  );
};

export default ObjectiveCard;
```

### 3.3 React Best Practices

#### 3.3.1 Component Structure
```typescript
// 1. Imports (grouped)
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { User, Objective } from '@/lib/types';

// 2. Interface definitions
interface Props {
  // prop definitions
}

// 3. Component implementation
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  // 4. State declarations
  const [localState, setLocalState] = useState<string>('');
  
  // 5. Hooks
  const router = useRouter();
  
  // 6. useEffect hooks
  useEffect(() => {
    // effect logic
  }, []);
  
  // 7. Event handlers
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // handler logic
  };
  
  // 8. Render
  return (
    // JSX
  );
};

// 9. Export
export default MyComponent;
```

#### 3.3.2 State Management
```typescript
// Prefer useState for local component state
const [isLoading, setIsLoading] = useState<boolean>(false);
const [objectives, setObjectives] = useState<Objective[]>([]);

// Use useReducer for complex state logic
interface State {
  objectives: Objective[];
  loading: boolean;
  error: string | null;
}

type Action = 
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Objective[] }
  | { type: 'FETCH_ERROR'; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, objectives: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
```

### 3.4 API Development Standards

#### 3.4.1 API Route Structure
```typescript
// /pages/api/objectives/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Objective | null>>
) {
  // 1. Authentication check
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
      data: null
    });
  }

  // 2. Method handling
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'PUT':
      return handlePut(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`,
        data: null
      });
  }
}

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  // Implementation
};
```

#### 3.4.2 Error Handling
```typescript
// Centralized error handling
class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
  }
}

// Error handler middleware
const handleApiError = (error: unknown, res: NextApiResponse) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
      data: null
    });
  }

  // Unknown error
  console.error('Unhandled API error:', error);
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    data: null
  });
};
```

---

## 4. Tools and Technologies

### 4.1 Integrated Development Environment (IDE)

#### 4.1.1 Visual Studio Code Setup
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

#### 4.1.2 Recommended Extensions
```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "prisma.prisma",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag"
  ]
}
```

### 4.2 Version Control System

#### 4.2.1 Git Configuration
```bash
# Global Git configuration
git config --global user.name "Your Name"
git config --global user.email "your.email@company.com"
git config --global init.defaultBranch main
git config --global pull.rebase false
```

#### 4.2.2 Git Hooks Setup
```bash
# Install husky for git hooks
yarn add --dev husky lint-staged

# package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "yarn test"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### 4.3 Database Tools

#### 4.3.1 Prisma CLI Commands
```bash
# Generate Prisma client
yarn prisma generate

# Create and apply migrations
yarn prisma migrate dev --name "add-new-feature"

# Reset database
yarn prisma migrate reset

# Open Prisma Studio
yarn prisma studio

# Format schema file
yarn prisma format
```

#### 4.3.2 Database Management
```bash
# Connect to PostgreSQL
psql -h localhost -U username -d database_name

# Common SQL commands
\l          # List databases
\c dbname   # Connect to database
\dt         # List tables
\d table    # Describe table structure
```

---

## 5. Development Methodology

### 5.1 Agile Methodology Implementation

#### 5.1.1 Sprint Structure
- **Sprint Duration**: 2 weeks
- **Sprint Planning**: Monday (2 hours)
- **Daily Standups**: Daily (15 minutes)
- **Sprint Review**: Friday (1 hour)
- **Sprint Retrospective**: Friday (30 minutes)

#### 5.1.2 User Story Format
```
As a [user type]
I want [functionality]
So that [benefit/value]

Acceptance Criteria:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

Definition of Done:
- [ ] Code complete
- [ ] Unit tests written and passing
- [ ] Code reviewed and approved
- [ ] Documentation updated
```

---

## 6. Version Control

### 6.1 Branching Strategy

#### 6.1.1 Git Flow Implementation
```bash
# Main branches
main         # Production-ready code
develop      # Integration branch for features

# Supporting branches
feature/*    # New features
hotfix/*     # Critical bug fixes
release/*    # Release preparation
```

#### 6.1.2 Branch Naming Conventions
```bash
# Feature branches
feature/user-authentication
feature/objective-management
feature/pulse-check-system

# Bug fix branches
bugfix/login-form-validation
bugfix/objective-card-display

# Hotfix branches
hotfix/security-vulnerability
hotfix/critical-performance-issue
```

### 6.2 Commit Message Standards

#### 6.2.1 Conventional Commits Format
```bash
# Format: type(scope): description

# Types
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation changes
style:    # Code style changes (formatting, etc.)
refactor: # Code refactoring
test:     # Adding or modifying tests
chore:    # Maintenance tasks

# Examples
feat(auth): add social login with Google
fix(objectives): resolve health score calculation bug
docs(api): update authentication endpoints documentation
```

---

## 7. Testing Process

### 7.1 Testing Strategy

#### 7.1.1 Testing Pyramid
```
                     /\
                    /  \
                   / E2E \
                  /______\
                 /        \
                /Integration\
               /_____________\
              /               \
             /   Unit Tests     \
            /_________________\
```

#### 7.1.2 Test Coverage Requirements
- **Unit Tests**: > 80% code coverage
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user workflows

### 7.2 Unit Testing

#### 7.2.1 Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'pages/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ]
};
```

#### 7.2.2 Component Testing Example
```typescript
// __tests__/components/ObjectiveCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ObjectiveCard from '@/components/ObjectiveCard';
import { Objective } from '@/lib/types';

const mockObjective: Objective = {
  id: '1',
  title: 'Test Objective',
  description: 'Test description',
  status: 'IN_PROGRESS',
  healthScore: 85,
  // ... other properties
};

describe('ObjectiveCard', () => {
  it('renders objective title correctly', () => {
    render(<ObjectiveCard objective={mockObjective} />);
    expect(screen.getByText('Test Objective')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(<ObjectiveCard objective={mockObjective} onEdit={mockOnEdit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(mockOnEdit).toHaveBeenCalledWith('1');
  });
});
```

### 7.3 Integration Testing

#### 7.3.1 API Testing Example
```typescript
// __tests__/api/objectives.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/objectives';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    objective: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('/api/objectives', () => {
  it('returns objectives for GET request', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    (prisma.objective.findMany as jest.Mock).mockResolvedValue([
      { id: '1', title: 'Test Objective' },
    ]);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      success: true,
      data: [{ id: '1', title: 'Test Objective' }],
    });
  });
});
```

---

## 8. Development Environment Setup

### 8.1 Initial Setup

#### 8.1.1 Project Clone and Installation
```bash
# 1. Clone repository
git clone https://github.com/Foxnet360/acrux.life.git
cd acrux.life

# 2. Install dependencies
yarn install

# 3. Environment setup
cp .env.example .env.local
# Edit .env.local with your database credentials

# 4. Database setup
yarn prisma generate
yarn prisma db push
yarn prisma db seed

# 5. Start development server
yarn dev
```

#### 8.1.2 Environment Variables
```bash
# .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/acrux_dev"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-development-secret-key"

# Optional
NEXT_PUBLIC_APP_ENV="development"
```

### 8.2 Docker Setup (Optional)

#### 8.2.1 Development Docker Compose
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: acrux_dev
      POSTGRES_USER: developer
      POSTGRES_PASSWORD: devpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://developer:devpassword@postgres:5432/acrux_dev
    depends_on:
      - postgres
    volumes:
      - .:/app
      - /app/node_modules

volumes:
  postgres_data:
```

---

## 9. Roles and Responsibilities

### 9.1 Development Team Structure

#### 9.1.1 Frontend Developer
**Responsibilities:**
- Implement UI components using React and TypeScript
- Ensure responsive design across all devices
- Implement internationalization features
- Optimize frontend performance
- Write unit tests for components

**Required Skills:**
- React.js, TypeScript, Next.js
- Bootstrap, CSS, responsive design
- Jest, React Testing Library
- Git version control

#### 9.1.2 Backend Developer
**Responsibilities:**
- Design and implement API endpoints
- Database schema design and optimization
- Authentication and authorization implementation
- Write integration tests
- Performance monitoring and optimization

**Required Skills:**
- Node.js, TypeScript, Next.js API routes
- PostgreSQL, Prisma ORM
- NextAuth.js authentication
- API design and security

#### 9.1.3 Full-Stack Developer
**Responsibilities:**
- End-to-end feature implementation
- Database design and frontend integration
- Code review and mentoring
- Architecture decisions
- Cross-functional collaboration

**Required Skills:**
- All frontend and backend skills
- System architecture design
- Leadership and communication
- DevOps and deployment knowledge

### 9.2 Code Review Responsibilities

#### 9.2.1 Reviewer Guidelines
- **Review within 24 hours** of assignment
- **Provide constructive feedback** with explanations
- **Test the changes locally** when necessary
- **Check for security vulnerabilities** and performance issues
- **Ensure documentation** is updated

#### 9.2.2 Author Guidelines
- **Self-review code** before requesting review
- **Provide clear PR description** with context
- **Address all feedback** or provide reasoning
- **Keep PRs small** and focused
- **Update tests** and documentation

---

## 10. Documentation Standards

### 10.1 Code Documentation

#### 10.1.1 Function Documentation
```typescript
/**
 * Calculates the health score for an objective based on pulse responses
 * 
 * @param pulseResponses - Array of pulse responses for the objective
 * @returns Health score as a percentage (0-100)
 * 
 * @example
 * ```typescript
 * const responses = [
 *   { rating: 4, userId: '1' },
 *   { rating: 5, userId: '2' }
 * ];
 * const score = calculateHealthScore(responses); // Returns 87.5
 * ```
 */
const calculateHealthScore = (pulseResponses: PulseResponse[]): number => {
  // Implementation
};
```

#### 10.1.2 Component Documentation
```typescript
/**
 * ObjectiveCard - Displays an objective with its key information and actions
 * 
 * @component
 * @param {ObjectiveCardProps} props - The component props
 * @param {Objective} props.objective - The objective data to display
 * @param {Function} [props.onEdit] - Callback when edit button is clicked
 * @param {Function} [props.onDelete] - Callback when delete button is clicked
 * 
 * @example
 * ```tsx
 * <ObjectiveCard 
 *   objective={objective}
 *   onEdit={(id) => handleEdit(id)}
 *   onDelete={(id) => handleDelete(id)}
 * />
 * ```
 */
```

### 10.2 API Documentation

#### 10.2.1 OpenAPI Specification
```yaml
# openapi.yml
openapi: 3.0.0
info:
  title: Acrux API
  version: 1.0.0
  description: Strategic Objectives Dashboard API

paths:
  /api/objectives:
    get:
      summary: Get all objectives
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [NOT_STARTED, IN_PROGRESS, COMPLETED, BLOCKED]
      responses:
        '200':
          description: List of objectives
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Objective'
```

### 10.3 README Documentation

#### 10.3.1 Component README Template
```markdown
# ComponentName

Brief description of what the component does.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `prop1` | `string` | `""` | Description of prop1 |
| `prop2` | `boolean` | `false` | Description of prop2 |

## Usage

```tsx
import ComponentName from './ComponentName';

<ComponentName prop1="value" prop2={true} />
```

## Examples

### Basic Usage
```tsx
<ComponentName />
```

### Advanced Usage
```tsx
<ComponentName 
  prop1="advanced value"
  prop2={true}
  onEvent={handleEvent}
/>
```
```

---

**Document Status**: ✅ Complete  
**Last Updated**: September 27, 2025  
**Next Review**: October 27, 2025  
**Approved By**: Development Team