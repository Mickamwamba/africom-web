# Research: Events, Trainings & Admin Dashboard

**Branch**: `004-events-trainings-admin` | **Date**: 2026-05-20

---

## 1. Supabase + Next.js 14 App Router Integration

**Decision**: Use `@supabase/ssr` package with cookie-based session management.

**Rationale**: The `@supabase/auth-helpers-nextjs` package is deprecated as of 2024. The official successor `@supabase/ssr` is designed specifically for server-rendered environments and handles auth token refresh via a Next.js middleware. It works across Server Components, Route Handlers, and Server Actions — all patterns used in this project.

**How it works**:
- `createBrowserClient()` — used in client components for real-time reads and client interactions.
- `createServerClient()` — used in RSC, Server Actions, and Route Handlers; reads/writes cookies via the request/response cycle.
- `middleware.ts` — refreshes the session token on every request so it never expires mid-session.

**Alternatives considered**:
- `@supabase/auth-helpers-nextjs` — deprecated, not suitable for new projects.
- Client-only SDK (`@supabase/supabase-js`) — cannot read server-side session cookies; would force all data fetching to the client, losing RSC benefits and causing layout flash.

---

## 2. Role-Based Access Control (Admin vs Staff)

**Decision**: Store roles in a `user_roles` Postgres table; expose role via a server-side helper that reads from the table after session validation.

**Rationale**: Supabase Auth provides identity (who you are) but not authorisation (what you can do). Two patterns exist: custom JWT claims (set via Edge Functions or auth hooks) or a DB table lookup. The DB table approach is simpler to set up, easier to update (no token refresh cycle needed to propagate role changes), and sufficient for a small number of admin users (<10). Custom claims are preferable only at scale or when the role must be embedded in the JWT for performance reasons — not the case here.

**Role enforcement**:
- Server: `auth.ts` helper `requireRole(role)` reads `user_roles` table and throws/redirects if mismatch.
- Client: Admin layout (`admin/layout.tsx`) is a Server Component that calls `requireRole` before rendering children.
- Database: Row Level Security (RLS) policies enforce access at the data layer as a defence-in-depth measure.

**Alternatives considered**:
- Supabase custom JWT claims via auth hooks — more complex setup, requires Supabase Edge Function or database trigger; overkill for <10 users.
- Middleware-only role check — not sufficient alone; DB-level RLS provides defence in depth if middleware is bypassed.

---

## 3. Rich Text Editor for Event Descriptions

**Decision**: Tiptap with `@tiptap/starter-kit`.

**Rationale**: Tiptap is headless (no bundled styles), React-friendly, actively maintained (MIT license), and `StarterKit` covers exactly the required formatting: bold, italic, bullet lists, links, headings. Output is HTML stored in the `description` column (TEXT type). On the public site, the stored HTML is rendered with `dangerouslySetInnerHTML` inside a scoped prose container — safe because only authenticated admins can write content (not public users).

**Scope**: Bold, italic, bullet list, ordered list, links, H2/H3 headings only. No image embeds, no video, no tables — consistent with spec requirements.

**Alternatives considered**:
- Quill — older codebase, React wrapper not officially maintained.
- React Quill — unmaintained fork, known SSR issues with Next.js.
- Slate.js — significantly more complex API; overkill for the required formatting subset.
- Markdown (stored as MD, rendered with remark) — adds a parsing step and requires admins to know Markdown syntax; worse UX than a visual editor.

---

## 4. Modal / Dialog Primitive

**Decision**: `@radix-ui/react-dialog` for the registration modal.

**Rationale**: Radix UI Dialog is fully accessible (WAI-ARIA Dialog pattern, focus trap, escape key close, scroll lock), unstyled, and integrates cleanly with Tailwind CSS utility classes. The project already uses Tailwind so no additional styling system is introduced. Radix primitives are also well-maintained and widely used in the Next.js/Tailwind ecosystem.

**Alternatives considered**:
- Headless UI (Tailwind Labs) — also a valid choice; Dialog component is functionally equivalent. Radix is preferred because its tree-shaking is more granular (import only Dialog, not the full library) and the API is slightly more composable.
- Custom modal (CSS + `<dialog>` HTML element) — requires manual focus trap, keyboard handling, and ARIA attributes; error-prone.

---

## 5. Event URL Slugs

**Decision**: Auto-generate slug from title using a `slugify` utility (lowercase, spaces→hyphens, strip special chars); store slug in a unique `slug` column; admin can override during event creation/editing.

**Rationale**: Slug-based URLs (`/events/leadership-training-nairobi-2026`) are more readable and shareable than ID-based URLs (`/events/a3f9b2c1`). Storing the slug in the DB allows Next.js static generation and avoids computing slugs at render time. Uniqueness is enforced via a DB UNIQUE constraint with a fallback suffix (e.g., `-2`) if a collision occurs.

**Alternatives considered**:
- ID-only URLs — easier, no collision handling, but poor UX and SEO.
- Auto-slug with no admin override — could generate awkward slugs for events with special characters or non-ASCII titles.

---

## 6. CSV Export

**Decision**: Client-side CSV generation using native JavaScript (no library).

**Rationale**: The export use case is simple: tabular data (registrations list) converted to comma-separated values with a header row. This requires ~20 lines of code and no dependencies. A library like `papaparse` is warranted for complex CSV parsing/streaming; it is not needed here.

**Implementation**: A `csv.ts` utility accepts an array of objects and a column definition array, generates a CSV string with proper quoting (handles commas in values), and triggers a browser download via `URL.createObjectURL` + a temporary `<a>` element.

---

## 7. Image Storage

**Decision**: Supabase Storage with a public `event-covers` bucket; URL stored in `events.cover_image_url`.

**Rationale**: Supabase Storage is included in the Supabase free tier (1GB), integrates with the same auth/RLS layer, and provides a simple upload API. Images are served via a CDN-backed public URL — no additional image CDN is needed at this scale.

**Upload flow**: Admin selects a file in the EventForm → Next.js Server Action uploads to Supabase Storage → returns public URL → URL saved to `events` row.

**Constraints**: 50MB per file upload limit (Supabase free tier). A client-side validation rule of 5MB is enforced before upload to keep image sizes web-appropriate.

**Alternatives considered**:
- Cloudinary / Imgix — feature-rich image transformation, but requires a separate account, adds cost, and is unnecessary for a small number of static event cover images.
- Storing images in the Next.js `public/` folder — not viable for dynamically uploaded content.

---

## 8. Testing Strategy

**Decision**: Vitest for unit + Server Action integration tests; Playwright for public-facing e2e flows.

**Rationale**: Both are already configured in the project (`vitest.config.ts`, `playwright.config.ts`). No new test tooling is introduced. Test scope per constitution Principle III:

- **Vitest unit**: `slugify.ts`, `csv.ts`, `auth.ts` helpers, form validation.
- **Vitest integration**: API route handlers (`/api/registrations`, `/api/events`, updated `/api/contact`) using `msw` to mock Supabase calls, or Supabase local dev for true integration.
- **Playwright e2e**: P1 user stories — browse events listing, view detail, open modal, submit registration. Admin flows tested in Playwright as authenticated sessions.

**Alternatives considered**:
- Jest — not already configured; switching adds friction and no benefit.
- Cypress — Playwright already present; running two e2e frameworks would be wasteful.
