# Research: Brand Assets & Visual Identity

## Decision 1: SVG Logo Rendering Approach

**Decision**: Use a plain `<img>` tag with explicit `width` and `height` attributes for SVG logos.

**Rationale**: `next/image` requires `dangerouslyAllowSVG: true` in `next.config.js` to serve SVG files, adding configuration complexity. Using `next/image` with `unoptimized` avoids the security flag but provides no optimisation benefit for vector files anyway. A plain `<img>` tag renders SVGs at perfect quality at all sizes, requires no configuration changes, and is idiomatic for logos (which are not content images that need responsive `srcset`). The SVG source is trusted (we own the official brand asset files), so the security concern that motivated the Next.js restriction does not apply.

**Alternatives considered**:
- `next/image` with `unoptimized`: Valid but adds prop noise with no benefit for vectors.
- SVGR (import SVG as React component): Powerful for styled/animated SVGs, but requires adding `@svgr/webpack` to the build config — over-engineering for a static logo display.
- Inline SVG: Maximum control, but embeds the full SVG markup in the HTML of every page — increases HTML payload unnecessarily for a fixed-size logo.

---

## Decision 2: Tailwind Brand Colour Token Strategy

**Decision**: Rename existing tokens in `tailwind.config.ts` rather than adding new ones alongside old ones.

**Rationale**: Adding new tokens alongside old ones would leave dead code and create ambiguity about which palette to use. A clean rename forces all component files to be updated in one pass, leaving no mixed-palette code. This is a one-time migration with a clear before/after state. The rename is mechanical (find-and-replace), low risk, and the diff is reviewable.

**Token mapping**:
- `brand-green` (#2D6A4F) → `brand-earth-brown` (#4F3727) — official primary
- `brand-gold` (#D4A017) → `brand-organic-green` (#B2B54A) — official secondary
- `brand-green-light` (#52B788) → `brand-organic-green` (#B2B54A) — merge into official secondary
- `brand-earth` (#8B5E3C) → `brand-earth-brown` (#4F3727) — merge into official primary
- `brand-cream` (#F5F0E8) → `brand-cream` (unchanged) — neutral background, not in guidelines but consistent

**Alternatives considered**:
- Add new tokens and deprecate old ones gradually: More cautious but creates a two-palette period where visual consistency degrades.
- Use CSS custom properties directly: Bypasses Tailwind and loses the utility-class-based workflow the project already uses.

---

## Decision 3: Product Card Image Integration

**Decision**: Add an optional `image?: string` field to the `ProductCategory` interface in `src/content/products.ts`. Render in `ProductCategoryCard` as a `next/image` with `fill` mode inside a `relative aspect-[4/3]` container at the top of the card.

**Rationale**: The optional field means cards without images degrade gracefully (the image area is simply not rendered) — this is important for the Green Bean, Ginger, and Garlic stand-in photos, which may be replaced in future. Using `fill` with an aspect-ratio container avoids needing to know photo dimensions ahead of time and prevents CLS. The `aspect-[4/3]` ratio works well for agricultural product photos, which are generally wider than tall.

**`sizes` prop**: `"(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"` — matches the exports page's responsive grid (single column on mobile, 2-column on tablet, 3-column on desktop).

**Alternatives considered**:
- Hardcoded `width`/`height`: Would require knowing each photo's exact pixel dimensions and risks distortion.
- CSS background-image on the card: Loses `next/image` optimisation (WebP conversion, lazy loading, responsive srcset).

---

## Decision 4: Hero Photo Integration

**Decision**: Restructure `HeroSection.tsx` to wrap the section in a `relative` container with `min-h-[480px]`. Use `next/image` with `fill`, `objectFit="cover"`, and `priority` for the background photo. Overlay a semi-transparent dark gradient (`from-black/60 to-transparent`) using an absolutely-positioned `div` to maintain text legibility. Text content sits above the overlay with `relative z-10`.

**Rationale**: `next/image fill` in a `relative` container is the standard Next.js 14 pattern for hero backgrounds — it enables the full optimisation pipeline (WebP, responsive srcset, priority loading) which is critical for the hero as the Largest Contentful Paint element. The `priority` prop eliminates the lazy-loading delay for above-the-fold images. A gradient overlay ensures the white tagline text is legible over the golden field photo without hardcoding text colours per-photo.

**Alternatives considered**:
- CSS `background-image`: Loses all Next.js image optimisation — not acceptable for the LCP element.
- Full `min-h-screen` hero: Considered but `min-h-[480px]` provides sufficient visual impact while keeping other homepage sections accessible without excessive scroll.

---

## Decision 5: Section Photo Placement

**Decision**: Each of the 4 section photos (Farm Partnerships, About, Consultation, trade block) is rendered as a `next/image` in a `relative` wrapper alongside existing text content — either as a full-width section background with overlay, or as a 50/50 split layout (image left, text right on desktop; stacked on mobile).

**Rationale**: Adding photos alongside existing text (rather than replacing text with photos) preserves all existing content while adding visual depth. The split layout is the most common pattern for these section types and works at all viewport sizes with Tailwind's responsive grid.

**For FarmPartnershipsSection specifically**: The section already uses a full-width background colour (`bg-brand-green`). The farm workers photo replaces this with a photo background + overlay — maintaining the dark visual treatment while adding authenticity.

---

## Decision 6: Asset File Naming in `public/`

**Decision**: Copy assets to `public/logos/` and `public/images/products/` and `public/images/sections/` with simplified, predictable names (e.g., `avocado.jpg` rather than the full Unsplash filename).

**Rationale**: Unsplash filenames include the photographer's ID hash, making them opaque and hard to maintain. Simplified names make the association between product/section and asset immediately clear in the codebase. The original filenames are documented in the plan and spec for attribution.

**Alternatives considered**:
- Keep original Unsplash filenames: Preserves attribution in the path but creates long, confusing import strings throughout the codebase.
- Use `next/image` remote URLs from Unsplash CDN: Requires `next.config.js` hostname allowlist and introduces an external dependency — against the spec requirement for local asset hosting.
