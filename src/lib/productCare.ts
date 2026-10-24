import type { FloofProduct } from "./product"

export interface ProductCarePanel {
  show: boolean
  title: string
  paragraphs: string[]
}

const APPAREL_CARE: ProductCarePanel = {
  show: true,
  title: "Materials & care",
  paragraphs: [
    "Soft retail blanks (tees & hoodies). Exact fabric depends on the style you pick.",
    "Machine wash cold, inside out. Tumble dry low. Do not iron directly on the print.",
  ],
}

const MUG_CARE: ProductCarePanel = {
  show: true,
  title: "Materials & care",
  paragraphs: [
    "White glossy ceramic mug. Capacity and dimensions depend on the style you pick.",
    "Hand wash recommended for longest print life. Dishwasher safe on the top rack; avoid abrasive scrubbers on the design.",
  ],
}

const STICKER_CARE: ProductCarePanel = {
  show: true,
  title: "Materials & care",
  paragraphs: [
    "Kiss-cut vinyl sticker with a durable matte finish.",
    "Clean the surface before applying. Press firmly from the center outward; avoid dishwashers and prolonged soaking.",
  ],
}

/** PDP accordion copy — hidden when we have nothing meaningful to say. */
export function productCarePanel(product: FloofProduct): ProductCarePanel {
  switch (product.category) {
    case "tees":
    case "hoodies":
      return APPAREL_CARE
    case "mugs":
      return MUG_CARE
    case "stickers":
      return STICKER_CARE
    default:
      return { show: false, title: "Materials & care", paragraphs: [] }
  }
}
