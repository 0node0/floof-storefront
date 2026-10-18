import sharp from "sharp"
import type { FloofProduct } from "@/lib/product"
import { stickerCatalogImageUrl } from "@/lib/productCard"
import { readsStickerStaticArtUrl } from "@/lib/readsStickerArt"
import {
  pickStickerCatalogImage,
  PRINTFUL_FILE_PREVIEW_PATTERN,
} from "@/lib/stickerCatalogImage"
import { loadImageBuffer } from "./images"

function isStickerProduct(product: FloofProduct): boolean {
  return product.category === "stickers" || /sticker/i.test(product.name)
}

async function imagePixelArea(src: string): Promise<number> {
  const buf = await loadImageBuffer(src)
  if (!buf) return 0
  const meta = await sharp(buf).metadata()
  return (meta.width ?? 0) * (meta.height ?? 0)
}

function stickerArtCandidates(product: FloofProduct): string[] {
  const urls = new Set<string>()
  const staticArt = readsStickerStaticArtUrl(product.slug)
  if (staticArt) urls.add(staticArt)

  urls.add(stickerCatalogImageUrl(product))

  if (product.stickerArtUrl) urls.add(product.stickerArtUrl)

  const catalogPick = pickStickerCatalogImage(
    product.images,
    product.image
  )
  if (catalogPick) urls.add(catalogPick)

  for (const url of product.images) {
    if (url && PRINTFUL_FILE_PREVIEW_PATTERN.test(url)) {
      urls.add(url)
    }
  }

  return [...urls].filter(Boolean)
}

/** Largest sticker print-file / static art — never lifestyle mockups from the full gallery. */
export async function resolveOgProductSourceUrl(
  product: FloofProduct
): Promise<string> {
  if (!isStickerProduct(product)) {
    return product.image || product.images[0] || ""
  }

  const candidates = stickerArtCandidates(product)
  let bestUrl = stickerCatalogImageUrl(product)
  let bestScore = -1

  for (const url of candidates) {
    const area = await imagePixelArea(url)
    let priority = 1
    if (url.includes("/sticker-art/")) priority = 4
    else if (url.includes("/static/") && /art\.png/i.test(url)) priority = 3
    else if (PRINTFUL_FILE_PREVIEW_PATTERN.test(url)) priority = 2

    const score = priority * 1_000_000 + area
    if (score > bestScore) {
      bestScore = score
      bestUrl = url
    }
  }

  return bestUrl
}
