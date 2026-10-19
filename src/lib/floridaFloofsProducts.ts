import type { MedusaCollection } from "./medusa"
import { getCollectionByHandle, listProducts, listProductsByCollection } from "./medusa"
import { mapProduct, type FloofProduct } from "./product"
import {
  FLORIDA_FLOOFS_COLLECTION_HANDLE,
  isFloridaFloofProductSlug,
} from "./floridaFloofs"

export const FLORIDA_FLOOFS_SYNTHETIC_COLLECTION: MedusaCollection = {
  id: "florida-floofs-synthetic",
  handle: FLORIDA_FLOOFS_COLLECTION_HANDLE,
  title: "Florida Floofs",
  metadata: {
    theme: "floridaFloofs",
    tagline:
      "Twelve Southwest Florida natives in flower crowns — stickers, tees and mugs for Gulf-coast locals.",
    seo_title: "Florida Floofs — SW Florida native animal stickers, tees & mugs",
    seo_description:
      "Manatees, spoonbills, panthers and more — flower-crown art for Southwest Florida natives. Stickers, tees and mugs printed fresh when you order.",
  },
}

export async function loadFloridaFloofsCollection(): Promise<MedusaCollection> {
  try {
    const { collection } = await getCollectionByHandle(
      FLORIDA_FLOOFS_COLLECTION_HANDLE
    )
    if (collection) return collection
  } catch {}
  return FLORIDA_FLOOFS_SYNTHETIC_COLLECTION
}

function isFloridaFloofProduct(product: FloofProduct): boolean {
  if (product.collectionHandle === FLORIDA_FLOOFS_COLLECTION_HANDLE) {
    return true
  }
  return isFloridaFloofProductSlug(product.slug)
}

export async function loadFloridaFloofsProducts(): Promise<FloofProduct[]> {
  try {
    const { collection } = await getCollectionByHandle(
      FLORIDA_FLOOFS_COLLECTION_HANDLE
    )
    if (collection) {
      const { products: raw } = await listProductsByCollection(collection.id)
      return raw.map(mapProduct).filter(isFloridaFloofProduct)
    }
  } catch {}

  try {
    const { products } = await listProducts()
    return products.map(mapProduct).filter(isFloridaFloofProduct)
  } catch {
    return []
  }
}

export function filterFloridaFloofsByAnimal(
  products: FloofProduct[],
  animalParam: string
): FloofProduct[] {
  if (!animalParam || animalParam === "all") return products
  const slug = decodeURIComponent(animalParam).toLowerCase()
  return products.filter((p) => p.slug.includes(`florida-floof-${slug}-`))
}
