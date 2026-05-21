# Tasks: Events, Trainings & Admin Dashboard

**Input**: Design documents from `specs/004-events-trainings-admin/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/api.md ✅

**Tests**: Included — mandated by Constitution Principle III (Test-Driven Implementation). Write each test task first and verify it fails before implementing the corresponding feature.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1–US5, matching spec.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies, configure Supabase clients, and write all database migration files.

- [ ] T001 Install new npm dependencies: `npm install @supabase/ssr @supabase/supabase-js @tiptap/react @tiptap/starter-kit @radix-ui/react-dialog @radix-ui/react-tabs`
- [ ] T002 Add Supabase environment variable placeholders to `.env.local` (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY) and document them in `specs/004-events-trainings-admin/quickstart.md`
- [ ] T003 [P] Create `src/lib/supabase/client.ts` — browser-side Supabase client using `createBrowserClient` from `@supabase/ssr`
- [ ] T004 [P] Create `src/lib/supabase/server.ts` — server-side Supabase client using `createServerClient` from `@supabase/ssr`, reading cookies from Next.js request context
- [ ] T005 [P] Create `src/lib/supabase/middleware.ts` — session refresh helper that calls `supabase.auth.getUser()` and writes updated cookies to the response
- [ ] T006 Create `src/middleware.ts` — Next.js middleware that imports and invokes the Supabase session refresh helper on every request (matcher: all routes except `_next/static`, `_next/image`, `favicon.ico`)
- [ ] T007 [P] Create `specs/004-events-trainings-admin/migrations/001_categories.sql` — `categories` table (id uuid PK, name text UNIQUE NOT NULL, created_at timestamptz)
- [ ] T008 [P] Create `specs/004-events-trainings-admin/migrations/002_events.sql` — `events` table with all columns per data-model.md (title, slug UNIQUE, type check, category_id FK, description, start_at, end_at check, location, is_online, price, is_free, cover_image_url, status check, timestamps) and indexes
- [ ] T009 [P] Create `specs/004-events-trainings-admin/migrations/003_registrations.sql` — `registrations` table (event_id FK CASCADE, full_name, email, phone, organisation nullable, status check, consent_given bool CHECK true, created_at) and indexes
- [ ] T010 [P] Create `specs/004-events-trainings-admin/migrations/004_inquiries.sql` — `inquiries` table (sender_name, email, service_of_interest nullable, message, is_read bool default false, submitted_at)
- [ ] T011 [P] Create `specs/004-events-trainings-admin/migrations/005_user_roles.sql` — `user_roles` table (user_id uuid UNIQUE FK → auth.users CASCADE, role check admin|staff, created_at)
- [ ] T012 Create `specs/004-events-trainings-admin/migrations/006_rls_policies.sql` — enable RLS on all 5 tables; create `get_my_role()` Postgres function; define all SELECT/INSERT/UPDATE/DELETE policies per data-model.md
- [ ] T013 Create `specs/004-events-trainings-admin/migrations/007_storage.sql` — create public `event-covers` Supabase Storage bucket; set policy: public read, authenticated write for admin/staff

**Checkpoint**: Run all 7 migrations in Supabase SQL Editor; confirm all tables, indexes, RLS policies, and storage bucket exist.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared utilities and admin shell that MUST be complete before any user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T014 [P] Create `src/lib/auth.ts` — exports `getRole(supabase): Promise<'admin'|'staff'|null>` (queries `user_roles`), `requireAdmin(supabase)` (redirects to `/admin/login` if not admin), and `requireStaff(supabase)` (redirects if not admin or staff)
- [ ] T015 [P] Create `src/lib/slugify.ts` — converts a title string to a URL-safe slug (lowercase, spaces→hyphens, strip non-alphanumeric except hyphens, trim hyphens); exported as `slugify(title: string): string`
- [ ] T016 [P] Create `src/lib/csv.ts` — exports `downloadCsv(rows: Record<string, unknown>[], columns: {key: string; label: string}[], filename: string): void`; generates CSV string with header row, proper value quoting, and triggers browser download via `URL.createObjectURL`
- [ ] T017 Create `src/components/ui/Modal.tsx` — Radix `Dialog.Root` + `Dialog.Overlay` + `Dialog.Content` wrapper; accepts `open`, `onOpenChange`, `title`, `children` props; styled with Tailwind; matches existing brand colours
- [ ] T018 Create `src/app/admin/login/page.tsx` — email + password login form; calls `supabase.auth.signInWithPassword`; on success redirects to `/admin`; on error shows inline message
- [ ] T019 Create `src/app/admin/layout.tsx` — Server Component; calls `requireStaff(supabase)`; if unauthenticated redirects to `/admin/login`; renders `AdminNav` sidebar + `{children}`
- [ ] T020 Create `src/components/admin/AdminNav.tsx` — sidebar navigation with links: Dashboard (`/admin`), Events (`/admin/events`), Categories (`/admin/categories`), Registrations (`/admin/registrations`), Inquiries (`/admin/inquiries`); highlights active route

**Checkpoint**: Navigate to `/admin/login` in dev server; log in with a seeded admin user; confirm redirect to `/admin` and sidebar renders. Navigate to `/admin` directly without login; confirm redirect to `/admin/login`.

---

## Phase 3: User Story 1 — Browse & Discover Events (Priority: P1) 🎯 MVP

**Goal**: A public visitor can navigate to `/events`, see all published upcoming events, switch to the Past tab, and filter by category or type (Event vs Training).

**Independent Test**: Navigate to `/events` with no auth. Verify event cards render with correct fields. Apply a category filter; verify only matching cards appear. Switch to "Past" tab; verify chronological listing changes. No login required at any point.

> **TDD**: Write and confirm T021–T022 fail before implementing T023–T028.

- [ ] T021 [P] [US1] Write failing Vitest unit tests for `GET /api/events` in `tests/unit/events-api.test.ts` — test: returns only published events, `view=upcoming` filters by `end_at > now()`, `view=past` filters by `end_at <= now()`, `type` param filters correctly, `category` param filters correctly, pagination returns correct page
- [ ] T022 [P] [US1] Write failing Playwright e2e test for events listing in `tests/e2e/events.spec.ts` — test: page loads at `/events`, cards show title + date + category + type + price, type filter shows only Events or only Trainings, "Past" tab renders past events, "No upcoming events" message when list is empty
- [ ] T023 [P] [US1] Create `src/app/api/events/route.ts` — `GET` handler; reads `view`, `type`, `category`, `page`, `limit` query params; queries Supabase `events` joined with `categories`; returns paginated JSON per `contracts/api.md`
- [ ] T024 [P] [US1] Create `src/app/api/categories/route.ts` — `GET` handler; fetches all rows from `categories` ordered by name; returns `{ data: [{id, name}] }`
- [ ] T025 [P] [US1] Create `src/components/events/EventCard.tsx` — renders a single event card with: cover image (or placeholder), title, type badge, category name, formatted start date, location/mode label, price or "Free" badge; links to `/events/[slug]`
- [ ] T026 [P] [US1] Create `src/components/events/EventFilters.tsx` — renders a category `<select>` populated from categories prop and an Event/Training type toggle (radio buttons or segmented control); calls `onFilterChange` callback on change; matches brand styling
- [ ] T027 [US1] Create `src/components/events/EventGrid.tsx` — Radix `Tabs.Root` with "Upcoming" (default) and "Past" tabs; each tab renders a responsive grid of `EventCard`; shows "No upcoming events" / "No past events" empty state; accepts `upcomingEvents`, `pastEvents`, `categories` props; triggers `EventFilters` for active tab
- [ ] T028 [US1] Create `src/app/events/page.tsx` — Server Component; fetches events (upcoming) + categories from `/api/events` and `/api/categories`; passes data to `EventGrid` + `EventFilters`; uses Next.js `searchParams` to apply initial filter state

**Checkpoint**: `npm run test` (Vitest passes). `npm run test:e2e -- --grep "events listing"` passes. `/events` page renders real events from Supabase.

---

## Phase 4: User Story 2 — View Event Details & Register (Priority: P1)

**Goal**: A visitor clicks an event card, views full event details, clicks "Register Now", completes the registration modal (including consent checkbox), and sees a success confirmation.

**Independent Test**: Navigate to `/events/[slug]` directly. Verify full event details visible. Click "Register Now"; confirm modal opens. Submit valid form; confirm success message appears and registration row appears in Supabase. Submit without checking consent; confirm form does not submit.

> **TDD**: Write and confirm T029–T030 fail before implementing T031–T034.

- [ ] T029 [P] [US2] Write failing Vitest unit tests for `POST /api/registrations` in `tests/unit/registrations-api.test.ts` — test: valid payload creates registration with `status=pending`, missing required field returns 400 with field-level errors, `consent_given=false` returns 400, non-existent or draft event_id returns 404
- [ ] T030 [P] [US2] Write failing Playwright e2e test for registration modal flow in `tests/e2e/registration.spec.ts` — test: clicking "Register Now" opens modal, form has name/email/phone/organisation/consent fields, submitting without consent shows error, valid submission shows success message, modal closes on success
- [ ] T031 [P] [US2] Create `src/app/api/events/[slug]/route.ts` — `GET` handler; looks up `events` by slug where `status = 'published'`; joins category; returns full event JSON per `contracts/api.md`; returns 404 if not found or draft
- [ ] T032 [P] [US2] Create `src/app/api/registrations/route.ts` — `POST` handler; validates body (full_name, email, phone, consent_given=true, valid event_id for a published event); inserts into `registrations` with `status='pending'`; returns 201 on success
- [ ] T033 [P] [US2] Create `src/components/events/RegistrationModal.tsx` — wraps `Modal.tsx`; form fields: full name, email, phone, organisation (optional); consent checkbox with privacy policy link; client-side validation before POST to `/api/registrations`; shows success message on 201; shows error message on failure; closes modal on success after 2s delay
- [ ] T034 [US2] Create `src/app/events/[slug]/page.tsx` — Server Component; fetches event from `/api/events/[slug]`; renders cover image, description HTML (inside Tailwind prose container), type/category/date/location/price details; "Register Now" button opens `RegistrationModal`; returns `notFound()` for 404 response

**Checkpoint**: `npm run test` passes. `npm run test:e2e -- --grep "registration"` passes. End-to-end: visit `/events/[slug]`, register, see success, verify row in Supabase.

---

## Phase 5: User Story 3 — Admin Manages Events (Priority: P2)

**Goal**: An authenticated admin can create, publish, edit, and delete events and manage categories. Staff can create and edit but not delete. Dashboard shows summary counts.

**Independent Test**: Log in as admin at `/admin/login`. Create a new event with all fields, upload a cover image, set as Published. Verify it appears on `/events`. Edit it; verify change on public site. Delete it; verify removal. Log in as staff; confirm no delete option. Navigate to `/admin/categories`; create, rename, and delete a category.

> **TDD**: Write and confirm T035 fails before implementing T036–T043.

- [ ] T035 [P] [US3] Write failing Playwright e2e test for admin event CRUD in `tests/e2e/admin-events.spec.ts` — test: login redirects to dashboard, admin can create + publish event (appears on /events), admin can edit event, admin can delete event, staff cannot see delete button, category in use cannot be deleted, published/draft toggle works
- [ ] T036 [P] [US3] Create `src/components/admin/CategoryManager.tsx` — lists all categories; inline "Add Category" input + button; rename (click-to-edit inline); delete button (disabled with tooltip if category is in use by any event); calls Supabase directly via Server Actions
- [ ] T037 [P] [US3] Create `src/app/admin/categories/page.tsx` — renders `CategoryManager`; Server Component that pre-fetches categories
- [ ] T038 [US3] Create `src/components/admin/EventForm.tsx` — controlled form with: title input (auto-populates slug, admin-editable), type select (Event/Training), category select (fetched from categories), Tiptap StarterKit rich-text description editor, start/end datetime inputs, location text input, is_online toggle, is_free toggle + price input, cover image file upload (validates ≤5MB, type jpeg/png/webp, uploads to Supabase Storage `event-covers` bucket, stores public URL), status select (draft/published); submit via Server Action; used by both create and edit pages
- [ ] T039 [P] [US3] Create `src/app/admin/events/page.tsx` — lists all events (admin sees all statuses); columns: title, type, category, start date, status badge, publish/unpublish toggle button, Edit link, Delete button (admin only); data fetched via Supabase server client
- [ ] T040 [P] [US3] Create `src/app/admin/events/new/page.tsx` — renders `EventForm` in create mode; on submit redirects to `/admin/events`
- [ ] T041 [US3] Create `src/app/admin/events/[id]/edit/page.tsx` — fetches event by ID; renders `EventForm` pre-populated with existing values; on submit redirects to `/admin/events`; staff role sees no delete action on this page
- [ ] T042 [US3] Create `src/components/admin/DashboardStats.tsx` — 4 stat cards: "Total Events" (all statuses), "Upcoming Events" (published, end_at > now()), "Total Registrations", "Unread Inquiries"; each card shows icon + count fetched in parallel via Supabase server client
- [ ] T043 [US3] Create `src/app/admin/page.tsx` — dashboard home; renders `DashboardStats`; Server Component

**Checkpoint**: `npm run test:e2e -- --grep "admin-events"` passes. Full admin CRUD cycle verified manually. `/events` reflects published/draft state correctly.

---

## Phase 6: User Story 4 — Admin Views Registrations (Priority: P2)

**Goal**: Admin and staff can view all registrations, filter by event, update registration status, and export the visible list as CSV.

**Independent Test**: Submit 2+ test registrations via the public site. Log in as admin. Open `/admin/registrations`; confirm all registrations appear. Filter by a specific event; confirm only that event's registrations show. Change a status to "Confirmed"; confirm it updates immediately. Click "Export CSV"; confirm downloaded file contains correct data.

> **TDD**: Write and confirm T044 fails before implementing T045–T046.

- [ ] T044 [P] [US4] Write failing Playwright e2e test for registrations management in `tests/e2e/admin-registrations.spec.ts` — test: all registrations visible, event filter narrows list, status dropdown updates registration, Export CSV button triggers file download with correct headers
- [ ] T045 [P] [US4] Create `src/components/admin/RegistrationsTable.tsx` — table with columns: registrant name, email, phone, organisation, event title, status (select: pending/confirmed/cancelled — updates via Server Action), registered date; event filter `<select>` at top; "Export CSV" button calls `csv.ts` with visible rows; status badge colours per value
- [ ] T046 [US4] Create `src/app/admin/registrations/page.tsx` — Server Component; fetches all registrations joined with event titles; renders `RegistrationsTable`; passes event list for filter dropdown

**Checkpoint**: `npm run test:e2e -- --grep "admin-registrations"` passes. CSV export verified manually.

---

## Phase 7: User Story 5 — Admin Views Inquiries (Priority: P3)

**Goal**: Admin and staff can see all contact form submissions in the dashboard and mark them as read or unread. The contact form is updated to also save submissions to the database.

**Independent Test**: Submit a contact form on the public site. Log in as admin. Open `/admin/inquiries`; confirm the new inquiry appears marked "Unread". Click to mark as read; confirm status changes. Submit another form; confirm it appears immediately.

> **TDD**: Write and confirm T047 fails before implementing T048–T050.

- [ ] T047 [P] [US5] Write failing Playwright e2e test for inquiries management in `tests/e2e/admin-inquiries.spec.ts` — test: contact form submission appears in admin inquiries list, new submissions default to Unread, read/unread toggle updates state, sender name + email + message + date display correctly
- [ ] T048 [US5] Update `src/app/api/contact/route.ts` — after `sendInquiryEmail` resolves (success or failure), insert `{ sender_name: name, email, service_of_interest: serviceOfInterest, message }` into `inquiries` table using the server Supabase client; log insert error server-side but do NOT alter the HTTP response to the user
- [ ] T049 [P] [US5] Create `src/components/admin/InquiriesTable.tsx` — table with columns: sender name, email, service of interest, message (truncated with expand), submission date, read/unread toggle button; unread rows visually highlighted; toggle calls Server Action to update `is_read`
- [ ] T050 [US5] Create `src/app/admin/inquiries/page.tsx` — Server Component; fetches all inquiries ordered by `submitted_at DESC`; renders `InquiriesTable`

**Checkpoint**: `npm run test:e2e -- --grep "admin-inquiries"` passes. Submit contact form; verify row appears in Supabase `inquiries` table and in admin UI.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening, UX improvements, and end-to-end validation.

- [ ] T051 Run full `quickstart.md` validation: fresh `.env.local`, apply all 7 migrations in order, seed one admin user, smoke-test public events page, event detail page, registration modal, admin login, all admin sections — document any deviations
- [ ] T052 [P] Verify all Supabase RLS policies: confirm anonymous user cannot SELECT from `registrations`, `inquiries`, or `user_roles`; confirm staff cannot DELETE events; confirm admin can DELETE events — use Supabase dashboard policy simulator or a dedicated test script
- [ ] T053 [P] Add loading skeleton states to `src/components/events/EventCard.tsx` (skeleton variant) and `src/components/events/EventGrid.tsx` (show skeletons while fetching past events on tab switch)
- [ ] T054 [P] Add `error.tsx` pages at `src/app/events/error.tsx` and `src/app/admin/error.tsx` — each renders a user-friendly error message with a retry button
- [ ] T055 Final smoke test: verify "Register Now" modal opens and closes correctly, registration confirmation message displays, admin CSV export contains correct columns, admin publish/draft toggle immediately reflects on `/events`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately. T003–T005 and T007–T011 are fully parallel within the phase.
- **Phase 2 (Foundational)**: Depends on Phase 1 complete. T014–T016 are parallel. T017 must precede T033 (RegistrationModal uses Modal). T019 must precede all admin pages.
- **Phase 3 (US1)**: Depends on Phase 2 complete. T021–T026 are parallel (tests + API + components). T027 depends on T025 + T026. T028 depends on T023 + T024 + T027.
- **Phase 4 (US2)**: Depends on Phase 2 complete. T029–T033 are parallel. T034 depends on T031 + T033.
- **Phase 5 (US3)**: Depends on Phase 2 complete. T035–T037 + T039–T040 are parallel. T038 (EventForm) depends on T015 (slugify) + T016 (csv not needed) + T003 (Supabase Storage upload). T041 depends on T038. T042–T043 are parallel to T036–T041.
- **Phase 6 (US4)**: Depends on Phase 2 complete. T044–T045 parallel. T046 depends on T045.
- **Phase 7 (US5)**: Depends on Phase 1 complete (Supabase server client). T047–T049 parallel. T050 depends on T049.
- **Phase 8 (Polish)**: Depends on all desired user story phases complete.

### User Story Dependencies

- **US1 (P1)**: Independently testable after Phase 2. No dependency on US2–US5.
- **US2 (P1)**: Independently testable after Phase 2. Requires the same event data as US1 (shared Supabase tables) but no code dependency on US1 components.
- **US3 (P2)**: Independently testable after Phase 2. Admin creates events that US1/US2 display — functional dependency on shared DB, not code.
- **US4 (P2)**: Independently testable after Phase 2. Reads registrations created by US2.
- **US5 (P3)**: Independently testable after Phase 1. Only dependency is T048 (contact route update) which is self-contained.

### Within Each User Story

1. Test tasks (failing) → written first, verified failing
2. API route / data layer tasks
3. Component tasks (parallel where different files)
4. Page tasks (depend on routes + components)
5. Story complete → run checkpoint before moving on

---

## Parallel Opportunities

### Phase 1

```
T001 → T002 (sequential: deps installed first)
T003, T004, T005   ← parallel (different files)
T006               ← after T005
T007, T008, T009, T010, T011  ← parallel (different SQL files)
T012               ← after T007–T011 (references all tables)
T013               ← parallel to T012
```

### Phase 3 (US1)

```
T021, T022, T023, T024, T025, T026  ← all parallel
T027  ← after T025 + T026
T028  ← after T023 + T024 + T027
```

### Phase 4 (US2)

```
T029, T030, T031, T032, T033  ← all parallel
T034  ← after T031 + T033
```

### Phase 5 (US3)

```
T035, T036, T037, T039, T040, T042  ← parallel
T038  ← requires T015 (slugify)
T041  ← after T038
T043  ← after T042
```

---

## Implementation Strategy

### MVP First (US1 + US2 Only)

1. Complete Phase 1: Setup (T001–T013)
2. Complete Phase 2: Foundational (T014–T020)
3. Complete Phase 3: US1 — events listing (T021–T028)
4. Complete Phase 4: US2 — event detail + registration (T029–T034)
5. **STOP and VALIDATE**: public events page fully functional, registration working end-to-end
6. Deploy to Vercel — public MVP live

### Incremental Delivery

1. Setup + Foundational → infrastructure ready
2. US1 → events listing live (MVP browsing)
3. US2 → registration live (MVP conversion)
4. US3 → admin can manage events (operational)
5. US4 → admin can manage registrations (operational)
6. US5 → admin can see inquiries (operational)
7. Polish → production-hardened

### Single-Developer Sequence

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8
```

Each phase produces a testable increment. Stop at any checkpoint to validate before continuing.

---

## Notes

- `[P]` tasks operate on different files — run in parallel to save time
- `[Story]` label maps each task to a user story for traceability
- Constitution mandates TDD: each test task must fail before the implementation task it covers begins
- Commit after each completed task or logical group (use `/speckit-git-commit`)
- Supabase RLS is the authoritative security layer — app-level role checks are defence-in-depth
- The `consent_given` DB CHECK constraint is a safety net; the form also enforces it client-side
- Cover image upload: validate file size (≤5MB) and type before upload to stay within Supabase free tier limits
