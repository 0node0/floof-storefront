import type { FloofProduct } from "./product"

const SPEC_SPLIT_RE =
  / (?=11 oz|3"|4"|Bella|Cotton Heritage|A soft, patch)/i

const FLAT_LAY_IMAGE_RE =
  /flat[-_]?lay|laptop|mockup|lifestyle|room-scene|desk-scene|hero-shot/i

const CATEGORY_TYPE_LABEL: Record<string, string> = {
  mugs: "Mug",
  stickers: "Sticker",
  tees: "Tee",
  hoodies: "Hoodie",
  hats: "Hat",
  accessories: "Accessory",
}

/** Story text only — strip PDP / blank spec tails before card truncation. */
export function productStoryText(description: string): string {
  const trimmed = description.trim()
  if (!trimmed) return ""
  return trimmed.split(SPEC_SPLIT_RE)[0].trim()
}

/**
 * Server-side card description (desk 64, reads 66).
 * Prefer ending on a sentence; otherwise last whole word + ellipsis.
 */
export function truncateCardDescription(text: string, limit: number): string {
  const story = productStoryText(text)
  if (story.length <= limit) return story

  const head = story.slice(0, limit + 1)
  const sentenceEnd = Math.max(
    head.lastIndexOf(". "),
    head.lastIndexOf("! "),
    head.lastIndexOf("? ")
  )
  if (sentenceEnd >= limit * 0.45) {
    return head.slice(0, sentenceEnd + 1)
  }

  const lastSpace = head.lastIndexOf(" ")
  const words = lastSpace > 0 ? head.slice(0, lastSpace) : head.slice(0, limit)
  return `${words.replace(/[,;:.]+$/, "")}…`
}

/** Card eyebrow: `Mug · 11 oz`, `Sticker · 4 in`, or `Tee`. */
export function productTypeSizeLabel(
  product: FloofProduct
): string {
  const type =
    CATEGORY_TYPE_LABEL[product.category] ??
    (product.category === "stickers" ? "Sticker" : product.category)

  const size = product.formatSize
  if (size) return `${type} · ${size}`
  return type
}

export function deskCardDescription(product: FloofProduct): string {
  return truncateCardDescription(product.description, 64)
}

export function readsCardDescription(product: FloofProduct): string {
  return truncateCardDescription(product.description, 66)
}

function isFlatLayImageUrl(url: string): boolean {
  return FLAT_LAY_IMAGE_RE.test(url)
}

/** Reads stickers: prefer clean art / print thumbnail over laptop flat-lays. */
export function readsCatalogImageUrl(product: FloofProduct): string {
  const isSticker =
    product.category === "stickers" || /sticker/i.test(product.name)
  if (!isSticker) {
    return product.image ?? product.images[0] ?? ""
  }

  if (product.stickerArtUrl) return product.stickerArtUrl

  const candidates = product.images.filter(Boolean)
  const art = candidates.find((url) => !isFlatLayImageUrl(url))
  if (art) return art

  const thumb = product.image
  if (thumb && !isFlatLayImageUrl(thumb)) return thumb

  return candidates[0] ?? thumb ?? ""
}

export function deskCatalogImageUrl(product: FloofProduct): string {
  const isSticker =
    product.category === "stickers" || /sticker/i.test(product.name)
  if (!isSticker) return product.image ?? product.images[0] ?? ""
  if (product.stickerArtUrl) return product.stickerArtUrl
  const candidates = product.images.filter(Boolean)
  const art = candidates.find((url) => !isFlatLayImageUrl(url))
  return art ?? product.image ?? candidates[0] ?? ""
}
