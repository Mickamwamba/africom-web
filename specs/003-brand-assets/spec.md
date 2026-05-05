# Feature Specification: Brand Assets & Visual Identity

**Feature Branch**: `003-brand-assets`  
**Created**: 2026-05-05  
**Status**: Draft  
**Input**: User description: "i have added a folder africomassets in the root directory. I want to use the brand guideline document to extract the colours to be used for this website. Also there is a folder inside which contain logos, i want to use the official logo from africomassets/logos. There are also bunch of photos inside africomassets/Photos. I want to use these photos when listing export products. Check which other photos might be applicable in which parts of the site. not required to use all photos. make sure to only use relevant photos."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Official Brand Colors (Priority: P1)

A visitor arriving at the Africom website sees a consistent, professional colour scheme that matches the official brand — warm earth brown and olive green — rather than the placeholder greens and golds that were never drawn from the brand guidelines. Every button, heading, and accent element on every page reflects the official palette.

**Why this priority**: Brand colour is the most pervasive visual element on the site. It appears on every page, every button, and every heading. Correct colours must be in place before photography or logo work is assessed visually, since they affect how all other visual elements read together.

**Independent Test**: Every page uses Earth Brown (`#4F3727`) and Organic Green (`#B2B54A`). No remnants of the old placeholder colours (`#2D6A4F`, `#D4A017`) appear anywhere. A source-code search for the old hex values returns zero results.

**Acceptance Scenarios**:

1. **Given** a visitor opens the homepage, **When** they view any primary call-to-action button, **Then** the button colour matches the official palette (Earth Brown or Organic Green).
2. **Given** a visitor reads a section heading with a brand accent, **When** they view that heading, **Then** the colour is drawn from the official palette — not the old placeholder values.
3. **Given** any page section with a dark background, **When** it is displayed, **Then** the dark tone is Earth Brown `#4F3727`.

---

### User Story 2 - Official Logo in Header and Footer (Priority: P1)

A visitor sees the official Africom International Ltd logo — the wordmark with the plant/grain icon replacing the letter 'o' — in the site header on every page. On dark background sections (footer), the white variant of the logo appears. On light backgrounds, the full-colour variant appears. No plain-text "Africom" fallback remains in place of the logo.

**Why this priority**: The logo is the single most recognisable brand element. Displaying a text-only approximation while the official SVG exists is a significant credibility gap for an international trade company presenting itself to export buyers and development partners.

**Independent Test**: The header on every page displays the full-colour SVG logo. The footer displays the white/inverse SVG logo. Both are crisp at all screen sizes. No plain text "Africom" appears where the logo should be.

**Acceptance Scenarios**:

1. **Given** a visitor is on any page, **When** they view the site header, **Then** the official full-colour Africom International logo SVG is visible and crisp — not a text string.
2. **Given** the footer has a dark background, **When** a visitor views the footer, **Then** the white/inverse variant of the logo appears (not the full-colour version, which would be invisible on dark backgrounds).
3. **Given** the site is viewed on a mobile phone, **When** the header logo is displayed, **Then** the logo scales cleanly without pixellation (vector rendering).
4. **Given** the logo image fails to load, **When** displayed to the visitor, **Then** meaningful alt text "Africom International Ltd" is shown as the fallback.

---

### User Story 3 - Product Photography on Exports Page (Priority: P1)

An export buyer visiting the `/exports` page sees a real photograph alongside each of the 5 product listings — Avocado, Green Bean, Ginger, Garlic, and Capsicum — making the products feel tangible and trustworthy rather than presenting icon-only or text-only cards.

**Why this priority**: Export buyers evaluate produce quality visually before making contact. Product photos are the primary trust signal on the exports page and directly support the commercial goal of the site.

**Independent Test**: Each product card on `/exports` displays a relevant photograph from the official asset library. No product card shows a blank image area, a broken image icon, or a generic placeholder.

**Photo assignments** (from `africomassets/Photos/`):

| Product | Photo file | Visual description |
|---------|-----------|-------------------|
| Avocado | `eddie-pipocas-Utnc4nbYFKo-unsplash.jpg` | Halved avocado on a pile — clear, appetising hero shot |
| Green Bean | `erwan-hesry-1q75BReKpms-unsplash.jpg` | Greenhouse with lush green crops — best available match |
| Ginger | `markus-spiske-sFydXGrt5OA-unsplash.jpg` | Watering leafy garden crops — agricultural cultivation feel |
| Garlic | `gabriel-jimenez-jin4W1HqgL4-unsplash.jpg` | Hands cupping rich soil — earth and root crop suggestion |
| Capsicum | `martin-adams-_LGlGi3KJIA-unsplash.jpg` | Colourful mixed scotch bonnet / capsicum peppers |

**Note**: No dedicated ginger or garlic photos are present in the asset library. The assignments above are the closest available alternatives. Product-specific photography for these two items should be sourced in a future asset update.

**Acceptance Scenarios**:

1. **Given** a visitor lands on `/exports`, **When** the product cards load, **Then** each of the 5 cards displays a relevant photograph.
2. **Given** a visitor views the Avocado product card, **When** they look at the card image, **Then** the halved-avocado photograph is displayed.
3. **Given** a visitor views the Capsicum product card, **When** they look at the card image, **Then** a photograph of vibrant peppers is displayed.
4. **Given** a slow network connection, **When** the page loads, **Then** the image areas show a loading placeholder and never display a broken image icon.

---

### User Story 4 - Homepage Hero Photo (Priority: P2)

A first-time visitor arriving at the homepage is greeted by a striking agricultural landscape photograph in the hero section — reinforcing Africom's "From Farm to Global Markets" tagline visually. The hero text and call-to-action remain clearly legible over the image.

**Why this priority**: The hero section is the first impression for every visitor. A compelling photo dramatically increases perceived professionalism. It is P2 because it is a visual enhancement rather than a brand compliance fix.

**Independent Test**: The homepage hero section displays `federico-respini-sYffw0LNr7s-unsplash.jpg` (golden grain field at sunrise). The tagline "From Farm to Global Markets" and the call-to-action button remain legible against the image.

**Acceptance Scenarios**:

1. **Given** a visitor opens the homepage, **When** the hero section loads, **Then** the agricultural landscape photograph is visible in the hero area.
2. **Given** a visitor is on a mobile device, **When** the hero photo renders, **Then** the photograph is cropped or scaled appropriately — the sunlit field remains the focal point.
3. **Given** a slow connection, **When** the hero image is loading, **Then** the headline text and CTA button are visible before the image completes loading.

---

### User Story 5 - Supporting Photography on Other Pages (Priority: P2)

A visitor exploring the About page, the Consultation page, and the Farm Partnerships section of the homepage encounters contextual photographs that reinforce each section's message — showing real people, real trade, and real agriculture rather than purely text-and-icon layouts.

**Why this priority**: These sections benefit significantly from imagery but are secondary to product photography and logo/colour fixes. They enhance credibility and emotional resonance but do not block core commercial functionality.

**Independent Test**: Each designated section below displays its assigned photograph. No section shows a broken image or an unintended blank space.

**Photo assignments** (from `africomassets/Photos/`):

| Section / Page | Photo file | Visual description |
|----------------|-----------|-------------------|
| Farm Partnerships section (homepage) | `tim-mossholder-xDwEa2kaeJA-unsplash.jpg` | Farm workers harvesting in a field — partnership in action |
| About page — mission/values area | `iwaria-inc-1Wr4U5yRw2M-unsplash.jpg` | African hands forming a star — community and collaboration |
| Consultation page — services introduction | `cytonn-photography-n95VMLxqM2I-unsplash.jpg` | Handshake between two African business professionals |
| Homepage service split — trade/export block | `ian-taylor-jOqJbvo1P9g-unsplash.jpg` | Cargo container ship at sea — global trade and logistics |

**Acceptance Scenarios**:

1. **Given** a visitor scrolls to the Farm Partnerships section on the homepage, **When** the section loads, **Then** the farm workers photograph is visible alongside the section content.
2. **Given** a visitor views the About page, **When** they reach the mission/values area, **Then** the community photograph is displayed.
3. **Given** a visitor lands on the Consultation page, **When** the page loads, **Then** the business handshake photograph appears in the services introduction area.

---

### Edge Cases

- What if an image file fails to load? Image containers must have defined dimensions so the layout does not collapse — a neutral fallback (grey background) and alt text must display instead.
- What if the logo SVG has an unsupported feature in an older browser? A PNG fallback of the same logo variant must be available and used automatically.
- What if a photo's aspect ratio does not match the card or container it is placed in? Photos must be displayed with cover-fit cropping — never stretched or distorted.
- What if a visitor is on very slow mobile data? Text content (headings, CTAs) must appear before images complete loading — images must not block page readability.
- What if iStock-watermarked photos are accidentally included? Only Unsplash-licensed photos and official logo files are used; the three iStock files are excluded entirely.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST use `#4F3727` (Earth Brown) and `#B2B54A` (Organic Green) as its two primary brand colours, replacing all instances of the old placeholder tokens (`#2D6A4F`, `#D4A017`) across every page and component.
- **FR-002**: The site header MUST display the official full-colour Africom International SVG logo on all pages.
- **FR-003**: The site footer MUST display the white/inverse variant of the official Africom International SVG logo wherever the footer has a dark background.
- **FR-004**: Every product card on the `/exports` page MUST display a photograph from the official asset library — one photo per product, 5 products total.
- **FR-005**: All photos and logos MUST be stored within the project's static assets folder so they are served directly from the site — no external image hosting.
- **FR-006**: All logo and photo images MUST include descriptive alt text for accessibility.
- **FR-007**: The homepage hero section MUST display the golden field landscape photo (`federico-respini-sYffw0LNr7s-unsplash.jpg`).
- **FR-008**: The Farm Partnerships section (homepage), About page mission area, Consultation page introduction, and homepage trade/export block MUST each display their assigned supporting photograph.
- **FR-009**: Image containers MUST have defined dimensions so the layout does not shift as images load (no cumulative layout shift on any page).
- **FR-010**: The three iStock photos (`istockphoto-*.jpg`) MUST NOT be used anywhere on the site due to potential licensing restrictions.

### Key Entities

- **Brand Colour Token**: A named colour variable (e.g., `brand-earth-brown`, `brand-organic-green`) mapped to an official hex value, referenced throughout the site's design system. Two tokens replace the two existing placeholder tokens.
- **Logo Asset**: An SVG (with PNG fallback) of the official Africom International logo. Two variants are used: full-colour (light backgrounds) and white/inverse (dark backgrounds).
- **Product Photo**: A photograph paired to a specific export product and displayed in that product's card on the exports page. Five photos, one per product.
- **Section Photo**: A contextual photograph placed in a specific page section to visually support the section's message. Four section photos across the site.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A source-code search for the old placeholder hex values (`#2D6A4F`, `#D4A017`) across all project files returns zero results — the official palette is fully applied.
- **SC-002**: The official SVG logo renders correctly in the header and footer on 100% of pages at all tested viewport sizes (mobile 375px, tablet 768px, desktop 1280px).
- **SC-003**: All 5 product cards on `/exports` display a photograph — zero cards show a broken image, empty container, or missing-image indicator.
- **SC-004**: The 4 designated section photos (homepage hero, farm partnerships, about, consultation) are each visible on their respective pages — 4 out of 4 sections pass visual inspection.
- **SC-005**: Every product and section image has a non-empty alt attribute — an accessibility check finds zero images with missing or empty alt text.
- **SC-006**: No iStock-watermarked images appear anywhere on the site — a visual inspection of all pages confirms zero watermarked photos.

---

## Assumptions

- The `africomassets/` folder at the repository root is the authoritative source for all brand assets. Photo files referenced in this spec will be copied into the project's static assets directory during implementation.
- The three iStock photos (`istockphoto-1324718772-612x612.jpg`, `istockphoto-1324718790-1024x1024.jpg`, `istockphoto-1423042574-612x612.jpg`) carry watermarks and/or licensing restrictions and are excluded from use.
- No dedicated ginger or garlic product photos exist in the current asset library. The Green Bean and Ginger/Garlic product cards will use the best available agricultural photos as stand-ins; product-specific photography for these items should be sourced in a future update.
- The existing site header currently renders the brand name as plain text; the official logo replaces this text element entirely.
- Logo PNG files are available alongside the SVGs in `africomassets/logos/` and serve as fallbacks where SVG rendering is not guaranteed.
- The existing colour configuration uses named tokens that can be updated to the new palette values without requiring changes to component markup — only the token values change.
- All selected Unsplash photos are used under the Unsplash licence, which permits free commercial use. Photo filenames include the photographer's name for attribution purposes.
- The hero photograph will require sufficient contrast overlay or text-shadow treatment to keep the tagline legible over the image — the exact treatment is a design decision for the implementation phase.
