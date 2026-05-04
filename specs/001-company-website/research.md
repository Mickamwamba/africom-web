# Research: Africom Company Website

**Feature**: 001-company-website
**Date**: 2026-05-04
**Phase**: 0 — Technology & Pattern Research

---

## Decision 1: Web Framework

**Decision**: Next.js 14 with App Router and static export capability

**Rationale**:
- Static site generation (`next export`) produces a deployable artefact with no server
  runtime, matching the "no CMS, no database" constraint
- App Router enables file-system-based page routing, which maps directly to the 5 key
  pages identified in the spec
- Built-in image optimisation supports the < 4-second international load time goal (SC-004)
- Vercel deployment (same company) provides zero-config CI/CD and global CDN with edge
  caching well-suited for international visitors

**Alternatives considered**:
- **Astro**: Excellent for content-heavy static sites and slightly faster for pure static
  output. Rejected because Next.js has broader ecosystem familiarity and the project
  requires one dynamic route (contact form API endpoint) which is handled natively in
  Next.js without a separate service
- **Plain HTML/CSS**: Simplest possible approach. Rejected because component reusability
  (shared header, footer, card patterns) would require manual duplication without a
  component model, increasing long-term maintenance cost
- **Gatsby**: Mature static site generator. Rejected because Next.js App Router is the
  current industry default and Gatsby's build performance for small sites offers no
  meaningful advantage

---

## Decision 2: Styling

**Decision**: Tailwind CSS 3.x

**Rationale**:
- Utility-first approach produces consistent, responsive layouts without custom CSS
  accumulation, supporting the SC-006 requirement (correct display across 3 major browsers)
- Built-in responsive utilities (`sm:`, `md:`, `lg:` prefixes) make the mobile layout
  requirement (FR-011) straightforward to implement
- PurgeCSS integration in production removes unused styles, supporting the load time goal

**Alternatives considered**:
- **CSS Modules**: More explicit, zero-runtime. Rejected because the component count for
  this site is small enough that Tailwind's productivity benefit outweighs the utility
  class verbosity concern
- **Styled Components / Emotion**: CSS-in-JS. Rejected because runtime style injection
  adds unnecessary bundle weight for a static marketing site

---

## Decision 3: Contact Form Email Delivery

**Decision**: Resend (transactional email service) via Next.js API route

**Rationale**:
- Resend's free tier supports 3,000 emails/month and 100/day — sufficient for a
  marketing site inquiry volume
- The SDK integrates cleanly with Next.js API routes (TypeScript-first)
- Supports the SC-005 requirement (95% of submissions delivered within 5 minutes)
- Single `RESEND_API_KEY` environment variable — minimal configuration

**Alternatives considered**:
- **Formspree / Netlify Forms**: Third-party form services requiring no API route.
  Rejected because they add an external service dependency and reduce control over
  the submission payload and confirmation UX
- **Nodemailer + SMTP**: Traditional email sending. Rejected because SMTP credentials
  rotation and spam-filter reputation management add operational overhead not justified
  for v1 scale
- **EmailJS (client-side)**: Sends email directly from the browser. Rejected because
  it exposes the API key in client-side code, a security anti-pattern

---

## Decision 4: Deployment Platform

**Decision**: Vercel (free Hobby tier)

**Rationale**:
- Zero-config deployment for Next.js projects (same company)
- Global CDN with edge network well-suited for international visitors, directly supporting
  SC-004 (< 4-second load for international users)
- Environment variables managed via Vercel dashboard (RESEND_API_KEY, CONTACT_EMAIL)
- Preview deployments per branch enable review before merging

**Alternatives considered**:
- **Netlify**: Comparable feature set. Not rejected — viable alternative if Vercel is
  unavailable. Noted for fallback
- **GitHub Pages**: Free, simple. Rejected because it does not support server-side API
  routes, which are needed for the contact form email delivery
- **AWS S3 + CloudFront**: Enterprise-grade. Rejected as over-engineered for this scope;
  violates Principle V (Simplicity)

---

## Decision 5: End-to-End Testing

**Decision**: Playwright

**Rationale**:
- Cross-browser testing (Chromium, Firefox, WebKit) in a single test run directly
  validates SC-006 (correct display on 3 major browsers)
- Playwright's `page.getByRole` and `page.getByText` selectors write tests in user-
  behaviour terms, aligning with Principle III (acceptance scenarios drive tests)
- Strong support for form interaction testing (FR-007–FR-009 acceptance scenarios)

**Alternatives considered**:
- **Cypress**: Mature, excellent DX. Not rejected — viable alternative. Playwright
  chosen for built-in multi-browser support without additional configuration
- **Selenium**: Legacy framework. Rejected as more complex to configure for modern
  TypeScript projects

---

## Decision 6: Unit Testing

**Decision**: Vitest

**Rationale**:
- Native ESM support, compatible with Next.js TypeScript project without extra Babel config
- Fast (Vite-powered) with watch mode suited to form validation logic development
- API compatible with Jest — familiar to most developers

**Alternatives considered**:
- **Jest**: Standard choice. Rejected because ESM configuration with Next.js App Router
  requires additional transform setup that Vitest handles natively

---

## Summary: Resolved Technical Choices

| Area | Choice | Key Reason |
|------|--------|-----------|
| Framework | Next.js 14 (App Router) | Static export + API route in one project |
| Styling | Tailwind CSS 3.x | Responsive utilities, minimal bundle in prod |
| Email | Resend + Next.js API route | Simple integration, free tier sufficient |
| Deployment | Vercel | Zero-config CDN, international performance |
| E2E Tests | Playwright | Multi-browser, behaviour-driven selectors |
| Unit Tests | Vitest | ESM-native, fast, Jest-compatible API |

All NEEDS CLARIFICATION items from the spec have been resolved. No blocking unknowns.
