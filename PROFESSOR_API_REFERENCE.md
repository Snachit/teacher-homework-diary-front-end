# Professor API Reference

## Overview

Professor endpoints allow authenticated professors to view their assignments and manage their own logbook entries. All endpoints require a valid bearer token for a user with `role='professeur'`.

- Base URL: `http://127.0.0.1:8000/api`
- Auth header: `Authorization: Bearer <token>`
- Routes: `laravel-app/routes/api.php:37–41`
- Controllers: `ProfessorController` and `ProfessorLogbookController`
- Validation: `StoreLogbookRequest`
- Resources: `AssignmentResource`, `CahierDeTexteResource`

## Conventions

- JSON request bodies must be `application/json`.
- List endpoints return paginated collections `{ data: [...], links: {...}, meta: {...} }`.
- Errors:
  - `401` Unauthorized — invalid or missing token
  - `403` Forbidden — role mismatch or not assigned to the selected module/group
  - `422` Validation errors — enforced by `StoreLogbookRequest`

## Authentication (context)

- Login: `POST /api/login` returns `{ token, user }` — `laravel-app/app/Http/Controllers/AuthController.php:16–25`
- Logout: `POST /api/logout` revokes current token — `laravel-app/app/Http/Controllers/AuthController.php:30–37`

## Endpoints

### My Assignments

- GET `/api/professeur/my-assignments`
- Purpose: List assignments for the authenticated professor
- Controller: `laravel-app/app/Http/Controllers/ProfessorController.php:11–17`
- Response 200: `AssignmentResource` collection
```
{ data: [
  { id, user_id, module_id, groupe_id, module?: { id, name, filiere_id }, groupe?: { id, name, filiere_id } }
], links, meta }
```

### My Logbooks

- GET `/api/professeur/my-logbooks`
- Purpose: List logbook entries created by the authenticated professor, ordered by `session_date` desc
- Controller: `laravel-app/app/Http/Controllers/ProfessorLogbookController.php:11–16`
- Response 200: `CahierDeTexteResource` collection
```
{ data: [
  { id, user_id, module_id, groupe_id, session_date(YYYY-MM-DD), session_type(cours|TP), contenu_traite, remarques?,
    module?: { id, name, filiere_id }, groupe?: { id, name, filiere_id } }
], links, meta }
```

### Create Logbook Entry

- POST `/api/professeur/logbooks`
- Purpose: Create a logbook (cahier de texte) entry for a session
- Controller: `laravel-app/app/Http/Controllers/ProfessorLogbookController.php:18–36`
- Validation: `laravel-app/app/Http/Requests/StoreLogbookRequest.php:16–23`
```
Request body:
{
  module_id: integer (exists:modules,id),
  groupe_id: integer (exists:groupes,id),
  session_date: date (YYYY-MM-DD),
  session_type: "cours" | "TP",
  contenu_traite: string,
  remarques?: string
}
```
- Assignment requirement: You must be assigned to the exact `{ module_id, groupe_id }` pair; otherwise the API returns `403 { "message": "Not assigned to this module/group" }` — check: `laravel-app/app/Http/Controllers/ProfessorLogbookController.php:28–32`
- Response 200: `CahierDeTexteResource` with `module` and `groupe` relations loaded

## Resources

- `AssignmentResource` `laravel-app/app/Http/Resources/AssignmentResource.php:11–18`
```
{ id, user_id, module_id, groupe_id, module?: ModuleResource, groupe?: GroupeResource }
```

- `CahierDeTexteResource` `laravel-app/app/Http/Resources/CahierDeTexteResource.php:11–22`
```
{ id, user_id, module_id, groupe_id,
  session_date: YYYY-MM-DD,
  session_type: "cours"|"TP",
  contenu_traite: string,
  remarques?: string,
  module?: ModuleResource,
  groupe?: GroupeResource }
```

## Validation

- `StoreLogbookRequest` `laravel-app/app/Http/Requests/StoreLogbookRequest.php:16–23`
```
{
  module_id: required, integer, exists:modules,id
  groupe_id: required, integer, exists:groupes,id
  session_date: required, date
  session_type: required, in:cours,TP
  contenu_traite: required, string
  remarques: nullable, string
}
```

## Example Flows (cURL)

Login as professor:
```
curl -s -X POST 'http://127.0.0.1:8000/api/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"prof.test@example.com","password":"password"}'
```

List my assignments:
```
PTOKEN=...
curl -s -X GET 'http://127.0.0.1:8000/api/professeur/my-assignments' \
  -H "Authorization: Bearer $PTOKEN"
```

Create a logbook entry (must be assigned to the module+groupe):
```
curl -s -X POST 'http://127.0.0.1:8000/api/professeur/logbooks' \
  -H "Authorization: Bearer $PTOKEN" -H 'Content-Type: application/json' \
  -d '{"module_id":10,"groupe_id":5,"session_date":"2025-11-24","session_type":"cours","contenu_traite":"Chapitre 1"}'
```

List my logbooks:
```
curl -s -X GET 'http://127.0.0.1:8000/api/professeur/my-logbooks' \
  -H "Authorization: Bearer $PTOKEN"
```

## Troubleshooting

- 403 on logbook creation: ensure an admin created an assignment mapping your user to the `{ module_id, groupe_id }` — `laravel-app/app/Http/Controllers/AssignmentController.php:14–22` (admin side).
- HTML response (Swagger) instead of JSON: ensure your requests target `/api/...` and that `php artisan serve` is running; avoid calling `swagger.html`.
- Empty lists: confirm data exists and your professor account is correctly assigned.

