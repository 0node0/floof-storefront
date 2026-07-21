# Design — Floof

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

/* Hallmark · genre: playful · theme: custom (SWFL sun splash) · designed-as-app */

## Genre
playful — bright, cheerful, hip coastal consumer. Not muted atelier. Not Claude-brown.

## Macrostructure family
- Marketing pages (`/`, `/about`): Photographic fold + Catalogue product grids
- App / shop pages (`/store`, PDP, checkout): Catalogue / Workbench
- Content pages (shipping, legal, contact): Long Document

## Theme
Custom *tuned* — vibe: **"SWFL sun splash · hip Gulf Coast"**

| Token | Value | Role |
| --- | --- | --- |
| paper | `oklch(99% 0.01 100)` | Bright beach white |
| paper-2 | `oklch(96.5% 0.035 95)` | Pale sand |
| paper-3 | `oklch(93% 0.05 90)` | Warm sand depth |
| ink | `oklch(24% 0.045 250)` | Deep gulf navy |
| ink-2 | `oklch(40% 0.035 245)` | Secondary text |
| accent | `oklch(66% 0.21 25)` | Hot sunset coral |
| accent-deep | `oklch(54% 0.19 22)` | Button edge |
| secondary | `oklch(68% 0.13 210)` | Gulf aqua |
| sun | `oklch(88% 0.16 95)` | Lemon highlight |
| mint | `oklch(78% 0.13 155)` | Palm accent |

Legacy `floof-*` Tailwind aliases map onto these.

## Typography
- Display: **Outfit** 700–800, tracking -0.03em (geometric, hip)
- Body: **DM Sans** 400/500
- Mono labels: **DM Mono** 500–600
- Accent headline treatment: intentional coral→mango→lemon gradient (`.text-floof-gradient`)

## Spacing
4-point named scale in `tokens.css`.

## Motion
- Hover lift + press CTAs
- Cart fly + celebration (loud, intentional)
- Reduced-motion respected

## CTA voice
- Primary: hot coral push button, white label, deep-coral edge
- Secondary: outline navy/coral hover
- Soft: sand face

## What pages MUST share
- Wordmark **Floof** in Outfit, coral
- Coral + aqua + lemon accents (multi-accent playful, not single muted clay)
- Bright paper; deep navy ink (not espresso brown)
- CTA push buttons

## Axes (custom)
light / geometric-sans / warm-coral + gulf-aqua
