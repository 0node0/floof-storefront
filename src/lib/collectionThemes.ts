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
  "--color-paper": "#F2ECDF",
  "--color-paper-2": "#FAF6EC",
  "--color-paper-3": "#EFE7D6",
  "--color-ink": "#2A3040",
  "--color-ink-2": "#434957",
  "--color-muted": "#4F5563",
  "--color-accent": "#2A3040",
  "--color-accent-deep": "#1e2430",
  "--color-accent-soft": "rgba(42, 48, 64, 0.12)",
  "--color-accent-ink": "#FAF6EC",
  "--color-secondary": "#7A3B32",
  "--color-cream": "#FAF6EC",
  "--color-focus": "#7A3B32",
  "--color-surface": "#EFE7D6",
  "--theme-radius-card": "0",
  "--theme-rule": "1px",
}

const DESK_VARS: Record<string, string> = {
  "--color-paper": "#EEF0EC",
  "--color-paper-2": "#FFFFFF",
  "--color-paper-3": "#E9ECE6",
  "--color-ink": "#263232",
  "--color-ink-2": "#3F4B4B",
  "--color-muted": "#4A5656",
  "--color-accent": "#263232",
  "--color-accent-deep": "#1a2222",
  "--color-accent-soft": "rgba(38, 50, 50, 0.12)",
  "--color-accent-ink": "#F6F7F4",
  "--color-secondary": "#55705B",
  "--color-cream": "#F6F7F4",
  "--color-focus": "#55705B",
  "--color-surface": "#E1E5DF",
  "--theme-radius-card": "0.875rem",
  "--theme-rule": "1px",
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
        family: '"Fredoka", system-ui, sans-serif',
        googleParam: "Fredoka:wght@500;600",
      },
      body: {
        family: '"Nunito", system-ui, sans-serif',
        googleParam: "Nunito:wght@400;600;700;800",
      },
      mono: {
        family: '"IBM Plex Mono", ui-monospace, monospace',
        googleParam: "IBM+Plex+Mono:wght@500;600",
      },
    },
    cssVars: DOGS_VARS,
    heroVariant: "dogs",
    cardVariant: "dogs",
    themeColor: "#F3EADB",
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
        family: '"Fraunces", Georgia, serif',
        googleParam: "Fraunces:opsz,wght@9..144,400;500;600",
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
    themeColor: "#F2ECDF",
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
        family: '"Inter", system-ui, sans-serif',
        googleParam: "Inter:wght@400;500;600",
      },
      mono: {
        family: '"JetBrains Mono", ui-monospace, monospace',
        googleParam: "JetBrains+Mono:wght@400;500;600",
      },
    },
    cssVars: DESK_VARS,
    heroVariant: "desk",
    cardVariant: "desk",
    themeColor: "#EEF0EC",
    hero: {
      imageBase: "/collections/desk/hero",
      imageAlt: "Work-from-home desk with coffee and a muted video call",
    },
  },
}

function isThemeId(value: unknown): value is CollectionThemeId {
  return value === "floof" || value === "dogs" || value === "reads" || value === "desk"
}

/** Map collection URL handles to themed landing IDs (pets → dogs). */
export function themeIdFromCollectionHandle(
  handle: string | undefined | null
): CollectionThemeId | null {
  if (!handle) return null
  const mapped = HANDLE_THEME[handle.trim().toLowerCase()]
  return mapped ?? null
}

export function parseProductFromThemeParam(
  param: string | null | undefined
): CollectionThemeId | null {
  if (!param) return null
  const raw = param.trim().toLowerCase()
  if (raw === "pets") return "dogs"
  if (isThemeId(raw) && raw !== "floof") return raw
  return null
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

const THEME_HAND_FONT: Partial<Record<CollectionThemeId, string>> = {
  dogs: "Gochi+Hand",
  reads: "Caveat:wght@500;600;700",
  desk: "Kalam:wght@400;700",
}

export function buildGoogleFontsHref(theme: CollectionTheme): string {
  const families = new Set<string>([
    FLOOF_THEME_FONTS.display.googleParam,
    FLOOF_THEME_FONTS.body.googleParam,
  ])
  const hand = THEME_HAND_FONT[theme.id]
  if (hand) families.add(hand)
  const skipGoogleDisplayBody = theme.id === "reads"
  if (
    !skipGoogleDisplayBody &&
    theme.fonts.display.googleParam !== FLOOF_THEME_FONTS.display.googleParam
  ) {
    families.add(theme.fonts.display.googleParam)
  }
  if (
    !skipGoogleDisplayBody &&
    theme.fonts.body.googleParam !== FLOOF_THEME_FONTS.body.googleParam
  ) {
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

const HAND_FONT_FAMILY: Partial<Record<CollectionThemeId, string>> = {
  dogs: '"Gochi Hand", "Segoe Print", cursive',
  reads: '"Caveat", "Segoe Print", cursive',
  desk: '"Kalam", "Segoe Print", cursive',
}

export function themeStyleAttribute(theme: CollectionTheme): string {
  const vars: Record<string, string> = {
    "--font-display": theme.fonts.display.family,
    "--font-body": theme.fonts.body.family,
    "--font-sans": theme.fonts.body.family,
    "--font-mono": theme.fonts.mono?.family ?? theme.fonts.body.family,
    "--font-hand": HAND_FONT_FAMILY[theme.id] ?? '"Caveat", cursive',
    ...theme.cssVars,
  }
  return Object.entries(vars)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ")
}

export const DEFAULT_GOOGLE_FONTS_HREF = buildGoogleFontsHref(THEMES.floof)
