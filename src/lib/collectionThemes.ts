import type { MedusaCollection } from "./medusa"

export type CollectionThemeId = "floof" | "dogs" | "reads" | "desk"
export type HeroVariant = "floof" | "dogs" | "reads" | "desk"
export type CardVariant = "floof" | "dogs" | "reads" | "desk"

export interface ThemeFonts {
  display: { family: string; googleParam: string }
  body: { family: string; googleParam: string }
  mono?: { family: string; googleParam: string }
}

export interface CollectionTheme {
  id: CollectionThemeId
  label: string
  fonts: ThemeFonts
  /** Scoped overrides on `.collection-theme` (empty until niche designs land). */
  cssVars: Record<string, string>
  heroVariant: HeroVariant
  cardVariant: CardVariant
  themeColor: string
}

/** Default Floof chrome fonts (nav/footer + collection fallback). */
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

function createTheme(
  id: CollectionThemeId,
  label: string,
  heroVariant: HeroVariant,
  cardVariant: CardVariant
): CollectionTheme {
  return {
    id,
    label,
    fonts: FLOOF_THEME_FONTS,
    cssVars: {},
    heroVariant,
    cardVariant,
    themeColor: "#1a1524",
  }
}

const THEMES: Record<CollectionThemeId, CollectionTheme> = {
  floof: createTheme("floof", "Floof", "floof", "floof"),
  // Visual tokens/fonts TBD — variant slots wired for upcoming designs.
  dogs: createTheme("dogs", "Dogs", "dogs", "dogs"),
  reads: createTheme("reads", "Reads", "reads", "reads"),
  desk: createTheme("desk", "Desk", "desk", "desk"),
}

function isThemeId(value: unknown): value is CollectionThemeId {
  return value === "floof" || value === "dogs" || value === "reads" || value === "desk"
}

export function getCollectionTheme(id: CollectionThemeId): CollectionTheme {
  return THEMES[id]
}

/**
 * Resolve theme from collection metadata (`theme: dogs|reads|desk`) or handle map.
 * Unknown handles use the Floof default.
 */
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

/** Nav chrome fonts + theme body/display (deduped). */
export function buildGoogleFontsHref(theme: CollectionTheme): string {
  const families = new Set<string>([
    FLOOF_THEME_FONTS.display.googleParam,
    FLOOF_THEME_FONTS.body.googleParam,
  ])
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
