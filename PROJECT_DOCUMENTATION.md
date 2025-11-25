# Teacher Diary Homework Backend – Project Documentation

## Overview

This repository contains a Laravel-based backend for a teacher diary / homework management system. It exposes a RESTful API secured by Laravel Sanctum with role-based access (admin, professeur). The API manages users (professeurs), academic structures (filières, modules, matières, groupes), assignments (linking professeurs to modules and groupes), and professor logbooks (cahiers de texte).

- Framework: Laravel 12
- Auth: Sanctum bearer tokens
- DB: MySQL (`homework_diary`)
- JSON responses: Laravel API Resources
- Pagination: Laravel paginator (page, per-page)

## Runtime & Environment

- Entry point: `laravel-app/public/index.php`
- Routing bootstrap: `laravel-app/bootstrap/app.php:9–15`
- Web routes: `laravel-app/routes/web.php:5–6` (serves `welcome`)
- API routes: `laravel-app/routes/api.php:15–42`
- Server health: `GET /up` (configured in `bootstrap/app.php:11–13`)

Environment (`laravel-app/.env`):
- `DB_CONNECTION=mysql`
- `DB_HOST=127.0.0.1`
- `DB_PORT=3306`
- `DB_DATABASE=homework_diary`
- `DB_USERNAME=root`
- `DB_PASSWORD=123456`

Run locally:
- `php artisan migrate --force`
- `php artisan db:seed --force`
- `php artisan serve --host=127.0.0.1 --port=8000`

## Authentication

Uses Laravel Sanctum bearer tokens. Login returns a token; authenticated endpoints require `Authorization: Bearer <token>`.

- Login: `AuthController::login` `laravel-app/app/Http/Controllers/AuthController.php:16–25`
- Logout: `AuthController::logout` `laravel-app/app/Http/Controllers/AuthController.php:30–37`
- Me: `AuthController::user` `laravel-app/app/Http/Controllers/AuthController.php:42–45`

Sanctum configuration: `laravel-app/config/sanctum.php:18–23, 37–50`

## Roles & Access Control

Middleware aliases are configured in `laravel-app/bootstrap/app.php:14–18`:
- `admin`: `laravel-app/app/Http/Middleware/AdminMiddleware.php:9–17`
- `professeur`: `laravel-app/app/Http/Middleware/ProfessorMiddleware.php:9–17`

API route groups (`laravel-app/routes/api.php:17–41`):
- `auth:sanctum` → required for all below
- `admin` → admin-only endpoints
- `professeur` → professor-only endpoints

## Data Model

Tables (migrations):
- Users: `0001_01_01_000000_create_users_table.php:14–23` (fields: `name`, `email` unique, `password`, `role` enum: `admin | professeur`)
- Filières: `2025_11_16_000002_create_filieres_table.php:10–14`
- Modules: `2025_11_16_000003_create_modules_table.php:10–15` (`filiere_id`)
- Matières: `2025_11_16_000004_create_matieres_table.php:10–15` (`module_id`)
- Groupes: `2025_11_16_000005_create_groupes_table.php:10–15` (`filiere_id`)
- Assignments: `2025_11_16_000006_create_assignments_table.php:10–16` (unique triplet `user_id`, `module_id`, `groupe_id`)
- Cahiers de texte: `2025_11_16_000007_create_cahiers_de_texte_table.php:10–19`
- Personal access tokens: `2025_11_16_204303_create_personal_access_tokens_table.php`

Models:
- `User` `laravel-app/app/Models/User.php:18–55` (casts password as hashed, relations `assignments`, `cahiersDeTexte`)
- `Filiere` `laravel-app/app/Models/Filiere.php:12–23` (hasMany `modules`, `groupes`)
- `Module` `laravel-app/app/Models/Module.php:12–28` (belongsTo `filiere`, hasMany `matieres`, `assignments`)
- `Matiere` `laravel-app/app/Models/Matiere.php:12–18` (belongsTo `module`)
- `Groupe` `laravel-app/app/Models/Groupe.php:12–23` (belongsTo `filiere`, hasMany `assignments`)
- `Assignment` `laravel-app/app/Models/Assignment.php:12–30` (relations to `user`, `module`, `groupe`, no timestamps)
- `CahierDeTexte` `laravel-app/app/Models/CahierDeTexte.php:12–36` (table name overridden to `cahiers_de_texte`)

## Validation

Form Requests enforce input schemas:
- Login: `LoginRequest` `laravel-app/app/Http/Requests/LoginRequest.php:14–19`
- Create Professor: `StoreProfessorRequest` `laravel-app/app/Http/Requests/StoreProfessorRequest.php:16–21`
- Update Professor: `UpdateProfessorRequest` `laravel-app/app/Http/Requests/UpdateProfessorRequest.php:16–22` (unique email ignoring current id)
- Create Filiere: `StoreFiliereRequest` `laravel-app/app/Http/Requests/StoreFiliereRequest.php:16–19`
- Update Filiere: `UpdateFiliereRequest` `laravel-app/app/Http/Requests/UpdateFiliereRequest.php:16–19`
- Create Module: `StoreModuleRequest` `laravel-app/app/Http/Requests/StoreModuleRequest.php:16–19`
- Update Module: `UpdateModuleRequest` `laravel-app/app/Http/Requests/UpdateModuleRequest.php:16–19`
- Create Matiere: `StoreMatiereRequest` `laravel-app/app/Http/Requests/StoreMatiereRequest.php:16–19`
- Update Matiere: `UpdateMatiereRequest` `laravel-app/app/Http/Requests/UpdateMatiereRequest.php:16–19`
- Create Groupe: `StoreGroupeRequest` `laravel-app/app/Http/Requests/StoreGroupeRequest.php:16–20`
- Update Groupe: `UpdateGroupeRequest` `laravel-app/app/Http/Requests/UpdateGroupeRequest.php:16–20`
- Create Assignment: `StoreAssignmentRequest` `laravel-app/app/Http/Requests/StoreAssignmentRequest.php:16–21`
- Create Logbook: `StoreLogbookRequest` `laravel-app/app/Http/Requests/StoreLogbookRequest.php:16–23`

## Resources (Response Shapes)

- `UserResource` `laravel-app/app/Http/Resources/UserResource.php:11–16`
- `FiliereResource` `laravel-app/app/Http/Resources/FiliereResource.php:11–14`
- `ModuleResource` `laravel-app/app/Http/Resources/ModuleResource.php:11–15`
- `MatiereResource` `laravel-app/app/Http/Resources/MatiereResource.php:11–15`
- `GroupeResource` `laravel-app/app/Http/Resources/GroupeResource.php`
- `AssignmentResource` `laravel-app/app/Http/Resources/AssignmentResource.php:11–18`
- `CahierDeTexteResource` `laravel-app/app/Http/Resources/CahierDeTexteResource.php:11–22`

Collections are wrapped via `Resource::collection($paginator)` and include pagination meta.

## API Endpoints

Base URL: `http://127.0.0.1:8000/api`

Auth:
- `POST /login` → token + user (`AuthController::login`)
- `POST /logout` → revoke current token (`AuthController::logout`)
- `GET /user` → current user (`AuthController::user`)

Admin – Professeurs (`AdminProfessorController`):
- `GET /admin/professeurs` → list (`index` `laravel-app/app/Http/Controllers/AdminProfessorController.php:13–17`)
- `POST /admin/professeurs` → create (`store` `laravel-app/app/Http/Controllers/AdminProfessorController.php:19–29`)
- `GET /admin/professeurs/{id}` → show (`show` `laravel-app/app/Http/Controllers/AdminProfessorController.php:31–34`)
- `PUT /admin/professeurs/{id}` → update (`update` `laravel-app/app/Http/Controllers/AdminProfessorController.php:36–44`)
- `DELETE /admin/professeurs/{id}` → delete (`destroy` `laravel-app/app/Http/Controllers/AdminProfessorController.php:46–50`)

Admin – Filières (`FiliereController`): CRUD `laravel-app/routes/api.php:25`

Admin – Modules (`ModuleController`): CRUD `laravel-app/routes/api.php:26`

Admin – Matières (`MatiereController`): CRUD `laravel-app/routes/api.php:27`

Admin – Groupes (`GroupeController`): CRUD `laravel-app/routes/api.php:28`

Admin – Assignments (`AssignmentController`):
- `GET /admin/assignments` (`index` `laravel-app/app/Http/Controllers/AssignmentController.php:9–12`)
- `POST /admin/assignments` (`store` `laravel-app/app/Http/Controllers/AssignmentController.php:14–22`)
- `DELETE /admin/assignments/{id}` (`destroy` `laravel-app/app/Http/Controllers/AssignmentController.php:24–28`)

Admin – Logbooks (`AdminLogbookController`):
- `GET /admin/logbooks` (`index` `laravel-app/app/Http/Controllers/AdminLogbookController.php:9–14`)

Professeur – Assignments (`ProfessorController`):
- `GET /professeur/my-assignments` (`myAssignments` `laravel-app/app/Http/Controllers/ProfessorController.php:11–17`)

Professeur – Logbooks (`ProfessorLogbookController`):
- `GET /professeur/my-logbooks` (`index` `laravel-app/app/Http/Controllers/ProfessorLogbookController.php:11–16`)
- `POST /professeur/logbooks` (`store` `laravel-app/app/Http/Controllers/ProfessorLogbookController.php:18–36`)

## Error Responses

- `401 Unauthorized` → invalid login or missing token (`AuthController::login:20–22`)
- `403 Forbidden` → role mismatch or not assigned (`AdminMiddleware.php:13–17`, `ProfessorMiddleware.php:13–17`, `ProfessorLogbookController::store:28–32`)
- `422 Unprocessable Entity` → validation errors (`FormRequest` rules)

Errors return JSON bodies like `{ message: "..." }` or Laravel validation error format.

## Pagination

Index endpoints return paginated collections. Use query params:
- `?page=1`
- `?per_page=20` (Laravel default is `perPage` on the model; current controllers use fixed paginate values)

## Swagger / OpenAPI

- Published spec: `laravel-app/public/swagger.yaml`
- UI: `laravel-app/public/swagger.html`
- Server url in spec: `/api` (relative)
- Authorize with bearer token in the UI, then call endpoints.

## API Reference

Base URL: `http://127.0.0.1:8000/api` (routes: `laravel-app/routes/api.php:15–42`)

Auth header: `Authorization: Bearer <token>` on all protected endpoints.

Pagination: Responses for list endpoints return `{ data: [...], links: { ... }, meta: { ... } }` when using `paginate(...)`.

Error codes:
- `401` Unauthorized (invalid/missing token) — `laravel-app/app/Http/Controllers/AuthController.php:20–22`
- `403` Forbidden (role mismatch or not assigned) — `laravel-app/app/Http/Middleware/AdminMiddleware.php:13–17`, `laravel-app/app/Http/Middleware/ProfessorMiddleware.php:13–17`, `laravel-app/app/Http/Controllers/ProfessorLogbookController.php:28–32`
- `422` Validation failure (FormRequest rules) or duplicate assignment — `laravel-app/app/Http/Controllers/AssignmentController.php:16–18`

### Authentication

- POST `/login` — Login and get token
  - Request body (JSON): `{ "email": string, "password": string }`
  - Validation: `LoginRequest` `laravel-app/app/Http/Requests/LoginRequest.php:16–19`
  - Response 200: `{ "token": string, "user": { id, name, email, role } }`
  - Controller: `laravel-app/app/Http/Controllers/AuthController.php:16–25`

- POST `/logout` — Logout current token
  - Auth: Bearer token
  - Response 200: `{ "message": "Logged out" }`
  - Controller: `laravel-app/app/Http/Controllers/AuthController.php:30–37`

- GET `/user` — Get authenticated user
  - Auth: Bearer token
  - Response 200: `UserResource` `{ id, name, email, role }`
  - Controller: `laravel-app/app/Http/Controllers/AuthController.php:42–45`

Examples (cURL):
```
curl -s -X POST 'http://127.0.0.1:8000/api/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"password"}'
```

### Admin: Professeurs

Routes: `laravel-app/routes/api.php:21–25` Controller: `laravel-app/app/Http/Controllers/AdminProfessorController.php:13–50`

- GET `/admin/professeurs` — List professors
  - Auth: Bearer, role: admin
  - Response 200: paginated `UserResource` collection: `{ data: [{ id, name, email, role }], links, meta }`

- POST `/admin/professeurs` — Create professor
  - Auth: Bearer, role: admin
  - Request body: `{ "name": string, "email": string, "password": string(min:8) }`
  - Validation: `StoreProfessorRequest` `laravel-app/app/Http/Requests/StoreProfessorRequest.php:16–21`
  - Response 200: `UserResource` `{ id, name, email, role }`

- GET `/admin/professeurs/{id}` — Show professor
  - Auth: Bearer, role: admin
  - Response 200: `UserResource`

- PUT `/admin/professeurs/{id}` — Update professor
  - Auth: Bearer, role: admin
  - Request body (any combination): `{ "name"?: string, "email"?: string(unique), "password"?: string(min:8) }`
  - Validation: `UpdateProfessorRequest` `laravel-app/app/Http/Requests/UpdateProfessorRequest.php:16–22`
  - Response 200: `UserResource`

- DELETE `/admin/professeurs/{id}` — Delete professor
  - Auth: Bearer, role: admin
  - Response 200: `{ "message": "Deleted" }`

Examples (cURL):
```
TOKEN=... # admin token
curl -s -X POST 'http://127.0.0.1:8000/api/admin/professeurs' \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"name":"Prof A","email":"prof.a@example.com","password":"password"}'

curl -s -X PUT 'http://127.0.0.1:8000/api/admin/professeurs/123' \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"email":"prof.a.changed@example.com"}'
```

### Admin: Filières

Routes: `laravel-app/routes/api.php:25` Controller: `laravel-app/app/Http/Controllers/FiliereController.php:9–39`

- GET `/admin/filieres` — List
- POST `/admin/filieres` — Create `{ name }`
- GET `/admin/filieres/{id}` — Show
- PUT `/admin/filieres/{id}` — Update `{ name? }`
- DELETE `/admin/filieres/{id}` — Delete

Validation:
- Create: `StoreFiliereRequest` `laravel-app/app/Http/Requests/StoreFiliereRequest.php:16–19`
- Update: `UpdateFiliereRequest` `laravel-app/app/Http/Requests/UpdateFiliereRequest.php:16–19`

### Admin: Modules

Routes: `laravel-app/routes/api.php:26` Controller: `laravel-app/app/Http/Controllers/ModuleController.php:9–39`

- GET `/admin/modules` — List
- POST `/admin/modules` — Create `{ name, filiere_id }`
- GET `/admin/modules/{id}` — Show
- PUT `/admin/modules/{id}` — Update `{ name?, filiere_id? }`
- DELETE `/admin/modules/{id}` — Delete

Validation:
- Create: `StoreModuleRequest` `laravel-app/app/Http/Requests/StoreModuleRequest.php:16–19`
- Update: `UpdateModuleRequest` `laravel-app/app/Http/Requests/UpdateModuleRequest.php:16–19`

### Admin: Matières

Routes: `laravel-app/routes/api.php:27` Controller: `laravel-app/app/Http/Controllers/MatiereController.php:9–39`

- GET `/admin/matieres` — List
- POST `/admin/matieres` — Create `{ name, module_id }`
- GET `/admin/matieres/{id}` — Show
- PUT `/admin/matieres/{id}` — Update `{ name?, module_id? }`
- DELETE `/admin/matieres/{id}` — Delete

Validation:
- Create: `StoreMatiereRequest` `laravel-app/app/Http/Requests/StoreMatiereRequest.php:16–19`
- Update: `UpdateMatiereRequest` `laravel-app/app/Http/Requests/UpdateMatiereRequest.php:16–19`

### Admin: Groupes

Routes: `laravel-app/routes/api.php:28` Controller: `laravel-app/app/Http/Controllers/GroupeController.php:9–39`

- GET `/admin/groupes` — List
- POST `/admin/groupes` — Create `{ name, filiere_id }`
- GET `/admin/groupes/{id}` — Show
- PUT `/admin/groupes/{id}` — Update `{ name?, filiere_id? }`
- DELETE `/admin/groupes/{id}` — Delete

Validation:
- Create: `StoreGroupeRequest` `laravel-app/app/Http/Requests/StoreGroupeRequest.php:16–20`
- Update: `UpdateGroupeRequest` `laravel-app/app/Http/Requests/UpdateGroupeRequest.php:16–20`

### Admin: Assignments

Routes: `laravel-app/routes/api.php:30–32` Controller: `laravel-app/app/Http/Controllers/AssignmentController.php:9–31`

- GET `/admin/assignments` — List assignments (with `user`, `module`, `groupe` relationships)
- POST `/admin/assignments` — Create `{ user_id, module_id, groupe_id }`
  - Validation: `StoreAssignmentRequest` `laravel-app/app/Http/Requests/StoreAssignmentRequest.php:16–21`
  - Duplicate check returns `422 { message: "Duplicate assignment" }` `laravel-app/app/Http/Controllers/AssignmentController.php:16–18`
- DELETE `/admin/assignments/{id}` — Delete assignment

### Admin: Logbooks

Routes: `laravel-app/routes/api.php:34` Controller: `laravel-app/app/Http/Controllers/AdminLogbookController.php:9–14`

- GET `/admin/logbooks` — List all logbooks across professors, ordered by `session_date` desc

### Professeur: My Assignments

Routes: `laravel-app/routes/api.php:37–39` Controller: `laravel-app/app/Http/Controllers/ProfessorController.php:11–17`

- GET `/professeur/my-assignments` — Returns assignments for the authenticated professor

### Professeur: Logbooks

Routes: `laravel-app/routes/api.php:37–41` Controller: `laravel-app/app/Http/Controllers/ProfessorLogbookController.php:11–36`

- GET `/professeur/my-logbooks` — List your logbooks
- POST `/professeur/logbooks` — Create a logbook entry
  - Request body: `{ module_id, groupe_id, session_date, session_type(cours|TP), contenu_traite, remarques? }`
  - Validation: `StoreLogbookRequest` `laravel-app/app/Http/Requests/StoreLogbookRequest.php:16–23`
  - Assignment check: must be assigned to the given `module_id` + `groupe_id` or returns `403` `laravel-app/app/Http/Controllers/ProfessorLogbookController.php:28–32`

### Resource Schemas

- UserResource: `laravel-app/app/Http/Resources/UserResource.php:11–16`
```
{ "id": number, "name": string, "email": string, "role": "admin"|"professeur" }
```

- FiliereResource: `laravel-app/app/Http/Resources/FiliereResource.php:11–14`
```
{ "id": number, "name": string }
```

- ModuleResource: `laravel-app/app/Http/Resources/ModuleResource.php:11–15`
```
{ "id": number, "name": string, "filiere_id": number }
```

- MatiereResource: `laravel-app/app/Http/Resources/MatiereResource.php:11–15`
```
{ "id": number, "name": string, "module_id": number }
```

- GroupeResource: `laravel-app/app/Http/Resources/GroupeResource.php`
```
{ "id": number, "name": string, "filiere_id": number }
```

- AssignmentResource: `laravel-app/app/Http/Resources/AssignmentResource.php:11–18`
```
{ "id": number, "user_id": number, "module_id": number, "groupe_id": number,
  "module"?: ModuleResource, "groupe"?: GroupeResource }
```

- CahierDeTexteResource: `laravel-app/app/Http/Resources/CahierDeTexteResource.php:11–22`
```
{ "id": number, "user_id": number, "module_id": number, "groupe_id": number,
  "session_date": YYYY-MM-DD, "session_type": "cours"|"TP",
  "contenu_traite": string, "remarques"?: string,
  "module"?: ModuleResource, "groupe"?: GroupeResource }
```

### Front-end Integration Examples

Login → Create Professor → List Professors:
```
# login
LOGIN=$(curl -s -X POST 'http://127.0.0.1:8000/api/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"password"}')
TOKEN=$(echo "$LOGIN" | python -c "import sys,json;print(json.load(sys.stdin)['token'])")

# create professor
curl -s -X POST 'http://127.0.0.1:8000/api/admin/professeurs' \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"name":"Prof Test","email":"prof.test@example.com","password":"password"}'

# list professors
curl -s -X GET 'http://127.0.0.1:8000/api/admin/professeurs' \
  -H "Authorization: Bearer $TOKEN"
```

Create Assignment → Professor My Assignments → Create Logbook:
```
# create assignment
curl -s -X POST 'http://127.0.0.1:8000/api/admin/assignments' \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"user_id":1,"module_id":10,"groupe_id":5}'

# professor login
PLOGIN=$(curl -s -X POST 'http://127.0.0.1:8000/api/login' -H 'Content-Type: application/json' \
  -d '{"email":"prof.test@example.com","password":"password"}')
PTOKEN=$(echo "$PLOGIN" | python -c "import sys,json;print(json.load(sys.stdin)['token'])")

# my assignments
curl -s -X GET 'http://127.0.0.1:8000/api/professeur/my-assignments' \
  -H "Authorization: Bearer $PTOKEN"

# create logbook (must be assigned)
curl -s -X POST 'http://127.0.0.1:8000/api/professeur/logbooks' \
  -H "Authorization: Bearer $PTOKEN" -H 'Content-Type: application/json' \
  -d '{"module_id":10,"groupe_id":5,"session_date":"2025-11-24","session_type":"cours","contenu_traite":"Intro"}'
```

### Troubleshooting

- 405 Method Not Allowed on update: use `PUT /api/admin/professeurs/{id}` (not the collection path).
- HTML response instead of JSON: ensure calls target `/api/...` and that `php artisan serve` is running; avoid hitting `swagger.html` by mistake.
- No rows in DB: verify app DB connection via `php artisan tinker` or confirm MySQL port and DB match `.env`.
## Front-end Integration Guide

Authentication flow:
- Login with `POST /api/login`, store returned `token` securely.
- Add `Authorization: Bearer <token>` to all requests.
- Logout by deleting token via `POST /api/logout`.

Entity creation order (recommended):
- Create `filiere` → create `module` (link to filiere) → create `groupe` (link to filiere) → create `professeur` → create `assignment` (link user+module+groupe) → professors create logbooks.

Common pitfalls:
- Using wrong base URL or hitting `swagger.html` instead of `/api/...` returns HTML and no DB changes.
- Checking a different MySQL instance/port than `.env` shows “missing rows”. Confirm with `php artisan tinker` or MySQL CLI.
- `PUT /api/admin/professeurs` without `{id}` returns 405; use `PUT /api/admin/professeurs/{id}`.

## Seeding

Seeder creates an admin and sample data: `laravel-app/database/seeders/DatabaseSeeder.php:29–87`
- Admin: email `admin@example.com`, password `password`
- 8 professors, 3 filières, 5 modules per filière, 4 groupes per filière
- 3 matières per module
- Random assignments and logbooks

## Testing / Smoke

Example sequence (PowerShell or cURL):
- Login → create filiere → module → groupe → create professor → create assignment → list → professor login → create logbook → list logbooks.

## Project Structure

- Controllers: `laravel-app/app/Http/Controllers/*`
- Requests: `laravel-app/app/Http/Requests/*`
- Resources: `laravel-app/app/Http/Resources/*`
- Models: `laravel-app/app/Models/*`
- Migrations: `laravel-app/database/migrations/*`
- Seeders: `laravel-app/database/seeders/*`
- Routes: `laravel-app/routes/api.php`, `laravel-app/routes/web.php`
- Public: `laravel-app/public/*`

## Security Notes

- Bearer tokens must be kept client-side securely; do not log tokens.
- All admin endpoints are protected by `admin` middleware; professor endpoints by `professeur` middleware.
- Validation rules enforce exist checks on foreign keys and input constraints.

## Deployment Tips

- Ensure `.env` matches your MySQL server. After changes, run `php artisan config:clear`.
- Run migrations and seeders on your target environment before front-end integration.
- Serve the API over HTTPS in production and restrict CORS as needed.

