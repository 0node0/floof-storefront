import type { MedusaCollection } from "./medusa"
import type { FloofProduct } from "./product"
import { productTypeOrder } from "./product"

export function collectionPath(handle: string): string {
  return `/${handle}`
}

const defaultTaglines: Record<string, string> = {
  desk: "Work-from-home wit for the camera-off crowd.",
  reads: "For dog-eared pages and hardcover loyalty.",
  pets: "Apparel and goods for the professional snugglers.",
  dogs: "Apparel and goods for the professional snugglers.",
}

export function collectionHeroCopy(collection: MedusaCollection) {
  const meta = collection.metadata ?? {}
  const tagline =
    (typeof meta.tagline === "string" && meta.tagline.trim()) ||
    defaultTaglines[collection.handle] ||
    "Soft blanks, sharp wit — printed fresh when you order."

  const seoTitle =
    (typeof meta.seo_title === "string" && meta.seo_title.trim()) ||
    collection.title

  const seoDescription =
    (typeof meta.seo_description === "string" && meta.seo_description.trim()) ||
    `Shop the ${collection.title} collection at Floof — witty SW Florida goods, printed on demand.`

  return {
    title: collection.title,
    tagline,
    seoTitle,
    seoDescription,
  }
}

export function availableProductTypes(products: FloofProduct[]): string[] {
  return productTypeOrder.filter((type) =>
    products.some((p) => p.category === type)
  )
}

export function filterByProductType(
  products: FloofProduct[],
  typeParam: string
): FloofProduct[] {
  if (!typeParam || typeParam === "all") return products
  return products.filter((p) => p.category === typeParam)
}
