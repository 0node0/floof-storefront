/** Bump when flower-crown PNG bytes change in public/sticker-art/. */
const FLOWER_CROWN_STICKER_ART_CACHE_VERSION = "1"

/** Medusa handles for git-hosted transparent sticker art (survives backend redeploys). */
export const FLOWER_CROWN_STICKER_HANDLES = [
  "flower-crown-basenji-sticker",
  "flower-crown-beagle-sticker",
  "flower-crown-bernese-mountain-dog-sticker",
  "flower-crown-corgi-sticker",
  "flower-crown-dachshund-sticker",
  "flower-crown-french-bulldog-sticker",
  "flower-crown-golden-retriever-sticker",
  "flower-crown-greyhound-sticker",
  "flower-crown-italian-greyhound-sticker",
  "flower-crown-labrador-sticker",
  "flower-crown-pit-bull-sticker",
  "flower-crown-scottish-deerhound-sticker",
] as const

const HANDLE_SET = new Set<string>(FLOWER_CROWN_STICKER_HANDLES)

export function isFlowerCrownStickerHandle(handle: string): boolean {
  return HANDLE_SET.has(handle)
}

export function flowerCrownStickerStaticArtUrl(
  handle: string
): string | undefined {
  if (!HANDLE_SET.has(handle)) return undefined
  return `/sticker-art/${handle}-art.png?v=${FLOWER_CROWN_STICKER_ART_CACHE_VERSION}`
}
