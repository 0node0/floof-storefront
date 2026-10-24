/**
 * Smoke tests for PDP shelf + gallery helpers (no Medusa network).
 * Run: npx tsx scripts/verify-pdp-fixes.ts
 */
import { relatedProductsForShelf } from "../src/lib/productPageTheme"
import { productGalleryImages } from "../src/lib/productCard"
import { productCarePanel } from "../src/lib/productCare"
import type { FloofProduct } from "../src/lib/product"

function mockFlorida(
  slug: string,
  category: FloofProduct["category"]
): FloofProduct {
  return {
    id: slug,
    slug,
    name: slug,
    phrase: slug,
    description: "",
    price: 20,
    category,
    colors: [],
    sizes: [],
    images: [`https://example.com/${slug}-mockup.png`, `https://example.com/${slug}-flat.png`],
    image: `https://example.com/${slug}-mockup.png`,
    collectionHandle: "florida-floofs",
  }
}

const all = [
  mockFlorida("florida-floof-manatee-mug", "mugs"),
  mockFlorida("florida-floof-manatee-tee", "tees"),
  mockFlorida("florida-floof-bottlenose-dolphin-mug", "mugs"),
  mockFlorida("florida-floof-bottlenose-dolphin-tee", "tees"),
  mockFlorida("florida-floof-burrowing-owl-sticker", "stickers"),
  mockFlorida("florida-floof-alligator-mug", "mugs"),
  mockFlorida("florida-floof-roseate-spoonbill-tee", "tees"),
]

const dolphinMug = all[2]
const related = relatedProductsForShelf(
  all,
  dolphinMug,
  "floridaFloofs",
  "florida-floofs"
)

const slugs = related.map((p) => p.slug)
const animals = slugs.map((s) => s.match(/florida-floof-([a-z0-9-]+)-/)?.[1])

if (slugs.includes(dolphinMug.slug)) {
  throw new Error("related shelf includes current product")
}
if (new Set(animals).size !== animals.filter(Boolean).length) {
  throw new Error(`duplicate animals in shelf: ${animals.join(", ")}`)
}
const dolphinAgain = relatedProductsForShelf(
  all,
  mockFlorida("florida-floof-manatee-mug", "mugs"),
  "floridaFloofs",
  "florida-floofs"
)
if (dolphinAgain.map((p) => p.slug).join() === slugs.join()) {
  throw new Error("shelf did not rotate for different product")
}

const teeGallery = productGalleryImages(mockFlorida("florida-floof-manatee-tee", "tees"))
if (teeGallery[0] !== `https://example.com/florida-floof-manatee-tee-mockup.png`) {
  throw new Error(`tee gallery should keep mockup first, got ${teeGallery[0]}`)
}

if (!productCarePanel(mockFlorida("x-mug", "mugs")).show) {
  throw new Error("mug care panel should show")
}
if (productCarePanel(mockFlorida("x-sticker", "stickers")).paragraphs[0].includes("vinyl")) {
  // ok
} else {
  throw new Error("sticker care copy missing")
}

console.log("verify-pdp-fixes: ok", { dolphinShelf: slugs, manateeShelf: dolphinAgain.map((p) => p.slug) })
