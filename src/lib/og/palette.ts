import type { CollectionThemeId } from "@/lib/collectionThemes"

export interface OgPalette {
  background: string
  backgroundWash: string
  ink: string
  inkMuted: string
  accent: string
  accentInk: string
  border: string
  collectionLabel: string
  /** Soft shadow under product art on the left panel */
  artShadow: string
  panelAccent?: string
  /** Price text on dark themes (defaults to accent) */
  priceColor?: string
}

export const OG_PALETTES: Record<CollectionThemeId, OgPalette> = {
  floof: {
    background: "#1a1524",
    backgroundWash: "#2a2438",
    ink: "#f5f4f0",
    inkMuted: "#b8b4c8",
    accent: "#e85d9a",
    accentInk: "#1a1524",
    border: "#f5f4f0",
    collectionLabel: "Floof",
    artShadow: "rgba(0,0,0,0.35)",
    panelAccent: "#e85d9a",
  },
  dogs: {
    background: "#f7f4ee",
    backgroundWash: "#ebe3d4",
    ink: "#3d3428",
    inkMuted: "#6b5f52",
    accent: "#c4693a",
    accentInk: "#fffaf5",
    border: "#3d3428",
    collectionLabel: "Dogs",
    artShadow: "rgba(61,52,40,0.28)",
    panelAccent: "#c4693a",
  },
  reads: {
    background: "#2a3040",
    backgroundWash: "#1e2430",
    ink: "#faf6ec",
    inkMuted: "#c5c9d4",
    accent: "#f5c6d6",
    accentInk: "#2a3040",
    border: "#faf6ec",
    collectionLabel: "Reads",
    artShadow: "rgba(0,0,0,0.45)",
    panelAccent: "#7a3b32",
    priceColor: "#faf6ec",
  },
  desk: {
    background: "#eef0ec",
    backgroundWash: "#dde3db",
    ink: "#263232",
    inkMuted: "#4a5656",
    accent: "#55705b",
    accentInk: "#f6f7f4",
    border: "#263232",
    collectionLabel: "Desk",
    artShadow: "rgba(38,50,50,0.3)",
    panelAccent: "#55705b",
  },
  floridaFloofs: {
    background: "#f4f0e6",
    backgroundWash: "#e6f0ee",
    ink: "#1f3d38",
    inkMuted: "#3d5c56",
    accent: "#e07a5f",
    accentInk: "#fffbf5",
    border: "#1f3d38",
    collectionLabel: "Florida Floofs",
    artShadow: "rgba(31,61,56,0.22)",
    panelAccent: "#5ba8a0",
  },
}

export function paletteForTheme(themeId: CollectionThemeId): OgPalette {
  return OG_PALETTES[themeId]
}
