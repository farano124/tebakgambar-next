# 📘 Project Best Practices

## 1. Project Purpose
Tebak Gambar is an interactive picture-guessing game implemented with Next.js (App Router), TypeScript, Tailwind CSS, and Supabase. It provides authentication, multiple game levels, achievements, and rankings with a modern UI, targeting Indonesian users.

## 2. Project Structure
- Root
  - `src/app/` – Next.js App Router pages and API routes
    - `app/(pages)/` – Feature pages (e.g., dashboard, game, rankings, login, register, guide)
    - `app/api/` – Server route handlers grouped by domain (admin, game, images, rankings, user)
  - `src/components/` – Reusable UI and feature components
    - `components/ui/` – Presentational UI primitives (e.g., Button)
    - `components/auth/` – Auth-related forms/components
    - `components/ErrorBoundary.tsx` – Global error boundary
  - `src/lib/` – Client-side providers and utilities
    - `auth.tsx`, `theme.tsx`, `sound.tsx` – React context providers
    - `supabase.ts` – Supabase client factory for client and server
    - `achievements.tsx` – Achievement catalog and hooks
    - `utils.ts` �� Utility helpers (e.g., classnames merge)
  - `src/types/` – TypeScript types (database models, etc.)
  - `database/migrations/` – SQL migrations and seed data (users, levels, user_progress, achievements)
  - `public/` – Static assets (images, sounds, guide images)
  - `middleware.ts` – SSR auth-cookie bridging via Supabase
  - `eslint.config.mjs`, `tsconfig.json`, `postcss.config.mjs`, `next.config.ts` – Tooling and config
  - `DEPLOYMENT.md`, `README.md`, `.env.example` – Docs and environment templates

Guidelines
- Group API routes by domain under `app/api/<domain>`.
- Put shared logic in `src/lib`. Avoid duplicating Supabase client setup in routes.
- Keep presentational components in `components/ui`. Use feature folders for domain-specific components.
- Co-locate page-specific components with the page where appropriate or promote to `components/` if reused.

## 3. Test Strategy
Current repo has no tests. Adopt the following strategy:
- Frameworks
  - Unit: Vitest
  - React components: @testing-library/react
  - Integration/API: Vitest + supertest or Next.js route handler invocation helpers
  - E2E: Playwright
- Structure
  - `tests/unit/**` for pure functions, hooks, and small components
  - `tests/integration/**` for API route handlers and multi-module interactions
  - `tests/e2e/**` for Playwright specs
  - Name tests `*.test.ts` or `*.test.tsx`
- Mocking
  - Use `vi.mock()` to mock `@/lib/supabase`, providers, and network calls
  - Provide test helpers to create mock `NextRequest` with cookies for SSR auth
- Coverage
  - Target: 80%+ lines/functions; critical paths (auth, game logic, rankings) at 90%+
- Philosophy
  - Unit-test pure logic (validation, utilities, achievements criteria)
  - Integration-test API routes with realistic Supabase mocks
  - E2E smoke-run core flows: login -> play level -> check answer -> ranking -> profile update

## 4. Code Style
- Language/Typing
  - TypeScript `strict` is enabled. Prefer explicit types for public APIs and return types for exported functions.
  - Avoid `any`. For external libs requiring wide types, add minimal type wrappers.
- React/Next
  - Use Server Components by default; add `"use client"` only when necessary (state, effects, context, event handlers).
  - Client providers live under `src/lib` and must include `"use client"` at the top.
  - Co-locate hooks with their domain; name hooks `useXyz`.
- Naming
  - Components: PascalCase files and exports (e.g., `Button.tsx`)
  - Hooks/utilities: camelCase (e.g., `useSound`, `cn`)
  - API route handlers: `route.ts` with named HTTP exports (`GET`, `POST`, etc.)
  - Folders: kebab-case or lowercase; keep domain grouping consistent
- Styling
  - Tailwind CSS utility-first; use `cn()` for conditional class merging
  - Reuse UI primitives in `components/ui` to keep visual consistency
- Comments/Docs
  - Keep comments focused on intent (why), not just what
  - Add top-of-file notes for SSR/client boundaries where non-obvious
- Errors/Exceptions
  - API: return `NextResponse.json({ error: string }, { status })` consistently
  - Log with `console.error` on server; avoid leaking internal details to clients
  - Prefer centralized helpers for common error shapes and status codes

## 5. Common Patterns
- Supabase Client
  - Use `createClientComponentClient()` for client components
  - Use `createServerClient(cookiesAdapter)` from `@/lib/supabase` in API routes and pass a cookies adapter based on the incoming `NextRequest`
  - Avoid mixing direct `@supabase/ssr` imports in routes; standardize via `src/lib/supabase`
- SSR Auth Cookies (Middleware)
  - `middleware.ts` bridges cookies for SSR; do not perform heavy logic there
  - Always return the exact `NextResponse` instance that receives cookies updates
- Access Control
  - Check `akses` (0=admin, 1=user) for admin endpoints
  - Prefer adding Supabase RLS policies to enforce authorization at the database level in addition to app checks
- API Handlers
  - Validate route params and bodies; return 400 for invalid input
  - Check `auth.getUser()` and return 401 for unauthenticated requests
  - Prefer single-responsibility handlers and reuse shared query helpers where possible
- Achievements
  - Centralized definitions in `src/lib/achievements.tsx`
  - Use `useAchievements` hook to check/unlock, and ensure idempotency on server
- UI/UX
  - Shared Button with variants and sizes; play UI feedback sounds via `useSound`
  - Provide visual feedback (toasts) for success/fail actions

## 6. Do's and Don'ts
- Do
  - Use `@/lib/supabase` in API routes with proper cookie adapters
  - Validate all external inputs (params, query, JSON body) using a schema validator (e.g., Zod)
  - Use `NextResponse.json` with correct HTTP status codes
  - Centralize constants, enums, and shared types
  - Keep client/server boundaries explicit; add `"use client"` only when necessary
  - Add RLS policies for `users`, `user_progress`, `user_achievements` per authenticated user
  - Use `ErrorBoundary` around large client trees; prefer error.tsx for route-level error UI when applicable
  - Keep migrations idempotent; document changes in SQL files
- Don't
  - Don’t import `@supabase/ssr` directly in routes—prefer the wrapper in `src/lib/supabase`
  - Don’t block the event loop with heavy synchronous I/O; for `fs` in routes, set runtime to `nodejs` and consider `fs.promises`
  - Don’t leak internal error details to clients
  - Don’t put business logic in middleware
  - Don’t rely solely on app-side auth checks; back them with DB policies

## 7. Tools & Dependencies
- Core
  - Next.js 15 (App Router), React 19, TypeScript 5
  - Tailwind CSS 4 for styling; `tailwind-merge` and `clsx` for class composition
  - Supabase (`@supabase/ssr`, `@supabase/supabase-js`) for auth and database
  - ESLint (Next config) for linting
- Key Provider/Utils
  - `src/lib/auth.tsx` – Auth context and navigation side effects
  - `src/lib/theme.tsx` – Theme provider with system preference support
  - `src/lib/sound.tsx` – Sound provider and helpers
  - `src/lib/supabase.ts` – Client factories (browser + server)
- Setup
  - Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Run migrations in `database/migrations` on Supabase (SQL Editor or CLI)
  - Scripts: `npm run dev`, `npm run build`, `npm start`, `npm run lint`
- SQL Note
  - Migrations use `gen_random_uuid()` in tables. Ensure the `pgcrypto` extension is enabled, or switch to `uuid_generate_v4()` if only `uuid-ossp` is available.

## 8. Other Notes
- Runtime
  - API routes that use `fs` (e.g., `api/images/[filename]`) should specify `export const runtime = 'nodejs'` if running on platforms that default to Edge
  - Set appropriate cache headers for static-like responses
- Performance
  - Use database indexes as provided; keep queries selective and paginated
  - Debounce rapid client-side actions; avoid excessive state churn
- Security
  - Add RLS for all tables (users, user_progress, user_achievements) to restrict access to `auth.uid()`
  - Sanitize and normalize user inputs (e.g., trimming, case normalization for answers)
  - Consider rate-limiting sensitive routes (auth, check-answer)
- Consistency
  - Standardize response shape: `{ data, error }` or domain-specific object; avoid mixing patterns
  - Unify admin checks and user fetching via shared helpers
- LLM Coding Guidelines
  - Use existing providers/hooks (`useAuth`, `useTheme`, `useSound`, `useAchievements`)
  - Reuse `Button` and `cn()` for UI consistency
  - Follow file/folder conventions and path alias `@/*`
  - Prefer adding small, targeted utilities under `src/lib` and domain APIs under `app/api/<domain>`
