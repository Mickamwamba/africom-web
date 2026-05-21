# Data Model: Events, Trainings & Admin Dashboard

**Branch**: `004-events-trainings-admin` | **Date**: 2026-05-20

All tables live in the `public` schema of the Supabase Postgres database. Row Level Security (RLS) is enabled on every table. UUIDs are used as primary keys throughout (`gen_random_uuid()`).

---

## Entity Relationship Overview

```
categories ──< events >── registrations
                 │
              (cover image stored in Supabase Storage: event-covers bucket)

auth.users ──< user_roles

inquiries (standalone — populated by contact form API)
```

---

## Tables

### `categories`

Predefined labels managed by admins; applied to events for filtering.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `name` | `text` | NOT NULL, UNIQUE | Case-insensitive uniqueness enforced via `lower(name)` unique index |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |

**Constraints**:
- A category cannot be deleted if any event references it (`ON DELETE RESTRICT` on `events.category_id`).
- Category names are trimmed and stored as entered; display normalisation is the UI's responsibility.

**RLS Policies**:
- `SELECT`: All users (including anonymous) — categories are public for filtering.
- `INSERT`, `UPDATE`, `DELETE`: Admin role only.

---

### `events`

Core entity representing a published or draft event or training.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `title` | `text` | NOT NULL | Max 200 chars (enforced by app) |
| `slug` | `text` | NOT NULL, UNIQUE | URL-safe identifier; auto-generated from title, admin-overridable |
| `type` | `text` | NOT NULL, CHECK (`type` IN ('event', 'training')) | Differentiates Event from Training |
| `category_id` | `uuid` | FK → `categories.id` ON DELETE RESTRICT, nullable | NULL allowed if no category assigned |
| `description` | `text` | NOT NULL | Tiptap HTML output; sanitised before storage |
| `start_at` | `timestamptz` | NOT NULL | Event start date and time |
| `end_at` | `timestamptz` | NOT NULL, CHECK (`end_at` > `start_at`) | Event end date and time |
| `location` | `text` | NOT NULL | Physical address or online URL |
| `is_online` | `boolean` | NOT NULL, default `false` | True if event is online/virtual |
| `price` | `numeric(10,2)` | nullable | NULL means use `is_free`; 0.00 is a valid price |
| `is_free` | `boolean` | NOT NULL, default `true` | True if event has no cost; if false, `price` must be set |
| `cover_image_url` | `text` | nullable | Public URL from Supabase Storage `event-covers` bucket |
| `status` | `text` | NOT NULL, default `'draft'`, CHECK (`status` IN ('draft', 'published')) | Only published events visible to anonymous users |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Updated via trigger on any column change |

**Indexes**:
- `events_slug_idx` UNIQUE on `slug`
- `events_status_start_at_idx` on `(status, start_at)` — optimises the public listing query (published + ordered by date)
- `events_category_id_idx` on `category_id`

**State Transitions**:
```
draft ──→ published   (admin publishes)
published ──→ draft   (admin unpublishes)
published ──→ [deleted]  (admin deletes; cascades to registrations)
draft ──→ [deleted]
```

**RLS Policies**:
- `SELECT` (anonymous / public): `status = 'published'` only.
- `SELECT` (admin / staff): All rows.
- `INSERT`, `UPDATE`: Admin and Staff roles.
- `DELETE`: Admin role only.

---

### `registrations`

Records a visitor's registration interest for a specific event.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `event_id` | `uuid` | NOT NULL, FK → `events.id` ON DELETE CASCADE | Deleting an event removes its registrations |
| `full_name` | `text` | NOT NULL | Max 100 chars |
| `email` | `text` | NOT NULL | Valid email format enforced by app |
| `phone` | `text` | NOT NULL | Free-format; max 30 chars |
| `organisation` | `text` | nullable | Optional; max 200 chars |
| `status` | `text` | NOT NULL, default `'pending'`, CHECK (`status` IN ('pending', 'confirmed', 'cancelled')) | |
| `consent_given` | `boolean` | NOT NULL, default `false` | Must be `true` to be accepted (enforced by app and DB CHECK) |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Registration timestamp |

**Constraints**:
- `CHECK (consent_given = true)` — registrations without consent are rejected at the DB level as a safety net.
- Duplicate registrations (same email + event) are permitted; the organisation manages deduplication operationally.

**Indexes**:
- `registrations_event_id_idx` on `event_id` — supports filtering by event.
- `registrations_created_at_idx` on `created_at` — supports chronological ordering.

**State Transitions**:
```
pending ──→ confirmed   (admin/staff confirms)
pending ──→ cancelled   (admin/staff cancels)
confirmed ──→ cancelled (admin/staff cancels a confirmed attendee)
cancelled ──→ confirmed (admin/staff reinstates)
```

**RLS Policies**:
- `INSERT` (anonymous): Allowed — public registration submission.
- `SELECT`, `UPDATE`: Admin and Staff roles only.
- `DELETE`: Admin role only (soft-cancel via status is preferred over hard delete).

---

### `inquiries`

Contact form submissions from the public website. Populated when `/api/contact` is called.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `sender_name` | `text` | NOT NULL | |
| `email` | `text` | NOT NULL | |
| `service_of_interest` | `text` | nullable | Matches existing contact form field: 'export' \| 'consultation' \| 'other' |
| `message` | `text` | NOT NULL | |
| `is_read` | `boolean` | NOT NULL, default `false` | |
| `submitted_at` | `timestamptz` | NOT NULL, default `now()` | |

**RLS Policies**:
- `INSERT` (anonymous): Allowed — contact form is public.
- `SELECT`, `UPDATE`: Admin and Staff roles only.
- `DELETE`: Admin role only.

---

### `user_roles`

Maps Supabase Auth users to application roles (admin or staff).

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, UNIQUE, FK → `auth.users.id` ON DELETE CASCADE | One role per user |
| `role` | `text` | NOT NULL, CHECK (`role` IN ('admin', 'staff')) | |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |

**Notes**:
- Rows in this table are created by a system administrator directly in Supabase (no self-service).
- A user without a row in `user_roles` has no admin access regardless of being in `auth.users`.

**RLS Policies**:
- `SELECT`: Authenticated user can read their own row only (`user_id = auth.uid()`).
- `INSERT`, `UPDATE`, `DELETE`: Admin role only (service role key used for seeding).

---

## Supabase Storage

**Bucket**: `event-covers` (public)

- **Access**: Public read (anyone can fetch a cover image via URL); write requires authenticated admin/staff with a valid Supabase session.
- **File path pattern**: `{event_id}/{filename}` — scoped per event to avoid collisions.
- **Size limit**: 5MB enforced client-side; Supabase free tier hard limit is 50MB.
- **Accepted types**: `image/jpeg`, `image/png`, `image/webp`.

---

## RLS Helper: Role Detection

RLS policies reference a Postgres function `get_my_role()` that queries `user_roles` for the currently authenticated user:

```sql
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS text
LANGUAGE sql STABLE
AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;
```

Example policy (admin or staff can SELECT registrations):
```sql
CREATE POLICY "admin_staff_select_registrations"
ON public.registrations FOR SELECT
USING (get_my_role() IN ('admin', 'staff'));
```

Example policy (admin only can DELETE events):
```sql
CREATE POLICY "admin_delete_events"
ON public.events FOR DELETE
USING (get_my_role() = 'admin');
```

---

## Migration Order

Migrations must be applied in this order to satisfy foreign key constraints:

1. `categories`
2. `events` (FK → categories)
3. `registrations` (FK → events)
4. `inquiries` (standalone)
5. `user_roles` (FK → auth.users)
6. `get_my_role()` function
7. All RLS policies
8. Storage bucket `event-covers`
