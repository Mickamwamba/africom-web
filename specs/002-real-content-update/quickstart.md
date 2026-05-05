# Quickstart: Real Content Update Validation

**Feature**: 002-real-content-update
**Branch**: 002-real-content-update

## Prerequisites

1. Dev server running: `npm run dev` (available at http://localhost:3000)
2. Playwright installed: `npx playwright install` (if not already done)

## Manual Validation Checklist

Run these checks after `/speckit-implement` completes.

### SC-001: Zero placeholder content

```bash
# Must return no results
grep -r "Africom LLC" src/
grep -r "info@africom-exports.com" src/
grep -r "cashew" src/
grep -r "sesame" src/
grep -ri "pulses" src/
grep -r "coffee" src/
```

### SC-002: All 5 real products visible within 2 clicks

1. Open http://localhost:3000
2. Click "View Export Products"
3. Verify: Avocado, Green Bean, Ginger, Garlic, Capsicum all visible on `/exports`

### SC-003: All 4 real services visible within 2 clicks

1. Open http://localhost:3000
2. Click "Consultation Services"
3. Verify: Agribusiness Consultation, Trade Facilitation, Agribusiness Capacity Building,
   Sustainability Initiatives all visible

### SC-004: Contact details complete

1. Open http://localhost:3000/contact
2. Verify:
   - `16103 Riverside St, Dar es Salaam, Tanzania` visible
   - `8064 83rd Ave Sw Unit H01, Lakewood, WA 98498, USA` visible
   - `+255-758-208-673` visible
   - `+1 904-477-9924` visible
   - `info@africom.biz` visible as clickable email link

### SC-005: Homepage credibility stat visible within 3 sections

1. Open http://localhost:3000
2. Scroll past Hero and ServiceSplitSection
3. Verify "5 innovative agribusiness initiatives" visible
4. Verify Oliver Hartman testimonial visible

### SC-006: Company identity within 60 seconds

1. Open http://localhost:3000
2. Within 60 seconds verify:
   - "Africom International Ltd" in page content
   - "From Farm to Global Markets" as hero tagline
   - `info@africom.biz` in footer

## Automated Tests

```bash
# Run updated E2E tests
npx playwright test

# Run specific test files
npx playwright test tests/e2e/export-client.spec.ts
npx playwright test tests/e2e/dev-partner.spec.ts
npx playwright test tests/e2e/credibility.spec.ts
```

## About Page Validation

1. Open http://localhost:3000/about
2. Verify mission text starts: "To provide integrated agricultural solutions..."
3. Verify vision text starts: "To be a leading hub for sustainable agricultural innovation..."
4. Verify all 8 core values listed: Sustainability, Innovation, Integrity, Empowerment,
   Quality, Community, Collaboration, Respect for Nature

## Environment Variable Reminder

**Developer action required** (not covered by spec):
Update `.env.local` to set `CONTACT_EMAIL=info@africom.biz` before deploying to production.
The form will continue to use the `CONTACT_EMAIL` env var for email delivery regardless
of the contact email displayed in the UI.
