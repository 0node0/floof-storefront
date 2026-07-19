# Design — Floof

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

/* Hallmark · genre: playful · theme: custom (sun-warm atelier) · designed-as-app */

## Genre
playful (warm, friendly) with craft / boutique restraint — not toy-app loud.

## Macrostructure family
- Marketing pages (`/`, `/about`): Photographic fold + Catalogue product grids
- App / shop pages (`/store`, PDP, checkout): Catalogue / Workbench
- Content pages (shipping, legal, contact): Long Document

## Theme
Custom *tuned* — vibe: **"sun-warm atelier · Gulf Coast boutique"**

- `--color-paper`     oklch(97.5% 0.012 75)
- `--color-paper-2`   oklch(94% 0.018 72)
- `--color-paper-3`   oklch(90% 0.024 68)
- `--color-ink`       oklch(22% 0.02 45)
- `--color-ink-2`     oklch(42% 0.018 50)
- `--color-rule`      oklch(78% 0.012 70)
- `--color-accent`    oklch(62% 0.14 38)   /* terracotta clay */
- `--color-accent-deep` oklch(48% 0.12 35)
- `--color-accent-soft` oklch(88% 0.06 55)
- `--color-secondary` oklch(58% 0.08 210) /* gulf blue — links/trust */
- `--color-sun`       oklch(84% 0.12 85)  /* soft gold highlight */
- `--color-focus`     oklch(55% 0.14 38)

Legacy Tailwind aliases (`floof-*`) map onto these values so the whole app
shares one system.

## Typography
- Display: **Fraunces** 600, style normal, tracking -0.02em
- Body: **DM Sans** 400/500
- Mono labels: **DM Mono** 400/500 (size tags, craft labels)
- Type scale anchor: `--text-display` = clamp(2.5rem, 5vw + 1rem, 4.25rem)

## Spacing
4-point named scale in `tokens.css`. Prefer named tokens; Tailwind spacing utilities OK.

## Motion
- Easings: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`; press: `cubic-bezier(0.2, 0.7, 0.3, 1)`
- Hover lift on cards/buttons only; press-down on primary CTA
- Reduced-motion: opacity-only, ≤ 150 ms

## Microinteractions stance
- Silent success on add-to-cart (inline confirmation, not toast fireworks)
- Hover delay N/A on primary; focus-visible ring instant
- No glassmorphism, no gradient text, no emoji ornament

## CTA voice
- Primary: `.btn` push button — terracotta face, solid edge shadow, cream/ink contrast, pill radius
- Secondary: `.btn--outline` hairline ink/accent, soft fill on hover
- Soft: `.btn--soft` paper-2 face, no hard edge

## Per-page allowances
- Marketing pages MAY use product photography and Tier-A CSS craft marks
- App / shop pages: function first; cards + filters + buy box
- Content pages: typography only

## What pages MUST share
- Wordmark **FLOOF** in display face (Fraunces) or bold tracked body
- Terracotta accent placement (≤ ~5% of viewport as solid fill)
- Display + body fonts
- CTA voice (btn system)
- Warm paper backgrounds; no pure #000 / #fff

## What pages MAY differ on
- Hero shape (photographic vs masthead vs quiet document)
- Section band tints (paper vs paper-2 vs ink strip for announcement only)
- Enrichment on marketing only

## Axes (custom)
light / classical-serif-display + humanist-sans / warm-terracotta

## Exports

### tokens.css
See project-root `tokens.css`.

### Tailwind v4 `@theme`
See `src/styles/global.css` — `floof-*` aliases + semantic tokens.
