#!/usr/bin/env node
/**
 * Responsive WebP/AVIF for Florida Floofs sticker art (catalog + hero strip).
 * Source: public/sticker-art/florida-floof-<animal>-sticker-art.png
 */
import { existsSync } from "node:fs"
import { join } from "node:path"
import sharp from "sharp"

const ROOT = new URL("..", import.meta.url).pathname
const ART_DIR = join(ROOT, "public", "sticker-art")
const WIDTHS = [400, 800]

const ANIMALS = [
  "alligator",
  "bottlenose-dolphin",
  "brown-pelican",
  "burrowing-owl",
  "florida-panther",
  "gopher-tortoise",
  "loggerhead",
  "manatee",
  "river-otter",
  "roseate-spoonbill",
  "sandhill-crane",
  "snowy-egret",
]

async function emit(animal) {
  const base = join(ART_DIR, `florida-floof-${animal}-sticker-art`)
  const png = `${base}.png`
  if (!existsSync(png)) {
    console.error(`[florida-stickers] missing ${png}`)
    process.exit(1)
  }
  for (const w of WIDTHS) {
    const resized = sharp(png).resize(w, null, { withoutEnlargement: true, fit: "inside" })
    await resized.clone().webp({ quality: 82, effort: 4 }).toFile(`${base}-${w}.webp`)
    await resized.clone().avif({ quality: 62, effort: 4 }).toFile(`${base}-${w}.avif`)
  }
  console.log(`[florida-stickers] ${animal}: ${WIDTHS.join(", ")}w`)
}

async function main() {
  for (const animal of ANIMALS) {
    await emit(animal)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
