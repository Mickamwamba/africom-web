# Data Model: Africom Company Website

**Feature**: 001-company-website
**Date**: 2026-05-04
**Source**: spec.md Key Entities + research.md technical decisions

All data is **static** (TypeScript data files under `src/content/`). There is no database
or runtime persistence. The Inquiry entity is the only runtime data object (submitted via
form and delivered by email; not stored).

---

## Entity 1: CompanyProfile

**Source file**: `src/content/company.ts`
**Purpose**: Central repository for all Africom identity, contact, and mission content.

```typescript
interface CompanyProfile {
  name: string;                    // "Africom"
  legalName: string;               // Full legal name as registered in the US
  tagline: string;                 // One-line value proposition
  mission: string;                 // Mission statement paragraph
  description: string;             // About section body text
  usRegistrationStatus: string;    // e.g. "Registered in the State of [STATE], USA"
  foundedYear: number;             // Year of incorporation (Africom to supply)
  headquartersAddress: string;     // US mailing/physical address
  operatingCountry: string;        // "Tanzania"
  regionalMarkets: string[];       // e.g. ["East Africa", "Southern Africa"]
  internationalMarkets: string[];  // e.g. ["Europe", "Middle East", "North America"]
  contactEmail: string;            // Primary business inquiry email
  contactPhone?: string;           // Optional phone number
  socialLinks: SocialLink[];       // Only included if active public accounts exist
}

interface SocialLink {
  platform: "linkedin" | "twitter" | "facebook" | "instagram" | "youtube";
  url: string;
}
```

**Validation rules**:
- `contactEmail` MUST be a valid email address
- `socialLinks` is omitted (empty array) if Africom has no active public accounts
- `foundedYear` MUST be a 4-digit year ≤ current year

---

## Entity 2: ProductCategory

**Source file**: `src/content/products.ts`
**Purpose**: Describes each agricultural product category Africom exports from Tanzania.

```typescript
interface ProductCategory {
  id: string;                      // URL-safe slug, e.g. "cashew-nuts"
  name: string;                    // Display name, e.g. "Cashew Nuts"
  description: string;             // 2–4 sentence overview for the product card
  originRegion: string;            // Specific Tanzanian region(s) of origin
  keyCharacteristics: string[];    // 3–6 bullet points (grade, processing, certifications)
  targetMarkets: string[];         // Export destination regions/countries
  imageUrl?: string;               // Optional product image path (under public/images/products/)
  sortOrder: number;               // Display order on the Exports page
}
```

**Validation rules**:
- `id` MUST be unique across all product categories
- `keyCharacteristics` MUST contain at least 1 item
- `targetMarkets` MUST contain at least 1 item
- `imageUrl` path MUST exist under `public/images/products/` when provided

---

## Entity 3: ConsultationService

**Source file**: `src/content/services.ts`
**Purpose**: Describes each consultation service Africom offers to development project clients.

```typescript
type AudienceType = "ngo" | "donor" | "implementation-partner";

interface ConsultationService {
  id: string;                      // URL-safe slug, e.g. "value-chain-analysis"
  name: string;                    // Display name
  description: string;             // Service description for the card/section
  targetAudience: AudienceType[];  // At least one audience type
  valueChainTopics: string[];      // Agricultural value chain areas covered
  deliverables?: string[];         // Optional list of typical outputs
  sortOrder: number;               // Display order on the Consultation page
}
```

**Validation rules**:
- `id` MUST be unique across all consultation services
- `targetAudience` MUST contain at least 1 value from the AudienceType union
- `valueChainTopics` MUST contain at least 1 item

---

## Entity 4: CredibilityIndicator

**Source file**: `src/content/credibility.ts`
**Purpose**: Partner logos, certifications, and project highlights used to build trust.
Only included if Africom supplies the supporting materials.

```typescript
type IndicatorType = "partner-logo" | "certification" | "project-highlight";

interface CredibilityIndicator {
  id: string;
  type: IndicatorType;
  name: string;                    // Organisation name, cert name, or project title
  description?: string;           // Short description (project-highlight type only)
  imageUrl?: string;               // Logo or cert badge image path
  year?: number;                   // Year of certification or project completion
  sortOrder: number;
}
```

**Validation rules**:
- `partner-logo` and `certification` types SHOULD have an `imageUrl`
- `project-highlight` type SHOULD have a `description`
- The entire `CredibilityIndicator[]` array MAY be empty; when empty, the Credibility
  section is omitted from the rendered page

---

## Entity 5: InquiryFormData (runtime, not persisted)

**Purpose**: Defines the shape of data captured by the inquiry form and submitted to the
`/api/contact` route. Not stored — delivered by email and discarded.

```typescript
interface InquiryFormData {
  name: string;               // Required — visitor's full name
  organization?: string;      // Optional — company or organisation name
  email: string;              // Required — valid email address
  serviceOfInterest:          // Required — which service line the inquiry relates to
    | "export"
    | "consultation"
    | "other";
  message: string;            // Required — inquiry body text
}
```

**Validation rules (enforced client-side and server-side)**:
- `name`: required, min 2 characters, max 100 characters
- `email`: required, valid RFC 5322 email format
- `serviceOfInterest`: required, must be one of the three enum values
- `message`: required, min 10 characters, max 2000 characters
- `organization`: optional, max 200 characters when present

---

## Content Dependency

All static entities (CompanyProfile, ProductCategory, ConsultationService,
CredibilityIndicator) require content supplied by Africom before or during development.
Placeholder data will be used during development and MUST be replaced before launch.

| Entity | Content owner | Format |
|--------|--------------|--------|
| CompanyProfile | Africom | Text, contact details, address |
| ProductCategory | Africom | Product names, descriptions, target markets |
| ConsultationService | Africom | Service names, descriptions, topic areas |
| CredibilityIndicator | Africom | Logos (PNG/SVG), certification names, project summaries |
