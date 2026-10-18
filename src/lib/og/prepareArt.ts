import sharp from "sharp"
import { OG_HEIGHT } from "./constants"
import { loadImageBuffer } from "./images"
import {
  erodeAlphaEdge,
  knockOutNearWhiteMatte,
  trimAlphaBounds,
  trimContentPadding,
} from "./trimContent"

/** Left panel art targets ~85% of card height after trim. */
export const OG_PRODUCT_ART_HEIGHT = Math.round(OG_HEIGHT * 0.85)
export const OG_PRODUCT_ART_MAX_WIDTH = 540

export interface PreparedOgArt {
  dataUrl: string
  width: number
  height: number
}

const processedCache = new Map<string, PreparedOgArt>()

export interface PrepareOgArtOptions {
  /** Stickers always trim padding; other products trim when margins are large. */
  forceTrim: boolean
}

function toPngDataUrl(buf: Buffer): string {
  return `data:image/png;base64,${buf.toString("base64")}`
}

async function boundingTrim(input: Buffer): Promise<{
  buffer: Buffer
  width: number
  height: number
  originalWidth: number
  originalHeight: number
}> {
  const original = sharp(input)
  const origMeta = await original.metadata()
  const originalWidth = origMeta.width ?? 0
  const originalHeight = origMeta.height ?? 0

  const trimmed = await sharp(input)
    .ensureAlpha()
    .trim({ threshold: 12, lineArt: false })
    .toBuffer({ resolveWithObject: true })

  return {
    buffer: trimmed.data,
    width: trimmed.info.width,
    height: trimmed.info.height,
    originalWidth,
    originalHeight,
  }
}

function marginRatio(
  original: number,
  trimmed: number
): number {
  if (original <= 0) return 0
  return 1 - trimmed / original
}

export async function prepareOgProductArt(
  src: string,
  options: PrepareOgArtOptions
): Promise<PreparedOgArt | null> {
  const cacheKey = `v7:${options.forceTrim}:${src}`
  const hit = processedCache.get(cacheKey)
  if (hit) return hit

  const raw = await loadImageBuffer(src)
  if (!raw) return null

  try {
    const {
      buffer: trimmedBuf,
      width: tw,
      height: th,
      originalWidth,
      originalHeight,
    } = await boundingTrim(raw)

    const trimW = marginRatio(originalWidth, tw)
    const trimH = marginRatio(originalHeight, th)
    const significantMargins =
      trimW >= 0.06 || trimH >= 0.06 || tw * th < originalWidth * originalHeight * 0.82

    let artBuf =
      options.forceTrim || significantMargins ? trimmedBuf : raw

    if (options.forceTrim) {
      artBuf = await knockOutNearWhiteMatte(artBuf)
      artBuf = await erodeAlphaEdge(artBuf, 2)
      artBuf = await trimAlphaBounds(artBuf)
    } else if (significantMargins) {
      artBuf = await trimContentPadding(artBuf)
    }

    const nativeMeta = await sharp(artBuf).metadata()
    const nativeW = nativeMeta.width ?? OG_PRODUCT_ART_MAX_WIDTH
    const nativeH = nativeMeta.height ?? OG_PRODUCT_ART_HEIGHT
    const maxW = Math.min(OG_PRODUCT_ART_MAX_WIDTH, nativeW)
    const maxH = Math.min(OG_PRODUCT_ART_HEIGHT, nativeH)

    const resized = await sharp(artBuf)
      .resize({
        width: maxW,
        height: maxH,
        fit: "inside",
        withoutEnlargement: true,
      })
      .png()
      .toBuffer()

    const meta = await sharp(resized).metadata()
    const prepared: PreparedOgArt = {
      dataUrl: toPngDataUrl(resized),
      width: meta.width ?? OG_PRODUCT_ART_MAX_WIDTH,
      height: meta.height ?? OG_PRODUCT_ART_HEIGHT,
    }
    processedCache.set(cacheKey, prepared)
    return prepared
  } catch {
    return null
  }
}

export async function prepareOgProductArtDataUrl(
  src: string,
  options: PrepareOgArtOptions
): Promise<string | null> {
  const art = await prepareOgProductArt(src, options)
  return art?.dataUrl ?? null
}
