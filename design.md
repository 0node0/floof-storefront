# Design — Floof

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

/* Hallmark · genre: refined-playful · theme: custom (Gulf Coast boutique) · designed-as-app */

## Genre
**Refined playful** — witty coastal apparel with boutique restraint.
Balance of **fun · elegance · exclusivity**. Not toy-app loud. Not muted atelier-only.

## Macrostructure family
- Marketing pages (`/`, `/about`): Photographic fold + Catalogue product grids
- App / shop pages (`/store`, PDP, checkout): Catalogue / Workbench
- Content pages (shipping, legal, contact): Long Document

## Theme
Custom *tuned* — vibe: **"Gulf Coast boutique · sun-warm, not sun-splash"**

| Token | Value | Role |
| --- | --- | --- |
| paper | `oklch(98% 0.01 80)` | Warm gallery white |
| paper-2 | `oklch(95% 0.02 75)` | Soft sand |
| paper-3 | `oklch(91% 0.028 70)` | Sand depth |
| ink | `oklch(22% 0.025 50)` | Warm espresso-navy |
| ink-2 | `oklch(42% 0.02 50)` | Secondary text |
| accent | `oklch(58% 0.155 32)` | Refined coral-clay |
| accent-deep | `oklch(46% 0.14 30)` | Button edge |
| secondary | `oklch(52% 0.07 220)` | Quiet gulf blue |
| sun | `oklch(82% 0.1 85)` | Soft gold (sparing) |

One primary accent. Secondary and sun are support only — never a rainbow wash.

Legacy `floof-*` Tailwind aliases map onto these.

## Typography
- Display: **Fraunces** 500–600, tracking -0.02em (editorial, exclusive)
- Body: **DM Sans** 400/500
- Mono labels: **DM Mono** 500 (eyebrows, craft labels)
- Accent words: solid accent color — **no multi-stop gradient text**

## Spacing
4-point named scale in `tokens.css`.

## Motion
- Subtle hover lift + press on CTAs
- Add-to-cart: fly-to-cart + **one soft particle wave** + quiet confirm modal
- No site-wide sparkles, logo party, mood swaps, 3D tilt, magnetic buttons
- Reduced-motion respected (opacity-only ≤ 150ms)

## CTA voice
- Primary: refined push button — coral face, soft deep edge, white/cream label
- Secondary: outline ink, coral hover
- Soft: sand face

## Brand voice (copy)
- Fun: dry wit, never chaotic meme-speak
- Elegance: short, confident lines
- Exclusivity: made-to-order, small drops, printed fresh — not “main character energy”

## What pages MUST share
- Wordmark **Floof** in Fraunces, accent or ink
- Single coral accent (≤ ~5% solid fill of viewport)
- Warm paper; no pure #000 / #fff full fields
- CTA button system

## What pages MUST NOT do
- Floating stickers, vibe marquees, color-mood toys
- “Hell yeah” / chaos / poke-everywhere interactions
- Hot multi-accent sun-splash gradients as default chrome

## Axes (custom)
light / classical-serif-display + humanist-sans / warm-coral-clay
