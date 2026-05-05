---
description: "Task list for Brand Assets & Visual Identity"
---

# Tasks: Brand Assets & Visual Identity

**Input**: Design documents from `specs/003-brand-assets/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ quickstart.md ✅

**Tests**: Included — Constitution Principle III mandates TDD. E2E assertions for logo and product photos are added in Phase 2 (Foundational) and must FAIL before US2 and US3 implementation.

**Organization**: Tasks are grouped by user story. US1 (colour tokens) is Foundational — all component visual changes depend on the token rename being in place. US2 (logo) depends on the US1 Header/Footer token updates completing first. US3–US5 are independent of each other after Phase 2.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1–US5 from spec.md)
- Exact file paths included in every task description

## Path Conventions

Single Next.js project:

- `src/components/` — UI and section components
- `src/app/` — Next.js App Router pages
- `src/content/` — TypeScript content data files
- `public/` — Static assets served by Next.js
- `tests/e2e/` — Playwright acceptance tests

---

## Phase 1: Setup (Asset Copy)

**Purpose**: Copy all brand assets from `africomassets/` into `public/` with simplified, predictable names. This must happen before any component references the new image paths.

- [ ] T001 Create `public/logos/` directory and copy 4 logo files: copy `africomassets/logos/Africom International_Primary Logo_Full Color.svg` → `public/logos/africom-full-color.svg`, copy `africomassets/logos/Africom International_Primary Logo_Full Color.png` → `public/logos/africom-full-color.png`, copy `africomassets/logos/Africom International_Primary Logo_White.svg` → `public/logos/africom-white.svg`, copy `africomassets/logos/Africom International_Primary Logo_White.png` → `public/logos/africom-white.png`
- [ ] T002 [P] Create `public/images/products/` directory and copy 5 product photos: `eddie-pipocas-Utnc4nbYFKo-unsplash.jpg` → `avocado.jpg`, `erwan-hesry-1q75BReKpms-unsplash.jpg` → `green-bean.jpg`, `markus-spiske-sFydXGrt5OA-unsplash.jpg` → `ginger.jpg`, `gabriel-jimenez-jin4W1HqgL4-unsplash.jpg` → `garlic.jpg`, `martin-adams-_LGlGi3KJIA-unsplash.jpg` → `capsicum.jpg` — all sourced from `africomassets/Photos/`
- [ ] T003 [P] Create `public/images/sections/` directory and copy 4 section photos: `federico-respini-sYffw0LNr7s-unsplash.jpg` → `hero.jpg`, `tim-mossholder-xDwEa2kaeJA-unsplash.jpg` → `farm-partnerships.jpg`, `iwaria-inc-1Wr4U5yRw2M-unsplash.jpg` → `about-community.jpg`, `cytonn-photography-n95VMLxqM2I-unsplash.jpg` → `consultation.jpg` — all sourced from `africomassets/Photos/`

---

## Phase 2: Foundational (TDD Prerequisites + Token Definition)

**Purpose**: Define the new colour tokens in `tailwind.config.ts` (all story implementations depend on this), and add E2E test assertions that will FAIL until their respective stories are implemented.

**⚠️ CRITICAL**: No user story component work can begin until T004 is complete (components reference tokens that don't exist yet — old token names produce unstyled elements). E2E test assertions in T005–T006 MUST be verified as FAILING before US2 and US3 implementation begins.

- [ ] T004 Update `tailwind.config.ts`: replace the entire `brand` colour object with `{ 'earth-brown': '#4F3727', 'organic-green': '#B2B54A', cream: '#F5F0E8' }` — removing `green`, `'green-light'`, `gold`, and `earth` keys entirely; add `'earth-brown'` and `'organic-green'` as the two official brand colours per the brand guidelines document
- [ ] T005 [P] Update `tests/e2e/credibility.spec.ts`: add a test `"site header displays official Africom logo image"` that navigates to `/`, then asserts `page.getByRole('img', { name: /africom international/i }).first()` is visible — this MUST FAIL before T012 (logo component added to header)
- [ ] T006 [P] Update `tests/e2e/export-client.spec.ts`: add a test `"product cards each display a photograph"` that navigates to `/exports`, gets all `[data-testid="product-card"]` elements, and asserts each one contains a visible `img` element — this MUST FAIL before T015 (product images added to cards)

**⚠️ Verify T005 and T006 tests FAIL** before proceeding to Phase 3.

---

## Phase 3: User Story 1 - Official Brand Colors (Priority: P1)

**Goal**: Every component and page uses the official Earth Brown (`#4F3727`) and Organic Green (`#B2B54A`) palette. The old `brand-green`, `brand-gold`, `brand-green-light`, and `brand-earth` class names no longer appear anywhere in `src/`.

**Independent Test**: Run `grep -r "brand-green\|brand-gold\|brand-green-light\|brand-earth\b" src/` — must return zero results. All buttons, headings, and accents visually reflect the new palette on every page.

### Implementation for User Story 1

- [ ] T007 [P] [US1] Update `src/components/ui/Button.tsx` and `src/components/ui/InquiryForm.tsx`: replace all `brand-green` class references with `brand-earth-brown` (including `bg-brand-green`, `text-brand-green`, `border-brand-green`, `hover:bg-brand-green`, `hover:text-brand-green`, `focus:ring-brand-green`); replace all `brand-gold` references with `brand-organic-green` (including `bg-brand-gold`, `focus:ring-brand-gold`, `hover:bg-yellow-600` → `hover:bg-amber-700`)
- [ ] T008 [P] [US1] Update `src/components/layout/Header.tsx`, `src/components/layout/Navigation.tsx`, and `src/components/layout/Footer.tsx`: replace `text-brand-green` → `text-brand-earth-brown`, `hover:text-brand-green` → `hover:text-brand-earth-brown`, `border-brand-green` → `border-brand-earth-brown`, `hover:text-brand-green-light` → `hover:text-brand-organic-green`, `hover:bg-brand-cream` unchanged, `text-brand-gold` → `text-brand-organic-green` — ensure no `brand-green`, `brand-gold`, or `brand-green-light` tokens remain in these three files
- [ ] T009 [P] [US1] Update six section components: `src/components/sections/HeroSection.tsx` (replace `from-brand-green`, `hover:bg-white hover:text-brand-green`), `src/components/sections/ServiceSplitSection.tsx` (replace `bg-brand-green`, `text-brand-green`, `bg-brand-gold`, `text-brand-gold`), `src/components/sections/CredibilitySection.tsx` (replace `brand-cream`, `brand-green`), `src/components/sections/FarmPartnershipsSection.tsx` (replace `bg-brand-green`), `src/components/sections/ProductCategoryCard.tsx` (replace `text-brand-green`, `text-brand-earth`, `bg-brand-earth` — map `brand-earth` → `brand-earth-brown`), `src/components/sections/ConsultationServiceCard.tsx` (replace `text-brand-gold` → `text-brand-organic-green`)
- [ ] T010 [P] [US1] Update five page files: `src/app/not-found.tsx` (replace `text-brand-green`), `src/app/about/page.tsx` (replace all `brand-green`, `brand-gold`, `brand-cream` — `brand-cream` stays, only `brand-green` and `brand-gold` renamed), `src/app/contact/page.tsx` (replace `brand-cream` stays, `brand-green` → `brand-earth-brown`), `src/app/exports/page.tsx` (replace `brand-green` → `brand-earth-brown`), `src/app/consultation/page.tsx` (replace `brand-gold` → `brand-organic-green`)

**Checkpoint**: `grep -r "brand-green\|brand-gold\|brand-green-light\|brand-earth\b" src/` returns zero results. All pages load without unstyled elements.

---

## Phase 4: User Story 2 - Official Logo in Header and Footer (Priority: P1)

**Goal**: The official SVG logo (full-colour on header, white on footer) appears on every page. The text-only "Africom" in the header is removed. The E2E logo assertion from T005 passes.

**Independent Test**: `page.getByRole('img', { name: /africom international/i }).first()` is visible on every page in the header. The footer contains a second logo image. T005 E2E test passes.

### Implementation for User Story 2

- [ ] T011 [US2] Create `src/components/ui/Logo.tsx`: export a default component accepting `variant: "full-color" | "white"`, `width?: number` (default 160), `height?: number` (default 48), `className?: string`; render `<img src={variant === "full-color" ? "/logos/africom-full-color.svg" : "/logos/africom-white.svg"} alt="Africom International Ltd" width={width} height={height} className={className} />` — no wrapper element, img is the root
- [ ] T012 [P] [US2] Update `src/components/layout/Header.tsx`: import `Logo` from `@/components/ui/Logo`; replace the `<span className="text-xl font-bold text-brand-earth-brown ...">Africom</span>` and its sibling tagline span with `<Logo variant="full-color" width={160} height={48} />` inside the existing `<Link href="/" aria-label="Africom International Ltd — Home">` wrapper; remove the subtitle span
- [ ] T013 [P] [US2] Update `src/components/layout/Footer.tsx`: import `Logo` from `@/components/ui/Logo`; replace the `<p className="text-white font-bold text-lg mb-2">{company.legalName}</p>` in the brand column with `<Logo variant="white" width={140} height={42} className="mb-2" />`; keep the tagline and registration status text below it unchanged

**Checkpoint**: Homepage shows the official SVG logo in the header (full-colour) and footer (white). T005 E2E assertion passes.

---

## Phase 5: User Story 3 - Product Photography on Exports Page (Priority: P1)

**Goal**: All 5 product cards on `/exports` display a photograph. The E2E product photo assertion from T006 passes.

**Independent Test**: Every `[data-testid="product-card"]` on `/exports` contains a visible `<img>` element. No card shows a blank or broken image. T006 E2E test passes.

### Implementation for User Story 3

- [ ] T014 [US3] Update `src/content/products.ts`: add `image?: string` field to the `ProductCategory` interface; then add `image` values to all 5 product entries: Avocado → `"/images/products/avocado.jpg"`, Green Bean → `"/images/products/green-bean.jpg"`, Ginger → `"/images/products/ginger.jpg"`, Garlic → `"/images/products/garlic.jpg"`, Capsicum → `"/images/products/capsicum.jpg"`
- [ ] T015 [US3] Update `src/components/sections/ProductCategoryCard.tsx`: import `Image` from `next/image`; add a photo block at the top of the card (before the name/origin div) — render `{product.image && (<div className="relative aspect-[4/3] rounded-lg overflow-hidden -mx-6 -mt-6 mb-4"><Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /></div>)}` — the negative margin pulls the image to card edges for a full-bleed top photo look

**Checkpoint**: `/exports` shows 5 product cards each with a photograph at the top. T006 E2E assertion passes.

---

## Phase 6: User Story 4 - Homepage Hero Photo (Priority: P2)

**Goal**: The homepage hero section displays the golden grain field photo as a full-width background with the tagline and CTAs legibly overlaid.

**Independent Test**: Opening `/` shows the agricultural landscape photo in the hero. "From Farm to Global Markets" text is readable over the image. The photo covers the full hero width at all viewport sizes.

### Implementation for User Story 4

- [ ] T016 [US4] Restructure `src/components/sections/HeroSection.tsx`: import `Image` from `next/image`; change the section's outer `<section>` to `relative overflow-hidden min-h-[480px] flex items-center` (remove the old `bg-gradient-to-br from-brand-earth-brown` class); inside the section, add `<Image src="/images/sections/hero.jpg" alt="Tanzanian grain fields at sunrise" fill className="object-cover" priority />` as the first child; add `<div className="absolute inset-0 bg-gradient-to-br from-black/65 to-black/30" />` as the second child (gradient overlay for text legibility); wrap the existing text content `<div className="container-lg ...">` in `<div className="relative z-10 w-full">` so text renders above the overlay; keep all existing text content (tagline, mission excerpt, CTA buttons) unchanged

**Checkpoint**: Homepage hero shows the golden field photo. Tagline "From Farm to Global Markets" is clearly readable. No layout regression on other sections.

---

## Phase 7: User Story 5 - Supporting Photography on Other Pages (Priority: P2)

**Goal**: The Farm Partnerships section (homepage), About page mission/values area, Consultation page header, and ServiceSplitSection trade block each display their assigned contextual photograph.

**Independent Test**: All 4 designated sections display their photograph. Text content remains readable. No layout collapse at mobile width.

### Implementation for User Story 5

- [ ] T017 [P] [US5] Update `src/components/sections/FarmPartnershipsSection.tsx`: import `Image` from `next/image`; change the outer `<section>` to `relative overflow-hidden` (keeping its existing padding classes); add `<Image src="/images/sections/farm-partnerships.jpg" alt="Farm workers harvesting crops in a green field" fill className="object-cover" />` as the first child; add `<div className="absolute inset-0 bg-brand-earth-brown/75" />` as the second child (brand-coloured overlay for brand consistency); add `relative z-10` to the content wrapper `<div>` inside the section so text renders above overlay
- [ ] T018 [P] [US5] Update `src/app/about/page.tsx`: in the mission section (the `<section className="section-padding bg-white">` that contains the mission paragraph), change the inner layout to a 2-column grid (`md:grid md:grid-cols-2 md:gap-12 md:items-center`) with the existing text content on the left; add a right column `<div className="relative h-72 md:h-full rounded-xl overflow-hidden hidden md:block"><Image src="/images/sections/about-community.jpg" alt="African hands forming a star — community and collaboration" fill className="object-cover" /></div>` — import `Image` from `next/image` at the top of the file
- [ ] T019 [P] [US5] Update `src/app/consultation/page.tsx`: in the page header section (the `<section>` containing the page `<h1>`), change it to `relative overflow-hidden min-h-[280px]`; add `<Image src="/images/sections/consultation.jpg" alt="Business partnership handshake" fill className="object-cover" />` as first child; add `<div className="absolute inset-0 bg-brand-earth-brown/70" />` as overlay; add `relative z-10` to the content wrapper so the heading and subtitle render above the overlay; import `Image` from `next/image`
- [ ] T020 [P] [US5] Update `src/components/sections/ServiceSplitSection.tsx`: in the "Agricultural Exports" service block (`data-testid="service-export-block"`), add a `<div className="relative h-48 rounded-xl overflow-hidden mb-6"><Image src="/images/sections/hero.jpg" alt="Cargo container ship — global agricultural trade" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" /></div>` after the icon div and before the `<h3>` heading; import `Image` from `next/image`

**Checkpoint**: All 4 supporting photos are visible on their respective pages. Text remains legible. Mobile layout shows no overflow or distortion.

---

## Phase 8: Polish & Verification

**Purpose**: Confirm zero old token references remain, all assets are present, and all E2E tests pass.

- [ ] T021 [P] Run SC-001 grep verification: `grep -r "brand-green\|brand-gold\|brand-green-light" src/` AND `grep -r "#2D6A4F\|#D4A017\|#52B788" src/ tailwind.config.ts` — confirm all return zero results; fix any remaining instances
- [ ] T022 [P] Run manual quickstart.md validation: verify official logo in header and footer on all 5 pages; verify all 5 product photos on `/exports`; verify hero photo on homepage; verify farm partnerships photo on homepage, about-community photo on `/about`, consultation photo on `/consultation`; verify all text remains legible over photo overlays
- [ ] T023 Run full Playwright E2E test suite: `npx playwright test` across all four browser profiles — confirm T005 logo assertion and T006 product photo assertion both pass, along with all pre-existing feature-002 E2E tests; fix any regressions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately; assets must exist before any component references them
- **Foundational (Phase 2)**: Depends on Phase 1 (assets copied); T004 token rename BLOCKS all component changes; T005–T006 tests must FAIL before US2/US3 implementation
- **US1 (Phase 3)**: Depends on T004 (new tokens defined in Tailwind config)
- **US2 (Phase 4)**: Depends on T008 (Header/Footer colour tokens updated); T011 must complete before T012/T013
- **US3 (Phase 5)**: Depends on Phase 2 only; T014 must complete before T015
- **US4 (Phase 6)**: Depends on T009 (HeroSection colour token update); independent of US2/US3/US5
- **US5 (Phase 7)**: Depends on Phase 2 only; all 4 tasks are independent of each other
- **Polish (Phase 8)**: Depends on all stories complete

### User Story Dependencies

- **US1 (P1)**: Depends only on T004 — no dependency on other stories
- **US2 (P1)**: Depends on T008 (US1 Header/Footer updates must complete first — same files)
- **US3 (P1)**: Depends on Phase 2 only — independent of US1/US2
- **US4 (P2)**: Depends on T009 (US1 HeroSection update) — otherwise independent
- **US5 (P2)**: Depends on Phase 2 only — independent of all other stories

### Parallel Opportunities

- T001, T002, T003 run in parallel (different destination directories)
- T005, T006 run in parallel (different test files)
- T007, T008, T009, T010 run in parallel (different files within US1)
- T012, T013 run in parallel after T011 (different files within US2)
- T017, T018, T019, T020 run in parallel (different files within US5)
- T021, T022 run in parallel (grep check + manual visual check, different concerns)

---

## Parallel Example: Phase 3 (US1 Colour Token Rename)

```bash
# After T004 completes — all 4 US1 tasks run in parallel (different files):
T007 — Button.tsx + InquiryForm.tsx (UI primitives)
T008 — Header.tsx + Navigation.tsx + Footer.tsx (layout)
T009 — 6 section components (sections/)
T010 — 5 page files (app/)
```

---

## Implementation Strategy

### MVP First (P1 Stories Only)

1. Complete Phase 1: Asset copy (T001–T003)
2. Complete Phase 2: Token definition + failing tests (T004–T006)
3. Complete Phase 3: US1 — Brand Colors (T007–T010)
4. Complete Phase 4: US2 — Logo (T011–T013)
5. Complete Phase 5: US3 — Product Photos (T014–T015)
6. **STOP and VALIDATE**: Run SC-001 grep; run E2E tests for T005–T006; visual check on all pages

### Full Delivery

1. P1 stories (Phases 3–5) → Colours, logo, product photos complete
2. P2 stories (Phases 6–7) → Hero photo and supporting section photos complete
3. Polish (Phase 8) → All tests green, no old token references

---

## Notes

- `[P]` tasks operate on different files with no incomplete-task dependencies
- `[Story]` label maps each task to its user story for traceability
- T005 and T006 E2E tests MUST fail before US2 and US3 implementation — do not skip (Constitution Principle III)
- `brand-cream` (`#F5F0E8`) is the only token that does NOT change — it is kept as-is
- iStock photos (`istockphoto-*.jpg`) are explicitly excluded — do not copy to `public/`
- Hero photo uses `priority` prop on `next/image` — required for LCP performance (above-the-fold image)
- All `next/image` `fill`-mode containers MUST have `overflow-hidden` to prevent images bleeding outside their bounds
