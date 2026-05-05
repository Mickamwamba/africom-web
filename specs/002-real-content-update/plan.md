# Implementation Plan: Real Content Update from Official Brand Document

**Branch**: `002-real-content-update` | **Date**: 2026-05-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/002-real-content-update/spec.md`

## Summary

Replace all placeholder content in the existing Next.js 14 website with real Africom
International Ltd brand data: legal name, tagline, mission, vision, 8 core values, real
products (Avocado, Green Bean, Ginger, Garlic, Capsicum), real services (4 service lines),
real contact details (two offices, two phones, info@africom.biz), homepage credibility stat,
Oliver Hartman testimonial, and Farm Partnerships positioning text. No new pages, API routes,
or dependencies are introduced — all changes are to content data files and existing components.

## Technical Context

**Language/Version**: TypeScript 5 / Next.js 14 App Router (same as feature 001)
**Primary Dependencies**: Next.js 14, React 18, Tailwind CSS, Resend SDK (no new deps)
**Storage**: None — static content in TypeScript data files
**Testing**: Playwright E2E (existing tests updated), Vitest unit tests (no changes expected)
**Target Platform**: Vercel (static + edge functions)
**Project Type**: Static informational website
**Performance Goals**: No change — homepage < 4 seconds load (feature 001 target)
**Constraints**: Zero new npm dependencies; backward-compatible interface extensions only
**Scale/Scope**: 5 existing pages; 4 content data files; ~8 component file changes; 1 new component

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Specification-First | ✅ PASS | `specs/002-real-content-update/spec.md` written and checklist-validated before this plan |
| II. User-Centric Design | ✅ PASS | All 6 user stories expressed as user outcomes; no implementation details in spec |
| III. Test-Driven Implementation | ✅ PASS | Existing Playwright E2E tests will be updated to verify real content values before code changes |
| IV. Incremental & Independent Delivery | ✅ PASS | Each user story is independently testable: identity (US1), products (US2), services (US3), contact (US4), stats (US5), farm partnerships (US6) |
| V. Simplicity & Maintainability | ✅ PASS | No new pages, routes, or dependencies; interface extensions are backward-compatible |

**Gate result**: All 5 principles pass. No violations to document in Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/002-real-content-update/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── checklists/
│   └── requirements.md  # Spec quality checklist (all pass)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created by /speckit-plan)
```

### Source Code Changes (repository root)

This feature modifies existing files only, plus one new component:

```text
src/
├── content/
│   ├── company.ts          MODIFIED — real brand data, extended interface
│   ├── products.ts         MODIFIED — 5 real products replacing 4 placeholders
│   ├── services.ts         MODIFIED — 4 real services, extended AudienceType
│   └── credibility.ts      MODIFIED — stat + testimonial entries, extended IndicatorType
│
├── components/
│   ├── sections/
│   │   ├── ServiceSplitSection.tsx   MODIFIED — real product names in copy
│   │   ├── CredibilitySection.tsx    MODIFIED — render branches for stat + testimonial
│   │   └── FarmPartnershipsSection.tsx  NEW — Farm Partnerships positioning block
│   └── ui/
│       └── InquiryForm.tsx           MODIFIED — real fallback email in error state
│
└── app/
    ├── page.tsx             MODIFIED — add FarmPartnershipsSection
    ├── contact/page.tsx     MODIFIED — display both offices, both phones
    └── about/page.tsx       MODIFIED — add vision + core values sections

tests/
└── e2e/
    ├── export-client.spec.ts    MODIFIED — update assertions to real product names
    ├── dev-partner.spec.ts      MODIFIED — update assertions to real service names
    └── credibility.spec.ts      MODIFIED — add stat/testimonial assertions
```

## Phase 0 Research (Complete)

See [research.md](./research.md) for all 7 decisions. Summary:

1. **Multi-office schema**: Add `offices: OfficeAddress[]` and `phones: string[]` to
   `CompanyProfile`; deprecate single `headquartersAddress`.
2. **Extended AudienceType**: Add `farmers-organisation | cooperative | development-partner`.
3. **Stats + testimonial in CredibilitySection**: Extend `IndicatorType` with `stat` and
   `testimonial`; populate `credibility.ts`.
4. **Farm Partnerships**: New `FarmPartnershipsSection` component on the homepage.
5. **ServiceSplitSection copy**: Direct JSX string replacement — no dynamic prop wiring.
6. **InquiryForm error email**: Direct string replacement in JSX.
7. **CompanyProfile extensions**: Add `vision` and `coreValues` fields.

No NEEDS CLARIFICATION items remain. All research is complete.

## Phase 1 Design (Complete)

See [data-model.md](./data-model.md) for full entity specifications.

### Interface Changes Summary

**`src/content/company.ts`**:
```typescript
// New sub-entity
interface OfficeAddress {
  label: string;   // "Tanzania Office"
  address: string; // "16103 Riverside St, Dar es Salaam, Tanzania"
  country: string; // "Tanzania"
}

// CompanyProfile additions
interface CompanyProfile {
  // ... existing fields ...
  vision: string;           // new
  coreValues: string[];     // new — 8 values
  offices: OfficeAddress[]; // new — Tanzania + USA
  phones: string[];         // new — two phone numbers
  // contactPhone?: kept for backward compat
  // headquartersAddress: kept for backward compat
}
```

**`src/content/services.ts`**:
```typescript
type AudienceType =
  | "ngo" | "donor" | "implementation-partner"  // existing
  | "farmers-organisation" | "cooperative" | "development-partner"; // new
```

**`src/content/credibility.ts`**:
```typescript
type IndicatorType =
  | "partner-logo" | "certification" | "project-highlight"  // existing
  | "stat" | "testimonial"; // new

interface CredibilityIndicator {
  // ... existing fields ...
  quote?: string;  // new — for testimonial type
}
```

### New Component Contract

**`FarmPartnershipsSection`** — no props; reads no external data:
- Renders static brand copy from the Africom brand document
- Content: sustainable productivity, eco-friendly practices, value addition, fair trade, training
- No `data-testid` required; tested via text content assertions in E2E

### Real Content Values (authoritative reference)

**Company identity**:
- Legal name: `Africom International Ltd`
- Tagline: `From Farm to Global Markets`
- Mission: `To provide integrated agricultural solutions from production and processing to consultation and trade empowering farmers, advancing technology, and promoting sustainability through every stage of the value chain.`
- Vision: `To be a leading hub for sustainable agricultural innovation, connecting people, ideas, and resources to build resilient food systems and prosperous communities across Africa and beyond.`
- Core values (8): Sustainability, Innovation, Integrity, Empowerment, Quality, Community, Collaboration, Respect for Nature

**Contact details**:
- Email: `info@africom.biz`
- Tanzania office: `16103 Riverside St, Dar es Salaam, Tanzania`
- USA office: `8064 83rd Ave Sw Unit H01, Lakewood, WA 98498, USA`
- Phone 1 (Tanzania): `+255-758-208-673`
- Phone 2 (USA): `+1 904-477-9924`

**Products** (Tanzania origin for all):
1. Avocado
2. Green Bean
3. Ginger
4. Garlic
5. Capsicum (pepper/chilli)

**Services**:
1. Agribusiness Consultation — strategic guidance for farmers' organisations, cooperatives, NGOs
2. Trade Facilitation — connecting African agricultural produce to international markets
3. Agribusiness Capacity Building — training and skills development
4. Sustainability Initiatives — eco-friendly practices and community empowerment

**Credibility**:
- Stat: `5 innovative agribusiness initiatives`
- Testimonial: Oliver Hartman — outstanding service quote

## Complexity Tracking

No constitution violations — no complexity tracking required.

## Implementation Order

Tasks generated by `/speckit-tasks`. Recommended execution order (single developer):

1. **US4 first** (Contact details — P1): Update `company.ts` schema + contact page — foundational,
   all other identity data builds on this.
2. **US1** (Company identity — P1): Tagline, mission, vision, core values in `company.ts` + About page.
3. **US2** (Products — P1): Replace `products.ts` + update `ServiceSplitSection.tsx`.
4. **US3** (Services — P2): Replace `services.ts` + extend AudienceType.
5. **US5** (Stats + testimonial — P3): Extend `CredibilitySection` + populate `credibility.ts`.
6. **US6** (Farm Partnerships — P3): New `FarmPartnershipsSection` + wire into homepage.

After each story: verify no placeholder content remains for that story's scope.
Final: run `grep` across all source files for banned strings (FR-011 / SC-001).
