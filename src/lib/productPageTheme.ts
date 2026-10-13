import type { CollectionThemeId } from "./collectionThemes"
import {
  getCollectionTheme,
  parseProductFromThemeParam,
  themeIdFromCollectionHandle,
} from "./collectionThemes"
import type { FloofProduct } from "./product"

export interface ProductPageThemeContext {
  themeId: CollectionThemeId
  fromQuery: CollectionThemeId | null
  collectionHandle: string | null
  collectionLabel: string
  shelfHeading: string
  shelfEyebrow: string
}

const SHELF_COPY: Record<
  CollectionThemeId,
  { eyebrow: string; heading: string; collectionLabel: string }
> = {
  floof: {
    eyebrow: "More from the press",
    heading: "Related pieces",
    collectionLabel: "Shop",
  },
  dogs: {
    eyebrow: "More from the dog shelf",
    heading: "Good dogs, more jokes",
    collectionLabel: "Dogs",
  },
  reads: {
    eyebrow: "More from this shelf",
    heading: "Keep browsing the shelf",
    collectionLabel: "Reads",
  },
  desk: {
    eyebrow: "More from today's call",
    heading: "Still on mute, still shopping",
    collectionLabel: "Desk",
  },
}

export function resolveProductPageTheme(
  fromParam: string | null | undefined,
  product: FloofProduct
): ProductPageThemeContext {
  const fromQuery = parseProductFromThemeParam(fromParam)
  const fromCollection = themeIdFromCollectionHandle(product.collectionHandle)
  const themeId: CollectionThemeId = fromQuery ?? fromCollection ?? "floof"
  const copy = SHELF_COPY[themeId]

  const collectionHandle =
    themeId === "dogs"
      ? product.collectionHandle === "pets"
        ? "pets"
        : product.collectionHandle || "dogs"
      : themeId !== "floof"
        ? product.collectionHandle || themeId
        : product.collectionHandle || null

  const collectionLabel =
    product.collectionTitle ||
    (themeId !== "floof" ? copy.collectionLabel : copy.collectionLabel)

  return {
    themeId,
    fromQuery,
    collectionHandle,
    collectionLabel,
    shelfEyebrow: copy.eyebrow,
    shelfHeading: copy.heading,
  }
}

export function productDetailPath(
  slug: string,
  themeId: CollectionThemeId = "floof"
): string {
  if (themeId === "floof") return `/products/${slug}`
  return `/products/${slug}?from=${themeId}`
}

export function productPageThemeBundle(themeId: CollectionThemeId) {
  return getCollectionTheme(themeId)
}

function relatedShelfLimit(themeId: CollectionThemeId): number {
  // Reads collection grid is 3 columns on desktop — avoid a lone orphan card.
  if (themeId === "reads") return 3
  return 4
}

export function relatedProductsForShelf(
  all: FloofProduct[],
  product: FloofProduct,
  themeId: CollectionThemeId,
  collectionHandle: string | null
): FloofProduct[] {
  const limit = relatedShelfLimit(themeId)
  const others = all.filter((p) => p.slug !== product.slug)
  if (themeId !== "floof" && collectionHandle) {
    const sameCollection = others.filter(
      (p) => p.collectionHandle === collectionHandle
    )
    if (sameCollection.length >= 2) return sameCollection.slice(0, limit)
  }
  const sameCategory = others.filter((p) => p.category === product.category)
  if (sameCategory.length >= 2) return sameCategory.slice(0, limit)
  return others.slice(0, limit)
}
