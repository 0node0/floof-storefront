import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { site } from "@/lib/site"

const mimeForExt: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  svg: "image/svg+xml",
}

function toDataUrl(bytes: Buffer, mime: string): string {
  return `data:${mime};base64,${bytes.toString("base64")}`
}

function readPublicFile(pathname: string): string | null {
  const clean = pathname.split("?")[0]
  const filePath = join(process.cwd(), "public", clean.replace(/^\//, ""))
  if (!existsSync(filePath)) return null
  const ext = filePath.split(".").pop()?.toLowerCase() ?? "png"
  const mime = mimeForExt[ext] ?? "image/png"
  return toDataUrl(readFileSync(filePath), mime)
}

const remoteCache = new Map<string, string>()

export async function loadImageDataUrl(src: string): Promise<string | null> {
  if (!src) return null
  if (src.startsWith("data:")) return src

  if (src.startsWith("/")) {
    const local = readPublicFile(src)
    if (local) return local
  }

  const absolute = src.startsWith("http")
    ? src
    : new URL(src, site.url).href

  const cached = remoteCache.get(absolute)
  if (cached) return cached

  try {
    const res = await fetch(absolute, {
      headers: { Accept: "image/*" },
      signal: AbortSignal.timeout(12_000),
    })
    if (!res.ok) return null
    const contentType = res.headers.get("content-type") ?? "image/png"
    const buf = Buffer.from(await res.arrayBuffer())
    const dataUrl = toDataUrl(buf, contentType.split(";")[0])
    remoteCache.set(absolute, dataUrl)
    return dataUrl
  } catch {
    return null
  }
}
