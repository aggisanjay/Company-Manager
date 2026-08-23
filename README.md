# Company Manager 🏢

A high-performance, full-stack company directory and portfolio management platform built with **NestJS**, **Prisma ORM**, **Supabase PostgreSQL**, and **Next.js (App Router)**.

---

## 🌟 Key Features

- **Enterprise CRUD Operations**: Create, view, update, and delete company records with full validation.
- **Robust Form & DTO Validation**: Dual-layer validation using `class-validator` & `class-transformer` on NestJS and client-side form feedback.
- **Server-Side Pagination & Sorting**: High-efficiency paginated queries with customizable page sizes (5, 10, 25, 50) and multi-column sorting (Name, Industry, Employee Count, Added Date).
- **Case-Insensitive Search**: Fast debounced search matching company name and industry using Prisma's `mode: 'insensitive'`.
- **Portfolio Analytics Overview**: Aggregated metrics on total organizations, workforce volume, and top industry sectors.
- **Interactive UI / UX**: Modern dark-themed dashboard with glassmorphism panels, toast notifications, responsive mobile drawers, and confirmation modals.
- **Interactive Swagger Documentation**: Built-in OpenAPI specification available at `/api/docs`.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Backend** | NestJS 10 + TypeScript | Modular enterprise backend architecture |
| **ORM** | Prisma 5 | Type-safe queries, migrations, and schema definition |
| **Database** | Supabase PostgreSQL | Managed cloud Postgres with connection pooling |
| **Validation** | class-validator + class-transformer | Strict DTO validation and input transformation |
| **Documentation**| @nestjs/swagger | Interactive API exploration and documentation |
| **Frontend** | Next.js 14 (App Router) + TypeScript | Modern server/client rendering and routing |
| **Styling** | Tailwind CSS + Lucide Icons | Responsive layout and UI aesthetics |

---

## 📂 Repository Structure

```
company-manager/
├── backend/                  # NestJS API application
│   ├── src/
│   │   ├── companies/        # Controller, Service, Module, DTOs
│   │   ├── prisma/           # PrismaService lifecycle connection
│   │   ├── common/           # Global exception filter
│   │   ├── app.module.ts
│   │   └── main.ts           # Bootstrapping with CORS, validation, Swagger
│   ├── prisma/
│   │   └── schema.prisma     # Postgres schema definition
│   ├── test/                 # Unit & integration test suites
│   ├── .env.example
│   └── package.json
├── frontend/                 # Next.js App Router application
│   ├── app/
│   │   ├── layout.tsx        # Root HTML layout and fonts
│   │   ├── page.tsx          # Main interactive dashboard
│   │   └── globals.css       # Custom design tokens and styles
│   ├── components/           # Table, Modals, Search, Pagination, Metrics
│   │   ├── ui/               # Button, Input, Badge, Toast components
│   ├── lib/
│   │   ├── api.ts            # Centralized typed API client
│   │   └── utils.ts          # Formatting helpers (dates, numbers, URLs)
│   ├── types/                # Shared TypeScript interfaces
│   ├── .env.example
│   └── package.json
├── README.md
└── AI_USAGE.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v20+)
- **npm** or **pnpm**
- **Supabase Account**: (Free tier) to obtain database connection strings

---

### 2. Backend Setup (NestJS + Prisma)

1. Navigate to `backend/`:
   ```bash
   cd backend
   ```

2. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your Supabase credentials:
   ```env
   # Transaction connection pooler (port 6543)
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

   # Direct connection for migrations (port 5432)
   DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

   PORT=4000
   FRONTEND_URL="http://localhost:3000"
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

6. Start the backend development server:
   ```bash
   npm run start:dev
   ```

- API Server: `http://localhost:4000`
- Swagger UI Documentation: `http://localhost:4000/api/docs`

---

### 3. Frontend Setup (Next.js)

1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env.local
   ```

3. Configure API target in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:4000"
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the frontend development server:
   ```bash
   npm run dev
   ```

- Web App: `http://localhost:3000`

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description | Query Parameters / Body |
|---|---|---|---|
| `GET` | `/companies` | List companies with search, pagination & sorting | `search`, `page`, `limit`, `sortBy`, `order` |
| `POST` | `/companies` | Register a new company | `{ companyName, website?, industry?, employeeCount? }` |
| `GET` | `/companies/metrics` | Retrieve aggregated portfolio metrics | — |
| `GET` | `/companies/:id` | Fetch single company details | — |
| `PATCH` | `/companies/:id` | Update company attributes | `{ companyName?, website?, industry?, employeeCount? }` |
| `DELETE` | `/companies/:id` | Remove company from directory | — |

---

## 🧪 Testing

Run backend unit tests:
```bash
cd backend
npm test
```

---

## 📝 Assumptions Made

1. **Optional vs Required Fields**: Only `companyName` is strictly required. `website`, `industry`, and `employeeCount` are optional to allow flexible organization onboarding without artificial data friction.
2. **Search Scope**: Search queries match both `companyName` and `industry` using case-insensitive partial text matching (`mode: 'insensitive'`).
3. **Pagination Defaults**: Default page size is 10, clamped between 1 and 100 items per page.
4. **URL Protocol Normalization**: The frontend automatically prepends `https://` if a user inputs a domain without protocol.

---

## ⚠️ Known Limitations

1. **Unauthenticated Public Access**: The application currently operates in open-access mode without an authentication (AuthN) or Role-Based Access Control (RBAC) layer. Any client connecting to the API can perform CRUD operations.
2. **Pattern-Based Text Search**: Company search utilizes PostgreSQL `ILIKE` via Prisma's `mode: 'insensitive'`. While fast for thousands of rows, enterprise datasets with millions of records would benefit from PostgreSQL Full-Text Search (`tsvector` + GIN indexing) or a dedicated search engine (e.g., Meilisearch, Algolia).
3. **Synchronous Metric Aggregation**: Portfolio metrics (total companies, total workforce, average team size, and top industry sector) are calculated dynamically per request. At massive scale, these should be cached using Redis or database Materialized Views with periodic refresh.
4. **Syntax-Level URL Validation**: Website URLs are validated for RFC formatting and automatically normalized with `https://`, but external network DNS reachability (checking if the domain is actively alive) is not checked synchronously on submission to avoid latency.

---

## 🔮 Future Improvements

- [ ] **Authentication & RBAC**: Integrate Supabase Auth or NextAuth.js with JWT session guards to restrict create, edit, and delete actions to verified administrators.
- [ ] **CSV / Excel Bulk Import & Export**: Support one-click bulk onboarding of company records via CSV/XLSX file upload and export to spreadsheets.
- [ ] **Automatic Brand Logo & Data Enrichment**: Integrate Clearbit Logo API or Google Favicon API to automatically display official company logos and fetch public headcount estimates.
- [ ] **Advanced Multi-Dimensional Filtering**: Add multi-select checkboxes for industries and employee range buckets (e.g., *1–50*, *51–200*, *201–1,000*, *1,000+*).
- [ ] **Activity Audit Logging & History**: Track revision histories for every company profile (e.g., who edited the employee count, previous values, and change timestamps).
- [ ] **Client Caching & Optimistic UI**: Integrate TanStack React Query or SWR for instant optimistic mutations and background stale-while-revalidate data fetching.
- [ ] **Dark / Light Mode Toggle**: Provide a user preference switch between dark glassmorphism and clean enterprise light themes.

---

## 🌐 Deployment Guide

- **Frontend (Vercel)**:
  - Root directory: `frontend`
  - Build command: `npm run build`
  - Environment variable: `NEXT_PUBLIC_API_URL=<YOUR_RENDER_BACKEND_URL>`

- **Backend (Render / Railway)**:
  - Root directory: `backend`
  - Build command: `npm install && npx prisma generate && npm run build`
  - Start command: `npm run start:prod`
  - Environment variables: `DATABASE_URL`, `DIRECT_URL`, `PORT=4000`, `FRONTEND_URL=<YOUR_VERCEL_FRONTEND_URL>`

