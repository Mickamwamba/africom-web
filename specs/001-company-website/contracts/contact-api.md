# Contract: Contact Form API

**Feature**: 001-company-website
**Date**: 2026-05-04
**Route**: `POST /api/contact`

Defines the interface contract for the inquiry form submission endpoint.

---

## Request

**Method**: `POST`
**Content-Type**: `application/json`

### Request Body

```json
{
  "name": "string (required, 2–100 chars)",
  "organization": "string (optional, max 200 chars)",
  "email": "string (required, valid email format)",
  "serviceOfInterest": "\"export\" | \"consultation\" | \"other\" (required)",
  "message": "string (required, 10–2000 chars)"
}
```

### Example Request

```json
{
  "name": "Jane Smith",
  "organization": "Global Grains Ltd",
  "email": "jane.smith@globalgrains.com",
  "serviceOfInterest": "export",
  "message": "We are interested in sourcing cashew nuts for European distribution. Please contact us to discuss volumes and pricing."
}
```

---

## Response

### Success (200 OK)

```json
{
  "success": true,
  "message": "Your inquiry has been received. We will be in touch within 2 business days."
}
```

**Side effect**: An email notification is sent to Africom's designated contact address
(`CONTACT_EMAIL` environment variable) containing all submitted fields.

### Validation Error (400 Bad Request)

```json
{
  "success": false,
  "errors": {
    "name": "Name is required",
    "email": "A valid email address is required",
    "message": "Message must be at least 10 characters"
  }
}
```

Only fields that fail validation are included in `errors`.

### Server Error (500 Internal Server Error)

```json
{
  "success": false,
  "message": "Unable to send your inquiry at this time. Please email us directly at [CONTACT_EMAIL]."
}
```

The 500 response MUST include the fallback direct email address so the visitor is not
left without a contact option.

---

## Validation Rules (server-side enforcement)

| Field | Rule |
|-------|------|
| `name` | Required. String. Min 2, max 100 characters. |
| `organization` | Optional. String. Max 200 characters. |
| `email` | Required. Valid RFC 5322 email format. |
| `serviceOfInterest` | Required. Must be exactly `"export"`, `"consultation"`, or `"other"`. |
| `message` | Required. String. Min 10, max 2000 characters. |

---

## Security Requirements

- The route MUST reject requests with a `Content-Type` other than `application/json`.
- Input MUST be sanitised server-side before inclusion in the email body to prevent
  email header injection.
- The endpoint MUST NOT expose the `RESEND_API_KEY` or `CONTACT_EMAIL` in any response.
- Rate limiting is out of scope for v1 but SHOULD be added before public launch if
  the site is indexed by search engines.

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Resend API key for sending transactional email |
| `CONTACT_EMAIL` | Africom's designated inbox for receiving inquiry notifications |
