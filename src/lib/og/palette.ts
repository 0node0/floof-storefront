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
  },
  dogs: {
    background: "#f7f4ee",
    backgroundWash: "#efe8dc",
    ink: "#3d3428",
    inkMuted: "#6b5f52",
    accent: "#c4693a",
    accentInk: "#fffaf5",
    border: "#3d3428",
    collectionLabel: "Dogs",
  },
  reads: {
    background: "#f2ecdf",
    backgroundWash: "#e8dfd0",
    ink: "#2a3040",
    inkMuted: "#4f5563",
    accent: "#7a3b32",
    accentInk: "#faf6ec",
    border: "#2a3040",
    collectionLabel: "Reads",
  },
  desk: {
    background: "#eef0ec",
    backgroundWash: "#e1e5df",
    ink: "#263232",
    inkMuted: "#4a5656",
    accent: "#55705b",
    accentInk: "#f6f7f4",
    border: "#263232",
    collectionLabel: "Desk",
  },
}

export function paletteForTheme(themeId: CollectionThemeId): OgPalette {
  return OG_PALETTES[themeId]
}
