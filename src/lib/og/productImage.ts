import type { FloofProduct } from "@/lib/product"
import { stickerCatalogImageUrl } from "@/lib/productCard"

export function ogProductSourceUrl(product: FloofProduct): string {
  const sticker =
    product.category === "stickers" || /sticker/i.test(product.name)
  if (sticker) {
    return stickerCatalogImageUrl(product)
  }
  return product.image || product.images[0] || ""
}
