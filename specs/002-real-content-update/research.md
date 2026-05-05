# Research: Real Content Update

**Feature**: 002-real-content-update
**Branch**: 002-real-content-update
**Date**: 2026-05-05

## Decision 1: Multi-Office Company Profile Schema

**Decision**: Extend `CompanyProfile` with an `offices: OfficeAddress[]` array and a `phones: string[]`
array alongside the existing single-address and single-phone fields. The existing
`headquartersAddress` field is deprecated in favour of `offices[0].address`; components will
be updated to iterate over `offices`.

**Rationale**: Africom operates from two legal addresses (Tanzania + USA). Displaying only
one address on the contact page and footer is insufficient for FR-007. Adding a typed
`OfficeAddress` sub-entity keeps the data structured and extensible if more offices are added
later. A simple string array for phones mirrors the same pattern.

**Alternatives considered**:
- Keep `headquartersAddress` + `usaAddress` as separate top-level strings — rejected because
  it does not scale and forces individual property checks in every component.
- External CMS for office data — far too heavyweight for a static informational site.

---

## Decision 2: Extended Audience Type for Real Services

**Decision**: Extend `AudienceType` to include `"farmers-organisation" | "cooperative" |
"development-partner"` values, and add corresponding display labels in `audienceLabels`.

**Rationale**: The four real Africom services target a broader set of beneficiaries than the
three original placeholder types. The `ConsultationServiceCard` component renders audience
badges purely from the typed union + labels map, so adding values there and in the labels map
is the only change required — no component logic changes.

**Alternatives considered**:
- Use free-string audience values — rejected because it removes compile-time safety and
  badge rendering consistency.

---

## Decision 3: Stats and Testimonial in CredibilitySection

**Decision**: Extend `IndicatorType` to include `"stat"` and `"testimonial"` variants.
Populate `src/content/credibility.ts` with two new entries: the "5 innovative agribusiness
initiatives" stat and the Oliver Hartman testimonial. Update `CredibilitySection` to render
these new types with appropriate visual treatment.

**Rationale**: The `CredibilitySection` component already has the conditional-rendering
infrastructure (returns `null` when empty). Reusing it avoids creating a second content data
file and a second conditional-render component. The stat and testimonial are brand-supplied
credibility signals, which semantically belong in a credibility / social proof section.

**Alternatives considered**:
- Create a dedicated `HomepageStatsSection` and `TestimonialSection` components —
  reasonable but would require new data files and wiring new components into
  `src/app/page.tsx` when the existing CredibilitySection infrastructure already handles this.
- Hardcode stats and testimonial in the homepage JSX — rejected because it makes future
  content updates require a code change rather than a data change.

---

## Decision 4: Farm Partnerships Section Placement

**Decision**: Add a `FarmPartnershipsSection` component rendered on the homepage
(`src/app/page.tsx`) between `ServiceSplitSection` and `CredibilitySection`.

**Rationale**: The Farm Partnerships content — eco-friendly practices, value addition, fair
trade, and training — describes why producers should partner with Africom. It serves all
visitor types and is best positioned on the homepage for maximum reach (FR-010). The About
page is also acceptable per the spec but homepage placement gives it higher visibility.

**Alternatives considered**:
- Place only on the About page — lower visibility; homepage is the higher-traffic entry point.
- Merge into `ServiceSplitSection` — would dilute the two-service-line differentiation that
  `ServiceSplitSection` is designed to communicate.

---

## Decision 5: ServiceSplitSection Product Description Update

**Decision**: Update the hardcoded product list in `ServiceSplitSection.tsx` and the About
page's description to reference the 5 real products (Avocado, Green Bean, Ginger, Garlic,
Capsicum) instead of the 4 placeholder commodities (cashew, sesame, coffee, pulses).

**Rationale**: `ServiceSplitSection` hardcodes product names in JSX rather than reading from
`src/content/products.ts`. The simplest fix is to update the copy directly; pulling a dynamic
list from the data file would require prop threading and is out of scope for a content update.

---

## Decision 6: InquiryForm Error Email Hardcode

**Decision**: Replace the hardcoded `info@africom-exports.com` fallback email in
`InquiryForm.tsx` with `info@africom.biz` directly in the JSX (FR-008, SC-001).

**Rationale**: The error fallback email is currently hardcoded in the component as a safety
net for when the API call fails. The simplest fix is a direct string replacement. Reading
this from `company.contactEmail` would require making `InquiryForm` a server component or
passing it as a prop — unnecessary complexity for a one-line content fix.

---

## Decision 7: CompanyProfile Extended Fields

**Decision**: Add `vision: string`, `coreValues: string[]`, and a `description` update to
`CompanyProfile`. Keep `name` as the short display name ("Africom") and update `legalName`
to "Africom International Ltd". Add `usRegistrationStatus` update to reflect the
Tanzania-based identity while noting the USA office.

**Rationale**: The About page renders `company.mission` and `company.description` already.
Adding `vision` and `coreValues` fields follows the same pattern and enables the About page
to render them without component restructuring beyond adding two new sections.
