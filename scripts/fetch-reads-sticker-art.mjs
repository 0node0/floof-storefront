/**
 * One-off maintainer script: download Printful default-file preview_url for reads stickers.
 * Not used at runtime or during `npm run build`. Requires PRINTFUL_API_TOKEN in env.
 *
 *   PRINTFUL_API_TOKEN=... node scripts/fetch-reads-sticker-art.mjs
 */
import { writeFile, mkdir } from "node:fs/promises"
import path from "node:path"

const OUT_DIR = path.join("public", "collections", "reads", "sticker-art")

const STICKERS = [
  {
    file: "bookmark-whatever-was-nearest.png",
    syncVariantId: 5568720057,
  },
  {
    file: "dog-ear-club.png",
    syncVariantId: 5568723279,
  },
  {
    file: "i-prefer-hardcover.png",
    syncVariantId: 5568729495,
  },
  {
    file: "performatively-reading.png",
    syncVariantId: 5577676392,
  },
]

const token = process.env.PRINTFUL_API_TOKEN || process.env.PRINTFUL_API_KEY
if (!token) {
  console.error("Set PRINTFUL_API_TOKEN (or PRINTFUL_API_KEY) to run this script.")
  process.exit(1)
}

async function printFilePreviewUrl(syncVariantId) {
  const res = await fetch(
    `https://api.printful.com/store/variants/${syncVariantId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) {
    throw new Error(`Printful ${syncVariantId}: ${res.status} ${await res.text()}`)
  }
  const body = await res.json()
  const files = body.result?.files ?? []
  const defaultFile = files.find((f) => f.type === "default")
  const url =
    defaultFile?.preview_url || defaultFile?.thumbnail_url || defaultFile?.url
  if (!url) throw new Error(`No default file preview for variant ${syncVariantId}`)
  return url
}

await mkdir(OUT_DIR, { recursive: true })

for (const sticker of STICKERS) {
  const previewUrl = await printFilePreviewUrl(sticker.syncVariantId)
  const imgRes = await fetch(previewUrl)
  if (!imgRes.ok) {
    throw new Error(`Download failed ${previewUrl}: ${imgRes.status}`)
  }
  const buf = Buffer.from(await imgRes.arrayBuffer())
  const dest = path.join(OUT_DIR, sticker.file)
  await writeFile(dest, buf)
  console.log(`Wrote ${dest} (${buf.length} bytes) from ${previewUrl}`)
}
