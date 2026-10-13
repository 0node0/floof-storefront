import type { MedusaCollection } from "./medusa"

export type CollectionThemeId = "floof" | "dogs" | "reads" | "desk"
export type HeroVariant = "floof" | "dogs" | "reads" | "desk"
export type CardVariant = "floof" | "dogs" | "reads" | "desk"

export interface ThemeFonts {
  display: { family: string; googleParam: string }
  body: { family: string; googleParam: string }
  mono?: { family: string; googleParam: string }
}

export interface ThemeHeroAssets {
  imageBase: string
  imageAlt: string
}

export interface CollectionTheme {
  id: CollectionThemeId
  label: string
  fonts: ThemeFonts
  cssVars: Record<string, string>
  heroVariant: HeroVariant
  cardVariant: CardVariant
  themeColor: string
  hero: ThemeHeroAssets
}

export const FLOOF_THEME_FONTS: ThemeFonts = {
  display: {
    family: '"Archivo Black", "Arial Black", Impact, system-ui, sans-serif',
    googleParam: "Archivo+Black",
  },
  body: {
    family: '"IBM Plex Mono", ui-monospace, monospace',
    googleParam: "IBM+Plex+Mono:wght@400;500;600",
  },
  mono: {
    family: '"IBM Plex Mono", ui-monospace, monospace',
    googleParam: "IBM+Plex+Mono:wght@400;500;600",
  },
}

const HANDLE_THEME: Record<string, CollectionThemeId> = {
  dogs: "dogs",
  pets: "dogs",
  reads: "reads",
  desk: "desk",
}

const DOGS_VARS: Record<string, string> = {
  "--color-paper": "oklch(97% 0.02 92)",
  "--color-paper-2": "oklch(94% 0.03 88)",
  "--color-paper-3": "oklch(88% 0.04 85)",
  "--color-ink": "oklch(28% 0.05 55)",
  "--color-ink-2": "oklch(42% 0.04 55)",
  "--color-muted": "oklch(52% 0.03 60)",
  "--color-accent": "oklch(58% 0.17 42)",
  "--color-accent-deep": "oklch(46% 0.15 40)",
  "--color-accent-soft": "oklch(58% 0.17 42 / 0.16)",
  "--color-accent-ink": "oklch(98% 0.01 95)",
  "--color-secondary": "oklch(72% 0.12 85)",
  "--color-cream": "oklch(99% 0.015 95)",
  "--color-focus": "oklch(42% 0.14 42)",
  "--color-surface": "oklch(94% 0.03 88)",
  "--theme-radius-card": "0.35rem",
  "--theme-rule": "2px",
}

const READS_VARS: Record<string, string> = {
  "--color-paper": "oklch(95% 0.025 88)",
  "--color-paper-2": "oklch(92% 0.03 86)",
  "--color-paper-3": "oklch(86% 0.035 84)",
  "--color-ink": "oklch(22% 0.06 28)",
  "--color-ink-2": "oklch(38% 0.05 30)",
  "--color-muted": "oklch(48% 0.03 35)",
  "--color-accent": "oklch(40% 0.14 25)",
  "--color-accent-deep": "oklch(32% 0.12 25)",
  "--color-accent-soft": "oklch(40% 0.14 25 / 0.12)",
  "--color-accent-ink": "oklch(96% 0.02 90)",
  "--color-secondary": "oklch(52% 0.08 145)",
  "--color-cream": "oklch(98% 0.02 92)",
  "--color-focus": "oklch(38% 0.14 25)",
  "--color-surface": "oklch(92% 0.03 86)",
  "--theme-radius-card": "0.15rem",
  "--theme-rule": "2px",
}

const DESK_VARS: Record<string, string> = {
  "--color-paper": "oklch(18% 0.025 265)",
  "--color-paper-2": "oklch(22% 0.03 262)",
  "--color-paper-3": "oklch(28% 0.035 258)",
  "--color-ink": "oklch(96% 0.01 95)",
  "--color-ink-2": "oklch(78% 0.02 95)",
  "--color-muted": "oklch(58% 0.02 260)",
  "--color-accent": "oklch(78% 0.14 165)",
  "--color-accent-deep": "oklch(62% 0.12 165)",
  "--color-accent-soft": "oklch(78% 0.14 165 / 0.18)",
  "--color-accent-ink": "oklch(16% 0.03 265)",
  "--color-secondary": "oklch(68% 0.1 290)",
  "--color-cream": "oklch(94% 0.02 95)",
  "--color-focus": "oklch(78% 0.14 165)",
  "--color-surface": "oklch(22% 0.03 262)",
  "--theme-radius-card": "0.5rem",
  "--theme-rule": "2px",
}

const THEMES: Record<CollectionThemeId, CollectionTheme> = {
  floof: {
    id: "floof",
    label: "Floof",
    fonts: FLOOF_THEME_FONTS,
    cssVars: {},
    heroVariant: "floof",
    cardVariant: "floof",
    themeColor: "#1a1524",
    hero: { imageBase: "", imageAlt: "" },
  },
  dogs: {
    id: "dogs",
    label: "Dogs",
    fonts: {
      display: {
        family: '"Bricolage Grotesque", "Arial Black", system-ui, sans-serif',
        googleParam: "Bricolage+Grotesque:opsz,wght@12..96,700;800",
      },
      body: {
        family: '"Nunito", system-ui, sans-serif',
        googleParam: "Nunito:wght@400;600;700",
      },
      mono: {
        family: '"IBM Plex Mono", ui-monospace, monospace',
        googleParam: "IBM+Plex+Mono:wght@500;600",
      },
    },
    cssVars: DOGS_VARS,
    heroVariant: "dogs",
    cardVariant: "dogs",
    themeColor: "#f5efe4",
    hero: {
      imageBase: "/collections/dogs/hero",
      imageAlt: "Dog person lounging with a mug and a very good dog",
    },
  },
  reads: {
    id: "reads",
    label: "Reads",
    fonts: {
      display: {
        family: '"Libre Baskerville", Georgia, serif',
        googleParam: "Libre+Baskerville:wght@400;700",
      },
      body: {
        family: '"Source Serif 4", Georgia, serif',
        googleParam: "Source+Serif+4:opsz,wght@8..60,400;600",
      },
      mono: {
        family: '"IBM Plex Mono", ui-monospace, monospace',
        googleParam: "IBM+Plex+Mono:wght@500",
      },
    },
    cssVars: READS_VARS,
    heroVariant: "reads",
    cardVariant: "reads",
    themeColor: "#f3ebe0",
    hero: {
      imageBase: "/collections/reads/hero",
      imageAlt: "Reader with a stack of books and a Floof tee",
    },
  },
  desk: {
    id: "desk",
    label: "Desk",
    fonts: {
      display: {
        family: '"Space Grotesk", system-ui, sans-serif',
        googleParam: "Space+Grotesk:wght@500;700",
      },
      body: {
        family: '"IBM Plex Sans", system-ui, sans-serif',
        googleParam: "IBM+Plex+Sans:wght@400;500;600",
      },
      mono: {
        family: '"IBM Plex Mono", ui-monospace, monospace',
        googleParam: "IBM+Plex+Mono:wght@400;500;600",
      },
    },
    cssVars: DESK_VARS,
    heroVariant: "desk",
    cardVariant: "desk",
    themeColor: "#1c2230",
    hero: {
      imageBase: "/collections/desk/hero",
      imageAlt: "Work-from-home desk with coffee and a muted video call",
    },
  },
}

function isThemeId(value: unknown): value is CollectionThemeId {
  return value === "floof" || value === "dogs" || value === "reads" || value === "desk"
}

export function getCollectionTheme(id: CollectionThemeId): CollectionTheme {
  return THEMES[id]
}

export function resolveCollectionTheme(
  collection: MedusaCollection
): CollectionTheme {
  const meta = collection.metadata ?? {}
  const rawTheme = meta.theme
  if (typeof rawTheme === "string") {
    const trimmed = rawTheme.trim().toLowerCase()
    if (isThemeId(trimmed)) {
      return THEMES[trimmed]
    }
  }
  const fromHandle = HANDLE_THEME[collection.handle]
  if (fromHandle) return THEMES[fromHandle]
  return THEMES.floof
}

export function buildGoogleFontsHref(theme: CollectionTheme): string {
  const families = new Set<string>([
    FLOOF_THEME_FONTS.display.googleParam,
    FLOOF_THEME_FONTS.body.googleParam,
  ])
  if (theme.id !== "floof") {
    families.add("Caveat:wght@500;600;700")
  }
  if (theme.fonts.display.googleParam !== FLOOF_THEME_FONTS.display.googleParam) {
    families.add(theme.fonts.display.googleParam)
  }
  if (theme.fonts.body.googleParam !== FLOOF_THEME_FONTS.body.googleParam) {
    families.add(theme.fonts.body.googleParam)
  }
  if (
    theme.fonts.mono?.googleParam &&
    theme.fonts.mono.googleParam !== FLOOF_THEME_FONTS.mono?.googleParam
  ) {
    families.add(theme.fonts.mono.googleParam)
  }
  const familyQuery = [...families]
    .map((f) => `family=${f}`)
    .join("&")
  return `https://fonts.googleapis.com/css2?${familyQuery}&display=swap`
}

export function themeStyleAttribute(theme: CollectionTheme): string {
  const vars: Record<string, string> = {
    "--font-display": theme.fonts.display.family,
    "--font-body": theme.fonts.body.family,
    "--font-sans": theme.fonts.body.family,
    "--font-mono": theme.fonts.mono?.family ?? theme.fonts.body.family,
    ...theme.cssVars,
  }
  return Object.entries(vars)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ")
}

export const DEFAULT_GOOGLE_FONTS_HREF = buildGoogleFontsHref(THEMES.floof)
