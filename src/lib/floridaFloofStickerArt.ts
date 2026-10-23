import {
  FLORIDA_FLOOF_ANIMALS,
  floridaFloofStickerHandle,
  type FloridaFloofAnimalSlug,
} from "./floridaFloofs"

/** Bump when sticker display assets or PNG masters change. */
export const FLORIDA_FLOOF_STICKER_ART_CACHE_VERSION = "3"

export const FLORIDA_FLOOF_STICKER_DISPLAY_WIDTHS = {
  strip: 400,
  card: 800,
  teaser: 400,
} as const

export type FloridaFloofStickerDisplayRole = keyof typeof FLORIDA_FLOOF_STICKER_DISPLAY_WIDTHS

export const FLORIDA_FLOOF_STICKER_HANDLES = FLORIDA_FLOOF_ANIMALS.map((a) =>
  floridaFloofStickerHandle(a.slug)
)

const HANDLE_SET = new Set<string>(FLORIDA_FLOOF_STICKER_HANDLES)

function artBasePath(animal: FloridaFloofAnimalSlug): string {
  return `/sticker-art/florida-floof-${animal}-sticker-art`
}

function withVersion(path: string): string {
  return `${path}?v=${FLORIDA_FLOOF_STICKER_ART_CACHE_VERSION}`
}

export function isFloridaFloofStickerHandle(handle: string): boolean {
  return HANDLE_SET.has(handle)
}

export function floridaFloofStickerStaticArtUrl(
  handle: string
): string | undefined {
  if (!HANDLE_SET.has(handle)) return undefined
  const animal = handle.replace(/^florida-floof-/, "").replace(/-sticker$/, "")
  return withVersion(`${artBasePath(animal as FloridaFloofAnimalSlug)}.png`)
}

export function floridaFloofStaticArtByAnimal(
  animal: FloridaFloofAnimalSlug
): string {
  return withVersion(`${artBasePath(animal)}.png`)
}

export interface FloridaFloofStickerDisplayUrls {
  avif: string
  webp: string
  png: string
  width: number
}

export function floridaFloofStickerDisplayUrls(
  animal: FloridaFloofAnimalSlug,
  role: FloridaFloofStickerDisplayRole
): FloridaFloofStickerDisplayUrls {
  const width = FLORIDA_FLOOF_STICKER_DISPLAY_WIDTHS[role]
  const base = artBasePath(animal)
  return {
    width,
    avif: withVersion(`${base}-${width}.avif`),
    webp: withVersion(`${base}-${width}.webp`),
    png: withVersion(`${base}.png`),
  }
}

/** Catalog / gallery primary URL — optimized WebP, not full PNG master. */
export function floridaFloofStickerCatalogWebpUrl(
  animal: FloridaFloofAnimalSlug
): string {
  return floridaFloofStickerDisplayUrls(animal, "card").webp
}
