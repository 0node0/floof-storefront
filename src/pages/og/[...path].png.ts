import type { APIRoute } from "astro"
import { OG_CACHE_CONTROL } from "@/lib/og/constants"
import { parseOgPath, renderOgRoute } from "@/lib/og/render"

export const prerender = false

export const GET: APIRoute = async ({ params }) => {
  const raw = params.path
  const path = Array.isArray(raw) ? raw.join("/") : raw ?? ""
  const route = parseOgPath(path)
  if (!route) {
    return new Response("Not found", { status: 404 })
  }

  const png = await renderOgRoute(route)
  if (!png) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(Buffer.from(png), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": OG_CACHE_CONTROL,
    },
  })
}
