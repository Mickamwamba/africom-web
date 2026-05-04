# Contract: Page Routes

**Feature**: 001-company-website
**Date**: 2026-05-04

Defines the URL structure and navigation contract for the Africom website.
All pages are statically generated. No authentication required for any route.

---

## Route Map

| Route | Page | Primary Audience | Navigation Label |
|-------|------|-----------------|-----------------|
| `/` | Homepage | All visitors | Home |
| `/about` | About Africom | All visitors | About |
| `/exports` | Export Products | Export clients | Export Products |
| `/consultation` | Consultation Services | Development partners | Consultation |
| `/contact` | Contact & Inquiry Form | All visitors | Contact |
| `/*` (unmatched) | Custom 404 | All visitors | — |

---

## Navigation Contract

- All 5 primary routes MUST be reachable from the homepage within 2 clicks (SC-007).
- The site header MUST include navigation links to all 5 primary pages on every page.
- The homepage MUST include direct call-to-action links to both `/exports` and
  `/consultation`, enabling visitors to self-select their service line within 30 seconds
  (SC-001).
- The Contact page (`/contact`) MUST be reachable from the header and from a call-to-
  action on both the `/exports` and `/consultation` pages.

---

## 404 Behaviour

- Any unmatched route MUST render the custom 404 page (`src/app/not-found.tsx`).
- The 404 page MUST include a link back to the homepage.
- The 404 page MUST display a user-friendly message (not a raw error).

---

## SEO Requirements

Each page MUST have:
- A unique `<title>` tag
- A `<meta name="description">` tag summarising the page content
- An `<h1>` heading that matches the page's primary topic

The homepage `<title>` MUST include the company name "Africom".
