# API Integration Guide

## Overview

This document describes how the Homework Diary frontend integrates with the Laravel backend API.

## Base Configuration

- **API Base URL**: `http://127.0.0.1:8000/api`
- **Authentication**: Bearer token (stored in localStorage)
- **API Service**: `src/services/api.js`

## Authentication Flow

### Login Process

1. User enters email, password, and selects role (Professor or Admin)
2. Frontend calls `POST /api/login` with email and password
3. Backend returns token and user object with role
4. Frontend validates that user's role matches selected role
5. Token and user data are stored in localStorage
6. User is redirected to appropriate dashboard based on role

### Login Credentials (from seeder)

**Admin:**
- Email: `admin@example.com`
- Password: `password`

**Professors:**
- 8 seeded professors with auto-generated emails
- All passwords: `password`

## API Service Structure

The `src/services/api.js` file provides organized API methods:

### Auth API

```javascript
import { authAPI } from './services/api'

// Login
const response = await authAPI.login(email, password)
// Returns: { token: string, user: { id, name, email, role } }

// Logout
await authAPI.logout()

// Get current user
const user = await authAPI.getUser()
```

### Admin APIs

All admin endpoints require `role: "admin"` and valid bearer token.

#### Professors Management

```javascript
import { adminProfessorsAPI } from './services/api'

// List professors (paginated)
const professors = await adminProfessorsAPI.list(page)

// Create professor
const newProf = await adminProfessorsAPI.create({
  name: "John Doe",
  email: "john@example.com",
  password: "password123"
})

// Show single professor
const prof = await adminProfessorsAPI.show(id)

// Update professor
const updated = await adminProfessorsAPI.update(id, {
  name: "Jane Doe",
  email: "jane@example.com"
})

// Delete professor
await adminProfessorsAPI.delete(id)
```

#### Filières (Programs)

```javascript
import { adminFilieresAPI } from './services/api'

// List, create, show, update, delete
const filieres = await adminFilieresAPI.list(page)
const newFiliere = await adminFilieresAPI.create({ name: "Computer Science" })
const filiere = await adminFilieresAPI.show(id)
const updated = await adminFilieresAPI.update(id, { name: "CS Updated" })
await adminFilieresAPI.delete(id)
```

#### Modules

```javascript
import { adminModulesAPI } from './services/api'

// Create module linked to a filière
const module = await adminModulesAPI.create({
  name: "Data Structures",
  filiere_id: 1
})

// List, show, update, delete
const modules = await adminModulesAPI.list(page)
const module = await adminModulesAPI.show(id)
const updated = await adminModulesAPI.update(id, { name: "Algorithms" })
await adminModulesAPI.delete(id)
```

#### Matières (Subjects)

```javascript
import { adminMatieresAPI } from './services/api'

// Create matière linked to a module
const matiere = await adminMatieresAPI.create({
  name: "Binary Trees",
  module_id: 1
})

// List, show, update, delete
const matieres = await adminMatieresAPI.list(page)
```

#### Groupes (Groups)

```javascript
import { adminGroupesAPI } from './services/api'

// Create groupe linked to a filière
const groupe = await adminGroupesAPI.create({
  name: "Group A",
  filiere_id: 1
})

// List, show, update, delete
const groupes = await adminGroupesAPI.list(page)
```

#### Assignments

Assignments link professors to specific modules and groups.

```javascript
import { adminAssignmentsAPI } from './services/api'

// List all assignments
const assignments = await adminAssignmentsAPI.list(page)

// Create assignment (professor to module + group)
const assignment = await adminAssignmentsAPI.create({
  user_id: 5,        // professor id
  module_id: 10,     // module id
  groupe_id: 3       // group id
})

// Delete assignment
await adminAssignmentsAPI.delete(id)
```

#### Logbooks (Admin View)

```javascript
import { adminLogbooksAPI } from './services/api'

// List all logbooks across all professors
const logbooks = await adminLogbooksAPI.list(page)
```

### Professor APIs

All professor endpoints require `role: "professor"` and valid bearer token.

#### My Assignments

```javascript
import { professorAssignmentsAPI } from './services/api'

// Get my assignments (modules and groups I'm assigned to)
const myAssignments = await professorAssignmentsAPI.myAssignments()
```

#### Logbooks

```javascript
import { professorLogbooksAPI } from './services/api'

// List my logbooks
const myLogbooks = await professorLogbooksAPI.list()

// Create logbook entry
const logbook = await professorLogbooksAPI.create({
  module_id: 10,
  groupe_id: 3,
  session_date: "2025-11-24",
  session_type: "cours",  // or "TP"
  contenu_traite: "Introduction to Binary Trees",
  remarques: "Students engaged well"  // optional
})
```

## Token Management

The API service automatically handles token storage and inclusion in requests:

```javascript
import { setToken, getToken, removeToken, setUser, getUser, removeUser } from './services/api'

// Store after login
setToken(token)
setUser(user)

// Retrieve
const token = getToken()
const user = getUser()

// Clear on logout
removeToken()
removeUser()
```

## Error Handling

The API service throws errors that can be caught:

```javascript
try {
  const response = await authAPI.login(email, password)
} catch (error) {
  console.error(error.message)
  // Display error to user
}
```

Common error codes:
- `401 Unauthorized` - Invalid credentials or missing token
- `403 Forbidden` - Role mismatch or insufficient permissions
- `422 Unprocessable Entity` - Validation errors

## Response Formats

### Pagination

List endpoints return paginated data:

```javascript
{
  data: [...],          // Array of resources
  links: {
    first: "...",
    last: "...",
    prev: null,
    next: "..."
  },
  meta: {
    current_page: 1,
    from: 1,
    last_page: 5,
    per_page: 15,
    to: 15,
    total: 67
  }
}
```

### Resource Formats

**User:**
```javascript
{ id: number, name: string, email: string, role: "admin"|"professor" }
```

**Filière:**
```javascript
{ id: number, name: string }
```

**Module:**
```javascript
{ id: number, name: string, filiere_id: number }
```

**Matière:**
```javascript
{ id: number, name: string, module_id: number }
```

**Groupe:**
```javascript
{ id: number, name: string, filiere_id: number }
```

**Assignment:**
```javascript
{
  id: number,
  user_id: number,
  module_id: number,
  groupe_id: number,
  module: ModuleResource,
  groupe: GroupeResource
}
```

**Cahier de Texte (Logbook):**
```javascript
{
  id: number,
  user_id: number,
  module_id: number,
  groupe_id: number,
  session_date: "YYYY-MM-DD",
  session_type: "cours"|"TP",
  contenu_traite: string,
  remarques: string|null,
  module: ModuleResource,
  groupe: GroupeResource
}
```

## Integration Examples

### Complete Login Flow

```javascript
import { authAPI } from './services/api'

const handleLogin = async (email, password, selectedRole) => {
  try {
    const response = await authAPI.login(email, password)

    // Verify role matches
    if (response.user.role !== selectedRole) {
      throw new Error('Invalid role selected')
    }

    // Navigate to dashboard
    if (response.user.role === 'admin') {
      navigateToAdminDashboard()
    } else {
      navigateToProfessorDashboard()
    }
  } catch (error) {
    showError(error.message)
  }
}
```

### Admin Creating Assignment

```javascript
import { adminProfessorsAPI, adminAssignmentsAPI } from './services/api'

// List professors to select from
const professors = await adminProfessorsAPI.list()

// Create assignment
const assignment = await adminAssignmentsAPI.create({
  user_id: selectedProfessorId,
  module_id: selectedModuleId,
  groupe_id: selectedGroupeId
})
```

### Professor Creating Logbook

```javascript
import { professorAssignmentsAPI, professorLogbooksAPI } from './services/api'

// Get my assignments first
const assignments = await professorAssignmentsAPI.myAssignments()

// Create logbook for assigned module/group
const logbook = await professorLogbooksAPI.create({
  module_id: assignments.data[0].module_id,
  groupe_id: assignments.data[0].groupe_id,
  session_date: new Date().toISOString().split('T')[0],
  session_type: "cours",
  contenu_traite: "Today's lesson content"
})
```

## CORS Configuration

Make sure your Laravel backend has CORS properly configured to allow requests from your frontend origin.

## Development Setup

1. Start Laravel backend: `php artisan serve --host=127.0.0.1 --port=8000`
2. Start React frontend: `npm run dev`
3. Backend API will be available at `http://127.0.0.1:8000/api`
4. Frontend will proxy API requests

## Security Notes

- Tokens are stored in localStorage (consider using httpOnly cookies for production)
- Always validate user roles on the backend
- Never trust client-side role checks alone
- All API endpoints are protected by Laravel Sanctum middleware
