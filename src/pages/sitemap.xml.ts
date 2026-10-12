import type { APIRoute } from "astro"
import { listCollections, listProducts } from "@/lib/medusa"
import { site } from "@/lib/site"

const STATIC_PATHS = [
  "",
  "/store",
  "/styles",
  "/about",
  "/contact",
  "/shipping-returns",
  "/privacy",
  "/terms",
]

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function urlEntry(loc: string, lastmod?: string): string {
  const lastmodTag = lastmod ? `<lastmod>${lastmod}</lastmod>` : ""
  return `<url><loc>${escapeXml(loc)}</loc>${lastmodTag}</url>`
}

export const GET: APIRoute = async () => {
  const base = site.url.replace(/\/$/, "")
  const today = new Date().toISOString().slice(0, 10)
  const urls: string[] = []

  for (const path of STATIC_PATHS) {
    urls.push(urlEntry(`${base}${path || "/"}`, today))
  }

  try {
    const { collections } = await listCollections()
    for (const collection of collections) {
      if (collection.handle) {
        urls.push(urlEntry(`${base}/s/${collection.handle}`, today))
      }
    }
  } catch {
    // Medusa unavailable — static URLs still published
  }

  try {
    const { products } = await listProducts()
    for (const product of products) {
      if (product.handle) {
        urls.push(urlEntry(`${base}/products/${product.handle}`, today))
      }
    }
  } catch {
    // omit product URLs when API is down
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
