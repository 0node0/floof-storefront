import type { FloofProduct } from "./product"

const SPEC_SPLIT_RE =
  / (?=11 oz|3"|4"|Bella|Cotton Heritage|A soft, patch)/i

import { pickPrintfulDesignPreview } from "./printfulDesignImage"
import { pickStickerCatalogImage } from "./stickerCatalogImage"
import { stickerStaticArtUrl } from "./stickerStaticArt"

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

function isStickerProduct(product: FloofProduct): boolean {
  return product.category === "stickers" || /sticker/i.test(product.name)
}

/** Apparel / non-sticker: prefer flat Printful design file over on-model mockup. */
export function catalogDesignImageUrl(product: FloofProduct): string {
  if (product.stickerArtUrl) return product.stickerArtUrl
  const picked = pickPrintfulDesignPreview(product.images, product.image)
  if (picked) return picked
  return product.image ?? product.images[0] ?? ""
}

/** Dogs collection cards — static sticker art, flat tee art, or product photo for mugs. */
export function floridaFloofsCatalogImageUrl(product: FloofProduct): string {
  if (isStickerProduct(product)) return stickerCatalogImageUrl(product)
  if (product.category === "tees" || product.category === "hoodies") {
    return catalogDesignImageUrl(product)
  }
  return product.image ?? product.images[0] ?? ""
}

export function dogsCatalogImageUrl(product: FloofProduct): string {
  if (isStickerProduct(product)) return stickerCatalogImageUrl(product)
  if (product.category === "tees" || product.category === "hoodies") {
    return catalogDesignImageUrl(product)
  }
  return product.image ?? product.images[0] ?? ""
}

/** Sticker catalog image for desk and reads cards (plain background, centred art). */
export function stickerCatalogImageUrl(product: FloofProduct): string {
  if (!isStickerProduct(product)) {
    return product.image ?? product.images[0] ?? ""
  }

  const staticArt = stickerStaticArtUrl(product.slug)
  if (staticArt) return staticArt

  if (product.stickerArtUrl) return product.stickerArtUrl

  return pickStickerCatalogImage(product.images, product.image)
}

export function readsCatalogImageUrl(product: FloofProduct): string {
  return stickerCatalogImageUrl(product)
}

export function deskCatalogImageUrl(product: FloofProduct): string {
  return stickerCatalogImageUrl(product)
}

/** PDP / gallery: prefer static sticker art or flat design file, then lifestyle shots. */
export function productGalleryImages(product: FloofProduct): string[] {
  const staticArt = stickerStaticArtUrl(product.slug)
  const fromMedusa =
    product.images?.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : []

  if (staticArt) {
    const rest = fromMedusa.filter((url) => url !== staticArt)
    return [staticArt, ...rest]
  }

  if (isStickerProduct(product)) return fromMedusa

  const design = catalogDesignImageUrl(product)
  if (design && !fromMedusa.includes(design)) {
    const rest = fromMedusa.filter((url) => url !== design)
    return [design, ...rest]
  }
  if (design && fromMedusa[0] !== design) {
    const rest = fromMedusa.filter((url) => url !== design)
    return [design, ...rest]
  }

  return fromMedusa
}
