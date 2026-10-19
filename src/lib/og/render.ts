import satori from "satori"
import { Resvg } from "@resvg/resvg-js"
import type { CollectionThemeId } from "@/lib/collectionThemes"
import {
  resolveCollectionTheme,
  themeIdFromCollectionHandle,
} from "@/lib/collectionThemes"
import { collectionHeroCopy } from "@/lib/collections"
import { formatPrice } from "@/lib/formatPrice"
import {
  getCollectionByHandle,
  getProduct,
  listProducts,
  listProductsByCollection,
} from "@/lib/medusa"
import { mapProduct, type FloofProduct } from "@/lib/product"
import { productTypeSizeLabel } from "@/lib/productCard"
import type { ReactNode } from "react"
import { site } from "@/lib/site"
import { OG_HEIGHT, OG_WIDTH } from "./constants"
import { getOgFonts } from "./fonts"
import { loadImageDataUrl } from "./images"
import { prepareOgProductArt } from "./prepareArt"
import {
  brandOgMarkup,
  collectionOgMarkup,
  productOgMarkup,
} from "./markup"
import { paletteForTheme } from "./palette"
import { resolveApparelOg } from "./apparelSource"
import { isApparelProduct } from "./apparelProduct"
import { pickCollectionOgProducts } from "./collectionPicks"
import { ogProductSourceUrl } from "./productImage"
import { OG_RENDER_REVISION } from "./revision"
import { resolveOgProductSourceUrl } from "./resolveSource"

async function collectionThumbDataUrl(p: FloofProduct): Promise<string | null> {
  const sticker = p.category === "stickers" || /sticker/i.test(p.name)
  if (sticker) {
    const url = await resolveOgProductSourceUrl(p)
    const art = await prepareOgProductArt(url, { forceTrim: true })
    return art?.dataUrl ?? (await loadImageDataUrl(url))
  }
  if (isApparelProduct(p)) {
    const resolution = await resolveApparelOg(p)
    return resolution.art?.dataUrl ?? null
  }
  const url = ogProductSourceUrl(p)
  const art = await prepareOgProductArt(url, { forceTrim: false })
  return art?.dataUrl ?? (await loadImageDataUrl(url))
}

const pngCache = new Map<string, Uint8Array>()

async function toPng(element: ReactNode, cacheKey: string): Promise<Uint8Array> {
  const hit = pngCache.get(cacheKey)
  if (hit) return hit

  const svg = await satori(element, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: getOgFonts(),
  })
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: OG_WIDTH },
  })
  const png = resvg.render().asPng()
  pngCache.set(cacheKey, png)
  return png
}

function themeForProduct(collectionHandle?: string): CollectionThemeId {
  return themeIdFromCollectionHandle(collectionHandle) ?? "floof"
}

export async function renderProductOg(handle: string): Promise<Uint8Array | null> {
  const { product: raw } = await getProduct(handle).catch(() => ({
    product: undefined,
  }))
  if (!raw) return null
  const product = mapProduct(raw)
  const themeId = themeForProduct(product.collectionHandle)
  const palette = paletteForTheme(themeId)
  const isSticker =
    product.category === "stickers" || /sticker/i.test(product.name)
  const isApparel = isApparelProduct(product)
  let prepared: Awaited<ReturnType<typeof prepareOgProductArt>> = null
  let cacheSegment = ""
  let textForward = false

  if (isSticker) {
    const src = await resolveOgProductSourceUrl(product)
    prepared = await prepareOgProductArt(src, { forceTrim: true })
    cacheSegment = `sticker:${src}`
  } else if (isApparel) {
    const resolution = await resolveApparelOg(product)
    if (resolution.mode === "art" && resolution.art) {
      prepared = resolution.art
      cacheSegment = `art:${resolution.coverage?.toFixed(3) ?? "ok"}`
    } else {
      textForward = true
      cacheSegment = "text-fallback"
    }
  } else {
    const src = ogProductSourceUrl(product)
    prepared = await prepareOgProductArt(src, { forceTrim: false })
    cacheSegment = src
  }

  const imageDataUrl =
    prepared?.dataUrl ??
    (isApparel ? null : await loadImageDataUrl(ogProductSourceUrl(product)))
  const priceLabel = formatPrice(Math.round(product.price * 100))
  const typeLabel = productTypeSizeLabel(product)

  return toPng(
    productOgMarkup({
      palette,
      title: product.name,
      priceLabel,
      typeLabel,
      imageDataUrl: textForward ? null : imageDataUrl,
      artWidth: prepared?.width,
      artHeight: prepared?.height,
      textForward,
    }),
    `product:${OG_RENDER_REVISION.product}:${handle}:${cacheSegment}:${themeId}`
  )
}

export async function renderCollectionOg(handle: string): Promise<Uint8Array | null> {
  const { collection } = await getCollectionByHandle(handle).catch(() => ({
    collection: undefined,
  }))
  if (!collection) return null
  const theme = resolveCollectionTheme(collection)
  const palette = paletteForTheme(theme.id)
  const hero = collectionHeroCopy(collection)

  let thumbs: string[] = []
  try {
    const { products: raw } = await listProductsByCollection(collection.id)
    const mapped = raw.map(mapProduct)
    const picks = pickCollectionOgProducts(mapped, collection.handle, 3)
    const loaded = await Promise.all(picks.map((p) => collectionThumbDataUrl(p)))
    thumbs = loaded.filter((u): u is string => Boolean(u))
  } catch {}

  if (thumbs.length === 0) {
    try {
      const { products } = await listProducts()
      const fallback = pickCollectionOgProducts(
        products
          .map(mapProduct)
          .filter((p) => p.collectionHandle === collection.handle),
        collection.handle,
        3
      )
      const loaded = await Promise.all(
        fallback.map((p) => collectionThumbDataUrl(p))
      )
      thumbs = loaded.filter((u): u is string => Boolean(u))
    } catch {}
  }

  const thumbKey = thumbs.map((t) => t.slice(0, 48)).join("|")

  return toPng(
    collectionOgMarkup({
      palette,
      title: collection.title,
      tagline: hero.tagline,
      thumbs,
    }),
    `collection:${OG_RENDER_REVISION.collection}:${handle}:${thumbKey}`
  )
}

export async function renderHomeOg(): Promise<Uint8Array> {
  const palette = paletteForTheme("floof")
  return toPng(
    brandOgMarkup({
      palette,
      headline: site.name,
      subline: `${site.tagline} ${site.description}`,
      badge: "Southwest Florida",
    }),
    `home:${OG_RENDER_REVISION.home}`
  )
}

export async function renderLinksOg(): Promise<Uint8Array> {
  const palette = paletteForTheme("floof")
  return toPng(
    brandOgMarkup({
      palette,
      headline: "Link in bio",
      subline:
        "Shop Dogs, Reads, Desk, Florida Floofs & fresh drops — printed when you order.",
      badge: site.name,
    }),
    "links"
  )
}

export async function renderStoreOg(): Promise<Uint8Array> {
  const palette = paletteForTheme("floof")
  return toPng(
    brandOgMarkup({
      palette,
      headline: "Shop all",
      subline: "Mugs, stickers, tees & hoodies — witty goods from the Floof press.",
      badge: "Free US shipping $75+",
    }),
    "store"
  )
}

export async function renderDefaultOg(): Promise<Uint8Array> {
  const palette = paletteForTheme("floof")
  return toPng(
    brandOgMarkup({
      palette,
      headline: site.name,
      subline: site.description,
    }),
    "default"
  )
}

export type OgRoute =
  | { kind: "product"; handle: string }
  | { kind: "collection"; handle: string }
  | { kind: "home" }
  | { kind: "links" }
  | { kind: "store" }
  | { kind: "default" }

export function parseOgPath(path: string): OgRoute | null {
  const segments = path.replace(/^\//, "").replace(/\.png$/i, "").split("/").filter(Boolean)
  if (segments.length === 0) return null
  if (segments.length === 1) {
    const single = segments[0].toLowerCase()
    if (single === "home") return { kind: "home" }
    if (single === "links") return { kind: "links" }
    if (single === "store") return { kind: "store" }
    if (single === "default") return { kind: "default" }
    return null
  }
  if (segments.length === 2) {
    const [kind, handle] = segments
    if (kind === "product" && handle) return { kind: "product", handle }
    if (kind === "collection" && handle) return { kind: "collection", handle }
  }
  return null
}

export async function renderOgRoute(route: OgRoute): Promise<Uint8Array | null> {
  switch (route.kind) {
    case "product":
      return renderProductOg(route.handle)
    case "collection":
      return renderCollectionOg(route.handle)
    case "home":
      return renderHomeOg()
    case "links":
      return renderLinksOg()
    case "store":
      return renderStoreOg()
    case "default":
      return renderDefaultOg()
    default:
      return null
  }
}
