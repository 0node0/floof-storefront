/** Bump when sticker PNG bytes change so browsers fetch fresh art. */
const READS_STICKER_ART_CACHE_VERSION = "4"

/** Sticker-only card art (not Medusa lifestyle mockups). */
export const READS_STICKER_ART_BY_HANDLE: Record<string, string> = {
  "floof-bookmark-whatever-was-nearest-sticker":
    "/collections/reads/sticker-art/bookmark-whatever-was-nearest.png",
  "floof-dog-ear-club-sticker":
    "/collections/reads/sticker-art/dog-ear-club.png",
  "floof-i-prefer-hardcover-sticker":
    "/collections/reads/sticker-art/i-prefer-hardcover.png",
  "performatively-reading-sticker":
    "/collections/reads/sticker-art/performatively-reading.png",
}

export function readsStickerStaticArtUrl(handle: string): string | undefined {
  const path = READS_STICKER_ART_BY_HANDLE[handle]
  if (!path) return undefined
  return `${path}?v=${READS_STICKER_ART_CACHE_VERSION}`
}
