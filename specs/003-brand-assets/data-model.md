# Data Model: Brand Assets & Visual Identity

## Overview

This feature introduces no new database entities or API data. The "data model" here describes the static configuration entities — brand colour tokens, logo asset variants, and photo-to-location mappings — that are defined in source files and used across the component tree.

---

## Entity 1: BrandColorToken

A named colour variable defined in `tailwind.config.ts` that maps a semantic name to an official hex value. Referenced by Tailwind utility classes throughout all component files.

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Semantic token name (e.g., `brand-earth-brown`) |
| `hex` | string | Official hex colour value (e.g., `#4F3727`) |
| `usage` | string | Primary usage context |

**Token registry** (post-migration):

| Token name | Hex | Usage context |
|------------|-----|---------------|
| `brand-earth-brown` | `#4F3727` | Primary brand colour — primary buttons, active nav, headings, section backgrounds |
| `brand-organic-green` | `#B2B54A` | Secondary brand colour — secondary buttons, accents, hover states, consultation elements |
| `brand-cream` | `#F5F0E8` | Neutral background — light section backgrounds, tag backgrounds |

**Removed tokens** (no longer defined after migration):
- `brand-green` (#2D6A4F)
- `brand-gold` (#D4A017)
- `brand-green-light` (#52B788)
- `brand-earth` (#8B5E3C)

---

## Entity 2: LogoAsset

An SVG (with PNG fallback) of the official Africom International logo. Two variants are defined — one per background context.

| Field | Type | Description |
|-------|------|-------------|
| `variant` | `"full-color"` \| `"white"` | Determines which asset file to use |
| `svgPath` | string | Path within `public/` to the SVG file |
| `pngPath` | string | Path within `public/` to the PNG fallback |
| `altText` | string | Always `"Africom International Ltd"` |
| `backgroundContext` | `"light"` \| `"dark"` | Which background the variant is designed for |

**Variant registry**:

| Variant | SVG path | PNG path | Background |
|---------|----------|----------|------------|
| `full-color` | `/logos/africom-full-color.svg` | `/logos/africom-full-color.png` | Light (header) |
| `white` | `/logos/africom-white.svg` | `/logos/africom-white.png` | Dark (footer) |

**Source files** (in `africomassets/logos/`):
- `Africom International_Primary Logo_Full Color.svg` → `africom-full-color.svg`
- `Africom International_Primary Logo_Full Color.png` → `africom-full-color.png`
- `Africom International_Primary Logo_White.svg` → `africom-white.svg`
- `Africom International_Primary Logo_White.png` → `africom-white.png`

---

## Entity 3: ProductPhoto

A photograph paired to a specific product, stored in `public/images/products/` and referenced from the `ProductCategory` content type.

| Field | Type | Description |
|-------|------|-------------|
| `productId` | string | Matches `ProductCategory.id` in `src/content/products.ts` |
| `path` | string | Public URL path served by Next.js |
| `altText` | string | Descriptive alt text for accessibility |
| `sourceFile` | string | Original filename from `africomassets/Photos/` (for attribution) |
| `notes` | string? | Optional note if this is a stand-in photo |

**Product photo registry**:

| Product ID | Public path | Alt text | Source file | Stand-in? |
|------------|-------------|----------|-------------|-----------|
| `avocado` | `/images/products/avocado.jpg` | Fresh Tanzanian avocados | `eddie-pipocas-Utnc4nbYFKo-unsplash.jpg` | No |
| `green-bean` | `/images/products/green-bean.jpg` | Green bean crops growing in a greenhouse | `erwan-hesry-1q75BReKpms-unsplash.jpg` | Yes — no direct green bean photo available |
| `ginger` | `/images/products/ginger.jpg` | Agricultural crops being irrigated | `markus-spiske-sFydXGrt5OA-unsplash.jpg` | Yes — no ginger-specific photo available |
| `garlic` | `/images/products/garlic.jpg` | Rich Tanzanian agricultural soil | `gabriel-jimenez-jin4W1HqgL4-unsplash.jpg` | Yes — no garlic-specific photo available |
| `capsicum` | `/images/products/capsicum.jpg` | Colourful fresh capsicum peppers | `martin-adams-_LGlGi3KJIA-unsplash.jpg` | No |

**TypeScript interface extension** (in `src/content/products.ts`):
- Add `image?: string` to `ProductCategory` interface — optional so cards without images degrade gracefully.

---

## Entity 4: SectionPhoto

A contextual photograph placed in a specific page section to visually support that section's content. Stored in `public/images/sections/`.

| Field | Type | Description |
|-------|------|-------------|
| `sectionId` | string | Identifier for the site section |
| `path` | string | Public URL path |
| `altText` | string | Descriptive alt text |
| `page` | string | Which page/component hosts this photo |
| `placement` | string | How the photo is rendered (background, split-left, split-right) |
| `sourceFile` | string | Original filename from `africomassets/Photos/` |

**Section photo registry**:

| Section ID | Public path | Alt text | Page / Component | Placement | Source file |
|------------|-------------|----------|-----------------|-----------|-------------|
| `hero` | `/images/sections/hero.jpg` | Tanzanian grain fields at sunrise | `HeroSection.tsx` | Full-width background with gradient overlay | `federico-respini-sYffw0LNr7s-unsplash.jpg` |
| `farm-partnerships` | `/images/sections/farm-partnerships.jpg` | Farm workers harvesting crops | `FarmPartnershipsSection.tsx` | Full-width background with overlay | `tim-mossholder-xDwEa2kaeJA-unsplash.jpg` |
| `about-community` | `/images/sections/about-community.jpg` | Hands forming a star — community and collaboration | `src/app/about/page.tsx` | Split-right alongside mission text | `iwaria-inc-1Wr4U5yRw2M-unsplash.jpg` |
| `consultation` | `/images/sections/consultation.jpg` | Business partnership handshake | `src/app/consultation/page.tsx` | Split-right in the page header section | `cytonn-photography-n95VMLxqM2I-unsplash.jpg` |
