---
description: "Task list for Real Content Update from Official Brand Document"
---

# Tasks: Real Content Update from Official Brand Document

**Input**: Design documents from `specs/002-real-content-update/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ quickstart.md ✅

**Tests**: Included — constitution Principle III mandates test-driven implementation.
Existing Playwright E2E test assertions are updated to assert real content values (so they
FAIL before implementation) and pass after each story is complete.

**Organization**: Tasks are grouped by user story to enable independent implementation
and testing. US4 (Contact Details) is implemented before US1 (Identity) because both touch
`src/content/company.ts` — doing contact schema first avoids merge conflicts.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US6 from spec.md)
- Exact file paths included in every task description

## Path Conventions

Single Next.js project:

- `src/content/` — TypeScript content data files
- `src/components/` — UI and section components
- `src/app/` — Next.js App Router pages
- `tests/e2e/` — Playwright acceptance tests

---

## Phase 1: Setup (TDD Prerequisites)

**Purpose**: Update existing E2E tests to assert real content values so they FAIL before
implementation begins, per Constitution Principle III. These test files already exist
from feature 001 — they are being made more specific to fail on placeholder content.

- [x] T001 Update `tests/e2e/export-client.spec.ts` to assert all 5 real product names appear on `/exports`: Avocado, Green Bean, Ginger, Garlic, Capsicum — and assert none of the placeholder names (cashew, sesame, coffee, pulses) appear
- [x] T002 [P] Update `tests/e2e/dev-partner.spec.ts` to assert all 4 real service names appear on `/consultation`: Agribusiness Consultation, Trade Facilitation, Agribusiness Capacity Building, Sustainability Initiatives
- [x] T003 [P] Update `tests/e2e/credibility.spec.ts` to assert that when credibility data is populated, the stat "5 innovative agribusiness initiatives" and a quote attributed to "Oliver Hartman" appear on the homepage

**⚠️ Verify tests FAIL** before proceeding to Phase 2.

---

## Phase 2: Foundational (TypeScript Interface Extensions)

**Purpose**: Extend TypeScript interfaces to support all new data fields. These schema changes
MUST be in place before any story-level data updates, as later tasks depend on the types.
New fields are added as optional to avoid breaking the existing data object until story phases
populate them.

**⚠️ CRITICAL**: No user story data work can begin until this phase is complete.

- [x] T004 Extend `src/content/company.ts` interface: add `OfficeAddress` sub-interface (`label`, `address`, `country`); add optional fields `vision?: string`, `coreValues?: string[]`, `offices?: OfficeAddress[]`, `phones?: string[]` to `CompanyProfile` (TypeScript types only — no data values yet)
- [x] T005 [P] Extend `AudienceType` union in `src/content/services.ts` to add `"farmers-organisation" | "cooperative" | "development-partner"` and add corresponding entries to `audienceLabels` map: `"Farmers' Organisation"`, `"Cooperative"`, `"Development Partner"` (TypeScript types only)
- [x] T006 [P] Extend `IndicatorType` union in `src/content/credibility.ts` to add `"stat" | "testimonial"` and add optional `quote?: string` field to `CredibilityIndicator` interface (TypeScript types only)

**Checkpoint**: TypeScript interfaces extended. Run `npx tsc --noEmit` to verify no compile errors. User story data updates can now begin.

---

## Phase 3: User Story 4 - Real Contact Details (Priority: P1)

**Goal**: A visitor finds real Africom contact information — two office addresses, two phone
numbers, and info@africom.biz — on the contact page and in the footer.

**Independent Test**: `/contact` shows both addresses, both phones, and info@africom.biz;
the fallback email in the form error state reads info@africom.biz; no placeholder email appears.

### Implementation for User Story 4

- [x] T007 [US4] Populate contact data in `src/content/company.ts`: set `contactEmail` to `"info@africom.biz"`, populate `phones` array with `["+255-758-208-673", "+1 904-477-9924"]`, populate `offices` array with Tanzania office (`"16103 Riverside St, Dar es Salaam, Tanzania"`) and USA office (`"8064 83rd Ave Sw Unit H01, Lakewood, WA 98498, USA"`)
- [x] T008 [US4] Update `src/app/contact/page.tsx` to render both offices by iterating `company.offices` and both phones by iterating `company.phones`, replacing the current single-address and single-phone display
- [x] T009 [P] [US4] Replace hardcoded `"info@africom-exports.com"` with `"info@africom.biz"` in the error state `<a href>` and link text in `src/components/ui/InquiryForm.tsx`

**Checkpoint**: Contact page shows two addresses, two phones, info@africom.biz. Grep for "info@africom-exports.com" in `src/` returns no results.

---

## Phase 4: User Story 1 - Real Company Identity (Priority: P1)

**Goal**: A visitor sees the real Africom brand: legal name "Africom International Ltd",
tagline "From Farm to Global Markets", exact mission, vision, and 8 core values.

**Independent Test**: Homepage hero shows real tagline. About page shows real mission, vision,
and all 8 core values. No "Africom LLC" appears anywhere in source files.

### Implementation for User Story 1

- [x] T010 [US1] Update identity data in `src/content/company.ts`: set `legalName` to `"Africom International Ltd"`, `tagline` to `"From Farm to Global Markets"`, `mission` to the exact brand document text, populate `vision` with exact brand document text, populate `coreValues` with the 8 values: `["Sustainability", "Innovation", "Integrity", "Empowerment", "Quality", "Community", "Collaboration", "Respect for Nature"]`, update `description` to reference Tanzania-based enterprise with both offices, update `usRegistrationStatus` to reflect international structure
- [x] T011 [US1] Add "Our Vision" section displaying `company.vision` and a "Core Values" grid displaying all 8 values from `company.coreValues` to `src/app/about/page.tsx`, inserted after the existing Mission section
- [x] T012 [P] [US1] Update the brand name display in `src/components/layout/Footer.tsx`: change the hardcoded `"Africom"` in the brand column and copyright line to use `company.legalName` (or `company.name` if kept as a short display name)
- [x] T013 [P] [US1] Update `src/app/about/page.tsx` metadata `description` to reference "Africom International Ltd" and update the page's `usRegistrationStatus` display to match the new value

**Checkpoint**: `grep -r "Africom LLC" src/` returns no results. About page shows real mission, vision, and 8 core values. Hero tagline reads "From Farm to Global Markets".

---

## Phase 5: User Story 2 - Real Export Products (Priority: P1)

**Goal**: An export buyer visiting `/exports` sees exactly the 5 real Africom products
(Avocado, Green Bean, Ginger, Garlic, Capsicum) sourced from Tanzania. No placeholder
products remain.

**Independent Test**: `/exports` page lists exactly 5 products; text search for "cashew",
"sesame", "coffee", "pulses" returns no results in `src/`.

### Implementation for User Story 2

- [x] T014 [US2] Replace all 4 placeholder product entries in `src/content/products.ts` with 5 real products: Avocado, Green Bean, Ginger, Garlic, Capsicum — each with `originRegion: "Tanzania"`, real description, 4–5 key characteristics per product, and target markets; use IDs: `"avocado"`, `"green-bean"`, `"ginger"`, `"garlic"`, `"capsicum"`
- [x] T015 [P] [US2] Update the "Agricultural Exports" service block description in `src/components/sections/ServiceSplitSection.tsx` to reference "avocados, green beans, ginger, garlic, and capsicum" instead of "cashew nuts, sesame, coffee, and pulses"

**Checkpoint**: `/exports` page shows 5 real products. `grep -ri "cashew\|sesame\|pulses\|coffee" src/` returns no results.

---

## Phase 6: User Story 3 - Real Services (Priority: P2)

**Goal**: A service-seeker finds the 4 real Africom service lines — Agribusiness Consultation,
Trade Facilitation, Agribusiness Capacity Building, Sustainability Initiatives — with accurate
descriptions targeting farmers' organisations, cooperatives, NGOs, and development partners.

**Independent Test**: `/consultation` page lists exactly 4 real services; target audience
badges include "Farmers' Organisation" and "Cooperative" labels.

### Implementation for User Story 3

- [x] T016 [US3] Replace all 4 placeholder service entries in `src/content/services.ts` with 4 real services: Agribusiness Consultation (audiences: `farmers-organisation`, `cooperative`, `ngo`), Trade Facilitation (audiences: `farmers-organisation`, `cooperative`, `implementation-partner`), Agribusiness Capacity Building (audiences: `farmers-organisation`, `cooperative`, `ngo`, `development-partner`), Sustainability Initiatives (audiences: `ngo`, `donor`, `development-partner`) — with real descriptions and value chain topics per the brand document

**Checkpoint**: `/consultation` page shows 4 real services with correct audience badges. T002 E2E assertions pass.

---

## Phase 7: User Story 5 - Homepage Credibility Stats + Testimonial (Priority: P3)

**Goal**: A first-time visitor sees the "5 innovative agribusiness initiatives" stat and the
Oliver Hartman testimonial on the homepage, building immediate trust.

**Independent Test**: Homepage shows the stat and testimonial without navigating away;
`CredibilitySection` renders with both new entry types displayed.

### Implementation for User Story 5

- [x] T017 [US5] Populate `src/content/credibility.ts` with two new entries: (1) stat entry with `id: "stat-agribusiness-initiatives"`, `type: "stat"`, `name: "5 Innovative Agribusiness Initiatives"`, `description: "Programmes driving sustainable growth across the agricultural value chain"`; (2) testimonial entry with `id: "testimonial-oliver-hartman"`, `type: "testimonial"`, `name: "Oliver Hartman"`, `quote: "Outstanding service and deep knowledge of the agricultural value chain — Africom delivered beyond our expectations."`
- [x] T018 [US5] Extend `src/components/sections/CredibilitySection.tsx` to render a `"stat"` type indicator as a large number/headline callout and a `"testimonial"` type indicator as a styled blockquote with name attribution — add these two render branches alongside the existing `partner-logo`, `certification`, `project-highlight` branches

**Checkpoint**: Homepage credibility section renders with the stat and Oliver Hartman testimonial. T003 E2E assertions pass.

---

## Phase 8: User Story 6 - Farm Partnerships Positioning (Priority: P3)

**Goal**: Visitors can read Africom's commitment to sustainable productivity, eco-friendly
practices, value addition, fair trade, and training through a dedicated Farm Partnerships
section on the homepage.

**Independent Test**: The Farm Partnerships content block is visible on the homepage without
navigating to any other page; text about eco-friendly practices and fair trade is present.

### Implementation for User Story 6

- [x] T019 [US6] Create `src/components/sections/FarmPartnershipsSection.tsx` as a static section component with brand copy about Africom's farm partnership model: sustainable productivity, eco-friendly practices, value addition, fair trade pricing, and capacity building/training for partner farmers — no props required; no dynamic data
- [x] T020 [US6] Add `<FarmPartnershipsSection />` to `src/app/page.tsx` (homepage) between `<ServiceSplitSection />` and `<CredibilitySection />` so it appears after the service overview and before the credibility signals

**Checkpoint**: Homepage renders FarmPartnershipsSection between service split and credibility. Farm partnerships content is visible without scrolling past CredibilitySection.

---

## Phase 9: Polish & Verification

**Purpose**: Confirm zero placeholder content remains across all pages and all tests pass.

- [x] T021 [P] Run SC-001 grep verification: `grep -r "Africom LLC" src/` and `grep -r "info@africom-exports.com" src/` and `grep -ri "cashew\|sesame\|pulses" src/` — confirm all return zero results; fix any remaining instances
- [x] T022 Run full Playwright E2E test suite: `npx playwright test` across all three browsers — confirm T001, T002, T003 assertions pass along with all other existing tests; fix any regressions
- [x] T023 [P] Run manual quickstart.md validation: verify both office addresses on `/contact`, both phones, info@africom.biz, all 5 products on `/exports`, all 4 services on `/consultation`, "5 innovative agribusiness initiatives" on homepage, Oliver Hartman testimonial on homepage, mission + vision + 8 core values on `/about`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately; tests must FAIL before Phase 3+
- **Foundational (Phase 2)**: Depends on Phase 1 completion — **BLOCKS all story work**
- **User Stories (Phases 3–8)**: Depend on Phase 2 (interface extensions complete)
  - US4 (Phase 3) before US1 (Phase 4): both write to `company.ts`; sequential to avoid conflicts
  - US2 (Phase 5) and US3 (Phase 6): independent of US1/US4; can start after Phase 2
  - US5 (Phase 7) and US6 (Phase 8): independent of each other; can start after Phase 2
- **Polish (Phase 9)**: Depends on all stories complete

### User Story Dependencies

- **US4 (P1)**: No dependencies on other stories — update contact fields in company.ts
- **US1 (P1)**: Must come after US4 (both write to company.ts; sequential to avoid overwriting)
- **US2 (P1)**: No dependencies — writes only to products.ts and ServiceSplitSection
- **US3 (P2)**: No dependencies — writes only to services.ts
- **US5 (P3)**: No dependencies — writes only to credibility.ts and CredibilitySection
- **US6 (P3)**: No dependencies — creates new component, wires into page.tsx

### Within Each User Story

- Interface extensions (Phase 2) MUST precede data values in story phases
- E2E test assertions MUST FAIL before story implementation starts
- Story complete before moving to next priority

### Parallel Opportunities

- T001, T002, T003 run in parallel (different test files)
- T004, T005, T006 run in parallel (different content files)
- T009, T012, T013, T015 marked [P] — different files from primary story task
- US2 (T014–T015) and US3 (T016) can run in parallel after Phase 2 complete
- US5 (T017–T018) and US6 (T019–T020) can run in parallel after Phase 2 complete
- T021 and T023 run in parallel (grep + manual check, different concerns)

---

## Parallel Example: Phase 2 + Early Stories

```bash
# Phase 2 — all in parallel (different files):
T004 — Extend CompanyProfile interface (company.ts types)
T005 — Extend AudienceType (services.ts types)
T006 — Extend CredibilityIndicator (credibility.ts types)

# After Phase 2 — US2 and US3 can run in parallel:
T014 — Replace products.ts data (US2)       ← parallel with T016
T016 — Replace services.ts data (US3)       ← parallel with T014

# US5 and US6 can run in parallel:
T017 — Populate credibility.ts (US5)        ← parallel with T019
T019 — Create FarmPartnershipsSection (US6) ← parallel with T017
```

---

## Implementation Strategy

### MVP First (P1 Stories Only)

1. Complete Phase 1: TDD test updates (verify they FAIL)
2. Complete Phase 2: Interface extensions
3. Complete Phase 3: US4 — Real Contact Details
4. Complete Phase 4: US1 — Real Company Identity
5. Complete Phase 5: US2 — Real Export Products
6. **STOP and VALIDATE**: Run SC-001 grep; run E2E tests for P1 stories
7. All three P1 stories complete — zero placeholder content in core business info

### Full Delivery

1. P1 stories (Phase 3–5) → All critical placeholder content replaced
2. P2 story (Phase 6, US3) → Real services live
3. P3 stories (Phase 7–8, US5+US6) → Credibility + farm partnerships on homepage
4. Polish (Phase 9) → Zero placeholder content confirmed; all tests green

---

## Notes

- `[P]` tasks operate on different files with no incomplete-task dependencies
- `[Story]` label maps each task to the user story for traceability
- E2E tests MUST fail before implementation — do not skip this step (Constitution Principle III)
- Two content files (`company.ts` phases 3 and 4) are written sequentially to avoid conflicts
- `CredibilitySection` and `FarmPartnershipsSection` render conditionally — never show empty sections
- Developer action required (outside this spec): update `.env.local` `CONTACT_EMAIL=info@africom.biz`
