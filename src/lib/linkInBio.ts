import type { FloofProduct } from "./product"

export type LinkInBioSource = "instagram" | "x"

const SOURCE_ALIASES: Record<string, LinkInBioSource> = {
  ig: "instagram",
  instagram: "instagram",
  x: "x",
  twitter: "x",
}

/** Resolve `?src=` on /links (e.g. ig → instagram, x → x). */
export function parseLinkInBioSource(
  searchParams: URLSearchParams
): LinkInBioSource | null {
  const raw = searchParams.get("src")?.trim().toLowerCase()
  if (!raw) return null
  return SOURCE_ALIASES[raw] ?? null
}

function isInternalPath(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//")
}

/** Append UTM params to same-site paths when visitor arrived via ?src=. */
export function withLinkInBioTracking(
  href: string,
  source: LinkInBioSource | null
): string {
  if (!source || !isInternalPath(href)) return href

  const [pathAndQuery, hash = ""] = href.split("#")
  const qIndex = pathAndQuery.indexOf("?")
  const pathname = qIndex === -1 ? pathAndQuery : pathAndQuery.slice(0, qIndex)
  const existing = qIndex === -1 ? "" : pathAndQuery.slice(qIndex + 1)
  const params = new URLSearchParams(existing)
  params.set("utm_source", source)
  params.set("utm_medium", "social")
  params.set("utm_campaign", "link_in_bio")
  const query = params.toString()
  const hashSuffix = hash ? `#${hash}` : ""
  return `${pathname}?${query}${hashSuffix}`
}

export const LINK_IN_BIO_SOCIAL = {
  instagram: "https://instagram.com/floof.space",
  x: "https://x.com/floofdotspace",
} as const

/** Newest live listings first (drops [WIP] from featured picks). */
export function pickFeaturedLinkProducts(
  products: FloofProduct[],
  count = 4
): FloofProduct[] {
  const live = products.filter((p) => !p.isWip)
  return live.slice(0, count)
}

export function sortMedusaProductsNewest(
  products: { created_at?: string; handle: string }[]
): typeof products {
  return [...products].sort((a, b) => {
    const ta = a.created_at ? Date.parse(a.created_at) : 0
    const tb = b.created_at ? Date.parse(b.created_at) : 0
    if (tb !== ta) return tb - ta
    return b.handle.localeCompare(a.handle)
  })
}
