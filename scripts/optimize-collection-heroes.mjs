#!/usr/bin/env node
/**
 * Build responsive AVIF/WebP hero images from design-import or public/collections sources.
 * design-import/{dogs,reads,desk}/assets/hero.{jpg,png} → public/collections/{id}/hero-{w}.{webp,avif}
 */
import { existsSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import sharp from "sharp"

const ROOT = new URL("..", import.meta.url).pathname
const WIDTHS = [640, 960, 1280, 1920]
const THEMES = ["dogs", "reads", "desk"]

function findSource(theme) {
  const candidates = [
    join(ROOT, "design-import", theme, "assets", "hero.jpg"),
    join(ROOT, "design-import", theme, "assets", "hero.png"),
    join(ROOT, "public", "collections", theme, "hero-source.jpg"),
    join(ROOT, "public", "collections", theme, "hero-source.png"),
  ]
  return candidates.find((p) => existsSync(p))
}

async function emitResponsive(theme, inputPath) {
  const outDir = join(ROOT, "public", "collections", theme)
  mkdirSync(outDir, { recursive: true })
  const base = join(outDir, "hero")
  for (const w of WIDTHS) {
    const resized = sharp(inputPath).resize(w, null, { withoutEnlargement: true })
    await resized.clone().webp({ quality: 82 }).toFile(`${base}-${w}.webp`)
    await resized.clone().avif({ quality: 65 }).toFile(`${base}-${w}.avif`)
  }
  console.log(`[heroes] ${theme}: wrote ${WIDTHS.length} sizes → public/collections/${theme}/`)
}

async function synthesizePlaceholder(theme) {
  const palettes = {
    dogs: { a: "#e8d4b8", b: "#c9784f", c: "#f5efe4" },
    reads: { a: "#e8dcc8", b: "#5c3d2e", c: "#f0e6d6" },
    desk: { a: "#2a3344", b: "#5ee0b0", c: "#1c2230" },
  }
  const { a, b, c } = palettes[theme]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1280" viewBox="0 0 1920 1280">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${a}"/>
        <stop offset="55%" stop-color="${c}"/>
        <stop offset="100%" stop-color="${b}" stop-opacity="0.35"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="1280" fill="url(#g)"/>
  </svg>`
  const buf = await sharp(Buffer.from(svg)).png().toBuffer()
  return buf
}

async function main() {
  for (const theme of THEMES) {
    const src = findSource(theme)
    if (src) {
      await emitResponsive(theme, src)
      continue
    }
    const placeholder = await synthesizePlaceholder(theme)
    const tmp = join(ROOT, "public", "collections", theme, "hero-source.png")
    mkdirSync(dirname(tmp), { recursive: true })
    await sharp(placeholder).toFile(tmp)
    await emitResponsive(theme, tmp)
    console.warn(`[heroes] ${theme}: no design-import source; using synthesized placeholder`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
