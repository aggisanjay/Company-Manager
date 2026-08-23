# AI Usage Log & Engineering Notes

This document provides a live, transparent record of how AI assistance (Antigravity) was utilized during the development of **Company Manager**, noting design decisions, prompts, adopted patterns, modifications, and rejected solutions.

---

## 1. Backend Architecture & DTO Validation
- **Prompt**: "Scaffold a NestJS backend with Prisma ORM connecting to Supabase PostgreSQL, incorporating DTO validation with class-validator and class-transformer for company creation and search queries."
- **Kept**:
  - Modular NestJS structure (`CompaniesModule`, `CompaniesService`, `CompaniesController`, `PrismaService`).
  - Validation decorators: `@IsString()`, `@IsNotEmpty()`, `@IsUrl()`, `@IsInt()`, `@Min(1)`.
  - Global `ValidationPipe` with `{ whitelist: true, transform: true }`.
- **Modified**:
  - Added URL and number transformation helpers (`@Transform`) so that empty strings submitted from HTML inputs are gracefully cast to `null` rather than triggering false validation failures.
  - Added `@nestjs/swagger` decorators on all DTOs and Controller routes to automatically generate an OpenAPI interactive sandbox at `/api/docs`.

---

## 2. Database Schema & Supabase Split Connection URLs
- **Prompt**: "Configure Prisma schema with Supabase Postgres supporting pooled runtime queries and direct migration connections."
- **Kept**:
  - Schema mapping for Postgres table `companies` and snake_case column names (`company_name`, `employee_count`, `created_at`, `updated_at`).
  - Dedicated `url = env("DATABASE_URL")` (pgbouncer pooler on port 6543) and `directUrl = env("DIRECT_URL")` (direct connection on port 5432) configuration.
- **Why this matters**: Prevents migration transaction deadlocks with Supabase connection poolers.

---

## 3. Search & Pagination Logic
- **Prompt**: "Implement server-side search and pagination in CompaniesService."
- **Kept**:
  - Server-side offset pagination math (`skip = (page - 1) * limit`).
  - Total records count and pagination metadata calculation (`totalPages`, `hasNextPage`, `hasPrevPage`).
- **Modified**:
  - AI initially drafted raw regex search; modified to use Prisma's native `mode: 'insensitive'` with `contains` over both `companyName` and `industry` fields to ensure case-insensitive matching across Postgres.

---

## 4. Frontend Component System & Aesthetics
- **Prompt**: "Create a modern Next.js App Router frontend with Tailwind CSS, glassmorphism cards, debounced search, sortable table headers, and modal dialogs."
- **Kept**:
  - Custom UI component primitives (`Button`, `Input`, `Badge`, `Toast`, `PaginationControls`, `DeleteConfirmModal`, `CompanyFormModal`).
  - 300ms debounced search bar with automatic clear button.
  - Live toast feedback for CRUD events.
  - Skeletons and empty states for polished loading transitions.
- **Modified**:
  - Integrated interactive analytics metrics cards (Tracked Companies, Total Workforce, Average Team Size, Top Sector) with an extra `/companies/metrics` endpoint on the backend.

---

## 5. Error Handling & Resilience
- **Prompt**: "Design centralized error handling for network interruptions and API validation errors."
- **Kept**:
  - Custom `AllExceptionsFilter` on NestJS returning structured JSON errors.
  - Typed `ApiError` class in frontend `lib/api.ts` providing user-friendly fallback error messages when backend is unreachable or returning validation errors.
