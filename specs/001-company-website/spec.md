# Feature Specification: Africom Company Website

**Feature Branch**: `001-company-website`
**Created**: 2026-05-04
**Status**: Draft
**Input**: User description: "I want to build a website for the company called Africom, which is a commercial business registered in the US which deals mainly with exportation of agricultural products from Tanzania to regional and international markets. They also offer consultation on development projects, working with NGOS, Donors and Implementation partners across agricultural value chain topics. They mainly want visibility to their exportation clients and other potential partners."

## User Scenarios & Testing

### User Story 1 - Export Client Discovery (Priority: P1)

An international or regional buyer looking to source agricultural products from Tanzania visits
the website to learn what Africom exports, confirm the company's credibility, and initiate
business contact.

**Why this priority**: Exportation is Africom's primary revenue line and the main audience
driving the website need.

**Independent Test**: A visitor can browse to the homepage, navigate to the export products
section, and submit a business inquiry without requiring any other section of the site to
be present.

**Acceptance Scenarios**:

1. **Given** a visitor arrives on the homepage, **When** they look for agricultural export
   offerings, **Then** they find a clearly labelled section listing Africom's product
   categories, their Tanzanian origin, and the regional/international markets served.
2. **Given** a visitor wants to assess Africom's credibility, **When** they read the About
   section, **Then** they see the company's US registration status, mission, and geographic
   coverage.
3. **Given** a visitor is ready to make contact, **When** they navigate to the contact
   section, **Then** they find a business inquiry form and company contact details allowing
   them to submit a request.

---

### User Story 2 - Development Partner Discovery (Priority: P2)

An NGO programme officer, donor representative, or implementation partner looking for a
consultation partner in agricultural value chain projects visits the site to understand
Africom's expertise and how to engage.

**Why this priority**: Consultation services are a distinct second revenue line serving a
different audience with different information needs.

**Independent Test**: A visitor can navigate directly to the consultation services section,
understand the service scope, and submit an engagement inquiry without needing to see the
export content.

**Acceptance Scenarios**:

1. **Given** a development partner arrives on the site, **When** they explore the
   consultation offering, **Then** they find a dedicated section describing Africom's
   expertise in agricultural value chain topics and the types of organisations they work
   with (NGOs, donors, implementation partners).
2. **Given** a partner wants to initiate an engagement, **When** they submit a consultation
   inquiry, **Then** they can describe their project and receive on-screen confirmation
   that their request has been received.
3. **Given** a visitor needs to understand scope, **When** they read the consultation
   section, **Then** they can distinguish it from the export offering and understand
   which is relevant to their need.

---

### User Story 3 - Company Credibility Research (Priority: P3)

A journalist, investor, or researcher wants to validate Africom's legitimacy and understand
the company's background and reach.

**Why this priority**: Supporting brand credibility benefits both primary audiences but is
secondary to direct service discovery.

**Independent Test**: Visiting the About section independently delivers a complete picture
of the company without requiring any other section to be present.

**Acceptance Scenarios**:

1. **Given** a researcher visits the About section, **When** they read about the company,
   **Then** they find company history, mission, US registration status, and geographic
   focus.
2. **Given** a visitor looks for contact details, **When** they visit the Contact section,
   **Then** they find at minimum an email address, physical or mailing address, and an
   inquiry form.

---

### Edge Cases

- What happens when a visitor submits the inquiry form with missing required fields?
- How does the site present itself to a visitor browsing on a slow or mobile connection?
- What if a visitor navigates to a URL that does not exist on the site (404 page)?

## Requirements

### Functional Requirements

- **FR-001**: The website MUST display a homepage that immediately communicates Africom's
  identity as a US-registered exporter of Tanzanian agricultural products and agricultural
  development consultant, with clear navigation paths to each service line.
- **FR-002**: The website MUST present Africom's agricultural export offering, including
  product categories, their origin in Tanzania, and the regional and international markets
  served.
- **FR-003**: The website MUST describe the key attributes of each product category (name,
  origin region, key characteristics, and target export markets) without requiring a
  transaction or account.
- **FR-004**: The website MUST present Africom's consultation services for development
  projects, clearly describing the scope of work, the types of organisations Africom works
  with (NGOs, donors, implementation partners), and the agricultural value chain topics
  covered.
- **FR-005**: The website MUST visually and structurally separate the export business line
  from the consultation services line so visitors can quickly identify which offering is
  relevant to their need.
- **FR-006**: The website MUST include an About section describing Africom's company
  history, mission, US registration status, and geographic reach.
- **FR-007**: The website MUST include a contact mechanism — an inquiry form and contact
  details — usable by both export clients and development partners, with a field allowing
  visitors to indicate which service they are enquiring about.
- **FR-008**: The inquiry form MUST deliver submissions to Africom's designated contact
  email and display an on-screen confirmation message upon successful submission.
- **FR-009**: The inquiry form MUST validate required fields (name, email, message) and
  display clear error messages when a visitor submits incomplete information.
- **FR-010**: The website MUST include credibility indicators such as partner or client
  logos, relevant certifications, and brief project or engagement highlights where
  supporting materials are supplied by Africom.
- **FR-011**: The website MUST be accessible and display correctly on standard desktop and
  mobile devices using the most widely used browsers.
- **FR-012**: The website MUST serve a custom 404 page when a visitor navigates to a URL
  that does not exist, directing them back to the homepage.

### Key Entities

- **Company Profile**: Africom's identity, mission, US registration, history, and geographic
  focus (Tanzania origin, regional/international reach).
- **Product Category**: An agricultural product group available for export (name, origin,
  key characteristics, target markets).
- **Consultation Service**: A service offering for development project clients (scope,
  target audience — NGOs, donors, implementation partners — and value chain topics covered).
- **Inquiry**: A contact request from a visitor (name, organisation, email, service of
  interest, message).
- **Credibility Indicator**: A partner logo, certification, or project highlight used to
  support trust (content supplied by Africom).

## Success Criteria

### Measurable Outcomes

- **SC-001**: A first-time visitor can identify which Africom service line is relevant to
  them (export vs. consultation) within 30 seconds of arriving on the homepage.
- **SC-002**: A potential export client can locate product information and submit a business
  inquiry in under 3 minutes from the homepage.
- **SC-003**: A development partner can locate the consultation services section and submit
  an engagement inquiry in under 3 minutes from the homepage.
- **SC-004**: The website loads fully for an international visitor in under 4 seconds on a
  standard broadband connection.
- **SC-005**: 95% of inquiry form submissions result in a successfully delivered
  notification to Africom's designated contact email within 5 minutes of submission.
- **SC-006**: The website displays without layout breakage or missing content on the 3 most
  widely used desktop and mobile browsers.
- **SC-007**: All key pages (Homepage, About, Export Products, Consultation Services,
  Contact) are reachable within 2 clicks from the homepage navigation.

## Assumptions

- The website's primary language is English; multilingual support (e.g., Swahili) is out
  of scope for v1.
- The website is informational only — no e-commerce, online ordering, or payment
  functionality is in scope.
- Africom will provide all written content (company description, product details,
  consultation service descriptions, credentials) before or during development; placeholder
  content will be used only where final content is delayed at launch.
- The inquiry form delivers submissions to Africom's email inbox; no CRM integration is
  required for v1.
- The website content is static for v1 — updates will require developer assistance; a
  content management system is out of scope for this phase.
- Credibility indicators (partner/client logos, certifications) will be included only if
  Africom supplies the supporting materials; the section will be omitted rather than shown
  with placeholder content.
- Social media profile links will be included if Africom has active, public accounts.
- The site does not require visitor accounts, login, or any authenticated sections.
- No blog or news section is in scope for v1.
