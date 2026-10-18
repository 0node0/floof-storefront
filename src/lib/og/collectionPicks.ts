import type { FloofProduct } from "@/lib/product"
import {
  FLOWER_CROWN_STICKER_HANDLES,
  isFlowerCrownStickerHandle,
} from "@/lib/flowerCrownStickerArt"
const FLOWER_CROWN_ORDER = new Map<string, number>(
  FLOWER_CROWN_STICKER_HANDLES.map((handle, index) => [handle, index])
)

function isStickerProduct(product: FloofProduct): boolean {
  return product.category === "stickers" || /sticker/i.test(product.name)
}

/** Collection OG thumbs: isolated art only — no mugs or on-model lifestyle shots. */
export function isOgCollectionGridProduct(product: FloofProduct): boolean {
  if (product.isWip) return false
  if (product.category === "mugs") return false
  if (isStickerProduct(product)) return true
  if (product.category === "tees" || product.category === "hoodies") {
    return true
  }
  return false
}

function flowerCrownRank(slug: string): number {
  if (!isFlowerCrownStickerHandle(slug)) return 999
  return FLOWER_CROWN_ORDER.get(slug) ?? 999
}

/** Up to `limit` products with art suitable for collection OG cards. */
export function pickCollectionOgProducts(
  products: FloofProduct[],
  collectionHandle: string,
  limit = 3
): FloofProduct[] {
  const eligible = products.filter(isOgCollectionGridProduct)

  if (collectionHandle === "dogs") {
    const crowns = eligible
      .filter((p) => isFlowerCrownStickerHandle(p.slug))
      .sort((a, b) => flowerCrownRank(a.slug) - flowerCrownRank(b.slug))
    if (crowns.length >= limit) {
      return crowns.slice(0, limit)
    }
    const rest = eligible.filter((p) => !isFlowerCrownStickerHandle(p.slug))
    return [...crowns, ...rest].slice(0, limit)
  }

  const stickers = eligible.filter(isStickerProduct)
  const apparel = eligible.filter(
    (p) => p.category === "tees" || p.category === "hoodies"
  )
  const merged = [...stickers, ...apparel]
  if (merged.length >= limit) return merged.slice(0, limit)
  return merged.length > 0 ? merged : eligible.slice(0, limit)
}
