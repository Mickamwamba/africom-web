# API Contracts: Events, Trainings & Admin Dashboard

**Branch**: `004-events-trainings-admin` | **Date**: 2026-05-20

These are the public-facing Next.js Route Handler endpoints. Admin data operations (event CRUD, registration status updates, inquiry read/unread) use Next.js Server Actions — they are not documented here as they are internal server-to-database calls not exposed as standalone HTTP endpoints.

All public endpoints are under `src/app/api/`.

---

## `GET /api/events`

Returns a list of published events, with optional filtering.

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `view` | `'upcoming' \| 'past'` | No | Default `'upcoming'`. `upcoming`: `end_at > now()`. `past`: `end_at <= now()`. |
| `type` | `'event' \| 'training'` | No | Filter by event type |
| `category` | `string` (category ID) | No | Filter by category ID |
| `page` | `number` | No | Default `1`. Page number for pagination. |
| `limit` | `number` | No | Default `12`. Max `50`. |

### Response — 200 OK

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "string",
      "slug": "string",
      "type": "event | training",
      "category": {
        "id": "uuid",
        "name": "string"
      },
      "start_at": "ISO 8601 datetime",
      "end_at": "ISO 8601 datetime",
      "location": "string",
      "is_online": true,
      "is_free": false,
      "price": 150.00,
      "cover_image_url": "string | null",
      "status": "published"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 47,
    "total_pages": 4
  }
}
```

### Error Responses

| Status | Body | When |
|--------|------|------|
| `400` | `{ "error": "Invalid query parameter: view" }` | Invalid parameter value |
| `500` | `{ "error": "Internal server error" }` | Database failure |

---

## `GET /api/events/[slug]`

Returns the full details of a single published event by slug.

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | `string` | The event's unique URL slug |

### Response — 200 OK

```json
{
  "id": "uuid",
  "title": "string",
  "slug": "string",
  "type": "event | training",
  "category": {
    "id": "uuid",
    "name": "string"
  },
  "description": "<p>HTML string from Tiptap</p>",
  "start_at": "ISO 8601 datetime",
  "end_at": "ISO 8601 datetime",
  "location": "string",
  "is_online": true,
  "is_free": false,
  "price": 150.00,
  "cover_image_url": "string | null",
  "status": "published"
}
```

### Error Responses

| Status | Body | When |
|--------|------|------|
| `404` | `{ "error": "Event not found" }` | Slug does not exist or event is a draft |
| `500` | `{ "error": "Internal server error" }` | Database failure |

---

## `POST /api/registrations`

Submits a registration for a published event. Available to anonymous users.

### Request Body (`application/json`)

```json
{
  "event_id": "uuid",
  "full_name": "string (required, 2–100 chars)",
  "email": "string (required, valid email)",
  "phone": "string (required, max 30 chars)",
  "organisation": "string (optional, max 200 chars)",
  "consent_given": true
}
```

### Response — 201 Created

```json
{
  "success": true,
  "message": "You have been registered successfully. We look forward to seeing you!"
}
```

### Error Responses

| Status | Body | When |
|--------|------|------|
| `400` | `{ "success": false, "errors": { "field": "message" } }` | Validation failure (missing required field, invalid email, consent not given) |
| `404` | `{ "success": false, "error": "Event not found or no longer available" }` | event_id refers to a draft, deleted, or non-existent event |
| `500` | `{ "success": false, "error": "Unable to process your registration. Please try again." }` | Database failure |

### Validation Rules

| Field | Rule |
|-------|------|
| `event_id` | Must be a valid UUID referencing a published event |
| `full_name` | Required, 2–100 characters |
| `email` | Required, valid email format |
| `phone` | Required, 1–30 characters |
| `organisation` | Optional, max 200 characters |
| `consent_given` | Must be `true` — form cannot submit without it |

---

## `POST /api/contact` (modified)

Existing endpoint — extended to also persist the submission to the `inquiries` table in addition to sending the Resend email. The request/response contract is unchanged; this is a non-breaking internal extension.

### Change

After the email is sent successfully (or attempted), the handler now also calls:
```
supabase.from('inquiries').insert({ sender_name, email, service_of_interest, message })
```

The inquiry write is fire-and-ignore for the API response — a DB write failure does not cause the endpoint to return an error to the user (email already sent). The write failure is logged server-side.

### No contract changes

The request body, response shape, and HTTP status codes are identical to the existing implementation. No changes to `InquiryForm.tsx` or `formValidation.ts` are required.

---

## `GET /api/categories` (new, public)

Returns all categories for use in the public filter bar. Lightweight endpoint — categories are typically few in number.

### Response — 200 OK

```json
{
  "data": [
    { "id": "uuid", "name": "Leadership" },
    { "id": "uuid", "name": "Agriculture" }
  ]
}
```
