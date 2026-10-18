const PRINTFUL_FILE_PREVIEW_RE =
  /files\.cdn\.printful\.com\/files\/[^/]+\/[^/]+_preview\.png/i

const PRINTFUL_MOCKUP_PRODUCT_RE = /files\.cdn\.printful\.com\/products\//i

/**
 * Flat print-file preview for apparel — skips generic on-model product shots.
 * With multiple file previews, index 1 is usually the isolated design (index 0 is often mockup).
 */
export function pickPrintfulDesignPreview(
  imageUrls: string[],
  thumbnail?: string
): string {
  const ordered = [...imageUrls.filter(Boolean)]
  if (thumbnail && !ordered.includes(thumbnail)) {
    ordered.unshift(thumbnail)
  }

  const filePreviews = ordered.filter((url) =>
    PRINTFUL_FILE_PREVIEW_RE.test(url)
  )
  const nonMockup = ordered.filter(
    (url) => !PRINTFUL_MOCKUP_PRODUCT_RE.test(url)
  )

  if (filePreviews.length >= 2) {
    return filePreviews[1]
  }
  if (filePreviews.length === 1) {
    return filePreviews[0]
  }

  return nonMockup[0] ?? ordered[0] ?? thumbnail ?? ""
}
