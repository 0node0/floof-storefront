import type { MedusaProduct, MedusaVariant } from "./medusa"

export interface FloofProduct {
  id: string
  slug: string
  name: string
  phrase: string
  description: string
  price: number
  category: string
  colors: string[]
  sizes: string[]
  image?: string
  isWip?: boolean
}

/** Map common garment color names → CSS swatches */
export const colorMap: Record<string, string> = {
  Black: "#1A1A2E",
  White: "#FFFFFF",
  "Solid White Blend": "#F7F7F5",
  Navy: "#1B2A4A",
  "Heather Midnight Navy": "#2C3E5A",
  "Heather Sport Dark Navy": "#2A3548",
  "Sport Grey": "#B8B8B8",
  "Dark Heather": "#4A4A4A",
  "Athletic Heather": "#C5C5C5",
  "Heather Red": "#C45C5C",
  Red: "#C62828",
  Coral: "#FF8A65",
  Sand: "#F5E6D3",
  "Ocean Blue": "#4FC3F7",
  "Floof Pink": "#FF6B9D",
  Lime: "#AED581",
  "Sky Blue": "#87CEEB",
  Natural: "#F5F0E8",
  Ash: "#C9C9C9",
}

export function optionValue(v: MedusaVariant, title: string): string | undefined {
  return v.options?.find((o) => o.option?.title?.toLowerCase() === title.toLowerCase())?.value
}

export function mapProduct(p: MedusaProduct): FloofProduct {
  const variants = p.variants || []
  const colors = [
    ...new Set(
      variants
        .map((v) => optionValue(v, "Color"))
        .filter(Boolean) as string[]
    ),
  ]
  const sizes = [
    ...new Set(
      variants
        .map((v) => optionValue(v, "Size"))
        .filter(Boolean) as string[]
    ),
  ]
  // Sort sizes in apparel order
  const sizeOrder = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"]
  sizes.sort((a, b) => {
    const ia = sizeOrder.indexOf(a)
    const ib = sizeOrder.indexOf(b)
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
  })

  const amount = variants[0]?.prices?.[0]?.amount || 0
  return {
    id: p.id,
    slug: p.handle,
    name: p.title,
    phrase: (p.metadata?.phrase as string) || p.title.split(" ").slice(0, 3).join(" "),
    description: p.description || "",
    price: amount / 100,
    category: (p.metadata?.category as string) || "tees",
    colors,
    sizes,
    image: p.images?.[0]?.url || "",
    isWip: p.title.includes("[WIP]"),
  }
}

export const categoryLabels: Record<string, string> = {
  tees: "T-Shirts",
  hoodies: "Hoodies",
  hats: "Hats",
  accessories: "Accessories",
}

export const sizeGuide = {
  tees: {
    title: "T-Shirt Size Guide",
    unit: "inches",
    note: "Unisex fit. Measure a shirt you love and match the chest width.",
    rows: [
      { size: "S", chest: "34–37", length: "28" },
      { size: "M", chest: "38–41", length: "29" },
      { size: "L", chest: "42–45", length: "30" },
      { size: "XL", chest: "46–49", length: "31" },
      { size: "2XL", chest: "50–53", length: "32" },
      { size: "3XL", chest: "54–57", length: "33" },
    ],
  },
  hoodies: {
    title: "Hoodie Size Guide",
    unit: "inches",
    note: "Relaxed unisex fit. If between sizes, size up for layering.",
    rows: [
      { size: "S", chest: "38–41", length: "27" },
      { size: "M", chest: "42–45", length: "28" },
      { size: "L", chest: "46–49", length: "29" },
      { size: "XL", chest: "50–53", length: "30" },
      { size: "2XL", chest: "54–57", length: "31" },
    ],
  },
}
