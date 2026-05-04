---
description: "Task list for Africom Company Website implementation"
---

# Tasks: Africom Company Website

**Input**: Design documents from `/specs/001-company-website/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/ ✅

**Tests**: Included — the project constitution mandates test-driven implementation
(Principle III); acceptance scenarios in spec.md drive Playwright E2E tests;
form validation logic drives Vitest unit tests.

**Organization**: Tasks are grouped by user story to enable independent implementation
and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths are included in every task description

## Path Conventions

Single-project web application:

- `src/app/` — Next.js App Router pages and API routes
- `src/components/` — Reusable UI components
- `src/content/` — Static content data (TypeScript)
- `src/lib/` — Utility modules
- `public/` — Static assets
- `tests/e2e/` — Playwright acceptance tests
- `tests/unit/` — Vitest unit tests

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize project tooling and directory structure

- [ ] T001 Initialize Next.js 14 project with TypeScript and App Router (`npx create-next-app@latest . --typescript --tailwind --app --no-src-dir` then move to `src/` layout per plan.md)
- [ ] T002 [P] Configure Tailwind CSS base styles and design tokens in `tailwind.config.ts` and `src/app/globals.css`
- [ ] T003 [P] Install and configure Playwright for E2E testing (`npx playwright install`; create `playwright.config.ts` targeting localhost:3000)
- [ ] T004 [P] Install and configure Vitest for unit tests (`npm install -D vitest`; add `vitest.config.ts`)
- [ ] T005 [P] Install Resend SDK (`npm install resend`) and create `.env.local.example` with `RESEND_API_KEY` and `CONTACT_EMAIL` placeholders
- [ ] T006 [P] Create directory scaffolding: `src/components/layout/`, `src/components/sections/`, `src/components/ui/`, `src/content/`, `src/lib/`, `tests/e2e/`, `tests/unit/`, `public/images/hero/`, `public/images/products/`, `public/images/partners/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core layout shell, email utility, and shared content types that all user
stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T007 Create root layout shell in `src/app/layout.tsx` (imports Header and Footer, sets `<html lang="en">`, links global CSS)
- [ ] T008 [P] Create `Header` component in `src/components/layout/Header.tsx` with navigation links to all 5 routes (`/`, `/about`, `/exports`, `/consultation`, `/contact`) per `contracts/page-routes.md`
- [ ] T009 [P] Create `Footer` component in `src/components/layout/Footer.tsx` with company name, copyright, and contact email placeholder
- [ ] T010 [P] Create `Navigation` component in `src/components/layout/Navigation.tsx` (mobile-responsive hamburger + desktop horizontal nav; used by Header)
- [ ] T011 [P] Create `Button` UI component in `src/components/ui/Button.tsx` (primary and secondary variants; accepts `href` for link-buttons)
- [ ] T012 Create custom 404 page in `src/app/not-found.tsx` with user-friendly message and link back to homepage (FR-012)
- [ ] T013 [P] Create placeholder TypeScript content data files: `src/content/company.ts` (CompanyProfile), `src/content/products.ts` (ProductCategory[]), `src/content/services.ts` (ConsultationService[]), `src/content/credibility.ts` (CredibilityIndicator[]) — use data shapes from `data-model.md`, populate with clearly-labelled placeholder values
- [ ] T014 [P] Create email utility in `src/lib/email.ts` — exports `sendInquiryEmail(data: InquiryFormData): Promise<{success: boolean}>` using Resend SDK; reads `RESEND_API_KEY` and `CONTACT_EMAIL` from environment

**Checkpoint**: Foundation ready — layout renders, navigation works, content types defined, email utility implemented. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Export Client Discovery (Priority: P1) 🎯 MVP

**Goal**: A first-time visitor can find Africom's export product categories, confirm company
credibility, and submit a business inquiry via the contact form.

**Independent Test**: The homepage, `/exports` page, and `/contact` page function
completely with placeholder product content; the inquiry form submits and delivers an email.

### Tests for User Story 1 ⚠️ Write first — verify they FAIL before implementing

- [ ] T015 [P] [US1] Write E2E test for export client discovery flow in `tests/e2e/export-client.spec.ts`:
  - Homepage loads and displays a visible CTA linking to `/exports`
  - `/exports` page lists at least one product category with name, origin, and characteristics
  - `/contact` page shows the inquiry form
  - Form submission with `serviceOfInterest: "export"` shows success confirmation
  - Form submission with empty required fields shows validation errors
- [ ] T016 [P] [US1] Write unit test for inquiry form validation logic in `tests/unit/form-validation.test.ts`:
  - Empty name → error
  - Invalid email → error
  - Message under 10 characters → error
  - Valid complete submission → no errors

### Implementation for User Story 1

- [ ] T017 [P] [US1] Populate `src/content/company.ts` with Africom's CompanyProfile placeholder data (name, tagline, mission, US registration status, Tanzanian origin, regional/international markets, contact email)
- [ ] T018 [P] [US1] Populate `src/content/products.ts` with at least 3 sample ProductCategory entries (name, originRegion "Tanzania", keyCharacteristics, targetMarkets) as placeholder until Africom supplies real content
- [ ] T019 [US1] Create `ProductCategoryCard` component in `src/components/sections/ProductCategoryCard.tsx` — renders name, origin, key characteristics list, and target markets for one product category
- [ ] T020 [US1] Create Exports page in `src/app/exports/page.tsx` — renders a grid of ProductCategoryCard components from `src/content/products.ts`; includes a CTA linking to `/contact`; sets unique SEO title and meta description
- [ ] T021 [US1] Create `InquiryForm` component in `src/components/ui/InquiryForm.tsx` — fields: name (required), organization (optional), email (required), serviceOfInterest dropdown (export/consultation/other, required), message (required); client-side validation per `data-model.md` rules; shows success confirmation or error state
- [ ] T022 [US1] Create contact form API route in `src/app/api/contact/route.ts` — POST handler per `contracts/contact-api.md`; server-side validation; calls `sendInquiryEmail` from `src/lib/email.ts`; returns 200/400/500 JSON responses with correct shapes
- [ ] T023 [US1] Create Contact page in `src/app/contact/page.tsx` — renders InquiryForm; includes company contact details (email, address); sets unique SEO title and meta description
- [ ] T024 [US1] Create `HeroSection` component in `src/components/sections/HeroSection.tsx` — full-width banner with company tagline, brief description, and two CTA buttons linking to `/exports` and `/consultation`
- [ ] T025 [US1] Create `ServiceSplitSection` component in `src/components/sections/ServiceSplitSection.tsx` — two-column section clearly differentiating the export business line from consultation services, each with a summary and "Learn more" link (FR-005)
- [ ] T026 [US1] Create Homepage in `src/app/page.tsx` — renders HeroSection and ServiceSplitSection; visitor can identify both service lines and navigate to each within 30 seconds (SC-001); sets unique SEO title and meta description

**Checkpoint**: User Story 1 is fully functional. Export client can discover products and
submit an inquiry end-to-end. MVP is shippable at this point.

---

## Phase 4: User Story 2 - Development Partner Discovery (Priority: P2)

**Goal**: An NGO, donor, or implementation partner can discover Africom's consultation
services and submit an engagement inquiry.

**Independent Test**: The `/consultation` page functions with placeholder service content;
the inquiry form accepts a `serviceOfInterest: "consultation"` submission.

### Tests for User Story 2 ⚠️ Write first — verify they FAIL before implementing

- [ ] T027 [P] [US2] Write E2E test for development partner discovery flow in `tests/e2e/dev-partner.spec.ts`:
  - Homepage displays a visible CTA linking to `/consultation`
  - `/consultation` page lists at least one consultation service with name, target audience, and value chain topics
  - Consultation service is visually distinct from export products (FR-005)
  - `/contact` form accepts `serviceOfInterest: "consultation"` and shows success confirmation

### Implementation for User Story 2

- [ ] T028 [P] [US2] Populate `src/content/services.ts` with at least 2 sample ConsultationService entries (name, description, targetAudience, valueChainTopics) as placeholder until Africom supplies real content
- [ ] T029 [US2] Create `ConsultationServiceCard` component in `src/components/sections/ConsultationServiceCard.tsx` — renders service name, description, target audience badges, and value chain topics
- [ ] T030 [US2] Create Consultation page in `src/app/consultation/page.tsx` — renders a list of ConsultationServiceCard components from `src/content/services.ts`; includes a CTA linking to `/contact`; sets unique SEO title and meta description

**Checkpoint**: User Stories 1 and 2 are both independently functional. Both service lines
are discoverable and contactable.

---

## Phase 5: User Story 3 - Company Credibility Research (Priority: P3)

**Goal**: A researcher or investor can read Africom's full company background and validate
legitimacy via the About section.

**Independent Test**: The `/about` page functions with placeholder company profile content;
the CredibilitySection renders or is gracefully omitted when no credibility data is present.

### Tests for User Story 3 ⚠️ Write first — verify they FAIL before implementing

- [ ] T031 [P] [US3] Write E2E test for company credibility research in `tests/e2e/credibility.spec.ts`:
  - `/about` page displays company name, mission statement, and US registration status
  - `/about` page includes a contact link or CTA
  - CredibilitySection renders when `src/content/credibility.ts` contains entries
  - CredibilitySection is absent (not an empty section) when content array is empty

### Implementation for User Story 3

- [ ] T032 [P] [US3] Populate `src/content/credibility.ts` — default export is an empty array (`[]`); add documentation comment instructing developers to populate only when Africom supplies logos/certifications/highlights
- [ ] T033 [US3] Create `CredibilitySection` component in `src/components/sections/CredibilitySection.tsx` — renders conditionally: returns `null` when the `CredibilityIndicator[]` prop is empty; otherwise renders partner logos, certifications, or project highlights grouped by type
- [ ] T034 [US3] Create About page in `src/app/about/page.tsx` — renders company history, mission, US registration status, and geographic reach from `src/content/company.ts`; includes CredibilitySection; sets unique SEO title and meta description
- [ ] T035 [US3] Integrate CredibilitySection into Homepage (`src/app/page.tsx`) — append below ServiceSplitSection, rendered only when `credibility.ts` content array is non-empty

**Checkpoint**: All three user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Quality, performance, and SEO concerns that span all user stories

- [ ] T036 [P] Audit and complete SEO metadata for all 5 pages — each page MUST have a unique `<title>`, `<meta name="description">`, and `<h1>` per `contracts/page-routes.md`; homepage title MUST include "Africom"
- [ ] T037 [P] Validate responsive layout on all pages at 375px (mobile) and 1280px (desktop); fix any layout breakage or overflowing content
- [ ] T038 [P] Add social media links to `src/components/layout/Footer.tsx` — render SocialLink items from `src/content/company.ts`; omit the social links block entirely when the array is empty
- [ ] T039 Run full Playwright E2E test suite across Chromium, Firefox, and WebKit; confirm all tests pass (validates SC-006 — 3 major browsers)
- [ ] T040 Run complete quickstart.md validation checklist end-to-end on a clean build
- [ ] T041 Performance audit: measure homepage load time for international visitors using Lighthouse or WebPageTest; verify full load < 4 seconds (SC-004); address any failing assets (image compression, font loading)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — **BLOCKS all user stories**
- **User Stories (Phases 3–5)**: All depend on Foundational phase completion
  - User stories CAN proceed in parallel once Phase 2 is complete
  - Sequential priority order: P1 → P2 → P3 (single developer)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on US2 or US3 — pure MVP
- **User Story 2 (P2)**: Depends on Foundational only; InquiryForm from US1 already supports the `consultation` service type
- **User Story 3 (P3)**: Depends on Foundational only; About page uses `company.ts` content created in US1 Setup

### Within Each User Story

- Tests MUST be written first and MUST fail before implementation starts (Principle III)
- Content data files before components
- Components before pages
- Pages before E2E test verification
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (after T007)
- US1 tests (T015, T016) run in parallel with each other
- US1 content tasks (T017, T018) run in parallel with each other
- US2 tests (T027) and US2 content (T028) run in parallel
- US3 tests (T031) and US3 content (T032) run in parallel
- Polish tasks T036, T037, T038 run in parallel

---

## Parallel Example: User Story 1

```bash
# Write tests and content data in parallel before building components:
Task: "T015 — Write E2E export client test"
Task: "T016 — Write form validation unit test"
Task: "T017 — Populate company.ts content"
Task: "T018 — Populate products.ts content"

# Then build components sequentially (each depends on previous):
T019 → ProductCategoryCard
T020 → Exports page (uses ProductCategoryCard)
T021 → InquiryForm
T022 → Contact API route (uses email utility)
T023 → Contact page (uses InquiryForm)
T024 → HeroSection
T025 → ServiceSplitSection
T026 → Homepage (uses HeroSection + ServiceSplitSection)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (P1)
4. **STOP and VALIDATE**: Run quickstart.md checklist for export client flow
5. Deploy to Vercel preview — MVP is live and shippable

### Incremental Delivery

1. Setup + Foundational → project runs locally
2. User Story 1 complete → Export client MVP (shippable)
3. User Story 2 complete → Both service lines discoverable (shippable)
4. User Story 3 complete → Full site with credibility section (launch-ready)
5. Polish phase → Performance, SEO, and cross-browser validation

### Parallel Team Strategy

With multiple developers, once Foundational is complete:
- Developer A: User Story 1 (export flow + contact form)
- Developer B: User Story 2 (consultation services)
- Developer C: User Story 3 (about + credibility) + Polish

---

## Notes

- `[P]` tasks operate on different files with no incomplete-task dependencies
- `[Story]` label maps each task to the user story for traceability
- Tests MUST fail before implementation — do not skip this step (constitution Principle III)
- Content data files use placeholder values during development; Africom supplies finals
- CredibilitySection and social links render conditionally — never show empty sections
- Commit after each phase checkpoint or logical group
- Stop at any checkpoint to validate the story independently before proceeding
