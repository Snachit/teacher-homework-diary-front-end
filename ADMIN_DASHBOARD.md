# Admin Dashboard Documentation

## Overview

The Admin Dashboard is a comprehensive management interface built with the **Modern Bento Folio** design aesthetic. It provides real-time monitoring and management capabilities for the Homework Diary application.

## Design System

### Visual Style
- **Aesthetic**: Clean, Intellectual, High-End
- **Layout**: Bento Grid + Split-Pane architecture
- **Theme**: "Folio" Academic Theme

### Color Palette
- **Background**: #F7F4ED (Cream/Paper)
- **Primary**: #1A8917 (Forest Green)
- **Accent**: #D4A373 (Old Gold)
- **Text**: #242424 (Charcoal)

### Typography
- **Serif**: Playfair Display (headings, numbers)
- **Sans-serif**: Inter (body text, UI)

## Component Architecture

### 1. Sidebar Component
**File**: `src/components/admin/Sidebar.jsx`

**Features**:
- Fixed width (w-64) with Forest Green background
- Collapsible Academics accordion
- Active state highlighting
- Logout functionality

**Menu Structure** (Swagger-compliant):
```
Overview (LayoutDashboard icon)
Professors (Users icon) → /admin/professeurs
Assignments (Link icon) → /admin/assignments
Academics (Library icon - Accordion)
  ├─ Filières (GraduationCap icon)
  ├─ Modules (BookOpen icon)
  ├─ Matières (Layers icon)
  └─ Groupes (UsersRound icon)
Logbooks (FileText icon) → /admin/logbooks
```

**Props**:
- `activeMenu`: Current active menu item (default: "overview")
- `onMenuChange`: Callback when menu item is clicked
- `onLogout`: Logout handler

### 2. DashboardHome Component
**File**: `src/components/admin/DashboardHome.jsx`

**Layout Structure**:

#### Part A: Stats Row (Bento Grid)
4 summary cards in a grid layout (`grid-cols-4`):

1. **Total Professors** (24)
   - Icon: Users
   - Action: "Add New" button
   - Color: Forest Green

2. **Active Groups** (12)
   - Icon: UsersRound
   - Color: Old Gold

3. **Modules Assigned** (85%)
   - Icon: BookOpen
   - Color: Forest Green

4. **Logbooks Today** (8)
   - Icon: CheckCircle
   - Color: Old Gold

**Design Details**:
- Serif fonts for numbers (`font-serif text-5xl`)
- White cards with hover shadow effect
- Rounded corners (`rounded-3xl`)
- Icon badges in colored backgrounds

#### Part B: Live Session Monitor (Split View)
Consumes `/admin/logbooks` endpoint data.

**Layout**: Unequal columns (`grid-cols-12`)

**Left Column** (col-span-4): "Incoming Feed"
- Scrollable list of logbook submissions
- Each item shows:
  - Professor avatar (initials)
  - Professor name
  - Module name
  - Submission time
  - Status indicator dot (Green = Validated, Orange = Pending)
- Click to select and view details

**Right Column** (col-span-8): "Quick Review Panel"
- Full detail view of selected logbook
- **Header**:
  - Session type badge (Cours/TP)
  - Formatted date
  - Module name (serif heading)
- **Meta Info**:
  - Professor name
  - Group name
  - Submission time
- **Body**:
  - Session content (`contenu_traite`)
  - Remarks section (if present)
- **Actions**:
  - "Flag Issue" button (Red)
  - "Validate" button (Green)

### 3. AdminDashboard Container
**File**: `src/components/admin/AdminDashboard.jsx`

**Purpose**: Main container that manages routing between sections

**Features**:
- Menu state management
- Logout with API integration
- Content switching based on active menu
- Error handling for logout

**Props**:
- `onLogout`: Callback to return to landing page

## Data Structures

### Mock Logbook Data
Based on Swagger API response structure:

```javascript
{
  id: number,
  user: {
    id: number,
    name: string,
    email: string
  },
  module: {
    id: number,
    name: string,
    filiere_id: number
  },
  groupe: {
    id: number,
    name: string,
    filiere_id: number
  },
  session_date: "YYYY-MM-DD",
  session_type: "cours" | "TP",
  contenu_traite: string,
  remarques: string | null,
  status: "validated" | "pending",
  submitted_at: string
}
```

### Stats Data
```javascript
{
  totalProfessors: number,
  activeGroups: number,
  modulesAssigned: number,  // percentage
  logbooksToday: number
}
```

## Interactions

### Navigation Flow
1. User clicks menu item in Sidebar
2. `onMenuChange` callback is triggered
3. `activeMenu` state updates
4. Main content area switches to corresponding view
5. Active menu item is highlighted in sidebar

### Logbook Review Flow
1. Admin views list of recent logbooks
2. Clicks on a logbook item
3. Detail panel updates to show full content
4. Admin can:
   - Read session content
   - Review remarks
   - Validate the logbook
   - Flag issues

### Academics Accordion
1. Click on "Academics" menu item
2. Submenu expands/collapses
3. Chevron icon rotates (Down/Right)
4. Submenu items (Filières, Modules, etc.) become visible

## API Integration Points

### Current Implementation
- Mock data for demonstration
- TODO comments for API integration

### Future API Connections
```javascript
// Stats data
GET /admin/statistics

// Logbooks feed
GET /admin/logbooks?page=1

// Validate logbook
POST /admin/logbooks/{id}/validate

// Flag logbook
POST /admin/logbooks/{id}/flag
```

## Styling Patterns

### Card Components
```javascript
// Base card
"bg-white rounded-3xl p-6 shadow-lg border border-[#242424]/5"

// Hover effect
"hover:shadow-xl transition-shadow"

// Active state
"border-[#1A8917] shadow-md"
```

### Status Indicators
```javascript
// Validated (Green)
"w-2 h-2 rounded-full bg-green-500"

// Pending (Orange)
"w-2 h-2 rounded-full bg-orange-500"
```

### Badges
```javascript
// Cours badge
"bg-[#1A8917]/10 text-[#1A8917] px-4 py-1.5 rounded-full"

// TP badge
"bg-[#D4A373]/10 text-[#D4A373] px-4 py-1.5 rounded-full"
```

### Buttons
```javascript
// Primary action (Validate)
"bg-[#1A8917] text-white rounded-xl shadow-lg hover:bg-[#1A8917]/90"

// Secondary action (Flag)
"bg-red-50 text-red-600 rounded-xl hover:bg-red-100"
```

## Responsive Behavior

### Desktop (Default)
- Full sidebar visible
- Bento grid: 4 columns
- Split view: 4/8 columns

### Tablet (md breakpoint)
- Sidebar collapses to icons only
- Bento grid: 2 columns
- Split view: Full width stacked

### Mobile (sm breakpoint)
- Hamburger menu for sidebar
- Bento grid: 1 column
- Split view: Single column

## Performance Considerations

1. **Virtual Scrolling**: For long logbook lists
2. **Lazy Loading**: Load logbooks on demand
3. **Debounced Search**: When filtering is added
4. **Memoization**: Optimize re-renders with React.memo
5. **Code Splitting**: Lazy load dashboard sections

## Future Enhancements

### Planned Features
- [ ] Real-time updates via WebSocket
- [ ] Advanced filtering and search
- [ ] Export functionality
- [ ] Analytics charts
- [ ] Bulk actions
- [ ] Notification system
- [ ] Dark mode support

### Additional Sections
- [ ] Professors management CRUD
- [ ] Filières management
- [ ] Modules management
- [ ] Matières management
- [ ] Groupes management
- [ ] Assignments management
- [ ] Detailed analytics dashboard

## File Structure

```
src/components/admin/
├── AdminDashboard.jsx      # Main container
├── Sidebar.jsx             # Navigation sidebar
├── DashboardHome.jsx       # Overview page (Bento + Split)
└── LogbookFeed.jsx         # Legacy feed view (deprecated)
```

## Usage Example

```jsx
import AdminDashboard from './components/admin/AdminDashboard'

function App() {
  const handleLogout = () => {
    // Logout logic
    navigateToHome()
  }

  return (
    <AdminDashboard onLogout={handleLogout} />
  )
}
```

## Testing Checklist

- [ ] Sidebar navigation works
- [ ] Academics accordion toggles
- [ ] Logbook selection updates detail view
- [ ] Validate button triggers action
- [ ] Flag button triggers action
- [ ] Logout button works
- [ ] Active states are correct
- [ ] Responsive layout adapts
- [ ] Icons load correctly
- [ ] Colors match design system
