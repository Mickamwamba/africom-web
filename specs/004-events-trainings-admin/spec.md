# Feature Specification: Events, Trainings & Admin Dashboard

**Feature Branch**: `004-events-trainings-admin`
**Created**: 2026-05-20
**Status**: Draft
**Input**: User description: "Add an Events & Trainings feature to the Africom International website with public-facing listings, event registration, and a role-based admin dashboard backed by Supabase."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse & Discover Events (Priority: P1)

A website visitor wants to see what events and trainings Africom International is offering. They land on the Events & Trainings page, see a list of upcoming events with key details, and can filter by category or type (Event vs Training) to find what interests them.

**Why this priority**: Core value proposition — if visitors can't find and browse events, no other feature matters.

**Independent Test**: Can be tested by navigating to `/events`, verifying cards display with title, category, date, location/mode, and price, and confirming filters change the visible listings.

**Acceptance Scenarios**:

1. **Given** the events page is loaded, **When** no filter is applied, **Then** all published upcoming events and trainings appear as cards in chronological order.
2. **Given** the events page is loaded, **When** the visitor filters by category "Leadership", **Then** only events tagged "Leadership" are shown.
3. **Given** the events page is loaded, **When** the visitor filters by type "Training", **Then** only training listings are shown.
4. **Given** there are no upcoming events, **When** the visitor loads the page, **Then** a friendly "No upcoming events" message is displayed.
5. **Given** the visitor clicks the "Past" tab, **When** there are past events, **Then** events whose end date has already passed are listed in reverse chronological order.
6. **Given** the visitor clicks the "Past" tab, **When** there are no past events, **Then** a friendly "No past events" message is displayed.

---

### User Story 2 - View Event Details & Register (Priority: P1)

A visitor finds an event they are interested in, clicks through to the detail page to learn more, and submits a registration form to reserve their spot.

**Why this priority**: Registration is the primary conversion action — it directly connects visitors to the organisation.

**Independent Test**: Can be tested by clicking an event card, verifying the detail page shows full information and a "Register Now" button, completing the form, and confirming a success message appears and the registration is recorded.

**Acceptance Scenarios**:

1. **Given** a visitor is on the events listing, **When** they click an event card, **Then** they are taken to a detail page showing title, full description, date & time, location/mode, price, category, and cover image.
2. **Given** a visitor is on the event detail page, **When** they click "Register Now", **Then** a modal overlay opens containing a registration form with fields for full name, email, phone number, and optional organisation.
3. **Given** the visitor submits valid registration details, **When** the form is submitted, **Then** a confirmation message is shown and the registration is saved.
4. **Given** the visitor submits the form with a missing required field (name, email, or phone), **When** they attempt to submit, **Then** inline validation errors are displayed and the form is not submitted.
5. **Given** an event has a "draft" status, **When** any visitor attempts to access its URL directly, **Then** they are shown a 404 or "not found" page.

---

### User Story 3 - Admin Manages Events (Priority: P2)

An authenticated admin or staff member logs into the admin dashboard to create a new event, update an existing one, or remove a cancelled event. They can publish or save as draft to control public visibility.

**Why this priority**: Without this, the organisation cannot keep event listings current; however the public site P1 stories can be tested with seeded data.

**Independent Test**: Can be tested by logging into `/admin`, creating a new event via the form, verifying it appears in the listing, then editing and deleting it.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user navigates to `/admin`, **When** they arrive, **Then** they are redirected to the login page.
2. **Given** an admin is logged in, **When** they complete the "Create Event" form and publish, **Then** the event appears on the public events page immediately.
3. **Given** an admin is logged in, **When** they save an event as "Draft", **Then** the event is not visible on the public website.
4. **Given** an admin is logged in, **When** they edit an existing event and save, **Then** the changes are reflected on the public detail page.
5. **Given** an admin is logged in, **When** they delete an event, **Then** it is removed from both the admin list and the public site.
6. **Given** a staff member is logged in, **When** they navigate to any event, **Then** no delete option is available to them.

---

### User Story 4 - Admin Views Registrations (Priority: P2)

An admin or staff member needs to see who has registered for a specific event to plan logistics, prepare materials, or follow up with attendees.

**Why this priority**: Operational necessity for running events, but depends on registration data existing (P1 stories).

**Independent Test**: Can be tested by seeding registrations, logging in, navigating to an event's registrations view, and verifying names, emails, and statuses appear with correct filtering.

**Acceptance Scenarios**:

1. **Given** an admin is on the Registrations page, **When** they select an event from the filter, **Then** only registrations for that event are shown.
2. **Given** registrations are listed, **When** the admin clicks "Export CSV", **Then** a CSV file is downloaded containing all visible registrations.
3. **Given** a registration is listed, **When** the admin changes its status to "Confirmed" or "Cancelled", **Then** the status updates immediately in the list.

---

### User Story 5 - Admin Views Inquiries (Priority: P3)

An admin needs to review messages submitted through the website's existing contact form, mark them as read, and track outstanding follow-ups.

**Why this priority**: Valuable for operations, but entirely independent from the events feature — existing data, lower urgency.

**Independent Test**: Can be tested by submitting a contact form, logging into admin, and verifying the inquiry appears in the Inquiries section with read/unread status toggling correctly.

**Acceptance Scenarios**:

1. **Given** a contact form is submitted on the public site, **When** an admin opens the Inquiries section, **Then** the new message appears with sender name, email, message, and submission date, marked as "Unread".
2. **Given** an unread inquiry is listed, **When** the admin clicks it or marks it read, **Then** its status changes to "Read".

---

### Edge Cases

- What happens when a user submits the registration form twice with the same email for the same event? (Assumption: duplicate registrations are allowed; the organisation will manage this operationally.)
- How does the system handle events whose date has already passed? (Past events are hidden from the public listing by default; admin can still view them.)
- What if an admin uploads a cover image that exceeds the storage size limit? (Validation error with a clear message before upload completes.)
- What if the admin dashboard is accessed on a mobile device? (Dashboard is functional but optimised for desktop use.)

---

## Requirements *(mandatory)*

### Functional Requirements

**Public Website**

- **FR-001**: The system MUST display a paginated list of published events and trainings on a dedicated `/events` page, with two views: "Upcoming" (default, showing events whose end date has not yet passed) and "Past" (showing events whose end date has passed), switchable via a filter tab.
- **FR-002**: Each event card MUST show: title, type (Event or Training), category/topic, date & time, location/mode, and price (or "Free").
- **FR-003**: Visitors MUST be able to filter the event listing by category/topic and by type (Event vs Training).
- **FR-004**: The system MUST provide a dedicated detail page for each published event showing all event fields and a "Register Now" call-to-action.
- **FR-005**: Visitors MUST be able to submit a registration form presented as a modal overlay on the event detail page, with fields: full name (required), email address (required), phone number (required), and organisation (optional).
- **FR-005a**: The registration form MUST include a required consent checkbox ("I agree to the privacy policy") with a link to the organisation's privacy policy page. The form MUST NOT submit unless the checkbox is checked.
- **FR-006**: On successful registration submission, the system MUST display a confirmation message to the visitor.
- **FR-007**: The registration form MUST validate required fields and display inline errors before submission.
- **FR-008**: Draft events MUST NOT be accessible or visible to unauthenticated visitors.

**Admin Authentication**

- **FR-009**: The system MUST restrict all admin routes to authenticated users, redirecting unauthenticated visitors to a login page.
- **FR-010**: The system MUST support two roles: Admin and Staff, with role-based access to destructive actions (delete).
- **FR-011**: Admin users MUST be able to log in using an email address and password.

**Event Management**

- **FR-012**: Admin users MUST be able to create events with the following fields: title, type, category (selected from a predefined list), description (rich text), start date & time, end date & time, location (physical address or online link), price (or free), cover image, and published/draft status.
- **FR-012a**: Admin users MUST be able to create, rename, and delete categories via a dedicated category management screen. A category that is in use by one or more events MUST NOT be deletable until it is removed from those events.
- **FR-013**: Admin users MUST be able to edit any field of an existing event and save changes.
- **FR-014**: Admin users MUST be able to delete any event; Staff users MUST NOT have access to this action.
- **FR-015**: Admin users MUST be able to toggle an event between "Published" and "Draft" status.
- **FR-016**: The system MUST support cover image uploads for events.

**Registrations Management**

- **FR-017**: Admin and Staff users MUST be able to view all registrations across all events.
- **FR-018**: Users MUST be able to filter registrations by event.
- **FR-019**: Users MUST be able to export the visible registrations list as a CSV file.
- **FR-020**: Users MUST be able to update a registration's status to "Confirmed" or "Cancelled".

**Inquiries Management**

- **FR-021a**: The contact form on the public website MUST be updated to save each submission to persistent storage in addition to any existing email-sending behaviour.
- **FR-021b**: Admin and Staff users MUST be able to view all contact form submissions, showing: sender name, email, message, and submission date.
- **FR-022**: Users MUST be able to mark an inquiry as "Read" or "Unread".

**Dashboard Overview**

- **FR-023**: The admin home screen MUST display summary counts: total events, upcoming events, total registrations, and unread inquiries.

---

### Key Entities

- **Event**: Represents a published or draft event or training. Key attributes: title, type (Event | Training), category tags, description, start datetime, end datetime, location (text or URL), is_online (boolean), price (numeric, nullable), is_free (boolean), cover_image_url, status (draft | published), created_at, updated_at.
- **Registration**: Records a visitor's interest in attending an event. Key attributes: event (reference), full_name, email, phone, organisation (optional), status (pending | confirmed | cancelled), created_at.
- **Inquiry**: A contact form submission from the public website. Key attributes: sender_name, email, message, is_read (boolean), submitted_at.
- **User (Admin)**: A system user with access to the admin dashboard. Key attributes: email, role (admin | staff), created_at.
- **Category**: A predefined label managed by admins and applied to events for filtering. Key attributes: name (unique label). Categories are created, edited, and deleted by admins via a dedicated category management screen; event creators select from the existing list when creating or editing an event.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can browse the events listing, open a detail page, and complete registration in under 3 minutes.
- **SC-002**: An admin can create and publish a new event from the dashboard in under 5 minutes.
- **SC-003**: All published events and registrations reflect changes made in the admin dashboard within 5 seconds of saving (no manual cache clearing required).
- **SC-004**: The events listing and detail pages load in under 2 seconds on a standard broadband connection.
- **SC-005**: 100% of admin routes return a redirect to login when accessed without authentication.
- **SC-006**: Staff users are unable to access any delete action — verified by role-permission tests.
- **SC-007**: Registration CSV export includes all visible registrations with no missing rows.
- **SC-008**: The full feature is deployable as a single repository to a single hosting environment without additional infrastructure beyond the chosen backend service.

---

## Assumptions

- Events do not have a seat capacity limit in this phase; the organisation manages attendance operationally.
- No email notifications are sent to registrants or admins on registration submission in this phase (future enhancement).
- No payment processing is required; all events may be free or have a listed price for informational purposes only.
- The existing contact form on the Africom website currently sends email only; as part of this feature, the contact form must also be updated to write submissions to the database so the admin dashboard can surface them.
- Past events (where end date has passed) are visible to the public on the `/events` page under a "Past" filter tab, separate from the default "Upcoming" view. Admin users can see all events regardless of date.
- Duplicate registrations (same email, same event) are permitted; deduplication is handled operationally.
- The admin dashboard is a set of protected routes within the same web application (e.g., `/admin/*`), not a separate deployment.
- Admin user accounts are created and managed by a system administrator directly in the backend; there is no self-service sign-up for admin access.
- Mobile responsiveness of the admin dashboard is a nice-to-have; the primary target is desktop browsers.
- Rich text description for events supports basic formatting (bold, italic, bullet lists, links) — no embedded video or complex layouts required.

---

## Clarifications

### Session 2026-05-20

- Q: Does the existing contact form already write submissions to a database, or does it send email only? → A: The form currently sends email only; it must be updated to also save submissions to the database as part of this feature scope.
- Q: How should the registration form be presented on the event detail page? → A: As a modal overlay — opens over the detail page when "Register Now" is clicked, keeping the visitor in context.
- Q: Is a privacy consent checkbox required on the registration form? → A: Yes — a required consent checkbox linking to the privacy policy must be present; form cannot submit without it.
- Q: How are event categories managed — predefined list or free-form tags? → A: Predefined list managed by admins; event creators select from the list; a category in use cannot be deleted.
- Q: Should past events be publicly visible? → A: Yes — visible under a "Past" filter tab on the `/events` page; upcoming events remain the default view.
