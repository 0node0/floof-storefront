import type { CollectionThemeId } from "./collectionThemes"
import {
  getCollectionTheme,
  parseProductFromThemeParam,
  themeIdFromCollectionHandle,
} from "./collectionThemes"
import { animalSlugFromProductHandle, isFloridaFloofProductSlug } from "./floridaFloofs"
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
  floridaFloofs: {
    eyebrow: "More from the shore",
    heading: "Meet the other locals",
    collectionLabel: "Florida Floofs",
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
      : themeId === "floridaFloofs"
        ? product.collectionHandle || "florida-floofs"
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

function stableProductSort(a: FloofProduct, b: FloofProduct): number {
  return a.slug.localeCompare(b.slug)
}

function hashSlug(slug: string): number {
  let h = 0
  for (let i = 0; i < slug.length; i++) {
    h = (Math.imul(31, h) + slug.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function matchesCollectionShelf(
  p: FloofProduct,
  themeId: CollectionThemeId,
  collectionHandle: string | null
): boolean {
  if (collectionHandle && p.collectionHandle === collectionHandle) return true
  if (themeId === "floridaFloofs" && isFloridaFloofProductSlug(p.slug)) {
    return true
  }
  return false
}

function pickRotatedShelf(
  pool: FloofProduct[],
  product: FloofProduct,
  limit: number,
  themeId: CollectionThemeId
): FloofProduct[] {
  if (pool.length <= limit) return pool

  const sorted = [...pool].sort(stableProductSort)
  const start = hashSlug(product.slug) % sorted.length
  const rotated: FloofProduct[] = []
  for (let i = 0; i < sorted.length; i++) {
    rotated.push(sorted[(start + i) % sorted.length])
  }

  if (themeId !== "floridaFloofs") {
    return rotated.slice(0, limit)
  }

  const currentAnimal = animalSlugFromProductHandle(product.slug)
  const picked: FloofProduct[] = []
  const animalsUsed = new Set<string>()

  for (const candidate of rotated) {
    if (picked.length >= limit) break
    const animal = animalSlugFromProductHandle(candidate.slug)
    if (animal && animal === currentAnimal) continue
    if (animal && animalsUsed.has(animal)) continue
    if (animal) animalsUsed.add(animal)
    picked.push(candidate)
  }

  if (picked.length < limit) {
    for (const candidate of rotated) {
      if (picked.length >= limit) break
      if (picked.some((p) => p.slug === candidate.slug)) continue
      picked.push(candidate)
    }
  }

  return picked.slice(0, limit)
}

export function relatedProductsForShelf(
  all: FloofProduct[],
  product: FloofProduct,
  themeId: CollectionThemeId,
  collectionHandle: string | null
): FloofProduct[] {
  const limit = relatedShelfLimit(themeId)
  const others = all.filter((p) => p.slug !== product.slug)

  if (themeId !== "floof") {
    const sameCollection = others.filter((p) =>
      matchesCollectionShelf(p, themeId, collectionHandle)
    )
    if (sameCollection.length >= 1) {
      return pickRotatedShelf(sameCollection, product, limit, themeId)
    }
  }

  const sameCategory = others.filter((p) => p.category === product.category)
  if (sameCategory.length >= 1) {
    return pickRotatedShelf(sameCategory, product, limit, themeId)
  }

  return pickRotatedShelf(others, product, limit, themeId)
}
