import type { MedusaProduct } from "./medusa"
import type { FloofProduct } from "./product"
import { readsStickerStaticArtUrl } from "./readsStickerArt"
import {
  getPrintfulApiToken,
  printfulSyncVariantStickerPreview,
} from "./printfulStickerArt"

function isStickerProduct(product: FloofProduct): boolean {
  return product.category === "stickers" || /sticker/i.test(product.name)
}

function printfulSyncVariantId(raw: MedusaProduct): number | undefined {
  const id = raw.variants?.[0]?.metadata?.printful_sync_variant_id
  return typeof id === "number" ? id : undefined
}

/** Resolve reads sticker card art: static assets, then Printful print file preview. */
export async function enrichReadsStickerArt(
  products: FloofProduct[],
  rawProducts: MedusaProduct[]
): Promise<FloofProduct[]> {
  const rawById = new Map(rawProducts.map((p) => [p.id, p]))
  const token = getPrintfulApiToken()

  return Promise.all(
    products.map(async (product) => {
      if (!isStickerProduct(product)) return product

      const staticUrl = readsStickerStaticArtUrl(product.slug)
      if (staticUrl) {
        return { ...product, stickerArtUrl: staticUrl }
      }

      const raw = rawById.get(product.id)
      const syncVariantId = raw ? printfulSyncVariantId(raw) : undefined
      if (syncVariantId !== undefined) {
        const preview = await printfulSyncVariantStickerPreview(
          syncVariantId,
          token
        )
        if (preview) {
          return { ...product, stickerArtUrl: preview }
        }
      }

      return { ...product, stickerArtUrl: undefined }
    })
  )
}
