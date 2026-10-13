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
const HERO_BY_THEME = {
  dogs: "hero-lab-mug.jpg",
  reads: "hero-bookmark-mug.jpg",
  desk: "hero-camera-off-club-mug.jpg",
}

const THEMES = ["dogs", "reads", "desk"]

function findSource(theme) {
  const named = HERO_BY_THEME[theme]
  const candidates = [
    join(ROOT, "design-import", "categories", theme, "assets", named),
    join(ROOT, "public", "collections", theme, named),
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

async function main() {
  for (const theme of THEMES) {
    const src = findSource(theme)
    if (!src) {
      console.error(
        `[heroes] ${theme}: missing hero source (expected design-import/categories/${theme}/assets/${HERO_BY_THEME[theme]})`
      )
      process.exit(1)
    }
    await emitResponsive(theme, src)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
