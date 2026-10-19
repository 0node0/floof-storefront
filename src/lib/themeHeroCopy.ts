import type { CollectionThemeId } from "./collectionThemes"
import type { MedusaCollection } from "./medusa"
import { collectionHeroCopy as baseHeroCopy } from "./collections"

export interface ThemeAwareHeroCopy {
  title: string
  titleAccent?: string
  tagline: string
  eyebrow?: string
  seoTitle: string
  seoDescription: string
  handle: string
}

const THEME_DEFAULTS: Partial<
  Record<
    CollectionThemeId,
    { eyebrow: string; title: string; titleAccent?: string; tagline: string }
  >
> = {
  dogs: {
    eyebrow: "The dog shelf",
    title: "Good dogs,",
    titleAccent: "better opinions.",
    tagline:
      "Breed-specific mugs and stickers for owners who know exactly which couch cushion is theirs. Find your dog, then find your joke.",
  },
  reads: {
    eyebrow: "The reading room",
    title: "For people who dog-ear",
    titleAccent: "with pride.",
    tagline:
      "Mugs and stickers for readers who fold corners, mark pages with whatever is nearest and keep a strict preference for hardcover.",
  },
  desk: {
    eyebrow: "Camera-off club",
    title: "Camera off.",
    titleAccent: "Coffee on.",
    tagline:
      "Mugs and stickers for the nine-to-five, done from the couch. Quietly funny, safe for the background of any meeting.",
  },
  floridaFloofs: {
    eyebrow: "Gulf-coast natives",
    title: "Florida",
    titleAccent: "floofs.",
    tagline:
      "Twelve Southwest Florida animals in flower crowns — manatees, spoonbills, panthers and friends on stickers, tees and mugs.",
  },
}

export function themeAwareHeroCopy(
  collection: MedusaCollection,
  themeId: CollectionThemeId
): ThemeAwareHeroCopy {
  const base = baseHeroCopy(collection)
  const themed = THEME_DEFAULTS[themeId]
  if (!themed) {
    return { ...base, handle: collection.handle }
  }
  const useThemed =
    collection.handle === themeId ||
    (themeId === "dogs" && collection.handle === "pets") ||
    (themeId === "floridaFloofs" &&
      collection.handle === "florida-floofs")
  return {
    ...base,
    handle: collection.handle,
    eyebrow: themed.eyebrow,
    title: useThemed ? themed.title : base.title,
    titleAccent: useThemed ? themed.titleAccent : undefined,
    tagline: useThemed ? themed.tagline : base.tagline,
  }
}
