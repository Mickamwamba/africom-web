# Developer Quickstart: Events, Trainings & Admin Dashboard

**Branch**: `004-events-trainings-admin` | **Date**: 2026-05-20

---

## Prerequisites

- Node.js 20+
- A Supabase account (free tier) — [supabase.com](https://supabase.com)
- The existing project dependencies installed (`npm install`)

---

## Step 1 — Create a Supabase Project

1. Log in to [supabase.com](https://supabase.com) and create a new project.
2. Note your **Project URL** and **anon public key** from Settings → API.
3. Also note the **service_role key** (keep this secret — server-side only).

---

## Step 2 — Environment Variables

Create `.env.local` in the project root (it is already in `.gitignore`):

```env
# Existing (already required)
RESEND_API_KEY=re_...
CONTACT_EMAIL=info@africom.biz

# New — Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

`NEXT_PUBLIC_` variables are safe to expose to the browser. `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be used in client components.

---

## Step 3 — Run Database Migrations

In the Supabase dashboard, open the **SQL Editor** and run the migration scripts in this order:

1. `specs/004-events-trainings-admin/migrations/001_categories.sql`
2. `specs/004-events-trainings-admin/migrations/002_events.sql`
3. `specs/004-events-trainings-admin/migrations/003_registrations.sql`
4. `specs/004-events-trainings-admin/migrations/004_inquiries.sql`
5. `specs/004-events-trainings-admin/migrations/005_user_roles.sql`
6. `specs/004-events-trainings-admin/migrations/006_rls_policies.sql`
7. `specs/004-events-trainings-admin/migrations/007_storage.sql`

> Migration files are generated during the implementation phase (`/speckit-implement`).

---

## Step 4 — Create the First Admin User

1. In the Supabase dashboard, go to **Authentication → Users → Invite user** and enter the admin's email.
2. The admin will receive an email to set their password.
3. Once the account is created, find the user's UUID in the Users list.
4. In the SQL Editor, run:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('<admin-user-uuid>', 'admin');
   ```
5. Repeat for any staff members using `'staff'` as the role.

---

## Step 5 — Install New Dependencies

```bash
npm install @supabase/ssr @supabase/supabase-js @tiptap/react @tiptap/starter-kit @radix-ui/react-dialog @radix-ui/react-tabs
```

---

## Step 6 — Run the Development Server

```bash
npm run dev
```

- Public events listing: [http://localhost:3000/events](http://localhost:3000/events)
- Admin dashboard login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## Step 7 — Run Tests

```bash
# Unit tests
npm run test

# End-to-end tests (requires dev server running)
npm run test:e2e
```

---

## Supabase Storage — Event Covers Bucket

After running migration `007_storage.sql`, verify the `event-covers` bucket exists in **Storage** in the Supabase dashboard. It should be set to **Public** (anonymous read allowed).

---

## Key File Locations

| File | Purpose |
|------|---------|
| `src/lib/supabase/client.ts` | Browser Supabase client |
| `src/lib/supabase/server.ts` | Server Supabase client (RSC / Server Actions) |
| `src/lib/supabase/middleware.ts` | Session refresh middleware |
| `src/lib/auth.ts` | Role-checking helpers (`requireRole`, `getRole`) |
| `src/middleware.ts` | Next.js middleware (imports Supabase session refresh) |
| `src/app/admin/layout.tsx` | Auth guard for all `/admin/*` routes |
