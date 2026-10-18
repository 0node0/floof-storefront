import { site } from "@/lib/site"
import type { FloofProduct } from "@/lib/product"
import {
  OG_RENDER_REVISION,
  contentRevisionStamp,
  ogBuildHash,
  ogVersionToken,
} from "./revision"
import {
  OG_DEFAULT_PATH,
  OG_HOME_PATH,
  OG_LINKS_PATH,
  OG_STORE_PATH,
  ogCollectionPath,
  ogImageAbsoluteUrl,
  ogProductPath,
} from "./urls"

export function ogBrandSocialVersion(
  kind: keyof Pick<
    typeof OG_RENDER_REVISION,
    "home" | "links" | "store" | "default"
  >
): string {
  return ogVersionToken(OG_RENDER_REVISION[kind], ogBuildHash())
}

export function ogProductSocialVersion(product: FloofProduct): string {
  return ogVersionToken(
    OG_RENDER_REVISION.product,
    ogBuildHash(),
    contentRevisionStamp(product.updatedAt ?? product.createdAt)
  )
}

export function ogCollectionSocialVersion(
  handle: string,
  updatedAt?: string
): string {
  return ogVersionToken(
    OG_RENDER_REVISION.collection,
    ogBuildHash(),
    handle,
    contentRevisionStamp(updatedAt)
  )
}

export function ogProductImageUrl(product: FloofProduct): string {
  return ogImageAbsoluteUrl(
    ogProductPath(product.slug),
    ogProductSocialVersion(product)
  )
}

export function ogCollectionImageUrl(
  handle: string,
  updatedAt?: string
): string {
  return ogImageAbsoluteUrl(
    ogCollectionPath(handle),
    ogCollectionSocialVersion(handle, updatedAt)
  )
}

export function ogHomeImageUrl(): string {
  return ogImageAbsoluteUrl(
    OG_HOME_PATH,
    ogBrandSocialVersion("home")
  )
}

export function ogLinksImageUrl(): string {
  return ogImageAbsoluteUrl(
    OG_LINKS_PATH,
    ogBrandSocialVersion("links")
  )
}

export function ogStoreImageUrl(): string {
  return ogImageAbsoluteUrl(
    OG_STORE_PATH,
    ogBrandSocialVersion("store")
  )
}

export function defaultOgImageUrlVersioned(): string {
  return ogImageAbsoluteUrl(
    OG_DEFAULT_PATH,
    ogBrandSocialVersion("default")
  )
}
