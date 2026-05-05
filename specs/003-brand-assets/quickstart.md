# Quickstart: Brand Assets & Visual Identity

Manual verification scenarios for each user story. Run `npm run dev` (port 3002) then follow each scenario.

---

## Scenario 1: Brand Colour Verification (US1)

**What to verify**: Official brand colours appear everywhere; no old placeholder colours remain.

1. Open the homepage (`/`). Confirm:
   - The hero section background is a warm dark brown (not the old forest green).
   - The "View Export Products" primary button is earth brown (`#4F3727`), not the old deep green.
   - The "Consultation Services" outline button border is earth brown.

2. Open the exports page (`/exports`). Confirm:
   - The CTA banner at the bottom of the page has an earth brown background.
   - The "Origin: Tanzania" text on product cards is in earth brown or organic green.

3. Open the consultation page (`/consultation`). Confirm:
   - The CTA banner background is now organic green (`#B2B54A`) instead of old gold.
   - Checkmark icons in service cards are organic green.

4. Open the about page (`/about`). Confirm:
   - The green CTA block uses earth brown; the second CTA block uses organic green.
   - Core value pills use the `brand-cream` background (unchanged, correct).

5. **Grep check** (terminal): `grep -r "#2D6A4F\|#D4A017" src/` returns zero results.

---

## Scenario 2: Logo Verification (US2)

**What to verify**: Official SVG logo appears in header and footer on every page.

1. Open the homepage (`/`). Confirm:
   - The site header shows the Africom International logo (with the plant/grain icon replacing the 'o') — not the plain text "Africom".
   - The logo is crisp and not pixellated at desktop width.

2. Scroll to the footer. Confirm:
   - The white/inverse variant of the logo appears against the dark footer background.
   - The logo is clearly legible — not invisible against the dark background.

3. Resize the browser to mobile width (375px). Confirm:
   - The header logo scales down cleanly — no overflow or pixellation.
   - The footer logo is still visible.

4. Open DevTools and disable images (via Network throttle → block image type). Confirm:
   - Both header and footer show "Africom International Ltd" as fallback alt text.

5. Check all 5 pages (home, exports, consultation, about, contact) — the header logo appears on every page.

---

## Scenario 3: Product Photography Verification (US3)

**What to verify**: All 5 product cards show photographs; no broken images.

1. Open the exports page (`/exports`). Confirm:
   - All 5 product cards (Avocado, Green Bean, Ginger, Garlic, Capsicum) show a photograph at the top of each card.
   - The Avocado card shows the halved avocado photo.
   - The Capsicum card shows colourful mixed peppers.
   - No card shows a broken image icon or empty image area.
   - Image areas all have the same aspect ratio (4:3) — consistent card heights.

2. Resize to mobile. Confirm images fill the full card width without distortion.

3. DevTools → Network → throttle to "Slow 3G". Reload. Confirm:
   - Product text (name, origin, characteristics) is readable before images finish loading.
   - No layout shift occurs when images load in.

---

## Scenario 4: Hero Photo Verification (US4)

**What to verify**: Homepage hero displays the golden field photo with legible text overlay.

1. Open the homepage (`/`). Confirm:
   - The hero section shows the golden grain field / sunrise landscape photo.
   - The tagline "From Farm to Global Markets" is clearly readable over the photo (white text on gradient overlay).
   - The CTA buttons are visible and usable.
   - The photo covers the full hero width without white bars or distortion.

2. Resize to mobile width. Confirm:
   - The hero photo is still visible and covers the section (no white background showing through).
   - The headline remains readable.

3. DevTools → Lighthouse → check LCP. Confirm the hero image is the LCP element and scores pass (< 2.5s on simulated Fast 3G with `priority` prop active).

---

## Scenario 5: Supporting Section Photography Verification (US5)

**What to verify**: Contextual photos appear in Farm Partnerships, About, and Consultation.

1. **Homepage — Farm Partnerships section**: Scroll past the service split. Confirm the Farm Partnerships section shows farm workers in a green field — not a plain colour background. Text content ("Sustainable Productivity", etc.) remains readable over or beside the photo.

2. **About page (`/about`) — Mission/Values area**: Confirm a photo of African hands forming a star is visible alongside or near the mission/values content. Photo does not obscure any text.

3. **Consultation page (`/consultation`)**: Confirm a business handshake photo appears at the top of the page (in the header/hero area) alongside or behind the page title.

4. **Responsive check**: View all three sections at mobile width. Photos are visible and text remains readable on all three.

5. **Broken image check**: DevTools → disable image loading. Confirm all four sections (hero + 3 supporting) show alt text or graceful fallbacks — no layout collapse.

---

## Regression Check

After all stories are complete:

1. Run `npx playwright test` (all 4 browsers). Confirm:
   - All pre-existing tests still pass.
   - New assertions for logo, colours, and product photos also pass.

2. `grep -r "brand-green\|brand-gold\|brand-green-light" src/` — confirm zero results (complete token migration).

3. `grep -r "#2D6A4F\|#D4A017\|#52B788\|#8B5E3C" src/ tailwind.config.ts` — confirm zero results.

4. Visual check of all 5 pages at 1280px and 375px widths — no layout regressions.
