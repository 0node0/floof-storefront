import { collectionPath } from "./collections"

export interface FeaturedCollectionLink {
  href: string
  label: string
  handle: string
}

/** Nav / footer order when Medusa collections are still syncing. */
export const FEATURED_COLLECTION_LINKS: FeaturedCollectionLink[] = [
  { handle: "dogs", label: "Dogs", href: collectionPath("dogs") },
  { handle: "reads", label: "Reads", href: collectionPath("reads") },
  { handle: "desk", label: "Desk", href: collectionPath("desk") },
  {
    handle: "florida-floofs",
    label: "Florida Floofs",
    href: collectionPath("florida-floofs"),
  },
]

export function mergeFeaturedCollectionLinks(
  fromApi: FeaturedCollectionLink[]
): FeaturedCollectionLink[] {
  const byHandle = new Map<string, FeaturedCollectionLink>()
  for (const link of fromApi) {
    byHandle.set(link.handle, link)
  }
  for (const featured of FEATURED_COLLECTION_LINKS) {
    if (!byHandle.has(featured.handle)) {
      byHandle.set(featured.handle, featured)
    }
  }
  const order = FEATURED_COLLECTION_LINKS.map((f) => f.handle)
  const extras = [...byHandle.keys()].filter((h) => !order.includes(h)).sort()
  return [...order, ...extras]
    .map((handle) => byHandle.get(handle))
    .filter((link): link is FeaturedCollectionLink => Boolean(link))
}
