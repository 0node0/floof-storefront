const PRINTFUL_FILE_PREVIEW_RE =
  /files\.cdn\.printful\.com\/files\/[^/]+\/[^/]+_preview\.png/i

const PRINTFUL_GENERIC_PRODUCT_RE = /files\.cdn\.printful\.com\/products\//i

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
