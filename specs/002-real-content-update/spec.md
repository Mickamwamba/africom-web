# Feature Specification: Real Content Update from Official Brand Document

**Feature Branch**: `002-real-content-update`
**Created**: 2026-05-05
**Status**: Draft
**Input**: Africom Website Content PDF — replaces all placeholder content with
real brand, product, service, and contact data supplied by Africom International Ltd.

## User Scenarios & Testing

### User Story 1 - Visitor Sees Real Company Identity (Priority: P1)

A visitor arriving on the homepage or About page encounters the real Africom International
Ltd brand — correct legal name, mission, vision, tagline, and core values — rather than
placeholder text.

**Why this priority**: Brand identity is the foundation of every other content section.
Placeholder identity copy undermines all user journeys immediately.

**Independent Test**: The homepage and About page function completely with real identity
content; all placeholder text is gone; legal name, tagline, mission, and vision are visible.

**Acceptance Scenarios**:

1. **Given** a visitor arrives on the homepage, **When** they read the hero banner, **Then**
   they see the tagline "From Farm to Global Markets" and "Africom International Ltd" as
   the company name.
2. **Given** a visitor reads the About page, **When** they look for the mission, **Then**
   they read: "To provide integrated agricultural solutions from production and processing
   to consultation and trade empowering farmers, advancing technology, and promoting
   sustainability through every stage of the value chain."
3. **Given** a visitor reads the About page, **When** they look for the vision, **Then**
   they read: "To be a leading hub for sustainable agricultural innovation, connecting
   people, ideas, and resources to build resilient food systems and prosperous communities
   across Africa and beyond."
4. **Given** a visitor reads the About page, **When** they look for core values, **Then**
   they see all 8 values listed: Sustainability, Innovation, Integrity, Empowerment,
   Quality, Community, Collaboration, and Respect for Nature.

---

### User Story 2 - Export Client Sees Real Products (Priority: P1)

A buyer visiting the Export Products page sees the actual products Africom exports
(Avocado, Green Bean, Ginger, Garlic, Capsicum) instead of the placeholder cashew/sesame/
coffee/pulses content.

**Why this priority**: Showing incorrect products to prospective buyers is the most
damaging content error — it causes wasted inquiries and damages trust.

**Independent Test**: The `/exports` page shows only the 5 real products; no placeholder
products (cashew, sesame, coffee, pulses) appear anywhere on the page.

**Acceptance Scenarios**:

1. **Given** a buyer visits `/exports`, **When** they scan the product listings, **Then**
   they see exactly: Avocado, Green Bean, Ginger, Garlic, and Capsicum (pepper/chilli).
2. **Given** a buyer views any product listing, **When** they look for origin details,
   **Then** they see Tanzania identified as the sourcing country.
3. **Given** no placeholder products remain, **When** a visitor searches the page for
   "cashew", "sesame", "coffee", or "pulses", **Then** no such content is found.

---

### User Story 3 - Service-Seeker Finds Real Services (Priority: P2)

A farmer organisation representative, NGO officer, or trade buyer visiting the services
page finds the four real Africom service lines — Agribusiness Consultation, Trade
Facilitation, Agribusiness Capacity Building, and Sustainability Initiatives — with
accurate descriptions matching the brand document.

**Why this priority**: Correct service descriptions are essential for potential clients to
self-qualify. Wrong service framing generates misaligned inquiries.

**Independent Test**: The services page shows only the 4 real services; target audience
includes farmers' organisations, cooperatives, NGOs, and development partners.

**Acceptance Scenarios**:

1. **Given** a visitor views the services section, **When** they read the service list,
   **Then** they see all four: Agribusiness Consultation, Trade Facilitation, Agribusiness
   Capacity Building, and Sustainability Initiatives.
2. **Given** a visitor reads the Agribusiness Consultation description, **Then** it
   references strategic guidance for farmers' organisations, cooperatives, and NGOs.
3. **Given** a visitor reads the Trade Facilitation description, **Then** it references
   connecting African agricultural produce to international markets.

---

### User Story 4 - Visitor Finds Real Contact Details (Priority: P1)

A visitor who wants to reach Africom finds the real contact information: two office
addresses (Tanzania and USA), two phone numbers, and the real email address.

**Why this priority**: Incorrect contact details make the site non-functional for its
primary purpose — generating inquiries. This is a critical fix.

**Independent Test**: The `/contact` page and footer display real addresses, real phone
numbers, and info@africom.biz; the old placeholder email is gone from all visible text.

**Acceptance Scenarios**:

1. **Given** a visitor visits `/contact`, **When** they look for office addresses, **Then**
   they see: "16103 Riverside St, Dar es Salaam, Tanzania" and
   "8064 83rd Ave Sw Unit H01, Lakewood, WA 98498, USA".
2. **Given** a visitor looks for phone numbers, **Then** they see +255-758-208-673 and
   +1 904-477-9924.
3. **Given** a visitor looks for the contact email, **Then** they see info@africom.biz.
4. **Given** a visitor's form submission fails, **When** the error message appears, **Then**
   it references info@africom.biz as the fallback contact, not any placeholder address.

---

### User Story 5 - Homepage Shows Credibility Stats and Testimonial (Priority: P3)

A first-time visitor to the homepage sees the "5 innovative agribusiness initiatives"
stat and the testimonial from Oliver Hartman, supporting trust-building on the homepage.

**Why this priority**: These are supplied real content items from the brand document
specifically intended for the homepage; they add immediate trust signals for all visitors.

**Independent Test**: The homepage displays the stat and the testimonial without any
other page being required.

**Acceptance Scenarios**:

1. **Given** a visitor views the homepage, **When** they scroll past the hero section,
   **Then** they see a stat or highlight showing "5 innovative agribusiness initiatives".
2. **Given** a visitor reads the testimonial section, **Then** they see the quote
   attributed to Oliver Hartman about outstanding service.

---

### User Story 6 - Farm Partnerships Positioning Visible (Priority: P3)

Visitors can read the Farm Partnerships content describing Africom's commitment to
sustainable productivity, eco-friendly practices, and community empowerment through
fair trade and training.

**Why this priority**: This is supplied brand content that fills the "why partner with us"
gap and appears in the brand document as a distinct section.

**Independent Test**: The Farm Partnerships text is visible on either the homepage or
About page without requiring any other section.

**Acceptance Scenarios**:

1. **Given** a visitor reads the Farm Partnerships section, **Then** they encounter text
   about sustainable productivity, eco-friendly practices, value addition, fair trade,
   and training.

---

### Edge Cases

- What if a visitor's browser has cached old placeholder content — does a hard refresh
  show the correct real content?
- "Galic" in the PDF is a likely typographical error; the correct English spelling
  "Garlic" should be used — how is the canonical spelling confirmed?
- What happens to the inquiry form's server-side fallback email if the environment
  variable `CONTACT_EMAIL` is not updated to info@africom.biz after deployment?

## Requirements

### Functional Requirements

- **FR-001**: The website MUST display "Africom International Ltd" as the company name
  everywhere it appears, replacing all instances of "Africom LLC".
- **FR-002**: The hero section tagline MUST read "From Farm to Global Markets."
- **FR-003**: The About page MUST display the exact mission and vision statements from
  the brand document, plus all 8 core values.
- **FR-004**: The About page description MUST present Africom as a Tanzania-based
  agribusiness enterprise while noting both the Tanzania and USA office locations.
- **FR-005**: The Export Products page MUST list exactly these 5 products and no others:
  Avocado, Green Bean, Ginger, Garlic, and Capsicum (pepper/chilli). All 4 previous
  placeholder products MUST be removed.
- **FR-006**: The services section MUST present exactly these 4 service lines:
  Agribusiness Consultation, Trade Facilitation, Agribusiness Capacity Building, and
  Sustainability Initiatives. Previous placeholder service descriptions MUST be replaced.
- **FR-007**: The contact page and footer MUST display both office addresses (Tanzania and
  USA), both phone numbers (+255-758-208-673 and +1 904-477-9924), and info@africom.biz.
- **FR-008**: All user-visible references to the contact email (including form error
  messages) MUST use info@africom.biz.
- **FR-009**: The homepage MUST display a stats/credibility block showing "5 innovative
  agribusiness initiatives" and the Oliver Hartman testimonial.
- **FR-010**: The homepage or About page MUST include the Farm Partnerships positioning
  text covering eco-friendly practices, value addition, fair trade, and training.
- **FR-011**: No placeholder content MUST remain anywhere: no "Africom LLC", no
  "info@africom-exports.com", and none of the 4 old placeholder products.

### Key Entities

- **CompanyProfile** (updated): Legal name "Africom International Ltd", tagline "From Farm
  to Global Markets", exact mission and vision statements, 8 core values, two addresses,
  two phone numbers, email info@africom.biz.
- **ProductCategory** (replaced): 5 horticultural products — Avocado, Green Bean, Ginger,
  Garlic, Capsicum — all sourced from Tanzania.
- **AgribusinessService** (replaced): 4 real service lines — Agribusiness Consultation,
  Trade Facilitation, Capacity Building, Sustainability Initiatives.
- **CredibilityIndicator** (new data): stat ("5 innovative agribusiness initiatives") and
  testimonial (Oliver Hartman quote).

## Success Criteria

### Measurable Outcomes

- **SC-001**: Zero instances of placeholder content remain across all 5 pages after the
  update — verified by text search for "Africom LLC", "info@africom-exports.com",
  "cashew", "sesame", "coffee", and "pulses".
- **SC-002**: All 5 real products appear on the `/exports` page within 2 clicks of the
  homepage.
- **SC-003**: All 4 real service lines appear on the services page within 2 clicks of the
  homepage.
- **SC-004**: Both office addresses, both phone numbers, and info@africom.biz appear on the
  `/contact` page.
- **SC-005**: The homepage credibility stat and testimonial are visible without scrolling
  past 3 sections.
- **SC-006**: A first-time visitor can confirm the company's legal name, tagline, and real
  contact email within 60 seconds of landing on the homepage.

## Assumptions

- The 5 PDF-listed products (Avocado, Green Bean, Ginger, Garlic, Capsicum) are the
  complete current export product list; no additional products are in scope for this update.
- "Galic" in the PDF is a typographical error; the spelling "Garlic" will be used.
- Product origin sub-regions within Tanzania are not provided in the PDF; "Tanzania" will
  be used as the origin for all 5 products until Africom supplies regional detail.
- The Oliver Hartman testimonial will be displayed without a photo or job title, as neither
  is provided in the brand document.
- The "5 innovative agribusiness initiatives" stat is a single headline figure; no
  individual initiative names or descriptions are in scope for this update.
- Both office addresses are real and should both appear on the contact page.
- The environment variable `CONTACT_EMAIL` must be updated to info@africom.biz separately
  by the developer; this specification covers the code-level content only.
- The existing website page structure (5 pages) is unchanged; this update affects content
  data files and component copy only, plus a new stats/testimonial block on the homepage.
- The services page URL (`/consultation`) may remain as-is or be renamed to `/services`;
  this is a decision for the implementation plan.
