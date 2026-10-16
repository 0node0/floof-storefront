import type { MedusaProduct, MedusaVariant } from "./medusa"

const STICKER_SIZE_RE =
  /(\d+(?:\.\d+)?)\s*(?:in|inch|inches|″|"|')\s*(?:×|x|\*|by)?\s*(?:\d+(?:\.\d+)?\s*(?:in|inch|inches|″|"|')?)?/i

const OZ_RE = /\b(\d+)\s*oz\b/i

function optionValue(v: MedusaVariant, title: string): string | undefined {
  return v.options?.find(
    (o) => o.option?.title?.toLowerCase() === title.toLowerCase()
  )?.value
}

function parseStickerSizeInches(raw: string): string | null {
  const m = raw.match(STICKER_SIZE_RE)
  if (!m) return null
  return `${m[1]} in`
}

function stickerSizeFromVariants(variants: MedusaVariant[]): string | null {
  for (const variant of variants) {
    const fromTitle = parseStickerSizeInches(variant.title)
    if (fromTitle) return fromTitle

    for (const opt of variant.options ?? []) {
      const optTitle = opt.option?.title?.toLowerCase() ?? ""
      if (
        optTitle.includes("size") ||
        optTitle.includes("sticker") ||
        optTitle.includes("dimension")
      ) {
        const parsed = parseStickerSizeInches(opt.value)
        if (parsed) return parsed
      }
    }
  }
  return null
}

function mugSizeFromProduct(
  variants: MedusaVariant[],
  description: string,
  metadata?: Record<string, unknown>
): string {
  const metaSize = metadata?.mug_oz ?? metadata?.mugSize ?? metadata?.size_oz
  if (typeof metaSize === "string" && OZ_RE.test(metaSize)) {
    const m = metaSize.match(OZ_RE)
    if (m) return `${m[1]} oz`
  }
  if (typeof metaSize === "number") return `${metaSize} oz`

  const fromDesc = description.match(OZ_RE)
  if (fromDesc) return `${fromDesc[1]} oz`

  for (const variant of variants) {
    const sizeOpt = optionValue(variant, "Size")
    if (sizeOpt && OZ_RE.test(sizeOpt)) {
      const m = sizeOpt.match(OZ_RE)
      if (m) return `${m[1]} oz`
    }
    if (OZ_RE.test(variant.title)) {
      const m = variant.title.match(OZ_RE)
      if (m) return `${m[1]} oz`
    }
  }

  return "11 oz"
}

/** Derive card label segment after type (e.g. "11 oz", "4 in"). */
export function deriveProductFormatSize(
  p: MedusaProduct,
  category: string
): string | undefined {
  const variants = p.variants ?? []
  const isSticker =
    category === "stickers" || /sticker/i.test(p.title)

  if (isSticker) {
    const fromMeta = p.metadata?.sticker_size ?? p.metadata?.stickerSize
    if (typeof fromMeta === "string") {
      const parsed = parseStickerSizeInches(fromMeta)
      if (parsed) return parsed
    }
    const fromVariants = stickerSizeFromVariants(variants)
    if (fromVariants) return fromVariants
    const fromDesc = parseStickerSizeInches(p.description ?? "")
    if (fromDesc) return fromDesc
    return undefined
  }

  if (category === "mugs") {
    return mugSizeFromProduct(variants, p.description ?? "", p.metadata)
  }

  return undefined
}
