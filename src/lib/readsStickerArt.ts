/** Designer sticker-only art for reads cards (not in Medusa as clean previews). */
export const READS_STICKER_ART_BY_HANDLE: Record<string, string> = {
  "floof-bookmark-whatever-was-nearest-sticker":
    "/collections/reads/sticker-art/bookmark-whatever-was-nearest.png",
  "performatively-reading-sticker":
    "/collections/reads/sticker-art/performatively-reading.png",
}

export function readsStickerStaticArtUrl(handle: string): string | undefined {
  return READS_STICKER_ART_BY_HANDLE[handle]
}
