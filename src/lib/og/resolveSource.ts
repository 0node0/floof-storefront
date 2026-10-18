import sharp from "sharp"
import type { FloofProduct } from "@/lib/product"
import { stickerCatalogImageUrl } from "@/lib/productCard"
import { readsStickerStaticArtUrl } from "@/lib/readsStickerArt"
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

/** Pick the largest raster among sticker art candidates (never prefer a tiny static over Printful). */
export async function resolveOgProductSourceUrl(
  product: FloofProduct
): Promise<string> {
  if (!isStickerProduct(product)) {
    return product.image || product.images[0] || ""
  }

  const candidates = new Set<string>()
  const staticArt = readsStickerStaticArtUrl(product.slug)
  if (staticArt) candidates.add(staticArt)
  candidates.add(stickerCatalogImageUrl(product))
  if (product.stickerArtUrl) candidates.add(product.stickerArtUrl)
  if (product.image) candidates.add(product.image)
  for (const url of product.images) {
    if (url) candidates.add(url)
  }

  let bestUrl = stickerCatalogImageUrl(product)
  let bestArea = 0

  for (const url of candidates) {
    if (!url) continue
    const area = await imagePixelArea(url)
    if (area > bestArea) {
      bestArea = area
      bestUrl = url
    }
  }

  return bestUrl
}
