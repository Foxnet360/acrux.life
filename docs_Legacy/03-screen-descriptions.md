
# Screen Descriptions

## Overview
This document provides detailed descriptions of all screens in the Acrux MVP application, including their purpose, layout, functionality, and user interactions.

---

## Public Screens

### 1. Landing Page
**Route:** `/`  
**Access:** Public (unauthenticated users)  
**Purpose:** Marketing homepage to introduce Acrux and drive sign-ups

#### Layout Structure
```
┌─────────────────────────────────────┐
│         Navigation Bar              │
│  [Logo]          [Login] [Sign Up]  │
├─────────────────────────────────────┤
│                                     │
│         Hero Section                │
│   "Track Objectives, Empower       │
│           Your Team"                │
│   [Get Started] [Learn More]       │
│                                     │
├─────────────────────────────────────┤
│      Social Proof Section          │
│   "Trusted by teams worldwide"     │
│   [Company Logos / Statistics]     │
├─────────────────────────────────────┤
│    Problem/Solution Section        │
│  "Challenges → Solutions"          │
│   [3-column feature grid]          │
├─────────────────────────────────────┤
│       Features Section             │
│   "What makes Acrux different"     │
│   [Feature cards with icons]       │
├─────────────────────────────────────┤
│     Testimonials Section           │
│   "What our users say"             │
│   [Customer testimonial cards]     │
├─────────────────────────────────────┤
│        CTA Section                 │
│  "Ready to get started?"           │
│   [Sign Up Now] [Book Demo]        │
├─────────────────────────────────────┤
│          Footer                    │
│  [Links] [Social] [Legal]          │
└─────────────────────────────────────┘
```

#### Key Elements
- **Hero Section**
  - Large headline emphasizing value proposition
  - Subheadline explaining the product
  - Primary CTA button (Get Started) → redirects to `/auth/signup`
  - Secondary CTA button (Learn More) → scrolls to features

- **Social Proof**
  - Trust indicators (user count, companies using)
  - Company logos or client testimonials
  - Statistics (e.g., "10,000+ objectives tracked")

- **Features Highlights**
  - Objective tracking
  - Team pulse checks
  - Blocker management
  - Health score analytics

- **Testimonials**
  - User quotes with names/photos
  - Star ratings
  - Company affiliations

#### User Actions
- Click "Sign Up" → Navigate to signup page
- Click "Login" → Navigate to login page
- Click "Get Started" → Navigate to signup page
- Scroll to explore content

#### Responsive Design
- Mobile: Single column, stacked sections
- Tablet: 2-column grid for features
- Desktop: Full multi-column layout

---

### 2. Login Page
**Route:** `/auth/login`  
**Access:** Public (redirects to dashboard if already logged in)  
**Purpose:** User authentication

#### Layout Structure
```
┌─────────────────────────────────────┐
│         [Acrux Logo]                │
│                                     │
│      Welcome Back                   │
│   Sign in to your account           │
│                                     │
│   ┌───────────────────────────┐   │
│   │ Email Address             │   │
│   │ [________________]        │   │
│   │                           │   │
│   │ Password                  │   │
│   │ [________________] 👁     │   │
│   │                           │   │
│   │ [ ] Remember me           │   │
│   │                           │   │
│   │   [Sign In Button]        │   │
│   │                           │   │
│   │  Forgot password?         │   │
│   └───────────────────────────┘   │
│                                     │
│   Don't have an account?            │
│      [Sign up now]                  │
│                                     │
└─────────────────────────────────────┘
```

#### Form Fields
1. **Email Address**
   - Type: Email input
   - Required: Yes
   - Validation: Valid email format
   - Placeholder: "you@example.com"

2. **Password**
   - Type: Password input
   - Required: Yes
   - Validation: Minimum 6 characters
   - Show/hide toggle icon
   - Placeholder: "Enter your password"

3. **Remember Me**
   - Type: Checkbox
   - Optional
   - Extends session duration

#### User Actions
- Enter credentials and click "Sign In"
- Click "Forgot password?" (future feature)
- Click "Sign up now" → Navigate to signup page
- Toggle password visibility

#### Success Flow
1. Submit valid credentials
2. Server validates credentials
3. Session created
4. Redirect to `/dashboard`

#### Error Handling
- Invalid email format → Field-level error message
- Empty required fields → "This field is required"
- Invalid credentials → "Invalid email or password"
- Server error → "Something went wrong. Please try again."

#### Accessibility
- Keyboard navigation support
- ARIA labels for screen readers
- Focus indicators
- Error announcements

---

### 3. Signup Page
**Route:** `/auth/signup`  
**Access:** Public (redirects to dashboard if already logged in)  
**Purpose:** New user registration

#### Layout Structure
```
┌─────────────────────────────────────┐
│         [Acrux Logo]                │
│                                     │
│     Create Your Account             │
│   Start tracking objectives today   │
│                                     │
│   ┌───────────────────────────┐   │
│   │ First Name                │   │
│   │ [________________]        │   │
│   │                           │   │
│   │ Last Name                 │   │
│   │ [________________]        │   │
│   │                           │   │
│   │ Email Address             │   │
│   │ [________________]        │   │
│   │                           │   │
│   │ Password                  │   │
│   │ [________________] 👁     │   │
│   │ Must be at least 6 chars  │   │
│   │                           │   │
│   │ Confirm Password          │   │
│   │ [________________] 👁     │   │
│   │                           │   │
│   │ [ ] I agree to Terms of   │   │
│   │     Service and Privacy   │   │
│   │                           │   │
│   │   [Create Account]        │   │
│   └───────────────────────────┘   │
│                                     │
│   Already have an account?          │
│      [Sign in here]                 │
│                                     │
└─────────────────────────────────────┘
```

#### Form Fields
1. **First Name**
   - Type: Text input
   - Required: Yes
   - Validation: Not empty
   - Placeholder: "John"

2. **Last Name**
   - Type: Text input
   - Required: Yes
   - Validation: Not empty
   - Placeholder: "Doe"

3. **Email Address**
   - Type: Email input
   - Required: Yes
   - Validation: Valid email format, unique
   - Placeholder: "john@example.com"

4. **Password**
   - Type: Password input
   - Required: Yes
   - Validation: Minimum 6 characters
   - Show/hide toggle
   - Strength indicator

5. **Confirm Password**
   - Type: Password input
   - Required: Yes
   - Validation: Must match password field
   - Show/hide toggle

6. **Terms Agreement**
   - Type: Checkbox
   - Required: Yes
   - Links to Terms of Service and Privacy Policy

#### User Actions
- Fill out registration form
- Click "Create Account"
- Click "Sign in here" → Navigate to login page
- Toggle password visibility

#### Success Flow
1. Submit valid registration data
2. Server creates user account
3. Password hashed and stored
4. Default role assigned (team_member)
5. Auto-login user
6. Redirect to `/dashboard`

#### Error Handling
- Invalid email format → "Please enter a valid email"
- Email already exists → "This email is already registered"
- Password too short → "Password must be at least 6 characters"
- Passwords don't match → "Passwords must match"
- Terms not accepted → "You must accept the terms to continue"
- Server error → "Registration failed. Please try again."

#### Security Features
- Password strength indicator
- Password hashing (bcrypt)
- Email uniqueness check
- Rate limiting on registration attempts

---

## Protected Screens (Authenticated Users)

### 4. Dashboard Home
**Route:** `/dashboard`  
**Access:** Authenticated users (admin and team_member)  
**Purpose:** Main hub showing objective overview and quick actions

#### Layout Structure
```
┌──────────────────────────────────────────────────────┐
│  [Logo]  Dashboard  Objectives  [🔔3]  [Profile ▾]   │ ← Navbar
├──────────────────────────────────────────────────────┤
│                                                      │
│  Welcome back, John! 👋                              │
│                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ Active   │ │ Avg      │ │ Open     │            │
│  │ Objetives│ │ Health   │ │ Blockers │            │
│  │    8     │ │   82%    │ │    3     │            │
│  └──────────┘ └──────────┘ └──────────┘            │
│                                                      │
│  Your Objectives                    [+ New Objective]│
│  ┌─────────────────┐ ┌─────────────────┐           │
│  │ Q4 Revenue Goal │ │ Product Launch  │           │
│  │ Progress: 65%   │ │ Progress: 42%   │           │
│  │ Health: 🟢 85   │ │ Health: 🟡 68   │           │
│  │ 2 Blockers      │ │ 1 Blocker       │           │
│  │ [View Details]  │ │ [View Details]  │           │
│  └─────────────────┘ └─────────────────┘           │
│                                                      │
│  ┌─────────────────┐ ┌─────────────────┐           │
│  │ Team Expansion  │ │ Process Improve │           │
│  │ Progress: 88%   │ │ Progress: 30%   │           │
│  │ Health: 🟢 92   │ │ Health: 🔴 45   │           │
│  │ 0 Blockers      │ │ 3 Blockers      │           │
│  │ [View Details]  │ │ [View Details]  │           │
│  └─────────────────┘ └─────────────────┘           │
│                                                      │
│  Recent Activity                                     │
│  • Sarah submitted pulse check for Q4 Revenue Goal   │
│  • New blocker added to Product Launch               │
│  • Team Expansion marked as 88% complete             │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Key Elements

**Dashboard Navbar** (persistent across all protected screens)
- Logo (clickable → home)
- "Dashboard" link
- "Objectives" link → `/dashboard/objectives`
- Team link (admin only) → `/dashboard/team`
- Notification bell with count → `/dashboard/pulse-requests`
- User profile dropdown
  - Profile settings → `/dashboard/profile`
  - Sign out

**Summary Cards**
1. **Active Objectives**
   - Count of active objectives
   - Color-coded by health
   - Clickable → `/dashboard/objectives`

2. **Average Health Score**
   - Calculated from all objectives
   - Visual indicator (color)
   - Trend arrow (up/down)

3. **Open Blockers**
   - Total count of open blockers
   - Severity breakdown
   - Clickable → blockers view

**Objectives Grid**
- Grid layout (2-4 columns responsive)
- Each card shows:
  - Objective title
  - Progress percentage with bar
  - Health score with color indicator
  - Open blocker count
  - "View Details" button → `/dashboard/objectives/[id]`
  - Quick action menu (⋮)
    - Add pulse check
    - Report blocker
    - Edit objective
    - View team

**Recent Activity Feed**
- Latest 5 activities
- Activity types:
  - Pulse checks submitted
  - Blockers added/resolved
  - Progress updates
  - Team assignments
- Timestamps (relative: "2 hours ago")

#### User Actions
- **Create New Objective** → Navigate to `/dashboard/objectives/new`
- **View Objective Details** → Navigate to `/dashboard/objectives/[id]`
- **Add Pulse Check** → Open pulse modal for objective
- **Report Blocker** → Open blocker modal for objective
- **View Notifications** → Navigate to `/dashboard/pulse-requests`
- **Edit Profile** → Navigate to `/dashboard/profile`
- **Sign Out** → End session, redirect to login

#### Role-Based Differences

**Admin View:**
- Sees all objectives in organization
- "Team" link in navbar
- Can create/edit/delete any objective
- Can assign team members

**Team Member View:**
- Sees only assigned objectives
- No "Team" link in navbar
- Can view assigned objectives
- Can submit pulse checks and blockers
- Cannot edit objectives unless assigned as owner

#### Empty States
- No objectives: "Get started by creating your first objective"
- No recent activity: "Activity will appear here as your team collaborates"

---

### 5. Objectives List Page
**Route:** `/dashboard/objectives`  
**Access:** Authenticated users  
**Purpose:** View and manage all objectives

#### Layout Structure
```
┌──────────────────────────────────────────────────────┐
│  [Navbar - same as dashboard]                        │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Objectives                        [+ New Objective] │
│                                                      │
│  [🔍 Search objectives...]    [Filter ▾] [Sort ▾]   │
│                                                      │
│  Tabs: [Active] [Completed] [Paused] [All]          │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Q4 Revenue Goal                  Health: 🟢 85 │ │
│  │ Owner: John Doe                  Progress: 65% │ │
│  │ Target: Dec 31, 2025             2 Blockers    │ │
│  │ 3 metrics • 12 pulse checks • 5 team members   │ │
│  │ [View] [Edit] [⋮]                              │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Product Launch                   Health: 🟡 68 │ │
│  │ Owner: Sarah Smith               Progress: 42% │ │
│  │ Target: Nov 15, 2025             1 Blocker     │ │
│  │ 5 metrics • 8 pulse checks • 8 team members    │ │
│  │ [View] [Edit] [⋮]                              │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  [More objectives...]                                │
│                                                      │
│  Showing 8 of 23 objectives        [Load More]      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Key Features

**Search Bar**
- Real-time search across objective titles and descriptions
- Filters results as user types
- Clear button (×) to reset search

**Filter Dropdown**
- Filter by health score range
  - Healthy (80-100)
  - Warning (60-79)
  - At Risk (0-59)
- Filter by owner
- Filter by team member assignment
- Filter by has open blockers
- Apply/Reset buttons

**Sort Dropdown**
- Sort by:
  - Created date (newest first)
  - Created date (oldest first)
  - Health score (high to low)
  - Health score (low to high)
  - Progress (high to low)
  - Target date (soonest first)

**Status Tabs**
- **Active**: objectives in progress
- **Completed**: 100% complete objectives
- **Paused**: temporarily inactive objectives
- **All**: all objectives regardless of status

**Objective List Items**
Each list item displays:
- Objective title (clickable → detail page)
- Owner name and avatar
- Health score badge (color-coded)
- Progress percentage
- Target date
- Open blocker count (if any)
- Summary metrics (metric count, pulse check count, team size)
- Action buttons:
  - **View**: Navigate to detail page
  - **Edit**: Navigate to edit page (if permitted)
  - **⋮ Menu**: 
    - Add pulse check
    - Report blocker
    - Assign team members
    - Archive/Delete

#### User Actions
- **Create New Objective**: Opens `/dashboard/objectives/new`
- **Search Objectives**: Filter by keyword
- **Filter/Sort**: Refine objective list
- **Switch Tabs**: Change status view
- **Click Objective**: Navigate to detail page
- **Edit Objective**: Navigate to edit page (if owner/admin)
- **Quick Actions**: Add pulse/blocker via menu

#### Pagination/Loading
- Initial load: 10 objectives
- "Load More" button loads next 10
- Infinite scroll option
- Loading spinner during fetch

#### Empty States
- No objectives found: "No objectives match your search"
- No objectives in status: "No [active/completed/paused] objectives yet"

---

### 6. Create Objective Page
**Route:** `/dashboard/objectives/new`  
**Access:** Authenticated users (typically admins)  
**Purpose:** Create a new objective

#### Layout Structure
```
┌──────────────────────────────────────────────────────┐
│  [Navbar]                                            │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Create New Objective           [Cancel] [Create]   │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Basic Information                              │ │
│  │                                                │ │
│  │ Objective Title *                              │ │
│  │ [____________________________________________] │ │
│  │                                                │ │
│  │ Description                                    │ │
│  │ ┌────────────────────────────────────────────┐ │
│  │ │                                            │ │
│  │ │                                            │ │
│  │ └────────────────────────────────────────────┘ │
│  │                                                │ │
│  │ Target Date                                    │ │
│  │ [📅 Select date...]                           │ │
│  │                                                │ │
│  │ Objective Owner                                │ │
│  │ [Select team member ▾]                        │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Key Metrics                     [+ Add Metric] │ │
│  │                                                │ │
│  │ 1. Revenue Generated                           │ │
│  │    Current: $0    Target: $1,000,000          │ │
│  │    Unit: dollars    [Edit] [Remove]            │ │
│  │                                                │ │
│  │ 2. Customer Acquisition                        │ │
│  │    Current: 0     Target: 500                  │ │
│  │    Unit: customers  [Edit] [Remove]            │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Team Assignment               [+ Assign Member]│ │
│  │                                                │ │
│  │ • John Doe (Owner)                             │ │
│  │ • Sarah Smith (Member)          [Remove]       │ │
│  │ • Mike Johnson (Member)         [Remove]       │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Initial Settings                               │ │
│  │                                                │ │
│  │ Status: ○ Active  ○ Paused                    │ │
│  │                                                │ │
│  │ Initial Progress: [0]% ▬▬▬▬▬▬▬▬▬▬ 100%        │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│             [Cancel]  [Save as Draft]  [Create]     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Form Sections

**1. Basic Information**
- **Objective Title** (required)
  - Text input, max 200 characters
  - Clear, concise objective name
  - Example: "Launch Q4 Marketing Campaign"

- **Description** (optional)
  - Rich text area
  - Detailed objective explanation
  - Support for markdown formatting

- **Target Date** (optional)
  - Date picker
  - Sets expected completion date
  - Used in calculations and sorting

- **Objective Owner** (optional)
  - Dropdown of team members
  - Person responsible for objective
  - Auto-assigns current user if not specified

**2. Key Metrics**
- Add multiple metrics (Key Results)
- Each metric has:
  - **Name** (required): metric title
  - **Current Value** (default 0): starting point
  - **Target Value** (required): goal
  - **Unit** (required): measurement unit (e.g., dollars, customers, percentage)
- Metrics can be added, edited, removed
- Progress auto-calculated from metrics

**3. Team Assignment**
- Assign team members to objective
- Roles: Owner, Member, Viewer
- Search/select from team member list
- Owner automatically included
- Multiple members can be assigned

**4. Initial Settings**
- **Status**: Active or Paused (default: Active)
- **Initial Progress**: 0-100% slider (default: 0%)

#### User Actions
- **Fill Form**: Enter objective details
- **Add Metric**: Open metric form modal
- **Edit Metric**: Modify existing metric
- **Remove Metric**: Delete metric from list
- **Assign Member**: Select team member from dropdown
- **Remove Assignment**: Unassign team member
- **Cancel**: Discard changes, return to objectives list
- **Save as Draft**: Save without activating (future feature)
- **Create**: Submit form and create objective

#### Validation
- Title is required
- At least one metric recommended (warning if none)
- Target value must be greater than current value
- Owner must be valid team member
- Assigned members must be valid team members

#### Success Flow
1. Fill form with valid data
2. Click "Create"
3. Server validates and creates objective
4. Success message displayed
5. Redirect to objective detail page

#### Error Handling
- Field-level validation errors
- Server-side validation errors
- Network errors with retry option
- Duplicate objective title warning

---

### 7. Objective Detail Page
**Route:** `/dashboard/objectives/[id]`  
**Access:** Authenticated users (assigned members or admins)  
**Purpose:** View detailed information about a specific objective

#### Layout Structure
```
┌──────────────────────────────────────────────────────┐
│  [Navbar]                                            │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ← Back to Objectives                                │
│                                                      │
│  Q4 Revenue Goal                            [Edit]   │
│  Owner: John Doe                                     │
│                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ Progress │ │ Health   │ │ Status   │            │
│  │   65%    │ │ 🟢 85    │ │  Active  │            │
│  └──────────┘ └──────────┘ └──────────┘            │
│                                                      │
│  Target Date: Dec 31, 2025  •  Created: Oct 1, 2025 │
│                                                      │
│  Tabs: [Overview] [Metrics] [Pulse] [Blockers]      │
│  ┌────────────────────────────────────────────────┐ │
│  │ OVERVIEW TAB                                   │ │
│  │                                                │ │
│  │ Description                                    │ │
│  │ Achieve $1M in revenue for Q4 2025 through... │ │
│  │                                                │ │
│  │ Team Members (5)              [+ Assign]       │ │
│  │ • John Doe (Owner)                             │ │
│  │ • Sarah Smith (Member)                         │ │
│  │ • Mike Johnson (Member)                        │ │
│  │ • [Show 2 more...]                             │ │
│  │                                                │ │
│  │ Quick Actions                                  │ │
│  │ [📊 Add Pulse Check] [🚫 Report Blocker]      │ │
│  │                                                │ │
│  │ Recent Activity                                │ │
│  │ • Sarah added pulse check (2h ago)             │ │
│  │ • Progress updated to 65% (1d ago)             │ │
│  │ • New blocker reported (2d ago)                │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Tab Views

**Overview Tab** (default)
- Objective description (full text)
- Team member list with roles
- Quick action buttons
  - Add Pulse Check → Opens pulse modal
  - Report Blocker → Opens blocker modal
- Recent activity timeline
- Related objectives (future feature)

**Metrics Tab**
```
┌────────────────────────────────────────────────┐
│ METRICS TAB                     [+ Add Metric] │
│                                                │
│ 1. Revenue Generated                           │
│    Current: $650,000     Target: $1,000,000    │
│    Progress: 65%                               │
│    ▰▰▰▰▰▰▰▱▱▱                                  │
│    Last updated: 2 days ago by John            │
│    [Update Value] [Edit] [Delete]              │
│                                                │
│ 2. Customer Acquisition                        │
│    Current: 320          Target: 500           │
│    Progress: 64%                               │
│    ▰▰▰▰▰▰▱▱▱▱                                  │
│    Last updated: 1 week ago by Sarah           │
│    [Update Value] [Edit] [Delete]              │
│                                                │
│ 3. Marketing Campaign ROI                      │
│    Current: 2.1x         Target: 3.0x          │
│    Progress: 70%                               │
│    ▰▰▰▰▰▰▰▱▱▱                                  │
│    Last updated: 3 days ago by Mike            │
│    [Update Value] [Edit] [Delete]              │
│                                                │
│ Overall Progress: 66.3%                        │
│ (Average of all metrics)                       │
│                                                │
└────────────────────────────────────────────────┘
```

- List of all metrics
- Current vs target values
- Visual progress bars
- Update value button → Opens update modal
- Edit/delete actions (owner/admin only)
- History of metric updates (expandable)

**Pulse Tab**
```
┌────────────────────────────────────────────────┐
│ PULSE CHECKS                    [Add Pulse]    │
│                                                │
│ Team Sentiment Overview                        │
│ ┌────────────────────────────────────────┐   │
│ │  😊 😊 😊 😊 😊                        │   │
│ │  😊 😐 😐 😕                           │   │
│ │                                        │   │
│ │  Avg Sentiment: 3.8/5                  │   │
│ │  Avg Confidence: 4.1/5                 │   │
│ │  Total Pulse Checks: 12                │   │
│ └────────────────────────────────────────┘   │
│                                                │
│ Recent Pulse Checks                            │
│ ┌────────────────────────────────────────┐   │
│ │ Anonymous • 2 hours ago                │   │
│ │ Sentiment: 😊 (5)  Confidence: ⭐⭐⭐⭐⭐ │   │
│ │ "Team is very motivated and on track!" │   │
│ └────────────────────────────────────────┘   │
│                                                │
│ ┌────────────────────────────────────────┐   │
│ │ Sarah Smith • 1 day ago                │   │
│ │ Sentiment: 😐 (3)  Confidence: ⭐⭐⭐    │   │
│ │ "Progress is steady, but we need more  │   │
│ │  resources to accelerate."             │   │
│ └────────────────────────────────────────┘   │
│                                                │
│ [Load more pulse checks...]                    │
│                                                │
└────────────────────────────────────────────────┘
```

- Sentiment/confidence summary statistics
- Visual sentiment distribution
- Timeline of pulse checks
- Anonymous vs named submissions
- Full feedback text
- Filter by date range
- Export pulse data (admin)

**Blockers Tab**
```
┌────────────────────────────────────────────────┐
│ BLOCKERS                     [Report Blocker]  │
│                                                │
│ Open Blockers (2)                              │
│ ┌────────────────────────────────────────┐   │
│ │ 🔴 CRITICAL                            │   │
│ │ Budget Approval Delayed                │   │
│ │                                        │   │
│ │ We're waiting on CFO approval for the  │   │
│ │ additional marketing budget...         │   │
│ │                                        │   │
│ │ Status: Open                           │   │
│ │ Created: 3 days ago by Anonymous       │   │
│ │ [Mark In Progress] [Mark Resolved]     │   │
│ └────────────────────────────────────────┘   │
│                                                │
│ ┌────────────────────────────────────────┐   │
│ │ 🟡 MEDIUM                              │   │
│ │ Technical Integration Issue            │   │
│ │                                        │   │
│ │ The CRM integration is causing data    │   │
│ │ sync delays...                         │   │
│ │                                        │   │
│ │ Status: In Progress                    │   │
│ │ Created: 1 week ago by Mike Johnson    │   │
│ │ [Mark Resolved] [Edit]                 │   │
│ └────────────────────────────────────────┘   │
│                                                │
│ Resolved Blockers (3)    [Show resolved]       │
│                                                │
└────────────────────────────────────────────────┘
```

- Grouped by status (open, in-progress, resolved)
- Color-coded by severity
  - 🔴 Critical
  - 🟠 High
  - 🟡 Medium
  - 🟢 Low
- Full blocker details
- Anonymous submissions supported
- Status update buttons
- Resolved blockers collapsible

#### Header Actions
- **Edit Button** (owner/admin): Navigate to edit page
- **More Menu** (⋮):
  - Share objective
  - Export data
  - Archive objective
  - Delete objective (admin only)

#### User Actions
- Switch between tabs
- Add pulse check
- Report blocker
- Update metric values
- Assign team members
- Edit objective (if permitted)
- View activity history

#### Responsive Design
- Mobile: Stacked cards, collapsible sections
- Tablet: 2-column layout for cards
- Desktop: Full layout with sidebars

---

### 8. Edit Objective Page
**Route:** `/dashboard/objectives/[id]/edit`  
**Access:** Objective owner or admins  
**Purpose:** Modify existing objective

#### Layout Structure
Similar to Create Objective page, but:
- Pre-populated with existing data
- Title: "Edit Objective"
- Additional "Delete Objective" button (bottom, danger zone)
- Save button instead of Create button

#### Key Differences
- All fields pre-filled with current values
- Metrics can be edited or removed
- Team assignments can be modified
- Status can be changed (Active/Paused/Completed)
- Progress can be manually adjusted
- Audit trail shows last modified date/user

#### User Actions
- Update any field
- Add/remove metrics
- Add/remove team members
- Change status
- Save changes → Updates objective
- Delete objective → Confirmation modal → Permanently deletes
- Cancel → Discard changes, return to detail page

#### Validation
Same as create page, plus:
- Cannot set progress > 100%
- Cannot remove all metrics (warning)
- Cannot remove objective owner
- Deleting requires confirmation

---

### 9. Team Management Page
**Route:** `/dashboard/team`  
**Access:** Admin only  
**Purpose:** Manage team members and invitations

#### Layout Structure
```
┌──────────────────────────────────────────────────────┐
│  [Navbar]                                            │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Team Management                  [+ Invite Member]  │
│                                                      │
│  Tabs: [Team Members] [Pending Invitations]          │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ TEAM MEMBERS TAB                               │ │
│  │                                                │ │
│  │ [🔍 Search members...]              [Filter ▾] │ │
│  │                                                │ │
│  │ ┌──────────────────────────────────────────┐ │ │
│  │ │ JD  John Doe                             │ │ │
│  │ │     john@example.com                     │ │ │
│  │ │     Role: Admin  •  Active               │ │ │
│  │ │     Joined: Jan 1, 2025                  │ │ │
│  │ │     Assigned to 5 objectives             │ │ │
│  │ │     [View Objectives] [Change Role] [⋮]  │ │ │
│  │ └──────────────────────────────────────────┘ │ │
│  │                                                │ │
│  │ ┌──────────────────────────────────────────┐ │ │
│  │ │ SS  Sarah Smith                          │ │ │
│  │ │     sarah@example.com                    │ │ │
│  │ │     Role: Team Member  •  Active         │ │ │
│  │ │     Joined: Mar 15, 2025                 │ │ │
│  │ │     Assigned to 3 objectives             │ │ │
│  │ │     [View Objectives] [Change Role] [⋮]  │ │ │
│  │ └──────────────────────────────────────────┘ │ │
│  │                                                │ │
│  │ [More team members...]                         │ │
│  │                                                │ │
│  │ Showing 8 of 15 members          [Load More]   │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Pending Invitations Tab:**
```
┌────────────────────────────────────────────────┐
│ PENDING INVITATIONS TAB                        │
│                                                │
│ ┌──────────────────────────────────────────┐ │
│ │ jane@example.com                         │ │
│ │ Role: Team Member                        │ │
│ │ Sent: 2 days ago by John Doe             │ │
│ │ Expires: in 5 days                       │ │
│ │ [Resend Invitation] [Cancel]             │ │
│ └──────────────────────────────────────────┘ │
│                                                │
│ ┌──────────────────────────────────────────┐ │
│ │ bob@example.com                          │ │
│ │ Role: Admin                              │ │
│ │ Sent: 1 week ago by John Doe             │ │
│ │ Expires: tomorrow                        │ │
│ │ [Resend Invitation] [Cancel]             │ │
│ └──────────────────────────────────────────┘ │
│                                                │
│ No more pending invitations                    │
│                                                │
└────────────────────────────────────────────────┘
```

#### Key Features

**Team Members Tab**
- Search by name or email
- Filter by role (Admin/Team Member)
- Filter by status (Active/Inactive)
- Sort by name, join date, or objective count

Each member card shows:
- Avatar (initials)
- Full name
- Email address
- Role badge
- Status (Active/Inactive)
- Join date
- Number of assigned objectives
- Action buttons:
  - **View Objectives**: See member's objectives
  - **Change Role**: Toggle Admin/Team Member
  - **⋮ Menu**:
    - Edit profile
    - Deactivate account
    - Remove from team (if no active assignments)

**Pending Invitations Tab**
- List of sent invitations awaiting acceptance
- Email address
- Invited role
- Sent date and sender
- Expiration countdown
- Actions:
  - **Resend Invitation**: Send new email with fresh token
  - **Cancel**: Revoke invitation

**Invite Member Modal**
```
┌─────────────────────────────────┐
│ Invite Team Member              │
│                                 │
│ Email Address *                 │
│ [_________________________]    │
│                                 │
│ Role *                          │
│ ○ Team Member                   │
│ ○ Admin                         │
│                                 │
│ Personal Message (optional)     │
│ ┌───────────────────────────┐  │
│ │                           │  │
│ └───────────────────────────┘  │
│                                 │
│   [Cancel]  [Send Invitation]   │
└─────────────────────────────────┘
```

#### User Actions
- **Invite Member**: Open invite modal, send invitation email
- **Search Members**: Filter team list
- **Change Role**: Update member's admin status
- **Deactivate Member**: Soft delete (keeps data)
- **Remove Member**: Permanently remove (if no assignments)
- **Resend Invitation**: Send new invitation email
- **Cancel Invitation**: Revoke pending invitation

#### Security
- Admin-only access (role check)
- Cannot deactivate self
- Cannot demote last admin
- Confirmation required for destructive actions

---

### 10. Pulse Requests Inbox Page
**Route:** `/dashboard/pulse-requests`  
**Access:** All authenticated users  
**Purpose:** View and respond to admin-sent pulse requests

#### Layout Structure
```
┌──────────────────────────────────────────────────────┐
│  [Navbar - notification bell highlighted if pending] │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Pulse Requests                                      │
│                                                      │
│  Tabs: [Pending (3)] [Completed] [All]              │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ 🔔 Q4 Revenue Goal - Weekly Check-in           │ │
│  │                                                │ │
│  │ From: John Doe (Admin)                         │ │
│  │ Objective: Q4 Revenue Goal                     │ │
│  │ Due: Tomorrow (Oct 5, 2025)                    │ │
│  │                                                │ │
│  │ "Please provide your weekly pulse check for   │ │
│  │  the Q4 revenue objective. Let us know how    │ │
│  │  you're feeling about progress and any        │ │
│  │  concerns."                                    │ │
│  │                                                │ │
│  │         [Respond Now]      [View Objective]    │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ 🔔 Product Launch - Blocker Check              │ │
│  │                                                │ │
│  │ From: Sarah Smith (Admin)                      │ │
│  │ Objective: Product Launch                      │ │
│  │ Due: In 3 days (Oct 7, 2025)                   │ │
│  │                                                │ │
│  │ "We've noticed some blockers. Please share    │ │
│  │  your perspective on current challenges."      │ │
│  │                                                │ │
│  │         [Respond Now]      [View Objective]    │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  [More pulse requests...]                            │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Key Features

**Pending Tab** (default)
- Requests awaiting response
- Sorted by due date (soonest first)
- Due date badge with urgency color:
  - Red: Overdue
  - Orange: Due today
  - Yellow: Due within 3 days
  - Green: Due in >3 days

**Completed Tab**
- Previously responded requests
- Shows response date
- Option to view submitted pulse check

**All Tab**
- All requests regardless of status
- Filter/sort controls

Each request card displays:
- Request title
- Sender name and role
- Related objective (clickable link)
- Due date with countdown
- Custom message from admin
- Action buttons:
  - **Respond Now**: Opens pulse check modal
  - **View Objective**: Navigate to objective detail

**Respond Modal**
Opens simplified pulse check modal pre-filled with:
- Objective context
- Request details
- Standard pulse form (sentiment, confidence, feedback)

#### User Actions
- **Switch Tabs**: View pending/completed/all requests
- **Respond to Request**: Submit pulse check (marks as completed)
- **View Objective**: Navigate to related objective detail page
- **Mark as Read**: Acknowledge request (future feature)

#### Notifications
- Badge count on navbar notification icon
- Email notifications for new requests (optional)
- Browser push notifications (optional)

#### Empty States
- No pending requests: "No pulse requests at this time"
- No completed requests: "You haven't responded to any requests yet"

---

### 11. Profile Page
**Route:** `/dashboard/profile`  
**Access:** All authenticated users  
**Purpose:** View and edit personal account information

#### Layout Structure
```
┌──────────────────────────────────────────────────────┐
│  [Navbar]                                            │
├──────────────────────────────────────────────────────┤
│                                                      │
│                    [Avatar: JD]                      │
│                                                      │
│                Profile Settings                      │
│           Update your account information            │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Personal Information                           │ │
│  │                                                │ │
│  │ First Name *                                   │ │
│  │ [John________________]                        │ │
│  │                                                │ │
│  │ Last Name *                                    │ │
│  │ [Doe_________________]                        │ │
│  │                                                │ │
│  │ Email Address                                  │ │
│  │ john@example.com (cannot be changed)           │ │
│  │                                                │ │
│  │ Role                                           │ │
│  │ Admin (assigned by organization)               │ │
│  │                                                │ │
│  │ [Update Profile]                               │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Change Password                                │ │
│  │                                                │ │
│  │ Current Password                               │ │
│  │ [________________] 👁                         │ │
│  │                                                │ │
│  │ New Password                                   │ │
│  │ [________________] 👁                         │ │
│  │                                                │ │
│  │ Confirm New Password                           │ │
│  │ [________________] 👁                         │ │
│  │                                                │ │
│  │ [Change Password]                              │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Account Information                            │ │
│  │                                                │ │
│  │ Member Since: January 1, 2025                  │ │
│  │ Last Login: 2 hours ago                        │ │
│  │ Account Status: Active                         │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Form Sections

**Personal Information**
- **First Name** (editable, required)
- **Last Name** (editable, required)
- **Email** (read-only display)
- **Role** (read-only display)
- Avatar/profile picture upload (future feature)

**Change Password**
- **Current Password** (required for verification)
- **New Password** (required, minimum 6 characters)
- **Confirm New Password** (must match new password)
- Show/hide password toggles
- Password strength indicator

**Account Information** (read-only)
- Member since date
- Last login timestamp
- Account status
- Total objectives assigned
- Total pulse checks submitted

#### User Actions
- **Update Profile**: Save name changes
- **Change Password**: Update password after validation
- **Upload Avatar**: Change profile picture (future)
- **Delete Account**: Request account deletion (future, with admin approval)

#### Validation
- First/last name cannot be empty
- Current password must be correct
- New password must be at least 6 characters
- New password must match confirmation
- New password cannot be same as current

#### Success/Error Messages
- "Profile updated successfully"
- "Password changed successfully"
- "Current password is incorrect"
- "Passwords do not match"
- "Password must be at least 6 characters"

---

## Modal Dialogs

### Pulse Check Modal
**Purpose:** Submit quick pulse check for an objective

```
┌──────────────────────────────────┐
│ Pulse Check: Q4 Revenue Goal     │
│                                  │
│ How do you feel about this       │
│ objective's progress?            │
│                                  │
│  😞  😕  😐  🙂  😊             │
│  1   2   3   4   5               │
│ (Selected: 4)                    │
│                                  │
│ How confident are you in         │
│ achieving this objective?        │
│                                  │
│ 1 ▬▬▬▬▬▬▬▬⬤▬ 5                 │
│ (Selected: 4)                    │
│                                  │
│ Additional Feedback (optional)   │
│ ┌──────────────────────────────┐ │
│ │ Team morale is high, but we  │ │
│ │ need more marketing budget   │ │
│ └──────────────────────────────┘ │
│                                  │
│ ☑ Submit anonymously             │
│                                  │
│   [Cancel]      [Submit Pulse]   │
└──────────────────────────────────┘
```

**Fields:**
- Sentiment selector (1-5 emoji scale)
- Confidence slider (1-5)
- Feedback textarea (optional)
- Anonymous checkbox

### Blocker Modal
**Purpose:** Report an obstacle blocking objective progress

```
┌──────────────────────────────────┐
│ Report Blocker                   │
│                                  │
│ Objective: Q4 Revenue Goal       │
│                                  │
│ Blocker Title *                  │
│ [__________________________]    │
│                                  │
│ Description *                    │
│ ┌──────────────────────────────┐ │
│ │ Detailed description of the  │ │
│ │ issue blocking progress...   │ │
│ └──────────────────────────────┘ │
│                                  │
│ Severity *                       │
│ ○ Low  ○ Medium ⦿ High ○ Critical│
│                                  │
│ ☑ Submit anonymously             │
│                                  │
│   [Cancel]    [Report Blocker]   │
└──────────────────────────────────┘
```

**Fields:**
- Blocker title (required)
- Description (required, rich text)
- Severity selector (required)
- Anonymous checkbox

---

## Navigation Patterns

### Primary Navigation
- Logo → Dashboard home
- Dashboard → `/dashboard`
- Objectives → `/dashboard/objectives`
- Team (admin) → `/dashboard/team`
- Notifications → `/dashboard/pulse-requests`
- Profile dropdown → `/dashboard/profile`, Sign out

### Breadcrumbs
- Dashboard > Objectives
- Dashboard > Objectives > Q4 Revenue Goal
- Dashboard > Objectives > Q4 Revenue Goal > Edit
- Dashboard > Team Management

### Back Navigation
- Back button on detail pages returns to list
- Cancel buttons discard changes and return
- Browser back button supported

---

## Responsive Design Breakpoints

### Mobile (< 768px)
- Single column layout
- Stacked cards
- Hamburger menu for navigation
- Simplified tables → card view
- Touch-friendly buttons (min 44px)

### Tablet (768px - 1024px)
- 2-column grid where appropriate
- Condensed sidebar
- Responsive tables

### Desktop (> 1024px)
- Full multi-column layouts
- Expanded sidebar
- Data tables with all columns
- Side-by-side forms

---

## Accessibility Features

### Keyboard Navigation
- Tab order follows logical flow
- Skip to main content link
- Focus indicators visible
- Keyboard shortcuts (future feature)

### Screen Readers
- ARIA labels on all interactive elements
- Semantic HTML structure
- Alt text for images
- Role attributes

### Visual Accessibility
- Sufficient color contrast (WCAG AA)
- Focus indicators
- Error messages linked to inputs
- Loading states announced

---

*Last Updated: 2025-10-03*
*UI Version: 1.0 (MVP)*
