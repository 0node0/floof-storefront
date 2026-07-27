# Design — Floof

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

/* Hallmark · genre: editorial · theme: custom (risograph zine / late-night print shop) · designed-as-app */

## Genre
**Editorial · risograph zine** — late-night print-shop energy. Loud type, hard rules, magenta + cyan on ink.

## Macrostructure family
- Marketing (`/`, `/about`): Manifesto + Lookbook
- Shop / PDP / checkout: Catalogue / Workbench with slab chrome
- Content (shipping, legal, contact): Long Document on ink paper

## Theme
Custom *tuned* — vibe: **"ink, magenta, cyan, SWFL heat on paper"**

| Token | Value | Role |
| --- | --- | --- |
| paper | `oklch(14% 0.02 280)` | Near-black ink field |
| paper-2 | `oklch(18% 0.025 275)` | Raised ink |
| paper-3 | `oklch(24% 0.03 270)` | Depth |
| ink | `oklch(96% 0.01 95)` | Cream type on ink |
| ink-2 | `oklch(78% 0.02 95)` | Secondary type |
| cream | `oklch(94% 0.03 95)` | Light slabs / product frames |
| accent | `oklch(68% 0.28 350)` | Magenta |
| accent-deep | `oklch(52% 0.24 350)` | Magenta edge |
| secondary | `oklch(78% 0.14 210)` | Cyan labels / links |

Legacy `floof-*` aliases map onto these (dark site).

## Typography
- Display: **Archivo Black** (roman, uppercase friendly)
- Body / UI: **IBM Plex Mono** 400/500/600
- No Fraunces, no Outfit, no gradient text

## Spacing
4-point named scale in `tokens.css`. Hard **3px** rules for chrome.

## Motion
- Offset-shadow press on CTAs (`translate` + cast cyan/magenta)
- Soft add-to-cart confirm only
- Reduced-motion respected

## CTA voice
- Primary: magenta fill, thick border, offset shadow on hover
- Ghost: transparent + cream/ink border
- Ink invert: cream face on dark panels

## What pages MUST share
- Wordmark **Floof** in Archivo Black on magenta slab (nav)
- 3px cream/ink rules
- Magenta + cyan accents only (no coral-clay, no multi-sun splash)
- Dark paper default

## Axes
dark / display-heavy / chromatic-other (magenta)
