import { site } from "@/lib/site"
import { OG_HEIGHT, OG_WIDTH } from "./constants"

export function ogImageAbsoluteUrl(path: string, version?: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  const url = new URL(normalized, site.url)
  if (version) {
    url.searchParams.set("v", version)
  }
  return url.href
}

export function ogProductPath(handle: string): string {
  return `/og/product/${encodeURIComponent(handle)}.png`
}

export function ogCollectionPath(handle: string): string {
  return `/og/collection/${encodeURIComponent(handle)}.png`
}

export const OG_HOME_PATH = "/og/home.png"
export const OG_LINKS_PATH = "/og/links.png"
export const OG_DEFAULT_PATH = "/og/default.png"
export const OG_STORE_PATH = "/og/store.png"

/** Prefer {@link defaultOgImageUrlVersioned} from `./socialUrl` for meta tags. */
export function defaultOgImageUrl(): string {
  return ogImageAbsoluteUrl(OG_DEFAULT_PATH)
}

export const OG_IMAGE_DIMENSIONS = {
  width: OG_WIDTH,
  height: OG_HEIGHT,
} as const
