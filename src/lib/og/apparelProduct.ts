import type { FloofProduct } from "@/lib/product"

export function isApparelProduct(product: FloofProduct): boolean {
  if (product.category === "tees" || product.category === "hoodies") {
    return true
  }
  return /-(tee|hoodie)$/.test(product.slug)
}
