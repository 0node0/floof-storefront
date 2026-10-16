const PRINTFUL_FILE_PREVIEW_RE =
  /files\.cdn\.printful\.com\/files\/[^/]+\/[^/]+_preview\.png/i

const PRINTFUL_GENERIC_PRODUCT_RE = /files\.cdn\.printful\.com\/products\//i

/** Print-file previews are much smaller than 800×800 lifestyle mockups on Printful CDN. */
export const PRINTFUL_STICKER_PRINT_PREVIEW_MAX_BYTES = 400_000

const previewLengthCache = new Map<string, number | null>()

export async function printfulPreviewContentLength(
  url: string
): Promise<number | null> {
  if (previewLengthCache.has(url)) {
    return previewLengthCache.get(url) ?? null
  }
  try {
    const res = await fetch(url, { method: "HEAD" })
    if (!res.ok) {
      previewLengthCache.set(url, null)
      return null
    }
    const len = res.headers.get("content-length")
    const parsed = len ? Number.parseInt(len, 10) : null
    previewLengthCache.set(url, parsed)
    return parsed
  } catch {
    previewLengthCache.set(url, null)
    return null
  }
}

/**
 * Printful sticker catalog art: print-file / sticker-only preview, not laptop flat-lays.
 * Desk listings usually rank the print file first; reads often rank lifestyle mockups first.
 */
export function pickStickerCatalogImage(
  imageUrls: string[],
  thumbnail?: string
): string {
  const ordered = [...imageUrls.filter(Boolean)]
  if (thumbnail && !ordered.includes(thumbnail)) {
    ordered.unshift(thumbnail)
  }

  const filePreviews = ordered.filter((url) => PRINTFUL_FILE_PREVIEW_RE.test(url))
  const nonGeneric = ordered.filter((url) => !PRINTFUL_GENERIC_PRODUCT_RE.test(url))

  if (filePreviews.length === 1) {
    return filePreviews[0]
  }

  if (filePreviews.length >= 2) {
    return filePreviews[0]
  }

  return nonGeneric[0] ?? ordered[0] ?? thumbnail ?? ""
}

/** Prefer the smallest Printful file preview under the print-file size ceiling. */
export async function pickStickerCatalogImageAsync(
  imageUrls: string[],
  thumbnail?: string
): Promise<string> {
  const ordered = [...imageUrls.filter(Boolean)]
  if (thumbnail && !ordered.includes(thumbnail)) {
    ordered.unshift(thumbnail)
  }

  const filePreviews = ordered.filter((url) => PRINTFUL_FILE_PREVIEW_RE.test(url))
  if (filePreviews.length === 0) {
    return pickStickerCatalogImage(imageUrls, thumbnail)
  }

  const sized: { url: string; len: number }[] = []
  for (const url of filePreviews) {
    const len = await printfulPreviewContentLength(url)
    if (len !== null) sized.push({ url, len })
  }

  const printCandidates = sized
    .filter((s) => s.len <= PRINTFUL_STICKER_PRINT_PREVIEW_MAX_BYTES)
    .sort((a, b) => a.len - b.len)

  if (printCandidates.length > 0) {
    return printCandidates[0].url
  }

  return pickStickerCatalogImage(imageUrls, thumbnail)
}
