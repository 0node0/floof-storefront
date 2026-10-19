import {
  FLORIDA_FLOOF_ANIMALS,
  floridaFloofStickerHandle,
  type FloridaFloofAnimalSlug,
} from "./floridaFloofs"

const FLORIDA_FLOOF_STICKER_ART_CACHE_VERSION = "2"

export const FLORIDA_FLOOF_STICKER_HANDLES = FLORIDA_FLOOF_ANIMALS.map((a) =>
  floridaFloofStickerHandle(a.slug)
)

const HANDLE_SET = new Set<string>(FLORIDA_FLOOF_STICKER_HANDLES)

export function isFloridaFloofStickerHandle(handle: string): boolean {
  return HANDLE_SET.has(handle)
}

export function floridaFloofStickerStaticArtUrl(
  handle: string
): string | undefined {
  if (!HANDLE_SET.has(handle)) return undefined
  const animal = handle.replace(/^florida-floof-/, "").replace(/-sticker$/, "")
  return `/sticker-art/florida-floof-${animal}-sticker-art.png?v=${FLORIDA_FLOOF_STICKER_ART_CACHE_VERSION}`
}

export function floridaFloofStaticArtByAnimal(
  animal: FloridaFloofAnimalSlug
): string {
  return `/sticker-art/florida-floof-${animal}-sticker-art.png?v=${FLORIDA_FLOOF_STICKER_ART_CACHE_VERSION}`
}
