# Admin API Reference

## Overview

Admin endpoints manage professors, filières, modules, matières, groupes, assignments, and logbooks. All endpoints require a valid bearer token and an authenticated user with `role='admin'`.

- Base URL: `http://127.0.0.1:8000/api`
- Auth header: `Authorization: Bearer <token>`
- Routes file: `laravel-app/routes/api.php:21–35`
- Controllers: under `laravel-app/app/Http/Controllers/*`
- Validation: under `laravel-app/app/Http/Requests/*`
- Resources (response shapes): under `laravel-app/app/Http/Resources/*`

## Conventions

- JSON request bodies must be `application/json`.
- List endpoints return paginated collections `{ data: [...], links: {...}, meta: {...} }`.
- IDs are numeric path parameters.
- Errors:
  - `401` Unauthorized (invalid/missing token) — `laravel-app/app/Http/Controllers/AuthController.php:20–22`
  - `403` Forbidden (not admin) — `laravel-app/app/Http/Middleware/AdminMiddleware.php:13–17`
  - `422` Validation errors — enforced by FormRequest classes

## Authentication (for context)

- Login: `POST /api/login` returns `{ token, user }` — `laravel-app/app/Http/Controllers/AuthController.php:16–25`
- Logout: `POST /api/logout` revokes current token — `laravel-app/app/Http/Controllers/AuthController.php:30–37`

## Professors

Controller: `laravel-app/app/Http/Controllers/AdminProfessorController.php:11–51`
Routes: `laravel-app/routes/api.php:21–25`

- GET `/api/admin/professeurs`
  - Purpose: List professors
  - Response: paginated `UserResource` collection `{ data: [{ id, name, email, role }], links, meta }`

- POST `/api/admin/professeurs`
  - Purpose: Create a professor
  - Request body: `{ name: string, email: string, password: string(min:8) }`
  - Validation: `StoreProfessorRequest` `laravel-app/app/Http/Requests/StoreProfessorRequest.php:16–21`
  - Response: `UserResource` `{ id, name, email, role }`

- GET `/api/admin/professeurs/{id}`
  - Purpose: Show a professor
  - Response: `UserResource`

- PUT `/api/admin/professeurs/{id}`
  - Purpose: Update a professor
  - Request body: `{ name?: string, email?: string(unique), password?: string(min:8) }`
  - Validation: `UpdateProfessorRequest` `laravel-app/app/Http/Requests/UpdateProfessorRequest.php:16–22`
  - Response: `UserResource`

- DELETE `/api/admin/professeurs/{id}`
  - Purpose: Delete a professor
  - Response: `{ message: "Deleted" }`

Example (cURL):
```
TOKEN=... # admin token
curl -s -X POST 'http://127.0.0.1:8000/api/admin/professeurs' \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"name":"Prof A","email":"prof.a@example.com","password":"password"}'
```

## Filières

Controller: `laravel-app/app/Http/Controllers/FiliereController.php:9–39`
Routes: `laravel-app/routes/api.php:25`

- GET `/api/admin/filieres` — List
- POST `/api/admin/filieres` — Create `{ name }`
  - Validation: `StoreFiliereRequest` `laravel-app/app/Http/Requests/StoreFiliereRequest.php:16–19`
  - Response: `FiliereResource` `{ id, name }`
- GET `/api/admin/filieres/{id}` — Show
- PUT `/api/admin/filieres/{id}` — Update `{ name? }`
  - Validation: `UpdateFiliereRequest` `laravel-app/app/Http/Requests/UpdateFiliereRequest.php:16–19`
  - Response: `FiliereResource`
- DELETE `/api/admin/filieres/{id}` — Delete `{ message: "Deleted" }`

## Modules

Controller: `laravel-app/app/Http/Controllers/ModuleController.php:9–39`
Routes: `laravel-app/routes/api.php:26`

- GET `/api/admin/modules` — List
- POST `/api/admin/modules` — Create `{ name, filiere_id }`
  - Validation: `StoreModuleRequest` `laravel-app/app/Http/Requests/StoreModuleRequest.php:16–19`
  - Response: `ModuleResource` `{ id, name, filiere_id }`
- GET `/api/admin/modules/{id}` — Show
- PUT `/api/admin/modules/{id}` — Update `{ name?, filiere_id? }`
  - Validation: `UpdateModuleRequest` `laravel-app/app/Http/Requests/UpdateModuleRequest.php:16–19`
  - Response: `ModuleResource`
- DELETE `/api/admin/modules/{id}` — Delete `{ message: "Deleted" }`

## Matières

Controller: `laravel-app/app/Http/Controllers/MatiereController.php:9–39`
Routes: `laravel-app/routes/api.php:27`

- GET `/api/admin/matieres` — List
- POST `/api/admin/matieres` — Create `{ name, module_id }`
  - Validation: `StoreMatiereRequest` `laravel-app/app/Http/Requests/StoreMatiereRequest.php:16–19`
  - Response: `MatiereResource` `{ id, name, module_id }`
- GET `/api/admin/matieres/{id}` — Show
- PUT `/api/admin/matieres/{id}` — Update `{ name?, module_id? }`
  - Validation: `UpdateMatiereRequest` `laravel-app/app/Http/Requests/UpdateMatiereRequest.php:16–19`
  - Response: `MatiereResource`
- DELETE `/api/admin/matieres/{id}` — Delete `{ message: "Deleted" }`

## Groupes

Controller: `laravel-app/app/Http/Controllers/GroupeController.php:9–39`
Routes: `laravel-app/routes/api.php:28`

- GET `/api/admin/groupes` — List
- POST `/api/admin/groupes` — Create `{ name, filiere_id }`
  - Validation: `StoreGroupeRequest` `laravel-app/app/Http/Requests/StoreGroupeRequest.php:16–20`
  - Response: `GroupeResource` `{ id, name, filiere_id }`
- GET `/api/admin/groupes/{id}` — Show
- PUT `/api/admin/groupes/{id}` — Update `{ name?, filiere_id? }`
  - Validation: `UpdateGroupeRequest` `laravel-app/app/Http/Requests/UpdateGroupeRequest.php:16–20`
  - Response: `GroupeResource`
- DELETE `/api/admin/groupes/{id}` — Delete `{ message: "Deleted" }`

## Assignments

Controller: `laravel-app/app/Http/Controllers/AssignmentController.php:9–31`
Routes: `laravel-app/routes/api.php:30–32`

- GET `/api/admin/assignments` — List assignments
  - Response: `AssignmentResource` collection: `{ id, user_id, module_id, groupe_id, module?, groupe? }`
- POST `/api/admin/assignments` — Create `{ user_id, module_id, groupe_id }`
  - Validation: `StoreAssignmentRequest` `laravel-app/app/Http/Requests/StoreAssignmentRequest.php:16–21`
  - Duplicate: returns `422 { message: "Duplicate assignment" }` `laravel-app/app/Http/Controllers/AssignmentController.php:16–18`
  - Response: `AssignmentResource` (with relations loaded)
- DELETE `/api/admin/assignments/{id}` — Delete `{ message: "Deleted" }`

## Logbooks (Admin)

Controller: `laravel-app/app/Http/Controllers/AdminLogbookController.php:9–14`
Routes: `laravel-app/routes/api.php:34`

- GET `/api/admin/logbooks` — List all logbooks across professors (ordered by `session_date` desc)
  - Response: `CahierDeTexteResource` collection: `{ id, user_id, module_id, groupe_id, session_date, session_type, contenu_traite, remarques, module?, groupe? }`

## Common cURL Snippets

Get token:
```
curl -s -X POST 'http://127.0.0.1:8000/api/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"password"}'
```

Create filière:
```
TOKEN=...
curl -s -X POST 'http://127.0.0.1:8000/api/admin/filieres' \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"name":"Informatique"}'
```

Create module:
```
curl -s -X POST 'http://127.0.0.1:8000/api/admin/modules' \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"name":"Bases de données","filiere_id":1}'
```

Create professor:
```
curl -s -X POST 'http://127.0.0.1:8000/api/admin/professeurs' \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"name":"Prof Test","email":"prof.test@example.com","password":"password"}'
```

Create assignment:
```
curl -s -X POST 'http://127.0.0.1:8000/api/admin/assignments' \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"user_id":1,"module_id":10,"groupe_id":5}'
```

List admin logbooks:
```
curl -s -X GET 'http://127.0.0.1:8000/api/admin/logbooks' \
  -H "Authorization: Bearer $TOKEN"
```

## Troubleshooting

- 405 Method Not Allowed: ensure you use member path for updates (`PUT /api/admin/{resource}/{id}`), not collection path.
- HTML response instead of JSON: verify you are calling `/api/...` and the Laravel server is running; avoid calling `swagger.html`.
- No rows appear in DB: confirm `.env` DB matches your MySQL instance and port; verify via `php artisan tinker` or MySQL CLI.

