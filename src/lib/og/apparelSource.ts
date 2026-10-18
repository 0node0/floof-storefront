import type { FloofProduct } from "@/lib/product"
import { catalogDesignImageUrl } from "@/lib/productCard"
import { prepareOgProductArt } from "./prepareArt"

const PRINTFUL_FILE_PREVIEW_RE =
  /files\.cdn\.printful\.com\/files\/[^/]+\/[^/]+_preview\.png/i

/** Prefer the Printful file preview that crops to the smallest isolated design (not full-body mockups). */
export async function resolveApparelOgSourceUrl(
  product: FloofProduct
): Promise<string> {
  const previews = product.images.filter((url) =>
    PRINTFUL_FILE_PREVIEW_RE.test(url)
  )

  if (previews.length === 0) {
    return catalogDesignImageUrl(product)
  }

  if (previews.length === 1) {
    return previews[0]
  }

  let bestUrl = previews[0]
  let bestPixels = Infinity

  for (const url of previews) {
    const prepared = await prepareOgProductArt(url, { forceTrim: true })
    if (!prepared) continue
    const pixels = prepared.width * prepared.height
    if (pixels < bestPixels) {
      bestPixels = pixels
      bestUrl = url
    }
  }

  return bestUrl
}
