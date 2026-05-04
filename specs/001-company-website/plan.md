# Implementation Plan: Africom Company Website

**Branch**: `001-company-website` | **Date**: 2026-05-04 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-company-website/spec.md`

## Summary

Build a static, informational company website for Africom — a US-registered exporter of
Tanzanian agricultural products and agricultural development consultant. The site presents
two clearly separated service lines (export and consultation), supports business inquiry
submission via a contact form with email delivery, and is deployable as a static web
application with no database or CMS dependency.

## Technical Context

**Language/Version**: TypeScript 5.x + HTML5/CSS3
**Primary Dependencies**: Next.js 14 (App Router, static export); Tailwind CSS; Resend (transactional email for contact form)
**Storage**: N/A — all content is static (TypeScript data files); no database
**Testing**: Playwright (end-to-end browser tests for acceptance scenarios); Vitest (unit tests for form validation logic)
**Target Platform**: Web browsers — desktop and mobile; deployed as static site on Vercel
**Project Type**: static web application (marketing/informational)
**Performance Goals**: Full page load < 4 seconds for international visitors on standard broadband (SC-004)
**Constraints**: No CMS; no database; no authentication; no e-commerce; English only for v1; content updates require developer involvement
**Scale/Scope**: Low-traffic marketing site; 5 key pages; 1 API route (contact form); content supplied by Africom

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Specification-First | ✅ Pass | spec.md is complete and passed quality checklist |
| II. User-Centric Design | ✅ Pass | All requirements frame outcomes from visitor perspective; no tech details in spec |
| III. Test-Driven Implementation | ✅ Pass | Acceptance scenarios defined per user story; Playwright tests must be written before pages are built |
| IV. Incremental & Independent Delivery | ✅ Pass | 3 user stories are independently deployable (P1 export site is a complete MVP on its own) |
| V. Simplicity | ✅ Pass | Static site, no database, no CMS, no auth — simplest stack that satisfies all requirements |

**Gate result: All principles satisfied. Proceeding to Phase 0.**

## Project Structure

### Documentation (this feature)

```text
specs/001-company-website/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── page-routes.md
│   └── contact-api.md
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (nav, footer)
│   ├── page.tsx                # Homepage
│   ├── about/
│   │   └── page.tsx
│   ├── exports/
│   │   └── page.tsx
│   ├── consultation/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── api/
│   │   └── contact/
│   │       └── route.ts        # Form submission → Resend email
│   └── not-found.tsx           # Custom 404 page
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── sections/               # Page section components
│   │   ├── HeroSection.tsx
│   │   ├── ServiceSplitSection.tsx
│   │   ├── ProductCategoryCard.tsx
│   │   ├── ConsultationServiceCard.tsx
│   │   └── CredibilitySection.tsx
│   └── ui/
│       ├── InquiryForm.tsx
│       └── Button.tsx
├── content/                    # Static content data
│   ├── company.ts
│   ├── products.ts
│   ├── services.ts
│   └── credibility.ts
└── lib/
    └── email.ts                # Resend email sender utility

public/
├── images/
│   ├── hero/
│   ├── products/
│   └── partners/
└── favicon.ico

tests/
├── e2e/                        # Playwright acceptance tests
│   ├── export-client.spec.ts   # User Story 1
│   ├── dev-partner.spec.ts     # User Story 2
│   └── credibility.spec.ts     # User Story 3
└── unit/
    └── form-validation.test.ts
```

**Structure Decision**: Single-project web application using Next.js App Router. No
backend/frontend split — the API route for form submission lives within the same Next.js
project. This is the simplest structure satisfying all requirements and aligns with
Principle V (Simplicity).

## Complexity Tracking

> No constitution violations — section not required.
