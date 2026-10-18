/**
 * Audit apparel OG art vs text-fallback using live Medusa catalog.
 * Usage: PUBLIC_MEDUSA_URL=... PUBLIC_MEDUSA_PK=... npx tsx scripts/audit-apparel-og.ts
 */
import { mapProduct } from "../src/lib/product"
import { isApparelProduct } from "../src/lib/og/apparelProduct"
import { resolveApparelOg } from "../src/lib/og/apparelSource"

const MEDUSA_URL = process.env.PUBLIC_MEDUSA_URL ?? "https://api.floof.space"
const MEDUSA_PK = process.env.PUBLIC_MEDUSA_PK ?? ""

async function listAllProducts() {
  const res = await fetch(`${MEDUSA_URL}/store/products?limit=100`, {
    headers: { "x-publishable-api-key": MEDUSA_PK },
  })
  if (!res.ok) throw new Error(`Medusa ${res.status}`)
  const data = (await res.json()) as { products: unknown[] }
  return data.products
}

async function main() {
  const raw = await listAllProducts()
  const apparel = raw.map((p) => mapProduct(p as Parameters<typeof mapProduct>[0])).filter(isApparelProduct)

  const art: string[] = []
  const text: string[] = []

  for (const product of apparel.sort((a, b) => a.slug.localeCompare(b.slug))) {
    const resolution = await resolveApparelOg(product)
    if (resolution.mode === "art") {
      art.push(
        `${product.slug} (coverage ${resolution.coverage?.toFixed(3) ?? "?"})`
      )
    } else {
      text.push(product.slug)
    }
  }

  console.log("=== Apparel OG audit ===")
  console.log(`Art (${art.length}):`)
  for (const line of art) console.log(`  - ${line}`)
  console.log(`Text fallback (${text.length}):`)
  for (const line of text) console.log(`  - ${line}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
