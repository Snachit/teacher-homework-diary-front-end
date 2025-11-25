# Users Table Schema

## Source
- Migration: `laravel-app/database/migrations/0001_01_01_000000_create_users_table.php:14–23`
- Model: `laravel-app/app/Models/User.php:18–55`

## Columns
- `id`: `BIGINT UNSIGNED` auto-increment, primary key
- `name`: `VARCHAR(255)` not null
- `email`: `VARCHAR(255)` not null, unique
- `email_verified_at`: `TIMESTAMP` nullable
- `password`: `VARCHAR(255)` not null
- `role`: `ENUM('admin','professeur')` not null, default `professeur`
- `remember_token`: `VARCHAR(100)` nullable
- `created_at`: `TIMESTAMP` nullable
- `updated_at`: `TIMESTAMP` nullable

## Indexes & Constraints
- Primary key: `id`
- Unique key: `email`

## MySQL DDL (canonical)
```
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `email_verified_at` TIMESTAMP NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin','professeur') NOT NULL DEFAULT 'professeur',
  `remember_token` VARCHAR(100) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Eloquent Notes
- Fillable: `['name','email','password','role']` (`laravel-app/app/Models/User.php:24–26`)
- Hidden: `['password','remember_token']` (`laravel-app/app/Models/User.php:32–35`)
- Casts: `password` is hashed; `email_verified_at` as datetime (`laravel-app/app/Models/User.php:43–49`)

