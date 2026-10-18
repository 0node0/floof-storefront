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
import { mapProduct } from "@/lib/product"
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
import { ogProductSourceUrl } from "./productImage"
import { resolveOgProductSourceUrl } from "./resolveSource"

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
  const src = isSticker
    ? await resolveOgProductSourceUrl(product)
    : ogProductSourceUrl(product)
  const prepared = await prepareOgProductArt(src, { forceTrim: isSticker })
  const imageDataUrl =
    prepared?.dataUrl ?? (await loadImageDataUrl(src))
  const priceLabel = formatPrice(Math.round(product.price * 100))
  const typeLabel = productTypeSizeLabel(product)

  return toPng(
    productOgMarkup({
      palette,
      title: product.name,
      priceLabel,
      typeLabel,
      imageDataUrl,
      artWidth: prepared?.width,
      artHeight: prepared?.height,
    }),
    `product:v7:${handle}:${src}:${themeId}`
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
    const mapped = raw.map(mapProduct).filter((p) => !p.isWip)
    const picks = mapped.slice(0, 4)
    const loaded = await Promise.all(
      picks.map(async (p) => {
        const sticker =
          p.category === "stickers" || /sticker/i.test(p.name)
        const url = sticker
          ? await resolveOgProductSourceUrl(p)
          : ogProductSourceUrl(p)
        const art = await prepareOgProductArt(url, { forceTrim: sticker })
        return art?.dataUrl ?? (await loadImageDataUrl(url))
      })
    )
    thumbs = loaded.filter((u): u is string => Boolean(u))
  } catch {}

  if (thumbs.length === 0) {
    try {
      const { products } = await listProducts()
      const fallback = products
        .map(mapProduct)
        .filter((p) => p.collectionHandle === collection.handle)
        .slice(0, 4)
      const urls = fallback.map((p) => ogProductSourceUrl(p))
      const loaded = await Promise.all(urls.map((u) => loadImageDataUrl(u)))
      thumbs = loaded.filter((u): u is string => Boolean(u))
    } catch {}
  }

  return toPng(
    collectionOgMarkup({
      palette,
      title: collection.title,
      tagline: hero.tagline,
      thumbs,
    }),
    `collection:v5:${handle}:${thumbs.length}`
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
    "home"
  )
}

export async function renderLinksOg(): Promise<Uint8Array> {
  const palette = paletteForTheme("floof")
  return toPng(
    brandOgMarkup({
      palette,
      headline: "Link in bio",
      subline: "Shop Dogs, Reads, Desk & fresh drops — printed when you order.",
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
