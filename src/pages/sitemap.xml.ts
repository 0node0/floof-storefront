import type { APIRoute } from "astro";
import { collectionPath } from "@/lib/collections";
import { listCollections, listProducts } from "@/lib/medusa";
import { site } from "@/lib/site";

export const prerender = false;

const staticPaths = [
  "/",
  "/store",
  "/about",
  "/contact",
  "/shipping-returns",
  "/privacy",
  "/terms",
];

function urlEntry(loc: string, lastmod?: string): string {
  const lastmodTag = lastmod
    ? `\n    <lastmod>${lastmod}</lastmod>`
    : "";
  return `  <url>
    <loc>${loc}</loc>${lastmodTag}
    <changefreq>weekly</changefreq>
  </url>`;
}

export const GET: APIRoute = async () => {
  const urls: string[] = staticPaths.map((path) =>
    urlEntry(new URL(path, site.url).href)
  );

  try {
    const { collections } = await listCollections();
    for (const collection of collections) {
      urls.push(
        urlEntry(new URL(collectionPath(collection.handle), site.url).href)
      );
    }
  } catch {}

  try {
    const { products } = await listProducts();
    for (const product of products) {
      urls.push(
        urlEntry(new URL(`/products/${product.handle}`, site.url).href)
      );
    }
  } catch {}

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
