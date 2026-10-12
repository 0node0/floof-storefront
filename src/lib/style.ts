import type { MedusaCollection } from "./medusa"

export interface StyleLanding {
  handle: string
  title: string
  tagline: string
  description: string
  heroCopy: string
  accentColor?: string
  secondaryColor?: string
  seoTitle?: string
  seoDescription?: string
}

function metaString(
  metadata: Record<string, unknown> | undefined,
  ...keys: string[]
): string | undefined {
  if (!metadata) return undefined
  for (const key of keys) {
    const value = metadata[key]
    if (typeof value === "string" && value.trim()) return value.trim()
  }
  return undefined
}

export function parseStyleCollection(collection: MedusaCollection): StyleLanding {
  const md = collection.metadata
  const title = metaString(md, "title", "landing_title") ?? collection.title
  const tagline =
    metaString(md, "tagline") ?? "Ink first. Clothes second."
  const description =
    metaString(md, "description") ??
    `Shop the ${title} collection — witty Southwest Florida apparel, printed fresh when you order.`
  const heroCopy =
    metaString(md, "hero_copy", "heroCopy") ?? description

  return {
    handle: collection.handle,
    title,
    tagline,
    description,
    heroCopy,
    accentColor: metaString(md, "accent_color", "accentColor"),
    secondaryColor: metaString(md, "secondary_color", "secondaryColor"),
    seoTitle: metaString(md, "seo_title", "seoTitle"),
    seoDescription: metaString(md, "seo_description", "seoDescription"),
  }
}
