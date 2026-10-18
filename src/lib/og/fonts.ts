import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import type { Font } from "satori"

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..")

function readFont(relativePath: string): ArrayBuffer {
  const buf = readFileSync(join(packageRoot, relativePath))
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
}

let cachedFonts: Font[] | null = null

export function getOgFonts(): Font[] {
  if (cachedFonts) return cachedFonts
  cachedFonts = [
    {
      name: "Archivo Black",
      data: readFont(
        "node_modules/@fontsource/archivo-black/files/archivo-black-latin-400-normal.woff"
      ),
      weight: 400,
      style: "normal",
    },
    {
      name: "IBM Plex Mono",
      data: readFont(
        "node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff"
      ),
      weight: 400,
      style: "normal",
    },
    {
      name: "IBM Plex Mono",
      data: readFont(
        "node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff"
      ),
      weight: 600,
      style: "normal",
    },
  ]
  return cachedFonts
}
