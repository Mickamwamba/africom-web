# Implementation Plan: Brand Assets & Visual Identity

**Branch**: `003-brand-assets` | **Date**: 2026-05-05 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/003-brand-assets/spec.md`

## Summary

Replace the site's placeholder colour tokens, text-only logo, and image-free layouts with the official Africom brand palette (`#4F3727` Earth Brown, `#B2B54A` Organic Green), the official SVG logo variants (full-colour for light backgrounds, white/inverse for dark), and 9 curated photographs from the `africomassets/` library — 5 product photos on the exports page and 4 contextual section photos across the homepage, about, and consultation pages.

The approach is: update the Tailwind colour token definitions first (one file change that propagates across all components), then copy assets into `public/`, then update components one story at a time. No new abstractions or dependencies are introduced — the existing `next/image` component is used for all photographs, and a simple `<img>` tag with `width`/`height` handles the SVG logo.

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: Next.js 14 (App Router), Tailwind CSS v3, `next/image` (built-in)  
**Storage**: Static files in `public/` — no database  
**Testing**: Playwright E2E (existing suite in `tests/e2e/`)  
**Target Platform**: Web — all browsers, responsive (mobile 375px, tablet 768px, desktop 1280px)  
**Project Type**: Web application (single Next.js project)  
**Performance Goals**: Hero LCP < 2.5s on standard connection; zero CLS on product card image load  
**Constraints**: All assets must be served from `public/` (no external image hosting); iStock files excluded; SVG logos must not require SVGR configuration change  
**Scale/Scope**: 5-page website; 16 component/page files affected by colour token rename; 9 new image assets

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I — Specification-First | ✅ PASS | Spec complete at `specs/003-brand-assets/spec.md` |
| II — User-Centric | ✅ PASS | All requirements expressed in terms of user/visitor outcomes |
| III — Test-Driven | ✅ PASS | E2E tests updated to assert real logo/colour/photo presence before implementation |
| IV — Incremental Delivery | ✅ PASS | Each of the 5 user stories (colours, logo, products, hero, sections) is independently implementable and testable |
| V — Simplicity | ✅ PASS | No new libraries, abstractions, or patterns introduced; direct token + asset replacement |

**Complexity Tracking**: No violations — no entry required.

## Colour Token Mapping

The existing `tailwind.config.ts` defines tokens under `theme.extend.colors.brand`. This is the authoritative mapping for the rename:

| Old token | Old hex | New token | New hex | Rationale |
|-----------|---------|-----------|---------|-----------|
| `brand-green` | `#2D6A4F` | `brand-earth-brown` | `#4F3727` | Official primary colour |
| `brand-gold` | `#D4A017` | `brand-organic-green` | `#B2B54A` | Official secondary colour |
| `brand-green-light` | `#52B788` | `brand-organic-green` | `#B2B54A` | Merge — light hover accent replaced by official secondary |
| `brand-earth` | `#8B5E3C` | `brand-earth-brown` | `#4F3727` | Earth tones unified under official primary |
| `brand-cream` | `#F5F0E8` | `brand-cream` | `#F5F0E8` | Keep — neutral background, consistent with brand earth tones |

**Class rename implications** (project-wide find-and-replace required):
- `text-brand-green` → `text-brand-earth-brown`
- `bg-brand-green` → `bg-brand-earth-brown`
- `border-brand-green` → `border-brand-earth-brown`
- `focus:ring-brand-green` → `focus:ring-brand-earth-brown`
- `hover:text-brand-green` → `hover:text-brand-earth-brown`
- `text-brand-gold` → `text-brand-organic-green`
- `bg-brand-gold` → `bg-brand-organic-green`
- `border-brand-gold` → `border-brand-organic-green`
- `hover:text-brand-gold` → `hover:text-brand-organic-green`
- `focus:ring-brand-gold` → `focus:ring-brand-organic-green`
- `text-brand-green-light` / `hover:text-brand-green-light` → `text-brand-organic-green` / `hover:text-brand-organic-green`
- `hover:bg-brand-cream` → unchanged
- `text-brand-earth` → `text-brand-earth-brown`
- `bg-brand-cream` → unchanged

## Logo Integration

**Approach**: Plain `<img>` tag with explicit `width` and `height` attributes. `next/image` can handle SVG with `unoptimized` but adds no benefit for a logo (vector files don't benefit from the image optimisation pipeline). A standard `<img>` tag avoids any configuration change and renders the SVG at full quality at all sizes.

**Source files** (from `africomassets/logos/`):
- Light backgrounds (header): `Africom International_Primary Logo_Full Color.svg`
- Dark backgrounds (footer): `Africom International_Primary Logo_White.svg`
- PNG fallbacks: same names with `.png` extension

**Logo component**: A dedicated `src/components/ui/Logo.tsx` component accepts a `variant` prop (`"full-color"` | `"white"`) and renders the correct asset. This avoids duplicating the asset path in both Header and Footer.

**Asset destination**: `public/logos/africom-full-color.svg`, `public/logos/africom-white.svg` (and `.png` equivalents). Filenames are simplified for predictable paths.

## Image Integration

**Product card photos** — approach: add an `image` field to the `ProductCategory` type in `src/content/products.ts` (optional, `string | undefined`). Each product entry gets a photo path. `ProductCategoryCard` renders a `next/image` in a `relative aspect-[4/3]` wrapper at the top of the card. The `sizes` prop is set to `"(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`.

**Section photos** — approach: `next/image` with `fill` inside a `relative` wrapper with explicit height class. Used in:
- `HeroSection.tsx` — `min-h-[480px]` relative wrapper; text content on top with a semi-transparent dark gradient overlay for legibility; `priority` prop on the image.
- `FarmPartnershipsSection.tsx` — section-level background image with overlay, or a dedicated image column alongside text.
- `src/app/about/page.tsx` — image alongside the mission/values section.
- `src/app/consultation/page.tsx` — image at the top of the services introduction.

**Asset destination**: `public/images/products/` (5 files) and `public/images/sections/` (4 files).

**Photo file assignments**:
| Destination | Source file | Public path |
|-------------|-------------|-------------|
| Avocado product | `eddie-pipocas-Utnc4nbYFKo-unsplash.jpg` | `/images/products/avocado.jpg` |
| Green Bean product | `erwan-hesry-1q75BReKpms-unsplash.jpg` | `/images/products/green-bean.jpg` |
| Ginger product | `markus-spiske-sFydXGrt5OA-unsplash.jpg` | `/images/products/ginger.jpg` |
| Garlic product | `gabriel-jimenez-jin4W1HqgL4-unsplash.jpg` | `/images/products/garlic.jpg` |
| Capsicum product | `martin-adams-_LGlGi3KJIA-unsplash.jpg` | `/images/products/capsicum.jpg` |
| Hero (homepage) | `federico-respini-sYffw0LNr7s-unsplash.jpg` | `/images/sections/hero.jpg` |
| Farm Partnerships | `tim-mossholder-xDwEa2kaeJA-unsplash.jpg` | `/images/sections/farm-partnerships.jpg` |
| About page | `iwaria-inc-1Wr4U5yRw2M-unsplash.jpg` | `/images/sections/about-community.jpg` |
| Consultation page | `cytonn-photography-n95VMLxqM2I-unsplash.jpg` | `/images/sections/consultation.jpg` |

## Project Structure

### Documentation (this feature)

```text
specs/003-brand-assets/
├── plan.md              # This file
├── research.md          # Technical decisions and rationale
├── data-model.md        # Brand token + asset entity definitions
├── quickstart.md        # Manual verification scenarios
├── contracts/
│   └── logo-component.md  # UI contract for Logo component
└── tasks.md             # Generated by /speckit-tasks
```

### Source Code Changes

```text
public/
├── logos/
│   ├── africom-full-color.svg   # Header logo (light backgrounds)
│   ├── africom-full-color.png   # PNG fallback
│   ├── africom-white.svg        # Footer logo (dark backgrounds)
│   └── africom-white.png        # PNG fallback
└── images/
    ├── products/
    │   ├── avocado.jpg
    │   ├── green-bean.jpg
    │   ├── ginger.jpg
    │   ├── garlic.jpg
    │   └── capsicum.jpg
    └── sections/
        ├── hero.jpg
        ├── farm-partnerships.jpg
        ├── about-community.jpg
        └── consultation.jpg

src/
├── components/
│   ├── ui/
│   │   └── Logo.tsx             # NEW — renders correct logo variant
│   ├── layout/
│   │   ├── Header.tsx           # UPDATED — use <Logo variant="full-color">
│   │   └── Footer.tsx           # UPDATED — use <Logo variant="white">
│   └── sections/
│       ├── HeroSection.tsx      # UPDATED — hero photo background + gradient overlay
│       ├── ProductCategoryCard.tsx  # UPDATED — renders product image
│       ├── FarmPartnershipsSection.tsx  # UPDATED — farm photo
│       └── ServiceSplitSection.tsx      # UPDATED — cargo ship trade photo
├── content/
│   └── products.ts              # UPDATED — add image field to ProductCategory type + data
└── app/
    ├── about/page.tsx           # UPDATED — community photo
    └── consultation/page.tsx    # UPDATED — handshake intro photo

tailwind.config.ts               # UPDATED — rename brand colour tokens
tests/e2e/                       # UPDATED — add assertions for logo img, photos visible
```

**Structure Decision**: Single Next.js project. No new packages added. All changes are within the existing `src/` tree plus new static assets in `public/`.
