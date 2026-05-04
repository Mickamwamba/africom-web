# Quickstart: Africom Company Website

**Feature**: 001-company-website
**Date**: 2026-05-04

This guide lets you run, validate, and deploy the Africom website from a clean checkout.

---

## Prerequisites

- Node.js 18.17 or later
- npm 9+ or pnpm 8+
- A Resend account and API key (free tier at resend.com)
- Africom's designated contact email address

---

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=inquiries@africom-example.com
```

> Do **not** commit `.env.local` to version control. It is listed in `.gitignore`.

---

## 3. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## 4. Validate the Running Site

Work through this checklist after starting the dev server:

### Navigation
- [ ] Homepage loads at `/`
- [ ] Header navigation links reach all 5 pages: About, Export Products, Consultation, Contact
- [ ] All 5 pages are reachable within 2 clicks from the homepage

### Export Client Flow (User Story 1 — P1)
- [ ] Homepage shows a clear section or call-to-action for export products
- [ ] `/exports` page lists all product categories with origin, characteristics, and target markets
- [ ] A "Contact us" call-to-action on `/exports` links to `/contact`
- [ ] Inquiry form on `/contact` can be submitted with `serviceOfInterest: "export"`
- [ ] On successful submission, a confirmation message is shown
- [ ] Inquiry email is received at `CONTACT_EMAIL`

### Development Partner Flow (User Story 2 — P2)
- [ ] Homepage shows a clear section or call-to-action for consultation services
- [ ] `/consultation` page lists all service offerings with target audience and topics
- [ ] A "Contact us" call-to-action on `/consultation` links to `/contact`
- [ ] Inquiry form can be submitted with `serviceOfInterest: "consultation"`

### About & Credibility (User Story 3 — P3)
- [ ] `/about` page shows company history, mission, and US registration status
- [ ] Credibility section (if content provided) displays partner logos or project highlights

### Contact Form Validation
- [ ] Submitting empty form shows required-field error messages
- [ ] Submitting invalid email shows email format error
- [ ] Submitting message under 10 characters shows minimum-length error

### 404 Handling
- [ ] Visiting `/nonexistent-path` shows the custom 404 page
- [ ] 404 page includes a link back to the homepage

### Responsive Layout
- [ ] All pages display correctly at 375px width (mobile)
- [ ] All pages display correctly at 1280px width (desktop)

---

## 5. Run Tests

### End-to-End (Playwright)

```bash
npx playwright test
```

Runs acceptance tests for all 3 user stories across Chromium, Firefox, and WebKit.

### Unit Tests (Vitest)

```bash
npm run test
```

Runs form validation unit tests.

---

## 6. Build for Production

```bash
npm run build
```

Produces a static export in the `.next/` directory (or `out/` if `output: "export"` is
set in `next.config.ts`).

---

## 7. Deploy to Vercel

1. Push the branch to GitHub
2. Connect the repository to Vercel (vercel.com/new)
3. Add environment variables in the Vercel dashboard:
   - `RESEND_API_KEY`
   - `CONTACT_EMAIL`
4. Deploy — Vercel auto-detects Next.js

Preview deployments are created automatically for each branch push.

---

## Content Handoff Checklist (before launch)

Confirm Africom has supplied:

- [ ] Company legal name and US registration details
- [ ] Company mission statement and About section text
- [ ] US headquarters address
- [ ] Primary contact email and optional phone number
- [ ] List of agricultural product categories (name, origin, characteristics, markets)
- [ ] Consultation service descriptions (name, scope, audience, topics)
- [ ] Credibility materials: partner logos, certifications, project highlights (or
      confirmation that the section should be omitted)
- [ ] Social media account URLs (or confirmation to omit)
- [ ] Hero/banner images (high-resolution)
- [ ] Product images (optional)
