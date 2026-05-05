# UI Contract: Logo Component

**Component**: `src/components/ui/Logo.tsx`  
**Purpose**: Renders the official Africom International SVG logo in the correct variant for the background context — used in Header (full-colour) and Footer (white/inverse).

---

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `"full-color"` \| `"white"` | Yes | — | Selects the logo asset variant. `"full-color"` for light backgrounds; `"white"` for dark backgrounds. |
| `width` | `number` | No | `160` | Rendered width in pixels |
| `height` | `number` | No | `48` | Rendered height in pixels (maintains aspect ratio with CSS) |
| `className` | `string` | No | `""` | Additional CSS classes for positioning/sizing overrides |

---

## Behaviour

- Renders an `<img>` tag pointing to the SVG file for the selected `variant`.
- `alt` is always `"Africom International Ltd"` — not a prop (non-negotiable accessibility requirement from FR-006).
- `width` and `height` are passed as HTML attributes to prevent layout shift.
- The component does not handle click/navigation — the parent (`Header`, `Footer`) wraps it in a `<Link>` if needed.

---

## Asset Paths

| Variant | SVG path | PNG fallback |
|---------|----------|-------------|
| `full-color` | `/logos/africom-full-color.svg` | `/logos/africom-full-color.png` |
| `white` | `/logos/africom-white.svg` | `/logos/africom-white.png` |

---

## Usage Examples

**Header (light background)**:
```
<Link href="/" aria-label="Africom International — Home">
  <Logo variant="full-color" width={160} height={48} />
</Link>
```

**Footer (dark background)**:
```
<Logo variant="white" width={140} height={42} />
```

---

## Acceptance Criteria

- Given `variant="full-color"`, the component renders an `<img>` with `src="/logos/africom-full-color.svg"`.
- Given `variant="white"`, the component renders an `<img>` with `src="/logos/africom-white.svg"`.
- `alt` attribute is always `"Africom International Ltd"` regardless of variant.
- If `className` is provided, it is applied to the `<img>` element.
- The component renders no wrapper element — `<img>` is the root element.
