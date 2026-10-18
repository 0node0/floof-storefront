import sharp from "sharp"
import type { FloofProduct } from "@/lib/product"
import { stickerCatalogImageUrl } from "@/lib/productCard"
import { readsStickerStaticArtUrl } from "@/lib/readsStickerArt"
import { loadImageBuffer } from "./images"

function isStickerProduct(product: FloofProduct): boolean {
  return product.category === "stickers" || /sticker/i.test(product.name)
}

/** Print-file / designer PNG — not Printful laptop flat-lay previews. */
export function isIsolatedStickerArtUrl(url: string): boolean {
  if (url.includes("/sticker-art/")) return true
  if (/\/static\/[^?]*-sticker-art\.png/i.test(url)) return true
  if (/\/static\/[^?]*art\.png/i.test(url)) return true
  return false
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

  if (product.stickerArtUrl && isIsolatedStickerArtUrl(product.stickerArtUrl)) {
    urls.add(product.stickerArtUrl)
  }

  for (const url of product.images) {
    if (url && isIsolatedStickerArtUrl(url)) urls.add(url)
  }
  if (product.image && isIsolatedStickerArtUrl(product.image)) {
    urls.add(product.image)
  }

  return [...urls]
}

/** Largest isolated sticker art raster (never lifestyle mockups). */
export async function resolveOgProductSourceUrl(
  product: FloofProduct
): Promise<string> {
  if (!isStickerProduct(product)) {
    return product.image || product.images[0] || ""
  }

  const candidates = stickerArtCandidates(product)
  if (candidates.length === 0) {
    return stickerCatalogImageUrl(product)
  }

  let bestUrl = candidates[0]
  let bestArea = 0

  for (const url of candidates) {
    const area = await imagePixelArea(url)
    if (area > bestArea) {
      bestArea = area
      bestUrl = url
    }
  }

  return bestUrl
}
