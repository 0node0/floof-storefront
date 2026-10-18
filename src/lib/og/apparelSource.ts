import type { FloofProduct } from "@/lib/product"
import { catalogDesignImageUrl } from "@/lib/productCard"
import { isAcceptableApparelOgArt } from "./apparelConstants"
import { loadImageBuffer } from "./images"
import type { PreparedOgArt } from "./prepareArt"
import { prepareOgProductArt } from "./prepareArt"

const PRINTFUL_FILE_PREVIEW_RE =
  /files\.cdn\.printful\.com\/files\/[^/]+\/[^/]+_preview\.png/i

export type ApparelOgMode = "art" | "text"

export interface ApparelOgResolution {
  mode: ApparelOgMode
  art: PreparedOgArt | null
  /** Best preview URL when mode is art (debug / audit). */
  sourceUrl?: string
  coverage?: number
}

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
): Promise<{
  url: string
  prepared: PreparedOgArt
  coverage: number
} | null> {
  const raw = await loadImageBuffer(url)
  if (!raw) return null

  const prepared = await prepareOgProductArt(url, { forceTrim: true })
  if (!prepared) return null

  const coverage =
    (prepared.width * prepared.height) / (800 * 800)
  if (!isAcceptableApparelOgArt(prepared.width, prepared.height)) {
    return null
  }

  return { url, prepared, coverage }
}

/**
 * Isolated design art for apparel OG. Returns text mode when only lifestyle mockups exist.
 */
export async function resolveApparelOg(
  product: FloofProduct
): Promise<ApparelOgResolution> {
  const previews = printfulFilePreviews(product)
  const candidates =
    previews.length > 0 ? previews : [catalogDesignImageUrl(product)].filter(Boolean)

  let best: {
    url: string
    prepared: PreparedOgArt
    coverage: number
  } | null = null

  for (const url of candidates) {
    const hit = await scorePreparedPreview(url)
    if (!hit) continue
    if (!best || hit.coverage < best.coverage) {
      best = hit
    }
  }

  if (best) {
    return {
      mode: "art",
      art: best.prepared,
      sourceUrl: best.url,
      coverage: best.coverage,
    }
  }

  return { mode: "text", art: null }
}

/** @deprecated Use resolveApparelOg */
export async function resolveApparelOgArt(
  product: FloofProduct
): Promise<PreparedOgArt | null> {
  const result = await resolveApparelOg(product)
  return result.art
}
