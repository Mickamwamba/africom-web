# Data Model: Real Content Update

**Feature**: 002-real-content-update
**Date**: 2026-05-05

## OfficeAddress (new sub-entity)

Represents a physical Africom office location.

| Field    | Type   | Required | Notes                              |
|----------|--------|----------|------------------------------------|
| label    | string | Yes      | e.g. "Tanzania Office", "USA Office" |
| address  | string | Yes      | Full street address                |
| country  | string | Yes      | e.g. "Tanzania", "USA"             |

**Usage**: `CompanyProfile.offices: OfficeAddress[]`

---

## CompanyProfile (extended)

Replaces placeholder values in `src/content/company.ts`.

| Field                | Type            | Change      | Notes                                      |
|----------------------|-----------------|-------------|--------------------------------------------|
| name                 | string          | Unchanged   | Short display name: "Africom"              |
| legalName            | string          | **Updated** | "Africom International Ltd" (was "Africom LLC") |
| tagline              | string          | **Updated** | "From Farm to Global Markets"              |
| mission              | string          | **Updated** | Exact brand document text                  |
| **vision**           | string          | **New**     | "To be a leading hub for sustainable…"     |
| **coreValues**       | string[]        | **New**     | 8 values from brand document               |
| description          | string          | **Updated** | Tanzania-based enterprise; both offices    |
| usRegistrationStatus | string          | **Updated** | Updated to reflect international structure |
| foundedYear          | number          | Unchanged   | 2018                                       |
| headquartersAddress  | string          | Deprecated  | Keep for backward compat; use offices[0]   |
| **offices**          | OfficeAddress[] | **New**     | Tanzania + USA office entries              |
| operatingCountry     | string          | Unchanged   | "Tanzania"                                 |
| regionalMarkets      | string[]        | Unchanged   | Existing values retained                   |
| internationalMarkets | string[]        | Unchanged   | Existing values retained                   |
| contactEmail         | string          | **Updated** | "info@africom.biz" (was "info@africom-exports.com") |
| contactPhone         | string?         | **Updated** | Primary Tanzania number                    |
| **phones**           | string[]        | **New**     | ["+255-758-208-673", "+1 904-477-9924"]    |
| socialLinks          | SocialLink[]    | Unchanged   | Remains empty []                           |

**Core values** (ordered as per brand document):
1. Sustainability
2. Innovation
3. Integrity
4. Empowerment
5. Quality
6. Community
7. Collaboration
8. Respect for Nature

---

## ProductCategory (replaced)

All 4 placeholder entries removed. 5 real entries added.

| id           | name        | originRegion | targetMarkets                         |
|--------------|-------------|--------------|---------------------------------------|
| avocado      | Avocado     | Tanzania     | Europe, Middle East, East Africa      |
| green-bean   | Green Bean  | Tanzania     | Europe, Middle East, East Africa      |
| ginger       | Ginger      | Tanzania     | Asia, Middle East, Europe             |
| garlic       | Garlic      | Tanzania     | Middle East, Asia, Europe             |
| capsicum     | Capsicum    | Tanzania     | Europe, Middle East, East Africa      |

Fields retained unchanged: `id`, `name`, `description`, `originRegion`, `keyCharacteristics`,
`targetMarkets`, `imageUrl?`, `sortOrder`.

---

## AudienceType (extended)

Extended from `"ngo" | "donor" | "implementation-partner"` to include:

```typescript
type AudienceType =
  | "ngo"
  | "donor"
  | "implementation-partner"
  | "farmers-organisation"
  | "cooperative"
  | "development-partner";
```

**Updated `audienceLabels`** map additions:
- `"farmers-organisation"` → "Farmers' Organisation"
- `"cooperative"` → "Cooperative"
- `"development-partner"` → "Development Partner"

---

## ConsultationService (replaced)

All 4 placeholder entries removed. 4 real service lines added.

| id                        | name                            | targetAudience                                                |
|---------------------------|---------------------------------|---------------------------------------------------------------|
| agribusiness-consultation | Agribusiness Consultation       | farmers-organisation, cooperative, ngo                        |
| trade-facilitation        | Trade Facilitation              | farmers-organisation, cooperative, implementation-partner     |
| capacity-building         | Agribusiness Capacity Building  | farmers-organisation, cooperative, ngo, development-partner   |
| sustainability-initiatives| Sustainability Initiatives      | ngo, donor, development-partner                               |

Fields retained unchanged: `id`, `name`, `description`, `targetAudience`, `valueChainTopics`,
`deliverables?`, `sortOrder`.

---

## CredibilityIndicator (extended)

`IndicatorType` extended from `"partner-logo" | "certification" | "project-highlight"` to:

```typescript
type IndicatorType =
  | "partner-logo"
  | "certification"
  | "project-highlight"
  | "stat"
  | "testimonial";
```

Two new entries added to `src/content/credibility.ts`:

| id                          | type        | name                                  | description                            |
|-----------------------------|-------------|---------------------------------------|----------------------------------------|
| stat-agribusiness-initiatives | stat      | 5 Innovative Agribusiness Initiatives | Africom headline credibility figure    |
| testimonial-oliver-hartman  | testimonial | Oliver Hartman                        | Client testimonial quote               |

Additional fields for testimonial type:
- `quote?: string` — the testimonial text (new optional field on `CredibilityIndicator`)
- `title?: string` — person title/role (new optional field, omitted for Oliver Hartman)

The `CredibilitySection` component will render `stat` and `testimonial` types with distinct
visual treatments — large number callout for `stat`, blockquote with attribution for `testimonial`.

---

## Summary of Content File Changes

| File                         | Change Type | Scope                                     |
|------------------------------|-------------|-------------------------------------------|
| `src/content/company.ts`     | Extended    | Add vision, coreValues, offices, phones; update legalName, tagline, mission, email |
| `src/content/products.ts`    | Replaced    | 4 placeholder → 5 real products           |
| `src/content/services.ts`    | Replaced    | 4 placeholder → 4 real service lines; extend AudienceType |
| `src/content/credibility.ts` | Populated   | Add stat + testimonial entries; extend IndicatorType |

## Summary of Component Changes

| File                                              | Change Type | Scope                                      |
|---------------------------------------------------|-------------|--------------------------------------------|
| `src/components/sections/ServiceSplitSection.tsx` | Copy update | Replace hardcoded placeholder product names |
| `src/components/sections/CredibilitySection.tsx`  | Extended    | Add stat and testimonial render branches   |
| `src/components/ui/InquiryForm.tsx`               | Copy update | Replace hardcoded fallback email           |
| `src/app/contact/page.tsx`                        | Extended    | Display both offices and both phones       |
| `src/app/about/page.tsx`                          | Extended    | Add vision and 8 core values sections      |
| `src/app/page.tsx`                                | Extended    | Add FarmPartnershipsSection                |

## New Components

| File                                                  | Purpose                                        |
|-------------------------------------------------------|------------------------------------------------|
| `src/components/sections/FarmPartnershipsSection.tsx` | Farm Partnerships positioning block on homepage |
