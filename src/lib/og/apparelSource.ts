import type { FloofProduct } from "@/lib/product"
import { catalogDesignImageUrl } from "@/lib/productCard"
import { loadImageBuffer } from "./images"
import type { PreparedOgArt } from "./prepareArt"
import { prepareOgProductArt } from "./prepareArt"

const PRINTFUL_FILE_PREVIEW_RE =
  /files\.cdn\.printful\.com\/files\/[^/]+\/[^/]+_preview\.png/i

function printfulFilePreviews(product: FloofProduct): string[] {
  const fromGallery = product.images.filter((url) =>
    PRINTFUL_FILE_PREVIEW_RE.test(url)
  )
  if (fromGallery.length > 0) return fromGallery

  const picked = catalogDesignImageUrl(product)
  if (picked && PRINTFUL_FILE_PREVIEW_RE.test(picked)) {
    return [picked]
  }
  return []
}

async function scorePreparedPreview(
  url: string
): Promise<{ url: string; prepared: PreparedOgArt; score: number } | null> {
  const raw = await loadImageBuffer(url)
  if (!raw) return null

  const prepared = await prepareOgProductArt(url, { forceTrim: true })
  if (!prepared) return null

  const canvas = 800 * 800
  const score = (prepared.width * prepared.height) / canvas
  return { url, prepared, score }
}

/**
 * Isolated design art for apparel OG — never returns an on-model lifestyle frame.
 * Picks the Printful file preview that trims to the smallest design on canvas.
 */
export async function resolveApparelOgArt(
  product: FloofProduct
): Promise<PreparedOgArt | null> {
  const previews = printfulFilePreviews(product)
  const candidates = previews.length > 0 ? previews : [catalogDesignImageUrl(product)]

  let best: { prepared: PreparedOgArt; score: number } | null = null

  for (const url of candidates) {
    if (!url) continue
    const hit = await scorePreparedPreview(url)
    if (!hit) continue
    if (!best || hit.score < best.score) {
      best = { prepared: hit.prepared, score: hit.score }
    }
  }

  return best?.prepared ?? null
}

/** @deprecated Use resolveApparelOgArt — kept for collection thumbs if needed */
export async function resolveApparelOgSourceUrl(
  product: FloofProduct
): Promise<string> {
  const previews = printfulFilePreviews(product)
  if (previews.length === 0) {
    return catalogDesignImageUrl(product)
  }

  let bestUrl = previews[0]
  let bestScore = Infinity

  for (const url of previews) {
    const hit = await scorePreparedPreview(url)
    if (!hit) continue
    if (hit.score < bestScore) {
      bestScore = hit.score
      bestUrl = url
    }
  }

  return bestUrl
}
